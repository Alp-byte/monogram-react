import React, { Component } from 'react';
import classNames from 'classnames';
import Logo from './Logo';

import { FiLayers, FiBarChart2 } from 'react-icons/fi';
import { MdFilterFrames, MdImage, MdTextFormat } from 'react-icons/md';
export default class MobileTopBar extends Component {
  render() {
    const { activeSelector, setActiveSelector, isBuilderPage } = this.props;
    return (
      <React.Fragment>
        <nav
          className={classNames({
            'mobile-header': true,
            'clean-header': !isBuilderPage
          })}
        >
          <div className="top-section">
            <section
              onClick={() => {
                setActiveSelector('menu-sidebar');
              }}
              className="mobile-header__left_section"
            >
              <FiBarChart2 className="topbar-icon topbar-icon__menu" />
              <span>Menu</span>
            </section>
            <section className="mobile-header__middle_section">
              <Logo isMobile />
            </section>
            {isBuilderPage && (
              <section
                onClick={() => {
                  setActiveSelector('layers');
                }}
                className={classNames({
                  'mobile-header__right_section': true,
                  active: activeSelector === 'layers'
                })}
              >
                <div className="layers-btn">
                  <span>Layers</span>
                  <FiLayers className="topbar-icon topbar-icon__layers" />
                </div>
              </section>
            )}
          </div>
          {isBuilderPage && (
            <div className="bottom-section">
              <ul>
                <li
                  className={classNames({
                    'font-list': true,
                    active: activeSelector === 'text'
                  })}
                  onClick={() => {
                    setActiveSelector('text');
                  }}
                >
                  <MdTextFormat className="topbar-icon topbar-icon__font" />
                  <p>Text</p>
                </li>
                <li
                  className={classNames({
                    'frame-list': true,
                    active: activeSelector === 'frame'
                  })}
                  onClick={() => {
                    setActiveSelector('frame');
                  }}
                >
                  <MdFilterFrames className="topbar-icon topbar-icon__frame" />
                  <p>Frame</p>
                </li>
                <li
                  className={classNames({
                    'bg-list': true,
                    active: activeSelector === 'background'
                  })}
                  onClick={() => {
                    setActiveSelector('background');
                  }}
                >
                  <MdImage className="topbar-icon topbar-icon__background" />
                  <p>Background</p>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </React.Fragment>
    );
  }
}
