import {
  userPermissList,
  datasourcePermissList,
  reportPermissList,
  addTablePermission,
} from '@/services/transaction';

export default {
  namespace: 'reportAdmin', // 脚本库
  state: {
    list: [],
    reportlist: [],
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(userPermissList, payload);
      yield put({
        type: 'saveList',
        payload: response.data,
      });
    },
    *getReport({ payload }, { call, put }) {
      yield put({
        type: 'reportlist',
        payload: (yield call(reportPermissList, payload)).data,
      });
    },
    *getDataSource({ payload }, { call, put }) {
      // 编辑保存/增加 传编号与否来判断是新增还是编辑
      const response = yield call(datasourcePermissList, payload);
      yield put({
        type: 'dataSourceList',
        payload: response.data,
      });
    },
    *addTablePermission({ payload, callback = () => {} }, { call }) {
      yield call(addTablePermission, payload);
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
    reportlist(state, action) {
      return {
        ...state,
        reportlist: action.payload,
      };
    },
    dataSourceList(state, action) {
      return {
        ...state,
        dataSourceList: action.payload,
      };
    },
  },
};
