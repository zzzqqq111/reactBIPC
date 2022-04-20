/**
 *  数据采集编辑页
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, notification } from 'antd';
import router from 'umi/router';

@connect(({ dataClear, loading }) => {
  return {
    detail: dataClear.detail,
    detailLoading: loading.effects['dataClear/fetchDetail'],
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
        type: 'dataClear/fetchDetail',
        payload: { id: query.id },
      });
    } else {
      dispatch({
        type: 'dataClear/resetDetail',
        payload: { id: query.id },
      });
    }
  }

  handleSubmit = e => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll(
      (err, { id, name, destTable, sqlScript, involvingTables, cronExpression, dependencyIds }) => {
        if (!err) {
          dispatch({
            type: 'dataClear/update',
            payload: {
              name,
              destTable,
              sqlScript: btoa(encodeURIComponent(sqlScript)),
              involvingTables,
              cronExpression,
              id: id || '',
              dependencyIds,
            },
            callback: () => {
              notification.success({
                message: '保存成功',
              });
              router.push('/back/dataClear');
            },
          });
        }
      }
    );
  };

  // 数据处理时选项改变
  dataChange = e => {
    const { value } = e.target;
    const { dispatch } = this.props;

    dispatch({
      type: 'dataClear/changeDataType',
      payload: value,
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
        <Form.Item label="清洗编号">
          {getFieldDecorator('id', { initialValue: detail.id || '' })(<Input disabled />)}
        </Form.Item>
        <Form.Item label="清洗名称">
          {getFieldDecorator('name', {
            initialValue: detail.name,
            rules: [
              {
                required: true,
                message: '清洗名称!',
              },
            ],
          })(<Input placeholder="请输入清洗名称" />)}
        </Form.Item>
        <Form.Item label="清洗目标表名" extra="格式为:'目标库.目标表名'">
          {getFieldDecorator('destTable', {
            initialValue: detail.destTable,
            rules: [
              {
                required: true,
                message: '请输入目标表名!',
              },
            ],
          })(<Input placeholder="请输入目标库.目标表名" />)}
        </Form.Item>
        <Form.Item label="清洗涉及表">
          {getFieldDecorator('involvingTables', {
            initialValue: detail.involvingTables,
            rules: [
              {
                required: true,
                message: '请输入涉及表!',
              },
            ],
          })(<Input placeholder="请输入涉及表,支持写多张表，用逗号隔开" />)}
        </Form.Item>
        <Form.Item label="调度规则">
          {getFieldDecorator('cronExpression', {
            initialValue: detail.cronExpression,
            rules: [
              {
                required: true,
                message: '请输入脚本内容!',
              },
            ],
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="清洗依赖">
          {getFieldDecorator('dependencyIds', {
            initialValue: detail.dependencyIds,
            rules: [
              {
                required: true,
                message: '请输入依赖内容!',
              },
            ],
          })(<Input placeholder="请输入依赖内容" />)}
        </Form.Item>
        <Form.Item label="脚本内容">
          {getFieldDecorator('sqlScript', {
            initialValue: detail.sqlScript,
            rules: [
              {
                required: true,
                message: '请输入脚本内容!',
              },
            ],
          })(<Input.TextArea placeholder="请输入cron表达式" rows={10} />)}
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
