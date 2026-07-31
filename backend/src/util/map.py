# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

import dataclasses


@dataclasses.dataclass
class Area:
    """エリア設定
    Args:
        name (str): 名前
        vertex_list (list[list[float]]): 頂点リスト
            右または左回りにすること
    """
    name:str
    vertex_list:list[list[float]]

def _is_inside(location:list[float,float], area_list:list[Area]) -> bool:
    """エリア内判定
    レイキャスティング法でエリア内判定
    Args:
        location (list[float,float]): 緯度, 経度
        area_list (list[util.map.Area]): エリアリスト
    Returns:
        bool: エリア内判定
    """
    px, py = location
    inside = False
    for area in area_list:
        for i in range(len(area.vertex_list)):
            x1, y1 = area.vertex_list[i]
            x2, y2 = area.vertex_list[(i + 1) % len(area.vertex_list)]  # 次の頂点
            if (y1 > py) != (y2 > py) and px < ((x2 - x1) * (py - y1) / (y2 - y1) + x1):
                inside = not inside
        if inside:
            break
    return inside
