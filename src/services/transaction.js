/**
 * 交易
 *  */
// import { stringify } from 'qs';
import request from '@/utils/request';
import FetchURL from './FetchURL';
import { getQueryPath } from '@/utils/utils';

export async function getOrderDetail(params = {}) {
  // 订单明细查询
  return request(FetchURL.orderDetailQuery, {
    method: 'GET',
    body: {
      ...params,
      startOrderTime: params.orderTime && params.orderTime[0], // 下单开始时间
      endOrderTime: params.orderTime && params.orderTime[1], // 下单结束时间
      startPaymentTime: params.paymentTime && params.paymentTime[0], // 付款开始时间
      endPaymentTime: params.paymentTime && params.paymentTime[1], // 付款结束时间
      district: params.district && params.district[0], // 地区
      province: params.district && params.district[1], // 省份
      city: params.district && params.district[2], // 城市
    },
  });
}

export async function getShipmentsDetail(params = {}) {
  // 发货明细查询
  return request(FetchURL.shipmentsDetailQuery, {
    method: 'GET',
    body: {
      ...params,
      startCreateTime: params.createTime && params.createTime[0], // 下单开始时间
      endCreateTime: params.createTime && params.createTime[1], // 下单结束时间
      startPaymentTime: params.paymentTime && params.paymentTime[0], // 付款开始时间
      endPaymentTime: params.paymentTime && params.paymentTime[1], // 付款结束时间
      startAffirmTime: params.affirmTime && params.affirmTime[0], // 确认开始时间
      endAffirmTime: params.affirmTime && params.affirmTime[1], // 确认结束时间
      district: params.district && params.district[0], // 地区
      province: params.district && params.district[1], // 省份
      city: params.district && params.district[2], // 城市
    },
  });
}

export async function getClearingIndexDetail(params = {}) {
  // 动销明细查询
  return request(FetchURL.clearingIndexDetailQuery, {
    method: 'GET',
    body: {
      ...params,
      startClearingTime: params.clearingTime && params.clearingTime[0], // 下单开始时间
      endClearingTime: params.clearingTime && params.clearingTime[1], // 下单结束时间
      district: params.district && params.district[0], // 地区
      province: params.district && params.district[1], // 省份
      city: params.district && params.district[2], // 城市
    },
  });
}

export async function getRefundmentDetail(params = {}) {
  // 退款明细查询
  return request(FetchURL.refundmentDetailQuery, {
    method: 'GET',
    body: {
      ...params,
      startOrderTime: params.orderTime && params.orderTime[0], // 退货源付款开始时间
      endOrderTime: params.orderTime && params.orderTime[1], // 退货源付款结束时间
      startCreateTime: params.createTime && params.createTime[0], // 退款提交开始时间
      endCreateTime: params.createTime && params.createTime[1], // 退款提交结束时间
      startRefundmentTime: params.refundmentTime && params.refundmentTime[0], // 退款完成时间开始时间
      endRefundmentTime: params.refundmentTime && params.refundmentTime[1], // 退款完成时间结束时间
      district: params.district && params.district[0], // 地区
      province: params.district && params.district[1], // 省份
      city: params.district && params.district[2], // 城市
    },
  });
}

export async function downloadOrderDetail(params = {}) {
  // 订单明细下载
  return getQueryPath(FetchURL.downloadOrderDetailDownload, {
    ...params,
    startOrderTime: params.orderTime && params.orderTime[0], // 下单开始时间
    endOrderTime: params.orderTime && params.orderTime[1], // 下单结束时间
    startPaymentTime: params.paymentTime && params.paymentTime[0], // 付款开始时间
    endPaymentTime: params.paymentTime && params.paymentTime[1], // 付款结束时间
    district: params.district && params.district[0], // 地区
    province: params.district && params.district[1], // 省份
    city: params.district && params.district[2], // 城市
  });
}

export async function downloadReport(params = {}) {
  // 订单明细下载
  return getQueryPath(FetchURL.downloadReport, {
    ...params,
  });
}

