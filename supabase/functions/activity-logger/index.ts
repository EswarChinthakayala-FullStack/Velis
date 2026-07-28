import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { validateWebhookPayload, authorizeRequest } from './shared/validate.ts';
import { logger } from './shared/logger.ts';
import { handleProjectWebhook } from './handlers/project.ts';
import { handleClientWebhook } from './handlers/client.ts';
import { handleTaskWebhook } from './handlers/task.ts';
import { handleDefaultWebhook } from './handlers/default.ts';
import type { DomainHandlerResult } from './shared/types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Authorize Webhook Request
    if (!authorizeRequest(req)) {
      logger.warn('Unauthorized webhook attempt rejected');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid webhook secret or bearer token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Parse & Validate Payload
    const body = await req.json();
    if (!validateWebhookPayload(body)) {
      logger.warn('Malformed database webhook payload rejected', { body });
      return new Response(
        JSON.stringify({ error: 'Invalid payload shape: Expected Supabase Database Webhook format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    logger.info(`Received DB Webhook: ${body.type} on ${body.schema}.${body.table}`, {
      table: body.table,
      type: body.type,
    });

    // 3. Route to Domain Handler
    let result: DomainHandlerResult;

    switch (body.table) {
      case 'projects':
      case 'project_sections':
        result = handleProjectWebhook(body);
        break;
      case 'clients':
        result = handleClientWebhook(body);
        break;
      case 'tasks':
      case 'milestones':
        result = handleTaskWebhook(body);
        break;
      default:
        result = handleDefaultWebhook(body);
        break;
    }

    // 4. Initialize Supabase Service Role Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 5. Insert into activity_logs
    const logPayload = {
      actor_id: result.actorId || null,
      action: result.action,
      entity_type: result.entityType,
      entity_id: result.entityId || null,
      metadata: result.metadata,
      created_at: new Date().toISOString(),
    };

    const { data: inserted, error: insertError } = await supabase
      .from('activity_logs')
      .insert(logPayload)
      .select('id, action, entity_type, created_at')
      .single();

    if (insertError) {
      logger.error('Failed to insert activity_log into database', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to record activity log in database' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    logger.info(`Successfully logged activity: ${result.action} on ${result.entityType}`, {
      id: inserted.id,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Activity event logged successfully',
        log: inserted,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    logger.error('Unhandled Edge Function Exception', err);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', message: err.message || String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
