import React from 'react';
import { FaRegThumbsUp, FaAngleUp } from 'react-icons/fa';

export default function GalleryItemUpvotes({ upvotes, active, onUpvote }) {
  return (
    <div className="upvotes">
      <span className={`${active ? 'active upvote-number' : 'upvote-number'}`}>
        {upvotes}
      </span>
      <FaRegThumbsUp
        className={`${active ? 'active' : ''}`}
        onClick={onUpvote}
      />
      {/* <FaAngleUp className={`${active ? 'active' : ''}`} onClick={onUpvote} /> */}
    </div>
  );
}
