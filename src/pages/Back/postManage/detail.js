/* eslint-disable no-nested-ternary */
/**
 *  用户管理
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, Input, Button, Select, Row, Col, Table, TreeSelect, notification } from 'antd';
import styles from '../_layout.less';
import translateDistrict from './translateDistrict';
import initLastSelectDistrict from './initLastSelectDistrict';
import Indicators from './indicators';

const { Option } = Select;

// 地区格式修改
function abcFun(arr, prefix = '') {
  const options = [];
  arr.forEach(item => {
    // 级联选择器
    if (typeof item === 'string') {
      options.push({
        value: `${prefix}${item}`, // key
        label: item, // 文本显示
        title: item, // 文本显示
      });
    } else {
      options.push({
        value: Object.keys(item)[0], // key
        label: Object.keys(item)[0], // 文本显示
        title: Object.keys(item)[0], // 文本显示
        children: abcFun(item[Object.keys(item)[0]], `${prefix}${Object.keys(item)[0]}-`), // 子级
      });
    }
  });
  return options;
}
@connect(({ loading, postManage }) => ({
  detail: postManage.detail,
  indicatorlist: postManage.indicatorlist,
  indicatorTypeList: postManage.indicatorTypeList,
  listLoading: loading.effects['postManage/fetchList'],
}))
@Form.create()
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      systemPermission: [],
    };
  }

  componentDidMount() {
    const {
      dispatch,
      location: { query },
    } = this.props;
    dispatch({
      type: 'postManage/fetchDetail',
      payload: { id: query.id ? query.id : '' },
    }).then(res => {
      if (res.instanceData) {
        this.setState({
          systemPermission: res.instanceData.systemPermissionIds
            ? res.instanceData.systemPermissionIds
            : [],
        });
      }
    });
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

  handleSubmit = e => {
    const {
      form,
      dispatch,
      location: { query },
      detail = {},
    } = this.props;
    const { instanceData = {} } = detail;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      // 新增、编辑都在这里处理 编辑多传一个id
      if (!err) {
        const { initData = {} } = detail;
        dispatch({
          type: 'postManage/update',
          payload: {
            ...values,
            market: JSON.stringify(values.market),
            brand: JSON.stringify(values.brand),
            systemPermissionIds: JSON.stringify(instanceData.systemPermissionIds),
            indicatorIds: JSON.stringify(instanceData.indicatorIds),
            id: query.id ? query.id : '',
            area: !values.district
              ? []
              : JSON.stringify(translateDistrict(values.district, initData.districtList)),
            district: [],
          },
          callback: () => {
            notification.success({
              message: '保存成功',
            });
            router.push('/back/postManage');
          },
        });
      }
    });
  };

  // 获取指标
  showIndicator = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'postManage/fetchIndicatorTypeList',
    });
    dispatch({
      type: 'postManage/fetchIndicatorList',
    });
    setTimeout(() => {
      this.showModal();
    }, 500);
  };

  handleOk = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'postManage/changeInditors',
      payload: values,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
      });
    }, 100);
  };

  permissGetContent = () => {
    const { listLoading, detail, dispatch } = this.props;
    const { initData = {}, instanceData = {} } = detail;
    const { systemPermission } = this.state;
    const data = [];
    if (initData.systemPermissionList) {
      initData.systemPermissionList.map(item => {
        data.push({ ...item, key: item.id });
        return item;
      });
    }

    const rowSelection1 = {
      systemPermission,
      onChange: selectedRowKeys => {
        dispatch({
          type: 'postManage/changeDataPermiss',
          payload: selectedRowKeys,
        });
        this.setState({
          systemPermission: selectedRowKeys,
        });
      },
      getCheckboxProps: record => {
        return {
          checked:
            instanceData.systemPermissionIds && instanceData.systemPermissionIds.length !== 0
              ? instanceData.systemPermissionIds.indexOf(record.key) >= 0
              : '',
        };
      },
    };
    return (
      <Table
        rowSelection={rowSelection1}
        loading={listLoading}
        dataSource={data}
        columns={[
          {
            title: '功能',
            dataIndex: 'moduleName',
            render: (value, row, index) => {
              const obj = {
                children: value,
                props: {},
              };
              if (index === 0) {
                obj.props.rowSpan = 2;
              }
              if (index === 1) {
                obj.props.rowSpan = 0;
              }
              return obj;
            },
          },
          {
            title: '权限配置',
            dataIndex: 'name',
          },
          {
            title: '',
            render: () => (
              <span>
                <a
                  onClick={() => {
                    this.showIndicator();
                  }}
                >
                  指标管理
                </a>
              </span>
            ),
          },
        ]}
        pagination={false}
      />
    );
  };

  render() {
    const {
      form: { getFieldDecorator },
      detail = {},
    } = this.props;
    if (!detail.initData) {
      return null;
    }
    const { instanceData = {} } = detail;
    const { visible } = this.state;
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
    return (
      <div>
        <Form
          {...formItemLayout}
          style={{ maxWidth: '1000px', margin: 0 }}
          onSubmit={this.handleSubmit}
        >
          <div>
            <div className={styles.userMessage}>【基本信息】</div>
            <Row>
              <Col span={12}>
                <Form.Item label="部门">
                  {getFieldDecorator('departmentId', {
                    initialValue: instanceData.departmentId ? instanceData.departmentId : '',
                    rules: [
                      {
                        required: true,
                        message: '请选择部门',
                      },
                    ],
                  })(
                    <Select placeholder="请选择部门">
                      {detail.initData.departmentList.map(item => (
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
                <Form.Item label="岗位">
                  {getFieldDecorator('name', {
                    initialValue: instanceData.name ? instanceData.name : '',
                    rules: [
                      {
                        required: true,
                        message: '请输入岗位!',
                      },
                    ],
                  })(<Input placeholder="请输入岗位" />)}
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div>
            <div className={styles.userMessage}>【数据权限】</div>
            <Row>
              <Col span={12}>
                <Form.Item label="时段">
                  {getFieldDecorator('payTime', {
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
                      style={{ width: '100%' }}
                      placeholder="请选择市场"
                      allowClear
                      onChange={this.marketChange}
                    >
                      {detail.initData.marketList.map(item => (
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
                      ? initLastSelectDistrict(instanceData.area, detail.initData.districtList)
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
                      defaultValue={['东北']}
                      treeData={abcFun(detail.initData.districtList)}
                      // onChange={this.areaChange}
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
                      {detail.initData.brandList.map(item => (
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
            <Form.Item {...tailFormItemLayout} style={{ textAlign: 'right' }}>
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
      </div>
    );
  }
}

export default Detail;
