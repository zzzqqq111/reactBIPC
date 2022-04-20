import {
  userRegistered,
  userGets,
  userGetInfo,
  userPostPermission,
  userUpdate,
  indicatorQuery,
  fetchIndicatorTypeList,
  userisEnable,
  permissPostGets,
  permissPostQuery,
  reportGetsByUesrId,
  reportIndicatosGetsByUesrId,
  updateReportIndicatos,
  indicatorsGetsByUserId,
  reportGetsByIndicators,
  reportDeleteByIndicators,
} from '@/services/back';
import { deleteUserFromShareReport } from '@/services/transaction';

const format = v => {
  const currentKey = Object.keys(v)[0];
  const currentValue = v[currentKey];
  return {
    label: currentKey,
    value: currentKey,
    // 当前值(数组)子项如果是字符串 返回包着单个对象{label, value}的数组 如果是对象则递归
    children:
      currentValue[0].id >= 0
        ? currentValue.map(item => ({
            label: item.type,
            value: item.id,
          }))
        : currentValue.map(format),
  };
};

export default {
  namespace: 'userManage', // 指标库

  state: {
    list: {
      total: 0, // 总数
      current: 1, // 当前页
      records: [], // 指标库列表
    },
    detail: {}, // 详情数据
    indicatorlist: [],
    dataInfo: {},
    postlists: [],
    paramsTransaction: {},
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(userGets, payload);
      yield put({
        type: 'datalist',
        payload: response.data,
      });
    },
    *fetchDetail({ payload }, { call, put }) {
      const response = yield call(userGetInfo, payload);
      yield put({
        type: 'detail',
        payload: response.data,
      });
      return response.data;
    },
    *DataDetail({ payload }, { call, put }) {
      const response = yield call(permissPostGets, payload);
      yield put({
        type: 'commonDetail',
        payload: response.data,
      });
      return response.data;
    },
    *fetchIndicatorList({ payload }, { call, put }) {
      const response = yield call(indicatorQuery, payload);
      yield put({
        type: 'saveIndicatorList',
        payload: response.data,
      });
    },
    // 获取指标类型 跟选择器列表
    *fetchIndicatorTypeList({ payload }, { call, put }) {
      yield put({
        type: 'saveIndicatorTypeList',
        payload: (yield call(fetchIndicatorTypeList, payload)).data,
      });
    },
    // 启用开关
    *switch({ payload, callback = () => {} }, { call }) {
      yield call(userisEnable, payload);
      callback();
    },
    *save({ payload, callback = () => {} }, { call }) {
      // 编辑保存/增加 传编号与否来判断是新增还是编辑
      yield call(userRegistered, payload);
      callback();
    },
    *update({ payload, callback = () => {} }, { call }) {
      // 编辑保存/增加 传编号与否来判断是新增还是编辑
      yield call(userUpdate, payload);
      callback();
    },
    *postDataList({ payload }, { call, put }) {
      // 获取部门
      const response = yield call(permissPostQuery, payload);
      yield put({
        type: 'listPost',
        payload: response.data.records,
      });
      return response.data.records;
    },
    *postCollaboration({ payload }, { call, put }) {
      // 根据部门自动填充
      const response = yield call(userPostPermission, payload);
      yield put({
        type: 'postDefaultData',
        payload: response.data,
      });
      return response.data;
    },
    *getReportById({ payload }, { call, put }) {
      // 获取用户拥有的报表
      const response = yield call(reportGetsByUesrId, payload);
      yield put({
        type: 'reportList',
        payload: response.data,
      });
    },
    *getIndicatorsByReportId({ payload }, { call, put }) {
      // 获取用户报表的指标
      const response = yield call(reportIndicatosGetsByUesrId, payload);
      yield put({
        type: 'reportIndicatorsList',
        payload: response.data,
      });
      return response.data;
    },
    *getIndicatorsById({ payload }, { call, put }) {
      // 获取用户拥有的指标
      const response = yield call(indicatorsGetsByUserId, payload);
      yield put({
        type: 'indicatorsList',
        payload: response.data,
      });
    },
    *saveIndicatorsById({ payload, callback = () => {} }, { call }) {
      // 获取用户拥有的指标
      yield call(updateReportIndicatos, payload);
      callback();
    },
    *reportGetIndicator({ payload }, { call, put }) {
      // 根据指标获取报表
      const response = yield call(reportGetsByIndicators, payload);
      yield put({
        type: 'indicatorsReportList',
        payload: response.data,
      });
      return response.data;
    },
    *deleteReport({ payload, callback = () => {} }, { call }) {
      // 删除指标所对应的报表
      yield call(reportDeleteByIndicators, payload);
      callback();
    },
    *deleteUserReport({ payload, callback = () => {} }, { call }) {
      // 删除共享的某个用户
      yield call(deleteUserFromShareReport, payload);
      callback();
    },
  },

  reducers: {
    datalist(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    detail(state, action) {
      return {
        ...state,
        dataInfo: {
          instanceData: action.payload,
        },
      };
    },
    saveIndicatorList(state, action) {
      return {
        ...state,
        indicatorlist: action.payload,
      };
    },
    saveIndicatorTypeList(state, { payload }) {
      // 格式化成Cascader的可选项数据源格式
      return {
        ...state,
        indicatorTypeList: payload.map(format),
      };
    },
    commonDetail(state, action) {
      return {
        ...state,
        dataInfo: {
          ...state.dataInfo,
          ...action.payload,
        },
      };
    },
    listPost(state, action) {
      return {
        ...state,
        postlists: action.payload,
      };
    },
    postDefaultData(state, action) {
      return {
        ...state,
        dataInfo: {
          ...state.dataInfo,
          instanceData: {
            ...state.dataInfo.instanceData,
            ...action.payload,
          },
        },
      };
    },

    changeInditors(state, { payload }) {
      return {
        ...state,
        dataInfo: {
          ...state.dataInfo,
          instanceData: {
            ...state.dataInfo.instanceData,
            indicators: payload,
          },
        },
      };
    },

    changeDataPermiss(state, { payload }) {
      return {
        ...state,
        dataInfo: {
          ...state.dataInfo,
          instanceData: {
            ...state.dataInfo.instanceData,
            systemPermissionIds: payload,
          },
        },
      };
    },

    resetDetail(state) {
      return {
        ...state,
        detail: {},
        dataInfo: {},
      };
    },
    reportList(state, action) {
      return {
        ...state,
        reportList: action.payload,
      };
    },
    indicatorsList(state, action) {
      return {
        ...state,
        indicatorsList: action.payload,
      };
    },
    reportIndicatorsList(state, action) {
      return {
        ...state,
        reportIndicatorsList: action.payload,
      };
    },
    indicatorsReportList(state, action) {
      return {
        ...state,
        indicatorsReportList: action.payload,
      };
    },

    // 保存查询框参数
    saveParam(state, { payload }) {
      return {
        ...state,
        paramsTransaction: {
          payload,
        },
      };
    },
  },
};
