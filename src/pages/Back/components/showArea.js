/* eslint-disable no-unused-expressions */
/**
 *  选择市场或者品牌
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Cascader } from 'antd';

const data = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

@connect()
class ShowArea extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onChange = () => {};

  render() {
    // const { options = [], title = '' } = this.props;
    // const { checkValue } = this.state;

    return <Cascader options={data} onChange={this.onChange} placeholder="Please select" />;
  }
}
export default ShowArea;
