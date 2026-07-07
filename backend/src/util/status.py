# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses
import enum


class State(enum.IntEnum):
    """状態
    数値は描画レイヤー順
    """
    HIDE = -1
    DISCONNECT = 0
    WAITING = 1
    MANUAL = 2
    ACTIVE = 3
    WARNING = 4
    ERROR = 5


@dataclasses.dataclass
class Status:
    """ノード状態
    Args:
        name (str): 名前
        state (State): 状態
        location (list[float]): 位置
        info (list[str]]): 情報
        detail (list[str]]): 詳細
        command (list[dict]): コマンド
        node (str): ノード名
    """
    name:str
    state:State = State.HIDE
    location:list[float, float] = None
    info:list[str] = dataclasses.field(default_factory=list)
    detail:list[str] = dataclasses.field(default_factory=list)
    command:list[dict] = dataclasses.field(default_factory=list)
    node:str = ""
