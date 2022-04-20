/**
 * 百e数据 - 后台布局
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Menu } from 'antd';
import styles from './components/style.less';

@connect()
class MenuLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      location: { pathname },
      children,
      options = [],
    } = this.props;
    const { openKeys } = this.state;
    return (
      <div className={styles.main}>
        <div className={styles.leftmenu} style={{ width: '250px' }}>
          <Menu
            selectedKeys={[pathname]}
            onOpenChange={this.onOpenChange}
            openKeys={openKeys}
            mode="inline"
            onClick={({ key: path }) => {
              router.push(path);
            }}
          >
            {options.map(item => (
              <Menu.Item key={item.key}>
                <span>{item.name}</span>
              </Menu.Item>
            ))}
          </Menu>
        </div>

        <div className={styles.right} id="body" style={{ width: '80%', marginLeft: '5px' }}>
          {children}
        </div>
      </div>
    );
  }
}

export default MenuLayout;
