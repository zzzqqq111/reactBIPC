/**
 *  数据采集
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Row, Col, Form, Input, Divider, Modal } from 'antd';
import { formatTime } from '@/utils/timeFormat';

const FormItem = Form.Item;
@connect(({ downloadExport, loading }) => ({
  historylist: downloadExport.historylist,
  previewList: downloadExport.previewList,
  listLoading: loading.effects['downloadExport/fetchList'],
  paramsTransaction: downloadExport.paramsTransaction,
}))
@Form.create()
class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  componentDidMount() {
    const { dispatch, paramsTransaction = {} } = this.props;
    dispatch({
      type: 'downloadExport/fetchHistoryList',
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
          <Col md={18} sm={24}>
            <FormItem>{getFieldDecorator('templateId')(<Input placeholder="模板编号" />)}</FormItem>
            <FormItem>
              {getFieldDecorator('templateName')(<Input placeholder="模板名称" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('fileName')(<Input placeholder="已上传文件名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24} style={{ paddingLeft: 0, textAlign: 'right' }}>
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
        type: 'downloadExport/fetchHistoryList',
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
      type: 'downloadExport/fetchHistoryList',
    });
    dispatch({
      type: 'downloadExport/saveParam',
      payload: {},
    });
  };

  onClose = () => {
    this.setState({
      show: false,
    });
  };

  renderPreviewData = () => {
    const { previewList = {} } = this.props;
    const { headers = [], columns = [], dataList = [] } = previewList;
    const arr = [];
    headers.forEach((item, index) => {
      arr.push({
        title: `${item}`,
        dataIndex: `${columns[index]}`,
        key: index,
        render: text => {
          let value = '';
          if (typeof text === 'boolean') {
            value = `${text}`;
            return <div>{value}</div>;
          }
          return <div>{text}</div>;
        },
      });
    });
    return (
      <Table
        columns={arr}
        dataSource={dataList.map((item, index) => ({
          key: index,
          ...item,
        }))}
        bordered
      />
    );
  };

  render() {
    const { historylist, listLoading, dispatch, paramsTransaction = {} } = this.props;
    const { records = [], total, current } = historylist;
    const { show } = this.state;
    return (
      <div style={{ backgroundColor: '#fff', padding: '20px 24px 0' }}>
        {this.renderSimpleForm()}
        <Table
          loading={listLoading}
          dataSource={records.map((sourceData, index) => ({
            ...sourceData,
            key: index,
          }))}
          columns={[
            { title: '记录编号', dataIndex: 'id' },
            { title: '模板编号', dataIndex: 'templateId' },
            {
              title: '模板名称',
              dataIndex: 'templateName',
            },
            {
              title: '已上传文件名',
              dataIndex: 'fileName',
            },
            {
              title: '上传人',
              dataIndex: 'userName',
            },
            {
              title: '上传时间',
              dataIndex: 'gmtCreated',
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
                      dispatch({
                        type: 'downloadExport/downloadHistoryData',
                        payload: { id: record.id },
                      });
                    }}
                  >
                    下载
                  </a>
                  <Divider type="vertical" />
                  <a
                    onClick={() => {
                      dispatch({
                        type: 'downloadExport/uploadPreviewDownload',
                        payload: { id: record.id },
                      }).then(() => {
                        this.setState({
                          show: true,
                        });
                      });
                    }}
                  >
                    预览
                  </a>
                </span>
              ),
            },
          ]}
          pagination={{
            onChange: (pageNo, pageSize) => {
              dispatch({
                type: 'downloadExport/fetchHistoryList',
                payload: {
                  pageNo,
                  pageSize,
                  ...paramsTransaction.payload,
                },
              });
            },
            onShowSizeChange: (pageNo, pageSize) => {
              dispatch({
                type: 'downloadExport/fetchHistoryList',
                payload: {
                  pageNo,
                  pageSize,
                  ...paramsTransaction.payload,
                },
              });
            },
            current,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '500', '1000', '5000'],
          }}
        />
        <Modal visible={show} onCancel={this.onClose} footer={false} title="预览">
          {this.renderPreviewData()}
        </Modal>
      </div>
    );
  }
}

export default History;
