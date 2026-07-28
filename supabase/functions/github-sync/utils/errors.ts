export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export function createErrorResponse(message: string, status = 400): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: message,
      status,
    }),
    {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    }
  );
}

export function createSuccessResponse(data: Record<string, any>, status = 200): Response {
  return new Response(
    JSON.stringify({
      success: true,
      ...data,
    }),
    {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    }
  );
}
