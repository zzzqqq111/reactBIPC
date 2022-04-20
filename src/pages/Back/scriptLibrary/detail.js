/**
 *  脚本库
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, notification } from 'antd';
import router from 'umi/router';

const { Option } = Select;

@connect(({ scriptLibrary, loading, global }) => ({
  instanceTypes: global.instanceTypes,
  detail: scriptLibrary.detail,
  detailLoading: loading.effects['scriptLibrary/fetchDetail'],
}))
@Form.create()
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {
      dispatch,
      location: { query },
    } = this.props;

    if (query.id) {
      dispatch({
        type: 'scriptLibrary/fetchDetail',
        payload: query,
      });
    } else {
      dispatch({
        type: 'scriptLibrary/resetDetail',
      });
    }
  }

  handleSubmit = e => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, { id, name, description, content, scriptType }) => {
      if (!err) {
        dispatch({
          type: 'scriptLibrary/update',
          payload: Object.assign(
            {},
            {
              name,
              description,
              content: btoa(encodeURIComponent(content)),
              scriptType,
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
            router.push('/back/scriptLibrary');
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
      <Form
        {...formItemLayout}
        style={{ maxWidth: '800px', margin: 0 }}
        onSubmit={this.handleSubmit}
      >
        <Form.Item label="脚本编号">
          {getFieldDecorator('id', { initialValue: detail.id || '' })(<Input disabled />)}
        </Form.Item>
        <Form.Item label="脚本名称">
          {getFieldDecorator('name', {
            initialValue: detail.name,
            rules: [
              {
                required: true,
                message: '请输入脚本名称!',
              },
            ],
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="脚本类型">
          {getFieldDecorator('scriptType', {
            initialValue: detail.scriptType,
            rules: [
              {
                required: true,
                message: '请选择脚本类型!',
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
        <Form.Item label="脚本逻辑">
          {getFieldDecorator('description', {
            initialValue: detail.description,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="脚本内容">
          {getFieldDecorator('content', {
            initialValue: detail.content,
            rules: [
              {
                required: true,
                message: '请输入表字段!',
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
    );
  }
}

export default Detail;
