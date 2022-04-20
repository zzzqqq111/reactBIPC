/* eslint-disable react/no-string-refs */
/**
 * 单个报表
 */
import React from 'react';
import { connect } from 'dva';
import NewReportView from './newReport';
import CompareReportView from './compareReport/index';

@connect(({ customReport }) => ({
  compareVisiable: customReport.compareVisiable,
}))
class CustomReportView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { compareVisiable } = this.props;
    return (
      <div>
        {!compareVisiable ? (
          <NewReportView {...this.props} />
        ) : (
          <CompareReportView {...this.props} />
        )}
      </div>
    );
  }
}

export default CustomReportView;
