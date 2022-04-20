/* eslint-disable radix */
/**
 * 配置报表
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Form, Input, Checkbox, Cascader, Modal, notification } from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { confirm } = Modal;
const FormItem = Form.Item;

@connect(({ customReport }) => ({
  menuEditList: customReport.menuEditList, // 指标列
}))
@Form.create()
class SettingReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  showConfirm = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.parentId.length !== 2) {
        notification.error({
          message: '请先给该目录添加目录',
        });
        router.push('/front/customReport');
        return;
      }
      confirm({
        title: '是否继续',
        content: '如果选择是，则报表会被成功添加',
        okText: '是',
        cancelText: '否',
        onOk() {
          const value = {
            name: fieldsValue.name,
            parentId: [parseInt(fieldsValue.parentId[0]), parseInt(fieldsValue.parentId[1])],
          };
          dispatch({
            type: 'customReport/customReportSave',
            payload: {
              ...value,
              directortyId: fieldsValue.parentId[1],
            },
          }).then(res => {
            dispatch({
              type: 'customReport/directoryQuery',
            });
            dispatch({
              type: 'customReport/customReportQuery',
              payload: { directoryId: res },
            });
            dispatch({
              type: 'customReport/saveFirstReportData',
              payload: { ...value, show: true, edit: false },
            });
            router.push(`/front/customReport?key=${res}`);
          });
        },
      });
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      menuEditList,
    } = this.props;
    const formItemLayout = {
      layout: 'horizontal',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
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
          offset: 20,
        },
      },
    };

    return (
      <Fragment>
        <PageHeaderWrapper />
        <Form
          {...formItemLayout}
          onSubmit={this.handleSubmit}
          style={{ background: '#fff', paddingLeft: '24px', paddingBottom: '30px' }}
        >
          <FormItem label="报表名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入名称' }],
            })(<Input placeholder="请输入报表名称" />)}
          </FormItem>
          <Form.Item label="存储目录">
            {getFieldDecorator('parentId', {
              rules: [{ required: true, message: '请选择目录' }],
            })(<Cascader placeholder="请选择目录" options={menuEditList} />)}
          </Form.Item>
          <FormItem label="选择模板">
            <Checkbox checked>模板1</Checkbox>
          </FormItem>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" onClick={this.showConfirm}>
              下一步
            </Button>
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}

export default SettingReport;
