/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { AxiosError, AxiosRequestConfig, Method } from 'axios'
import axios from '@/lib/axios';


function useApi<T>(
  method: Method,
  url: string,
  initialState: T | null = null,
  data?: any,
  headers?: Map<string, string>,
  ...requestConfig: any
){
  const [response, setResponse] = useState<T | null>(initialState);
  const [error, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState(false);

  const config: AxiosRequestConfig = {
    ...requestConfig,
    url: url,
    method: method,
    data,
    headers: {
      ...headers,
    },
  }
  const request = () => {
    setLoading(true);
    axios.request(config)
      .then(response => setResponse(response?.data))
      .catch((error: AxiosError) => setError(error))
      .finally(() => setLoading(false));
  };

  return [response, error, loading, { setResponse, request }];
}

export default useApi;
