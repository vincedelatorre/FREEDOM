# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import logging


class Adapter(logging.LoggerAdapter):
    def __init__(self, logger, prefix:str, extra = None, merge_extra = False):
        super().__init__(logger, extra, merge_extra)
        self._prefix = prefix

    def process(self, msg, kwargs):
        if self._prefix:
            return f"\"{self._prefix} {msg}\"", kwargs
        return f"\"{msg}\"", kwargs
