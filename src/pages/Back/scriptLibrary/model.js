import { scriptLibraryQuery, scriptLibraryInfo, scriptLibrarySave } from '@/services/back';

export default {
  namespace: 'scriptLibrary', // 脚本库
  state: {
    list: {
      records: [],
    },
    detail: {},
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(scriptLibraryQuery, payload);
      yield put({
        type: 'saveList',
        payload: response.data,
      });
    },
    *fetchDetail({ payload }, { call, put }) {
      yield put({
        type: 'saveDetail',
        payload: (yield call(scriptLibraryInfo, payload)).data,
      });
    },
    *update({ payload, callback }, { call, put }) {
      // 编辑保存/增加 传编号与否来判断是新增还是编辑
      const response = yield call(scriptLibrarySave, payload);
      yield put({
        type: 'saveDetail',
        payload: response.data,
      });
      if (callback) callback();
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
  },
};
