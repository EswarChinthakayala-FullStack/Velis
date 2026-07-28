import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { create, getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const jwtSecret = Deno.env.get('SUPABASE_JWT_SECRET') || supabaseServiceKey
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { token } = await req.json()

    if (!token) {
      return new Response(
        JSON.stringify({ status: 'invalid', error: 'Token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const tokenHash = await sha256(token)

    const { data: link, error } = await supabase
      .from('share_links')
      .select('*')
      .eq('token_hash', tokenHash)
      .single()

    if (error || !link || !link.is_active || link.revoked_at) {
      return new Response(
        JSON.stringify({ status: 'revoked', error: 'Access revoked' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ status: 'expired', error: 'Link expired' }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const cryptoKey = await getCryptoKey(jwtSecret)
    const expiresAtSec = getNumericDate(15 * 60) // 15 minutes
    const jwtPayload = {
      role: 'viewer',
      project_id: link.project_id,
      share_link_id: link.id,
      permission: 'read',
      exp: expiresAtSec,
      iat: getNumericDate(0)
    }

    const viewerJwt = await create({ alg: "HS256", typ: "JWT" }, jwtPayload, cryptoKey)

    return new Response(
      JSON.stringify({
        status: 'valid',
        token: viewerJwt,
        project_id: link.project_id,
        expires_at: expiresAtSec * 1000
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err: any) {
    return new Response(
      JSON.stringify({ status: 'error', error: err.message || 'Token refresh failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
