import React from 'react';
import { Link } from 'react-router-dom';

export default ({ isMobile }) => {
  if (isMobile) return null;
  return (
    <footer className="footer">
      © 2015-2019 - All rights reserved. Font Bundles Ltd. |{' '}
      <Link to="/license">Our License</Link> |{' '}
      <Link to="/privacypolicy">Privacy Policy</Link> |
    </footer>
  );
};
