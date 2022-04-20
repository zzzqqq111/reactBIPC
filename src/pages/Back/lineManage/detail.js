/**
 *  数据采集编辑页
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, notification } from 'antd';
import router from 'umi/router';

@connect(({ lineManage, loading }) => {
  return {
    detail: lineManage.detail,
    detailLoading: loading.effects['lineManage/fetchDetail'],
  };
})
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
        type: 'lineManage/fetchDetail',
        payload: { id: query.id },
      });
    }
  }

  handleSubmit = e => {
    const {
      form,
      dispatch,
      location: { query },
    } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'lineManage/update',
          payload: {
            ...values,
            id: query.id ? query.id : '',
          },
          callback: () => {
            notification.success({
              message: '保存成功',
            });
            router.push('/back/lineManage');
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
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
        style={{ maxWidth: '800px', margin: '0' }}
        onSubmit={this.handleSubmit}
      >
        <Form.Item label="线性查询编号">
          {getFieldDecorator('id', { initialValue: detail.id || '' })(<Input disabled />)}
        </Form.Item>
        <Form.Item label="线性标签">
          {getFieldDecorator('name', {
            initialValue: detail.name,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="领导人会员id">
          {getFieldDecorator('headerIds', {
            initialValue: detail.headerIds,
          })(<Input placeholder="领导人会员名，请输入一个或多个会员名（逗号分隔）" />)}
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
