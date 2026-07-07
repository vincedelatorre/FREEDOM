# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses

from src import abstract


@dataclasses.dataclass
class DefaultView:
    """地図初期設定
    Args:
        center (list[float,float]]): 座標 (緯度,経度)
        zoom (int): 拡大
        rotate (float): 回転 (deg)
    """
    center:list[float, float] = dataclasses.field(default_factory=lambda:[0.0, 0.0])
    zoom:int = 0
    rotate:float = 0.0


@dataclasses.dataclass
class Image:
    """地図画像設定
    Args:
        name (str): 画像名
        visible (bool): 表示/非表示
        corners (list[list[float,float,float,float]]): 角座標 (左上,右上,左下,右下)
    """
    name:str
    visible:bool
    corners:list[list[float,float,float,float]]


@dataclasses.dataclass
class Domain(abstract.Domain):
    """地図設定
    Args:
        default_view (list[float, float, float, float]): 位置設定
        image_list (list[Image]): 画像設定
    """
    default_view:DefaultView = dataclasses.field(default_factory=DefaultView)
    image_list:list[Image] = dataclasses.field(default_factory=list)

    @classmethod
    def make_form(cls):
        """設定フォーム作成
        Returns:
            dict: 設定フォーム
        """
        return {
            "default_view": {
                "type": "mapDefaultView",
                "label": "位置設定",
            },
            "image_list": {
                "type": "mapImage",
                "label": "画像設定",
            },
        }

    def __post_init__(self):
        """初期化後処理"""
        if type(self.default_view) is not DefaultView:
            self.default_view = DefaultView(**self.default_view)
        for i, image in enumerate(self.image_list):
            if type(image) is not Image:
                self.image_list[i] = Image(**image)
