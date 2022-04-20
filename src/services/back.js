import request from '@/utils/request';
import FetchURL from './FetchURL';
import { getQueryPath } from '@/utils/utils';

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

export async function indicatorsSave(params) {
  // 指标保存
  return request(FetchURL.indicatorsSave, {
    method: 'POST',
    body: params,
  });
}

export async function indicatorUpload(params) {
  // 指标保存
  return request(FetchURL.indicatorUpload, {
    method: 'POST',
    body: params,
  });
}

export async function enableSwitch(params) {
  // 指标启用开关
  return request(FetchURL.indicatorsIsEnable, {
    method: 'POST',
    body: params,
  });
}

export async function dbInstanceQuery(params) {
  // 实例列表获取
  return request(FetchURL.dbInstanceQuery, {
    method: 'GET',
    body: params,
  });
}

export async function dbInstanceInfo(params) {
  // 实例详情获取
  return request(FetchURL.dbInstanceInfo, {
    method: 'GET',
    body: params,
  });
}

export async function dbInstanceSave(params) {
  // 实例保存
  return request(FetchURL.dbInstanceSave, {
    method: 'POST',
    body: params,
  });
}

export async function dbInstanceDelete(params) {
  // 实例删除
  return request(FetchURL.dbInstanceDelete, {
    method: 'POST',
    body: params,
  });
}

export async function dataCollectionGets(params) {
  // 数据采集列表获取
  return request(FetchURL.dataCollectionGets, {
    method: 'GET',
    body: params,
  });
}

export async function dataCollectionInfo(params) {
  // 数据采集详情获取
  return request(FetchURL.dataCollectionInfo, {
    method: 'GET',
    body: params,
  });
}

export async function dataCollectionSave(params) {
  // 数据采集保存
  return request(FetchURL.dataCollectionSave, {
    method: 'POST',
    body: params,
  });
}

export async function dataCollectionIsEnable(params) {
  // 数据采集启用开关
  return request(FetchURL.dataCollectionIsEnable, {
    method: 'POST',
    body: params,
  });
}

export async function collectHistoryGets(params) {
  // 数据采集列表获取
  return request(FetchURL.collectHistoryGets, {
    method: 'GET',
    body: params,
  });
}

export async function testDataCollection(params) {
  // 数据采集测试
  return request(FetchURL.testDataCollection, {
    method: 'POST',
    body: params,
  });
}

export async function dataCollectionImport(params) {
  // 数据采集导入
  return request(FetchURL.dataCollectionImport, {
    method: 'POST',
    body: params,
  });
}

export async function dataCollectionExport(params) {
  // 数据采集导入
  return getQueryPath(FetchURL.dataCollectionExport, {
    ...params,
  });
}

export async function fetchIndicatorTypeList(params) {
  // 获取指标分类
  return request(FetchURL.indicatorTypeList, {
    method: 'GET',
    body: params,
  });
}

export async function scriptLibraryQuery(params) {
  // 脚本库列表获取
  return request(FetchURL.scriptLibraryQuery, {
    method: 'GET',
    body: params,
  });
}

export async function scriptLibraryInfo(params) {
  // 脚本库详情获取
  return request(FetchURL.scriptLibraryInfo, {
    method: 'GET',
    body: params,
  });
}

export async function scriptLibrarySave(params) {
  // 脚本库保存
  return request(FetchURL.scriptLibrarySave, {
    method: 'POST',
    body: params,
  });
}

export async function userRegistered(params) {
  // 新增用户
  return request(FetchURL.userRegistered, {
    method: 'POST',
    body: params,
  });
}

export async function userUpdate(params) {
  // 修改用户
  return request(FetchURL.userUpdate, {
    method: 'POST',
    body: params,
  });
}

export async function userisEnable(params) {
  // 是否启用
  return request(FetchURL.userisEnable, {
    method: 'POST',
    body: params,
  });
}

export async function userPostPermission(params) {
  // 用户岗位权限
  return request(FetchURL.userPostPermission, {
    method: 'GET',
    body: params,
  });
}

export async function userGetInfo(params) {
  // 获取用户信息
  return request(FetchURL.userGetInfo, {
    method: 'GET',
    body: params,
  });
}

export async function userGets(params) {
  // 获取用户信息
  return request(FetchURL.userGets, {
    method: 'GET',
    body: params,
  });
}

export async function userDataDemanGets(params) {
  // 获取数据需求用户信息
  return request(FetchURL.userDataDemanGets, {
    method: 'GET',
    body: params,
  });
}

