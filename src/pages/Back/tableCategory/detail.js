/**
 *  数据采集编辑页
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, notification, Select, Row, Col } from 'antd';
import router from 'umi/router';

const { Option } = Select;

@connect(({ tableCategory, loading }) => {
  return {
    channelList: tableCategory.channelList,
    parcilenList: tableCategory.parcilenList,
    detailLoading: loading.effects['tableCategory/fetchDetail'],
  };
})
@Form.create()
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'tableCategory/fetchChannelList',
    });
    dispatch({
      type: 'tableCategory/fetchParcilenList',
    });
  }

  handleSubmit = e => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'tableCategory/categoryAdd',
          payload: values,
          callback: () => {
            notification.success({
              message: '保存成功',
            });
            form.setFieldsValue({
              channelName: '',
              particlenName: '',
            });
            router.push('/back/tableCategory');
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      channelList = [],
      parcilenList = [],
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
          <Col span={2} offset={22} style={{ textAlign: 'right' }}>
            <Button
              icon="close"
              onClick={() => {
                router.goBack();
              }}
            >
              关闭
            </Button>
          </Col>
        </Row>
        <Form
          {...formItemLayout}
          style={{ maxWidth: '800px', margin: '0' }}
          onSubmit={this.handleSubmit}
        >
          <Form.Item label="分类编号">
            <Input disabled />
          </Form.Item>
          <Form.Item label="渠道">
            {getFieldDecorator('channelName')(
              <Select placeholder="请选择渠道" allowClear>
                {channelList.map(item => (
                  <Option value={item.channelName} key={item.channelName}>
                    {item.channelName}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="粒度">
            {getFieldDecorator('particlenName')(
              <Select placeholder="请选择粒度" allowClear>
                {parcilenList.map(item => (
                  <Option value={item.particlenName} key={item.particlenName}>
                    {item.particlenName}
                  </Option>
                ))}
              </Select>
            )}
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
