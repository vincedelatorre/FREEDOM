/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";


export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const h = await headers();

  const session = await auth.api.getSession({ headers: h });
  const userId = session?.user?.id ?? null;
  const role = session?.user?.role ?? null;

  if (!userId) {
    return NextResponse.json({ error: "login_required" }, { status: 401 });
  }

  const isAdmin = role === "admin";

  try {
    const origin = req.nextUrl.origin;
    const url = new URL("/api/bff/node/job.create", origin);

    const cookie = h.get("cookie") ?? "";
    const authorization = h.get("authorization") ?? "";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(cookie ? { cookie } : {}),
        ...(authorization ? { authorization } : {}),
      },
      body: JSON.stringify({
        func: "fetch_name_list",
        kwargs: {
          user_id: userId,
          is_admin: isAdmin,
        },
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `upstream_error: ${res.status}`);
    }

    const data = await res.json().catch(() => null);
    const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
    return NextResponse.json({ items });
  } catch (e: any) {
    console.error("job-names GET failed:", e);
    return NextResponse.json(
      { error: "fetch_failed", detail: String(e) },
      { status: 500 }
    );
  }
}
