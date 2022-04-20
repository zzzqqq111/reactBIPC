import {
  permissPostGets,
  permissPostSave,
  permissPostQuery,
  indicatorQuery,
  permissPostIsEnable,
  fetchIndicatorTypeList,
} from '@/services/back';

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
  namespace: 'postManage', // 指标库

  state: {
    list: {
      total: 0, // 总数
      current: 1, // 当前页
      records: [], // 指标库列表
    },
    detail: {}, // 详情数据
    indicatorlist: [],
    paramsTransaction: {},
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(permissPostQuery, payload);
      yield put({
        type: 'datalist',
        payload: response.data,
      });
    },
    *fetchDetail({ payload }, { call, put }) {
      const response = yield call(permissPostGets, payload);
      yield put({
        type: 'detail',
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
      return response.data;
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
      yield call(permissPostIsEnable, payload);
      callback();
    },
    *update({ payload, callback = () => {} }, { call }) {
      // 编辑保存/增加 传编号与否来判断是新增还是编辑
      yield call(permissPostSave, payload);
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
        detail: action.payload,
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
    resetDetail(state) {
      return {
        ...state,
        detail: {},
      };
    },
    changeInditors(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          instanceData: {
            ...state.detail.instanceData,
            indicatorIds: payload,
          },
        },
      };
    },

    changeDataPermiss(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          instanceData: {
            ...state.detail.instanceData,
            systemPermissionIds: payload,
          },
        },
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
  },
};
