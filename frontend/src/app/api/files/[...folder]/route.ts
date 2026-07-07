/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * publicフォルダ操作api
 * 生成AI丸投げ
 */
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';


export const runtime = 'nodejs'; // fsを使うので node runtime を明示

const PUBLIC_DIR = path.join(process.cwd(), 'public');

function resolveFolderPath(folderSegments: string[] = []) {
  const folderPath = path.join(PUBLIC_DIR, ...folderSegments);
  // publicディレクトリ外へのパストラバーサル防止
  if (!folderPath.startsWith(PUBLIC_DIR)) {
    throw new Error('Invalid path');
  }
  return folderPath;
}

/**
 * GET: public/[...folder] 配下のファイル名のリストを返す
 * 例: GET /api/files/images/banners -> public/images/banners 配下のファイル一覧
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ folder?: string[] }> }
) {
  const { folder } = await context.params;
  const folderSegments = folder ?? [];
  const dirPath = resolveFolderPath(folderSegments);
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    // ファイルのみ返す（ディレクトリは除外）
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => e.name);
    return NextResponse.json(files);
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return NextResponse.json([]);
    }
    console.error(err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: queryで指定したファイルを削除
 * 例: DELETE /api/files/images?file=test.png -> public/images/test.png 削除
 */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ folder?: string[] }> }
) {
  const { folder } = await context.params;
  const folderSegments = folder ?? [];
  const dirPath = resolveFolderPath(folderSegments);
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get('file');
  if (!fileName) {
    return NextResponse.json(
      { error: 'Query parameter "file" is required' },
      { status: 400 }
    );
  }
  const filePath = path.join(dirPath, fileName);
  // 再度パスチェック（fileName に ../ が入るなどのケース）
  if (!filePath.startsWith(PUBLIC_DIR)) {
    return NextResponse.json(
      { error: 'Invalid file path' },
      { status: 400 }
    );
  }
  try {
    await fs.unlink(filePath);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    console.error(err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * PUT: bodyで渡した File オブジェクトを保存・上書き
 * 例:
 * const fd = new FormData();
 * fd.append('file', file); // Fileオブジェクト
 * fetch('/api/files/images', { method: 'PUT', body: fd })
 */
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ folder?: string[] }> }
) {
  const { folder } = await context.params;
  const folderSegments = folder ?? [];
  const dirPath = resolveFolderPath(folderSegments);
  const formData = await req.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: 'Form field "file" must be a File' },
      { status: 400 }
    );
  }
  const fileName = file.name;
  if (!fileName) {
    return NextResponse.json(
      { error: 'File must have a name' },
      { status: 400 }
    );
  }
  const filePath = path.join(dirPath, fileName);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    return NextResponse.json(
      { error: 'Invalid file path' },
      { status: 400 }
    );
  }
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // ディレクトリが無ければ作成
    await fs.mkdir(dirPath, { recursive: true });
    // 保存・上書き
    await fs.writeFile(filePath, buffer);
    return NextResponse.json({
      success: true,
      fileName,
      path: filePath.replace(PUBLIC_DIR, ''), // 公開パス的な情報
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
