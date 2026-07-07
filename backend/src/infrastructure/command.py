# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses


@dataclasses.dataclass
class Button:
    """ボタン表示
    Args:
        label (str): ボタン表示テキスト
        func (str): 実行関数
        kwargs (str): 引数
        type (str): コマンド種類
    """
    label:str
    func:str
    kwargs:dict = dataclasses.field(default_factory=dict)
    type:str = "button"
