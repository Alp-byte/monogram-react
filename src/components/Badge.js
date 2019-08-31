import React from 'react';

export default function Badge({ text, ...rest }) {
  return (
    <div className="badge" {...rest}>
      {text}
    </div>
  );
}
