/**
 *  数据采集
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Row, Col, Form, Input, DatePicker, Typography, Tooltip } from 'antd';
import moment from 'moment';
import { formatTime } from '@/utils/timeFormat';

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
const { Paragraph } = Typography;
@connect(({ adminDataDemand, loading }) => ({
  historyList: adminDataDemand.historyList,
  listLoading: loading.effects['adminDataDemand/fetchHistoryList'],
  paramsTransaction: adminDataDemand.paramsTransaction,
}))
@Form.create()
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDate: { id: '', show: false },
      nowDate: '',
    };
  }

  componentDidMount() {
    const { dispatch, paramsTransaction = {} } = this.props;
    dispatch({
      type: 'adminDataDemand/fetchHistoryList',
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
        type: 'adminDataDemand/fetchHistoryList',
        payload: fieldsValue,
      });
      dispatch({
        type: 'adminDataDemand/saveParam',
        payload: fieldsValue,
      });
    });
  };

  // 重置
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'adminDataDemand/fetchHistoryList',
    });
    dispatch({
      type: 'adminDataDemand/saveParam',
      payload: {},
    });
  };

  showDate = (id, text) => {
    this.setState({
      showDate: { id, show: true },
      nowDate: formatTime(text),
    });
  };

  onTimeChange = (date, dateString) => {
    const { dispatch } = this.props;
    const { showDate } = this.state;
    this.setState({
      nowDate: dateString,
    });
    dispatch({
      type: 'adminDataDemand/update',
      payload: { id: showDate.id, indate: dateString },
    }).then(() => {
      this.setState({
        showDate: { id: '', show: false },
      });
      dispatch({
        type: 'adminDataDemand/fetchHistoryList',
      });
    });
  };

  render() {
    const { historyList, listLoading, dispatch, paramsTransaction = {} } = this.props;
    const { showDate, nowDate } = this.state;
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
              render: (text, record) => {
                if (showDate.id === record.id && showDate.show) {
                  return (
                    <DatePicker
                      format={dateFormat}
                      value={moment(nowDate || formatTime(text), dateFormat)}
                      onChange={this.onTimeChange}
                    />
                  );
                }
                return (
                  <div
                    style={{
                      wordWrap: 'break-word',
                      wordBreak: 'break-all',
                      whiteSpace: 'initial',
                    }}
                    onClick={() => {
                      this.showDate(record.id, text);
                    }}
                  >
                    {formatTime(text)}
                  </div>
                );
              },
            },
            {
              title: '详情描述',
              dataIndex: 'description',
              render: text => (
                <div>
                  <Tooltip placement="bottom" title={text} overlayStyle={{ width: '300px' }}>
                    <Paragraph
                      style={{ whiteSpace: 'pre-line', wordBreak: 'break-word', marginBottom: 0 }}
                      ellipsis={{ rows: 3 }}
                    >
                      {text}
                    </Paragraph>
                  </Tooltip>
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
                        type: 'dataDemand/downloadHistory',
                        payload: { id: record.id },
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
                type: 'adminDataDemand/fetchHistoryList',
                payload: {
                  pageNo,
                  pageSize,
                  ...paramsTransaction.payload,
                },
              });
            },
            onShowSizeChange: (pageNo, pageSize) => {
              dispatch({
                type: 'adminDataDemand/fetchList',
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
      </div>
    );
  }
}

export default Index;
