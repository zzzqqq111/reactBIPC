import { shareReportPublic, getUsersByReportId, getReportList } from '@/services/transaction';
import { userGets } from '@/services/back';

export default {
  namespace: 'reportistPermiss', // 脚本库
  state: {
    reportList: [],
    userList: {
      records: [],
      total: 0,
    },
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(getReportList, payload);
      yield put({
        type: 'saveList',
        payload: response.data,
      });
    },
    // 共享
    // 获取用户
    *fetchUserList({ payload }, { call, put }) {
      const response = yield call(userGets, payload);
      yield put({
        type: 'datalist',
        payload: response.data,
      });
    },
    *getUsersByReportId({ payload }, { call, put }) {
      // 获取报表的用户
      const response = yield call(getUsersByReportId, payload);
      yield put({
        type: 'reportUserList',
        payload: response.data,
      });
      return response.data;
    },
    *saveUser({ payload, callback = () => {} }, { call }) {
      yield call(shareReportPublic, payload);
      callback();
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        reportList: action.payload,
      };
    },
    // 共享
    // 获取所有用户
    datalist(state, action) {
      return {
        ...state,
        userList: action.payload,
      };
    },
    reportUserList(state, action) {
      return {
        ...state,
        shareUsers: action.payload.map(item => {
          return {
            key: item.userId,
            label: item.userName,
          };
        }),
      };
    },
  },
};
