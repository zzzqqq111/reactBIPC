import React, { Component } from 'react';
import { connect } from 'dva';
import MenuLayout from '../menuLayout';
import { isAdmin } from '@/utils/role';

@connect(({ list }) => ({
  hasJobList: list.hasJobList,
  hasJobDownload: list.hasJobDownload,
}))
class _layout extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { children, hasJobList, hasJobDownload } = this.props;
    const options = [];
    if (isAdmin() || hasJobList) {
      options.push({
        name: '任务列表',
        key: '/front/dataDemand',
      });
    }
    if (isAdmin() || hasJobDownload) {
      options.push({
        name: '数据下载',
        key: '/front/dataDemand/historyList',
        disable: !!hasJobDownload,
      });
    }
    return (
      <MenuLayout options={options} {...this.props}>
        {children}
      </MenuLayout>
    );
  }
}
export default _layout;
