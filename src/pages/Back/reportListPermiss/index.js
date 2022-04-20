/**
 *  脚本库
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Row, Col, Form, Input } from 'antd';
import ShareContent from './share';

const FormItem = Form.Item;
@connect(({ reportistPermiss, loading }) => ({
  reportList: reportistPermiss.reportList,
  dataSourceList: reportistPermiss.dataSourceList,
  listLoading: loading.effects['reportistPermiss/fetchList'],
}))
@Form.create()
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      reportId: 0,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportistPermiss/fetchList',
    });
  }

  renderSimpleForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" style={{ marginBottom: '10px' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={18} sm={24}>
            <FormItem>{getFieldDecorator('name')(<Input placeholder="搜索用户名" />)}</FormItem>
          </Col>
          <Col md={6} sm={24} style={{ paddingLeft: 0, textAlign: 'right' }}>
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
        type: 'reportistPermiss/fetchList',
        payload: fieldsValue,
      });
    });
  };

  // 重置
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'reportistPermiss/fetchList',
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  showModal = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportistPermiss/fetchUserList',
      payload: { pageSize: 10000 },
    });
    dispatch({
      type: 'reportistPermiss/getUsersByReportId',
      payload: { id },
    }).then(() => {
      this.setState({
        visible: true,
        reportId: id,
      });
    });
  };

  render() {
    const { reportList = [] } = this.props;
    const { visible, reportId } = this.state;
    return (
      <div>
        <Table
          dataSource={reportList}
          rowKey={record => record.id}
          columns={[
            {
              title: '报表名称',
              dataIndex: 'reportName',
            },
            {
              title: '一级目录',
              dataIndex: 'directory1',
            },
            {
              title: '二级目录',
              dataIndex: 'directory2',
            },
            {
              title: '三级目录',
              dataIndex: 'directory3',
            },
            {
              title: '报表修改时间',
              dataIndex: 'updateTime',
            },
            {
              title: '操作',
              render: (_, record) => (
                <a
                  onClick={() => {
                    this.showModal(record.id);
                  }}
                >
                  共享
                </a>
              ),
            },
          ]}
          pagination={false}
        />
        <ShareContent
          ref="share"
          visible={visible}
          handleCancelVisible={this.onClose}
          {...this.props}
          id={reportId}
        />
      </div>
    );
  }
}

export default Index;
