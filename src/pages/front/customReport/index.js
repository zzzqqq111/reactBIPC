/**
 * 报表
 */
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';

@connect(({ list }) => ({
  navId: list.navId,
}))
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    const { navId = '' } = this.props;
    router.push(`/front/customReport/${navId}`);
  };

  render() {
    const { children } = this.props;
    return <div>{children}</div>;
  }
}

export default Index;