export async function downloadPublicReport(params = {}) {
  // 订单明细下载
  return getQueryPath(FetchURL.downloadPublicReport, {
    ...params,
  });
}

export async function downloadReportCompare(params = {}) {
  // 订单明细下载
  return getQueryPath(FetchURL.downloadReportCompare, {
    ...params,
  });
}
export async function downloadShipmentsDetail(params = {}) {
  // 发货明细下载
  return getQueryPath(FetchURL.downloadShipmentsDetailDownload, {
    ...params,
    startCreateTime: params.createTime && params.createTime[0], // 下单开始时间
    endCreateTime: params.createTime && params.createTime[1], // 下单结束时间
    startPaymentTime: params.paymentTime && params.paymentTime[0], // 付款开始时间
    endPaymentTime: params.paymentTime && params.paymentTime[1], // 付款结束时间
    startAffirmTime: params.affirmTime && params.affirmTime[0], // 确认开始时间
    endAffirmTime: params.affirmTime && params.affirmTime[1], // 确认结束时间
    district: params.district && params.district[0], // 地区
    province: params.district && params.district[1], // 省份
    city: params.district && params.district[2], // 城市
  });
}

export async function downloadClearingindexDetail(params = {}) {
  // 动销明细下载
  return getQueryPath(FetchURL.downloadClearingindexDetailDownload, {
    ...params,
    startClearingTime: params.clearingTime && params.clearingTime[0], // 下单开始时间
    endClearingTime: params.clearingTime && params.clearingTime[1], // 下单结束时间
    district: params.district && params.district[0], // 地区
    province: params.district && params.district[1], // 省份
    city: params.district && params.district[2], // 城市
  });
}

export async function downloadRefundmentDetail(params = {}) {
  // 退款明细下载
  return getQueryPath(FetchURL.downloadRefundmentDetailDownload, {
    ...params,
    startOrderTime: params.orderTime && params.orderTime[0], // 退货源付款开始时间
    endOrderTime: params.orderTime && params.orderTime[1], // 退货源付款结束时间
    startCreateTime: params.createTime && params.createTime[0], // 退款提交开始时间
    endCreateTime: params.createTime && params.createTime[1], // 退款提交结束时间
    startRefundmentTime: params.refundmentTime && params.refundmentTime[0], // 退款完成时间开始时间
    endRefundmentTime: params.refundmentTime && params.refundmentTime[1], // 退款完成时间结束时间
    district: params.district && params.district[0], // 地区
    province: params.district && params.district[1], // 省份
    city: params.district && params.district[2], // 城市
  });
}

export async function directoryQuery(params = {}) {
  // 目录查询
  return request(FetchURL.directoryQuery, {
    method: 'GET',
    body: params,
  });
}

export async function directoryQueryOffical(params = {}) {
  // 目录查询
  return request(FetchURL.directoryQueryOffical, {
    method: 'GET',
    body: params,
  });
}

export async function directorySave(params = {}) {
  // 添加目录
  return request(FetchURL.directorySave, {
    method: 'POST',
    body: params,
  });
}

export async function directoryUpdate(params = {}) {
  // 修改目录
  return request(FetchURL.directoryUpdate, {
    method: 'POST',
    body: params,
  });
}

export async function reportUpatePriority(params = {}) {
  // 报表优先级修改
  return request(FetchURL.reportUpatePriority, {
    method: 'GET',
    body: params,
  });
}

export async function directoryDelete(params = {}) {
  // 删除目录
  return request(FetchURL.directoryDelete, {
    method: 'POST',
    body: params,
  });
}

export async function customReportQuery(params = {}) {
  // 查询报表
  return request(FetchURL.customReportQuery, {
    method: 'GET',
    body: params,
  });
}

export async function customReportQueryData(params = {}) {
  // 报表数据查询
  return request(FetchURL.customReportQueryData, {
    method: 'GET',
    body: params,
  });
}

export async function customReportSave(params = {}) {
  // 增加报表
  return request(FetchURL.customReportSave, {
    method: 'POST',
    body: params,
  });
}

