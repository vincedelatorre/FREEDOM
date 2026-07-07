# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src import abstract, freedom
from src.repository import repository


@dataclasses.dataclass
class Domain(abstract.Domain):
    """ユーザーインターフェース設定
    Args:
        ip (str): 接続先IPアドレス
        port (int): 接続先ポート番号
        origin (list[str]): CORS設定用オリジンリスト
            起動configには加えたいが設定DBには保存しないため、InitVarで定義
        sub_title (str): サブタイトル
        update_cycle (float): 更新周期
    """
    ip:dataclasses.InitVar[str] = None
    port:dataclasses.InitVar[int] = None
    origin:dataclasses.InitVar[list[str]] = None
    sub_title:str = ""
    update_cycle:float = 3

    @classmethod
    def make_form(cls):
        """設定フォーム作成
        Returns:
            dict: 設定フォーム
        """
        return {
            "sub_title": {
                "type": "text",
                "label": "Freedomサブタイトル名",
            },
            "update_cycle": {
                "type": "number",
                "label": "更新周期",
                "suffix": "秒",
                "min": 0,
            },
        }

    def __post_init__(self, ip:str=None, port:int=None, origin:list[str]=None):
        """初期化後処理
        Args:
            ip (str): 接続先IPアドレス
            port (int): 接続先ポート番号
            origin (list[str]): CORS設定用オリジンリスト
        """
        if conf := repository.retrieve(freedom.main.Node):
            conf = conf[0].domain.conf.user_interface
            self.ip = conf.ip
            self.port = conf.port
            self.origin = conf.origin
        else:
            self.ip = ip
            self.port = port
            self.origin = origin
