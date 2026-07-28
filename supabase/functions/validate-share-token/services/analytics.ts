export async function recordShareLinkAccess(
  supabase: any,
  linkId: string,
  currentViews: number
) {
  const now = new Date().toISOString();
  const nextViews = (currentViews || 0) + 1;

  try {
    await supabase
      .from('share_links')
      .update({
        current_views: nextViews,
        view_count: nextViews,
        last_accessed_at: now,
        updated_at: now,
      })
      .eq('id', linkId);
  } catch {
    // Non-blocking analytics logging
  }
}
