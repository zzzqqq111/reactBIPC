import { saveApi, apiList, apiInfo } from '@/services/back';

export default {
  namespace: 'apiManage', // 数据采集

  state: {
    list: {
      total: 0, // 总数
      current: 1, // 当前页
      records: [],
    },
    detail: {},
    paramsTransaction: {},
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(apiList, payload);
      yield put({
        type: 'saveList',
        payload: response.data,
      });
    },
    *fetchDetail({ payload }, { call, put }) {
      const response = yield call(apiInfo, payload);
      yield put({
        type: 'saveDetail',
        payload: response.data,
      });
    },
    *update({ payload, callback = () => {} }, { call }) {
      // 编辑保存
      yield call(saveApi, payload);
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

    changeParams(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          parameter: payload,
        },
      };
    },
  },
};
