/**
 *  数据采集
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Row, Col, Form, Input, Modal, Tooltip, Typography } from 'antd';
import { formatTime } from '@/utils/timeFormat';
import contact from '../../../assets/contact.jpg';

const FormItem = Form.Item;
const { Paragraph } = Typography;
@connect(({ dataDemand, loading }) => ({
  historyList: dataDemand.historyList,
  listLoading: loading.effects['dataDemand/fetchHistoryList'],
  paramsTransaction: dataDemand.paramsTransaction,
}))
@Form.create()
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataDemand/fetchHistoryList',
    });
    this.showContent();
  }

  renderSimpleForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" style={{ marginBottom: '10px' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={18} sm={24}>
            <FormItem>{getFieldDecorator('jobNo')(<Input placeholder="任务编号" />)}</FormItem>
            <FormItem>
              {getFieldDecorator('description')(<Input placeholder="任务详情" />)}
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
        type: 'dataDemand/fetchHistoryList',
        payload: fieldsValue,
      });
      dispatch({
        type: 'dataDemand/saveParam',
        payload: fieldsValue,
      });
    });
  };

  // 重置
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'dataDemand/fetchHistoryList',
    });
    dispatch({
      type: 'dataDemand/saveParam',
      payload: {},
    });
  };

  onOpen = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  getContent = arr => {
    return arr.map(item => <div>{item}</div>);
  };

  showContent = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataDemand/getNowContent',
      callback: res => {
        if (res && res.length !== 0) {
          Modal.warning({
            title: this.getContent(res),
          });
        }
      },
    });
  };

  render() {
    const { historyList, listLoading, dispatch, paramsTransaction = {} } = this.props;
    const { visible } = this.state;
    return (
      <div style={{ backgroundColor: '#fff', padding: '20px 24px 0' }}>
        {this.renderSimpleForm()}
        <Table
          loading={listLoading}
          dataSource={historyList.records.map(sourceData => ({
            ...sourceData,
            key: sourceData.jobNo,
          }))}
          columns={[
            { title: '任务编号', dataIndex: 'jobNo' },
            {
              title: '有效期',
              dataIndex: 'indate',
              width: '200px',
              render: text => (
                <div
                  style={{ wordWrap: 'break-word', wordBreak: 'break-all', whiteSpace: 'initial' }}
                >
                  {formatTime(text)}
                </div>
              ),
            },
            {
              title: '详情描述',
              dataIndex: 'description',
              render: text => (
                <Tooltip placement="bottom" title={text} overlayStyle={{ color: 'red' }}>
                  <div>
                    <Paragraph
                      style={{ whiteSpace: 'pre-line', wordBreak: 'break-word', marginBottom: 0 }}
                      ellipsis={{ rows: 3 }}
                    >
                      {text}
                    </Paragraph>
                  </div>
                </Tooltip>
              ),
            },
            {
              title: '问题反馈',
              render: () => (
                <a
                  onClick={() => {
                    this.onOpen();
                  }}
                >
                  点击反馈
                </a>
              ),
            },
            {
              title: '操作',
              render: (_, record) => (
                <span>
                  <a
                    onClick={() => {
                      dispatch({
                        type: 'dataDemand/downloadHistory',
                        payload: { id: record.id },
                      }).then(() => {
                        dispatch({
                          type: 'dataDemand/saveDownload',
                          payload: {
                            name: `${record.jobNo}`,
                          },
                        });
                      });
                    }}
                  >
                    下载
                  </a>
                </span>
              ),
            },
          ]}
          pagination={{
            onChange: (pageNo, pageSize) => {
              dispatch({
                type: 'dataDemand/fetchHistoryList',
                payload: {
                  pageNo,
                  pageSize,
                  ...paramsTransaction.payload,
                },
              });
            },
            onShowSizeChange: (pageNo, pageSize) => {
              dispatch({
                type: 'dataDemand/fetchList',
                payload: {
                  pageNo,
                  pageSize,
                  ...paramsTransaction.fetchHistoryList,
                },
              });
            },
            current: historyList.current,
            total: historyList.total,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '500', '1000', '5000'],
          }}
        />
        <Modal
          visible={visible}
          onCancel={this.onClose}
          footer={false}
          width={350}
          centered
          bodyStyle={{ padding: 0 }}
        >
          <img src={contact} alt="logo" style={{ width: '100%' }} />
        </Modal>
      </div>
    );
  }
}

export default Index;
