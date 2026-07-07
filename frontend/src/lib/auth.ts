/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { betterAuth } from 'better-auth';
import { username, admin } from 'better-auth/plugins';
import { Pool } from 'pg';


const database = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const auth = betterAuth({
  database,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
  },
  plugins: [
    username({
      minUsernameLength: 2,
      maxUsernameLength: 30,
      usernameValidator: (v) => {
        const s = (v ?? "").trim();
        if (s.length < 2 || s.length > 30) return false;
        if (/\s/u.test(s)) return false;
        if (s.includes("@")) return false;
        return true;
      },
    }),
    admin(),
  ],
});
