import React from 'react';
import HelpModal from '../modals/HelpModal';
export default () => {
  return (
    <div className="instructions">
      <ol className="instructions-list">
        <li className="instructions-list__item instructions-list__item__green">
          Type your letters
        </li>
        <li className="instructions-list__item instructions-list__item__yellow">
          Select a Font & Frame
        </li>
        <li className="instructions-list__item instructions-list__item__blue">
          Color & Adjust
        </li>
        <li className="instructions-list__item instructions-list__item__lavender">
          Export your Monogram!
        </li>
        <li className="instructions-list__item">
          <HelpModal />
        </li>
      </ol>
    </div>
  );
};
