/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextRequest, NextResponse } from 'next/server';


export const runtime = 'nodejs';

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL ?? 'http://localhost:8080';

function normalizeJsonBody(raw: string) {
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : '{}';
}

function pickResponseContentType(res: Response) {
  return res.headers.get('content-type') ?? 'application/json';
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await context.params;
  const suffix = (path ?? []).join('/');
  const targetUrl = `${BACKEND_BASE_URL}/domain/${suffix}`;

  const rawBody = await req.text();
  const bodyText = normalizeJsonBody(rawBody);

  const res = await fetch(targetUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: bodyText,
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { 'content-type': pickResponseContentType(res) },
  });
}
