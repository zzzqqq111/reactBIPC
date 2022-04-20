import React from 'react';
import FrontLayout from '@/layouts/FrontLayout';

export default props => {
  const { children, ...restProps } = props;
  return <FrontLayout {...restProps}>{children}</FrontLayout>;
};
