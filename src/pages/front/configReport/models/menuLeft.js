import {
  directoryCockpitQuery,
  directorySave,
  directoryUpdate,
  directoryDelete,
  directoryQueryOffical,
} from '@/services/transaction';

const sortPripory = (a, b) => {
  return a.priority - b.priority;
};

// 前台目录展示结构
const myfun = (arr, id, _a) => {
  // eslint-disable-next-line no-param-reassign
  _a += 1;
  const array = [];
  if (_a < 4) {
    arr.forEach(item => {
      if (item.parentId === id) {
        array.push({
          ...item,
          key: item.id,
          children: myfun(arr, item.id, _a),
          level: _a,
        });
      }
      return item;
    });
  }
  array.sort(sortPripory);
  return array;
};

export default {
  namespace: 'menuLeft',

  state: {
    menuList: [],
    defaultValue: {
      defaultSelectedKeys: [],
      defaultOpenKeys: [],
    },
    navId: 0,
  },

  effects: {
    *directoryQuery({ payload, callback = () => {} }, { call, put }) {
      const response = yield call(
        payload.public === 'offical' ? directoryQueryOffical : directoryCockpitQuery,
        payload
      );
      yield put({
        type: 'menuList',
        payload: response.data,
      });
      callback();
    },
    *directorySave({ payload, callback = () => {} }, { call }) {
      yield call(directorySave, payload);
      callback();
    },
    *update({ payload, callback = () => {} }, { call }) {
      yield call(directoryUpdate, payload);
      callback();
    },
    *deleteDir({ payload, callback = () => {} }, { call }) {
      yield call(directoryDelete, payload);
      callback();
    },
  },

  reducers: {
    menuList(state, action) {
      const openArr = [];
      let list = [];
      let defaluselet = '';
      if (action.payload.length !== 0) {
        list = myfun(action.payload, state.navId, 0);
        if (list.length < 1) {
          return {
            ...state,
          };
        }

        // 获取第一个元素所有的submenu
        list.map((firstItem, index) => {
          if (list[index].children.length !== 0) {
            openArr.push(`${firstItem.id}`);
            list[index].children.map(item => {
              openArr.push(`${item.id}`);
              return item;
            });
          }
          return firstItem;
        });
        if (list[0].children.length > 0) {
          if (list[0].children[0].children.length > 0) {
            defaluselet = list[0].children[0].children[0].id;
          }
        }
      }

      return {
        ...state,
        menuList: list,
        defaultValue: {
          defaultOpenKeys: openArr,
          defaultSelectedKeys: [`${defaluselet}`],
        },
      };
    },
    getNowId(state, { payload }) {
      return {
        ...state,
        navId: payload.id,
      };
    },
  },
};
