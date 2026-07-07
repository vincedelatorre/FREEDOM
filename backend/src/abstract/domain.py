# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import abc
import dataclasses


@dataclasses.dataclass
class Domain(abc.ABC):
    """抽象ドメイン
    設定DBへの保存や、UIからのdomainリクエストで返す変数を管理するクラス
    設定DBにはクラス変数のみ保存される
    domainリクエストにはクラス変数とインスタンス変数が返却される
    util.json.dumpsでJSON形式に変換できない型は宣言しないこと
    """
    @classmethod
    @abc.abstractmethod
    def make_form(cls) -> dict:
        """設定画面用フォーム生成
        UIの/config/[...node]ページに表示される設定フォームの形式を返す
        フォームの形式はfrontend/components/config/form.tsxを参照
        Returns:
            dict: 設定フォーム
        """
        raise NotImplementedError("Subclasses must implement make_form method")

    def __post_init__(self):
        """初期化後処理
        ここで宣言したインスタンス変数は設定DBへ保存しない
        """
        pass
