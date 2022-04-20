/**
 *  指标库
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Cascader, Select, notification } from 'antd';
import router from 'umi/router';

const { Option } = Select;

@connect(({ indicator, loading, global }) => ({
  selectTypes: global.selectTypes,
  detail: indicator.detail,
  detailLoading: loading.effects['indicator/fetchDetail'],
  indicatorTypeList: indicator.indicatorTypeList,
}))
@Form.create()
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: false,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      location: { query },
    } = this.props;

    dispatch({
      type: 'indicator/fetchIndicatorTypeList',
    });

    if (query.id) {
      dispatch({
        type: 'indicator/fetchDetail',
        payload: query,
      });
    } else {
      dispatch({
        type: 'indicator/resetDetail',
      });
    }
  }

  handleSubmit = e => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      // 新增、编辑都在这里处理 编辑多传一个id
      if (!err) {
        dispatch({
          type: 'indicator/update',
          payload: Object.assign(
            {},
            {
              name: values.name,
              define: values.define,
              indicatorsTypeId: values.indicatorsTypes[3],
              tableName: values.tableName,
              tableField: values.tableField,
              selector: values.selectorId,
              selectorValue:
                values.selectorId === '下拉框选择'
                  ? btoa(encodeURIComponent(values.selectorValue))
                  : '',
            },
            values.id ? { id: values.id } : {}
          ),
          callback: () => {
            notification.success({
              message: '保存成功',
            });
            router.push('/back/indicator');
          },
        });
      }
    });
  };

  selectChange = e => {
    if (e === '下拉框选择') {
      this.setState({
        input: true,
      });
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      selectTypes = [],
      detail,
      indicatorTypeList,
    } = this.props;
    const { input } = this.state;

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
        <Form.Item label="指标编号">
          {getFieldDecorator('id', { initialValue: detail.id || '' })(<Input disabled />)}
        </Form.Item>
        <Form.Item label="指标名称">
          {getFieldDecorator('name', {
            initialValue: detail.name,
            rules: [
              {
                required: true,
                message: '请输入指标名称!',
              },
            ],
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="指标定义">
          {getFieldDecorator('define', {
            initialValue: detail.define,
            rules: [
              {
                required: true,
                message: '请输入指标定义!',
              },
            ],
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="指标分类">
          {getFieldDecorator('indicatorsTypes', {
            initialValue: [
              detail.channel,
              detail.dataParticles,
              detail.dataDimension,
              detail.indicatorsTypeId,
            ],
            rules: [{ type: 'array', required: true, message: '请输入指标分类!' }],
          })(<Cascader placeholder="请选择" options={indicatorTypeList} changeOnSelect />)}
        </Form.Item>
        <Form.Item label="表名称">
          {getFieldDecorator('tableName', {
            initialValue: detail.tableName,
            rules: [
              {
                required: true,
                message: '请输入表名称!',
              },
            ],
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="表字段">
          {getFieldDecorator('tableField', {
            initialValue: detail.tableField,
            rules: [
              {
                required: true,
                message: '请输入表字段!',
              },
            ],
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="选择器（非必填）">
          {getFieldDecorator('selectorId', { initialValue: detail.selector })(
            <Select placeholder="请选择" allowClear onChange={this.selectChange}>
              {selectTypes.map(type => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        {input || detail.selector === '下拉框选择' ? (
          <Form.Item label="文本(非必填)">
            {getFieldDecorator('selectorValue', {
              initialValue: detail.selectorValue,
              rules: [
                {
                  message: '请输入文本!',
                },
              ],
            })(<Input placeholder="请输入文本" />)}
          </Form.Item>
        ) : null}
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
