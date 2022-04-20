/**
 * 搜索选择器
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Input } from 'antd';

const { Search } = Input;

@connect(({ customReport }) => ({
  paramsTransaction: customReport.paramsTransaction,
}))
class SelectSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onChange = e => {
    const { dataIndex, dispatch } = this.props;
    const { value } = e.target;

    if (dataIndex) {
      dispatch({
        type: 'customReport/changeParam',
        payload: {
          [dataIndex]: value,
        },
      });
    }
  };

  render() {
    const { placeholder, paramsTransaction, dataIndex } = this.props;

    return (
      <React.Fragment>
        <Search
          style={{ width: 166 }}
          placeholder={`请输入${placeholder}`}
          onChange={this.onChange}
          value={paramsTransaction[dataIndex]}
        />
      </React.Fragment>
    );
  }
}

export default SelectSearch;
