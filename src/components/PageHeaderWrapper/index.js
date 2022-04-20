import React from 'react';
import { FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import { connect } from 'dva';
import PageHeader from '@/components/PageHeader';
import GridContent from './GridContent';
import styles from './index.less';
import MenuContext from '@/layouts/MenuContext';

const PageHeaderWrapper = ({ children, contentWidth, wrapperClassName, top, ...restProps }) => (
  <div className={wrapperClassName ? `${styles.main} ${wrapperClassName}` : styles.main}>
    {top}
    <MenuContext.Consumer>
      {value => (
        <PageHeader
          wide={contentWidth === 'Fixed'}
          // todo 首页没做-暂时隐藏
          home={<FormattedMessage id="menu.home" defaultMessage="Home" />}
          {...value}
          key="pageheader"
          {...restProps}
          linkElement={Link}
          itemRender={item => {
            if (item.locale) {
              return <FormattedMessage id={item.locale} defaultMessage={item.title} />;
            }
            return item.title;
          }}
        />
      )}
    </MenuContext.Consumer>
    {children ? (
      <div className={styles.content}>
        <GridContent>{children}</GridContent>
      </div>
    ) : null}
  </div>
);

export default connect(({ setting }) => ({
  contentWidth: setting.contentWidth,
}))(PageHeaderWrapper);
