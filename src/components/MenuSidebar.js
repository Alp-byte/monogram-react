import React, { Component } from 'react';
import Collapse, { Panel } from 'rc-collapse';
import { FiBarChart2, FiChevronDown } from 'react-icons/fi';
import { IoIosSchool, IoIosGlobe } from 'react-icons/io';
import { GoBook } from 'react-icons/go';
import { Link } from 'react-router-dom';
import { MdCopyright } from 'react-icons/md';
import { FaShieldAlt, FaImages, FaUserAlt } from 'react-icons/fa';
import MobileSidebar from './MobileSidebar';
import Badge from './Badge';

export default class MenuSidebar extends Component {
  render() {
    const header = (
      <div className="my-collapse-header">
        <IoIosGlobe className="topbar-icon" />
        <span>Our Site</span>
      </div>
    );

    const { user, logout } = this.props;
    return (
      <MobileSidebar
        onStateChange={state => {
          if (!state.isOpen) {
            this.props.setActiveSelector(null);
          }
        }}
        closeSidebar={() => this.props.setActiveSelector(null)}
        isOpen={this.props.isOpen}
        title={
          <React.Fragment>
            <FiBarChart2 className="topbar-icon topbar-icon__menu" />
            <span>Menu</span>
          </React.Fragment>
        }
        width={'80%'}
        pageWrapId={'page-wrap'}
        customCrossIcon={false}
      >
        <section className="sidebar-menu">
          <ul>
            <li>
              <Link
                to="/gallery/?tab=public"
                onClick={() => this.props.setActiveSelector(null)}
              >
                <FaImages className="topbar-icon" />
                <span>Gallery</span>
                <Badge text="NEW" />
              </Link>
            </li>
            {/* <li>
              <MdHelpOutline className="topbar-icon" />
              <span>Help</span>
            </li> */}
            <li>
              <a
                href="https://fontbundles.net/blog"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GoBook className="topbar-icon" />
                <span>Blog</span>
              </a>
            </li>
            <li>
              <a
                href="https://designbundles.net/design-school"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoIosSchool className="topbar-icon" />
                <span>Design School</span>
              </a>
            </li>
            <li>
              <Link
                to="/license"
                onClick={() => this.props.setActiveSelector(null)}
              >
                <MdCopyright className="topbar-icon" />
                <span>Our License</span>
              </Link>
            </li>
            <li>
              <Link
                to="/privacypolicy"
                onClick={() => this.props.setActiveSelector(null)}
              >
                <FaShieldAlt className="topbar-icon" />
                <span>Privacy Policy</span>
              </Link>
            </li>

            <Collapse
              expandIcon={({ isActive }) => {
                return (
                  <FiChevronDown
                    style={{
                      transition: 'transform .2s',
                      transform: `rotate(${isActive ? 0 : 90}deg)`
                    }}
                    className="topbar-icon"
                  />
                );
              }}
            >
              <Panel header={header} key="1">
                <div className="sites-list">
                  <a
                    href="https://fontbundles.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="https://fbcd.co/images/logos/_font-bundles-logo/redblack.svg"
                      alt="Font Bundles Logo"
                      className="fb-site-selector"
                    />
                  </a>
                  <a
                    href="https://designbundles.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="https://fbcd.co/images/logos/_design-bundles-logo/blueblack.svg"
                      alt="Design Bundles Logo"
                    />
                  </a>
                </div>
              </Panel>
            </Collapse>
            {user ? (
              <Collapse
                expandIcon={({ isActive }) => {
                  return (
                    <FiChevronDown
                      style={{
                        transition: 'transform .2s',
                        transform: `rotate(${isActive ? 0 : 90}deg)`
                      }}
                      className="topbar-icon"
                    />
                  );
                }}
              >
                <Panel
                  header={
                    <div className="user-collapse-header">
                      <FaUserAlt className="topbar-icon" />
                      <span>{user.email}</span>
                    </div>
                  }
                  key="1"
                >
                  <div className="user-menu-list">
                    <Link
                      to="/gallery?tab=my"
                      onClick={() => this.props.setActiveSelector(null)}
                    >
                      <span>View My Monograms</span>
                    </Link>
                    <Link
                      to="/"
                      onClick={() => {
                        this.props.setActiveSelector(null);
                        logout();
                      }}
                    >
                      <span>Logout</span>
                    </Link>
                  </div>
                </Panel>
              </Collapse>
            ) : (
              <li>
                <Link
                  to="/auth"
                  onClick={() => this.props.setActiveSelector(null)}
                >
                  <FaUserAlt className="topbar-icon" />
                  <span>Sign Up / Log In</span>
                </Link>
              </li>
            )}
          </ul>
        </section>
      </MobileSidebar>
    );
  }
}
