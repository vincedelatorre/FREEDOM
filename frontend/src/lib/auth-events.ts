/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

export const AUTH_CHANNEL = 'freedom-auth';

export function broadcastAuthChanged() {
  try {
    const ch = new BroadcastChannel(AUTH_CHANNEL);
    ch.postMessage({ type: 'auth-changed', at: Date.now() });
    ch.close();
  } catch {
  }
}

export function subscribeAuthChanged(onChange: () => void) {
  try {
    const ch = new BroadcastChannel(AUTH_CHANNEL);
    const handler = (ev: MessageEvent) => {
      if (ev?.data?.type === 'auth-changed') onChange();
    };
    ch.addEventListener('message', handler);
    return () => {
      ch.removeEventListener('message', handler);
      ch.close();
    };
  } catch {
    return () => {};
  }
}
