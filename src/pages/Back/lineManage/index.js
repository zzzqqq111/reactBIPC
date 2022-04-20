/**
 *  数据采集
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Table, Switch, Button, notification, Row, Col, Form, Input } from 'antd';

const FormItem = Form.Item;
@connect(({ lineManage, loading }) => ({
  list: lineManage.list,
  listLoading: loading.effects['lineManage/fetchList'],
  paramsTransaction: lineManage.paramsTransaction,
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
      type: 'lineManage/fetchList',
    });
  }

  switch = (checked, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lineManage/switch',
      payload: {
        id,
        isEnable: Number(checked),
      },
      callback: () => {
        notification.success({
          message: checked ? '已启用' : '已关闭',
        });
      },
    });
  };

  renderSimpleForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" style={{ marginBottom: '10px' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={20} sm={24}>
            <FormItem>{getFieldDecorator('id')(<Input placeholder="线性查询编号" />)}</FormItem>
            <FormItem>{getFieldDecorator('name')(<Input placeholder="线性标签" />)}</FormItem>
            <FormItem>{getFieldDecorator('headerIds')(<Input placeholder="领导人id" />)}</FormItem>
          </Col>
          <Col md={4} sm={24} style={{ paddingLeft: 0 }}>
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
        type: 'lineManage/fetchList',
        payload: fieldsValue,
      });
      dispatch({
        type: 'lineManage/saveParam',
        payload: fieldsValue,
      });
    });
  };

  // 重置
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'lineManage/fetchList',
    });
    dispatch({
      type: 'lineManage/saveParam',
      payload: {},
    });
  };

  render() {
    const { list, listLoading, dispatch, paramsTransaction = {} } = this.props;

    return (
      <div>
        {this.renderSimpleForm()}
        <Button
          onClick={() => {
            router.push('/back/lineManage/detail');
          }}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          新增线性查询
        </Button>
        <Table
          loading={listLoading}
          dataSource={list.records.map(sourceData => ({
            ...sourceData,
            key: sourceData.id,
          }))}
          columns={[
            { title: '线性查询编号', dataIndex: 'id' },
            {
              title: '线性标签',
              dataIndex: 'name',
            },
            {
              title: '领导人会员id',
              dataIndex: 'headerIds',
              render: text => (
                <div
                  style={{ wordWrap: 'break-word', wordBreak: 'break-all', whiteSpace: 'initial' }}
                >
                  {text}
                </div>
              ),
            },

            {
              title: '操作',
              render: (_, record) => (
                <span>
                  <a
                    onClick={() => {
                      router.push(`/back/lineManage/detail?id=${record.id}`);
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
                type: 'lineManage/fetchList',
                payload: {
                  pageNo,
                  pageSize,
                  ...paramsTransaction.payload,
                },
              });
            },
            onShowSizeChange: (pageNo, pageSize) => {
              dispatch({
                type: 'lineManage/fetchList',
                payload: {
                  pageNo,
                  pageSize,
                  ...paramsTransaction.payload,
                },
              });
            },
            current: list.current,
            total: list.total,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '500', '1000', '5000'],
          }}
        />
      </div>
    );
  }
}

export default Index;
