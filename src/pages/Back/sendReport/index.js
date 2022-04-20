/**
 *  定时发送消息
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Table, Button, Row, Col, Form, Input } from 'antd';
import { formatTime } from '@/utils/timeFormat';

@connect(({ sendReport, loading }) => ({
  list: sendReport.list,
  listLoading: loading.effects['sendReport/fetchList'],
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
      type: 'sendReport/fetchList',
    });
  }

  renderSimpleForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" style={{ marginBottom: '10px' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={20} sm={24}>
            <Form.Item>{getFieldDecorator('reportNo')(<Input placeholder="报表编号" />)}</Form.Item>
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
        type: 'sendReport/fetchList',
        payload: fieldsValue,
      });
    });
  };

  // 重置
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'sendReport/fetchList',
    });
  };

  render() {
    const { list, listLoading, dispatch } = this.props;
    return (
      <div>
        {this.renderSimpleForm()}
        <Button
          onClick={() => {
            router.push('/back/sendReport/detail');
          }}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          新建任务
        </Button>
        <Table
          loading={listLoading}
          dataSource={list}
          columns={[
            { title: '任务编号', dataIndex: 'id' },
            { title: '报表编号', dataIndex: 'name' },
            { title: '报表名称', dataIndex: 'scriptType' },
            { title: '发送频率', dataIndex: 'description' },
            {
              title: '发送时间',
              dataIndex: 'content',
              render: text => (
                <div
                  style={{ wordWrap: 'break-word', wordBreak: 'break-all', whiteSpace: 'initial' }}
                >
                  {formatTime(text)}
                </div>
              ),
            },
            {
              title: '结束时间',
              dataIndex: 'content',
              render: text => (
                <div
                  style={{ wordWrap: 'break-word', wordBreak: 'break-all', whiteSpace: 'initial' }}
                >
                  {formatTime(text)}
                </div>
              ),
            },
            {
              title: '收件人邮箱',
              render: text => <span>{text}</span>,
            },
            {
              title: '操作',
              render: (_, record) => (
                <span>
                  <a
                    onClick={() => {
                      router.push(`/back/sendReport/detail?id=${record.id}`);
                    }}
                  >
                    编辑
                  </a>
                </span>
              ),
            },
          ]}
          pagination={{
            onChange: (pageNo, pageSize) => {
              dispatch({
                type: 'sendReport/fetchList',
                payload: {
                  pageNo,
                  pageSize,
                },
              });
            },
            onShowSizeChange: (pageNo, pageSize) => {
              dispatch({
                type: 'sendReport/fetchList',
                payload: {
                  pageNo,
                  pageSize,
                },
              });
            },
            // total: list.total,
            // current: list.current,
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
