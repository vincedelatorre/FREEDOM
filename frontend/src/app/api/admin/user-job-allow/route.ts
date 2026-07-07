/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Pool } from "pg";

export const runtime = "nodejs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export async function GET(req: NextRequest) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  const role = session?.user?.role ?? null;

  if (role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const userId = url.searchParams.get("userId") ?? "";
  if (!userId) {
    return NextResponse.json({ error: "missing_userId" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    const res = await client.query(
      `
      SELECT job_name
      FROM authz.user_job_allow
      WHERE user_id = $1
      ORDER BY job_name ASC
      `,
      [userId]
    );
    const items = res.rows.map((r) => String(r.job_name));
    return NextResponse.json({ items });
  } catch (e: any) {
    console.error("admin/user-job-allow GET failed:", e);
    return NextResponse.json({ error: "fetch_failed", detail: String(e) }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function POST(req: NextRequest) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  const role = session?.user?.role ?? null;

  if (role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const userId: string | undefined = body?.userId;
  const itemsRaw: unknown = body?.items;

  if (!userId) {
    return NextResponse.json({ error: "missing_userId" }, { status: 400 });
  }
  if (!Array.isArray(itemsRaw)) {
    return NextResponse.json({ error: "invalid_items" }, { status: 400 });
  }

  const items = itemsRaw
    .map((x) => String(x).trim())
    .filter((x) => x.length > 0);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      `
      DELETE FROM authz.user_job_allow
      WHERE user_id = $1
      `,
      [userId]
    );

    if (items.length > 0) {
      const values: any[] = [];
      const placeholders: string[] = [];
      for (let i = 0; i < items.length; i++) {
        values.push(userId, items[i]);
        placeholders.push(`($${i * 2 + 1}, $${i * 2 + 2})`);
      }

      await client.query(
        `
        INSERT INTO authz.user_job_allow (user_id, job_name)
        VALUES ${placeholders.join(", ")}
        `,
        values
      );
    }

    await client.query("COMMIT");
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    await client.query("ROLLBACK").catch(() => undefined);
    console.error("admin/user-job-allow POST failed:", e);
    return NextResponse.json({ error: "save_failed", detail: String(e) }, { status: 500 });
  } finally {
    client.release();
  }
}
