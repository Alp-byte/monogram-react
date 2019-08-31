import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowAltCircleLeft } from 'react-icons/fa';

export default function LicensePage({ isMobile }) {
  return (
    <Fragment>
      <Link to="/" className="fixed-arrow">
        <FaArrowAltCircleLeft /> Back
      </Link>

      <div className="privacy-text">
        <p>Monogram Maker License</p>
        <p>
          Monogram Maker allows you to create a Monogram Design by combining
          letters, backgrounds and frames .
        </p>
        <strong>Acceptable Use:</strong>
        <p>By using Monogram Maker you can create:</p>
        <ul>
          <li>Unlimited projects for yourself, family members, and friends</li>
          <li>Projects for commercial use to be sold to customers.</li>
        </ul>

        <strong style={{ display: 'block', margin: '10px 0' }}>
          Non-acceptable Use:
        </strong>
        <ul>
          <li>
            Selling or distributing the fonts and designs in their original form
            including giving away for free or as part of a package
          </li>
        </ul>
        <p>
          Disclaimer: Monogram Maker should not be used to create designs which
          include copyright materials or trademarks. Any designs which include
          such material are not covered by this license and we accept no
          liability for damages resulting in their use
        </p>
      </div>
    </Fragment>
  );
}