export async function permissPostIsEnable(params) {
  // 是否启用
  return request(FetchURL.permissPostIsEnable, {
    method: 'POST',
    body: params,
  });
}

export async function permissPostGets(params) {
  // 岗位信息详细获取
  return request(FetchURL.permissPostGets, {
    method: 'GET',
    body: params,
  });
}

export async function permissPostSave(params) {
  // 添加岗位
  return request(FetchURL.permissPostSave, {
    method: 'POST',
    body: params,
  });
}

export async function permissPostQuery(params) {
  // 岗位列表
  return request(FetchURL.permissPostQuery, {
    method: 'GET',
    body: params,
  });
}

export async function indicatorQuery(params) {
  // 指标查询
  return request(FetchURL.indicatorQuery, {
    method: 'GET',
    body: params,
  });
}

export async function navigateMenuList(params) {
  // 查询目录
  return request(FetchURL.navigateMenuList, {
    method: 'GET',
    body: params,
  });
}

export async function navigateMenuAdd(params) {
  // 查询目录
  return request(FetchURL.navigateMenuAdd, {
    method: 'POST',
    body: params,
  });
}

export async function reportGetsByUesrId(params) {
  // 根据用户获取报表
  return request(FetchURL.reportGetsByUesrId, {
    method: 'GET',
    body: params,
  });
}

export async function reportIndicatosGetsByUesrId(params) {
  // 根据用户获取报表,根据报表id获取指标
  return request(FetchURL.reportIndicatosGetsByUesrId, {
    method: 'GET',
    body: params,
  });
}

export async function updateReportIndicatos(params) {
  // 根据用户获取报表,根据报表id获取指标修改指标
  return request(FetchURL.updateReportIndicatos, {
    method: 'POST',
    body: params,
  });
}

export async function indicatorsGetsByUserId(params) {
  // 根据用户获取指标
  return request(FetchURL.indicatorsGetsByUserId, {
    method: 'GET',
    body: params,
  });
}

export async function reportGetsByIndicators(params) {
  // 用户指标对应报表
  return request(FetchURL.reportGetsByIndicators, {
    method: 'GET',
    body: params,
  });
}

export async function reportDeleteByIndicators(params) {
  // 用户指标删除对应的报表
  return request(FetchURL.reportDeleteByIndicators, {
    method: 'POST',
    body: params,
  });
}

export async function lineTagQuery(params) {
  // 线性标签列表
  return request(FetchURL.lineTagQuery, { method: 'GET', body: params });
}

export async function lineTagInfo(params) {
  // 线性详情
  return request(FetchURL.lineTagInfo, {
    method: 'GET',
    body: params,
  });
}

export async function lineTagSave(params) {
  // 保存线性标签
  return request(FetchURL.lineTagSave, {
    method: 'POST',
    body: params,
  });
}

export async function lineTagIsEnable(params) {
  // 是否启用标签
  return request(FetchURL.lineTagIsEnable, {
    method: 'POST',
    body: params,
  });
}

export async function apiList(params) {
  // api列表
  return request(FetchURL.apiList, {
    method: 'GET',
    body: params,
  });
}

export async function apiInfo(params) {
  // api列表
  return request(FetchURL.apiInfo, {
    method: 'GET',
    body: params,
  });
}

export async function saveApi(params) {
  // 创建api
  return request(FetchURL.saveApi, {
    method: 'POST',
    body: params,
  });
}

export async function tableStructureQuery(params) {
  // 获取表结构列表
  return request(FetchURL.tableStructureQuery, {
    method: 'GET',
    body: params,
  });
}

export async function tableStructureGet(params) {
  // 获取表结构列表判断表结构是否重复
  return request(FetchURL.tableStructureGet, {
    method: 'GET',
    body: params,
  });
}

export async function tableStructureInfo(params) {
  // 查询表结构建表信息
  return request(FetchURL.tableStructureInfo, {
    method: 'GET',
    body: params,
  });
}

export async function tableStructureSave(params) {
  // 新增表
  return request(FetchURL.tableStructureSave, {
    method: 'POST',
    body: params,
  });
}

export async function tableStructureFieldsInfo(params) {
  // 查询表结构字段信息
  return request(FetchURL.tableStructureFieldsInfo, {
    method: 'GET',
    body: params,
  });
}
export async function tableStructureAddFields(params) {
  // 新增字段
  return request(FetchURL.tableStructureAddFields, {
    method: 'POST',
    body: params,
  });
}
export async function tableStructureUpdataFields(params) {
  // 修改字段
  return request(FetchURL.tableStructureUpdataFields, {
    method: 'POST',
    body: params,
  });
}

