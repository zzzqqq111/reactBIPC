// 开发过程中要指定环境，在 config/config.js:87 的 proxy属性中改
const PREFIX = {
  bi: '/api/p/roseBi',
  member: '/api/p/member',
};

const getFullUrl = (prefix, url) => `${PREFIX[prefix]}${url}`;

export default {
  login: getFullUrl('bi', '/user/login'), // 登陆
  getDistrict: getFullUrl('bi', '/district/getDistrict'), // 地区列表
  queryProduct: getFullUrl('bi', '/product/queryProduct'), // 产品列表
  queryTeamtag: getFullUrl('bi', '/teamtag/queryTeamtag'), // 市场列表
  verifyCodeSend: getFullUrl('member', '/verify_code/send'), // 验证码
  sign: getFullUrl('bi', '/oss/getSign'), // 上传bi_dataOSS签名
  signUpload: getFullUrl('bi', '/auth/applyToken'), // 上传加密前的token
  signPublic: getFullUrl('member', '/cryptoGet'), // 上传OSS签名公有

  // 交易
  orderDetailQuery: getFullUrl('bi', '/orderDetail/query'), // 订单明细查询
  shipmentsDetailQuery: getFullUrl('bi', '/shipmentsDetail/query'), // 发货明细查询
  clearingIndexDetailQuery: getFullUrl('bi', '/clearingIndexDetail/query'), // 动销明细查询
  refundmentDetailQuery: getFullUrl('bi', '/refundmentDetail/query'), // 退款明细查询

  downloadOrderDetailDownload: getFullUrl('bi', '/Download/orderDetailDownload'), // 订单明细下载
  downloadShipmentsDetailDownload: getFullUrl('bi', '/Download/shipmentsDetailDownload'), // 发货明细下载
  downloadClearingindexDetailDownload: getFullUrl('bi', '/Download/clearingindexDetailDownload'), // 动销明细下载
  downloadRefundmentDetailDownload: getFullUrl('bi', '/Download/refundmentDetailDownload'), // 退款明细下载

  // 下载
  downloadQueryDownloadRecord: getFullUrl('bi', '/Download/queryDownloadRecord'), // 下载记录查询
  downloadSave: getFullUrl('bi', '/Download/save'), // 下载记录增加
  downloadDelete: getFullUrl('bi', '/Download/delete'), // 下载记录删除

  // 指标库
  indicatorsQuery: getFullUrl('bi', '/indicators/query'), // 指标列表获取
  indicatorsInfo: getFullUrl('bi', '/indicators/info'), // 指标详情获取
  indicatorsSave: getFullUrl('bi', '/indicators/save'), // 指标保存
  indicatorsIsEnable: getFullUrl('bi', '/indicators/isEnable'), // 启用开关
  indicatorTypeList: getFullUrl('bi', '/indicators/indicatorsType/indicatorTypeList'), // 指标分类
  indicatorUpload: getFullUrl('bi', '/indicators/multipartFiles'), // 上传指标

  // 实例管理
  dbInstanceQuery: getFullUrl('bi', '/dbInstance/query'), // 实例列表获取
  dbInstanceInfo: getFullUrl('bi', '/dbInstance/info'), // 实例详情获取
  dbInstanceSave: getFullUrl('bi', '/dbInstance/save'), // 实例保存
  dbInstanceDelete: getFullUrl('bi', '/dbInstance/delete'), // 实例删除

  // 数据采集
  dataCollectionGets: getFullUrl('bi', '/dataCollection/gets'), // 数据采集列表获取
  dataCollectionInfo: getFullUrl('bi', '/dataCollection/info'), // 数据采集详情获取
  dataCollectionSave: getFullUrl('bi', '/dataCollection/save'), // 保存数据采集
  dataCollectionIsEnable: getFullUrl('bi', '/dataCollection/isEnable'), // 启用开关
  collectHistoryGets: getFullUrl('bi', '/collectHistory/gets'), // 采集历史列表获取
  testDataCollection: getFullUrl('bi', '/dataCollection/tryTask'), // 测试采集
  dataCollectionExport: getFullUrl('bi', '/dataCollection/exportTask'), // 数据采集导出
  dataCollectionImport: getFullUrl('bi', '/dataCollection/multipartFiles'), // 数据采集导入

  // 脚本库
  scriptLibraryQuery: getFullUrl('bi', '/scriptLibrary/query'), // 脚本库列表获取
  scriptLibraryInfo: getFullUrl('bi', '/scriptLibrary/info'), // 脚本库详情获取
  scriptLibrarySave: getFullUrl('bi', '/scriptLibrary/save'), // 脚本库保存

  // 目录管理
  directoryQuery: getFullUrl('bi', '/directory/query'), // 目录列表获取
  directoryQueryOffical: getFullUrl('bi', '/directory/queryOfficial'), // 官方目录列表获取
  directoryCockpitQuery: getFullUrl('bi', '/directory/queryCockpit'), // 配置目录列表获取
  directorySave: getFullUrl('bi', '/directory/save'), // 目录列表添加
  directoryUpdate: getFullUrl('bi', '/directory/update'), // 目录列表修改
  directoryDelete: getFullUrl('bi', '/directory/delete'), // 目录列表删除

  // 自定义报表
  reportUpatePriority: getFullUrl('bi', '/customReport/priority'), // 报表目录优先级修改
  customReportQuery: getFullUrl('bi', '/customReport/query'), // 目录列表获取
  customReportQueryData: getFullUrl('bi', '/customReport/queryData'), // 目录列表获取
  customReportSave: getFullUrl('bi', '/customReport/save'), // 目录列表获取reportDelete
  customReportDelete: getFullUrl('bi', '/customReport/delete'), // 目录列表获取
  customReportDetail: getFullUrl('bi', '/customReport/info'), // 目录列表获取
  downloadReport: getFullUrl('bi', '/Download/customReport'), // 下载报表
  downloadReportCompare: getFullUrl('bi', '/Download/customReportComparing'), // 下载报表
  downloadPublicReport: getFullUrl('bi', '/Download/publicReport'), // 官方报表下载
  selectIndicatorData: getFullUrl('bi', '/indicators/indicatorsType/selectIndicatorData'), // 官方报表下载

  // 同期对比
  dataCompareReportQuery: getFullUrl('bi', '/customReport/queryCompare'), // 报表查询
  dataCompareReportQueryData: getFullUrl('bi', '/customReport/queryDataCompare'), // 报表数据查询
  dataCompareReportSave: getFullUrl('bi', '/customReport/saveCompare'), // 新增报表
  dataCompareReportDelete: getFullUrl('bi', '/customReport/deleteCompare'), // 删除报表
  dataCompareReportDetail: getFullUrl('bi', '/customReport/infoCompare'), // 报表详情
  dataCompareReportList: getFullUrl('bi', '/customReport/queryCompareList'), // 同期对比目录

  // 自定义报表公开
  customReportQueryOffical: getFullUrl('bi', '/customReport/queryOfficial'), // 目录列表获取
  customReportQueryDataOffical: getFullUrl('bi', '/customReport/queryDataOfficial'), // 目录列表获取
  customReportSaveOffical: getFullUrl('bi', '/customReport/saveOfficial'), // 目录列表获取reportDelete
  customReportDeleteOffical: getFullUrl('bi', '/customReport/deleteOfficial'), // 目录列表获取
  customReportDetailOffical: getFullUrl('bi', '/customReport/infoOfficial'), // 目录列表获取

  // 同期对比报表公开
  dataCompareReportSaveOffical: getFullUrl('bi', '/customReport/saveCompareOfficial'), // 新增报表
  dataCompareReportDeleteOffical: getFullUrl('bi', '/customReport/deleteCompareOfficial'), // 删除报表

  // 权限管理
  // permissDepartmentGets: getFullUrl('bi', '/post/departmentList'), // 获取部门
  permissPostGets: getFullUrl('bi', '/post/info'), // 获取岗位信息
  permissPostSave: getFullUrl('bi', '/post/save'), // 添加岗位
  permissPostQuery: getFullUrl('bi', '/post/query'), // 岗位列表
  permissPostIsEnable: getFullUrl('bi', '/post/isEnable'), // 是否启用
  indicatorQuery: getFullUrl('bi', '/indicators/indicatorQuery'), // 指标查询
  reportGetsByUesrId: getFullUrl('bi', '/customReport/permissionOfficial'), // 根据用户获取报表
  reportIndicatosGetsByUesrId: getFullUrl(
    'bi',
    '/userReportIndicators/userIndicatorsPermissionOfficial'
  ), // 根据用户获取报表,根据报表id获取指标
  updateReportIndicatos: getFullUrl('bi', '/userReportIndicators/saveUserPermissionOfficial'), // 根据用户获取报表,根据报表id获取指标修改指标
  indicatorsGetsByUserId: getFullUrl('bi', '/userReportIndicators/userIndicatorsPermission'), // 根据用户获取指标
  reportGetsByIndicators: getFullUrl('bi', '/userReportIndicators/IndicatorsQueryReport'), // 用户指标对应报表
  reportDeleteByIndicators: getFullUrl('bi', '/userReportIndicators/deleteUserPermission'), // 用户指标删除对应的报表
  // getUsersByReportId: getFullUrl('bi', '/userReportIndicators/reportQueryUser'), // 根据报表获取到共享用户
  deleteUserFromShareReport: getFullUrl('bi', '/userReportIndicators/deletereportUser'), // 删除报表的某一个共享用户

  // 用户管理
  userRegistered: getFullUrl('bi', '/user/registered'), // 新增用户
  userGetInfo: getFullUrl('bi', '/user/info'), // 用户详情
  userPostPermission: getFullUrl('bi', '/user/postPermission'), // 用户权限
  userUpdate: getFullUrl('bi', '/user/update'), // 修改用户
  userGets: getFullUrl('bi', '/user/gets'), // 用户获取
  userDataDemanGets: getFullUrl('bi', '/user/getUserName'), // 数据需求用户
  userisEnable: getFullUrl('bi', '/user/isDisable'), // 用户获取

  // 前台导航目录
  navigateMenuList: getFullUrl('bi', '/directory/getLevel'), // 获取导航菜单列表
  navigateMenuAdd: getFullUrl('bi', '/directory/saveLevel'), // 新增导航菜单列表

  // 线性管理
  lineTagQuery: getFullUrl('bi', '/lineTag/query'), // 线性标签标签
  lineTagSave: getFullUrl('bi', '/lineTag/save'), // 保存标签
  lineTagIsEnable: getFullUrl('bi', '/lineTag/isEnable'), // 是否启用
  lineTagInfo: getFullUrl('bi', '/lineTag/info'), // 标签详情

  // api管理
  apiList: getFullUrl('bi', '/apiReport/gets'), // 获取api列表
  apiInfo: getFullUrl('bi', '/apiReport/info'), // 获取api详情
  saveApi: getFullUrl('bi', '/apiReport/edit'), // 创建api接口

  // 公式
  reportIndicatorsQuery: getFullUrl('bi', '/customReport/queryDefinedIndicators'), // 获取公式详情
  reportSaveDefinedIndicators: getFullUrl('bi', '/customReport/saveDefinedIndicators'), // 增加自定义指标公式
  reportIndicatorsList: getFullUrl('bi', '/customReport/queryDefinedIndicatorsList'), // 增加自定义指标公式

  // 表结构
  tableStructureQuery: getFullUrl('bi', '/table_structure/gets'), // 获取表结构列表
  tableStructureGet: getFullUrl('bi', '/table_structure/getTableName'), // 获取表结构列表判断是否重复
  tableStructureInfo: getFullUrl('bi', '/table_structure/showTable'), // 查询表结构建表信息
  tableStructureFieldsInfo: getFullUrl('bi', '/table_structure/showTableField'), // 查询表结构字段信息
  tableStructureSave: getFullUrl('bi', '/table_structure/saveTableStructure'), // 新增表
  tableStructureAddFields: getFullUrl('bi', '/table_structure/saveTableField'), // 新增字段
  tableStructureUpdataFields: getFullUrl('bi', '/table_structure/updateTableField'), // 修改字段
  tableStructureUpdataIndex: getFullUrl('bi', '/table_structure/editIndex'), // 修改索引
  tableStructureHistory: getFullUrl('bi', '/table_structure/queryTableStructureOperationLog'), // 历史记录
  tableStructureDeleteData: getFullUrl('bi', '/table_structure/deleteTableData'), // 历史记录
  tableStructureExport: getFullUrl('bi', '/table_structure/exportTask'), // 表结构导入
  tableStructureImport: getFullUrl('bi', '/table_structure/multipartFiles'), // 表结构导入
  tableStructureFieldsList: getFullUrl('bi', '/table_field/showTableFieldAttribute'), // 获取表字段属性信息
  tableStructureFieldsUpdate: getFullUrl('bi', '/table_field/updateTableFieldAttribute'), // 修改表字段属性信息
  dataBaseQueryList: getFullUrl('bi', '/data_db/queryName'), // 获取库名
  tableStructureUpdate: getFullUrl('bi', '/table_structure/updateTableStructure'), // 修改表结构
  tableStructureDelete: getFullUrl('bi', '/table_field/deleteTable'), // 删除表结构
  tableStructureUpdateAlias: getFullUrl('bi', '/table_field/updateTableColumnComment'), // 修改字段中文注释

  // 分类
  tableChannelList: getFullUrl('bi', '/table_type/getChannel'), // 渠道列表
  tableParticlenList: getFullUrl('bi', '/table_type/getParticlen'), // 颗粒获取
  tableCategoryList: getFullUrl('bi', '/table_type/getTableType'), // 表分类获取
  tableChannelAdd: getFullUrl('bi', '/table_type/saveChannel'), // 增加渠道
  tableParticlenAdd: getFullUrl('bi', '/table_type/saveParticlen'), // 增加颗粒
  tableCategoryAdd: getFullUrl('bi', '/table_type/saveTableType'), // 增加表分类
  tableCategoryIsEnable: getFullUrl('bi', '/table_type/isEnable'), // 增加表分类

  // 单表采集
  tableCollectQuery: getFullUrl('bi', '/tableCollect/query'), // 获取所有已采集的表
  tableCollectsave: getFullUrl('bi', '/tableCollect/save'), // 单表采集增加
  tableCollectInfo: getFullUrl('bi', '/tableCollect/info'), // 单表信息
  tableCollectIsEnable: getFullUrl('bi', '/tableCollect/isEnable'), // 是否启用此表
  tableCollectTest: getFullUrl('bi', '/tableCollect/try'), // 测试采集
  tableCollectImport: getFullUrl('bi', '/tableCollect/import'), // 测试采集
  tableCollectExport: getFullUrl('bi', '/tableCollect/export'), // 测试采集
  tableCollectFromDb: getFullUrl('bi', '/tableCollect/fromDbList'), // 源库
  tableCollectDestDb: getFullUrl('bi', '/tableCollect/destDbList'), // 目标库
  tableCollectReTry: getFullUrl('bi', '/tableCollect/reTry'), // 目标库
  tableCollectHistory: getFullUrl('bi', '/tableCollect/gets'), // 目标库
  tableCollectDbInstanceQuery: getFullUrl('bi', '/tableCollect/dbInstanceList'), // 环境列表
  tableCollectIsSysnc: getFullUrl('bi', '/tableCollect/openSync'), // 是否开启

  // 数据清洗
  DataRinseIsEnable: getFullUrl('bi', '/data-rinse/isEnable'), // 是否启用
  DataRinseSave: getFullUrl('bi', '/data-rinse/save'), // 新增清洗数据
  DataRinseQuery: getFullUrl('bi', '/data-rinse/gets'), // 清洗数据
  DataRinseHistory: getFullUrl('bi', '/data-rinse/data-rinse-history'), // 单个清洗内容
  DataRinseInfo: getFullUrl('bi', '/data-rinse/info'), // 单个清洗内容
  DataRinseReReTry: getFullUrl('bi', '/data-rinse/reTry'), // 重运行
  DataRinseReTest: getFullUrl('bi', '/data-rinse/try'), // 试运行

  // 驾驶舱报表
  settingReportPriority: getFullUrl('bi', '/cockpit-report/priority'), // 报表目录优先级修改
  settingReportQuery: getFullUrl('bi', '/cockpit-report/query'), // 目录列表获取
  settingReportQueryData: getFullUrl('bi', '/cockpit-report/queryData'), // 目录列表获取
  settingReportSave: getFullUrl('bi', '/cockpit-report/edit'), // 目录列表获取reportDelete
  settingReportDelete: getFullUrl('bi', '/cockpit-report/delete'), // 目录列表获取
  settingReportDetail: getFullUrl('bi', '/cockpit-report/info'), // 目录列表获取
  settingReportDatasource: getFullUrl('bi', '/cockpit-report/queryDatasource'), // 获取数据库
  settingReportOthers: getFullUrl('bi', '/cockpit-report/queryDimensionsIndicators'), // 维度指标获取
  downloadSettingReport: getFullUrl('bi', '/Download/cockpitReport'), // 下载报表
  reportListData: getFullUrl('bi', '/table_field/querySelectorValue'), // 驾驶舱报表下载
  userPermissList: getFullUrl('bi', '/cockpit-report/userList'), // 权限-人员列表
  datasourcePermissList: getFullUrl('bi', '/cockpit-report/userPermissions'), // 权限-数据源
  reportPermissList: getFullUrl('bi', '/cockpit-report/userReportList'), // 权限-用户报表
  // reportPermissList: getFullUrl('bi', '/cockpit-report/userReportList'), // 权限-用户报表
  addTablePermission: getFullUrl('bi', '/cockpit-report/addTablePermissions'), // 权限-用户报表

  // 数据导入
  dataImportList: getFullUrl('bi', '/dataImport/template/query'), //  获取模板列表
  dataImportSave: getFullUrl('bi', '/dataImport/save'), // 添加编辑模板
  dataImportInfo: getFullUrl('bi', '/dataImport/info'), // 模板详情
  dataImportIsEnable: getFullUrl('bi', '/dataImport/isEnable'), // 是否启用模板
  dataImportUserPermiss: getFullUrl('bi', '/dataImport/permission'), // 用户权限
  dataImportDownload: getFullUrl('bi', '/dataImport/template/download'), // 下载模板
  dataImportUploadData: getFullUrl('bi', '/dataImport/importRecord/uploadData'), // 上传数据
  dataImportUploadListData: getFullUrl('bi', '/dataImport/importRecord/query'), // 上传记录列表
  dataImportPermissList: getFullUrl('bi', '/dataImport/permissionInfo'), // 已有模板权限的用户
  uploadHistoryDownload: getFullUrl('bi', '/dataImport/importRecord/download'), // 下载
  uploadPreviewDownload: getFullUrl('bi', '/dataImport/importRecord/preview'), // 预览

  // 数据需求
  dataJobHistoryList: getFullUrl('bi', '/dataJob/gets'), //  获取下载需求列表
  dataJobList: getFullUrl('bi', '/dataJob/getsFront'), //  获取需求列表
  dataJobSave: getFullUrl('bi', '/dataJob/edit'), // 添加编辑模板
  dataJobAddSubtasks: getFullUrl('bi', '/dataJob/subtasks'), // 新增子任务
  dataJobInfo: getFullUrl('bi', '/dataJob/info'), // 需求详情
  dataJobClose: getFullUrl('bi', '/dataJob/close'), // 关闭
  dataJobAccurate: getFullUrl('bi', '/dataJob/accurate'), // 需求准确无误
  dataJobConfim: getFullUrl('bi', '/dataJob/confirm'), // 需求确认
  dataJobDownload: getFullUrl('bi', '/dataJob/dataJobFile/download'), // 需求下载
  dataJobHistoryDownload: getFullUrl('bi', '/dataJob/dataJobFile/jobFileInfo'), // 记录下载
  dataJobUploadData: getFullUrl('bi', '/dataJob/dataJobFile/upload'), // 上传数据
  dataJobOperate: getFullUrl('bi', '/dataJob/operate'), // 数据执行人
  dataJobProblems: getFullUrl('bi', '/dataJob/problem'), // 数据需求问题
  dataJobReview: getFullUrl('bi', '/dataJob/review'), // 数据审核人
  dataJobUpdatePriority: getFullUrl('bi', '/dataJob/updatePriority'), // 优先级修改
  dataJobGetSort: getFullUrl('bi', '/dataJob/getSort'), // 顺序
  dataJobGetAdminList: getFullUrl('bi', '/dataJob/getAdminDownload'), // 后台数据需求下载列表
  dataJobAdminUpdateIndicate: getFullUrl('bi', '/dataJob/editIndate'), // 后台数据需求有效期修改

  // 官方报表数据驾驶舱
  settingReportPublicPriority: getFullUrl('bi', '/publicReport/priority'), // 公开报表优先级修改
  settingReportPublicQuery: getFullUrl('bi', '/publicReport/query'), // 公开报表查询
  settingReportPublicQueryData: getFullUrl('bi', '/publicReport/queryData'), // 公开报表数据获取
  settingReportPublicSave: getFullUrl('bi', '/publicReport/edit'), // 添加公开报表
  settingReportPublicDelete: getFullUrl('bi', '/publicReport/delete'), // 删除公开报表
  settingReportPublicDetail: getFullUrl('bi', '/publicReport/info'), // 公开报表详情
  shareReportPublic: getFullUrl('bi', '/publicReport/shared'), // 公开报表共享
  getUsersByReportId: getFullUrl('bi', '/publicReport/userPermission'), // 根据报表获取到共享用户
  getReportList: getFullUrl('bi', '/publicReport/permission'), // 获取所有报表

  // 定时邮件
  mailListgets: getFullUrl('bi', '/regularMail/gets'), // 定时邮件列表
  mailListEdit: getFullUrl('bi', '/regularMail/edit'), // 定时邮件列表
  mailListinfo: getFullUrl('bi', '/regularMail/info'), // 定时邮件详情

  // 上传下载文件
  uploadFileUrl: 'https://bifile.rosepie.com/front/oss/encrypt/upload',
  downloadFileUrl: 'https://bifile.rosepie.com/front/oss/decrypt/download',
};
