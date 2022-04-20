import React from 'react';
import MenuLayout from './components/MenuLayout';
import FrontLayout from '@/layouts/FrontLayout';

export default props => {
  const { children, ...restProps } = props;

  return (
    <FrontLayout {...restProps}>
      <MenuLayout>{children}</MenuLayout>
    </FrontLayout>
  );
};
