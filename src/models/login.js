import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { message } from 'antd';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import {
  // setAuthority
  setToken,
  setPermiss,
  setRole,
  setUserId,
} from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
// import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    userId: 0,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: 'ok',
          token: response.data,
        },
      });
      // 登陆成功
      if (response.code === 200) {
        // reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      const response = yield call(getFakeCaptcha, payload);
      if (response.message === 'success') {
        message.info('短信已发送，请注意查收');
      } else {
        message.error(response.message);
      }
    },

    *logout(_, { put }) {
      // reloadAuthorized();
      if (global.location.pathname !== '/user/login') {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            token: 'logout',
            // currentAuthority: 'guest',
          },
        });
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setToken(payload.token.token);
      setPermiss(JSON.stringify(payload.token.systemPermissions));
      setRole(payload.token.role);
      setUserId(payload.token.userId);
      return {
        ...state,
        status: payload.status,
        userId: payload.token.userId,
      };
    },
  },
};
