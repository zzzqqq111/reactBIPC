import { dbInstanceQuery, dbInstanceInfo, dbInstanceSave, dbInstanceDelete } from '@/services/back';

export default {
  namespace: 'dbInstance', // 指标库

  state: {
    list: [],
    detail: {},
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(dbInstanceQuery, payload);
      yield put({
        type: 'saveList',
        payload: response.data,
      });
    },
    *fetchDetail({ payload }, { call, put }) {
      yield put({
        type: 'saveDetail',
        payload: (yield call(dbInstanceInfo, payload)).data,
      });
    },
    // 编辑保存
    *update({ payload, callback = () => {} }, { call }) {
      yield call(dbInstanceSave, payload);
      callback();
    },
    // 删除实例
    *delete({ payload, callback = () => {} }, { call }) {
      yield call(dbInstanceDelete, payload);
      callback();
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
    resetDetail(state) {
      return {
        ...state,
        detail: {},
      };
    },
  },
};
