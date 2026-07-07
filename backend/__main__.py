# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import asyncio
import sys
import subprocess

from src.repository import repository
from src import freedom


async def run():
    await freedom.main.Node.init(sys.argv[1])
    repository.retrieve(freedom.log.Node)[0].make_logger(__name__).info(f"launch: {sys.argv[1:]}")
    try:
        while True:
            await asyncio.sleep(0)
    except asyncio.CancelledError:
        repository.retrieve(freedom.log.Node)[0].make_logger(__name__).info("close")


if __name__=="__main__":
    if len(sys.argv) < 2:
        sys.argv.append("dummy")
    if len(sys.argv) < 3:
        sys.argv.append("launch")
        while True:
            subprocess.run([sys.executable] + sys.argv)
    asyncio.run(run())