export async function reportDelete(params = {}) {
  // 删除报表
  return request(FetchURL.customReportDelete, {
    method: 'POST',
    body: params,
  });
}

export async function reportDetail(params = {}) {
  // 获取报表详情
  return request(FetchURL.customReportDetail, {
    method: 'GET',
    body: params,
  });
}

export async function dataCompareReportQuery(params = {}) {
  // 查询报表
  return request(FetchURL.dataCompareReportQuery, {
    method: 'GET',
    body: params,
  });
}

export async function dataCompareReportQueryData(params = {}) {
  // 报表数据查询
  return request(FetchURL.dataCompareReportQueryData, {
    method: 'GET',
    body: params,
  });
}

export async function dataCompareReportSave(params = {}) {
  // 增加同期对比报表
  return request(FetchURL.dataCompareReportSave, {
    method: 'POST',
    body: params,
  });
}

export async function dataCompareReportDelete(params = {}) {
  // 删除同期对比报表
  return request(FetchURL.dataCompareReportDelete, {
    method: 'POST',
    body: params,
  });
}

export async function dataCompareReportDetail(params = {}) {
  // 获取同期对比报表详情
  return request(FetchURL.dataCompareReportDetail, {
    method: 'GET',
    body: params,
  });
}

export async function dataCompareReportList(params = {}) {
  // 根据报表获取所有同期对比报表
  return request(FetchURL.dataCompareReportList, {
    method: 'POST',
    body: params,
  });
}

export async function fetchIndicatorTypeList(params) {
  // 获取指标分类
  return request(FetchURL.indicatorTypeList, {
    method: 'GET',
    body: params,
  });
}

export async function indicatorsQuery(params) {
  // 指标列表获取
  return request(FetchURL.indicatorsQuery, {
    method: 'GET',
    body: params,
  });
}

export async function indicatorsInfo(params) {
  // 指标详情获取
  return request(FetchURL.indicatorsInfo, {
    method: 'GET',
    body: params,
  });
}

export async function downloadSave(params = {}) {
  // 下载记录增加
  return request(FetchURL.downloadSave, {
    method: 'POST',
    body: params,
  });
}

// 公开报表
export async function customReportQueryOffical(params = {}) {
  // 查询报表
  return request(FetchURL.customReportQueryOffical, {
    method: 'GET',
    body: params,
  });
}

export async function customReportQueryDataOffical(params = {}) {
  // 报表数据查询
  return request(FetchURL.customReportQueryDataOffical, {
    method: 'GET',
    body: params,
  });
}

export async function customReportSaveOffical(params = {}) {
  // 增加报表
  return request(FetchURL.customReportSaveOffical, {
    method: 'POST',
    body: params,
  });
}

export async function selectIndicatorData(params = {}) {
  // 下拉框选择
  return request(FetchURL.selectIndicatorData, {
    method: 'GET',
    body: params,
  });
}

export async function reportDeleteOffical(params = {}) {
  // 删除报表
  return request(FetchURL.customReportDeleteOffical, {
    method: 'POST',
    body: params,
  });
}

export async function reportDetailOffical(params = {}) {
  // 获取报表详情
  return request(FetchURL.customReportDetailOffical, {
    method: 'GET',
    body: params,
  });
}

export async function dataCompareReportSaveOffical(params = {}) {
  // 增加同期对比报表
  return request(FetchURL.dataCompareReportSaveOffical, {
    method: 'POST',
    body: params,
  });
}

export async function dataCompareReportDeleteOffical(params = {}) {
  // 删除同期对比报表
  return request(FetchURL.dataCompareReportDeleteOffical, {
    method: 'POST',
    body: params,
  });
}

export async function deleteUserFromShareReport(params = {}) {
  // 删除报表的某一个共享用户
  return request(FetchURL.deleteUserFromShareReport, {
    method: 'POST',
    body: params,
  });
}

