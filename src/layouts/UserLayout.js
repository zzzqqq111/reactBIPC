import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import DocumentTitle from 'react-document-title';
import Footer from './Footer';
// import SelectLang from '@/components/SelectLang';
import styles from './UserLayout.less';
import getPageTitle from '@/utils/getPageTitle';
import { title } from '../defaultSettings';

class UserLayout extends Component {
  componentDidMount() {
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority },
    });
  }

  render() {
    const {
      children,
      location: { pathname },
      breadcrumbNameMap,
    } = this.props;
    return (
      <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
        <div className={styles.container}>
          <div className={styles.lang}>{/* <SelectLang /> */}</div>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <span className={styles.title}>{title}</span>
                </Link>
              </div>
              <div className={styles.desc}>数据查询和分析平台</div>
            </div>
            {children}
          </div>
          <Footer />
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(({ menu: menuModel }) => ({
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
}))(UserLayout);
