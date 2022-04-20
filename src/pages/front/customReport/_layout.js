import React from 'react';
import MenuLeft from './MenuLeft';

export default props => {
  const { children, ...restProps } = props;
  return <MenuLeft {...restProps}>{children}</MenuLeft>;
};
