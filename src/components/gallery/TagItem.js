import React from 'react';

export default function TagItem({ tag, onClick, size }) {
  return (
    <span onClick={onClick} style={{ fontSize: size }} key={tag._id}>
      {tag.name}
    </span>
  );
}
