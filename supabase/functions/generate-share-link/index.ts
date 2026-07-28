import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { processGenerateShareLink } from "./services/share-links.ts";
import { jsonResponse, errorResponse, handleOptionsResponse } from "./utils/response.ts";
import { Logger } from "./utils/logger.ts";

serve(async (req: Request) => {
  // Handle CORS Preflight OPTIONS Request
  if (req.method === 'OPTIONS') {
    return handleOptionsResponse();
  }

  try {
    if (req.method !== 'POST') {
      return errorResponse('Method Not Allowed', 405, 'METHOD_NOT_ALLOWED');
    }

    const result = await processGenerateShareLink(req);
    return jsonResponse(result, 200);
  } catch (err: any) {
    const errorMessage = err?.message || 'Failed to generate share link';
    Logger.error('Share Link Generation Failed', { message: errorMessage });

    const status = errorMessage.includes('Unauthorized') ? 401 : 400;
    return errorResponse(errorMessage, status);
  }
});
