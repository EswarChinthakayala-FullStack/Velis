export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-region, x-user-agent',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

export function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

export function errorResponse(message: string, status = 400, code?: string): Response {
  return jsonResponse(
    {
      success: false,
      error: message,
      code: code || 'BAD_REQUEST',
    },
    status
  );
}

export function handleOptionsResponse(): Response {
  return new Response('ok', { status: 200, headers: corsHeaders });
}
