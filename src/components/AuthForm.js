import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TiSocialFacebook, TiArrowLeft } from 'react-icons/ti';
import { MdErrorOutline } from 'react-icons/md';
import { FaCheckCircle } from 'react-icons/fa';
import { withRouter, Link } from 'react-router-dom';
import queryString from 'query-string';
import {
  login,
  signup,
  forgot,
  fbCallback,
  clearError
} from '../redux/auth/actions';
import { validateEmail } from '../utils';
import Loader from './Loader';

export class AuthForm extends Component {
  state = {
    currentForm: 'signup',
    form: {
      email: {
        value: '',
        error: null
      },
      name: {
        value: '',
        error: null
      },
      passwordHash: {
        value: '',
        error: null
      },
      passwordConfirm: {
        value: '',
        error: null
      }
    }
  };

  generalErrorBlock = () => {
    const { error } = this.props;
    if (!error) return null;
    return (
      <div className="auth-error-block">
        <div className="auth-error-icon">
          <MdErrorOutline />
        </div>
        <div className="auth-error-message">{error.message}</div>
      </div>
    );
  };
  inputChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    let error = null;

    this.setState({
      form: {
        ...this.state.form,
        [name]: {
          value,
          error
        }
      }
    });
  };

  checkErrors = formType => {
    const { form } = this.state;

    let hasError = false;
    const formCopy = { ...form };
    const emailValue = formCopy.email.value;
    switch (formType) {
      case 'signup': {
        // VALIDATE EMAIL

        if (!validateEmail(emailValue)) {
          formCopy.email.error = 'Wrong Email';
          hasError = true;
        }
        if (!emailValue) {
          formCopy.email.error = '* Required';
          hasError = true;
        }
        // VALIDATE NAME
        if (!formCopy.name.value) {
          formCopy.name.error = '* Required';
          hasError = true;
        }
        // VALIDATE PASSWORD
        const passwordValue = formCopy.passwordHash.value;

        if (passwordValue.length < 6) {
          formCopy.passwordHash.error = 'Min. 6 characters';
          hasError = true;
        }
        if (!passwordValue) {
          formCopy.passwordHash.error = '* Required';
          hasError = true;
        }
        // VALIDATE CONFIRM PASSWORD
        const passwordConfirmValue = formCopy.passwordConfirm.value;

        if (!passwordConfirmValue) {
          formCopy.passwordConfirm.error = '* Required';
          hasError = true;
        }
        if (passwordConfirmValue !== passwordValue) {
          formCopy.passwordConfirm.error =
            "Password confirmation doesn't match Password";
          hasError = true;
        }
        const nameValue = formCopy.name.value;
        if (!nameValue) {
          formCopy.name.error = '* Required';
          hasError = true;
        }
        break;
      }

      case 'signin': {
        // VALIDATE EMAIL
        if (!validateEmail(emailValue)) {
          formCopy.email.error = 'Wrong Email';
          hasError = true;
        }
        if (!emailValue) {
          formCopy.email.error = '* Required';
          hasError = true;
        }

        // VALIDATE PASSWORD
        const passwordValue = formCopy.passwordHash.value;

        if (passwordValue.length < 6) {
          formCopy.passwordHash.error = 'Min. 6 characters';
          hasError = true;
        }
        if (!passwordValue) {
          formCopy.passwordHash.error = '* Required';
          hasError = true;
        }

        break;
      }
      case 'forgot': {
        // VALIDATE EMAIL
        if (!validateEmail(emailValue)) {
          formCopy.email.error = 'Wrong Email';
          hasError = true;
        }
        if (!emailValue) {
          formCopy.email.error = '* Required';
          hasError = true;
        }
        break;
      }
      case 'reset': {
        // VALIDATE PASSWORD
        const passwordValue = formCopy.passwordHash.value;

        if (passwordValue.length < 6) {
          formCopy.passwordHash.error = 'Min. 6 characters';
          hasError = true;
        }
        if (!passwordValue) {
          formCopy.passwordHash.error = '* Required';
          hasError = true;
        }
        // VALIDATE CONFIRM PASSWORD
        const passwordConfirmValue = formCopy.passwordConfirm.value;

        if (passwordConfirmValue !== passwordValue) {
          formCopy.passwordConfirm.error =
            "Password confirmation doesn't match Password";
          hasError = true;
        }

        break;
      }
      default:
        break;
    }

    this.setState({
      form: formCopy
    });
    return hasError;
  };
  submitLogin = e => {
    e.preventDefault();
    const { login } = this.props;
    const { form } = this.state;

    if (!this.checkErrors('signin')) {
      login({
        email: form.email.value,
        passwordHash: form.passwordHash.value
      });
    }
  };

  submitReset = e => {
    e.preventDefault();
    const { resetPassword, location } = this.props;
    const { form } = this.state;

    if (!this.checkErrors('reset')) {
      resetPassword(
        {
          password: form.passwordHash.value
        },
        queryString.parse(location.search).token
      );
    }
  };

  submitSignup = e => {
    e.preventDefault();
    const { signup } = this.props;
    const { form } = this.state;

    if (!this.checkErrors('signup')) {
      signup({
        email: form.email.value,
        passwordHash: form.passwordHash.value,
        name: form.name.value
      });
    }
  };

  submitForgot = e => {
    e.preventDefault();
    const { forgot } = this.props;
    const { form } = this.state;

    if (!this.checkErrors('forgot')) {
      forgot({
        email: form.email.value
      });
    }
  };

  renderSignupForm = () => {
    const { fbCallback, showTitle } = this.props;
    return (
      <div className="form-signup">
        {showTitle && <div className="form-title">Sign Up</div>}

        <button
          className="fb-button"
          onClick={() => {
            var x = window.screen.width / 2 - 700 / 2;
            var y = window.screen.height / 2 - 450 / 2;

            window.open(
              '/monogram/api/auth/facebook',
              '_blank',
              'height=485,width=700,left=' + x + ',top=' + y
            );

            window.successCallback = user => {
              fbCallback(user);
              window.successCallback = null;
            };
          }}
        >
          <TiSocialFacebook className="fb-icon" />

          <span>Login with Facebook</span>
        </button>
        <div className="auth-separator">
          <span>or</span>
        </div>

        <form onSubmit={this.submitSignup}>
          <label className="label-helper">Email Address:</label>
          <div className="InputAdd">
            <div className="InputAddOn">
              <input
                onInput={this.inputChange}
                className="InputAddOn-field"
                type="text"
                placeholder="Your Email"
                name="email"
                maxLength={44}
              />
            </div>
            <span className="auth-form-error">
              {this.state.form['email'].error}
            </span>
          </div>
          <label className="label-helper">Your Name:</label>
          <div className="InputAdd">
            <div className="InputAddOn">
              <input
                onInput={this.inputChange}
                className="InputAddOn-field"
                type="text"
                placeholder="Your Name"
                name="name"
                maxLength={24}
              />
            </div>
            <span className="auth-form-error">
              {this.state.form['name'].error}
            </span>
          </div>
          <label className="label-helper">Password:</label>
          <div className="InputAdd">
            <div className="InputAddOn">
              <input
                onInput={this.inputChange}
                className="InputAddOn-field"
                type="password"
                placeholder="Password"
                name="passwordHash"
                maxLength={24}
              />
            </div>
            <span className="auth-form-error">
              {this.state.form['passwordHash'].error}
            </span>
          </div>
          <label className="label-helper">Confirm Password:</label>
          <div className="InputAdd">
            <div className="InputAddOn">
              <input
                onInput={this.inputChange}
                className="InputAddOn-field"
                type="password"
                placeholder="Confirm Password"
                name="passwordConfirm"
                maxLength={24}
              />
            </div>
            <span className="auth-form-error">
              {this.state.form['passwordConfirm'].error}
            </span>
          </div>
          <button className="button button_auth">Sign Up</button>
        </form>

        {this.generalErrorBlock()}
        <div
          onClick={() => {
            this.setState({
              currentForm: 'signin',
              form: {
                email: {
                  value: '',
                  error: null
                },
                name: {
                  value: '',
                  error: null
                },
                passwordHash: {
                  value: '',
                  error: null
                },
                passwordConfirm: {
                  value: '',
                  error: null
                }
              }
            });
            this.props.clearError();
          }}
          className="auth-switch"
        >
          I Already Have An Account
        </div>
      </div>
    );
  };
  renderSigninForm = () => {
    const { fbCallback, showTitle } = this.props;
    return (
      <div className="form-signin">
        {showTitle && <div className="form-title">Log In</div>}
        <button
          className="fb-button"
          onClick={() => {
            var x = window.screen.width / 2 - 700 / 2;
            var y = window.screen.height / 2 - 450 / 2;

            window.open(
              '/monogram/api/auth/facebook',
              '_blank',
              'height=485,width=700,left=' + x + ',top=' + y
            );

            window.successCallback = user => {
              fbCallback(user);
              window.successCallback = null;
            };
          }}
        >
          <TiSocialFacebook className="fb-icon" />
          <span>Login with Facebook</span>
        </button>
        <div className="auth-separator">
          <span>or</span>
        </div>
        <form onSubmit={this.submitLogin}>
          <label className="label-helper">Email Address:</label>
          <div className="InputAdd">
            <div className="InputAddOn">
              <input
                onInput={this.inputChange}
                className="InputAddOn-field"
                type="text"
                placeholder="Your Email"
                name="email"
                maxLength={44}
              />
            </div>
            <span className="auth-form-error">
              {this.state.form['email'].error}
            </span>
          </div>
          <label className="label-helper">Password:</label>
          <div className="InputAdd">
            <div className="InputAddOn">
              <input
                onInput={this.inputChange}
                className="InputAddOn-field"
                type="password"
                placeholder="Password"
                name="passwordHash"
                maxLength={24}
              />
            </div>{' '}
            <span className="auth-form-error">
              {this.state.form['passwordHash'].error}
            </span>
            <div
              onClick={() => {
                this.setState({
                  currentForm: 'forgot',
                  form: {
                    email: {
                      value: '',
                      error: null
                    },
                    name: {
                      value: '',
                      error: null
                    },
                    passwordHash: {
                      value: '',
                      error: null
                    },
                    passwordConfirm: {
                      value: '',
                      error: null
                    }
                  }
                });
                this.props.clearError();
              }}
              className="auth-switch"
            >
              Forgot Password
            </div>
          </div>
          <button className="button button_auth">Log In</button>
        </form>

        {this.generalErrorBlock()}

        <div
          onClick={() => {
            this.setState({
              currentForm: 'signup',
              form: {
                email: {
                  value: '',
                  error: null
                },
                name: {
                  value: '',
                  error: null
                },
                passwordHash: {
                  value: '',
                  error: null
                },
                passwordConfirm: {
                  value: '',
                  error: null
                }
              }
            });
            this.props.clearError();
          }}
          className="auth-switch"
        >
          <TiArrowLeft /> Back To Sign Up
        </div>
      </div>
    );
  };

  renderForgotForm = () => {
    const { forgotLinkSent, showTitle } = this.props;
    if (forgotLinkSent)
      return (
        <div className="auth-success-message">
          <FaCheckCircle />
          <span>
            <strong>Success!</strong> Check your Email for password reset link.
          </span>
        </div>
      );
    return (
      <div className="form-signin">
        {showTitle && <div className="form-title">Password Restore</div>}

        <form onSubmit={this.submitForgot}>
          <label className="label-helper">Email Address:</label>
          <div className="InputAdd">
            <div className="InputAddOn">
              <input
                onInput={this.inputChange}
                className="InputAddOn-field"
                type="text"
                placeholder="Your Email"
                name="email"
                maxLength={44}
              />
            </div>
            <span className="auth-form-error">
              {this.state.form['email'].error}
            </span>
          </div>

          <button className="button button_auth">Send</button>
        </form>

        {this.generalErrorBlock()}

        <div
          onClick={() => {
            this.setState({
              currentForm: 'signin',
              form: {
                email: {
                  value: '',
                  error: null
                },
                name: {
                  value: '',
                  error: null
                },
                passwordHash: {
                  value: '',
                  error: null
                },
                passwordConfirm: {
                  value: '',
                  error: null
                }
              }
            });
            this.props.clearError();
          }}
          className="auth-switch"
        >
          <TiArrowLeft /> Back To Log In
        </div>
      </div>
    );
  };

  renderResetForm = () => {
    return (
      <div className="form-signin">
        <div className="form-title">Create New Password</div>

        <form onSubmit={this.submitReset}>
          <div className="InputAdd">
            <div className="InputAddOn">
              <input
                onInput={this.inputChange}
                className="InputAddOn-field"
                type="password"
                placeholder="Password"
                name="passwordHash"
                maxLength={24}
              />
            </div>
            <span className="auth-form-error">
              {this.state.form['passwordHash'].error}
            </span>
          </div>
          <div className="InputAdd">
            <div className="InputAddOn">
              <input
                onInput={this.inputChange}
                className="InputAddOn-field"
                type="password"
                placeholder="Confirm Password"
                name="passwordConfirm"
                maxLength={24}
              />
            </div>
            <span className="auth-form-error">
              {this.state.form['passwordConfirm'].error}
            </span>
          </div>

          <button className="button button_auth">Send</button>
        </form>

        {this.generalErrorBlock()}
      </div>
    );
  };
  render() {
    const { currentForm } = this.state;
    const { loading, onlyResetPassword, passwordResetSuccess } = this.props;
    if (onlyResetPassword) {
      return (
        <div className="auth-form-wrapper">
          {loading && (
            <div
              className="loader-wrapper"
              style={{
                right: 0,
                left: 0,
                top: 0,
                bottom: 0,
                position: 'absolute',
                zIndex: 300,
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.56)'
              }}
            >
              <Loader style={{ margin: 'auto' }} size="lg" />
            </div>
          )}
          {passwordResetSuccess ? (
            <div className="auth-success-message">
              <FaCheckCircle />
              <span>
                <strong>Success!</strong> Your Password Has Been Changed. You
                are now logged in
              </span>
              <Link to="/"> Return To Main Page</Link>
            </div>
          ) : (
            this.renderResetForm()
          )}
        </div>
      );
    }
    return (
      <div className="auth-form-wrapper">
        {loading && (
          <div
            className="loader-wrapper"
            style={{
              right: 0,
              left: 0,
              top: 0,
              bottom: 0,
              position: 'absolute',
              zIndex: 300,
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.56)'
            }}
          >
            <Loader style={{ margin: 'auto' }} size="lg" />
          </div>
        )}
        {currentForm === 'signup' && this.renderSignupForm()}
        {currentForm === 'signin' && this.renderSigninForm()}
        {currentForm === 'forgot' && this.renderForgotForm()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  profileFetchFinished: state.auth.profileFetchFinished,
  loading: state.auth.loading,
  error: state.auth.error,
  forgotLinkSent: state.auth.forgotLinkSent,
  passwordResetSuccess: state.auth.passwordResetSuccess
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      login,
      signup,
      forgot,
      fbCallback,
      clearError
    },
    dispatch
  );

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AuthForm)
);
