/**
 *  用户管理
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Table, Switch, Button, Row, Col, Form, Input } from 'antd';

const FormItem = Form.Item;

@connect(({ postManage, loading }) => ({
  list: postManage.list,
  listLoading: loading.effects['postManage/fetchList'],
  indicatorTypeList: postManage.indicatorTypeList,
  paramsTransaction: postManage.paramsTransaction,
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
      type: 'postManage/fetchList',
    });
  }

  // 是否启用
  switch = (checked, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'postManage/switch',
      payload: {
        id,
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
        type: 'postManage/fetchList',
        payload: fieldsValue,
      });
      dispatch({
        type: 'postManage/saveParam',
        payload: fieldsValue,
      });
    });
  };

  // 重置
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'postManage/fetchList',
    });
    dispatch({
      type: 'postManage/saveParam',
      payload: {},
    });
  };
  // 结束

  render() {
    const { list = {}, listLoading = false, dispatch, paramsTransaction = {} } = this.props;
    return (
      <div>
        {this.renderSimpleForm()}
        <Button
          onClick={() => {
            dispatch({
              type: 'postManage/resetDetail',
            });
            router.push('/back/postManage/detail');
          }}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          新增岗位权限
        </Button>
        <Table
          loading={listLoading}
          dataSource={list.records.map(sourceData => ({
            ...sourceData,
            key: sourceData.id,
          }))}
          columns={[
            { title: '部门', dataIndex: 'departmentName' },
            { title: '岗位', dataIndex: 'postName' },
            {
              title: '操作',
              render: (_, record) => (
                <span>
                  <a
                    onClick={() => {
                      router.push(`/back/postManage/detail?id=${record.id}`);
                    }}
                  >
                    编辑
                  </a>
                </span>
              ),
            },
            {
              title: '是否启用',
              dataIndex: 'isEnable',
              render: (text = true, record) => (
                <Switch
                  checkedChildren="已启用"
                  unCheckedChildren="未启用"
                  defaultChecked={Boolean(text)}
                  onChange={checked => this.switch(checked, record.id)}
                />
              ),
            },
          ]}
          pagination={{
            onChange: (pageNo, pageSize) => {
              dispatch({
                type: 'postManage/fetchList',
                payload: {
                  pageNo,
                  pageSize,
                  ...paramsTransaction.payload,
                },
              });
            },
            onShowSizeChange: (pageNo, pageSize) => {
              dispatch({
                type: 'postManage/fetchList',
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
