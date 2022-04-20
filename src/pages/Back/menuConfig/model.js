import { navigateMenuList, navigateMenuAdd } from '@/services/back';
import { directoryDelete, directoryQuery } from '@/services/transaction';

export default {
  namespace: 'menuConfig', // 指标库

  state: {
    list: [],
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(navigateMenuList, payload);
      yield put({
        type: 'saveList',
        payload: response.data,
      });
      return response.data;
    },

    *update({ payload, callback = () => {} }, { call }) {
      // 编辑保存/增加 传编号与否来判断是新增还是编辑
      const response = yield call(navigateMenuAdd, payload);
      // console.log(response);
      callback();
      return response.data;
    },

    *deleteDir({ payload, callback = () => {} }, { call }) {
      yield call(directoryDelete, payload);
      callback();
    },

    *directoryQuery({ payload, callback = () => {} }, { call, put }) {
      const response = yield call(directoryQuery, payload);
      yield put({
        type: 'menuList',
        payload: response.data,
      });
      callback();
      return response.data;
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
