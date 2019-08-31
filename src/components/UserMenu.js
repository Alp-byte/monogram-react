import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../utils';
export class UserMenu extends Component {
  state = {
    error: null,
    success: false
  };
  handleResend = async () => {
    let response;

    this.setState({
      success: false,
      error: null
    });
    try {
      response = await request({
        method: 'GET',
        url: '/auth/confirm-resend'
      });
    } catch (error) {
      this.setState({
        error: error.data.message
      });
    }
    if (response.success) {
      this.setState({
        success: true
      });
    }
  };
  render() {
    const { success, error } = this.state;
    return (
      <div className="user-header-wrapper">
        {!this.props.emailConfirmed && (
          <div className="user-warning-notification">
            <strong>Email Not Verified</strong>
            <span>( Check Email Inbox for Activation Link )</span>
            <div
              onClick={e => {
                this.handleResend();
              }}
              className="button_resend"
            >
              Send Again
            </div>
            {success && (
              <span className="user-warning-notification-success">
                The Email has been sent successfully
              </span>
            )}
            {error && (
              <span className="user-warning-notification-error">{error}</span>
            )}
          </div>
        )}

        <Link className="user-header-link" to="/gallery/?tab=my">
          View My Monograms
        </Link>
        <div className="user-header-link" onClick={this.props.logout}>
          Logout
        </div>
      </div>
    );
  }
}

export default UserMenu;
