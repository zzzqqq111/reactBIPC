import {
  tableCollectQuery,
  tableCollectsave,
  tableCollectInfo,
  tableCollectExport,
  tableCollectImport,
  tableCollectTest,
  tableCollectIsEnable,
  tableCollectDestDb,
  tableCollectFromDb,
  tableCollectReTry,
  tableCollectHistory,
  tableCollectDbInstanceQuery,
  tableCollectIsSysnc,
} from '@/services/back';

export default {
  namespace: 'singleDataCollection', // 数据采集

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
      const response = yield call(tableCollectQuery, payload);
      yield put({
        type: 'saveList',
        payload: response.data,
      });
    },
    *fetchDetail({ payload, callback = () => {} }, { call, put }) {
      const response = yield call(tableCollectInfo, payload);
      yield put({
        type: 'saveDetail',
        payload: response.data,
      });
      callback(response.data);
    },
    *destDbQuery({ payload, callback = () => {} }, { call, put }) {
      const response = yield call(tableCollectDestDb, payload);
      yield put({
        type: 'saveDestDb',
        payload: response.data,
      });
      callback();
    },
    *dbInstanceQuery({ payload }, { call, put }) {
      const response = yield call(tableCollectDbInstanceQuery, payload);
      yield put({
        type: 'savedbInstance',
        payload: response.data,
      });
    },

    *fromDbQuery({ payload, callback = () => {} }, { call, put }) {
      const response = yield call(tableCollectFromDb, payload);
      yield put({
        type: 'saveFromDb',
        payload: response.data,
      });
      callback();
    },

    *switch({ payload, callback = () => {} }, { call }) {
      // 启用开关
      yield call(tableCollectIsEnable, payload);
      callback();
    },
    *openSysnc({ payload, callback = () => {} }, { call }) {
      // 启用开关
      yield call(tableCollectIsSysnc, payload);
      callback();
    },
    *update({ payload, callback }, { call }) {
      // 编辑保存
      yield call(tableCollectsave, payload);
      if (callback) callback();
    },
    *testDataCollection({ payload }, { call }) {
      // 测试
      yield call(tableCollectTest, payload);
    },
    *reDataCollection({ payload }, { call }) {
      // 重采
      yield call(tableCollectReTry, payload);
    },
    *getHistory({ payload, callback }, { call, put }) {
      // 编辑保存
      const response = yield call(tableCollectHistory, payload);
      yield put({
        type: 'savehistoryList',
        payload: response.data,
      });
      if (callback) callback();
    },
    *exportData({ payload }, { call }) {
      // 导出数据
      const response = yield call(tableCollectExport, payload);
      global.location.href = response;
    },

    *importData({ payload, callback = () => {} }, { call }) {
      // 导入数据
      yield call(tableCollectImport, payload);
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
    saveDestDb(state, action) {
      return {
        ...state,
        destDbList: action.payload,
      };
    },

    savedbInstance(state, action) {
      return {
        ...state,
        dbInstanceList: action.payload,
      };
    },
    saveFromDb(state, action) {
      return {
        ...state,
        fromDbList: action.payload,
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
    changeData(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          ...payload,
        },
      };
    },
  },
};
