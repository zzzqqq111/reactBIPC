import React from 'react';
import MenuLayout from '../menuLayout';

export default props => {
  const { children, ...restProps } = props;
  const options = [
    {
      name: '上传数据',
      key: '/front/export',
    },
    {
      name: '上传记录',
      key: '/front/export/historyList',
    },
  ];
  return (
    <MenuLayout {...restProps} options={options}>
      {children}
    </MenuLayout>
  );
};
