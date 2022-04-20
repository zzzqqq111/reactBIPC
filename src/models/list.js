import { navigateMenuList } from '@/services/back';

export default {
  namespace: 'list',

  state: {
    navList: [],
    hasPermiss: false,
    configPermiss: false,
    userId: 0,
    navId: '',
    hasJobList: false,
    hasJobDownload: false,
  },

  effects: {
    *fetchMenuList({ payload }, { call, put }) {
      const response = yield call(navigateMenuList, payload);
      yield put({
        type: 'navigateMenuList',
        payload: response.data,
      });
      return response.data;
    },
  },

  reducers: {
    navigateMenuList(state, action) {
      return {
        ...state,
        navList: action.payload,
        // navId: action.payload.length !== 0 ? Number(action.payload[0].id) : 0,
      };
    },
    changePermiss(state, { payload }) {
      return {
        ...state,
        hasPermiss: payload,
      };
    },
    hasConfigPermiss(state, { payload }) {
      return {
        ...state,
        configPermiss: payload,
      };
    },
    changeNavId(state, { payload }) {
      return {
        ...state,
        navId: payload.key ? Number(payload.key) : '',
      };
    },
    getUserId(state, { payload }) {
      return {
        ...state,
        userId: Number(payload),
      };
    },
    hasJobList(state, { payload }) {
      return {
        ...state,
        hasJobList: payload,
      };
    },
    hasJobDownload(state, { payload }) {
      return {
        ...state,
        hasJobDownload: payload,
      };
    },
  },
};
