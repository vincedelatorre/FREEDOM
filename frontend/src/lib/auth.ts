/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { username, admin } from 'better-auth/plugins';
import { Pool } from 'pg';


const database = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const auth = betterAuth({
  database,
  baseURL: process.env.BETTER_AUTH_URL,
  session: {
    expiresIn: 60 * 60 * 24 * 7,  // 有効期限
    updateAge: 60 * 60 * 24,  // 更新間隔
  },
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 1,
    maxPasswordLength: 128,
  },
  plugins: [
    username({
      minUsernameLength: 1,
      maxUsernameLength: 30,
      usernameValidator: (v) => {
        const s = (v ?? "").trim();
        if (s.length < 1 || s.length > 30) return false;
        if (/\s/u.test(s)) return false;
        if (s.includes("@")) return false;
        return true;
      },
    }),
    admin(),
    nextCookies(),
  ],
});
