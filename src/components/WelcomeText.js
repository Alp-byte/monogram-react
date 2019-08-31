import React from 'react';
import { FaCheck } from 'react-icons/fa';

export default function WelcomeText({ isMobile }) {
  if (isMobile) return null;
  return (
    <div
      style={{
        color: '#afb2b3',
        height: 10,
        textAlign: 'center'
      }}
    >
      <div>
        <h1
          style={{
            fontSize: 18,
            fontWeight: 600,
            marginTop: 50
          }}
        >
          Monogram Maker
        </h1>
        Welcome to <strong>monogram maker</strong> - the free monogram making
        online tool! You can use our quick and easy tool to create amazing
        monograms. Simply type your letters into the monogram generator (you can
        pick 1,2,3,4,5 letters or more), pick a monogram font, a monogram frame
        and our quick and easy online tool will let you create your perfect
        design.{' '}
      </div>
      <div style={{ marginTop: 20 }}>
        <div style={{ marginBottom: 10 }}>
          Struggling for ideas? Monogram Maker is perfect to create design
          projects such as:
        </div>

        <ul className="feature-list">
          <li>
            <FaCheck /> Wedding Monograms
          </li>
          <li>
            <FaCheck /> Monogram Logos
          </li>
          <li>
            <FaCheck /> Split Monograms
          </li>
          <li>
            <FaCheck /> Circle Monograms
          </li>
          <li>
            <FaCheck /> Clothing Monogram Designs
          </li>
          <li>
            <FaCheck /> Cursive Monograms
          </li>
        </ul>
        <i style={{ display: 'block' }}>...and many, many more!</i>
      </div>
      <p style={{ marginTop: 10, marginBottom: 10 }}>
        Fancy getting your hands on even more Monogram Designs? Try visiting{' '}
        <a
          href="https://designbundles.net/craft/monograms"
          target="_blank"
          rel="noopener noreferrer"
        >
          Design Bundles
        </a>{' '}
        today and shop over 1000 monogram fonts and frames.{' '}
      </p>
    </div>
  );
}
