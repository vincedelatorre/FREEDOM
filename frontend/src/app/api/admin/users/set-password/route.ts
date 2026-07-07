/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const h = await headers();

  const session = await auth.api.getSession({ headers: h });
  const role = session?.user?.role ?? null;

  if (role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const userId: string | undefined = body?.userId;
  const newPassword: string | undefined = body?.newPassword;

  if (!userId) {
    return NextResponse.json({ error: 'missing_userId' }, { status: 400 });
  }
  if (!newPassword) {
    return NextResponse.json({ error: 'missing_newPassword' }, { status: 400 });
  }

  try {
    await (auth.api as any).setUserPassword({
      headers: h,
      body: { userId, newPassword },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('admin/users setUserPassword failed:', e);
    return NextResponse.json({ error: 'set_password_failed', detail: String(e) }, { status: 500 });
  }
}
