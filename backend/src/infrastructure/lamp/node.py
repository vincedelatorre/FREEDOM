# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import asyncio
import sys

from src import freedom, infrastructure, robot, util
from src.repository import repository
from src.infrastructure.lamp import NodeDomain, Interface, access
from src.infrastructure.command import Button


class Node(infrastructure.Node):
    def __init__(self, domain:NodeDomain):
        """ランプ連携ノード
        Args:
            domain (NodeDomain): 設定
        """
        self.domain = domain
        self._related_robot:set[robot.Node[robot.Domain]] = set()
        self._state = util.status.State.WAITING
        self._access:Interface = getattr(access, self.domain.interface)(self.domain)
        self._logger = repository.retrieve(freedom.log.Node)[0].make_logger(__package__, f"[{self.domain.name}]")
        self._task = asyncio.create_task(self._loop())
        self._logger.info(f"launch: {self.domain=}")

    async def _loop(self):
        """定期ループ処理"""
        try:
            while sys.getrefcount(self) > 2:
                await asyncio.sleep(self.domain.update_cycle)
                await self._update()
        finally:
            await self._access.close()
            self._logger.info("end")

    async def _update(self):
        """状態更新"""
        try:
            # 連携確認
            if self._related_robot:
                self._related_robot = {r for r in self._related_robot if r.job and util.map._is_inside(r.domain.location, self.domain.area_list)}
                if not self._related_robot:
                    await self.turn_off()
            # 状態確認
            if await self._access.read(self.domain.write_address):
                self._state = util.status.State.ACTIVE
            else:
                self._state = util.status.State.WAITING
                if self._related_robot:
                    await self.turn_on()
        except Exception as e:
            if self._state != util.status.State.DISCONNECT:
                self._logger.error(f"disconnect {type(e)} - {e}")
            self._state = util.status.State.DISCONNECT

    def fetch_status(self) -> util.status.Status:
        """状態取得
        Returns:
            util.status.Status: 状態
        """
        info = list()
        if self._state == util.status.State.DISCONNECT:
            state = util.status.State.ERROR
            info.append("【異常名】通信異常")
        else:
            state = self._state
            info.append(f"連携中ロボット:{[r.domain.name for r in self._related_robot]}")
        return util.status.Status(
            name=self.domain.name,
            state=state,
            location=self.domain.location,
            info=info,
        )

    def fetch_command(self) -> list:
        """手動操作取得
        Returns:
            list: 操作内容
        """
        return [
            Button(label="点灯", func="turn_on"),
            Button(label="消灯", func="turn_off"),
        ]

    async def accept(self, robot:robot.Node[robot.Domain]) -> bool:
        """連携許可
        Args:
            robot (robot.Node): ロボット
        """
        if not robot.domain.location:
            return True
        if util.map._is_inside(robot.domain.location, self.domain.area_list):
            await self.turn_on(robot)
        else:
            await self.turn_off(robot)
        return True

    async def cancel(self, robot:robot.Node[robot.Domain]) -> bool:
        """連携終了
        Args:
            robot (robot.Node): ロボットノード
        """
        await self.turn_off(robot)

    async def turn_on(self, robot:robot.Node|None=None):
        """点灯
        Args:
            robot (robot.Node|None): ロボットノード
                Noneで強制点灯
        """
        if robot in self._related_robot:
            return
        elif robot is not None:
            self._related_robot.add(robot)
        await self._access.write(self.domain.write_address, True)
        self._state = util.status.State.ACTIVE
        self._logger.info(f"turn on")

    async def turn_off(self, robot:robot.Node|None=None):
        """消灯
        Args:
            robot (robot.Node|None): ロボットノード
                Noneで強制消灯
        """
        if robot is None:
            self._related_robot.clear()
        elif robot in self._related_robot:
            self._related_robot.remove(robot)
            if self._related_robot:
                return
        else:
            return
        await self._access.write(self.domain.write_address, False)
        self._state = util.status.State.WAITING
        self._logger.info(f"turn off")
