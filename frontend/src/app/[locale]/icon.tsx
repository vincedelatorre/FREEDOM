/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ImageResponse } from "next/og";
import { headers } from 'next/headers'

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";


export default async function Icon() {
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const proto = h.get('x-forwarded-proto') ?? 'https'
  const origin = `${proto}://${host}`

  const res = await fetch(`${origin}/icons/freedom.main.png`, { cache: 'no-store' })
  const url = res.ok ? `${origin}/icons/freedom.main.png` : `${origin}/Freedom_icon.png`

  return new ImageResponse(
    <img
      src={url}
      style={{ width: '100%', height: '100%' }}
      alt="favicon"
    />,
    size
  )
}