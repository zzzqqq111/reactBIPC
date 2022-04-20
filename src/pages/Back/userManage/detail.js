/* eslint-disable no-nested-ternary */
/**
 *  用户管理
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  // Table,
  Cascader,
  TreeSelect,
  notification,
  DatePicker,
  // Checkbox,
  // Dropdown,
  // Icon,
  // List,
} from 'antd';
import moment from 'moment';
import styles from '../_layout.less';
import translateDistrict from '../postManage/translateDistrict';
import initLastSelectDistrict from '../postManage/initLastSelectDistrict';
import Indicators from './indicators';
import { formatTime } from '@/utils/timeFormat';
import Permiss from './reportPermiss';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { Option } = Select;

//  获取部门列表
const departlist = arr => {
  const data = [];
  const newArr = [];
  arr.map(item => {
    if (data.indexOf(item.name) === -1) {
      data.push(item.name);
      newArr.push({
        key: item.id,
        value: item.id,
        label: item.name,
      });
    }
    return item;
  });
  return newArr;
};

// 地区格式修改
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
@connect(({ loading, userManage }) => ({
  detail: userManage.detail,
  dataInfo: userManage.dataInfo,
  postlists: userManage.postlists,
  indicatorlist: userManage.indicatorlist,
  indicatorTypeList: userManage.indicatorTypeList,
  listLoading: loading.effects['userManage/fetchList'],
  reportList: userManage.reportList,
  indicatorsList: userManage.indicatorsList,
  reportIndicatorsList: userManage.reportIndicatorsList,
  indicatorsReportList: userManage.indicatorsReportList,
}))
@Form.create()
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      // systemPermission: [],
      postDeparent: [],
      // dropwonIsShow: { id: '', show: false },
      // indicators: [],
      // indiShow: { id: '', show: false },
      // indicatorsReportList: [],
    };
  }

  componentDidMount() {
    const {
      dispatch,
      location: { query },
    } = this.props;
    dispatch({
      type: 'userManage/DataDetail',
    }).then(res => {
      const lists = res.initData.departmentList;
      dispatch({
        type: 'userManage/postDataList',
        payload: {
          pageSize: 1000,
        },
      }).then(postlist => {
        // 部门列表
        const newData = [];
        departlist(lists).map(item => {
          const arr = [];
          postlist.map(obj => {
            if (item.label === obj.departmentName) {
              return arr.push({ key: obj.id, label: obj.postName, value: obj.id });
            }
            return obj;
          });
          newData.push({ ...item, children: arr });
          this.setState({
            postDeparent: newData,
          });
          return item;
        });
      });
    });
    if (query.id) {
      dispatch({
        type: 'userManage/fetchDetail',
        payload: { userId: query.id },
      });
      // dispatch({
      //   type: 'userManage/getReportById',
      //   payload: { userId: query.id },
      // });
      // dispatch({
      //   type: 'userManage/getIndicatorsById',
      //   payload: { userId: query.id },
      // });
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // 获取指标
  showIndicator = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/fetchIndicatorTypeList',
    });
    dispatch({
      type: 'userManage/fetchIndicatorList',
    });
    setTimeout(() => {
      this.showModal();
    }, 300);
  };

  handleOk = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/changeInditors',
      payload: values,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
      });
    }, 100);
  };

  handleSubmit = e => {
    const {
      form,
      dispatch,
      location: { query },
      dataInfo = {},
    } = this.props;
    const { instanceData = {} } = dataInfo;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      // 新增、编辑都在这里处理 编辑多传一个id

      if (!err) {
        const { initData = {} } = dataInfo;
        if (query.id) {
          dispatch({
            type: 'userManage/update',
            payload: {
              ...values,
              startTime:
                values.effectiveTime && values.effectiveTime.length !== 0
                  ? values.effectiveTime[0].format('YYYY-MM-DD HH:mm:ss')
                  : [],
              endTime:
                values.effectiveTime && values.effectiveTime.length !== 0
                  ? values.effectiveTime[1].format('YYYY-MM-DD HH:mm:ss')
                  : [],
              market: JSON.stringify(values.market),
              brand: JSON.stringify(values.brand),
              systemIds: JSON.stringify(instanceData.systemPermissionIds),
              indicatorsIds: JSON.stringify(instanceData.indicators),
              userId: query.id,
              postId: values.postId[1],
              effectiveTime: '',
              area: !values.district
                ? []
                : JSON.stringify(translateDistrict(values.district, initData.districtList)),
              district: [],
              allowDownload: values.allowDownload,
            },
            callback: () => {
              notification.success({
                message: '编辑成功',
              });
              router.push('/back/userManage');
            },
          });
        } else {
          dispatch({
            type: 'userManage/save',
            payload: Object.assign(
              {},
              {
                ...values,
                market: JSON.stringify(values.market),
                brand: JSON.stringify(values.brand),
                systemIds: JSON.stringify(instanceData.systemPermissionIds),
                indicatorsIds: JSON.stringify(instanceData.indicators),
                startTime:
                  values.effectiveTime && values.effectiveTime.length !== 0
                    ? values.effectiveTime[0].format('YYYY-MM-DD HH:mm:ss')
                    : '',
                endTime:
                  values.effectiveTime && values.effectiveTime !== 0
                    ? values.effectiveTime[1].format('YYYY-MM-DD HH:mm:ss')
                    : '',
                postId: values.postId[1],
                effectiveTime: '',
                area: !values.district
                  ? []
                  : JSON.stringify(translateDistrict(values.district, initData.districtList)),
                district: [],
                allowDownload: values.allowDownload,
              }
            ),
            callback: () => {
              notification.success({
                message: '保存成功',
              });
              router.push('/back/userManage');
            },
          });
        }
      }
    });
  };

  permissGetContent = () => {
    const { listLoading, dataInfo } = this.props;
    const { initData = {} } = dataInfo;
    // const { systemPermission } = this.state;
    const data = [];
    if (initData.systemPermissionList) {
      initData.systemPermissionList.map(item => {
        data.push({ ...item, key: item.id });
        return item;
      });
    }
    return <Permiss loading={listLoading} data={data} showIndicator={this.showIndicator} />;
  };

  // showDropdown = id => {
  //   const { dropwonIsShow } = this.state;
  //   const {
  //     dispatch,
  //     location: { query },
  //     reportList = [],
  //     // userIndicators,
  //   } = this.props;
  //   this.setState({
  //     dropwonIsShow: { id, show: !dropwonIsShow.show },
  //   });
  //   if (!dropwonIsShow.show) {
  //     dispatch({
  //       type: 'userManage/reportIndicatorsList',
  //       payload: [],
  //     });
  //     dispatch({
  //       type: 'userManage/getIndicatorsByReportId',
  //       payload: { userId: query.id, reportId: id },
  //     }).then(res => {
  //       this.setState({
  //         indicators: res.userIndicators ? res.userIndicators : [],
  //       });
  //     });
  //   } else {
  //     const newItem = reportList.filter(item => Number(item.id) === Number(id));
  //     const { indicators } = this.state;
  //     if (newItem[0].permission === '无权限') {
  //       notification.error({
  //         message: '请先选择操作权限',
  //       });
  //       return;
  //     }
  //     dispatch({
  //       type: 'userManage/saveIndicatorsById',
  //       payload: {
  //         userId: query.id,
  //         reportId: id,
  //         operation: newItem[0].permission,
  //         indicators: indicators.length !== 0 ? JSON.stringify(indicators) : '[]',
  //       },
  //     }).then(() => {
  //       dispatch({
  //         type: 'userManage/getIndicatorsById',
  //         payload: { userId: query.id },
  //       });
  //     });
  //   }
  // };

  // showIndicaDropdown = id => {
  //   const { indiShow } = this.state;
  //   const {
  //     dispatch,
  //     location: { query },
  //   } = this.props;
  //   this.setState({
  //     indiShow: { id, show: !indiShow.show },
  //   });
  //   if (!indiShow.show) {
  //     dispatch({
  //       type: 'userManage/reportGetIndicator',
  //       payload: { userId: query.id, indicatorsId: id },
  //     }).then(res => {
  //       this.setState({
  //         indicatorsReportList: res,
  //       });
  //     });
  //   }
  // };

  // permissChange = (value, props) => {
  //   const {
  //     reportList = [],
  //     dispatch,
  //     location: { query },
  //   } = this.props;
  //   const { indicators } = this.state;
  //   const reportDetail = reportList.filter(item => Number(item.id) === Number(props.props.id));
  //   reportDetail[0].permission = value;
  //   dispatch({
  //     type: 'userManage/reportList',
  //     payload: reportList,
  //   });
  //   // 无权限时改为删除此用户在此报表中的权限
  //   if (value === '无权限') {
  //     dispatch({
  //       type: 'userManage/deleteUserReport',
  //       payload: { userId: query.id, reportId: reportDetail[0].id },
  //     });
  //   } else {
  //     dispatch({
  //       type: 'shareInfo/getIndicatorsByReportId',
  //       payload: { userId: query.id, reportId: reportDetail[0].id },
  //     }).then(res => {
  //       if (res.userIndicators.length === 0) {
  //         notification.error({ message: '请选择指标' });
  //         return;
  //       }
  //       dispatch({
  //         type: 'userManage/saveIndicatorsById',
  //         payload: {
  //           userId: query.id,
  //           reportId: reportDetail[0].id,
  //           operation: value,
  //           indicators: indicators.length !== 0 ? JSON.stringify(indicators) : '[]',
  //         },
  //       });
  //     });
  //   }
  // };

  // indicatorsChange = value => {
  //   this.setState({
  //     indicators: value,
  //   });
  // };

  // 岗位改变时
  postChange = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/postCollaboration',
      payload: { id: value[1] },
    });
  };

  // permissReport = () => {
  //   const { reportList = [], reportIndicatorsList = {} } = this.props;
  //   const { reportIndicators = [] } = reportIndicatorsList;
  //   const { dropwonIsShow, indicators } = this.state;
  //   return (
  //     <Table
  //       dataSource={reportList}
  //       columns={[
  //         {
  //           title: '报表名称',
  //           dataIndex: 'reportName',
  //         },
  //         {
  //           title: '一级目录',
  //           dataIndex: 'directory1',
  //         },
  //         {
  //           title: '二级目录',
  //           dataIndex: 'directory2',
  //         },
  //         {
  //           title: '三级目录',
  //           dataIndex: 'directory3',
  //         },
  //         {
  //           title: '报表修改时间',
  //           dataIndex: 'updateTime',
  //         },
  //         {
  //           title: '操作',
  //           dataIndex: 'permission',
  //           render: (text, record) => (
  //             <div>
  //               <Row ket={record.id}>
  //                 <Col span={10}>
  //                   <Select defaultValue={text} onChange={this.permissChange}>
  //                     <option value="无权限" id={record.id}>
  //                       无权限
  //                     </option>
  //                     <option value={0} id={record.id}>
  //                       查看
  //                     </option>
  //                     <option value={1} id={record.id}>
  //                       下载
  //                     </option>
  //                   </Select>
  //                 </Col>
  //                 <Col span={12} style={{ marginLeft: '10px' }}>
  //                   <Dropdown
  //                     overlay={
  //                       <Checkbox.Group value={indicators} onChange={this.indicatorsChange}>
  //                         <Row>
  //                           {reportIndicators.map(item => (
  //                             <Col span={24} key={item.id}>
  //                               <Checkbox value={item.id}>{item.name}</Checkbox>
  //                             </Col>
  //                           ))}
  //                         </Row>
  //                       </Checkbox.Group>
  //                     }
  //                     trigger="click"
  //                     overlayStyle={{
  //                       backgroundColor: '#fff',
  //                       border: '1px solid #eaeaea',
  //                       padding: '10px',
  //                     }}
  //                     onClick={this.showDropdown.bind(this, record.id)}
  //                     visible={
  //                       !!(Number(dropwonIsShow.id) === Number(record.id) && dropwonIsShow.show)
  //                     }
  //                   >
  //                     <Button>
  //                       请选择指标 <Icon type="down" />
  //                     </Button>
  //                   </Dropdown>
  //                 </Col>
  //               </Row>
  //             </div>
  //           ),
  //         },
  //       ]}
  //       pagination={false}
  //       rowClassName={() => styles.tableTd}
  //     />
  //   );
  // };

  // 删除指标权限里的报表
  // deleteIndicator = (reportId, indicatorId) => {
  //   const {
  //     dispatch,
  //     location: { query },
  //     indicatorsReportList = [],
  //   } = this.props;
  //   dispatch({
  //     type: 'userManage/deleteReport',
  //     payload: { userId: query.id, reportId, indicatorsId: indicatorId },
  //   });
  //   indicatorsReportList.forEach((item, index) => {
  //     if (item.id === reportId) {
  //       indicatorsReportList.splice(index, 1);
  //     }
  //   });
  //   if (indicatorsReportList.length === 0) {
  //     dispatch({
  //       type: 'userManage/getIndicatorsById',
  //       payload: { userId: query.id },
  //     });
  //   }
  //   this.setState({
  //     indicatorsReportList,
  //   });
  // };

  // permissIndicator = () => {
  //   const { indicatorsList = [] } = this.props;
  //   const { indiShow, indicatorsReportList } = this.state;
  //   if (indicatorsList.length === 0) {
  //     return null;
  //   }
  //   return (
  //     <Table
  //       dataSource={indicatorsList}
  //       rowKey={record => record.indicatorsId}
  //       columns={[
  //         {
  //           title: '指标名称',
  //           dataIndex: 'name',
  //         },
  //         {
  //           title: '指标渠道',
  //           dataIndex: 'channel',
  //         },
  //         {
  //           title: '指标颗粒',
  //           dataIndex: 'dataDimension',
  //         },
  //         {
  //           title: '指标维度',
  //           dataIndex: 'dataParticles',
  //         },
  //         {
  //           title: '业务类型',
  //           dataIndex: 'type',
  //         },
  //         {
  //           title: '操作',
  //           render: (_, record) => (
  //             <Dropdown
  //               overlay={
  //                 <List
  //                   header={
  //                     <div
  //                       style={{
  //                         padding: '10px',
  //                         borderBottom: '1px solid #eaeaea',
  //                         background: '#f9f9f9',
  //                       }}
  //                     >
  //                       所有报表
  //                     </div>
  //                   }
  //                   dataSource={indicatorsReportList}
  //                   renderItem={item => (
  //                     <List.Item
  //                       actions={[
  //                         <a
  //                           onClick={() => {
  //                             this.deleteIndicator(item.id, record.indicatorsId);
  //                           }}
  //                         >
  //                           <Icon type="close" />
  //                         </a>,
  //                       ]}
  //                     >
  //                       <span>{item.name}</span>
  //                     </List.Item>
  //                   )}
  //                 />
  //               }
  //               trigger="click"
  //               overlayStyle={{
  //                 backgroundColor: '#fff',
  //                 border: '1px solid #eaeaea',
  //               }}
  //               key={record.indicatorsId}
  //               onClick={this.showIndicaDropdown.bind(this, record.indicatorsId)}
  //               visible={!!(Number(indiShow.id) === Number(record.indicatorsId) && indiShow.show)}
  //             >
  //               <Button>
  //                 <Icon type="down" />
  //               </Button>
  //             </Dropdown>
  //           ),
  //         },
  //       ]}
  //       pagination={false}
  //       rowClassName={() => styles.tableTd}
  //     />
  //   );
  // };

  render() {
    const {
      form: { getFieldDecorator },
      dataInfo = {},
      // location: { query },
    } = this.props;
    const { postDeparent, visible } = this.state;
    if (!dataInfo.initData) {
      return null;
    }
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 6,
        },
      },
    };

    const { instanceData = {} } = dataInfo;
    return (
      <div>
        <Form
          {...formItemLayout}
          style={{ maxWidth: '800px', margin: 0 }}
          onSubmit={this.handleSubmit}
        >
          <div>
            <div className={styles.userMessage}>【基本信息】</div>
            <Row>
              <Col span={12}>
                <Form.Item label="姓名">
                  {getFieldDecorator('username', {
                    initialValue: instanceData.user ? instanceData.user[0].userName : '',
                    rules: [
                      {
                        required: true,
                        message: '请输入姓名',
                      },
                    ],
                  })(<Input placeholder="请输入姓名" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="角色">
                  {getFieldDecorator('isAdmin', {
                    initialValue: instanceData.user ? instanceData.user[0].isAdmin : false,
                    rules: [
                      {
                        required: true,
                        message: '请输入姓名',
                      },
                    ],
                  })(
                    <Select>
                      <Option value>管理员</Option>
                      <Option value={false}>用户</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="部门岗位">
                  {getFieldDecorator('postId', {
                    initialValue: instanceData.user
                      ? [instanceData.user[0].departmentId, instanceData.user[0].postId]
                      : '',
                  })(
                    <Cascader
                      placeholder="请选择部门"
                      options={postDeparent || []}
                      onChange={this.postChange}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="手机号码">
                  {getFieldDecorator('phone', {
                    initialValue: instanceData.user ? instanceData.user[0].phone : '',
                    rules: [
                      {
                        required: true,
                        message: '请输入手机号',
                      },
                    ],
                  })(<Input placeholder="请输入手机号" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="设备ID">
                  {getFieldDecorator('deviceNo', {
                    initialValue: instanceData.user ? instanceData.user[0].device : '',
                    rules: [
                      {
                        required: true,
                        message: '请输入设备ID!',
                      },
                    ],
                  })(<Input placeholder="请输入设备ID" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="时段">
                  <Input placeholder="请输入" value="长期有效" disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="备用设备ID">
                  {getFieldDecorator('standbyDevice', {
                    initialValue: instanceData.user ? instanceData.user[0].standbydevice : '',
                  })(<Input placeholder="请输入备用设备ID" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="时段">
                  {getFieldDecorator('effectiveTime', {
                    initialValue: instanceData.user
                      ? instanceData.user[0].startTime && instanceData.user[0].endTime
                        ? [
                            moment(`${formatTime(instanceData.user[0].startTime)}`, dateFormat),
                            moment(`${formatTime(instanceData.user[0].startTime)}`, dateFormat),
                          ]
                        : ''
                      : '',
                  })(<RangePicker format={dateFormat} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="是否允许下载">
                  {getFieldDecorator('allowDownload', {
                    initialValue: instanceData.user ? instanceData.user[0].allowDownload : false,
                  })(
                    <Select placeholder="请选择">
                      <Option value>允许</Option>
                      <Option value={false}>不允许</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div>
            <div className={styles.userMessage}>【数据权限】</div>
            <Row>
              <Col span={12}>
                <Form.Item label="时段">
                  {getFieldDecorator('time', {
                    initialValue: instanceData.payTime ? instanceData.payTime : '',
                  })(
                    <Select placeholder="请选择时段">
                      <Option value="">全部</Option>
                      <Option value="近3个月">近3个月</Option>
                      <Option value="近6个月">近6个月</Option>
                      <Option value="近1年">近1年</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="市场">
                  {getFieldDecorator('market', {
                    initialValue: instanceData.market ? JSON.parse(instanceData.market) : [],
                  })(
                    <Select
                      mode="multiple"
                      placeholder="请选择市场"
                      style={{ width: '100%' }}
                      allowClear
                      onChange={this.marketChange}
                    >
                      {dataInfo.initData.marketList.map(item => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="区域">
                  {getFieldDecorator('district', {
                    initialValue: instanceData.area
                      ? initLastSelectDistrict(instanceData.area, dataInfo.initData.districtList)
                      : [],
                  })(
                    <TreeSelect
                      showSearch
                      style={{ width: 300 }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder="请选择区域"
                      allowClear
                      multiple
                      treeCheckable
                      labelInValue
                      suffixIcon=""
                      value={['东北']}
                      treeData={abcFun(dataInfo.initData.districtList)}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="品牌">
                  {getFieldDecorator('brand', {
                    initialValue: instanceData.brand ? JSON.parse(instanceData.brand) : [],
                  })(
                    <Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      placeholder="请选择品牌"
                      allowClear
                      onChange={this.optionChange}
                    >
                      {dataInfo.initData.brandList.map(item => (
                        <Option key={item.id} value={item.id}>
                          {item.shortName}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div>
            <div className={styles.userMessage}>【PC权限报表】</div>
            {this.permissGetContent()}
          </div>
          <Row>
            <Form.Item {...tailFormItemLayout} style={{ textAlign: 'right', marginTop: '10px' }}>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          </Row>
        </Form>
        <Indicators
          visible={visible}
          handleCancel={this.handleCancel}
          {...this.props}
          handleOk={this.handleOk}
        />
        {/* {query.id ? (
          <div style={{ maxWidth: '800px', margin: 0 }}>
            <div>
              <div className={styles.userMessage}>【报表权限】</div>
              {this.permissReport()}
            </div>
            <div>
              <div className={styles.userMessage}>【指标权限】</div>
              {this.permissIndicator()}
            </div>
          </div>
        ) : null} */}
      </div>
    );
  }
}

export default Detail;
