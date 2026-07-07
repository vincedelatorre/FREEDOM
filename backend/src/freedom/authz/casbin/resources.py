# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

from importlib import resources


def read_model_conf() -> str:
    return (resources.files("src.freedom.authz.casbin") / "model.conf").read_text(encoding="utf-8")

def read_policy_seed_csv() -> str:
    return (resources.files("src.freedom.authz.casbin") / "policy.seed.csv").read_text(encoding="utf-8")
