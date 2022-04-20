import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> {formatMessage({ id: 'layout.copyright' })}
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
