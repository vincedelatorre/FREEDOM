/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import * as React from "react";


export type SessionInfo = {
  authenticated: boolean;
  userId: string | null;
  role: string | null;
  username: string | null;
};

export const SessionContext = React.createContext<SessionInfo | null>(null);

export function useSessionInfo() {
  return React.useContext(SessionContext);
}
