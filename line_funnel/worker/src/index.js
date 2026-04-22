// ============================================================
// index.js — Cloudflare Workers エントリポイント
// ============================================================
// LINE Webhook を受信し、署名検証後に会話フローを処理する
// 200 は即時返却、実処理は waitUntil() でバックグラウンド実行
// ============================================================

import { handleLineEvent, receiveLiffResult } from './flow.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ── LIFF診断結果受信エンドポイント ──────────────────────
    if (url.pathname === '/api/diagnosis') {
      return handleDiagnosisApi(request, env, ctx);
    }

    // POST のみ受け付ける
    if (request.method !== 'POST') {
      return new Response('Not Found', { status: 404 });
    }

    const body = await request.text();

    // LINE 署名検証
    const valid = await verifySignature(
      body,
      request.headers.get('x-line-signature') ?? '',
      env.LINE_SECRET,
    );
    if (!valid) {
      return new Response('Unauthorized', { status: 401 });
    }

    // 200 を即時返却（LINE の5秒タイムアウト対策）
    const response = new Response('OK', { status: 200 });

    // イベント処理をバックグラウンドで実行
    ctx.waitUntil(processEvents(body, env));

    return response;
  },
};

// ── LIFF診断API ───────────────────────────────────────────

async function handleDiagnosisApi(request, env, ctx) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { userId, resultType } = body ?? {};
  if (!userId || !resultType) {
    return new Response(JSON.stringify({ error: 'Missing userId or resultType' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  ctx.waitUntil(receiveLiffResult(userId, resultType, env));

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// ── イベント処理 ──────────────────────────────────────────

async function processEvents(body, env) {
  let payload;
  try {
    payload = JSON.parse(body);
  } catch (e) {
    console.error('JSON parse error', e);
    return;
  }

  const events = payload.events ?? [];
  for (const event of events) {
    try {
      await handleLineEvent(event, env);
    } catch (e) {
      console.error('event error', event.type, e);
    }
  }
}

// ── LINE 署名検証 ─────────────────────────────────────────

async function verifySignature(body, signature, secret) {
  if (!signature || !secret) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signedBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(body),
  );

  const expected = btoa(String.fromCharCode(...new Uint8Array(signedBuffer)));
  return expected === signature;
}
