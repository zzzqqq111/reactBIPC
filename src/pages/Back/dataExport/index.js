/**
 *  数据采集
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Table,
  Switch,
  Button,
  notification,
  Row,
  Col,
  Form,
  Input,
  Modal,
  Icon,
  Select,
  Divider,
} from 'antd';

const FormItem = Form.Item;
@connect(({ dataExport, loading }) => ({
  list: dataExport.list,
  listLoading: loading.effects['dataExport/fetchList'],
  paramsTransaction: dataExport.paramsTransaction,
  userList: dataExport.userList,
  shareUsersList: dataExport.shareUsersList,
}))
@Form.create()
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      shareUsersList: [],
      templateId: '',
    };
  }

  componentDidMount() {
    const { dispatch, paramsTransaction = {} } = this.props;
    dispatch({
      type: 'dataExport/fetchList',
      payload: {
        ...paramsTransaction.payload,
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const { shareUsersList } = nextProps;
    this.setState({
      shareUsersList,
    });
  }

  switch = (checked, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataExport/switch',
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

  renderSimpleForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" style={{ marginBottom: '10px' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={20} sm={24}>
            <FormItem>{getFieldDecorator('name')(<Input placeholder="模板名称" />)}</FormItem>
            <FormItem>{getFieldDecorator('destTable')(<Input placeholder="表名称" />)}</FormItem>
          </Col>
          <Col md={4} sm={24} style={{ paddingLeft: 0 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'dataExport/fetchList',
        payload: fieldsValue,
      });
      dispatch({
        type: 'dataExport/saveParam',
        payload: fieldsValue,
      });
    });
  };

  // 重置
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'dataExport/fetchList',
    });
    dispatch({
      type: 'dataExport/saveParam',
      payload: {},
    });
  };

  showModal = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataExport/fetchUserList',
      callback: () => {
        dispatch({
          type: 'dataExport/fetchhasShareUserList',
          payload: {
            id,
          },
        });
      },
    }).then(() => {
      this.setState({
        visible: true,
        templateId: id,
      });
    });
  };

  handleCancelVisible = () => {
    this.setState({
      visible: false,
    });
  };

  // 添加某个用户
  handleChange = users => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataExport/reportUserListUpdata',
      payload: users,
    });
    this.setState({
      shareUsersList: users,
    });
  };

  // 删除共享里的用户
  deleteUser = id => {
    const { shareUsersList } = this.state;
    const index = shareUsersList.findIndex(item => item.key === id);
    shareUsersList.splice(index, 1);
    this.setState({
      shareUsersList,
    });
  };

  onOk = () => {
    const { shareUsersList, templateId } = this.state;
    const { dispatch } = this.props;
    const users = [];
    shareUsersList.forEach(item => {
      users.push(item.key);
    });
    dispatch({
      type: 'dataExport/fetchShareUserList',
      payload: {
        userIds: JSON.stringify(users),
        templateId,
      },
    }).then(() => {
      this.handleCancelVisible();
    });
  };

  renderModalContent = () => {
    const { visible } = this.state;
    return (
      <Modal
        visible={visible}
        title="共享"
        onCancel={this.handleCancelVisible}
        width="35%"
        onOk={this.onOk}
      >
        {this.renderContent()}
      </Modal>
    );
  };

  renderContent = () => {
    const { userList } = this.props;
    if (userList.total === 0) {
      return null;
    }
    const { shareUsersList = [] } = this.state; // openVisiable
    if (userList.records.length === 0) {
      return null;
    }
    return (
      <Form layout="inline" style={{ marginBottom: '10px' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={24} sm={24}>
            <Select
              mode="multiple"
              placeholder="通过姓名添加共享成员"
              onChange={this.handleChange}
              style={{ width: '100%' }}
              labelInValue
              value={shareUsersList}
            >
              {userList.records.map(item => (
                <Select.Option key={item.id} value={item.id} label={item.userName}>
                  {item.userName}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={24} sm={24} className="m-bottom-16 m-top-16">
            <span>当前共享成员(共{shareUsersList.length}人)</span>
          </Col>
        </Row>
        {shareUsersList.map(item => (
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} className="m-bottom-16" key={item.key}>
            <Col md={18} sm={18}>
              <span>{item.label}</span>
            </Col>
            <Col md={6} sm={6} style={{ textAlign: 'right' }}>
              <Button onClick={this.deleteUser.bind(this, item.key)}>
                <Icon type="close" />
              </Button>
            </Col>
          </Row>
        ))}
      </Form>
    );
  };

  render() {
    const { list, listLoading, dispatch, paramsTransaction = {} } = this.props;

    return (
      <div>
        {this.renderSimpleForm()}
        <Button
          onClick={() => {
            router.push('/back/dataExport/detail');
          }}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          新增模板
        </Button>
        <Table
          loading={listLoading}
          dataSource={list.records.map(sourceData => ({
            ...sourceData,
            key: sourceData.id,
          }))}
          columns={[
            { title: '模板编号', dataIndex: 'id' },
            {
              title: '模板名称',
              dataIndex: 'name',
            },
            {
              title: '模板说明',
              dataIndex: 'description',
              render: text => (
                <div
                  style={{ wordWrap: 'break-word', wordBreak: 'break-all', whiteSpace: 'initial' }}
                >
                  {text}
                </div>
              ),
            },
            {
              title: '表名称',
              dataIndex: 'destTable',
            },
            {
              title: '操作',
              render: (_, record) => (
                <span>
                  <a
                    onClick={() => {
                      router.push(`/back/dataExport/detail?id=${record.id}`);
                    }}
                  >
                    编辑
                  </a>
                  <Divider type="vertical" />
                  <a
                    onClick={() => {
                      this.showModal(record.id);
                    }}
                  >
                    共享
                  </a>
                </span>
              ),
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
          pagination={{
            onChange: (pageNo, pageSize) => {
              dispatch({
                type: 'dataExport/fetchList',
                payload: {
                  pageNo,
                  pageSize,
                  ...paramsTransaction.payload,
                },
              });
            },
            onShowSizeChange: (pageNo, pageSize) => {
              dispatch({
                type: 'dataExport/fetchList',
                payload: {
                  pageNo,
                  pageSize,
                  ...paramsTransaction.payload,
                },
              });
            },
            current: list.current,
            total: list.total,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '500', '1000', '5000'],
          }}
        />
        {this.renderModalContent()}
      </div>
    );
  }
}

export default Index;
