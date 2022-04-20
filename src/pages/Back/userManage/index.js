/**
 *  用户管理
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Table, Switch, Button, Row, Col, Form, Input } from 'antd';
import { formatTime } from '@/utils/timeFormat';

const FormItem = Form.Item;

@connect(({ userManage, loading }) => ({
  list: userManage.list,
  listLoading: loading.effects['userManage/fetchList'],
  indicatorTypeList: userManage.indicatorTypeList,
  paramsTransaction: userManage.paramsTransaction,
}))
@Form.create()
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/fetchList',
    });
  }

  // 是否启用
  switch = (checked, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/switch',
      payload: {
        userId: id,
        isEnable: Number(checked),
      },
    });
  };

  // 搜索开始
  renderSimpleForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" style={{ marginBottom: '10px' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={20} sm={24}>
            <FormItem>{getFieldDecorator('userName')(<Input placeholder="姓名" />)}</FormItem>
            <FormItem>{getFieldDecorator('departmentName')(<Input placeholder="部门" />)}</FormItem>
            <FormItem>{getFieldDecorator('postName')(<Input placeholder="岗位" />)}</FormItem>
          </Col>
          <Col md={4} sm={24} style={{ paddingLeft: '0' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'userManage/fetchList',
        payload: fieldsValue,
      });
      dispatch({
        type: 'userManage/saveParam',
        payload: fieldsValue,
      });
    });
  };

  //   // 重置
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'userManage/fetchList',
    });
    dispatch({
      type: 'postManage/saveParam',
      payload: {},
    });
  };

  render() {
    const { list = [], listLoading = false, dispatch, paramsTransaction = {} } = this.props;
    return (
      <div>
        {this.renderSimpleForm()}
        <Button
          onClick={() => {
            dispatch({
              type: 'userManage/resetDetail',
            });
            router.push('/back/userManage/detail');
          }}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          新增用户
        </Button>
        <Table
          loading={listLoading}
          dataSource={list.records.map(sourceData => ({
            ...sourceData,
            key: sourceData.id,
          }))}
          columns={[
            { title: '姓名', dataIndex: 'userName' },
            { title: '手机号', dataIndex: 'phone' },
            { title: '部门', dataIndex: 'departmentName' },
            { title: '岗位', dataIndex: 'postName' },
            { title: '有效设备ID', dataIndex: 'device' },
            {
              title: '开通时间',
              dataIndex: 'createdTime',
              render: text => (
                <div
                  style={{ wordWrap: 'break-word', wordBreak: 'break-all', whiteSpace: 'initial' }}
                >
                  {formatTime(text)}
                </div>
              ),
            },
            {
              title: '操作',
              render: (_, record) => (
                <span>
                  <a
                    onClick={() => {
                      router.push(`/back/userManage/detail?id=${record.id}`);
                    }}
                  >
                    编辑
                  </a>
                </span>
              ),
            },
            {
              title: '是否禁用',
              dataIndex: 'disable',
              render: (text = true, record) => (
                <Switch
                  checkedChildren="已禁用"
                  unCheckedChildren="未禁用"
                  defaultChecked={text}
                  onChange={checked => this.switch(checked, record.id)}
                />
              ),
            },
          ]}
          pagination={{
            onChange: (pageNo, pageSize) => {
              dispatch({
                type: 'userManage/fetchList',
                payload: {
                  pageNo,
                  pageSize,
                  ...paramsTransaction.payload,
                },
              });
            },
            onShowSizeChange: (pageNo, pageSize) => {
              dispatch({
                type: 'userManage/fetchList',
                payload: {
                  pageNo,
                  pageSize,
                  ...paramsTransaction.payload,
                },
              });
            },
            total: list.total,
            current: list.current,
            showSizeChanger: true,
            pageSizeOptions: ['10', '500', '1000', '5000'],
            showQuickJumper: true,
          }}
        />
      </div>
    );
  }
}

export default Index;
