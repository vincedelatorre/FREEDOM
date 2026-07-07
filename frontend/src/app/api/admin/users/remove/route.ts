/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { Pool } from 'pg';


export const runtime = 'nodejs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

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
  if (!userId) {
    return NextResponse.json({ error: 'missing_userId' }, { status: 400 });
  }

  // 自分自身を削除するのを防止
  if (session?.user?.id === userId) {
    return NextResponse.json({ error: 'cannot_delete_self' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await (auth.api as any).removeUser({
      headers: h,
      body: { userId },
    });

    await client.query(
      `DELETE FROM authz.user_node_allow WHERE user_id = $1`,
      [userId],
    );

    await client.query(
      `DELETE FROM authz.user_job_allow WHERE user_id = $1`,
      [userId],
    );

    await client.query('COMMIT');
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    await client.query('ROLLBACK');
    console.error('admin/users removeUser failed:', e);
    return NextResponse.json({ error: 'remove_user_failed', detail: String(e) }, { status: 500 });
  } finally {
    client.release();
  }
}
