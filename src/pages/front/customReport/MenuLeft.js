/* eslint-disable no-param-reassign */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Menu, BackTop, Button, Icon, Modal, Input, Form, message } from 'antd';
import styles from '../components/style.less';
import { getPageQuery } from '@/utils/utils';

const { SubMenu, Item } = Menu;
const { confirm } = Modal;

@connect(({ customReport, list }) => ({
  menuList: customReport.menuList, // 菜单
  defaultValue: customReport.defaultValue,
  userId: list.userId,
  navId: list.navId,
  hasPermiss: list.hasPermiss,
}))
class MenuLeft extends Component {
  constructor(props) {
    super(props);
    const { navId } = props;
    this.state = {
      showOpe: { id: '', show: false },
      modalVisible: false,
      parentId: '',
      id: '',
      name: '',
      level: '',
      addItem: true,
      navId: Number(navId),
      openKeys: [''], // 当前展开的 SubMenu 菜单项 key 数组
      selectedKeys: [''], // 当前选中的菜单项 key 数组
    };
  }

  componentDidMount = () => {
    const {
      dispatch,
      location: { pathname, query },
    } = this.props;
    if (pathname.match('/front/customReport/')) {
      const id = pathname.split('/')[3];
      dispatch({
        type: 'customReport/changeNavId',
        payload: { id },
      });
      dispatch({
        type: 'customReport/directoryQuery',
        payload: { id, type: Number(id) === 0 ? 'offical' : '' },
      });
      if (query.key) {
        dispatch({
          type: 'customReport/customReportQuery',
          payload: {
            id: query.key,
            type: Number(id) === 0 ? 'offical' : '',
          },
        });
      }
      this.setState({
        navId: Number(id),
      });
    }
    const bodyNode = document.querySelector('#body');
    bodyNode.addEventListener('mouseup', this.hideOpeation, false);
  };

  componentWillUnmount = () => {
    const bodyNode = document.querySelector('#body');
    bodyNode.removeEventListener('mouseup', this.hideOpeation, false);
  };

  componentWillReceiveProps = nextProps => {
    const {
      defaultValue,
      dispatch,
      location: { pathname, query },
    } = nextProps;
    const { navId } = this.state;
    const {
      defaultValue: { defaultSelectedKeys },
    } = this.props;
    const newId = pathname.split('/')[3];
    this.setState({
      openKeys: defaultValue.defaultOpenKeys,
      selectedKeys: defaultValue.defaultSelectedKeys,
    });
    if (Number(newId) !== Number(navId)) {
      dispatch({
        type: 'customReport/clearAllParam',
      });
      dispatch({
        type: 'customReport/directoryQuery',
        payload: { id: newId, type: Number(newId) === 0 ? 'offical' : '' },
      });
      dispatch({
        type: 'customReport/changeNavId',
        payload: { id: newId },
      });
      this.setState({
        navId: Number(newId),
      });
    }
    if (
      (defaultSelectedKeys[0] &&
        defaultValue.defaultSelectedKeys[0] &&
        defaultValue.defaultSelectedKeys[0] !== defaultSelectedKeys[0] &&
        !query.key) ||
      (!defaultSelectedKeys[0] && defaultValue.defaultSelectedKeys[0] && !query.key)
    ) {
      dispatch({
        type: 'customReport/customReportQuery',
        payload: {
          id: defaultValue.defaultSelectedKeys[0],
          type: Number(newId) === 0 ? 'offical' : '',
        },
      });
    }
  };

  showOpeation = id => {
    const { showOpe } = this.state;
    this.setState({
      showOpe: { id, show: !showOpe.show },
    });
  };

  hideOpeation = () => {
    this.setState({
      showOpe: { id: '', show: false },
    });
  };

