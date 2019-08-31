import React from 'react';
import { Link } from 'react-router-dom';
export default function Logo({ isMobile }) {
  const mobileLogo = (
    <React.Fragment>
      <img
        src={require('../assets/img/logo.png')}
        className="logo"
        alt="logo"
      />
      <img
        src={require('../assets/img/title.png')}
        className="title"
        alt="title"
      />
    </React.Fragment>
  );
  const desktopLogo = (
    <React.Fragment>
      <img
        src={require('../assets/img/logo.png')}
        className="logo"
        alt="logo"
      />
      <img
        src={require('../assets/img/title.png')}
        className="title"
        alt="title"
      />
    </React.Fragment>
  );
  return <Link to="/">{isMobile ? mobileLogo : desktopLogo}</Link>;
}
