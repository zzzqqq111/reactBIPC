import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Menu, BackTop } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../components/style.less';
import { getPageQuery } from '@/utils/utils';

const { SubMenu, Item } = Menu;

const toItem = arr => {
  const items = [];
  arr.forEach(item => {
    if (!item.subMenus) {
      items.push(<Item key={item.title}>{item.title}</Item>);
    } else {
      items.push(
        <SubMenu key={item.title} title={item.title}>
          {toItem(item.subMenus)}
        </SubMenu>
      );
    }
  });
  return items;
};

@connect(({ user, menu }) => ({
  menus: menu.menus,
  currentUser: user.currentUser,
}))
class MenuLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'inline',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/getMenus',
      payload: {
        father: 'orderDetail',
      },
    });
    dispatch({
      type: 'trade/fetch',
    });
    dispatch({
      type: 'global/fetchDistrict',
    });
    dispatch({
      type: 'global/fetchProduct',
    });
    dispatch({
      type: 'global/fetchTeamtag',
    });
  }

  selectKey = ({ key }) => {
    router.push(`/front/trade?key=${key}`);
    const { dispatch } = this.props;

    dispatch({
      type: 'trade/resetParam',
    });
    dispatch({
      type: 'trade/fetch',
    });
  };

  render() {
    const { children, menus } = this.props;
    const { mode } = this.state;

    return (
      <GridContent>
        <BackTop />
        <div
          className={styles.main}
          ref={ref => {
            this.main = ref;
          }}
        >
          <div className={styles.leftmenu}>
            <Menu
              mode={mode}
              defaultOpenKeys={['交易明细']}
              selectedKeys={[getPageQuery().key || '订货明细']}
              onClick={this.selectKey}
            >
              {toItem(menus)}
            </Menu>
          </div>
          <div className={styles.right}>
            <PageHeaderWrapper style={{ height: '100%' }} title={getPageQuery().key || '订货明细'}>
              {children}
            </PageHeaderWrapper>
          </div>
        </div>
      </GridContent>
    );
  }
}

export default MenuLayout;
