import {
  settingReportQuery,
  settingReportQueryData,
  settingReportSave,
  settingReportDelete,
  settingReportDetail,
  downloadSettingReport,
  downloadSave,
  settingReportPriority,
  settingReportOthers,
  settingReportDatasource,
  reportListData,
  settingReportPublicDelete,
  settingReportPublicDetail,
  settingReportPublicPriority,
  settingReportPublicQuery,
  settingReportPublicQueryData,
  settingReportPublicSave,
  shareReportPublic,
  getUsersByReportId,
} from '@/services/transaction';
import { userGets } from '@/services/back';

export default {
  namespace: 'report',

  state: {
    data: {
      current: 0,
      pages: 0,
      records: [], // 数据
      searchCount: true,
      size: 10,
      total: 0,
    },
    report: [],
    customReport: {},
    firstReport: {},
    detail: {},
    navId: 0,
    directoryId: 0,
    paramsTransaction: {},
    userList: {
      total: 0, // 总数
      current: 1, // 当前页
      records: [], // 指标库列表
    },
    shareUsers: [],
  },

  effects: {
    *customReportUpdate({ payload, callback = () => {} }, { call }) {
      yield call(
        payload.type === 'offical' ? settingReportPublicPriority : settingReportPriority,
        payload
      );
      callback();
    },
    *customReportQuery({ payload }, { call, put }) {
      const response = yield call(
        payload.type === 'offical' ? settingReportPublicQuery : settingReportQuery,
        payload
      );
      yield put({
        type: 'getReport',
        payload: response.data,
      });
      return response.data;
    },
    *customReportQueryData({ payload }, { call, put }) {
      const response = yield call(
        payload.type === 'offical' ? settingReportPublicQueryData : settingReportQueryData,
        payload
      );
      yield put({
        type: 'reportDataSource',
        payload: response.data,
      });
    },
    *customReportSave({ payload, callback = () => {} }, { call }) {
      const response = yield call(
        payload.public === 'offical' ? settingReportPublicSave : settingReportSave,
        payload
      );
      callback();
      return response.data;
    },
    *deleteReport({ payload, callback = () => {} }, { call }) {
      yield call(
        payload.type === 'offical' ? settingReportPublicDelete : settingReportDelete,
        payload
      );
      callback();
    },
    *reportDetail({ payload, callback = () => {} }, { call, put }) {
      const response = yield call(
        payload.type === 'offical' ? settingReportPublicDetail : settingReportDetail,
        payload
      );
      yield put({
        type: 'detialInfo',
        payload: response.data,
      });
      callback(response.data);
    },

    // 获取数据源
    *fetchList({ payload, callback = () => {} }, { call, put }) {
      const response = yield call(settingReportDatasource, payload);
      yield put({
        type: 'saveList',
        payload: response.data,
      });
      callback();
    },

    *fetchTypeList({ payload, callback = () => {} }, { call, put }) {
      const response = yield call(settingReportOthers, payload);
      yield put({
        type: 'saveOthersList',
        payload: response.data,
      });
      callback();
    },

    // 配置模板时保存的数据
    *saveFirstReportData({ payload, callback = () => {} }, { put }) {
      yield put({
        type: 'savefirstReportData',
        payload,
      });
      callback();
    },
    *download({ payload }, { call }) {
      // 下载
      const response = yield call(downloadSettingReport, payload);
      global.location.href = response;
    },
    // 更新指标选中的key
    *updateIndicatorsIds({ payload }, { put }) {
      yield put({
        type: 'updateCustomReportIndicatorsIds',
        payload,
      });
    },
    // 增加下载记录
    *saveDownload({ payload }, { call }) {
      yield call(downloadSave, payload);
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

    // 当为下拉选择器时列表里的数据
    *selectIndicatorData({ payload, callback = () => {} }, { call }) {
      const response = yield call(reportListData, payload);
      callback();
      return response.data;
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
    customReport(state, action) {
      return {
        ...state,
        columns: action.payload,
      };
    },
    clearAllParam(state) {
      return {
        ...state,
        reportInfo: {},
        data: {
          current: 0,
          pages: 0,
          records: [], // 数据
          searchCount: true,
          size: 10,
          total: 0,
        },
        report: [],
        reportMessage: {},
        paramsTransaction: {},
        shareUsers: [],
      };
    },
    getReport(state, action) {
      return {
        ...state,
        report: JSON.parse(action.payload.indicators) || [],
        reportMessage: {
          ...state.reportMessage,
          id: action.payload.id,
          name: action.payload.name,
          reportNo: action.payload.reportNo,
        },
      };
    },
    resetReportInfo(state) {
      return {
        ...state,
        reportInfo: {},
      };
    },
    saveList(state, action) {
      const list = action.payload;
      const dataBaseList = [];
      const ret = [];
      list.forEach(item => {
        if (item.channelName && item.channelName !== '' && ret.indexOf(item.channelName) === -1) {
          ret.push(item.channelName);
          dataBaseList.push({ label: item.channelName, value: item.channelName, children: [] });
        }
      });
      ret.forEach((key, index) => {
        list.forEach(item => {
          if (item.channelName === key) {
            dataBaseList[index].children.push({
              // label:
              label: item.define,
              value: `${item.databaseName}.${item.tableName}`,
            });
          }
        });
      });
      return {
        ...state,
        dataSourcelist: dataBaseList,
      };
    },
    saveOthersList(state, action) {
      return {
        ...state,
        typelist: action.payload,
      };
    },

    getDataSource(state, { payload }) {
      return {
        ...state,
        reportInfo: {
          ...state.reportInfo,
          indicatorIds: [],
          dataSource: payload.dataSource,
        },
      };
    },

    savefirstReportData(state, { payload }) {
      return {
        ...state,
        reportMessage: {
          ...state.reportMessage,
          ...payload,
        },
        reportInfo: {},
      };
    },
    reportDataSource(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
    detialInfo(state, { payload }) {
      let dataSource1 = '';
      if (payload.dataSource) {
        dataSource1 = payload.dataSource.split('.');
      }
      return {
        ...state,
        reportInfo: {
          ...state.reportInfo,
          ...payload,
          dimensions: JSON.parse(payload.dimensions) || [],
          indicatorIds: JSON.parse(payload.indicators) || [],
          tableName: dataSource1[1],
          dataSource: dataSource1[0],
        },
      };
    },

    updateCustomReportIndicatorsIds(state, action) {
      return {
        ...state,
        reportInfo: {
          ...state.reportInfo,
          indicatorIds: JSON.parse(action.payload.indicators) || [],
        },
      };
    },

    // 获取并修改当前所在的分类
    changeNavId(state, action) {
      return {
        ...state,
        navId: Number(action.payload.id),
      };
    },
    saveParam(state, { payload }) {
      return {
        ...state,
        paramsTransaction: {
          ...state.paramsTransaction,
          ...payload,
        },
      };
    },
    clearParam(state) {
      return {
        ...state,
        paramsTransaction: {},
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
