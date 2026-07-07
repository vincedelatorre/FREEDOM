/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';


export const runtime = 'nodejs';

export const { GET, POST } = toNextJsHandler(auth);
