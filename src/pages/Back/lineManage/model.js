import { lineTagQuery, lineTagInfo, lineTagSave, lineTagIsEnable } from '@/services/back';

export default {
  namespace: 'lineManage', // 数据采集

  state: {
    list: {
      total: 0, // 总数
      current: 1, // 当前页
      records: [],
    },
    detail: {},
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(lineTagQuery, payload);
      yield put({
        type: 'saveList',
        payload: response.data,
      });
    },
    *fetchDetail({ payload }, { call, put }) {
      const response = yield call(lineTagInfo, payload);
      yield put({
        type: 'saveDetail',
        payload: response.data,
      });
    },
    *switch({ payload, callback = () => {} }, { call }) {
      // 启用开关
      yield call(lineTagIsEnable, payload);
      callback();
    },
    *update({ payload, callback = () => {} }, { call }) {
      // 编辑保存
      yield call(lineTagSave, payload);
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

    // 保存查询参数
    saveParam(state, { payload }) {
      return {
        ...state,
        paramsTransaction: {
          payload,
        },
      };
    },
  },
};
