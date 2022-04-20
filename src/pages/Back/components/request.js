/**
 *  上传和下载请求
 */
/* eslint-disable no-use-before-define */
import axios from 'axios';
import { message } from 'antd';
import { fileUploadSign } from '@/services/api';

axios.interceptors.request.use(
  config => {
    return fileUploadSign()
      .then(res => {
        config = config || {};
        config.params = config.params ? config.params : {};
        const headtoken = res.data;
        config.headers = {
          token: headtoken,
        };
        return config;
      })
      .catch(error => {
        message.error({
          message: error,
        });
        return Promise.reject(error);
      });
  },
  error => {
    message.error({
      message: '加载超时',
    });
    return Promise.reject(error);
  }
);

export function fileRequest(url, options) {
  const defaultOptions = {
    headers: {
      'content-type': 'multipart/form-data',
    },
    withCredentials: true,
    url,
    method: 'POST',
  };
  const newOptions = { ...options, ...defaultOptions };
  return axios.request(newOptions);
}

export function fileDownloadRequest(url, options) {
  const formData = new FormData();
  if (options) {
    Object.keys(options).forEach(item => {
      formData.append(item, options[item]);
    });
  }
  const defaultOptions = {
    headers: {
      'content-type': 'multipart/form-data',
    },
    withCredentials: true,
    url,
    method: 'POST',
    data: formData,
    responseType: 'blob',
  };
  return axios.request(defaultOptions);
}
