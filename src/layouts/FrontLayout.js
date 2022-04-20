/* eslint-disable no-nested-ternary */
/**
 * 百e数据 - 前台布局
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import Draggable from 'react-draggable';
import { Layout, Menu, Icon, Modal } from 'antd';
import RightContent from '@/components/GlobalHeader/RightContent';
import logo from '../assets/logo.svg';
import contact from '../assets/contact.jpg';
import styles from './FrontLayout.less';
import { getPermiss } from '@/utils/authority';
import { isAdmin } from '@/utils/role';

const { Header, Content } = Layout;
const { SubMenu } = Menu;

@connect(({ loading, list }) => ({
  submitting: loading.effects['login/login'],
  navList: list.navList,
  navId: list.navId,
  hasPermiss: list.hasPermiss,
  configPermiss: list.configPermiss,
  hasJobList: list.hasJobList,
  hasJobDownload: list.hasJobDownload,
}))
class FrontLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      dataImport: false,
      visible: false,
      activeDrags: 0,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      location: { pathname },
    } = this.props;
    const permiss = getPermiss();
    const newPermiss = permiss ? JSON.parse(permiss) : [];
    newPermiss.forEach(item => {
      if (item === 'CUSTOMIZED_REPORT_CONFIG') {
        dispatch({
          type: 'list/changePermiss',
          payload: true,
        });
      }
      if (item === 'COCKPIT_REPORT_CONFIG') {
        dispatch({
          type: 'list/hasConfigPermiss',
          payload: true,
        });
      }
      if (item === 'DATA_IMPORT_CONFIG') {
        this.setState({
          dataImport: true,
        });
      }
      if (item === 'DATA_JOB_LIST') {
        dispatch({
          type: 'list/hasJobList',
          payload: true,
        });
      }
      if (item === 'DATA_JOB_DOWNLOAD') {
        dispatch({
          type: 'list/hasJobDownload',
          payload: true,
        });
      }
    });
    dispatch({
      type: 'list/fetchMenuList',
    });
    if (pathname === '/my/center') {
      dispatch({
        type: 'list/changeNavId',
        payload: { key: '' },
      });
    } else if (pathname.match('/front/configReport')) {
      const id = pathname.split('/')[3];
      dispatch({
        type: 'list/changeNavId',
        payload: { key: id },
      });
    } else if (pathname.match('/front/export')) {
      dispatch({
        type: 'list/changeNavId',
        payload: { key: -1 },
      });
    } else if (pathname.match('/front/dataDemand')) {
      dispatch({
        type: 'list/changeNavId',
        payload: { key: -2 },
      });
    }
  }

  onStart() {
    const { activeDrags } = this.state;
    this.setState({ activeDrags: activeDrags + 2 });
  }

  onStop() {
    const { activeDrags } = this.state;
    this.setState({ activeDrags: activeDrags - 2 });
  }

  toggle = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
  };

  selectKey = ({ key }) => {
    const { dispatch } = this.props;
    if (key === '-1') {
      router.push(`/front/export`);
    } else if (key === '-2') {
      router.push(`/front/dataDemand`);
    } else {
      router.push(`/front/configReport/${key}`);
    }
    dispatch({
      type: 'list/changeNavId',
      payload: { key },
    });
  };

  onOpen = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const {
      children,
      navList,
      navId,
      configPermiss,
      // hasPermiss,
      hasJobDownload,
      hasJobList,
    } = this.props;
    const { dataImport, visible } = this.state;
    return (
      <Layout style={{ minHeight: '100%' }}>
        <Header className="header">
          <div className={styles.logo}>
            <Link to="/">
              <img src={logo} alt="logo" />
            </Link>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[`${navId}`]}
            onClick={this.selectKey}
            style={{
              lineHeight: '64px',
              float: 'left',
              display: 'flex',
              width: '70%',
            }}
          >
            {isAdmin() || configPermiss ? <Menu.Item key="1">数据驾驶舱</Menu.Item> : null}
            {/* {isAdmin() || hasPermiss ? <Menu.Item key="0">自定义报表</Menu.Item> : null} */}
            {isAdmin() || dataImport ? <Menu.Item key="-1">数据导入</Menu.Item> : null}
            {isAdmin() || hasJobDownload || hasJobList ? (
              <Menu.Item key="-2">数据需求</Menu.Item>
            ) : null}
            {navList.map((item, index) => {
              if (index <= 5) {
                return <Menu.Item key={item.id}>{item.name}</Menu.Item>;
              }
              return null;
            })}
            {navList.length <= 5 ? null : (
              <SubMenu
                title={
                  <span className="submenu-title-wrapper">
                    更多
                    <Icon type="caret-down" />
                  </span>
                }
              >
                {navList.map((item, index) => {
                  if (index > 5) {
                    return <Menu.Item key={item.id}>{item.name}</Menu.Item>;
                  }
                  return null;
                })}
              </SubMenu>
            )}
          </Menu>
          <RightContent />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            minHeight: 280,
          }}
        >
          {children}
        </Content>
        <Draggable
          bounds="main"
          onStart={this.handleStart}
          onDrag={this.handleDrag}
          onStop={this.handleStop}
        >
          <div
            style={{
              position: 'fixed',
              right: '2%',
              top: '85%',
              zIndex: '100000',
              background: '#1890FF',
              width: '40px',
              height: '40px',
              textAlign: 'center',
              lineHeight: '40px',
            }}
            size="large"
            type="primary"
          >
            <Icon
              type="customer-service"
              style={{ color: '#fff', fontSize: '18px' }}
              onClick={this.onOpen}
            />
          </div>
        </Draggable>
        <Modal
          visible={visible}
          onCancel={this.onClose}
          footer={false}
          width={350}
          centered
          bodyStyle={{ padding: 0 }}
        >
          <img src={contact} alt="contact" style={{ width: '100%' }} />
        </Modal>
      </Layout>
    );
  }
}

export default FrontLayout;
