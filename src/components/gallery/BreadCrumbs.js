import React from 'react';
import { Link } from 'react-router-dom';
function BreadCrumbs({ path, pathTitle }) {
  return (
    <div className="monogram-breadcrumbs">
      <Link className="monogram-breadcrumbs-item" to="/gallery/?tab=public">
        Gallery
      </Link>{' '}
      <div className="monogram-breadcrumbs-separator">></div>
      <Link className="monogram-breadcrumbs-item" to={path}>
        {pathTitle}
      </Link>
    </div>
  );
}

export default BreadCrumbs;
