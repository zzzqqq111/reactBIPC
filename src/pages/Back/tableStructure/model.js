import {
  tableStructureAddFields,
  tableStructureInfo,
  tableStructureQuery,
  tableStructureSave,
  tableStructureFieldsInfo,
  tableStructureUpdataFields,
  tableStructureUpdataIndex,
  tableStructureHistory,
  tableStructureDeleteData,
  tableStructureExport,
  tableStructureImport,
  tableStructureFieldsList,
  tableStructureFieldsUpdate,
  dataBaseQueryList,
  tableCategoryList,
  tableStructureUpdate,
  tableStructureDelete,
  tableStructureGet,
  tableStructureUpdateAlias,
} from '@/services/back';

export default {
  namespace: 'tableStructure', // 指标库

  state: {
    list: {
      total: 0, // 总数
      current: 1, // 当前页
      records: [], // 指标库列表
    },
    detail: {}, // 详情数据
    paramsTransaction: {},
    historyList: [],
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      // 获取列表
      const response = yield call(tableStructureQuery, payload);
      yield put({
        type: 'saveList',
        payload: response.data,
      });
      return response.data;
    },

    *fetchFilterList({ payload }, { call }) {
      // 获取列表
      const response = yield call(tableStructureGet, payload);
      return response.data;
    },

    *fetchDetail({ payload }, { call, put }) {
      // 获取详细信息
      const response = yield call(tableStructureInfo, payload);
      yield put({
        type: 'saveDetail',
        payload: response.data,
      });
    },

    *save({ payload, callback = () => {} }, { call }) {
      // 编辑保存/增加 传编号与否来判断是新增还是编辑 新增表
      yield call(tableStructureSave, payload);
      callback();
    },

    *update({ payload, callback = () => {} }, { call }) {
      // 编辑保存/增加 传编号与否来判断是新增还是编辑 新增表
      yield call(tableStructureUpdate, payload);
      callback();
    },

    *addFileds({ payload, callback = () => {} }, { call }) {
      // 新增字段
      yield call(tableStructureAddFields, payload);
      callback();
    },

    *getFiledsInfo({ payload }, { call, put }) {
      // 修改字段
      const response = yield call(tableStructureFieldsInfo, payload);
      yield put({
        type: 'infoDetaial',
        payload: response.data,
      });
    },

    *updataFileds({ payload, callback = () => {} }, { call }) {
      // 修改字段
      yield call(tableStructureUpdataFields, payload);
      callback();
    },

    *updataIndex({ payload, callback = () => {} }, { call }) {
      // 修改字段
      yield call(tableStructureUpdataIndex, payload);
      callback();
    },

    *deleteData({ payload, callback = () => {} }, { call }) {
      // 清除数据
      yield call(tableStructureDeleteData, payload);
      callback();
    },

    *deleteTable({ payload, callback = () => {} }, { call }) {
      // 清除数据
      yield call(tableStructureDelete, payload);
      callback();
    },

    *importData({ payload, callback = () => {} }, { call }) {
      // 清除数据
      yield call(tableStructureImport, payload);
      callback();
    },

    *exportData({ payload }, { call }) {
      // 清除数据
      const response = yield call(tableStructureExport, payload);
      global.location.href = response;
    },

    *fetchDataBaseList({ payload }, { call, put }) {
      // 获取所有数据库
      const response = yield call(dataBaseQueryList, payload);
      yield put({
        type: 'dataBaseList',
        payload: response.data,
      });
    },

    *fetchFieldsList({ payload }, { call, put }) {
      // 字段列表
      const response = yield call(tableStructureFieldsList, payload);
      yield put({
        type: 'fieldsList',
        payload: response.data,
      });
    },

    *updateFieldAtrribute({ payload, callback = () => {} }, { call }) {
      // 清除数据
      yield call(tableStructureFieldsUpdate, payload);
      callback();
    },

    *getHistory({ payload, callback = () => {} }, { call, put }) {
      // 获取历史记录列表
      const response = yield call(tableStructureHistory, payload);
      yield put({
        type: 'savehistoryList',
        payload: response.data,
      });
      callback();
    },

    *tableCatList({ payload }, { call, put }) {
      // 获取分类列表
      const response = yield call(tableCategoryList, payload);
      yield put({
        type: 'getCategoryList',
        payload: response.data,
      });
    },

    *changeParam({ payload }, { put }) {
      // 改变查询条件
      yield put({
        type: 'saveParam',
        payload,
      });
    },
    *resetParam(_, { put }) {
      // 清除查询条件
      yield put({
        type: 'clearParam',
      });
    },

    *updateFieldAlias({ payload, callback = () => {} }, { call }) {
      // 清除数据
      yield call(tableStructureUpdateAlias, payload);
      callback();
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload ? action.payload : state.list,
      };
    },
    dataBaseList(state, action) {
      return {
        ...state,
        dataBaseList: action.payload ? action.payload : state.list,
      };
    },
    fieldsList(state, action) {
      return {
        ...state,
        fieldsList: action.payload || [],
      };
    },
    getCategoryList(state, action) {
      const list = action.payload;
      const arr = [];
      const ret = [];
      list.forEach(item => {
        if (arr.indexOf(item.channelName) === -1) {
          arr.push(item.channelName);
          ret.push({ label: item.channelName, value: item.channelName, children: [] });
        }
      });
      arr.forEach((key, index) => {
        const arr2 = [];
        list.forEach(item => {
          if (key === item.channelName) {
            if (arr2.indexOf(item.particlenName) === -1) {
              arr2.push(item.particlenName);
              ret[index].children.push({ label: item.particlenName, value: item.id });
            }
          }
        });
      });
      return {
        ...state,
        categoryList: ret,
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
    saveParam(state, { payload }) {
      return {
        ...state,
        paramsTransaction: {
          payload,
        },
      };
    },
    clearParam(state) {
      return {
        ...state,
        paramsTransaction: {},
      };
    },

    infoDetaial(state, action) {
      return {
        ...state,
        infoDetaial: action.payload,
      };
    },
    savehistoryList(state, action) {
      return {
        ...state,
        historyList: action.payload,
      };
    },
  },
};
