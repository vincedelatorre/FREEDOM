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

type AllowItem = {
  repository: string;
  node: string;
  node_id: string;
};

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = session?.user?.role ?? null;
  if (role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'missing_userId' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      `
      SELECT repository, node, node_id
      FROM authz.user_node_allow
      WHERE user_id = $1
      ORDER BY repository, node, node_id
      `,
      [userId],
    );
    return NextResponse.json({ items: rows });
  } finally {
    client.release();
  }
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
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
  const items: AllowItem[] | undefined = body?.items;

  if (!userId) {
    return NextResponse.json({ error: 'missing_userId' }, { status: 400 });
  }
  if (!Array.isArray(items)) {
    return NextResponse.json({ error: 'missing_items' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `DELETE FROM authz.user_node_allow WHERE user_id = $1`,
      [userId],
    );

    if (items.length > 0) {
      const values: any[] = [];
      const placeholders: string[] = [];
      let i = 1;

      for (const it of items) {
        values.push(userId, it.repository, it.node, it.node_id);
        placeholders.push(`($${i}, $${i + 1}, $${i + 2}, $${i + 3})`);
        i += 4;
      }

      await client.query(
        `
        INSERT INTO authz.user_node_allow(user_id, repository, node, node_id)
        VALUES ${placeholders.join(',')}
        `,
        values,
      );
    }

    await client.query('COMMIT');
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    await client.query('ROLLBACK');
    return NextResponse.json({ error: 'db_error', detail: String(e) }, { status: 500 });
  } finally {
    client.release();
  }
}
