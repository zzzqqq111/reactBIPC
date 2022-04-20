import { queryDownloadRecord } from '@/services/api';

export default {
  namespace: 'download',

  state: {
    records: [], // 下载记录
  },

  effects: {
    *fetchRecord(_, { call, put }) {
      const response = yield call(queryDownloadRecord);
      yield put({
        type: 'saveRecord',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },

  reducers: {
    saveRecord(state, { payload }) {
      return {
        ...state,
        records: payload,
      };
    },
  },
};
