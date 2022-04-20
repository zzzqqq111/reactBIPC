import {
  tableCategoryAdd,
  tableCategoryList,
  tableChannelAdd,
  tableChannelList,
  tableParticlenAdd,
  tableParticlenList,
  tableCategoryIsEnable,
} from '@/services/back';

export default {
  namespace: 'tableCategory', // 指标库

  state: {
    list: [],
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      // 获取分类列表
      const response = yield call(tableCategoryList, payload);
      yield put({
        type: 'saveList',
        payload: response.data,
      });
    },

    *fetchChannelList({ payload }, { call, put }) {
      // 获取渠道列表
      const response = yield call(tableChannelList, payload);
      yield put({
        type: 'channelList',
        payload: response.data,
      });
    },

    *fetchParcilenList({ payload }, { call, put }) {
      // 获取颗粒列表
      const response = yield call(tableParticlenList, payload);
      yield put({
        type: 'parcilenList',
        payload: response.data,
      });
    },

    *categoryAdd({ payload, callback = () => {} }, { call }) {
      // 新增分类
      yield call(tableCategoryAdd, payload);
      callback();
    },

    *cannelAdd({ payload, callback = () => {} }, { call }) {
      // 新增渠道
      yield call(tableChannelAdd, payload);
      callback();
    },

    *particlenAdd({ payload, callback = () => {} }, { call }) {
      // 新增粒度
      yield call(tableParticlenAdd, payload);
      callback();
    },

    *switch({ payload, callback = () => {} }, { call }) {
      // 启用开关
      yield call(tableCategoryIsEnable, payload);
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

    channelList(state, action) {
      return {
        ...state,
        channelList: action.payload,
      };
    },

    parcilenList(state, action) {
      return {
        ...state,
        parcilenList: action.payload,
      };
    },
  },
};
