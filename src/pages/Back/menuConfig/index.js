/**
 *  前台目录
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Divider, Button, message, Form, Input, Modal, Popconfirm } from 'antd';
import isEqual from 'lodash/isEqual';
import styles from '../_layout.less';

const { confirm } = Modal;

@connect()
@Form.create()
class Index extends Component {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.getMenu();
  }

  componentWillReceiveProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  getMenu = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menuConfig/fetchList',
    }).then(res => {
      const newArr = res.map(item => {
        return {
          ...item,
          key: item.id,
        };
      });
      this.setState({
        data: newArr,
      });
    });
  };

  getRowByKey = (key, newData) => {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  };

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    // const { dispatch } = this.props;
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({
        data: newData,
      });
    }

    this.setState({
      loading: false,
    });
  };

  newMember = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: '',
      id: '',
      name: '',
      priority: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove = key => {
    const { dispatch } = this.props;
    const $this = this;
    dispatch({
      type: 'menuConfig/directoryQuery',
      payload: { id: key },
    }).then(res => {
      if (res.length === 0) {
        confirm({
          title: '确定删除',
          okText: '确定',
          okType: 'primary',
          cancelText: '取消',
          onOk() {
            dispatch({
              type: 'menuConfig/deleteDir',
              payload: { id: key },
            }).then(() => {
              $this.getMenu();
            });
          },
        });
      } else {
        confirm({
          title: '不可删除，该目录中存在报表',
          content: '若要删除，请先移除该目录下所有报表',
          okText: '确定',
          okType: 'primary',
          cancelText: '取消',
          onOk() {
            dispatch({
              type: 'menuConfig/deleteDir',
              payload: { id: key },
            }).then(() => {
              $this.getMenu();
            });
          },
        });
      }
    });
  };

  removeAdd = key => {
    const { dispatch } = this.props;
    const $this = this;
    dispatch({
      type: 'menuConfig/deleteDir',
      payload: { id: key },
    }).then(() => {
      $this.getMenu();
    });
  };

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }

  saveRow(e, key) {
    e.persist();
    const { dispatch } = this.props;
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.name || !target.priority) {
        message.error('请填写完整信息。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      if (target.isNew) {
        delete target.isNew;
      }
      let param = {
        name: target.name,
        priority: target.priority,
      };
      if (target.id) {
        param = {
          ...param,
          id: target.id,
        };
      }
      dispatch({
        type: 'menuConfig/update',
        payload: param,
        callback: () => {
          this.getMenu();
        },
      });
      this.toggleEditable(e, key);
    }, 500);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    this.setState({ data: newData });
    this.clickedCancel = false;
  }

  render() {
    const { loading, data = [] } = this.state;
    return (
      <div>
        <Button onClick={this.newMember} type="primary" style={{ marginBottom: 16 }}>
          新增一级目录
        </Button>
        <Table
          loading={loading}
          dataSource={data.map(item => ({
            ...item,
            key: item.id,
          }))}
          columns={[
            {
              title: '目录编号',
              dataIndex: 'id',
              key: 'id',
            },
            {
              title: '目录名称',
              dataIndex: 'name',
              key: 'name',
              render: (text, record) => {
                if (record.editable) {
                  return (
                    <Input
                      value={text}
                      autoFocus
                      onChange={e => this.handleFieldChange(e, 'name', record.key)}
                      onKeyPress={e => this.handleKeyPress(e, record.key)}
                      placeholder="目录名称"
                      maxLength={5}
                    />
                  );
                }
                return text;
              },
            },
            {
              title: '目录优先级',
              dataIndex: 'priority',
              render: (text, record) => {
                if (record.editable) {
                  return (
                    <Input
                      value={text}
                      autoFocus
                      onChange={e => this.handleFieldChange(e, 'priority', record.key)}
                      onKeyPress={e => this.handleKeyPress(e, record.key)}
                      placeholder="目录优先级"
                    />
                  );
                }
                return text;
              },
            },
            {
              title: '操作',
              render: (_, record) => {
                // const { loading } = this.state;
                if (!!record.editable && loading) {
                  return null;
                }
                if (record.editable) {
                  if (record.isNew) {
                    return (
                      <span>
                        <a onClick={e => this.saveRow(e, record.key)}>添加</a>
                        <Divider type="vertical" />
                        <Popconfirm
                          title="是否要删除此行？"
                          onConfirm={() => this.removeAdd(record.key)}
                        >
                          <a>删除</a>
                        </Popconfirm>
                      </span>
                    );
                  }
                  return (
                    <span>
                      <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                      <Divider type="vertical" />
                      <a onClick={e => this.cancel(e, record.key)}>取消</a>
                    </span>
                  );
                }
                if (record.id !== 0 || record.id !== 1) {
                  return (
                    <span>
                      <a onClick={e => this.toggleEditable(e, record.key, true)}>编辑</a>
                      <Divider type="vertical" />
                      <a
                        onClick={() => {
                          this.remove(record.key);
                        }}
                      >
                        删除
                      </a>
                    </span>
                  );
                }
                return null;
              },
            },
          ]}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
      </div>
    );
  }
}

export default Index;
