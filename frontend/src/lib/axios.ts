/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from "axios";

let instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: '',
  },
});

// 本番環境以外はリクエストとレスポンス時にデバッグ用ログを出力する
if (process.env.REACT_APP_ENV !== 'production') {
  instance.interceptors.request.use(
    (config) => {
      console.log(config);
      return config;
    },
    (error) => {
      console.log(error);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      console.log(response);
      return response;
    },
    (error) => {
      console.log(error);
      return Promise.reject(error);
    }
  );
}

export default instance;