  priorityUp = (item, index, arr) => {
    const { dispatch } = this.props;
    const { navId } = this.state;
    if (item.level === 3) {
      dispatch({
        type: 'customReport/customReportUpdate',
        payload: {
          id: item.id,
          priority: 1,
          name: item.name,
          parentId: item.parentId,
          priorityId: arr[index - 1].id,
        },
        callback: () => {
          dispatch({
            type: 'customReport/directoryQuery',
            payload: { id: navId, type: navId === 0 ? 'offical' : '' },
          });
        },
      });
    } else {
      dispatch({
        type: 'customReport/update',
        payload: {
          id: item.id,
          priority: 1,
          name: item.name,
          parentId: item.parentId,
          priorityId: arr[index - 1].id,
        },
        callback: () => {
          dispatch({
            type: 'customReport/directoryQuery',
            payload: { id: navId, type: navId === 0 ? 'offical' : '' },
          });
        },
      });
    }
  };

  priorityDown = (item, index, arr) => {
    const { dispatch } = this.props;
    const { navId } = this.state;
    if (item.level === 3) {
      dispatch({
        type: 'customReport/customReportUpdate',
        payload: {
          id: item.id,
          priority: -1,
          name: item.name,
          parentId: item.parentId,
          priorityId: arr[index + 1].id,
        },
        callback: () => {
          dispatch({
            type: 'customReport/directoryQuery',
            payload: { id: navId, type: navId === 0 ? 'offical' : '' },
          });
        },
      });
    } else {
      dispatch({
        type: 'customReport/update',
        payload: {
          id: item.id,
          name: item.name,
          parentId: item.parentId,
          priority: -1,
          priorityId: arr[index + 1].id,
        },
        callback: () => {
          dispatch({
            type: 'customReport/directoryQuery',
            payload: { id: navId },
          });
        },
      });
    }
  };

