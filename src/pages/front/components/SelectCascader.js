/**
 * 地区选择器
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Cascader } from 'antd';

function filter(inputValue, path) {
  // 搜索筛选 - 模糊搜索
  return path.some(option => option.label.indexOf(inputValue) > -1);
}

@connect(({ trade }) => ({
  paramsTransaction: trade.paramsTransaction,
}))
class SelectCascader extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {};
  }

  onChange = value => {
    const { dataIndex, dispatch } = this.props;
    if (dataIndex) {
      dispatch({
        type: 'trade/changeParam',
        payload: {
          [dataIndex]: value,
        },
      });
    }
  };

  render() {
    const { placeholder, options = [], paramsTransaction, dataIndex } = this.props;

    return (
      <React.Fragment>
        <Cascader
          style={{ width: 135 }}
          placeholder={`请选择${placeholder}`}
          onChange={this.onChange}
          value={paramsTransaction[dataIndex]}
          options={options}
          showSearch={{ filter }}
          changeOnSelect
        />
      </React.Fragment>
    );
  }
}

export default SelectCascader;
