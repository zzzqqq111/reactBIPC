import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Draggable from 'react-draggable';
import { Menu, BackTop, Button, Icon, Modal, Input, Form, message } from 'antd';
import styles from '../components/style.less';
import { getPageQuery } from '@/utils/utils';
import { isAdmin } from '@/utils/role';

const { SubMenu, Item } = Menu;
const { confirm } = Modal;

@connect(({ menuLeft, list }) => ({
  menuList: menuLeft.menuList, // 菜单
  defaultValue: menuLeft.defaultValue,
  navId: list.navId,
  configPermiss: list.configPermiss,
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
      initialLeftBoxWidth: 250, // 左边区块初始宽度
      leftBoxWidth: 250, // 左边区块初始宽度
      leftBoxMinWidth: 200, // 左边区块最小宽度
      leftBoxMaxWidth: 400, // 左边区块最大宽度
    };
  }

  componentDidMount = () => {
    const { dispatch, navId } = this.props;
    this.getDirectory(navId);
    dispatch({
      type: 'menuLeft/getNowId',
      payload: { id: navId },
    });
    const bodyNode = document.querySelector('#body');
    bodyNode.addEventListener('mouseup', this.hideOpeation, false);
  };

  componentWillUnmount = () => {
    const bodyNode = document.querySelector('#body');
    bodyNode.removeEventListener('mouseup', this.hideOpeation, false);
  };

  componentWillReceiveProps = nextProps => {
    const {
      defaultValue = {},
      navId,
      dispatch,
      // location: { query },
    } = nextProps;

    const { defaultOpenKeys = [''], defaultSelectedKeys = [''] } = defaultValue;
    this.setState({
      openKeys: defaultOpenKeys,
      selectedKeys: defaultSelectedKeys,
    });
    // eslint-disable-next-line react/destructuring-assignment
    if (Number(this.state.navId) !== Number(navId)) {
      this.setState({
        navId: Number(navId),
        openKeys: defaultOpenKeys,
        selectedKeys: defaultSelectedKeys,
      });
      dispatch({
        type: 'report/clearAllParam',
      });
      dispatch({
        type: 'menuLeft/getNowId',
        payload: { id: navId },
      });
      this.getDirectory(navId);
    }
  };

  getDirectory = navId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menuLeft/directoryQuery',
      payload: { id: navId, public: navId === 1 ? '' : 'offical' },
    });
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
        type: 'report/customReportUpdate',
        payload: {
          id: item.id,
          priority: 1,
          name: item.name,
          parentId: item.parentId,
          priorityId: arr[index - 1].id,
          type: navId === 1 ? '' : 'offical',
        },
        callback: () => {
          this.getDirectory(navId);
        },
      });
    } else {
      dispatch({
        type: 'menuLeft/update',
        payload: {
          id: item.id,
          priority: 1,
          name: item.name,
          parentId: item.parentId,
          priorityId: arr[index - 1].id,
        },
        callback: () => {
          this.getDirectory(navId);
        },
      });
    }
  };

  priorityDown = (item, index, arr) => {
    const { dispatch } = this.props;
    const { navId } = this.state;
    if (item.level === 3) {
      dispatch({
        type: 'report/customReportUpdate',
        payload: {
          id: item.id,
          priority: -1,
          name: item.name,
          parentId: item.parentId,
          priorityId: arr[index + 1].id,
          type: navId === 1 ? '' : 'offical',
        },
        callback: () => {
          this.getDirectory(navId);
        },
      });
    } else {
      dispatch({
        type: 'menuLeft/update',
        payload: {
          id: item.id,
          name: item.name,
          parentId: item.parentId,
          priority: -1,
          priorityId: arr[index + 1].id,
        },
        callback: () => {
          this.getDirectory(navId);
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
            type: 'report/deleteReport',
            payload: { id, type: navId === 1 ? '' : 'offical' },
            callback: () => {
              this.getDirectory(navId);
              if (id !== Number(selectedKeys[0])) {
                dispatch({
                  type: 'report/customReportQuery',
                  payload: {
                    id: selectedKeys[0],
                    type: navId === 1 ? '' : 'offical',
                  },
                });
                dispatch({
                  type: 'report/customReportQueryData',
                  payload: {
                    reportId: selectedKeys[0],
                    type: navId === 1 ? '' : 'offical',
                  },
                });
              }
              router.push(`/front/configReport/${navId}`);
            },
          });
        } else {
          dispatch({
            type: 'menuLeft/deleteDir',
            payload: { id },
            callback: () => {
              this.getDirectory(navId);
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
    const { parentId, id, level, addItem, selectedKeys } = this.state;
    if (!addItem) {
      // 修改目录
      if (level === 3) {
        dispatch({
          type: 'report/customReportSave',
          payload: {
            id,
            name: fields.name,
            directoryId: parentId,
            public: navId === 1 ? '' : 'offical',
          },
          callback: () => {
            this.getDirectory(navId);
            this.setState({
              name: '',
              id: '',
              parentId: '',
            });
            if (Number(id) === Number(selectedKeys) || Number(id) === Number(getPageQuery().key)) {
              dispatch({
                type: 'report/customReportQuery',
                payload: { id, type: navId === 1 ? '' : 'offical' },
              });
            }
          },
        });
      } else {
        dispatch({
          type: 'menuLeft/update',
          payload: {
            name: fields.name,
            id,
          },
          callback: () => {
            this.getDirectory(navId);
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
      dispatch({
        type: 'menuLeft/directorySave',
        payload: {
          name: fields.name,
          parentId,
        },
        callback: () => {
          this.getDirectory(navId);
        },
      });
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
    const { dispatch, showEdit = () => {}, resetField = () => {} } = this.props;
    return showOpe.show && showOpe.id === item.id ? (
      <Menu className={styles.menuContainer}>
        {item.level === 3 ? null : (
          <Item
            onClick={() => {
              this.hideOpeation();
              if (item.level === 2) {
                dispatch({
                  type: 'report/saveFirstReportData',
                  payload: { directoryId: item.id },
                  callback: () => {
                    showEdit();
                    resetField();
                  },
                });
              } else {
                this.handleModalVisible(true, true, item.id, item.id, '', item.level);
              }
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
    const { queryData = () => {} } = this.props;
    const { navId } = this.state;
    if (level < 3) {
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'report/clearAllParam',
    });
    queryData(key);
    router.push(`/front/configReport/${navId}?key=${key}`);
  };

  toItem = (arr, _a) => {
    const { navId, configPermiss } = this.props;
    const { openKeys } = this.state;
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
              className={styles.menuText}
            >
              {/* {item.level === 1 ? <Icon type="line-chart" /> : null} */}
              <span>{item.name}</span>
            </span>
            {/* 只有有驾驶舱权限的用户和茶几管理员才会有操作功能 */}
            {(navId === 1 && configPermiss) || isAdmin()
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
                <span className={styles.menuText} onClick={this.onOpenChange.bind(this, item.id)}>
                  {openKeys.findIndex(key => Number(key) === Number(item.id)) === -1 ? (
                    <Icon type="plus-square" />
                  ) : (
                    <Icon type="minus-square" />
                  )}
                  <span>{item.name}</span>
                </span>
                {(navId === 1 && configPermiss) || isAdmin()
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

  // 拖动时设置拖动box背景色，同时更新左右box的宽度
  onDrag = (ev, ui) => {
    const { initialLeftBoxWidth } = this.state;
    const newLeftBoxWidth = ui.x + initialLeftBoxWidth;
    this.setState({
      leftBoxWidth: newLeftBoxWidth,
    });
  };

  render() {
    const { children, menuList = [], navId, configPermiss } = this.props;
    const {
      modalVisible,
      name,
      level,
      addItem,
      selectedKeys,
      openKeys,
      initialLeftBoxWidth,
      leftBoxWidth,
      leftBoxMinWidth,
      leftBoxMaxWidth,
    } = this.state;
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
          <div style={{ width: leftBoxWidth }} className={styles.leftmenu}>
            {(navId === 1 && configPermiss) || isAdmin() ? (
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
              // inlineIndent={20}
            >
              {this.toItem(menuList, 1)}
            </Menu>
            <Draggable
              axis="x"
              defaultPosition={{ x: 0, y: 0 }}
              bounds={{
                left: leftBoxMinWidth - initialLeftBoxWidth,
                right: leftBoxMaxWidth - initialLeftBoxWidth,
              }}
              onDrag={this.onDrag}
              onStop={this.onDragStop}
            >
              <div style={{ left: initialLeftBoxWidth - 5 }} className={styles.dragBox} />
            </Draggable>
          </div>
          <div id="body" style={{ width: leftBoxWidth }} className={styles.right}>
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
