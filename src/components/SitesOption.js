import React from 'react';

export default function SitesOption({ text, image }) {
  return (
    <div className="site-option">
      <img
        className="site-option__image"
        src={require(`../assets/img/${image}`)}
        alt={text}
      />
      <span className="site-option__text">{text}</span>
    </div>
  );
}
