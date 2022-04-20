import {
  dataImportList,
  dataImportSave,
  dataImportInfo,
  dataImportIsEnable,
  dataImportUserPermiss,
  userGets,
  dataImportPermissList,
} from '@/services/back';

export default {
  namespace: 'dataExport',
  state: {
    list: {
      total: 0, // 总数
      current: 1, // 当前页
      records: [],
    },
    detail: {},
    userList: {
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
    *fetchUserList({ payload, callback = () => {} }, { call, put }) {
      // 所有用户
      const response = yield call(userGets, payload);
      yield put({
        type: 'datalist',
        payload: response.data,
      });
      callback();
    },
    *fetchShareUserList({ payload, callback = () => {} }, { call }) {
      // 保存用户
      yield call(dataImportUserPermiss, payload);
      callback();
    },
    *fetchhasShareUserList({ payload }, { call, put }) {
      // 已共享的用户
      const response = yield call(dataImportPermissList, payload);
      yield put({
        type: 'hasUserlist',
        payload: response.data,
      });
    },
    *fetchDetail({ payload }, { call, put }) {
      const response = yield call(dataImportInfo, payload);
      yield put({
        type: 'saveDetail',
        payload: response.data,
      });
    },
    *switch({ payload, callback = () => {} }, { call }) {
      // 启用开关
      yield call(dataImportIsEnable, payload);
      callback();
    },
    *update({ payload, callback = () => {} }, { call }) {
      // 编辑保存
      yield call(dataImportSave, payload);
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

    datalist(state, action) {
      return {
        ...state,
        userList: action.payload,
      };
    },

    hasUserlist(state, action) {
      return {
        ...state,
        shareUsersList: action.payload.map(item => {
          return {
            key: item.userId,
            label: item.username,
          };
        }),
      };
    },
    reportUserListUpdata(state, action) {
      return {
        ...state,
        shareUsersList: action.payload,
      };
    },
  },
};