export async function reportIndicatorsQuery(params = {}) {
  // 指标公式
  return request(FetchURL.reportIndicatorsQuery, {
    method: 'GET',
    body: params,
  });
}

export async function reportIndicatorsList(params = {}) {
  // 获取某个报表所有公式
  return request(FetchURL.reportIndicatorsList, {
    method: 'GET',
    body: params,
  });
}

export async function reportSaveDefinedIndicators(params = {}) {
  // 新增公式
  return request(FetchURL.reportSaveDefinedIndicators, {
    method: 'POST',
    body: params,
  });
}

// 配置报表
export async function settingReportPriority(params = {}) {
  // 报表优先级修改
  return request(FetchURL.settingReportPriority, {
    method: 'GET',
    body: params,
  });
}

export async function settingReportQuery(params = {}) {
  // 查询报表
  return request(FetchURL.settingReportQuery, {
    method: 'GET',
    body: params,
  });
}

export async function settingReportQueryData(params = {}) {
  // 报表数据查询
  return request(FetchURL.settingReportQueryData, {
    method: 'GET',
    body: {
      ...params,
      pageNo: params.pageNo || 1,
      pageSize: params.pageSize || 10,
    },
  });
}

export async function settingReportSave(params = {}) {
  // 增加报表
  return request(FetchURL.settingReportSave, {
    method: 'POST',
    body: params,
  });
}

export async function settingReportDelete(params = {}) {
  // 删除报表
  return request(FetchURL.settingReportDelete, {
    method: 'POST',
    body: params,
  });
}

export async function settingReportDetail(params = {}) {
  // 获取报表详情
  return request(FetchURL.settingReportDetail, {
    method: 'GET',
    body: params,
  });
}

export async function settingReportDatasource(params = {}) {
  // 获取报表详情
  return request(FetchURL.settingReportDatasource, {
    method: 'GET',
    body: params,
  });
}

export async function settingReportOthers(params = {}) {
  // 获取报表详情
  return request(FetchURL.settingReportOthers, {
    method: 'GET',
    body: params,
  });
}

export async function downloadSettingReport(params = {}) {
  // 获取报表详情
  return getQueryPath(FetchURL.downloadSettingReport, {
    ...params,
  });
}
export async function directoryCockpitQuery(params = {}) {
  // 目录查询
  return request(FetchURL.directoryCockpitQuery, {
    method: 'GET',
    body: params,
  });
}

export async function reportListData(params = {}) {
  // 目录查询
  return request(FetchURL.reportListData, {
    method: 'GET',
    body: params,
  });
}

export async function userPermissList(params = {}) {
  // 权限-人员列表
  return request(FetchURL.userPermissList, {
    method: 'GET',
    body: params,
  });
}

export async function datasourcePermissList(params = {}) {
  // 权限-数据源
  return request(FetchURL.datasourcePermissList, {
    method: 'GET',
    body: params,
  });
}

export async function reportPermissList(params = {}) {
  // 权限-用户报表
  return request(FetchURL.reportPermissList, {
    method: 'GET',
    body: params,
  });
}

export async function addTablePermission(params = {}) {
  // 权限-用户报表
  return request(FetchURL.addTablePermission, {
    method: 'POST',
    body: params,
  });
}

// 数据需求
export async function dataJobHistoryList(params) {
  // 获取下载需求列表
  return request(FetchURL.dataJobHistoryList, {
    method: 'GET',
    body: params,
  });
}

export async function dataJobList(params) {
  // 获取需求列表
  return request(FetchURL.dataJobList, {
    method: 'GET',
    body: params,
  });
}

export async function dataJobSave(params) {
  // 添加编辑模板
  return request(FetchURL.dataJobSave, {
    method: 'POST',
    body: params,
  });
}

export async function dataJobAddSubtasks(params) {
  // 添加子任务
  return request(FetchURL.dataJobAddSubtasks, {
    method: 'GET',
    body: params,
  });
}

export async function dataJobInfo(params) {
  // 需求详情
  return request(FetchURL.dataJobInfo, {
    method: 'GET',
    body: params,
  });
}

