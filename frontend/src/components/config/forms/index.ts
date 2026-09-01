/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Validate, FieldValues } from "react-hook-form";
import { FormType, FormResponseType } from '@/types/config'
import TextForm from './TextForm';
import NumberForm from './NumberForm';
import SwitchForm from './SwitchForm';
import CheckboxForm from './CheckboxForm';
import RadioForm from "./RadioForm";
import SelectForm from './SelectForm';
import MultiSelectForm from './MultiSelectForm';
import ColorForm from './ColorForm';
import LocationForm from './LocationForm';
import AreaForm from './AreaForm';
import DataForm from './DataForm';
import TableForm from "./TableForm";
import NodeForm from './NodeForm';
import DialogForm from './DialogForm';
import MapImageForm from './MapImageForm';
import MapDefaultViewForm from "./MapDefaultViewForm";
import IntersectionForm from './IntersectionForm';


/** 各フォーム引数
 * @typeParam Type 各設定内容
 */
export interface FormProps<Type = FormResponseType> {
  /** 設定名 */
  name: string;
  /** 設定内容 */
  form: Type;
  /** 無効 */
  disabled?: boolean;
  /** 検証イベント */
  validate?: Record<string, Validate<any, FieldValues>>
}

/** 各フォーム種類とコンポーネントの紐づけ */
export const FormMap: Record<FormType, React.ComponentType<any>> = {
  text: TextForm,
  number: NumberForm,
  switch: SwitchForm,
  checkbox: CheckboxForm,
  radio: RadioForm,
  select: SelectForm,
  multiSelect: MultiSelectForm,
  color: ColorForm,
  location: LocationForm,
  area: AreaForm,
  data: DataForm,
  table: TableForm,
  node: NodeForm,
  dialog: DialogForm,
  mapImage: MapImageForm,
  mapDefaultView: MapDefaultViewForm,
  intersectionArea: IntersectionForm,
};
