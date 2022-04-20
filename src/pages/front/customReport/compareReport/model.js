import {
  dataCompareReportQuery,
  dataCompareReportQueryData,
  dataCompareReportSave,
  dataCompareReportDelete,
  dataCompareReportDetail,
  downloadSave,
  reportUpatePriority,
  dataCompareReportList,
  dataCompareReportSaveOffical,
  dataCompareReportDeleteOffical,
  reportSaveDefinedIndicators,
  reportIndicatorsQuery,
  reportIndicatorsList,
} from '@/services/transaction';
import { formatTime } from '@/utils/timeFormat';

// 合计计算
const sumData = (arr, title, field) => {
  const temp = { [field]: '合计' };
  if (!arr || arr.length === 0) {
    return arr;
  }
  arr.forEach(item => {
    const newArr = title.filter(name => name !== field);
    newArr.forEach(key => {
      if (typeof item[key] === 'number') {
        if (temp[key]) {
          temp[key] += item[key];
        } else {
          temp[key] = item[key];
        }
      } else {
        temp[key] = '-';
      }
    });
  });
  arr.unshift(temp);
  return arr;
};

export default {
  namespace: 'compareReport',

  state: {
    report: [],
    navId: 0,
    directoryId: 0,
    customFormulaData: {
      // 自定义公式
      name: '',
      formula: '',
      format: '',
    },
    compareDataList: [],
  },

  effects: {
    *directoryQuery({ payload, callback = () => {} }, { call }) {
      const response = yield call(dataCompareReportList, payload);
      callback();
      return response.data;
    },

    *customReportUpdate({ payload, callback = () => {} }, { call }) {
      yield call(reportUpatePriority, payload);
      callback();
    },

    *compareReportQuery({ payload }, { call, put }) {
      const response = yield call(dataCompareReportQuery, payload);
      if (payload.page === 'compare') {
        yield put({
          type: 'getCompareList',
          payload: response.data,
        });
      } else if (payload.page === 'compare1') {
        // return response.data.id;
      }
      return response.data;
    },
    *compareReportQueryData({ payload }, { call, put }) {
      const response = yield call(dataCompareReportQueryData, payload);
      if (payload.page === 'compare') {
        yield put({
          type: 'compareReportDataSource',
          payload: response.data,
        });
      } else {
        yield put({
          type: 'compareReportDataSource1',
          payload: response.data,
        });
      }
    },

    *compareReportSave({ payload, callback = () => {} }, { call }) {
      const response = yield call(
        payload.type === 'offical' ? dataCompareReportSave : dataCompareReportSaveOffical,
        payload
      );
      callback();
      return response.data;
    },
    *deleteCompareReport({ payload, callback = () => {} }, { call }) {
      yield call(
        payload.type === 'offical' ? dataCompareReportDelete : dataCompareReportDeleteOffical,
        payload
      );
      callback();
    },
    *compareReportDetail({ payload, callback = () => {} }, { call, put }) {
      const response = yield call(dataCompareReportDetail, payload);
      yield put({
        type: 'compareInfo',
        payload: response.data,
      });
      callback(response.data.reportPeriodCompare);
    },

    // 更新指标选中的key
    *updateIndicatorsIds({ payload }, { put }) {
      yield put({
        type: 'updateCustomReportIndicatorsIds',
        payload,
      });
    },

    *reportIndicatorsList({ payload }, { call, put }) {
      const response = yield call(reportIndicatorsList, payload);
      yield put({
        type: 'formulaList',
        payload: response.data,
      });
    },
    // 增加下载记录
    *saveDownload({ payload }, { call }) {
      yield call(downloadSave, payload);
    },

    // 指标公式存储
    *reportSaveDefinedIndicators({ payload, callback = () => {} }, { call }) {
      const response = yield call(reportSaveDefinedIndicators, payload);
      callback();
      return response.data;
    },

    // 指标公式获取
    *reportIndicatorsQuery({ payload }, { call, put }) {
      const response = yield call(reportIndicatorsQuery, payload);
      yield put({
        type: 'updateCustomFormulaData',
        payload: response.data,
      });
      return response.data;
    },
  },

  reducers: {
    // 对边编辑时所用的ID
    updateCompareIndicatorsIds(state, action) {
      return {
        ...state,
        compareData: {
          ...state.compareData,
          indicatorsId: action.payload,
        },
      };
    },
    // 存储对比编辑的信息
    saveCompareEditData(state, action) {
      return {
        ...state,
        compareData: {
          ...state.compareData,
          ...action.payload,
        },
      };
    },

    getCompareList(state, action) {
      return {
        ...state,
        compareDataList: action.payload.list,
        name: action.payload.name,
      };
    },

    // table右侧数据
    compareReportDataSource(state, action) {
      const list = state.compareDataList;
      const title = [];
      if (list.length === 0) {
        return null;
      }
      list.forEach(item => {
        title.push(item.tableField);
      });
      const dataIndex = list.filter(item => item.selector === '时间选择')[0];
      const field = dataIndex.tableField;
      const data = action.payload.records;
      const newData = sumData(data, title, field);
      return {
        ...state,
        dataCompare1: {
          ...action.payload,
          records: newData.map(item => ({
            ...item,
            [field]: formatTime(item[field]),
          })),
        },
      };
    },

    // table左侧数据
    compareReportDataSource1(state, action) {
      const list = state.compareDataList;
      const title = [];
      if (list.length === 0) {
        return null;
      }
      list.forEach(item => {
        title.push(item.tableField);
      });
      const dataIndex = list.filter(item => item.selector === '时间选择')[0];
      const field = dataIndex.tableField;
      const data = action.payload.records;
      const newData = sumData(data, title, field);
      return {
        ...state,
        dataCompare2: {
          ...action.payload,
          records: newData.map(item => ({
            ...item,
            [field]: formatTime(item[field]),
          })),
        },
      };
    },

    // 存储报表对比信息
    compareInfo(state, action) {
      const data = action.payload;
      return {
        ...state,
        compareData: data.reportPeriodCompare,
      };
    },

    clearAllData(state) {
      return {
        ...state,
        dataCompare1: {
          current: 0,
          pages: 0,
          records: [], // 数据
          searchCount: true,
          size: 10,
          total: 0,
        },
        dataCompare2: {
          current: 0,
          pages: 0,
          records: [], // 数据
          searchCount: true,
          size: 10,
          total: 0,
        },
        compareDataList: [],
        compareReportTotal: [],
        compareData: {},
      };
    },

    // 点击同期对比出现的目录
    saveDirectory(state, action) {
      return {
        ...state,
        compareReportTotal: action.payload,
      };
    },

    // 指标公式存储
    updateCustomFormulaData(state, action) {
      return {
        ...state,
        customFormulaData: action.payload,
      };
    },

    formulaList(state, action) {
      return {
        ...state,
        formulaList: action.payload,
      };
    },
  },
};
