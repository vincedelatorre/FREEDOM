# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses
import logging
import typing

from src.job.task.abstract import statement


@dataclasses.dataclass
class Task:
    """タスクコマンド
    Args:
        id (str): 先頭タスクID
        type (str): コマンド種類
    """
    id:str
    type:str = "task"

    async def exec(self, task:statement.Logic[statement.Domain], logger:logging.Logger):
        """タスク実行
        Args:
            task (statement.Logic[statement.Domain]): タスク
            logger (logging.Logger): ロガー
        """
        while task:
            if not task.domain.finished:
                logger.info(f"task exec: name={task.domain.name}, type={task.domain.type}")
                await task.exec()
                task.domain.finished = True
            task = task.next

    def recover(self, task:statement.Domain|None, id:str, finished:bool=True) -> bool:
        """タスク復帰
        再帰関数
        Args:
            task (statement.Domain|None): タスク内容
            id (str): 復帰タスクID
            finished (bool): タスク終了
        Returns:
            bool: タスク終了
        """
        if task is None:
            return finished
        if task.id == id:
            if not task.can_recover:
                raise Exception(f"{task.name} cannot recover")
            finished = False
        sub_finished = finished
        for cmd in task.command:
            if not isinstance(cmd, Task):
                continue
            for sub_task in vars(task).values():
                if not isinstance(sub_task, statement.Domain):
                    continue
                if sub_task.id != cmd.id:
                    continue
                if not self.recover(sub_task, id, finished):
                    sub_finished = False
        if not finished:
            task.command.clear()
        task.finished = finished and sub_finished
        return self.recover(task.next, id, task.finished)


@dataclasses.dataclass
class Button:
    """ボタンコマンド
    Args:
        label (str): 表示文字
        value (typing.Any): 応答内容
        type (str): コマンド種類
    """
    label:str
    value:typing.Any
    type:str = "button"

@dataclasses.dataclass
class Switch:
    """スイッチコマンド
    Args:
        label_on(str): ONでの表示内容
        label_off(str): OFFでの表示内容
        value (bool): 応答内容
        type (str): コマンド種類
    """
    label_on:str
    label_off:str
    value:bool
    type:str = "switch"

@dataclasses.dataclass
class Text:
    """テキストコマンド
    Args:
        label (str): 表示文字
        type (str): コマンド種類
    """
    label:str
    type:str = "text"
