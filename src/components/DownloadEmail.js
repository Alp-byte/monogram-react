import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegEnvelope } from 'react-icons/fa';
import Loader from './Loader';

export default function DownloadEmail({
  handleEmailSubmit,
  email,
  formError,
  loading,
  saveCache,
  validEmail,
  handleEmailChange
}) {
  return (
    <section className="modal_download_email">
      <FaRegEnvelope />
      <header>Enter Your Email Address to proceed download</header>
      <form onSubmit={handleEmailSubmit}>
        {formError && (
          <label className="label_error" htmlFor="email">
            {!email.length ? 'Please enter the email id' : 'Incorrect Email'}
          </label>
        )}
        <input
          autoCapitalize="off"
          name="email"
          id="email"
          className={formError ? `email_input containError` : `email_input`}
          type="text"
          value={email}
          onChange={handleEmailChange}
          onInput={validEmail}
        />
        <p
          style={{
            fontSize: '11px',

            marginTop: 5
          }}
        >
          By entering your email you agree to our{' '}
          <Link onClick={saveCache} to="/privacypolicy">
            Privacy Policy
          </Link>
        </p>
        <button
          type="submit"
          className="button button_download"
          disabled={loading}
        >
          {loading ? (
            <Loader
              style={{
                margin: 'auto',
                fontSize: '7px'
              }}
              size="sm"
            />
          ) : (
            'Download'
          )}
        </button>
      </form>
    </section>
  );
}
