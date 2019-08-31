import React, { Component } from 'react';
import Logo from './Logo';
import classNames from 'classnames';

// import SitesOption from './SitesOption';
import { FaAngleDown } from 'react-icons/fa';
import { MdWarning } from 'react-icons/md';
import { withRouter, Link } from 'react-router-dom';
import AuthForm from './AuthForm';
import UserMenu from './UserMenu';
import ModalGallery from '../modals/ModalGallery';
import LayersSidebar from './LayersSidebar';
import MobileTopBar from './MobileTopBar';
import MenuSidebar from './MenuSidebar';
import Badge from './Badge';
import ClickOutside from '../HOC/ClickOutside';
class Header extends Component {
  state = {
    showDropDown: false,
    showAuth: false,
    showUserMenu: false
  };
  handleMouseEnter = () => {
    if (!this.state.showDropDown) {
      this.setState({
        showDropDown: true
      });
    }
  };
  handleMouseLeave = () => {
    if (this.state.showDropDown) {
      this.setState({
        showDropDown: false
      });
    }
  };

  toggleAuthMenu = () => {
    this.setState(({ showAuth }) => ({
      showAuth: !showAuth
    }));
  };

  toggleUserMenu = () => {
    this.setState(({ showUserMenu }) => ({
      showUserMenu: !showUserMenu
    }));
  };

  renderHeaderMobile = () => {
    const { setActiveSelector, activeSelector, user, logout } = this.props;
    const { pathname } = this.props.location;

    const isBuilderPage = pathname === '/';

    return (
      <React.Fragment>
        <MenuSidebar
          setActiveSelector={setActiveSelector}
          isOpen={activeSelector === 'menu-sidebar'}
          user={user}
          logout={logout}
        />
        <LayersSidebar
          setActiveSelector={setActiveSelector}
          activeSelector={activeSelector}
          onRemoveActive={this.props.removeActive}
          onRenameLayer={this.props.renamelayer}
          onChangeDisableEdit={this.props.changeDisableEdit}
          onChangeLayerOrder={this.props.changeLayerOrder}
          onLayerDelete={this.props.onLayerDelete}
          onSetActive={this.props.setActive}
          onCreateLayer={this.props.createLayer}
        />
        <MobileTopBar
          setActiveSelector={setActiveSelector}
          activeSelector={activeSelector}
          isBuilderPage={isBuilderPage}
        />
      </React.Fragment>
    );
  };
  render() {
    const {
      isMobile,
      profileFetchFinished,
      user,
      clearError,
      logout
    } = this.props;
    if (isMobile) return this.renderHeaderMobile();

    return (
      <div className="header-section">
        <div className="header">
          <Logo />

          <div className="header-right">
            {/* <ModalGallery /> */}
            <Link to="/gallery/?tab=public" className="header-item-label">
              Gallery <Badge text="NEW" />
            </Link>
            {profileFetchFinished && !user && (
              <ClickOutside
                onClickOutside={() => {
                  this.setState({
                    showAuth: false
                  });
                  clearError();
                }}
              >
                <div className="header-auth">
                  <span
                    onClick={this.toggleAuthMenu}
                    className={classNames({
                      'header-item-label': true,
                      'active-link': this.state.showAuth
                    })}
                  >
                    Sign Up / Log In
                  </span>

                  {this.state.showAuth && <AuthForm showTitle />}
                </div>
              </ClickOutside>
            )}

            {profileFetchFinished && user && (
              <ClickOutside
                onClickOutside={() => {
                  this.setState({
                    showUserMenu: false
                  });
                }}
              >
                <div className="header-user-menu">
                  <span
                    onClick={this.toggleUserMenu}
                    className={classNames({
                      'header-item-label': true,
                      'active-link': this.state.showUserMenu
                    })}
                  >
                    {user.email}
                    {!user.emailConfirmed && (
                      <MdWarning className="user-warning-icon" />
                    )}
                  </span>

                  {this.state.showUserMenu && (
                    <UserMenu
                      emailConfirmed={user.emailConfirmed}
                      logout={logout}
                    />
                  )}
                </div>
              </ClickOutside>
            )}

            <div
              className="dropdown-menu-custom-wrapper"
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
            >
              <div className="dropdown-menu-custom-btn">
                Our Sites <FaAngleDown />
              </div>

              {this.state.showDropDown && (
                <ul className="dropdown-menu-custom">
                  <li className="sn_logos dropdown-divider">
                    <h5> Our Marketplaces </h5>
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
                      <small> All your Font Needs </small>
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
                      <small> All your Design Needs </small>
                    </a>
                    <a
                      href="https://themeplanet.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="https://fbcd.co/images/logos/_theme-planet-logo/colour.svg"
                        alt="Theme Planet Logo"
                      />
                      <small> Website Themes and More </small>
                    </a>
                  </li>
                  <li className="divider" />
                  <li>
                    <a
                      href="https://fontbundles.net/blog"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <strong> Blog </strong>
                      <small>
                        {' '}
                        Unleash your creativity with the latest from the Font
                        Bundles Blog{' '}
                      </small>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://designbundles.net/design-school"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <strong> Design School </strong>
                      <small>
                        {' '}
                        Learn new skills and read our latest tutorials{' '}
                      </small>
                    </a>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(Header);
