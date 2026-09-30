/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