  // 删除菜单/报表
  deleteMenu = (id, _a) => {
    const { dispatch, navId } = this.props;
    const { selectedKeys } = this.state;
    confirm({
      title: _a === 3 ? '确定删除该报表' : '即将彻底删除该目录以及该目录下的所有报表',
      content: '确定要继续么',
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        if (_a === 3) {
          dispatch({
            type: 'customReport/deleteReport',
            payload: { id, type: navId === 0 ? 'offical' : '' },
            callback: () => {
              dispatch({
                type: 'customReport/directoryQuery',
                payload: { id: navId, type: navId === 0 ? 'offical' : '' },
              });
              if (id !== Number(selectedKeys[0])) {
                dispatch({
                  type: 'customReport/customReportQuery',
                  payload: {
                    id: selectedKeys[0],
                    type: navId === 0 ? 'offical' : '',
                  },
                });
              }
              router.push(`/front/customReport/${navId}`);
            },
          });
        } else {
          dispatch({
            type: 'customReport/deleteDir',
            payload: { id },
            callback: () => {
              dispatch({
                type: 'customReport/directoryQuery',
                payload: { id: navId, type: navId === 0 ? 'offical' : '' },
              });
            },
          });
        }
      },
    });
  };

  // 添加model框显示
  handleModalVisible = (flag, add, parentId, id, name, level) => {
    if (!add) {
      this.setState({
        modalVisible: !!flag,
        parentId,
        id,
        name,
        level,
        addItem: add,
      });
    } else {
      this.setState({
        modalVisible: !!flag,
        parentId,
        level,
        addItem: add,
      });
    }
  };

  // 添加目录/报表功能
  handleAdd = fields => {
    const { dispatch, navId } = this.props;
    const { parentId, id, level, addItem } = this.state;
    if (!addItem) {
      // 修改目录
      if (level === 3) {
        dispatch({
          type: 'customReport/customReportSave',
          payload: {
            id,
            name: fields.name,
            directortyId: parentId,
            type: navId === 0 ? 'offical' : '',
          },
          callback: () => {
            dispatch({
              type: 'customReport/directoryQuery',
              payload: { id: navId, type: navId === 0 ? 'offical' : '' },
            });
            this.setState({
              name: '',
              id: '',
              parentId: '',
            });
            dispatch({
              type: 'customReport/customReportQuery',
              payload: { id, type: navId === 0 ? 'offical' : '' },
            });
          },
        });
      } else {
        dispatch({
          type: 'customReport/update',
          payload: {
            name: fields.name,
            id,
          },
          callback: () => {
            dispatch({
              type: 'customReport/directoryQuery',
              payload: { id: navId, type: navId === 0 ? 'offical' : '' },
            });
            this.setState({
              name: '',
              id: '',
              parentId: '',
            });
          },
        });
      }
      message.success('修改成功');
    } else {
      // 添加目录或目录
      if (level === 2) {
        // 添加报表
        dispatch({
          type: 'customReport/clearAllParam',
        });
        dispatch({
          type: 'customReport/customReportSave',
          payload: {
            name: fields.name,
            directortyId: parentId,
            type: navId === 0 ? 'offical' : '',
          },
        }).then(res => {
          dispatch({
            type: 'customReport/directoryQuery',
            payload: { id: navId, type: navId === 0 ? 'offical' : '' },
          });
          dispatch({
            type: 'customReport/customReportQuery',
            payload: { id: res, type: navId === 0 ? 'offical' : '' },
          });
          dispatch({
            type: 'customReport/saveFirstReportData',
            payload: { name: fields.name, parentId },
          });
          dispatch({
            type: 'customReport/isShow',
            payload: true,
          });
          router.push(`/front/customReport/${navId}?key=${res}`);
        });
      } else {
        // 添加目录
        dispatch({
          type: 'customReport/directorySave',
          payload: {
            name: fields.name,
            parentId,
          },
          callback: () => {
            dispatch({
              type: 'customReport/directoryQuery',
              payload: { id: navId, type: navId === 0 ? 'offical' : '' },
            });
          },
        });
      }
      message.success('添加成功');
    }
    this.handleModalVisible();
  };

  // 操作功能
  renderOpeation = (item, index, arr) => {
    return (
      <div>
        <span
          style={{ position: 'absolute', right: 0, top: 0 }}
          onClick={() => {
            this.showOpeation(item.id);
          }}
        >
          <Icon type="ellipsis" style={{ fontSize: '20px' }} />
        </span>
        {this.opeation(item, index, arr)}
      </div>
    );
  };

  // 操作功能
  opeation = (item, index, arr) => {
    const { showOpe } = this.state;
    return showOpe.show && showOpe.id === item.id ? (
      <Menu
        style={{
          position: 'absolute',
          alignItems: 'center',
          background: '#fff',
          width: '100px',
          top: 40,
          right: 0,
          textAlign: 'center',
          paddingRight: '0px',
          zIndex: 999,
          boxShadow: '0px 0px 10px -1px rgba(0,0,0,0.2)',
        }}
      >
        {item.level === 3 ? null : (
          <Item
            onClick={() => {
              this.hideOpeation();
              this.handleModalVisible(true, true, item.id, item.id, '', item.level);
            }}
          >
            添加
          </Item>
        )}
        <Item
          onClick={() => {
            this.hideOpeation();
            this.handleModalVisible(true, false, item.parentId, item.id, item.name, item.level);
          }}
        >
          重命名
        </Item>
        {index === 0 ? null : (
          <Item
            onClick={() => {
              this.hideOpeation();
              this.priorityUp(item, index, arr);
            }}
          >
            上移
          </Item>
        )}
        {index === arr.length - 1 ? null : (
          <Item
            onClick={() => {
              this.hideOpeation();
              this.priorityDown(item, index, arr);
            }}
          >
            下移
          </Item>
        )}
        <Item
          onClick={() => {
            this.hideOpeation();
            this.deleteMenu(item.id, item.level);
          }}
        >
          删除
        </Item>
      </Menu>
    ) : null;
  };

  selectKey = (item, key) => {
    const { level } = item;
    const { navId } = this.state;
    if (level < 3) {
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'customReport/clearAllParam',
    });
    dispatch({
      type: 'customReport/customReportQuery',
      payload: { id: key, type: navId === 0 ? 'offical' : '' },
    });
    router.push(`/front/customReport/${navId}?key=${key}`);
  };

  toItem = (arr, _a) => {
    const { userId, navId, hasPermiss } = this.props;
    _a += 1;
    const items = [];
    arr.forEach((item, index) => {
      if (item.children.length === 0) {
        items.push(
          <Item key={item.id} style={{ position: 'relative', overflow: 'initial' }}>
            <span
              onClick={() => {
                this.selectKey(item, item.id);
              }}
              style={{ display: 'block', width: '70%' }}
            >
              {item.level === 1 ? <Icon type="line-chart" /> : null}
              <span>{item.name}</span>
            </span>
            {(navId === 0 && hasPermiss) || userId === 0
              ? this.renderOpeation(item, index, arr)
              : null}
          </Item>
        );
      } else {
        items.push(
          <SubMenu
            key={item.id}
            style={{ overflow: 'initial', position: 'relative' }}
            title={
              <div>
                <span style={{ display: 'block' }} onClick={this.onOpenChange.bind(this, item.id)}>
                  {item.level === 1 ? <Icon type="line-chart" /> : null}
                  <span>{item.name}</span>
                </span>
                {(navId === 0 && hasPermiss) || userId === 0
                  ? this.renderOpeation(item, index, arr)
                  : null}
              </div>
            }
          >
            {this.toItem(item.children, _a)}
          </SubMenu>
        );
      }
    });

    return items;
  };

  onOpenChange = value => {
    const { openKeys } = this.state;
    const index = openKeys.indexOf(`${value}`);
    if (index !== -1) {
      openKeys.splice(index, 1);
      this.setState({
        openKeys,
      });
    } else {
      openKeys.push(`${value}`);
      this.setState({
        openKeys,
      });
    }
  };

  render() {
    const { children, menuList = [], navId, userId, hasPermiss } = this.props;
    const { modalVisible, name, level, addItem, selectedKeys, openKeys } = this.state;
    // 生成菜单
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <Fragment>
        <BackTop />
        <div
          className={styles.main}
          ref={ref => {
            this.main = ref;
          }}
        >
          <div className={styles.leftmenu}>
            {(navId === 0 && hasPermiss) || userId === 0 ? (
              <Button
                icon="plus-square"
                style={{ paddingLeft: '24px', height: '48px', width: '100%' }}
                onClick={() => {
                  this.handleModalVisible(true, true, navId);
                }}
              >
                添加目录
              </Button>
            ) : null}
            <Menu
              mode="inline"
              multiple
              selectedKeys={[getPageQuery().key || `${selectedKeys}`]}
              openKeys={openKeys}
            >
              {this.toItem(menuList, 1)}
            </Menu>
          </div>
          <div className={styles.right} id="body">
            {children}
          </div>
          <CreateForm
            {...parentMethods}
            modalVisible={modalVisible}
            name={name}
            level={level}
            addItem={addItem}
          />
        </div>
      </Fragment>
    );
  }
}

export default MenuLeft;

// 添加/编辑目录时的内容
const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible = () => {},
    name,
    level,
    addItem,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      // eslint-disable-next-line no-nested-ternary
      title={addItem ? (level === 2 ? '新增报表' : '添加目录') : '修改目录'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form.Item
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="名称"
        extra="最多只能输入10个字"
      >
        {form.getFieldDecorator('name', {
          initialValue: name,
          rules: [{ required: true, message: '请输入目录名称！' }],
        })(<Input placeholder="请输入" maxLength={10} />)}
      </Form.Item>
    </Modal>
  );
});
