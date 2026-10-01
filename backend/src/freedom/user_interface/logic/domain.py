# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

from aiohttp import web
import importlib
import json
import re
import typing

from src import freedom, util
from src.repository import repository


NODE_NAME_PATTERN = re.compile(r"^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$")
SENSITIVE_KEY_PATTERN = re.compile(r"(dsn|passw(or)?d|pwd|secret|token|api_?key|private_?key|credential|^conf$)", re.IGNORECASE)
FILTER_VALUE_TYPES = (str, int, float, bool, type(None))


def is_sensitive_key(key:str) -> bool:
    """機密項目判定
    Args:
        key (str): 項目名
    Returns:
        bool: 機密項目ならTrue
    """
    return key.startswith("_") or bool(SENSITIVE_KEY_PATTERN.search(key))


def redact(value:typing.Any) -> typing.Any:
    """機密項目を除去
    Args:
        value (Any): JSON変換済みの値
    Returns:
        Any: 機密項目を除去した値
    """
    if isinstance(value, dict):
        return {k: redact(v) for k, v in value.items() if not is_sensitive_key(str(k))}
    if isinstance(value, list):
        return [redact(v) for v in value]
    return value


def parse_filter(body:typing.Any) -> dict:
    """ドメイン検索条件の検証
    Args:
        body (Any): リクエストボディ
    Returns:
        dict: 検索条件
    Raises:
        ValueError: 不正な検索条件
    """
    if not isinstance(body, dict):
        raise ValueError("body must be an object")
    for k, v in body.items():
        if not isinstance(k, str) or is_sensitive_key(k) or not isinstance(v, FILTER_VALUE_TYPES):
            raise ValueError(f"invalid filter: {k}")
    return body


class Domain(web.View):
    def __init__(self, request:web.Request):
        """ドメインリクエスト
        Args:
            request (web.Request): リクエスト
        """
        super().__init__(request)
        self._logger = repository.retrieve(freedom.log.Node)[0].make_logger(__name__)

    async def post(self) -> web.Response:
        """ドメイン取得リクエスト
        機密項目(DSN、パスワード、トークン等)は除去して返却する
        Bodies:
            ドメイン検索
        Returns:
            web.Response: ドメインリスト
        """
        name = self.request.match_info["node"]
        body = dict()
        if not NODE_NAME_PATTERN.match(name):
            return web.json_response({"error": "invalid_node"}, status=400)
        try:
            body = parse_filter(await self.request.json() if self.request.can_read_body else dict())
        except Exception as e:
            self._logger.warning(f"post: invalid body node={name} - {type(e)}")
            return web.json_response({"error": "invalid_body"}, status=400)
        try:
            node = importlib.import_module(f"src.{name}").Node
            domains = json.loads(util.json.dumps([node.domain for node in repository.retrieve(node, **body)]))
            return web.json_response(redact(domains), dumps=util.json.dumps)
        except Exception as e:
            self._logger.error(f"post: {type(e)} - {e} node={name} filter_keys={list(body)}")
            return web.json_response({"error": "internal_error"}, status=500)
