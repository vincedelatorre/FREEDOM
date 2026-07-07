/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { createAuthClient } from 'better-auth/client';
import { usernameClient } from 'better-auth/client/plugins';
import { adminClient } from 'better-auth/client/plugins';


export const authClient = createAuthClient({
  plugins: [
    usernameClient(),
    adminClient(),
  ],
});
