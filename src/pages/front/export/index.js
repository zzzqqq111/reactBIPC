/**
 *  数据导入
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Row, Col, Form, Input, Icon } from 'antd';
import UploadCommon from '../../Back/components/uploadFile';

const FormItem = Form.Item;
@connect(({ downloadExport, loading }) => ({
  list: downloadExport.list,
  listLoading: loading.effects['downloadExport/fetchList'],
  paramsTransaction: downloadExport.paramsTransaction,
}))
@Form.create()
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch, paramsTransaction = {} } = this.props;
    dispatch({
      type: 'downloadExport/fetchList',
      payload: {
        ...paramsTransaction.payload,
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
          <Col md={16} sm={24}>
            <FormItem>{getFieldDecorator('name')(<Input placeholder="导入模板名称" />)}</FormItem>
          </Col>
          <Col md={8} sm={24} style={{ paddingLeft: 0, textAlign: 'right' }}>
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
        type: 'downloadExport/fetchList',
        payload: fieldsValue,
      });
      dispatch({
        type: 'downloadExport/saveParam',
        payload: fieldsValue,
      });
    });
  };

  // 重置
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'downloadExport/fetchList',
    });
    dispatch({
      type: 'downloadExport/saveParam',
      payload: {},
    });
  };

  render() {
    const { list, listLoading, dispatch, paramsTransaction = {} } = this.props;

    return (
      <div style={{ backgroundColor: '#fff', padding: '20px 24px 0' }}>
        {this.renderSimpleForm()}
        <Table
          loading={listLoading}
          dataSource={list.records.map(sourceData => ({
            ...sourceData,
            key: sourceData.id,
          }))}
          columns={[
            { title: '模板编号', dataIndex: 'id' },
            {
              title: '模板名称',
              dataIndex: 'name',
            },
            {
              title: '模板说明',
              dataIndex: 'description',
              render: text => (
                <div
                  style={{ wordWrap: 'break-word', wordBreak: 'break-all', whiteSpace: 'initial' }}
                >
                  {text}
                </div>
              ),
            },
            {
              title: '下载',
              render: (_, record) => (
                <Button
                  onClick={() => {
                    dispatch({
                      type: 'downloadExport/downloadTemplate',
                      payload: { id: record.id },
                    });
                  }}
                >
                  <Icon type="download" />
                  下载
                </Button>
              ),
            },
            {
              title: '上传',
              render: (_, record) => (
                <UploadCommon
                  name="导入文件"
                  type="default"
                  showIcon
                  params={{ templateId: record.id }}
                  actionUrl="downloadExport/uploadData"
                  dir="record/"
                />
              ),
            },
          ]}
          pagination={{
            onChange: (pageNo, pageSize) => {
              dispatch({
                type: 'downloadExport/fetchList',
                payload: {
                  pageNo,
                  pageSize,
                  ...paramsTransaction.payload,
                },
              });
            },
            onShowSizeChange: (pageNo, pageSize) => {
              dispatch({
                type: 'downloadExport/fetchList',
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
