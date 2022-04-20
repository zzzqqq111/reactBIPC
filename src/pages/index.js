/**
 * descption: '// 根路由重定向 参考https://umijs.org/zh/guide/router.html#%E9%80%9A%E8%BF%87%E6%B3%A8%E9%87%8A%E6%89%A9%E5%B1%95%E8%B7%AF%E7%94%B1'
 * title: Index Page
 */
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { getToken } from '@/utils/authority';

@connect()
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    const token = getToken();
    if (token && token !== 'undefined') {
      router.push(`/my/center`);
    } else {
      router.push(`/user/login`);
    }
  };

  render() {
    const { children } = this.props;
    return <div>{children}</div>;
  }
}

export default Index;
