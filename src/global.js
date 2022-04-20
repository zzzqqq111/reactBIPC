import React from 'react';
import { notification } from 'antd';

window.React = React;
window.globalInfo = false;

if (global.WebSocket) {
  // 创建WebSocket连接
  const socket = new WebSocket('ws://localhost:26480/echo');

  // 连接成功
  socket.addEventListener('open', () => {
    socket.send('get_serial_number');

    notification.success({
      key: 'socket',
      message: '密钥已成功连接',
      description: '为了能正常访问页面,请不要关闭密钥!',
    });
  });

  // 连接关闭
  socket.addEventListener('close', () => {
    if (window.location.pathname !== '/user/login') {
      /* eslint-disable no-underscore-dangle */
      window.g_app._store.dispatch({
        type: 'login/logout',
      });
    }

    notification.error({
      key: 'socket',
      message: '密钥已关闭',
      description: '请重新运行密钥，并刷新页面',
    });
  });
}

document.oncontextmenu = function() {
  return false;
};
