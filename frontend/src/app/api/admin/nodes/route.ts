/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";


export const runtime = "nodejs";

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL ?? "http://localhost:8080";

function toRepository(node: string) {
  return (node ?? "").split(".", 1)[0] ?? "";
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = session?.user?.role ?? null;
  if (role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const targetUrl = `${BACKEND_BASE_URL}/node/freedom.map`;

  const res = await fetch(targetUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ func: "fetch_status", kwargs: {} }),
  });

  const text = await res.text();
  if (!res.ok) {
    return new NextResponse(text, {
      status: res.status,
      headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
    });
  }

  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "invalid_backend_response" }, { status: 502 });
  }

  const items = (Array.isArray(data) ? data : []).map((s: any) => {
    const node = String(s?.node ?? "");
    const node_id = String(s?.name ?? "");
    const repository = toRepository(node);
    return {
      repository,
      node,
      node_id,
      label: `${node} / ${node_id}`,
    };
  });

  return NextResponse.json({ items });
}
