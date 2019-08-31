import React from 'react';
import Tooltip from 'rc-tooltip';

export default function CustomToolTip({ children, title, ...rest }) {
  return (
    <Tooltip
      overlay={
        <div>
          <span>{title}</span>
        </div>
      }
      placement='top'
      {...rest}
    >
      {children}
    </Tooltip>
  );
}
