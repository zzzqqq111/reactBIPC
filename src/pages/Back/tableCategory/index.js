/**
 * 表分类
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Table, Switch, Button, Form, Input, Modal, notification, message } from 'antd';

@connect(({ tableCategory, loading }) => ({
  list: tableCategory.list,
  listLoading: loading.effects['tableCategory/fetchList'],
}))
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      title: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'tableCategory/fetchList',
    });
  }

  showModal = value => {
    if (value === 'dataParticles') {
      this.setState({
        title: '数据颗粒',
        visible: true,
      });
    }
    if (value === 'channel') {
      this.setState({
        title: '指标渠道',
        visible: true,
      });
    }
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  switch = (checked, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tableCategory/switch',
      payload: {
        id,
        isEnable: Number(checked),
      },
      callback: () => {
        notification.success({
          message: checked ? '已启用' : '已关闭',
        });
      },
    });
  };

  renderModal = () => {
    const { visible, title } = this.state;
    const { dispatch } = this.props;
    const CreateForm = Form.create()(props => {
      const { form } = props;
      const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          form.resetFields();
          let value = {};
          if (title === '指标渠道') {
            value = { channelName: fieldsValue.name };
          } else {
            value = { particlenName: fieldsValue.name };
          }
          dispatch({
            type: title === '指标渠道' ? 'tableCategory/cannelAdd' : 'tableCategory/particlenAdd',
            payload: value,
            callback: () => {
              message.success('添加成功');
              this.handleCancel();
            },
          });
        });
      };
      return (
        <Modal
          title={title}
          maskClosable={false}
          visible={visible}
          onOk={okHandle}
          onCancel={this.handleCancel}
        >
          <Form.Item
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label={title}
            extra="最多只能输入10个字"
          >
            {form.getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入目录名称！' }],
            })(<Input placeholder="请输入" maxLength={10} />)}
          </Form.Item>
        </Modal>
      );
    });
    return <CreateForm />;
  };

  render() {
    const { list = [], listLoading } = this.props;
    return (
      <div>
        <div>
          <Button
            onClick={() => {
              router.push('/back/tableCategory/detail');
            }}
            type="primary"
            style={{ marginBottom: 16 }}
          >
            新增分类
          </Button>
          <Button
            onClick={this.showModal.bind(this, 'channel')}
            type="primary"
            style={{ marginBottom: 16, marginLeft: 16 }}
          >
            新增渠道
          </Button>
          <Button
            onClick={this.showModal.bind(this, 'dataParticles')}
            type="primary"
            style={{ marginBottom: 16, marginLeft: 16 }}
          >
            新增粒度
          </Button>
        </div>
        <Table
          loading={listLoading}
          dataSource={list}
          rowKey={record => record.id}
          columns={[
            {
              title: '分类编号',
              dataIndex: 'id',
            },
            {
              title: '指标渠道',
              dataIndex: 'channelName',
            },
            {
              title: '数据颗粒',
              dataIndex: 'particlenName',
            },
            {
              title: '是否启用',
              dataIndex: 'isEnable',
              render: (text = true, record) => (
                <Switch
                  checkedChildren="已启用"
                  unCheckedChildren="未启用"
                  defaultChecked={Boolean(text)}
                  onChange={checked => this.switch(checked, record.id)}
                />
              ),
            },
          ]}
        />
        {this.renderModal()}
      </div>
    );
  }
}

export default Index;
