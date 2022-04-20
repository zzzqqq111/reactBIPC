import {
  getOrderDetail,
  getShipmentsDetail,
  getClearingIndexDetail,
  getRefundmentDetail,
  downloadOrderDetail,
  downloadShipmentsDetail,
  downloadClearingindexDetail,
  downloadRefundmentDetail,
} from '@/services/transaction';
import COL from './_COL';
import { getPageQuery } from '@/utils/utils';

export default {
  namespace: 'trade',

  state: {
    paramsTransaction: {},
    data: {
      current: 0,
      pages: 0,
      records: [], // 数据
      searchCount: true,
      size: 10,
      total: 0,
    },
    columns: COL['订货明细'],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      let response;
      switch (getPageQuery().key) {
        case '发货明细':
          response = yield call(getShipmentsDetail, payload);
          break;
        case '动销明细':
          response = yield call(getClearingIndexDetail, payload);
          break;
        case '退款明细':
          response = yield call(getRefundmentDetail, payload);
          break;
        default:
          response = yield call(getOrderDetail, payload);
          break;
      }
      if (getPageQuery().key) {
        yield put({
          type: 'saveColumns',
          payload: COL[getPageQuery().key],
        });
      }
      if (response && response.data.records) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
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
    *download({ payload }, { call }) {
      // 下载
      let response;
      switch (getPageQuery().key) {
        case '发货明细':
          response = yield call(downloadShipmentsDetail, payload);
          break;
        case '动销明细':
          response = yield call(downloadClearingindexDetail, payload);
          break;
        case '退款明细':
          response = yield call(downloadRefundmentDetail, payload);
          break;
        default:
          response = yield call(downloadOrderDetail, payload);
          break;
      }
      global.location.href = response;
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        data: payload,
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
    saveColumns(state, { payload }) {
      return {
        ...state,
        columns: payload,
      };
    },
  },
};
