import {
  dataJobList,
  dataJobHistoryList,
  dataJobSave,
  dataJobInfo,
  dataJobAccurate,
  dataJobClose,
  dataJobConfim,
  dataJobDownload,
  dataJobHistoryDownload,
  dataJobOperate,
  dataJobProblems,
  dataJobReview,
  dataJobUpdatePriority,
  dataJobUploadData,
  downloadSave,
  dataJobAddSubtasks,
  dataJobGetSort,
} from '@/services/transaction';

import { userDataDemanGets } from '@/services/back';

export default {
  namespace: 'dataDemand',
  state: {
    list: {
      total: 0, // 总数
      current: 1, // 当前页
      records: [],
    },
    detail: {},
    historyList: {
      total: 0, // 总数
      current: 1, // 当前页
      records: [],
    },
    userList: [],
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(dataJobHistoryList, payload);
      yield put({
        type: 'saveList',
        payload: response.data,
      });
    },
    *addSubtasks({ payload }, { call, put }) {
      const response = yield call(dataJobAddSubtasks, payload);
      yield put({
        type: 'detailsubTaskId',
        payload: response.data,
      });
    },

    *fetchUserList({ payload }, { call, put }) {
      const response = yield call(userDataDemanGets, payload);
      yield put({
        type: 'userlist',
        payload: response.data,
      });
    },
    *fetchHistoryList({ payload }, { call, put }) {
      const response = yield call(dataJobList, payload);
      yield put({
        type: 'datalist',
        payload: response.data,
      });
    },
    *fetchDetail({ payload, callback = () => {} }, { call, put }) {
      const response = yield call(dataJobInfo, payload);
      yield put({
        type: 'saveDetail',
        payload: response.data,
      });
      callback(response.data);
    },
    *update({ payload, callback = () => {} }, { call }) {
      // 编辑保存
      yield call(dataJobSave, payload);
      callback();
    },
    *downloadResult({ payload, callback = () => {} }, { call }) {
      // 下载数据记录
      const response = yield call(dataJobHistoryDownload, payload);
      callback(response.data);
    },
    *delete({ payload, callback = () => {} }, { call }) {
      // g关闭任务
      yield call(dataJobClose, payload);
      callback();
    },
    *updatePrority({ payload, callback = () => {} }, { call }) {
      // 编辑保存
      yield call(dataJobUpdatePriority, payload);
      callback();
    },
    *dataJobConfimDes({ payload, callback = () => {} }, { call }) {
      // 需求执行描述
      yield call(dataJobConfim, payload);
      callback();
    },
    *dataJobAccurateDes({ payload, callback = () => {} }, { call }) {
      // 审核执行描述
      yield call(dataJobAccurate, payload);
      callback();
    },
    *dataJobOperation({ payload, callback = () => {} }, { call }) {
      // 数据需求执行人
      yield call(dataJobOperate, payload);
      callback();
    },
    *dataJobReview({ payload, callback = () => {} }, { call }) {
      // 数据需求审核人
      yield call(dataJobReview, payload);
      callback();
    },
    *downloadHistory({ payload }, { call }) {
      // 下载数据记录
      const response = yield call(dataJobDownload, payload);
      global.location.href = response;
    },

    *dataJobUploadData({ payload, callback = () => {} }, { call }) {
      // 上传处理数据
      yield call(dataJobUploadData, payload);
      callback();
    },

    *dataJobProblems({ payload, callback = () => {} }, { call }) {
      // 上传处理数据
      yield call(dataJobProblems, payload);
      callback();
    },
    // 增加下载记录
    *saveDownload({ payload }, { call }) {
      yield call(downloadSave, payload);
    },

    *getNowContent({ payload, callback = () => {} }, { call }) {
      const response = yield call(dataJobGetSort, payload);
      callback(response.data);
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    datalist(state, action) {
      return {
        ...state,
        historyList: action.payload,
      };
    },
    userlist(state, action) {
      return {
        ...state,
        userList: action.payload,
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
    changeTime(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          dataJob: {
            ...state.detail.dataJob,
            ...payload,
          },
        },
      };
    },
    detailsubTaskId(state, { payload }) {
      return {
        ...state,
        detail: {
          dataJob: {
            jobNo: payload.dataJob.jobNo,
          },
        },
      };
    },
  },
};
