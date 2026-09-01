/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

export type FileListItem = {
  filename: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  url: string;
};

export type GetFolderFilesResponse = {
  path: string;
  files: FileListItem[];
};

export type ApiErrorResponse = {
  error: string;
};

export type DeleteFileResponse = {
  message: string;
  path: string;
  filename?: string;
};

export type SaveFilesResponse = {
  message: string;
  path: string;
  count: number;
  files: {
    filename: string;
    size: number;
    url: string;
  }[];
};
