import {
  // queryNotices,
  getDistrict,
  queryProduct,
  queryTeamtag,
} from '@/services/api';

function abcFun(arr) {
  const options = [];
  arr.forEach(item => {
    // 级联选择器
    if (typeof item === 'string') {
      options.push({
        value: item, // key
        label: item, // 文本显示
      });
    } else {
      options.push({
        value: Object.keys(item)[0], // key
        label: Object.keys(item)[0], // 文本显示
        children: abcFun(item[Object.keys(item)[0]]), // 子级
      });
    }
  });
  return options;
}

export default {
  namespace: 'global',

  state: {
    districts: [], // 地区列表
    products: [], // 产品列表
    teamtags: [], // 市场列表
    selectTypes: ['时间选择', '下拉框选择', '输入框'], // 指标选择器类型
    instanceTypes: ['mysql', 'impala', 'mongodb'], // 实例类型
    channel: [], // 指标渠道
    dataParticles: [], // 数据颗粒
    dataDimension: [], // 数据纬度
  },

  effects: {
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },
    *changeNoticeReadState({ payload }, { put, select }) {
      const notices = yield select(state =>
        state.global.notices.map(item => {
          const notice = { ...item };
          if (notice.id === payload) {
            notice.read = true;
          }
          return notice;
        })
      );
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      });
    },

    *fetchDistrict(_, { call, put }) {
      // 获取地区列表
      const response = yield call(getDistrict);
      if (response.items.length) {
        yield put({
          type: 'saveDistricts',
          payload: abcFun(response.items),
        });
      }
    },
    *fetchProduct(_, { call, put }) {
      // 获取产品列表
      const response = yield call(queryProduct);
      if (response.data.length) {
        yield put({
          type: 'saveProducts',
          payload: response.data,
        });
      }
    },
    *fetchTeamtag(_, { call, put }) {
      // 获取产品列表
      const response = yield call(queryTeamtag);
      if (response.data.length) {
        yield put({
          type: 'saveTeamtags',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },

    saveDistricts(state, { payload }) {
      // 储存 - 地区列表
      return {
        ...state,
        districts: payload,
      };
    },
    saveProducts(state, { payload }) {
      // 存储 - 产品列表
      return {
        ...state,
        products: payload,
      };
    },
    saveTeamtags(state, { payload }) {
      // 存储 - 市场列表
      return {
        ...state,
        teamtags: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
