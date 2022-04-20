/**
 *  数据采集
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Table, Button, notification, Row, Col, Form, Input } from 'antd';
import { formatTime } from '@/utils/timeFormat';

const FormItem = Form.Item;
@connect(({ apiManage, loading }) => ({
  list: apiManage.list,
  listLoading: loading.effects['apiManage/fetchList'],
  paramsTransaction: apiManage.paramsTransaction,
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
      type: 'apiManage/fetchList',
    });
  }

  switch = (checked, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'apiManage/switch',
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
            <FormItem>{getFieldDecorator('reportNo')(<Input placeholder="编号" />)}</FormItem>
            <FormItem>{getFieldDecorator('status')(<Input placeholder="接口调用情况" />)}</FormItem>
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
        type: 'apiManage/fetchList',
        payload: fieldsValue,
      });
      dispatch({
        type: 'apiManage/saveParam',
        payload: fieldsValue,
      });
    });
  };

  // 重置
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'apiManage/fetchList',
    });
    dispatch({
      type: 'apiManage/saveParam',
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
            router.push('/back/apiManage/detail');
          }}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          创建API接口
        </Button>
        <Table
          loading={listLoading}
          dataSource={list.records.map(sourceData => ({
            ...sourceData,
            key: sourceData.id,
          }))}
          columns={[
            { title: 'ID', dataIndex: 'id' },
            { title: '编号', dataIndex: 'reportNo' },
            {
              title: '创建时间',
              dataIndex: 'gmtCreated',
              render: text => <div>{text ? formatTime(text) : ''}</div>,
            },
            {
              title: '说明',
              dataIndex: 'description',
            },
            {
              title: '接口调用情况',
              dataIndex: 'status',
            },
            {
              title: '操作',
              render: (_, record) => (
                <span>
                  <a
                    onClick={() => {
                      router.push(`/back/apiManage/detail?id=${record.id}`);
                    }}
                  >
                    编辑
                  </a>
                  {/* <Divider type="vertical" />
                  <a onClick={() => {}}>通知</a> */}
                </span>
              ),
            },
          ]}
          pagination={{
            onChange: (pageNo, pageSize) => {
              dispatch({
                type: 'apiManage/fetchList',
                payload: {
                  pageNo,
                  pageSize,
                  ...paramsTransaction.payload,
                },
              });
            },
            onShowSizeChange: (pageNo, pageSize) => {
              dispatch({
                type: 'apiManage/fetchList',
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
