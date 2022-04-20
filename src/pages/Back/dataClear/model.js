import {
  DataRinseQuery,
  DataRinseInfo,
  DataRinseSave,
  DataRinseIsEnable,
  DataRinseHistory,
  testDataCollection,
  dataCollectionExport,
  dataCollectionImport,
  tableCollectDestDb,
  DataRinseReReTry,
  DataRinseReTest,
} from '@/services/back';

export default {
  namespace: 'dataClear', // 数据采集

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
    paramsTransaction: {},
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(DataRinseQuery, payload);
      yield put({
        type: 'saveList',
        payload: response.data,
      });
    },
    *fetchDetail({ payload }, { call, put }) {
      const response = yield call(DataRinseInfo, payload);
      yield put({
        type: 'saveDetail',
        payload: response.data,
      });
    },
    *getHistory({ payload, callback }, { call, put }) {
      // 编辑保存
      const response = yield call(DataRinseHistory, payload);
      yield put({
        type: 'savehistoryList',
        payload: response.data,
      });
      if (callback) callback();
    },
    *destDbQuery({ payload }, { call, put }) {
      // 获取目标库
      const response = yield call(tableCollectDestDb, payload);
      yield put({
        type: 'saveDestDb',
        payload: response.data,
      });
    },
    *switch({ payload, callback = () => {} }, { call }) {
      // 启用开关
      yield call(DataRinseIsEnable, payload);
      callback();
    },
    *update({ payload, callback = () => {} }, { call }) {
      // 编辑保存
      yield call(DataRinseSave, payload);
      callback();
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

    *DataRinseReTest({ payload }, { call }) {
      // 测试
      yield call(DataRinseReTest, payload);
    },
    *DataRinseReReTry({ payload }, { call }) {
      // 重采
      yield call(DataRinseReReTry, payload);
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
    saveDestDb(state, action) {
      return {
        ...state,
        destDbList: action.payload,
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
