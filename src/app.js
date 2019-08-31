import React from 'react';
import 'normalize.css';
import './scss/index.scss';

import 'rodal/lib/rodal.css';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

import Header from './components/Header';
import Footer from './components/Footer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import LicensePage from './pages/LicensePage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ScrollToTop from './HOC/ScrollToTop';
import Builder from './pages/Builder';
import Gallery from './pages/Gallery';
import AuthPage from './pages/AuthPage';
import GalleryMonogramItemPage from './pages/GalleryMonogramItemPage';
import WelcomeText from './components/WelcomeText';
import {
  fetchProfile,
  clearError,
  logout,
  resetPassword
} from './redux/auth/actions';

import {
  setActive,
  removeActive,
  changeLayerOrder,
  createLayer,
  renamelayer,
  changeDisableEdit,
  onLayerDelete
} from './redux/builder';
class Root extends React.Component {
  state = {
    activeSelector: 'text'
  };

  setActiveSelector = selectorName => {
    const { activeSelector } = this.state;

    this.setState({
      activeSelector: selectorName === activeSelector ? null : selectorName
    });
  };
  componentWillMount() {
    this.isMobile =
      window.screen.availWidth < 750 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    if (this.isMobile && process.env.NODE_ENV === 'development') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/eruda';
      script.setAttribute('defer', 'defer');
      document.getElementsByTagName('head')[0].appendChild(script);
    }
  }
  componentDidMount() {
    const { profileFetchFinished, fetchProfile } = this.props;
    if (process.env.NODE_ENV === 'development' && this.isMobile) {
      setTimeout(() => {
        // eslint-disable-next-line
        if (eruda) {
          // eslint-disable-next-line
          eruda.init();
        }
      }, 2000);
    }
    if (!profileFetchFinished) {
      fetchProfile();
    }
  }

  render() {
    const {
      user,
      profileFetchFinished,
      clearError,
      logout,
      resetPassword
    } = this.props;

    const { activeSelector } = this.state;

    return (
      <BrowserRouter>
        <ScrollToTop>
          <div
            id="app"
            className={classNames({
              app: true,
              mobile: this.isMobile
            })}
          >
            <Header
              isMobile={this.isMobile}
              user={user}
              clearError={clearError}
              logout={logout}
              profileFetchFinished={profileFetchFinished}
              setActiveSelector={this.setActiveSelector}
              activeSelector={activeSelector}
              //FOR LAYER SIDEBAR

              // For Layers Sidebar

              setActive={this.props.setActive}
              removeActive={this.props.removeActive}
              onLayerDelete={this.props.onLayerDelete}
              renamelayer={this.props.renamelayer}
              changeDisableEdit={this.props.changeDisableEdit}
              changeLayerOrder={this.props.changeLayerOrder}
              createLayer={this.props.createLayer}
            />

            <Switch>
              <Route
                path="/license"
                render={() => {
                  return <LicensePage isMobile={this.isMobile} />;
                }}
              />
              <Route
                path="/auth"
                render={() => {
                  return <AuthPage user={user} />;
                }}
              />
              <Route
                path="/privacypolicy"
                render={() => {
                  return <PrivacyPolicy isMobile={this.isMobile} />;
                }}
              />
              <Route
                path="/reset-password"
                render={() => {
                  return (
                    <ResetPasswordPage
                      resetPassword={resetPassword}
                      isMobile={this.isMobile}
                    />
                  );
                }}
              />
              <Route
                path="/gallery"
                render={() => {
                  return <Gallery isMobile={this.isMobile} />;
                }}
              />
              <Route
                path="/g/:monogramId/:monogramSlug"
                render={() => {
                  return <GalleryMonogramItemPage isMobile={this.isMobile} />;
                }}
              />
              <Route
                path="/g"
                render={() => {
                  return <Gallery isMobile={this.isMobile} />;
                }}
              />

              <Route
                render={() => {
                  return (
                    <Builder
                      isMobile={this.isMobile}
                      setActiveSelector={this.setActiveSelector}
                      activeSelector={activeSelector}
                    />
                  );
                }}
              />
            </Switch>

            <Footer isMobile={this.isMobile} />
            <WelcomeText isMobile={this.isMobile} />
          </div>
        </ScrollToTop>
      </BrowserRouter>
    );
  }
}
const mapStateToProps = state => ({
  user: state.auth.user,
  profileFetchFinished: state.auth.profileFetchFinished,
  loading: state.auth.loading
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchProfile,
      clearError,
      logout,
      resetPassword,
      // For Layers Sidebar

      setActive,

      removeActive,
      onLayerDelete,

      renamelayer,
      changeDisableEdit,
      changeLayerOrder,
      createLayer
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
