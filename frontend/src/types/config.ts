/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { DataResponse, FormResponse } from "@/components/config/ConfigForm";


/** 各フォーム種類 */
export type FormType =
  | "text"
  | "number"
  | "switch"
  | "checkbox"
  | "radio"
  | "select"
  | "color"
  | "location"
  | "area"
  | "data"
  | "table"
  | "node"
  | "dialog"
  | "mapImage"
  | "mapDefaultView"
  | "intersectionArea";

/** 抽象フォーム内容 */
interface BaseFormResponse {
  /** フォーム種類 */
  type: FormType;
  /** 設定ラベル */
  label: string;
  /**
   * 必須項目
   * @defaultValue true
   */
  required?: boolean;
}

/** 文字入力フォーム内容 */
export interface TextFormResponse extends BaseFormResponse {
  /** フォーム種類 */
  type: "text";
  /** 接頭辞 */
  prefix?: string;
  /** 接尾辞 */
  suffix?: string;
  /** 複数行 */
  multiline?: boolean;
}

/** 数値入力フォーム内容 */
export interface NumberFormResponse extends BaseFormResponse {
  /** フォーム種類 */
  type: "number";
  /** 接頭辞 */
  prefix?: string;
  /** 接尾辞 */
  suffix?: string;
  /** 整数入力 */
  integer?: boolean;
  /** 最大値 */
  min?: number;
  /** 最小値 */
  max?: number;
}

/** スイッチフォーム内容 */
export interface SwitchFormResponse extends BaseFormResponse {
  /** フォーム種類 */
  type: "switch";
}

/** チェックボックスフォーム内容 */
export interface CheckboxFormResponse extends BaseFormResponse {
  /** フォーム種類 */
  type: "checkbox";
}

/** ラジオボタンフォーム内容 */
export interface RadioFormResponse extends BaseFormResponse {
  /** フォーム種類 */
  type: "radio";
  /** 選択内容 */
  items: { [key: string]: any };
  /** 横並び表示 */
  row?: boolean;
}

/** 選択入力フォーム内容 */
export interface SelectFormResponse extends BaseFormResponse {
  /** フォーム種類 */
  type: "select";
  /** 選択内容 */
  items: { [key: string]: any };
}

/** 色入力フォーム内容 */
export interface ColorFormResponse extends BaseFormResponse {
  /** フォーム種類 */
  type: "color";
}

/** 位置フォーム内容 */
export interface LocationFormResponse extends BaseFormResponse {
  /** フォーム種類 */
  type: "location";
}

/** エリアフォーム内容 */
export interface AreaFormResponse extends BaseFormResponse {
  /** フォーム種類 */
  type: "area";
}

/** データフォーム内容 */
export interface DataFormResponse extends BaseFormResponse {
  /** フォーム種類 */
  type: "data";
  /** フォーム内容 */
  forms: FormResponse;
}

/** テーブルフォーム内容 */
export interface TableFormResponse extends BaseFormResponse {
  /** フォーム種類 */
  type: "table";
  /** 1行分の初期値 */
  default: DataResponse;
  /** フォーム内容 */
  forms: FormResponse;
  /** 重複チェック設定 */
  unique?: string[];
  /** テーブルの横幅 */
  width?: number | string;
  /** テーブルの縦幅 */
  height?: number;
}

/** ノードフォーム内容 */
export interface NodeFormResponse extends BaseFormResponse {
  /** フォーム種類 */
  type: "node";
  /** 初期値 */
  default: DataResponse;
  /** フォーム内容 */
  forms: FormResponse;
  /** 重複チェック設定 */
  unique?: string[];
  /**
   * 表示列数
   * @defaultValue 3
   */
  columns?: number;
}

/** ダイアログフォーム内容 */
export interface DialogFormResponse extends BaseFormResponse {
  /** フォーム種類 */
  type: "dialog";
  /** フォーム定義 */
  forms: FormResponse;
  /** 初期値 */
  default?: DataResponse;
  /** ダイアログ幅 */
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  /** ダイアログをフル幅にするか */
  fullWidth?: boolean;
}

/** 地図画像フォーム内容 */
export interface MapImageFormResponse extends BaseFormResponse {
  /** フォーム種類 */
  type: "mapImage";
}

/** 地図初期表示フォーム内容 */
export interface MapDefaultViewFormResponse extends BaseFormResponse {
  /** フォーム種類 */
  type: "mapDefaultView";
}

export interface IntersectionFormResponse extends BaseFormResponse {
  type: "intersectionArea";
  // 必要なら追加プロパティ（例: lanes, signalsなど）
}

/** 各フォーム内容 */
export type FormResponseType =
  | TextFormResponse
  | NumberFormResponse
  | SwitchFormResponse
  | CheckboxFormResponse
  | RadioFormResponse
  | SelectFormResponse
  | ColorFormResponse
  | LocationFormResponse
  | AreaFormResponse
  | DataFormResponse
  | TableFormResponse
  | NodeFormResponse
  | DialogFormResponse
  | MapImageFormResponse
  | MapDefaultViewFormResponse
  | IntersectionFormResponse;
