/**
 *  脚本库
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Row, Col, Form, Input, Divider, Modal, Checkbox, message } from 'antd';

const FormItem = Form.Item;
@connect(({ reportAdmin, loading }) => ({
  list: reportAdmin.list,
  reportlist: reportAdmin.reportlist,
  dataSourceList: reportAdmin.dataSourceList,
  listLoading: loading.effects['reportAdmin/fetchList'],
}))
@Form.create()
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      title: '',
      checkList: [],
      indeterminate: { id: '', show: true },
      userId: 0,
      change: false,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      location: {
        query: { tableName },
      },
    } = this.props;
    dispatch({
      type: 'reportAdmin/fetchList',
      payload: {
        tableName: tableName || '',
      },
    });
  }

  componentWillReceiveProps = nextProps => {
    const { dataSourceList = {} } = nextProps;
    const { channelList = [], tableIdList = [] } = dataSourceList;
    const datalist = [];

    if (channelList.length !== 0) {
      channelList.forEach((item, index) => {
        datalist.push({ id: index, arr: [], show: false });
        const list = item.tableList;
        if (list && list.length !== 0) {
          const ret = [];
          // 把获取到的id分别渲染到不同的分类下 ，并赋给datalist
          list.forEach(detail => {
            tableIdList.forEach(id => {
              if (detail.id === id) {
                ret.push(id);
              }
            });
          });
          // 判断获取到的总数是否等于该分类的总数
          datalist[index].arr = ret;
          if (ret.length === list.length) {
            datalist[index].show = true;
          }
        }
      });
    }
    this.setState({
      checkList: datalist,
    });
  };

  onChange = (index, list) => {
    const { dataSourceList = {} } = this.props;
    const { channelList = [] } = dataSourceList;
    const { checkList = [] } = this.state;
    const item = channelList.find((key, i) => i === index); // 获取此时点击的是第几个分类
    const number = checkList.findIndex(key => key.id === index);
    checkList[number].arr = list;
    checkList[number].show = list.length === item.tableList.length;
    this.setState({
      checkList,
      indeterminate: {
        id: index,
        show: !!checkList.length < item.tableList.length,
      },
      change: true,
    });
  };

  onCheckAllChange = (index, e) => {
    const { dataSourceList = {} } = this.props;
    const { channelList = [] } = dataSourceList;
    const { checkList = [] } = this.state;
    const item = channelList.find((key, i) => i === index);
    const arr = [];
    item.tableList.forEach(one => {
      arr.push(one.id);
    });
    const number = checkList.findIndex(key => key.id === index);
    checkList[number].arr = e.target.checked ? arr : [];
    checkList[number].show = e.target.checked;
    this.setState({
      checkList,
      indeterminate: { id: index, show: false },
      change: true,
    });
  };

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
        type: 'reportAdmin/fetchList',
        payload: fieldsValue,
      });
    });
  };

  // 重置
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'reportAdmin/fetchList',
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  showModal = title => {
    this.setState({
      title,
      visible: true,
    });
  };

  // 点击数据源界面
  showContent = () => {
    const { title } = this.state;
    if (title === '报表列表') {
      return this.showReport();
    }
    return this.showDataSource();
  };

  //  点击查看报表界面
  showReport = () => {
    const { reportlist = [] } = this.props;
    return (
      <Table
        pagination={false}
        rowKey={record => record.id}
        columns={[
          { title: '报表', dataIndex: 'name' },
          {
            title: '操作',
            render: (_, record) => (
              <a
                target="_blank"
                onClick={() => {
                  global.open(`/front/configReport/1?key=${record.id}`);
                }}
              >
                预览
              </a>
            ),
          },
        ]}
        dataSource={reportlist}
      />
    );
  };

  // 获取当前元素的已有的表名
  getValue = index => {
    const { checkList } = this.state;
    if (checkList.length !== 0) {
      const checkItem = checkList.find(key => key.id === index);
      return checkItem ? checkItem.arr : [];
    }
    return [];
  };

  //   查看数据源
  showDataSource = () => {
    const { dataSourceList = {} } = this.props;
    const { channelList = [] } = dataSourceList;
    const { indeterminate, checkList = [] } = this.state;
    const content = channelList.map((item, index) => {
      return (
        <div style={{ marginBottom: '15px' }} key={item.channelName}>
          <Checkbox
            indeterminate={indeterminate.id === index && indeterminate.show}
            onChange={this.onCheckAllChange.bind(this, index)}
            checked={checkList.length !== 0 ? checkList[index].show : false}
            key={item.channelName}
          >
            {item.channelName}
          </Checkbox>
          <br />
          <Checkbox.Group
            style={{ width: '100%', marginTop: '15px' }}
            value={this.getValue(index)}
            onChange={this.onChange.bind(this, index)}
          >
            <Row>
              <Col span={2}>表名:</Col>
              <Col span={20}>
                {item.tableList && item.tableList.length !== 0
                  ? item.tableList.map(key => {
                      return (
                        <Checkbox
                          value={key.id}
                          key={key.id}
                          style={{ width: '90%', marginLeft: 0, paddingLeft: 0 }}
                        >
                          {key.define}({key.tableName})
                        </Checkbox>
                      );
                    })
                  : null}
              </Col>
            </Row>
          </Checkbox.Group>
        </div>
      );
    });
    return <div>{content}</div>;
  };

  // 保存时提交数据
  saveDataSource = () => {
    const { dataSourceList = {} } = this.props;
    const { tableIdList = [] } = dataSourceList;
    const { checkList, userId, change } = this.state;
    const { dispatch } = this.props;
    const structureId = [];
    checkList.forEach(item => {
      item.arr.forEach(key => {
        structureId.push(key);
      });
    });
    // 如果没有改变过存储原先的数据
    if (!change && checkList.length === 0) {
      tableIdList.forEach(item => {
        structureId.push(item);
      });
    }
    dispatch({
      type: 'reportAdmin/addTablePermission',
      payload: { tableStructureIds: JSON.stringify(structureId), userId },
    }).then(() => {
      message.success('保存成功');
      this.setState({
        visible: false,
        change: false,
      });
    });
  };

  render() {
    const { list, listLoading, dispatch } = this.props;
    const { visible, title } = this.state;
    return (
      <div>
        {this.renderSimpleForm()}
        <Table
          loading={listLoading}
          dataSource={list.map(sourceData => ({
            ...sourceData,
            key: sourceData.userId,
          }))}
          columns={[
            { title: '部门', dataIndex: 'departmentName' },
            { title: '用户', dataIndex: 'userName' },
            { title: '报表数据', dataIndex: 'reportCount' },
            {
              title: '操作',
              render: (_, record) => (
                <span>
                  {record.reportCount !== 0 ? (
                    <span>
                      <a
                        onClick={() => {
                          dispatch({
                            type: 'reportAdmin/getReport',
                            payload: { userId: record.userId },
                          }).then(() => {
                            this.showModal('报表列表');
                          });
                        }}
                      >
                        查看报表
                      </a>
                      <Divider type="vertical" />
                    </span>
                  ) : null}
                  <a
                    onClick={() => {
                      this.setState({
                        userId: record.userId,
                      });
                      dispatch({
                        type: 'reportAdmin/getDataSource',
                        payload: { userId: record.userId },
                      }).then(() => {
                        this.showModal('数据源列表');
                      });
                    }}
                  >
                    数据源
                  </a>
                </span>
              ),
            },
          ]}
        />
        <Modal
          visible={visible}
          onCancel={this.onClose}
          title={title}
          width={720}
          bodyStyle={{ height: '500px', overflow: 'scroll' }}
          onOk={this.saveDataSource}
        >
          {this.showContent()}
        </Modal>
      </div>
    );
  }
}

export default Index;
