/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
      button: {
          textTransform: "none"
      }
  },
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  components: {
    MuiSnackbar: {
      defaultProps: {
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      },
    },
  },
});

export default theme;