export async function tableStructureUpdataIndex(params) {
  // 修改索引
  return request(FetchURL.tableStructureUpdataIndex, {
    method: 'POST',
    body: params,
  });
}

export async function tableStructureHistory(params) {
  // 历史记录
  return request(FetchURL.tableStructureHistory, {
    method: 'GET',
    body: params,
  });
}

export async function tableStructureDeleteData(params) {
  // 清除数据
  return request(FetchURL.tableStructureDeleteData, {
    method: 'POST',
    body: params,
  });
}

export async function tableStructureDelete(params) {
  // 删除表结构信息
  return request(FetchURL.tableStructureDelete, {
    method: 'POST',
    body: params,
  });
}

export async function tableStructureImport(params) {
  // 表结构导入
  return request(FetchURL.tableStructureImport, {
    method: 'POST',
    body: params,
  });
}

export async function tableStructureExport(params) {
  // 表结构导入
  return getQueryPath(FetchURL.tableStructureExport, {
    ...params,
  });
}

export async function tableStructureFieldsList(params) {
  // 表字段属性
  return request(FetchURL.tableStructureFieldsList, {
    method: 'GET',
    body: params,
  });
}

export async function tableStructureUpdate(params) {
  // 修改字段属性
  return request(FetchURL.tableStructureUpdate, {
    method: 'POST',
    body: params,
  });
}

export async function tableStructureFieldsUpdate(params) {
  // 修改字段属性
  return request(FetchURL.tableStructureFieldsUpdate, {
    method: 'POST',
    body: params,
  });
}

export async function tableStructureUpdateAlias(params) {
  // 修改字段中文
  return request(FetchURL.tableStructureUpdateAlias, {
    method: 'POST',
    body: params,
  });
}

export async function tableStructureUpdateSelector(params) {
  // 修改选择器
  return request(FetchURL.tableStructureUpdateSelector, {
    method: 'POST',
    body: params,
  });
}

export async function dataBaseQueryList(params) {
  // 修改字段属性
  return request(FetchURL.dataBaseQueryList, {
    method: 'GET',
    body: params,
  });
}

export async function tableChannelList(params) {
  // 获取
  return request(FetchURL.tableChannelList, {
    method: 'GET',
    body: params,
  });
}

export async function tableParticlenList(params) {
  // 获取粒度数据
  return request(FetchURL.tableParticlenList, {
    method: 'GET',
    body: params,
  });
}

export async function tableCategoryList(params) {
  // 获取所有表分类数据
  return request(FetchURL.tableCategoryList, {
    method: 'GET',
    body: params,
  });
}

export async function tableChannelAdd(params) {
  // 添加渠道
  return request(FetchURL.tableChannelAdd, {
    method: 'POST',
    body: params,
  });
}

export async function tableParticlenAdd(params) {
  // 添加粒度
  return request(FetchURL.tableParticlenAdd, {
    method: 'POST',
    body: params,
  });
}

export async function tableCategoryAdd(params) {
  // 添加表分类
  return request(FetchURL.tableCategoryAdd, {
    method: 'POST',
    body: params,
  });
}

export async function tableCategoryIsEnable(params) {
  // 添加表分类
  return request(FetchURL.tableCategoryIsEnable, {
    method: 'POST',
    body: params,
  });
}

export async function tableCollectQuery(params) {
  // 获取所有已采集的表
  return request(FetchURL.tableCollectQuery, {
    method: 'GET',
    body: params,
  });
}

export async function tableCollectDbInstanceQuery(params) {
  // 获取环境变量
  return request(FetchURL.tableCollectDbInstanceQuery, {
    method: 'GET',
    body: params,
  });
}

export async function tableCollectsave(params) {
  // 单表采集增加
  return request(FetchURL.tableCollectsave, {
    method: 'POST',
    body: params,
  });
}

export async function tableCollectInfo(params) {
  // 单表信息
  return request(FetchURL.tableCollectInfo, {
    method: 'GET',
    body: params,
  });
}

export async function tableCollectIsEnable(params) {
  // 启用
  return request(FetchURL.tableCollectIsEnable, {
    method: 'POST',
    body: params,
  });
}

export async function tableCollectIsSysnc(params) {
  // 是否启用同步
  return request(FetchURL.tableCollectIsSysnc, {
    method: 'POST',
    body: params,
  });
}

export async function tableCollectTest(params) {
  // 单表采集测试
  return request(FetchURL.tableCollectTest, {
    method: 'POST',
    body: params,
  });
}

