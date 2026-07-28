import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { processValidateShareToken } from "./services/share-token.ts";
import { jsonResponse, errorResponse, handleOptionsResponse } from "./utils/response.ts";
import { Logger } from "./utils/logger.ts";

/**
 * Validate Share Token Edge Function (PHASE 14)
 * Secure token-exchange gateway issuing short-lived 15-minute scoped Viewer JWTs for client access.
 *
 * NOTE: The frontend MUST store the returned access_token ONLY IN MEMORY (never localStorage/sessionStorage)
 * and pass it as Authorization: Bearer <access_token> header to activate PostgreSQL Row-Level Security.
 */
serve(async (req: Request) => {
  // Handle CORS Preflight OPTIONS Request
  if (req.method === 'OPTIONS') {
    return handleOptionsResponse();
  }

  try {
    if (req.method !== 'POST') {
      return errorResponse('Method Not Allowed', 405, 'error');
    }

    const result = await processValidateShareToken(req);
    return jsonResponse(result, 200);
  } catch (err: any) {
    const errorMessage = err?.message || 'Token validation failed';
    const statusCode = err?.status || 'error';
    const httpCode = err?.httpCode || 400;

    Logger.error('Validation Failed', { message: errorMessage, status: statusCode });
    return errorResponse(errorMessage, httpCode, statusCode);
  }
});
