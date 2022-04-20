import { queryDownloadRecord, downloadDelete } from '@/services/api';

export default {
  namespace: 'center',

  state: {
    paramsTransaction: {},
    data: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryDownloadRecord, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *deleteDownload({ payload, callback = () => {} }, { call }) {
      yield call(downloadDelete, payload);
      callback();
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
  },
};
