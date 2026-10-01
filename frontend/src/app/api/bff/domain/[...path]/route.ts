/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';


export const runtime = 'nodejs';

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL ?? 'http://localhost:8080';

function normalizeJsonBody(raw: string) {
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : '{}';
}

function pickResponseContentType(res: Response) {
  return res.headers.get('content-type') ?? 'application/json';
}

/**
 * ゲスト許可ドメイン
 */
const GUEST_ALLOWED_DOMAINS = new Set(['freedom.map', 'freedom.user_interface']);

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await context.params;
  const suffix = (path ?? []).join('/');
  const targetUrl = `${BACKEND_BASE_URL}/domain/${encodeURIComponent(suffix)}`;

  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id ?? null;

  if (!userId && !GUEST_ALLOWED_DOMAINS.has(suffix)) {
    return NextResponse.json({ error: 'login_required' }, { status: 403 });
  }

  const rawBody = await req.text();
  const bodyText = normalizeJsonBody(rawBody);

  const res = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(userId ? { 'x-user-id': userId } : {}),
    },
    body: bodyText,
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { 'content-type': pickResponseContentType(res) },
  });
}
