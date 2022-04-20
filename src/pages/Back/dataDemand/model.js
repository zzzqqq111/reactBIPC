import {
  dataJobGetAdminList,
  dataJobAdminUpdateIndicate,
  dataJobDownload,
} from '@/services/transaction';

export default {
  namespace: 'adminDataDemand',
  state: {
    historyList: {
      total: 0, // 总数
      current: 1, // 当前页
      records: [],
    },
  },

  effects: {
    *fetchHistoryList({ payload }, { call, put }) {
      const response = yield call(dataJobGetAdminList, payload);
      yield put({
        type: 'saveList',
        payload: response.data,
      });
    },
    *update({ payload, callback = () => {} }, { call }) {
      // 编辑保存
      yield call(dataJobAdminUpdateIndicate, payload);
      callback();
    },
    *downloadHistory({ payload }, { call }) {
      // 下载数据记录
      const response = yield call(dataJobDownload, payload);
      global.location.href = response;
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        historyList: action.payload,
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
    changeTime(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          dataJob: {
            ...state.detail.dataJob,
            ...payload,
          },
        },
      };
    },
  },
};
