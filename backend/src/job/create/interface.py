# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import abc

from src.job.create import Domain


class Interface(abc.ABC):
    @abc.abstractmethod
    def __init__(self, domain:Domain):
        """ジョブ作成DB接続インターフェース
        Args:
            domain (Domain): ドメイン
        """
        raise NotImplementedError()

    @abc.abstractmethod
    async def fetch_name_list(self, user_id:str|None=None, is_admin:bool=False) -> list[str]:
        """ジョブ名リスト取得
        Args:
            user_id (str|None): ユーザID
            is_admin (bool): 管理者フラグ(Trueで全件取得)
        Returns:
            list[str]: ジョブ名リスト
        """
        raise NotImplementedError()

    @abc.abstractmethod
    async def fetch_workspace(self, name:str) -> dict:
        """Blockly環境取得
        Args:
            name (str): ジョブ名
        Returns:
            dict: Blockly環境
        """
        raise NotImplementedError()

    @abc.abstractmethod
    async def update(self, name:str, workspace:dict):
        """ジョブ更新
        Args:
            name (str): ジョブ名
            workspace (dict): Blockly環境
        """
        raise NotImplementedError()

    @abc.abstractmethod
    async def delete(self, name:str):
        """ジョブ削除
        Args:
            name (str): ジョブ名
        """
        raise NotImplementedError()
