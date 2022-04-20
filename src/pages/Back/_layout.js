/**
 * 百e数据 - 后台布局
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Layout, Menu, Icon } from 'antd';
import Link from 'umi/link';
import brand from '@/assets/brand.ico';
import styles from './_layout.less';
import RightContent from '@/components/GlobalHeader/RightContent';
// import { getUserId } from '@/utils/authority';

const { Header, Sider, Content } = Layout;
const { SubMenu, Item, ItemGroup } = Menu;

@connect(({ loading }) => ({
  submitting: loading.effects['login/login'],
}))
class _layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      openKeys: ['_indicator'],
    };
    this.rootSubmenuKeys = [
      '_indicator',
      '_permission',
      '_frontmenu',
      '_lineManage',
      '_apiManage',
      '_tableStructure',
      '_dataExport',
      '_dataDemand',
      '_dataReport',
      '_sendReport',
    ];
  }

  componentDidMount() {
    // const { dispatch } = this.props;
    // const userId = getUserId();
    // dispatch({
    //   type: 'list/getUserId',
    //   payload: userId,
    // });
  }

  toggle = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
  };

  onOpenChange = _openkeys => {
    const { openKeys } = this.state;
    const latestOpenKey = _openkeys.find(key => openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys: _openkeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };

  render() {
    const {
      children,
      location: { pathname },
      // userId,
    } = this.props;
    const { collapsed, openKeys } = this.state;
    return (
      <Layout style={{ minHeight: '100%' }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <Link to="/">
            <div className={styles.logo}>
              <img src={brand} alt="brand" />
              <h1>百e数据后台</h1>
            </div>
          </Link>
          <Menu
            defaultOpenKeys={['_indicator']}
            selectedKeys={[pathname]}
            onOpenChange={this.onOpenChange}
            openKeys={openKeys}
            theme="dark"
            mode="inline"
            onClick={({ key: path }) => {
              router.push(path);
            }}
          >
            <SubMenu
              key="_indicator"
              title={
                <span>
                  <Icon type="home" />
                  <span>指标库</span>
                </span>
              }
            >
              <Item key="/back/indicator">
                <span>指标库列表</span>
              </Item>
              <ItemGroup key="基础配置" title="基础配置">
                <Item key="/back/dbInstance">
                  <span>实例管理</span>
                </Item>
                <Item key="/back/scriptLibrary">
                  <span>脚本库</span>
                </Item>
                <Item key="/back/dataCollection">
                  <span>数据采集</span>
                </Item>
                <Item key="/back/singleDataCollection">
                  <span>单表采集</span>
                </Item>
                <Item key="/back/dataClear">
                  <span>数据清洗</span>
                </Item>
              </ItemGroup>
            </SubMenu>
            <SubMenu
              key="_permission"
              title={
                <span>
                  <Icon type="form" />
                  <span>权限管理</span>
                </span>
              }
            >
              <Item key="/back/userManage">
                <span>用户管理</span>
              </Item>
              <Item key="/back/postManage">
                <span>岗位管理</span>
              </Item>
            </SubMenu>
            <SubMenu
              key="_frontmenu"
              title={
                <span>
                  <Icon type="form" />
                  <span>官方报表</span>
                </span>
              }
            >
              <Item key="/back/menuConfig">
                <span>一级目录</span>
              </Item>
              <Item key="/back/reportListPermiss">
                <span>报表列表</span>
              </Item>
            </SubMenu>
            <SubMenu
              key="_lineManage"
              title={
                <span>
                  <Icon type="form" />
                  <span>线性查询</span>
                </span>
              }
            >
              <Item key="/back/lineManage">
                <span>线性配置</span>
              </Item>
            </SubMenu>
            <SubMenu
              key="_apiManage"
              title={
                <span>
                  <Icon type="form" />
                  <span>API管理</span>
                </span>
              }
            >
              <Item key="/back/apiManage">
                <span>API列表</span>
              </Item>
            </SubMenu>
            <SubMenu
              key="_tableStructure"
              title={
                <span>
                  <Icon type="form" />
                  <span>表结构管理</span>
                </span>
              }
            >
              <Item key="/back/tableStructure">
                <span>表结构管理</span>
              </Item>
              <Item key="/back/tableCategory">
                <span>表分类管理</span>
              </Item>
            </SubMenu>
            <SubMenu
              key="_dataExport"
              title={
                <span>
                  <Icon type="form" />
                  <span>数据导入</span>
                </span>
              }
            >
              <Item key="/back/dataExport">
                <span>模板导入</span>
              </Item>
            </SubMenu>
            <SubMenu
              key="_dataDemand"
              title={
                <span>
                  <Icon type="form" />
                  <span>数据需求</span>
                </span>
              }
            >
              <Item key="/back/dataDemand">
                <span>数据下载</span>
              </Item>
            </SubMenu>
            <SubMenu
              key="_dataReport"
              title={
                <span>
                  <Icon type="form" />
                  <span>数据驾驶舱</span>
                </span>
              }
            >
              <Item key="/back/report">
                <span>数据驾驶舱报表</span>
              </Item>
            </SubMenu>
            {/* <SubMenu
              key="_sendReport"
              title={
                <span>
                  <Icon type="form" />
                  <span>报表定时发送</span>
                </span>
              }
            >
              <Item key="/back/sendReport">
                <span>任务列表</span>
              </Item>
            </SubMenu> */}
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className={styles.trigger}
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <RightContent />
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default _layout;
