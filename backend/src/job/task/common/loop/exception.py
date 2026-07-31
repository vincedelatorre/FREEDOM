# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

class LoopBreak(Exception):
    """ループを抜けるための例外"""
    pass

class LoopContinue(Exception):
    """ループの次の繰り返しに進むための例外"""
    pass
