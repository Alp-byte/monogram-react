import React from 'react';

export default function Loader(props) {
  return (
    <div
      className={`spinner-${props.size || 'sm'} spinner-1-${props.size ||
        'sm'}`}
      {...props}
    />
  );
}
