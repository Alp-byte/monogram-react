import React, { Component } from 'react';
import AuthForm from '../components/AuthForm';
import { Redirect } from 'react-router-dom';
export class AuthPage extends Component {
  render() {
    const { user } = this.props;
    if (user) return <Redirect to="/" />;
    return (
      <div className="auth-page-wrapper">
        <AuthForm showTitle />
      </div>
    );
  }
}

export default AuthPage;
