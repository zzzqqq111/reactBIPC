/**
 *  定时发送消息编辑页
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { message, Button, Row, Col, Form, Input, DatePicker, Select } from 'antd';
import moment from 'moment';
import router from 'umi/router';
import { formatTime } from '@/utils/timeFormat';
import styles from '../_layout.less';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
@connect(({ sendReport, loading }) => ({
  detail: sendReport.detail,
  report: sendReport.report,
  listLoading: loading.effects['sendReport/fetchDetail'],
}))
@Form.create()
class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      reportType: '',
    };
  }

  componentDidMount = () => {
    const {
      dispatch,
      location: { query },
    } = this.props;

    if (query.id) {
      dispatch({
        type: 'sendReport/fetchDetail',
        payload: query,
      });
    } else {
      dispatch({
        type: 'sendReport/resetDetail',
      });
    }
  };

  handleSubmit = e => {
    const {
      form,
      dispatch,
      location: { query },
    } = this.props;
    const { type } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      const newValue = {
        ...values,
        dataStartTime:
          values.time && values.time.length !== 0
            ? values.time[0].format('YYYY-MM-DD HH:mm:ss')
            : [],
        dataEndTime:
          values.time && values.time.length !== 0
            ? values.time[1].format('YYYY-MM-DD HH:mm:ss')
            : [],
        time: '',
        accurateTime: values.accurateTime ? values.accurateTime.format('HH:mm:ss') : '',
        taskExpiry: values.taskExpiry ? values.taskExpiry.format('YYYY-MM-DD HH:mm:ss') : '',
        schedulerType: type,
        id: query.id,
      };
      dispatch({
        type: 'sendReport/update',
        payload: newValue,
      }).then(() => {
        router.push('/back/sendReport');
        message.error('保存成功');
      });
    });
  };

  reportTypeChange = value => {
    this.setState({
      reportType: value,
    });
  };

  onChange = value => {
    this.setState({
      type: value,
    });
  };

  searchReport = value => {
    const { dispatch } = this.props;
    const { reportType } = this.state;
    if (value === '') {
      message.error('请先输入编号');
      return;
    }
    if (reportType === '') {
      message.error('请先选择报表类型');
      return;
    }
    dispatch({
      type: 'sendReport/reportQuery',
      payload: { type: reportType, id: value },
    });
  };

  render() {
    const { type } = this.state;
    let sendlabel = '';
    let sendTime = '';
    const {
      form: { getFieldDecorator },
      detail = {},
      report = {},
    } = this.props;
    const { name = '', indicators = [] } = report;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    if (type === 1) {
      sendlabel = '月';
      sendTime = '26';
    } else if (type === 2) {
      sendlabel = '周';
      sendTime = '五';
    } else if (type === 3) {
      sendlabel = '天';
      sendTime = '';
    }
    return (
      <Form
        {...formItemLayout}
        style={{ maxWidth: '800px', margin: 0 }}
        onSubmit={this.handleSubmit}
      >
        <div className={styles.userMessage}>报表内容</div>
        <Form.Item label="报表类型">
          <Select placeholder="请选择报表类型" onChange={this.reportTypeChange}>
            <Option value="官方报表">官方报表</Option>
            <Option value="数据驾驶舱报表">数据驾驶舱报表</Option>
          </Select>
        </Form.Item>
        <Form.Item label="待选报表">
          {getFieldDecorator('reportNo', {
            initialValue: detail.reportNo,
            rules: [
              {
                required: true,
                message: '请输入表字段!',
              },
            ],
          })(
            <Search placeholder="请输入报表编号" enterButton="查询" onSearch={this.searchReport} />
          )}
        </Form.Item>
        {name !== '' ? (
          <Form.Item label="报表名称">
            <div>{name}</div>
          </Form.Item>
        ) : null}
        <Form.Item label="时间字段">
          {getFieldDecorator('timeField', {
            initialValue: detail.timeField,
            // rules: [
            //   {
            //     required: true,
            //     message: '请输入表字段!',
            //   },
            // ],
          })(
            <Select placeholder="请选择一个字段">
              {indicators.map(item => (
                <Option value={item.field} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="时间段选择">
          {getFieldDecorator('time', {
            initialValue: detail.user
              ? detail.user[0].startTime && detail.user[0].endTime
                ? [
                    moment(`${formatTime(detail.user[0].startTime)}`, 'YYYY-MM-DD HH:mm:ss'),
                    moment(`${formatTime(detail.user[0].startTime)}`, 'YYYY-MM-DD HH:mm:ss'),
                  ]
                : ''
              : '',
            // rules: [
            //   {
            //     required: true,
            //     message: '请输入表字段!',
            //   },
            // ],
          })(<RangePicker style={{ width: 370 }} format="YYYY-MM-DD HH:mm:ss" showTime />)}
        </Form.Item>
        <div className={styles.userMessage}>发送策略</div>
        <Form.Item label="邮件标题">
          <Select placeholder="" onChange={this.onChange}>
            <Option value={1}>月度</Option>
            <Option value={2}>周度</Option>
            <Option value={3}>日度</Option>
            {/* <Option value="*">自定义</Option> */}
          </Select>
        </Form.Item>
        {type && (type !== '' || type !== '') ? (
          <Form.Item label="发送时间">
            <Row>
              <Col span={2}>每{sendlabel}</Col>
              {type === 1 || type === 2 ? (
                <Col span={4}>
                  <Form.Item>
                    {getFieldDecorator('schedulerValue', {
                      initialValue: sendTime,
                    })(<Input />)}
                  </Form.Item>
                </Col>
              ) : null}
              {type === 1 ? <Col span={1}>日</Col> : null}
              <Col span={5}>
                <Form.Item>
                  {getFieldDecorator('accurateTime', {
                    initialValue: detail.accurateTime,
                  })(<DatePicker showTime format="HH:mm:ss" mode="time" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        ) : null}
        <Form.Item label="结束时间">
          {getFieldDecorator('taskExpiry', {
            initialValue: detail.taskExpiry,
            // rules: [
            //   {
            //     required: true,
            //     message: '请输入表字段!',
            //   },
            // ],
          })(<DatePicker showTime />)}
        </Form.Item>
        <div className={styles.userMessage}>收件人信息</div>
        <Form.Item label="邮件标题">
          {getFieldDecorator('emailTitle', {
            initialValue: detail.emailTitle,
            // rules: [
            //   {
            //     required: true,
            //     message: '请输入表字段!',
            //   },
            // ],
          })(<Input placeholder="请输入标题" />)}
        </Form.Item>
        <Form.Item label="收件人">
          {getFieldDecorator('recipient', {
            initialValue: detail.recipient,
            // rules: [
            //   {
            //     required: true,
            //     message: '请输入表字段!',
            //   },
            // ],
          })(<Input placeholder="请输入邮箱地址，支持多个，用逗号隔开" />)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
export default Details;
