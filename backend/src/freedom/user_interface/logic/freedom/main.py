# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

from aiohttp import web
import asyncio

from src.repository import repository
from src import freedom


class Config(web.View):
    def __init__(self, request:web.Request) -> None:
        super().__init__(request)
        self._logger = repository.retrieve(freedom.log.Node)[0].make_logger(__name__)

    async def _run_command(self, cmd:list[str]) -> str:
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await process.communicate()
        if stderr:
            raise Exception(f"Command failed: {stderr.decode().strip()}")
        return stdout.decode().strip()

    async def get(self) -> web.Response:
        """設定フォーム取得リクエスト
        Returns:
            web.Response: 設定フォーム
        """
        try:
            #TODO: リモート先含めた全gitブランチの取得
            #TODO: defaultValueに現在のブランチ optionsに取得ブランチ一覧を入れる
            return web.json_response({
            "version": {
                "label": "バージョン名",
                "helperText": "プログラムのバージョン名を指定します",
                "type": "select",
                "defaultValue": "TODO",
                "options": ["TODO"],
            },
        })
        except Exception as e:
            self._logger.error(f"get: {type(e)} - {e}")
            return web.Response(text=f"{type(e)} - {e}", status=500)

    async def put(self) -> web.Response:
        """プログラム再起動リクエスト
        Returns:
            web.Response: レスポンス
        """
        try:
            request = await self.request.json()
            self._logger.info(f"put: {request}")
            #TODO: git checkout
            for task in asyncio.all_tasks():
                if task is not asyncio.current_task():
                    task.cancel()
            return web.Response()
        except Exception as e:
            self._logger.error(f"put: {type(e)} - {e}")
            return web.Response(text=f"{type(e)} - {e}", status=500)

    async def post(self) -> web.Response:
        """プログラム更新リクエスト
        Returns:
            web.Response: レスポンス
        """
        try:
            request = await self.request.json()
            self._logger.info(f"post: {request}")
            #TODO: git pull & git checkout
            for task in asyncio.all_tasks():
                if task is not asyncio.current_task():
                    task.cancel()
            return web.Response()
        except Exception as e:
            self._logger.error(f"post: {type(e)} - {e}")
            return web.Response(text=f"{type(e)} - {e}", status=500)

    async def patch(self) -> web.Response:
        """バージョン同期リクエスト
        Returns:
            web.Response: レスポンス
        """
        try:
            #TODO: git fetch
            return web.Response()
        except Exception as e:
            self._logger.error(f"patch: {type(e)} - {e}")
            return web.Response(text=f"{type(e)} - {e}", status=500)
