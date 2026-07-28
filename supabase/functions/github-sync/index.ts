import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders, createErrorResponse, createSuccessResponse } from './utils/errors.ts';
import { validateSyncPayload } from './utils/validate.ts';
import { parseOwnerAndRepo } from './utils/normalize.ts';
import { fetchRepositoryDetails } from './services/repository.ts';
import { fetchLatestRelease } from './services/release.ts';
import { fetchLanguages } from './services/languages.ts';
import { fetchTopics } from './services/topics.ts';
import { fetchOpenPullRequestsCount } from './services/pullRequests.ts';

serve(async (req: Request) => {
  // CORS Preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const rawBody = await req.json().catch(() => ({}));
    const validation = validateSyncPayload(rawBody);

    if (!validation.isValid || !validation.projectId) {
      return createErrorResponse(validation.error || 'Invalid request payload.', 400);
    }

    const { projectId } = validation;

    // Initialize Supabase Admin Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Look up existing repository record or project repository configuration
    let repoUrl = validation.repoUrl;
    if (!repoUrl) {
      const { data: existingRepo } = await supabase
        .from('github_repositories')
        .select('repo_url')
        .eq('project_id', projectId)
        .maybeSingle();

      if (existingRepo?.repo_url) {
        repoUrl = existingRepo.repo_url;
      }
    }

    if (!repoUrl) {
      return createErrorResponse('No GitHub repository associated with this project_id.', 404);
    }

    const parsed = parseOwnerAndRepo(repoUrl);
    if (!parsed) {
      return createErrorResponse('Invalid GitHub repository URL format.', 400);
    }

    const { owner, repo } = parsed;

    // Concurrently fetch metadata from GitHub REST endpoints
    const [repoMeta, latestRelease, languages, topics, openPrs] = await Promise.all([
      fetchRepositoryDetails(owner, repo),
      fetchLatestRelease(owner, repo),
      fetchLanguages(owner, repo),
      fetchTopics(owner, repo),
      fetchOpenPullRequestsCount(owner, repo),
    ]);

    if (!repoMeta) {
      return createErrorResponse(`GitHub repository "${owner}/${repo}" not found or inaccessible.`, 404);
    }

    // Check existing database record
    const { data: existing } = await supabase
      .from('github_repositories')
      .select('id')
      .eq('project_id', projectId)
      .maybeSingle();

    const record = {
      project_id: projectId,
      repo_url: repoMeta.html_url,
      organization: repoMeta.owner?.login || owner,
      branch: repoMeta.default_branch || 'main',
      visibility: repoMeta.private ? 'private' : 'public',
      open_issues: repoMeta.open_issues_count || 0,
      open_prs: openPrs || 0,
      last_synced_at: new Date().toISOString(),
    };

    if (existing) {
      const { error } = await supabase
        .from('github_repositories')
        .update(record)
        .eq('id', existing.id);

      if (error) {
        console.error('[Supabase DB Error - Update]:', error);
        throw error;
      }
    } else {
      const { error } = await supabase
        .from('github_repositories')
        .insert(record);

      if (error) {
        console.error('[Supabase DB Error - Insert]:', error);
        throw error;
      }
    }

    console.log(`[GitHub Sync Success]: Project ${projectId} -> ${repoMeta.full_name}`);

    return createSuccessResponse({
      last_synced_at: record.last_synced_at,
      repository: {
        full_name: repoMeta.full_name,
        default_branch: repoMeta.default_branch,
        visibility: record.visibility,
        open_issues: record.open_issues,
        open_prs: record.open_prs,
        language: repoMeta.language,
        stars: repoMeta.stargazers_count,
        forks: repoMeta.forks_count,
        latest_release: latestRelease ? latestRelease.tag_name : null,
        languages,
        topics,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Synchronization Error';
    console.error('[GitHub Sync Function Error]:', message);
    return createErrorResponse(message, 500);
  }
});
