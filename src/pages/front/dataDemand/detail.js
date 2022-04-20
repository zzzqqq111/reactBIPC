/**
 *  数据采集编辑页
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, notification, Select, DatePicker } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { formatTime } from '@/utils/timeFormat';

const { TextArea } = Input;
const { Option } = Select;

@connect(({ dataDemand, loading }) => {
  return {
    detail: dataDemand.detail,
    detailLoading: loading.effects['dataDemand/fetchDetail'],
    userList: dataDemand.userList,
  };
})
@Form.create()
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: '',
    };
  }

  componentDidMount() {
    const {
      dispatch,
      location: { query },
    } = this.props;
    if (query.parentId) {
      dispatch({
        type: 'dataDemand/addSubtasks',
        payload: { parentId: query.parentId },
      });
    }
    if (query.id) {
      dispatch({
        type: 'dataDemand/fetchDetail',
        payload: { id: query.id },
        callback: res => {
          const { dataJob = {} } = res;
          this.setState({
            date: dataJob.indate ? formatTime(dataJob.indate) : '',
          });
        },
      });
    } else {
      dispatch({
        type: 'dataDemand/resetDetail',
      });
    }
    dispatch({
      type: 'dataDemand/fetchUserList',
    });
  }

  timeChange = (value, dateString) => {
    const { dispatch } = this.props;
    this.setState({
      date: dateString,
    });
    dispatch({
      type: 'dataDemand/changeTime',
      payload: { indate: dateString, format: 'date' },
    });
  };

  handleSubmit = e => {
    const {
      form,
      dispatch,
      location: { query },
    } = this.props;
    const { date } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (date === '') {
          notification.error({
            message: '请填写数据期限',
          });
          return;
        }
        dispatch({
          type: 'dataDemand/update',
          payload: {
            ...values,
            id: query.id ? query.id : '',
            indate: date,
            time: [],
            userIds: JSON.stringify(values.userIds) || '[]',
            parentId: query.parentId ? query.parentId : '',
          },
          callback: () => {
            notification.success({
              message: '保存成功',
            });
            router.push('/front/dataDemand');
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      detail = {},
      userList = [],
      // location: { query },
    } = this.props;
    const { dataJob = {}, userId = [] } = detail;
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
    return (
      <div>
        <Form
          {...formItemLayout}
          style={{ backgroundColor: '#fff', padding: '20px 24px' }}
          onSubmit={this.handleSubmit}
        >
          <Form.Item label="任务编号">
            {getFieldDecorator('jobNo', {
              initialValue: dataJob.jobNo || '',
            })(<Input placeholder="请输入任务编号" />)}
          </Form.Item>
          <Form.Item label="任务类型">
            {getFieldDecorator('jobType', {
              initialValue: dataJob.jobType,
              rules: [
                {
                  required: true,
                  message: '请输入对接部门!',
                },
              ],
            })(
              <Select placeholder="请选择任务类型">
                <Option value={1}>临时取数</Option>
                <Option value={2}>开通权限</Option>
                <Option value={3}>短信营销</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="需求人">
            {getFieldDecorator('applyUserId', {
              initialValue: dataJob.applyUserId,
              rules: [
                {
                  required: true,
                  message: '请选择需求人!',
                },
              ],
            })(
              <Select placeholder="请选择需求人">
                {userList.map(item => (
                  <Option value={item.id} key={item.id}>
                    {item.userName}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="使用人">
            {getFieldDecorator('userIds', {
              initialValue: userId,
              rules: [
                {
                  required: true,
                  message: '请选择使用人!',
                },
              ],
            })(
              <Select placeholder="请选择使用人" mode="multiple" showArrow>
                {userList.map(item => (
                  <Option value={item.id} key={item.id}>
                    {item.userName}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            label={
              <span>
                <span
                  style={{
                    color: '#f5222d',
                    fontSize: '14px',
                    marginRight: '4px',
                    fontFamily: 'SimSun, sans-serif',
                  }}
                >
                  *
                </span>
                有效期
              </span>
            }
          >
            <DatePicker
              format="YYYY-MM-DD"
              onChange={this.timeChange}
              value={
                dataJob.indate
                  ? moment(
                      dataJob.format ? dataJob.indate : formatTime(dataJob.indate),
                      'YYYY-MM-DD'
                    )
                  : ''
              }
            />
          </Form.Item>
          <Form.Item label="详情描述">
            {getFieldDecorator('description', {
              initialValue: dataJob.description,
              rules: [
                {
                  required: true,
                  message: '请填写详情内容!',
                },
              ],
            })(<TextArea placeholder="请输入描述内容" rows={5} />)}
          </Form.Item>
          <div style={{ width: '88%', textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default Detail;