export async function dataJobClose(params) {
  // 关闭
  return request(FetchURL.dataJobClose, {
    method: 'POST',
    body: params,
  });
}

export async function dataJobAccurate(params) {
  // 需求准确无误
  return request(FetchURL.dataJobAccurate, {
    method: 'POST',
    body: params,
  });
}

export async function dataJobConfim(params) {
  // 需求确认
  return request(FetchURL.dataJobConfim, {
    method: 'POST',
    body: params,
  });
}

export async function dataJobUploadData(params) {
  // 上传数据
  return request(FetchURL.dataJobUploadData, {
    method: 'POST',
    body: params,
  });
}

export async function dataJobOperate(params) {
  // 数据执行人
  return request(FetchURL.dataJobOperate, {
    method: 'POST',
    body: params,
  });
}

export async function dataJobProblems(params) {
  // 数据需求问题
  return request(FetchURL.dataJobProblems, {
    method: 'POST',
    body: params,
  });
}

export async function dataJobReview(params) {
  // 数据审核人
  return request(FetchURL.dataJobReview, {
    method: 'POST',
    body: params,
  });
}

export async function dataJobUpdatePriority(params) {
  // 优先级修改
  return request(FetchURL.dataJobUpdatePriority, {
    method: 'POST',
    body: params,
  });
}

export async function dataJobDownload(params) {
  // 需求下载
  return getQueryPath(FetchURL.dataJobDownload, {
    ...params,
  });
}

export async function dataJobHistoryDownload(params) {
  // 记录下载
  return request(FetchURL.dataJobHistoryDownload, {
    method: 'GET',
    body: params,
  });
}

export async function dataJobGetSort(params) {
  // 顺序
  return request(FetchURL.dataJobGetSort, {
    method: 'GET',
    body: params,
  });
}

export async function dataJobGetAdminList(params) {
  // 后台数据需求下载列表
  return request(FetchURL.dataJobGetAdminList, {
    method: 'GET',
    body: params,
  });
}

export async function dataJobAdminUpdateIndicate(params) {
  // 后台数据需求有效期修改
  return request(FetchURL.dataJobAdminUpdateIndicate, {
    method: 'POST',
    body: params,
  });
}

// 公开报表
export async function settingReportPublicPriority(params = {}) {
  // 报表优先级修改
  return request(FetchURL.settingReportPublicPriority, {
    method: 'GET',
    body: params,
  });
}

export async function settingReportPublicQuery(params = {}) {
  // 查询报表
  return request(FetchURL.settingReportPublicQuery, {
    method: 'GET',
    body: params,
  });
}

export async function settingReportPublicQueryData(params = {}) {
  // 报表数据查询
  return request(FetchURL.settingReportPublicQueryData, {
    method: 'GET',
    body: {
      ...params,
      pageNo: params.pageNo || 1,
      pageSize: params.pageSize || 10,
    },
  });
}

export async function settingReportPublicSave(params = {}) {
  // 增加报表
  return request(FetchURL.settingReportPublicSave, {
    method: 'POST',
    body: params,
  });
}

export async function settingReportPublicDelete(params = {}) {
  // 删除报表
  return request(FetchURL.settingReportPublicDelete, {
    method: 'POST',
    body: params,
  });
}

export async function settingReportPublicDetail(params = {}) {
  // 获取报表详情
  return request(FetchURL.settingReportPublicDetail, {
    method: 'GET',
    body: params,
  });
}

export async function shareReportPublic(params = {}) {
  // 获取报表详情
  return request(FetchURL.shareReportPublic, {
    method: 'POST',
    body: params,
  });
}

export async function getUsersByReportId(params = {}) {
  // 根据报表获取到共享用户
  return request(FetchURL.getUsersByReportId, {
    method: 'GET',
    body: params,
  });
}

export async function getReportList(params = {}) {
  // 获取所有报表
  return request(FetchURL.getReportList, {
    method: 'GET',
    body: params,
  });
}
