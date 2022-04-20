import {
  dataCollectionGets,
  dataCollectionInfo,
  dataCollectionSave,
  dataCollectionIsEnable,
  collectHistoryGets,
  testDataCollection,
  dataCollectionExport,
  dataCollectionImport,
} from '@/services/back';

export default {
  namespace: 'dataCollection', // 数据采集

  state: {
    list: {
      total: 0, // 总数
      current: 1, // 当前页
      records: [],
    },
    historyList: {
      // 采集历史列表
      total: 0, // 总数
      current: 1, // 当前页
      records: [],
    },
    detail: {},
    misfireList: ['IgnoreMisfires', 'FireAndProceed', 'DoNothing'],
    paramsTransaction: {},
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(dataCollectionGets, payload);
      yield put({
        type: 'saveList',
        payload: response.data,
      });
    },
    *fetchDetail({ payload }, { call, put }) {
      const response = yield call(dataCollectionInfo, payload);
      yield put({
        type: 'saveDetail',
        payload: response.data,
      });
    },
    *getHistory({ payload, callback }, { call, put }) {
      // 编辑保存
      const response = yield call(collectHistoryGets, payload);
      yield put({
        type: 'savehistoryList',
        payload: response.data,
      });
      if (callback) callback();
    },
    *switch({ payload, callback = () => {} }, { call }) {
      // 启用开关
      yield call(dataCollectionIsEnable, payload);
      callback();
    },
    *update({ payload, callback }, { call }) {
      // 编辑保存
      yield call(dataCollectionSave, payload);
      if (callback) callback();
    },
    *testDataCollection({ payload }, { call }) {
      // 编辑保存
      yield call(testDataCollection, payload);
    },

    *exportData({ payload }, { call }) {
      // 导出数据
      const response = yield call(dataCollectionExport, payload);
      global.location.href = response;
    },

    *importData({ payload, callback = () => {} }, { call }) {
      // 导入数据
      yield call(dataCollectionImport, payload);
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
    savehistoryList(state, action) {
      return {
        ...state,
        historyList: action.payload,
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

    changeDataType(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          dataDealType: payload,
        },
      };
    },

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
