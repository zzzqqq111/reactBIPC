/**
 *  实例管理详情
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, notification, Row, Col } from 'antd';
import router from 'umi/router';

const { Option } = Select;

@connect(({ dbInstance, loading, global }) => ({
  detail: dbInstance.detail,
  detailLoading: loading.effects['dbInstance/fetchDetail'],
  instanceTypes: global.instanceTypes,
}))
@Form.create()
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    const {
      dispatch,
      location: { query },
    } = this.props;

    if (query.id) {
      dispatch({
        type: 'dbInstance/fetchDetail',
        payload: query,
      });
    } else {
      dispatch({
        type: 'dbInstance/resetDetail',
      });
    }
  };

  handleSubmit = e => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, { name, host, port, dbType, username, password, id }) => {
      if (!err) {
        dispatch({
          type: 'dbInstance/update',
          payload: Object.assign(
            {},
            {
              name,
              host,
              port,
              dbType,
              username,
              password,
            },
            id
              ? {
                  id,
                }
              : {}
          ),
          callback: () => {
            notification.success({
              message: '保存成功',
            });
            router.push('/back/dbInstance');
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      instanceTypes,
      detail,
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 6,
        },
      },
    };

    return (
      <div>
        <Row>
          <Col span={2} offset={22}>
            <Button
              icon="close"
              onClick={() => {
                router.goBack();
              }}
              type="danger"
            >
              关闭
            </Button>
          </Col>
        </Row>
        <Form
          {...formItemLayout}
          style={{ maxWidth: '800px', margin: 0 }}
          onSubmit={this.handleSubmit}
        >
          <Form.Item label="实例编号" style={{ display: 'none' }}>
            {getFieldDecorator('id', { initialValue: detail.id || '' })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="实例名称">
            {getFieldDecorator('name', {
              initialValue: detail.name,
              rules: [
                {
                  required: true,
                  message: '请输入实例名称!',
                },
              ],
            })(<Input placeholder="请输入" />)}
          </Form.Item>
          <Form.Item label="HOST">
            {getFieldDecorator('host', {
              initialValue: detail.host,
              rules: [
                {
                  required: true,
                  message: '请输入HOST!',
                },
              ],
            })(<Input placeholder="请输入" />)}
          </Form.Item>
          <Form.Item label="端口">
            {getFieldDecorator('port', {
              initialValue: detail.port,
              rules: [
                {
                  required: true,
                  message: '请输入端口!',
                },
              ],
            })(<Input placeholder="请输入" />)}
          </Form.Item>
          <Form.Item label="类型">
            {getFieldDecorator('dbType', {
              initialValue: detail.dbType,
              rules: [
                {
                  required: true,
                  message: '请选择类型!',
                },
              ],
            })(
              <Select placeholder="请选择" allowClear>
                {instanceTypes.map(type => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="用户名">
            {getFieldDecorator('username', {
              initialValue: detail.username,
              rules: [
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ],
            })(<Input placeholder="请输入" />)}
          </Form.Item>
          <Form.Item label="密码">
            {getFieldDecorator('password', {
              initialValue: detail.password,
              rules: [
                {
                  required: true,
                  message: '请输入密码!',
                },
              ],
            })(<Input placeholder="请输入" />)}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Detail;
