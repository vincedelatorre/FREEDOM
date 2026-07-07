# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations


def classify_action(node_name: str, func: str) -> str:
    # 例外で許可
    if node_name == "job.create" and func == "active":
        return "operate_active"
    if node_name == "freedom.main":
        if func == "fetch_structure":
            return "read"
        return "write"
    # 取得系
    if func.startswith(("fetch", "list", "get")):
        return "read"
    # 変更系
    if func.startswith(("create", "update", "delete", "set")):
        return "write"
    # 実行・操作系
    if func in ("active", "execute") or func.startswith(("run", "command", "operate", "active")):
        return "operate"
    # それ以外
    return "operate"


def make_object(kind: str, name: str) -> str:
    return f"{kind}:{name}"
