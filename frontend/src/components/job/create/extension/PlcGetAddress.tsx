/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import * as Blockly from "blockly/core";


/** PLCの選択に応じて、アドレスの選択肢を動的に変更する拡張機能 */
export function PlcGetAddress() {
  useEffect(() => {
    Blockly.Extensions.register(
      "plc_get_address_extension",
      function(this: Blockly.Block) {
        const plcField = this.getField("plc") as Blockly.FieldDropdown
        const addressField = this.getField("address") as Blockly.FieldDropdown
        const addressOptions = addressField.getOptions(false)

        const refreshOptions = (plc:string) => {
          const options = addressOptions.filter(([, value]) => (
            JSON.parse(value as string)[0] === plc
          ));
          if (options.length === 0) {
            options.push(["設定なし", JSON.stringify([plc, null])]);
          }
          addressField.setOptions(options);
        };

        refreshOptions(this.getFieldValue('plc') || 'none');

        plcField.setValidator((newValue:string) => {
          refreshOptions(newValue);
          return newValue;
        });
      }
    )

    return () => {
      Blockly.Extensions.unregister('plc_get_address_extension');
    };
  }, []);

  return <></>
}
