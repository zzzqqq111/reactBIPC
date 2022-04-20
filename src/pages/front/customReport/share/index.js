import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Modal, Select, Dropdown, Icon, Checkbox, Button } from 'antd';

const { Option } = Select;

@connect(({ shareInfo, customReport }) => ({
  userList: customReport.userList,
  report: customReport.report,
  firstReport: customReport.firstReport,
  shareUsers: customReport.shareUsers,
  reportIndicatorsList: shareInfo.reportIndicatorsList,
}))
@Form.create()
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shareUsersList: [],
      // id: 0,
      dropwonIsShow: { id: '', show: false },
      indicatorsArr: [],
      // openVisiable: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { shareUsers, visible } = nextProps;
    this.setState({
      shareUsersList: shareUsers,
    });
    if (!visible) {
      this.setState({ dropwonIsShow: { id: '', show: false } });
    }
  }

  handleChange = users => {
    const { shareUsersList } = this.state;
    const { dispatch, firstReport } = this.props;
    if (shareUsersList.length !== 0) {
      users.splice(0, shareUsersList.length);
    }

    dispatch({
      type: 'shareInfo/getIndicatorsByReportId',
      payload: { userId: users[0].key, reportId: firstReport.id },
    }).then(res => {
      const arr = [];
      res.reportIndicators.forEach(item => {
        arr.push(item.id);
      });
      dispatch({
        type: 'shareInfo/saveIndicatorsById',
        payload: {
          userId: users[0].key,
          reportId: firstReport.id,
          operation: 1,
          indicators: JSON.stringify(arr || []),
        },
      });
      // eslint-disable-next-line no-param-reassign
      users[0].permission = 1;
      this.setState({
        shareUsersList: shareUsersList.concat(users),
        indicatorsArr: arr,
      });
    });
  };

  // 指标修改
  onChangeInditor = checkedValues => {
    this.setState({
      indicatorsArr: checkedValues,
    });
  };

  handleMenuClick = id => {
    const { dropwonIsShow, indicatorsArr, shareUsersList } = this.state;
    const { dispatch, firstReport } = this.props;
    this.setState({
      dropwonIsShow: { id, show: !dropwonIsShow.show },
    });
    if (!dropwonIsShow.show) {
      dispatch({
        type: 'shareInfo/getIndicatorsByReportId',
        payload: { userId: id, reportId: firstReport.id },
      }).then(res => {
        this.setState({
          shareUsersList,
          indicatorsArr: res.userIndicators || [],
        });
      });
    } else {
      const newItem = shareUsersList.filter(item => Number(item.key) === Number(id));
      dispatch({
        type: 'shareInfo/saveIndicatorsById',
        payload: {
          userId: id,
          reportId: firstReport.id,
          operation: newItem[0].permission,
          indicators: indicatorsArr.length !== 0 ? JSON.stringify(indicatorsArr) : '[]',
        },
      });
    }
  };

  // 报表权限
  reportPermissChange = (value, option) => {
    const { id } = option.props;
    const { shareUsersList } = this.state;
    const { dispatch, firstReport } = this.props;
    const reportDetail = shareUsersList.filter(item => Number(item.key) === Number(id));
    reportDetail[0].permission = value;
    dispatch({
      type: 'customReport/reportUserListUpdata',
      payload: shareUsersList,
    });
    dispatch({
      type: 'shareInfo/getIndicatorsByReportId',
      payload: { userId: id, reportId: firstReport.id },
    }).then(res => {
      dispatch({
        type: 'shareInfo/saveIndicatorsById',
        payload: {
          userId: id,
          reportId: firstReport.id,
          operation: value,
          indicators: JSON.stringify(res.userIndicators),
        },
      });
    });
  };

  deleteUser = id => {
    const { shareUsersList } = this.state;
    const { dispatch, firstReport } = this.props;
    shareUsersList.forEach((item, index) => {
      if (item.key === id) {
        shareUsersList.splice(index, 1);
      }
    });
    this.setState({
      shareUsersList,
    });
    dispatch({
      type: 'shareInfo/deleteReport',
      payload: { userId: id, reportId: firstReport.id },
    });
  };

  renderSimpleForm = () => {
    const {
      // form: { getFieldDecorator },
      userList,
      reportIndicatorsList = {},
    } = this.props;
    if (userList.total === 0) {
      return null;
    }
    const { reportIndicators = [] } = reportIndicatorsList;
    const { shareUsersList = [], dropwonIsShow, indicatorsArr = [] } = this.state; // openVisiable
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
            <Col md={5} sm={4}>
              <span>{item.label}</span>
            </Col>
            <Col md={6} sm={6}>
              <Select defaultValue={item.permission} onChange={this.reportPermissChange}>
                <Option value="无权限" id={item.key}>
                  无权限
                </Option>
                <Option value={0} id={item.key}>
                  查看
                </Option>
                <Option value={1} id={item.key}>
                  下载
                </Option>
              </Select>
            </Col>
            <Col md={6} sm={6}>
              <Dropdown
                overlay={
                  <Checkbox.Group value={indicatorsArr} onChange={this.onChangeInditor}>
                    <Row>
                      {reportIndicators.map(indiItem => (
                        <Col span={24} key={indiItem.id}>
                          <Checkbox value={indiItem.id}>{indiItem.name}</Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                }
                trigger="click"
                overlayStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #eaeaea',
                  padding: '10px',
                }}
                onClick={this.handleMenuClick.bind(this, item.key)}
                visible={!!(Number(dropwonIsShow.id) === Number(item.key) && dropwonIsShow.show)}
              >
                <Button>
                  请选择指标 <Icon type="down" />
                </Button>
              </Dropdown>
            </Col>
            <Col md={1} sm={1}>
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
    const { visible, handleCancelVisible = () => {} } = this.props;
    return (
      <Modal
        visible={visible}
        title="共享"
        onCancel={handleCancelVisible}
        width="45%"
        footer={null}
        showData={this.showData}
      >
        {this.renderSimpleForm()}
      </Modal>
    );
  }
}

export default Index;
