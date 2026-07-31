/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { registerDictCreateWithBlock } from "./DictCreateWith";
import { registerFieldArea } from "./FieldArea";
import { registerFieldLocation } from "./FieldLocation";
import { PlcGetAddress } from "./PlcGetAddress";

export const extensions = [
  registerDictCreateWithBlock,
  registerFieldArea,
  registerFieldLocation,
  PlcGetAddress,
];
