import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Row, Col, Form, Input, Modal, Cascader } from 'antd';

@connect(({ postManage }) => ({
  indicatorlist: postManage.indicatorlist,
  detail: postManage.detail,
  indicatorTypeList: postManage.indicatorTypeList,
}))
class Indicators extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { detail = {} } = nextProps;
    const { instanceData = {} } = detail;
    if (instanceData.indicatorIds && instanceData.indicatorIds.length !== 0) {
      this.setState({
        selectedRowKeys: instanceData.indicatorIds,
      });
    }
  }

  renderSimpleForm = () => {
    const {
      form: { getFieldDecorator },
      indicatorTypeList,
    } = this.props;
    return (
      <Form layout="inline" style={{ marginBottom: '10px' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={20} sm={24}>
            <Form.Item>{getFieldDecorator('name')(<Input placeholder="指标名称" />)}</Form.Item>
            <Form.Item span={24}>
              {getFieldDecorator('type')(
                <Cascader
                  placeholder="指标渠道/颗粒/维度/业务"
                  options={indicatorTypeList}
                  changeOnSelect
                />
              )}
            </Form.Item>
          </Col>
          <Col md={2} sm={24} style={{ paddingLeft: '0' }}>
            <Button key="submit" type="primary" onClick={this.handleSearch}>
              查询
            </Button>
            {/* <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button> */}
          </Col>
        </Row>
      </Form>
    );
  };

  // 指标搜索
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      let value = fieldsValue;
      if (fieldsValue.type) {
        value = {
          name: fieldsValue.name,
          channel: fieldsValue.type[0],
          dataParticles: fieldsValue.type[1],
          dataDimension: fieldsValue.type[2],
          indicatorsTypeId: fieldsValue.type[3],
          type: '',
        };
      }
      dispatch({
        type: 'postManage/fetchIndicatorList',
        payload: value,
      });
    });
  };

  // 指标内容
  getContent = () => {
    const {
      indicatorlist,
      // detail: { instanceData = {} },
      // dispatch,
    } = this.props;
    const { selectedRowKeys } = this.state;
    const columns = [
      { title: '指标名称', dataIndex: 'name', width: '15%' },
      {
        title: '指标定义',
        dataIndex: 'define',
        width: '15%',
        render: text => (
          <div
            style={{
              wordWrap: 'break-word',
              wordBreak: 'break-all',
              whiteSpace: 'initial',
            }}
          >
            {text}
          </div>
        ),
      },
      { title: '指标渠道', dataIndex: 'channel', width: '10%' },
      { title: '数据颗粒', dataIndex: 'dataParticles', width: '10%' },
      { title: '数据维度', dataIndex: 'dataDimension', width: '10%' },
      { title: '业务类型', dataIndex: 'type', width: '10%' },
      { title: '表名称', dataIndex: 'tableName', width: '15%' },
      { title: '表字段', dataIndex: 'tableField', width: '15%' },
    ];

    const rowSelection = {
      selectedRowKeys,
      getCheckboxProps: record => {
        return {
          checked:
            selectedRowKeys && selectedRowKeys.length !== 0
              ? selectedRowKeys.indexOf(record.key) >= 0
              : '',
        };
      },
      onChange: selectedRowKeysItem => {
        this.setState({
          selectedRowKeys: selectedRowKeysItem,
        });
        // dispatch({
        //   type: 'postManage/changeInditors',
        //   payload: selectedRowKeys,
        // });
      },
    };
    return (
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={indicatorlist.map(sourceData => ({
          ...sourceData,
          key: sourceData.id,
        }))}
        rowKey={record => record.id}
        pagination={false}
        scroll={{ y: 240 }}
      />
    );
  };

  render() {
    const { indicatorlist, visible, handleCancel = () => {}, handleOk = () => {} } = this.props;
    const { selectedRowKeys } = this.state;
    return (
      <Modal
        visible={visible}
        title="指标管理"
        onOk={() => {
          handleOk(selectedRowKeys);
        }}
        rowKey={record => record.id}
        onCancel={handleCancel}
        width="60%"
      >
        {this.renderSimpleForm()}
        {indicatorlist ? this.getContent() : null}
      </Modal>
    );
  }
}

export default Indicators;
