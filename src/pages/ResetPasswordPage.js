import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
export class ResetPasswordPage extends Component {
  render() {
    const { user, resetPassword } = this.props;
    if (user) return <Redirect to="/" />;
    return (
      <div className="reset-password-page-wrapper">
        <AuthForm onlyResetPassword resetPassword={resetPassword} />
      </div>
    );
  }
}

export default ResetPasswordPage;
