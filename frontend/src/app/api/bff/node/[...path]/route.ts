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
 * ゲスト許可ルール
 */
function isGuestAllowed(nodeName: string, func: string): boolean {
  if (nodeName === 'freedom.main' && func === 'fetch_structure') return true;
  if (nodeName === 'freedom.map' && func === 'fetch_status') return true;
  if (nodeName === 'freedom.log' && func.startsWith('fetch')) return true;
  return false;
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await context.params;
  const nodeName = (path ?? []).join('/');
  const targetUrl = `${BACKEND_BASE_URL}/node/${nodeName}`;

  const rawBody = await req.text();
  const bodyText = normalizeJsonBody(rawBody);

  let body: any;
  try {
    body = JSON.parse(bodyText);
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const func: string | undefined = body?.func;
  if (!func) {
    return NextResponse.json({ error: 'missing_func' }, { status: 400 });
  }

  // ゲスト許可
  if (isGuestAllowed(nodeName, func)) {
    let userId: string | undefined;
    let userRole: string | undefined;
    if (nodeName === 'freedom.map' && func === 'fetch_status') {
      const session = await auth.api.getSession({ headers: await headers() });
      userId = session?.user?.id;
      userRole = session?.user?.role ?? undefined;
    }

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(userId ? { 'x-user-id': userId } : {}),
        ...(userRole ? { 'x-user-role': userRole } : {}),
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { 'content-type': pickResponseContentType(res) },
    });
  }

  // --- ログイン必須（設定/操作系） ---
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id ?? null;

  if (!userId) {
    return NextResponse.json({ error: 'login_required' }, { status: 403 });
  }

  const res = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-user-id': userId,
    },
    body: bodyText,
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { 'content-type': pickResponseContentType(res) },
  });
}
