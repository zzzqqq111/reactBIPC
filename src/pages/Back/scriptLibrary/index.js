/**
 *  脚本库
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Table, Button, Row, Col, Form, Input } from 'antd';

const FormItem = Form.Item;
@connect(({ scriptLibrary, loading }) => ({
  list: scriptLibrary.list,
  listLoading: loading.effects['scriptLibrary/fetchList'],
}))
@Form.create()
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {
      dispatch,
      location: {
        query: { tableName },
      },
    } = this.props;
    dispatch({
      type: 'scriptLibrary/fetchList',
      payload: {
        tableName: tableName || '',
      },
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
            <FormItem>{getFieldDecorator('name')(<Input placeholder="脚本名称" />)}</FormItem>
            <FormItem>
              {getFieldDecorator('description')(
                <Input placeholder="脚本逻辑" style={{ width: '300px' }} />
              )}
            </FormItem>
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
        type: 'scriptLibrary/fetchList',
        payload: fieldsValue,
      });
    });
  };

  // 重置
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'scriptLibrary/fetchList',
    });
  };

  render() {
    const { list, listLoading, dispatch } = this.props;
    return (
      <div>
        {this.renderSimpleForm()}
        <Button
          onClick={() => {
            router.push('/back/scriptLibrary/detail');
          }}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          新增脚本
        </Button>
        <Table
          loading={listLoading}
          dataSource={list.records.map(sourceData => ({
            ...sourceData,
            key: sourceData.id,
          }))}
          columns={[
            { title: '脚本编号', dataIndex: 'id' },
            { title: '脚本名称', dataIndex: 'name' },
            { title: '脚本类型', dataIndex: 'scriptType' },
            { title: '脚本逻辑', dataIndex: 'description' },
            {
              title: '脚本内容',
              dataIndex: 'content',
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
                      router.push(`/back/scriptLibrary/detail?id=${record.id}`);
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
                type: 'scriptLibrary/fetchList',
                payload: {
                  pageNo,
                  pageSize,
                },
              });
            },
            onShowSizeChange: (pageNo, pageSize) => {
              dispatch({
                type: 'scriptLibrary/fetchList',
                payload: {
                  pageNo,
                  pageSize,
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
