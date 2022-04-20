import React from 'react';
import MenuLayout from './MenuLayout';

export default props => {
  const { children, ...restProps } = props;
  return <MenuLayout {...restProps}>{children}</MenuLayout>;
};