export async function tableCollectReTry(params) {
  // 单表采集测试
  return request(FetchURL.tableCollectReTry, {
    method: 'POST',
    body: params,
  });
}

export async function tableCollectHistory(params) {
  // 单表采集测试
  return request(FetchURL.tableCollectHistory, {
    method: 'GET',
    body: params,
  });
}

export async function tableCollectImport(params) {
  // 单表导入表
  return request(FetchURL.tableCollectImport, {
    method: 'POST',
    body: params,
  });
}

export async function tableCollectExport(params) {
  // 单表采集导出
  return getQueryPath(FetchURL.tableCollectExport, {
    ...params,
  });
}

export async function DataRinseHistory(params) {
  // 单个清洗内容
  return request(FetchURL.DataRinseHistory, {
    method: 'GET',
    body: params,
  });
}

export async function DataRinseQuery(params) {
  // 清洗数据
  return request(FetchURL.DataRinseQuery, {
    method: 'GET',
    body: params,
  });
}

export async function DataRinseSave(params) {
  // 新增清洗数据
  return request(FetchURL.DataRinseSave, {
    method: 'POST',
    body: params,
  });
}

export async function DataRinseIsEnable(params) {
  // 是否启用
  return request(FetchURL.DataRinseIsEnable, {
    method: 'POST',
    body: params,
  });
}

export async function DataRinseInfo(params) {
  // 详情
  return request(FetchURL.DataRinseInfo, {
    method: 'GET',
    body: params,
  });
}

export async function DataRinseReTest(params) {
  // 数据清洗试运行
  return request(FetchURL.DataRinseReTest, {
    method: 'POST',
    body: params,
  });
}

export async function DataRinseReReTry(params) {
  // 数据清洗重运行
  return request(FetchURL.DataRinseReReTry, {
    method: 'POST',
    body: params,
  });
}

export async function tableCollectFromDb(params) {
  // 源库
  return request(FetchURL.tableCollectFromDb, {
    method: 'GET',
    body: params,
  });
}

export async function tableCollectDestDb(params) {
  // 目标库
  return request(FetchURL.tableCollectDestDb, {
    method: 'GET',
    body: params,
  });
}

// 数据导入
export async function dataImportList(params) {
  // 获取模板列表
  return request(FetchURL.dataImportList, {
    method: 'GET',
    body: params,
  });
}

export async function dataImportSave(params) {
  // 添加编辑模板
  return request(FetchURL.dataImportSave, {
    method: 'POST',
    body: params,
  });
}

export async function dataImportInfo(params) {
  // 模板详情
  return request(FetchURL.dataImportInfo, {
    method: 'GET',
    body: params,
  });
}

export async function dataImportIsEnable(params) {
  // 是否启用模板
  return request(FetchURL.dataImportIsEnable, {
    method: 'POST',
    body: params,
  });
}

export async function dataImportUserPermiss(params) {
  // 用户权限
  return request(FetchURL.dataImportUserPermiss, {
    method: 'POST',
    body: params,
  });
}

export async function dataImportUploadData(params) {
  // 上传数据
  return request(FetchURL.dataImportUploadData, {
    method: 'POST',
    body: params,
  });
}

export async function dataImportDownload(params) {
  // 下载模板
  return getQueryPath(FetchURL.dataImportDownload, {
    ...params,
  });
}

export async function dataImportPermissList(params) {
  // 已有模板权限的用户
  return request(FetchURL.dataImportPermissList, {
    method: 'GET',
    body: params,
  });
}

export async function uploadHistoryDownload(params) {
  // 下载模板
  return getQueryPath(FetchURL.uploadHistoryDownload, {
    ...params,
  });
}

export async function uploadPreviewDownload(params) {
  // 预览
  return request(FetchURL.uploadPreviewDownload, {
    method: 'GET',
    body: params,
  });
}

export async function dataImportUploadListData(params) {
  // 上传记录列表
  return request(FetchURL.dataImportUploadListData, {
    method: 'GET',
    body: params,
  });
}

// 定时邮件
export async function getMailList(params = {}) {
  // 获取定时邮件
  return request(FetchURL.mailListgets, {
    method: 'GET',
    body: params,
  });
}

export async function mailListEdit(params = {}) {
  // 获取定时邮件
  return request(FetchURL.mailListEdit, {
    method: 'POST',
    body: params,
  });
}

export async function mailListinfo(params = {}) {
  // 获取定时邮件
  return request(FetchURL.mailListinfo, {
    method: 'GET',
    body: params,
  });
}
