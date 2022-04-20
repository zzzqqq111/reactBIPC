import {
  indicatorsQuery,
  indicatorsInfo,
  indicatorsSave,
  fetchIndicatorTypeList,
  enableSwitch,
  indicatorUpload,
} from '@/services/back';

export default {
  namespace: 'indicator', // 指标库

  state: {
    list: {
      total: 0, // 总数
      current: 1, // 当前页
      records: [], // 指标库列表
    },
    detail: {}, // 详情数据
    paramsTransaction: {},
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(indicatorsQuery, payload);
      yield put({
        type: 'saveList',
        payload: response.data,
      });
    },
    *fetchDetail({ payload }, { call, put }) {
      const response = yield call(indicatorsInfo, payload);
      yield put({
        type: 'saveDetail',
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
      yield call(enableSwitch, payload);
      callback();
    },
    *update({ payload, callback = () => {} }, { call }) {
      // 编辑保存/增加 传编号与否来判断是新增还是编辑
      yield call(indicatorsSave, payload);
      callback();
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
    *upload({ payload }, { call }) {
      // 编辑保存/增加 传编号与否来判断是新增还是编辑
      yield call(indicatorUpload, payload);
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload ? action.payload : state.list,
      };
    },
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
    saveIndicatorTypeList(state, { payload }) {
      // 格式化成Cascader的可选项数据源格式
      const format = v => {
        const currentKey = Object.keys(v)[0];
        const currentValue = v[currentKey];
        return {
          label: currentKey,
          value: currentKey,
          // 当前值(数组)子项如果是字符串 返回包着单个对象{label, value}的数组 如果是对象则递归
          children: currentValue[0].id
            ? currentValue.map(item => ({
                label: item.type,
                value: item.id,
              }))
            : currentValue.map(format),
        };
      };

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
  },
};
