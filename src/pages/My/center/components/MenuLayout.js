import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Menu } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './style.less';

const { Item } = Menu;

@connect(({ user }) => ({
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
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  selectKey = ({ key }) => {
    router.push(`/my/${key}`);
  };

  resize = () => {
    if (!this.main) {
      return;
    }
    requestAnimationFrame(() => {
      let mode = 'inline';
      const { offsetWidth } = this.main;
      if (this.main.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      this.setState({
        mode,
      });
    });
  };

  render() {
    const { children } = this.props;
    const { mode } = this.state;

    return (
      <GridContent>
        <div
          className={styles.main}
          ref={ref => {
            this.main = ref;
          }}
        >
          <div className={styles.leftmenu}>
            <Menu mode={mode} defaultSelectedKeys={['center']} onClick={this.selectKey}>
              <Item key="center">个人中心</Item>
            </Menu>
          </div>
          <div className={styles.right}>{children}</div>
        </div>
      </GridContent>
    );
  }
}

export default MenuLayout;
