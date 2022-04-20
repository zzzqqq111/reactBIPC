/**
 *  数据采集编辑页
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, notification } from 'antd';
import router from 'umi/router';
import UploadCommon from '../components/upload';

@connect(({ dataExport, loading }) => {
  return {
    detail: dataExport.detail,
    detailLoading: loading.effects['dataExport/fetchDetail'],
  };
})
@Form.create()
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: '',
    };
  }

  componentDidMount() {
    const {
      dispatch,
      location: { query },
    } = this.props;
    if (query.id) {
      dispatch({
        type: 'dataExport/fetchDetail',
        payload: { id: query.id },
      });
    } else {
      dispatch({
        type: 'dataExport/resetDetail',
      });
    }
  }

  componentWillReceiveProps = nextProps => {
    const { detail } = nextProps;
    this.setState({
      key: detail.fileKey || '',
    });
  };

  handleSubmit = e => {
    const {
      form,
      dispatch,
      location: { query },
    } = this.props;
    const { key } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'dataExport/update',
          payload: {
            ...values,
            id: query.id ? query.id : '',
            fileKey: key,
          },
          callback: () => {
            notification.success({
              message: '保存成功',
            });
            router.push('/back/dataExport');
          },
        });
      }
    });
  };

  getUrl = key => {
    this.setState({
      key,
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
      <div>
        <Form
          {...formItemLayout}
          style={{ maxWidth: '800px', margin: '0' }}
          onSubmit={this.handleSubmit}
        >
          <Form.Item label="模板编号">
            {getFieldDecorator('id', { initialValue: detail.id || '' })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="模板名称">
            {getFieldDecorator('name', {
              initialValue: detail.name,
            })(<Input placeholder="请输入模板名称" />)}
          </Form.Item>
          <Form.Item label="模板说明">
            {getFieldDecorator('description', {
              initialValue: detail.description,
            })(<Input placeholder="模板说明" />)}
          </Form.Item>
          <Form.Item label="表名称" extra="格式为：库名.表名称">
            {getFieldDecorator('destTable', {
              initialValue: detail.destTable,
            })(<Input placeholder="请输入库名.表名称" />)}
          </Form.Item>
          <Form.Item label="目标字段">
            {getFieldDecorator('destColumns', {
              initialValue: detail.destColumns,
            })(<Input placeholder="目标字段用，隔开" />)}
          </Form.Item>
          <Form.Item label="上传模板文件">
            {getFieldDecorator('url', {})(
              <UploadCommon type="default" showIcon getUrl={this.getUrl} success dir="template/" />
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
