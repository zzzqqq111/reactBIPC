import {
  directoryQuery,
  directorySave,
  directoryUpdate,
  directoryDelete,
  customReportQuery,
  customReportQueryData,
  customReportSave,
  fetchIndicatorTypeList,
  reportDelete,
  reportDetail,
  downloadReport,
  downloadSave,
  downloadReportCompare,
  reportUpatePriority,
  dataCompareReportList,
  dataCompareReportSave,
  customReportQueryOffical,
  customReportQueryDataOffical,
  customReportSaveOffical,
  reportDeleteOffical,
  reportDetailOffical,
  downloadPublicReport,
  getUsersByReportId,
  directoryQueryOffical,
  selectIndicatorData,
} from '@/services/transaction';

import { indicatorsQuery, indicatorsInfo, userGets } from '@/services/back';

const sortPripory = (a, b) => {
  return a.priority - b.priority;
};

// 前台目录展示结构
const myfun = (arr, id, _a) => {
  // eslint-disable-next-line no-param-reassign
  _a += 1;
  const array = [];
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
  array.sort(sortPripory);
  return array;
};

// 格式化成Cascader的可选项数据源格式  只限3层
const flatten = (arr, id) => {
  let res = [];
  if (id < 3) {
    // eslint-disable-next-line no-param-reassign
    id += 1;
    arr.map(item => {
      const currentKey = Object.keys(item)[0];
      const currentValue = item[currentKey];
      if (Array.isArray(currentValue)) {
        res = res.concat({
          label: currentKey,
          value: currentKey,
          children: flatten(currentValue, id),
        });
      } else {
        res.push({ label: currentKey, value: currentKey });
      }
      return item;
    });
  }
  return res;
};

