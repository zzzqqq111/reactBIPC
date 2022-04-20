import {
  dataImportList,
  dataImportDownload,
  dataImportUploadListData,
  uploadHistoryDownload,
  uploadPreviewDownload,
  dataImportUploadData,
} from '@/services/back';

export default {
  namespace: 'downloadExport',
  state: {
    list: {
      total: 0, // 总数
      current: 1, // 当前页
      records: [],
    },
    historylist: {
      total: 0, // 总数
      current: 1, // 当前页
      records: [],
    },
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(dataImportList, payload);
      yield put({
        type: 'saveList',
        payload: response.data,
      });
    },
    *fetchHistoryList({ payload }, { call, put }) {
      const response = yield call(dataImportUploadListData, payload);
      yield put({
        type: 'historylist',
        payload: response.data,
      });
    },
    *uploadData({ payload, callback = () => {} }, { call }) {
      yield call(dataImportUploadData, payload);
      callback();
    },
    *downloadHistoryData({ payload }, { call }) {
      const response = yield call(uploadHistoryDownload, payload);
      global.location.href = response;
    },
    *uploadPreviewDownload({ payload }, { call, put }) {
      const response = yield call(uploadPreviewDownload, payload);
      yield put({
        type: 'previewList',
        payload: response.data,
      });
    },
    *downloadTemplate({ payload }, { call }) {
      const response = yield call(dataImportDownload, payload);
      global.location.href = response;
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
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

    historylist(state, action) {
      return {
        ...state,
        historylist: action.payload,
      };
    },

    previewList(state, action) {
      return {
        ...state,
        previewList: action.payload,
      };
    },
  },
};
