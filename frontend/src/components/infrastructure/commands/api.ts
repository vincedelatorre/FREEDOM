/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from "@/lib/axios";
import { CommandResponseType } from "@/types/infrastructure";

/** ノード呼び出しボディ */
export interface NodeRequestBody {
  func: string;
  kwargs?: Record<string, any>;
  domain?: Record<string, any>;
}

/** ノードメソッドを呼び出す汎用関数 */
export async function callNode<T = any>(
  node: string,
  body: NodeRequestBody,
): Promise<T> {
  const res = await axios.post(`/node/infrastructure.${node}`, body);
  return res.data as T;
}

type LegacyCommandItem = { label: string; func: string; kwargs?: Record<string, any> };

/** コマンド一覧を取得*/
export async function fetchInfrastructureCommands(
  node: string,
  domain?: Record<string, any>,
): Promise<CommandResponseType[]> {
  const raw = await callNode<any[]>(node, {
    func: "fetch_command",
    kwargs: {},
    domain,
  });

  return (raw ?? []).map((c) => {
    if (c && typeof c === "object" && "type" in c) {
      return c as CommandResponseType;
    }
    const lc = c as LegacyCommandItem;
    return {
      type: "button",
      label: lc.label,
      func: lc.func,
      kwargs: lc.kwargs ?? {},
    } satisfies CommandResponseType;
  });
}

/** 任意のコマンドを実行 */
export async function executeInfrastructureCommand(
  node: string,
  func: string,
  kwargs: Record<string, any> = {},
  domain?: Record<string, any>,
): Promise<any> {
  return await callNode<any>(node, { func, kwargs, domain });
}