export default {
  namespace: 'customReport',

  state: {
    menuList: [],
    // menuEditList: [],
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
    paramsTransaction: {},
    firstReport: {},
    defaultValue: {
      defaultSelectedKeys: [],
      defaultOpenKeys: [],
    },
    detail: {},
    navId: 0,
    compareVisiable: false,
    directoryId: 0,
    compareParam: {},
    userList: {
      total: 0, // 总数
      current: 1, // 当前页
      records: [], // 指标库列表
    },
  },

  effects: {
    *directoryQuery({ payload, callback = () => {} }, { call, put }) {
      const response = yield call(
        payload.type === 'offical' ? directoryQuery : directoryQueryOffical,
        payload
      );
      yield put({
        type: 'menuList',
        payload: response.data,
      });
      callback();
      return response.data;
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
    *customReportUpdate({ payload, callback = () => {} }, { call }) {
      yield call(reportUpatePriority, payload);
      callback();
    },
    *customReportQuery({ payload }, { call, put }) {
      const response = yield call(
        payload.type === 'offical' ? customReportQuery : customReportQueryOffical,
        payload
      );
      yield put({
        type: 'getReport',
        payload: response.data,
      });
      return response.data.id;
    },
    *selectIndicatorData({ payload, callback = () => {} }, { call }) {
      const response = yield call(selectIndicatorData, payload);
      callback();
      return response.data;
    },
    *customReportQueryData({ payload }, { call, put }) {
      const response = yield call(
        payload.type === 'offical' ? customReportQueryData : customReportQueryDataOffical,
        payload
      );
      yield put({
        type: 'reportDataSource',
        payload: response.data,
      });
    },
    *customReportSave({ payload, callback = () => {} }, { call, put }) {
      const response = yield call(
        payload.type === 'offical' ? customReportSave : customReportSaveOffical,
        payload
      );
      yield put({
        type: 'saveReportData',
        payload: response.data,
      });
      callback();
      return response.data;
    },
    *deleteReport({ payload, callback = () => {} }, { call }) {
      yield call(payload.type === 'offical' ? reportDelete : reportDeleteOffical, payload);
      callback();
    },
    *reportDetail({ payload, callback = () => {} }, { call, put }) {
      const response = yield call(
        payload.type === 'offical' ? reportDetail : reportDetailOffical,
        payload
      );
      yield put({
        type: 'detialInfo',
        payload: response.data,
      });
      callback(response.data);
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

    // 获取指标列表
    *fetchList({ payload, callback = () => {} }, { call, put }) {
      const response = yield call(indicatorsQuery, payload);
      yield put({
        type: 'saveList',
        payload: response.data.records,
      });
      callback();
    },
    // 获取指标类型 跟选择器列表
    *fetchIndicatorTypeList({ payload }, { call, put }) {
      yield put({
        type: 'saveIndicatorTypeList',
        payload: (yield call(fetchIndicatorTypeList, payload)).data,
      });
    },
    //  编辑时指标分类获取
    *fetchDetail({ payload }, { call, put }) {
      const response = yield call(indicatorsInfo, payload);
      yield put({
        type: 'saveDetail',
        payload: response.data,
      });
      return response.data;
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
      const response = yield call(
        payload.type === 'offical' ? downloadReport : downloadPublicReport,
        payload
      );
      global.location.href = response;
    },
    *downloadReportCompare({ payload }, { call }) {
      // 下载对比报表
      const response = yield call(downloadReportCompare, payload);
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
    // 查询同期对比报表
    *reportQueryList({ payload }, { call }) {
      const response = yield call(dataCompareReportList, payload);
      return response.data;
    },
    // 新增同期对比报表
    *dataCompareReportSave({ payload, callback = () => {} }, { call }) {
      const response = yield call(dataCompareReportSave, payload);
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
  },

  reducers: {
    menuList(state, action) {
      const openArr = [];
      let list = [];
      let defaluselet = '';
      if (action.payload.length !== 0) {
        list = myfun(action.payload, state.navId, 0);
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

      // 添加报表的选择母目录菜单
      // const arr = [];
      // list.map(item => {
      //   if (item.children.length !== 0) {
      //     const chiData = [];
      //     item.children.map(obj => {
      //       chiData.push({ key: obj.id, label: obj.name, value: obj.id });
      //       return chiData;
      //     });
      //     arr.push({ key: item.id, label: item.name, value: item.id, children: chiData });
      //   } else {
      //     arr.push({ key: item.id, label: item.name, value: item.id, children: [] });
      //   }
      //   return arr;
      // });
      // let childSelect = '';

      return {
        ...state,
        menuList: list,
        // menuEditList: arr,
        firstReport: {
          ...state.firstReport,
        },
        defaultValue: {
          defaultOpenKeys: openArr,
          defaultSelectedKeys: [`${defaluselet}`],
        },
        directoryId: defaluselet,
      };
    },
    customReport(state, action) {
      return {
        ...state,
        columns: action.payload,
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
    clearAllParam(state) {
      return {
        ...state,
        paramsTransaction: {},
        firstReport: {},
        report: [],
        customReport: {},
        detail: {},
        list: [],
        data: {
          current: 0,
          pages: 0,
          records: [], // 数据
          searchCount: true,
          size: 10,
          total: 0,
        },
        directoryId: 0,
        show: false,
        compareVisiable: false,
        compareParam: {},
        shareUsers: [],
      };
    },
    getReport(state, action) {
      return {
        ...state,
        report: action.payload.list,
        firstReport: {
          ...state.firstReport,
          id: action.payload.id,
          name: action.payload.name,
          defaultId: 'all',
          reportNo: action.payload.reportNo,
          indicatorsTypeId: action.payload.list.length > 0 ? action.payload.list[0].id : 0,
        },
      };
    },
    saveList(state, action) {
      return {
        ...state,
        list: action.payload.map(item => {
          return {
            ...item,
            key: item.id,
          };
        }),
        firstReport: {
          ...state.firstReport,
          customReport: {
            ...state.firstReport.customReport,
          },
        },
      };
    },
    saveIndicatorTypeList(state, { payload }) {
      return {
        ...state,
        indicatorTypeList: flatten(payload, 0),
      };
    },
    savefirstReportData(state, { payload }) {
      return {
        ...state,
        firstReport: {
          ...state.firstReport,
          ...payload,
          name: payload.name,
          // parentId: payload.parentId,
          defaultId: 'all',
          show: payload.show,
          edit: payload.edit,
          indicatorsIds: payload.indicatorsIds ? payload.indicatorsIds : [],
        },
      };
    },
    reportDataSource(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
    detialInfo(state, { payload }) {
      return {
        ...state,
        firstReport: {
          ...state.firstReport,
          ...payload,
          // parentId: payload.directory,
        },
      };
    },
    saveReportData(state, { payload }) {
      return {
        ...state,
        firstReport: {
          ...state.firstReport,
          id: payload,
        },
      };
    },
    saveDetail(state, action) {
      if (action.payload) {
        return {
          ...state,
          detail: {
            channel: action.payload.channel || '',
            dataParticles: action.payload.dataParticles || '',
            dataDimension: action.payload.dataDimension || '',
          },
        };
      }
      return {
        ...state,
      };
    },
    updateCustomReportIndicatorsIds(state, action) {
      return {
        ...state,
        firstReport: {
          ...state.firstReport,
          customReport: {
            ...state.firstReport.customReport,
            indicatorsIds: action.payload.indicatorsIds,
          },
        },
      };
    },
    changeReport(state, { payload }) {
      return {
        ...state,
        report: payload,
      };
    },

    // 获取并修改当前所在的分类
    changeNavId(state, action) {
      return {
        ...state,
        navId: Number(action.payload.id),
      };
    },

    // 编辑表单是否显示
    changeCompareView(state, action) {
      return {
        ...state,
        compareVisiable: action.payload.flag,
      };
    },

    isShow(state, { payload }) {
      return {
        ...state,
        show: payload,
      };
    },

    // 点击同期对比出现的目录
    saveDirectory(state, action) {
      return {
        ...state,
        compareReportTotal: action.payload,
      };
    },

    // 对比的时间参数
    saveCompareParam(state, { payload }) {
      return {
        ...state,
        compareParam: {
          ...state.compareParam,
          ...payload,
        },
      };
    },
    clearCompareParam(state, { payload }) {
      return {
        ...state,
        compareParam: payload,
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
            permission: item.permission,
          };
        }),
      };
    },
    reportUserListUpdata(state, action) {
      return {
        ...state,
        shareUsers: action.payload,
      };
    },
  },
};
