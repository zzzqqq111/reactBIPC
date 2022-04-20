import { updateReportIndicatos, reportIndicatosGetsByUesrId } from '@/services/back';
import { deleteUserFromShareReport } from '@/services/transaction';

export default {
  namespace: 'shareInfo', // 指标库

  state: {},

  effects: {
    *getIndicatorsByReportId({ payload }, { call, put }) {
      // 获取用户报表的指标
      const response = yield call(reportIndicatosGetsByUesrId, payload);
      yield put({
        type: 'reportIndicatorsList',
        payload: response.data,
      });
      return response.data;
    },
    *deleteReport({ payload, callback = () => {} }, { call }) {
      // 删除共享的某个用户
      yield call(deleteUserFromShareReport, payload);
      callback();
    },
    *saveIndicatorsById({ payload, callback = () => {} }, { call }) {
      // 获取用户拥有的指标
      yield call(updateReportIndicatos, payload);
      callback();
    },
  },
  reducers: {
    reportIndicatorsList(state, action) {
      return {
        ...state,
        reportIndicatorsList: action.payload,
      };
    },
  },
};
