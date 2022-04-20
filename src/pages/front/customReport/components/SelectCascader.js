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

@connect(({ customReport, global }) => ({
  paramsTransaction: customReport.paramsTransaction,
  districts: global.districts, // 地区
}))
class SelectCascader extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {};
  }

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'global/fetchDistrict',
    // });
  }

  onChange = value => {
    const { dataIndex, dispatch } = this.props;
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
    const { placeholder, districts = [], paramsTransaction, dataIndex } = this.props;
    return (
      <React.Fragment>
        <Cascader
          style={{ width: 135 }}
          placeholder={`请选择${placeholder}`}
          onChange={this.onChange}
          value={paramsTransaction[dataIndex]}
          options={districts}
          showSearch={{ filter }}
          changeOnSelect
        />
      </React.Fragment>
    );
  }
}

export default SelectCascader;
