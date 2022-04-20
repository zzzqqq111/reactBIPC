import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Modal, Select, Icon, message } from 'antd';

@connect(({ reportistPermiss }) => ({
  userList: reportistPermiss.userList,
  shareUsers: reportistPermiss.shareUsers,
}))
@Form.create()
class ShareContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shareUsersList: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { shareUsers } = nextProps;
    this.setState({
      shareUsersList: shareUsers,
    });
  }

  handleChange = users => {
    this.setState({
      shareUsersList: users,
    });
  };

  deleteUser = id => {
    const { shareUsersList } = this.state;
    const index = shareUsersList.findIndex(item => item.key === id);
    shareUsersList.splice(index, 1);
    this.setState({
      shareUsersList,
    });
  };

  saveUser = () => {
    const { dispatch, handleCancelVisible = () => {}, id } = this.props;
    const { shareUsersList } = this.state;
    const arr = [];
    shareUsersList.forEach(item => {
      arr.push(item.key);
    });
    dispatch({
      type: 'reportistPermiss/saveUser',
      payload: { cickpitReportId: id, userIds: JSON.stringify(arr) },
    }).then(() => {
      handleCancelVisible();
      message.success('共享成功');
    });
  };

  renderSimpleForm = () => {
    const { userList = {} } = this.props;
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
            <span>当前共享成员</span>
          </Col>
        </Row>
        {shareUsersList.map(item => (
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} className="m-bottom-16" key={item.key}>
            <Col md={20} sm={4}>
              <span>{item.label}</span>
            </Col>
            <Col md={2} sm={1}>
              <a onClick={this.deleteUser.bind(this, item.key)}>
                <Icon type="close" />
              </a>
            </Col>
          </Row>
        ))}
      </Form>
    );
  };

  render() {
    const { visible, handleCancelVisible = () => {} } = this.props;
    return (
      <Modal
        visible={visible}
        title="共享"
        onCancel={handleCancelVisible}
        showData={this.showData}
        onOk={this.saveUser}
      >
        {this.renderSimpleForm()}
      </Modal>
    );
  }
}

export default ShareContent;
