/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Pool } from "pg";
import { betterAuth } from "better-auth";
import { username, admin } from "better-auth/plugins";

import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });


const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";
const ADMIN_EMAIL = "admin@local.invalid";
const ADMIN_NAME = "admin";

const DATABASE_URL = process.env.DATABASE_URL!;
const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET!;

async function adminExists(pool: Pool): Promise<boolean> {
  const sql = `select 1 from auth."user" where role = 'admin' limit 1;`;
  const r = await pool.query(sql);
  return (r.rowCount ?? 0) > 0;
}

async function userExists(pool: Pool, username: string): Promise<boolean> {
  const sql = `select 1 from auth."user" where username = $1 limit 1;`;
  const r = await pool.query(sql, [username]);
  return (r.rowCount ?? 0) > 0;
}

async function setAdminRole(pool: Pool, username: string) {
  const sql = `update auth."user" set role = 'admin' where username = $1;`;
  await pool.query(sql, [username]);
}

async function main() {
  console.log("=== seed-admin start ===");

  if (!DATABASE_URL) throw new Error("DATABASE_URL is missing");
  if (!BETTER_AUTH_SECRET) throw new Error("BETTER_AUTH_SECRET is missing");

  const pool = new Pool({
    connectionString: DATABASE_URL,
    options: "-c search_path=auth",
  });

  try {
    // すでに admin ロールのユーザが存在するなら何もしない
    if (await adminExists(pool)) {
      console.log("admin ロールのユーザは既に存在します。seed をスキップします。");
      return;
    }
    if (await userExists(pool, ADMIN_USERNAME)) {
      await setAdminRole(pool, ADMIN_USERNAME);
      console.log("✅ 既存ユーザを admin ロールに変更しました");
      console.log("----------------------------------");
      console.log("username :", ADMIN_USERNAME);
      console.log("password :", ADMIN_PASSWORD);
      console.log("----------------------------------");
      return;
    }

    const auth = betterAuth({
      secret: BETTER_AUTH_SECRET,
      database: pool,
      emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
        maxPasswordLength: 128,
      },
      plugins: [username(), admin()],
    });

    await auth.api.signUpEmail({
      body: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        name: ADMIN_NAME,
        username: ADMIN_USERNAME,
        displayUsername: ADMIN_USERNAME,
      },
    });

    await setAdminRole(pool, ADMIN_USERNAME);

    console.log("✅ 管理者 を作成しました");
    console.log("----------------------------------");
    console.log("username :", ADMIN_USERNAME);
    console.log("password :", ADMIN_PASSWORD);
    console.log("----------------------------------");
    console.log("⚠️ 初回ログイン後、必ずパスワードを変更してください");
  } finally {
    await pool.end().catch(() => {});
    console.log("=== seed-admin end ===");
  }
}

main().catch((e) => {
  console.error("❌ seed-admin failed:", e);
  process.exit(1);
});
