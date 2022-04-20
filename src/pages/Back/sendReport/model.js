import { getMailList, mailListEdit, mailListinfo } from '@/services/back';
import { settingReportQuery, settingReportPublicQuery } from '@/services/transaction';

export default {
  namespace: 'sendReport',
  state: {
    list: [],
    detail: {},
    report: {
      name: '',
      indicators: [],
    },
  },
  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(getMailList, payload);
      yield put({
        type: 'saveList',
        payload: response.data,
      });
    },
    *fetchDetail({ payload }, { call, put }) {
      yield put({
        type: 'saveDetail',
        payload: (yield call(mailListinfo, payload)).data,
      });
    },
    *reportQuery({ payload }, { call, put }) {
      const response = yield call(
        payload.type === '官方报表' ? settingReportPublicQuery : settingReportQuery,
        payload
      );
      yield put({
        type: 'getReport',
        payload: response.data,
      });
    },
    *update({ payload, callback }, { call }) {
      // 编辑保存/增加 传编号与否来判断是新增还是编辑
      yield call(mailListEdit, payload);
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
    getReport(state, action) {
      const list = action.payload;
      let field = '';
      const arr = [];
      if (list.indicators && list.indicators !== '') {
        field = JSON.parse(list.indicators);
      }
      field.forEach(item => {
        if (item.selector === '时间选择') {
          arr.push(item);
        }
      });
      return {
        ...state,
        report: {
          ...list,
          indicators: arr,
        },
      };
    },
  },
};
