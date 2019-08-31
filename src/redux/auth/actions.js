import { request } from '../../utils';
import types from './types';
const GET_PROFILE = types.getProfile;
const LOGIN = types.login;
const SIGNUP = types.signup;
const FORGOT = types.forgot;
const RESET_PASSWORD = types.resetPassword;
const LOGOUT = types.logout;
const RESEND_CONFIRMATION_EMAIL = types.resendConfirmationEmail;
export const fetchProfile = () => {
  return async (dispatch, getState) => {
    dispatch({ type: `${GET_PROFILE}_STARTED` });

    let response;

    try {
      response = await request({
        method: 'GET',
        url: '/auth/fetch-profile'
      });
    } catch (error) {
      return dispatch({ type: `${GET_PROFILE}_FAILURE`, payload: error.data });
    }

    return dispatch({ type: `${GET_PROFILE}_SUCCESS`, payload: response });
  };
};

export const login = form => {
  return async (dispatch, getState) => {
    dispatch({ type: `${LOGIN}_STARTED` });

    let response;

    try {
      response = await request({
        method: 'POST',
        url: '/auth/signin',
        data: form
      });
    } catch (error) {
      return dispatch({ type: `${LOGIN}_FAILURE`, payload: error.data });
    }

    return dispatch({ type: `${LOGIN}_SUCCESS`, payload: response });
  };
};

export const signup = form => {
  return async (dispatch, getState) => {
    dispatch({ type: `${SIGNUP}_STARTED` });

    let response;

    try {
      response = await request({
        method: 'POST',
        url: '/auth/signup',
        data: form
      });
    } catch (error) {
      return dispatch({ type: `${SIGNUP}_FAILURE`, payload: error.data });
    }

    return dispatch({ type: `${SIGNUP}_SUCCESS`, payload: response });
  };
};

export const forgot = form => {
  return async (dispatch, getState) => {
    dispatch({ type: `${FORGOT}_STARTED` });

    let response;

    try {
      response = await request({
        method: 'POST',
        url: '/auth/forgot-password',
        data: form
      });
    } catch (error) {
      return dispatch({ type: `${FORGOT}_FAILURE`, payload: error.data });
    }

    return dispatch({ type: `${FORGOT}_SUCCESS`, payload: response });
  };
};

export const resetPassword = (form, token) => {
  return async (dispatch, getState) => {
    dispatch({ type: `${RESET_PASSWORD}_STARTED` });

    let response;

    try {
      response = await request({
        method: 'POST',
        url: `/auth/reset-password?token=${token}`,
        data: form
      });
    } catch (error) {
      return dispatch({
        type: `${RESET_PASSWORD}_FAILURE`,
        payload: error.data
      });
    }

    return dispatch({ type: `${RESET_PASSWORD}_SUCCESS`, payload: response });
  };
};
export const logout = () => {
  return async (dispatch, getState) => {
    dispatch({ type: `${LOGOUT}_STARTED` });

    let response;

    try {
      response = await request({
        method: 'GET',
        url: '/auth/logout'
      });
    } catch (error) {
      return dispatch({ type: `${LOGOUT}_FAILURE`, payload: error.data });
    }

    return dispatch({ type: `${LOGOUT}_SUCCESS`, payload: response });
  };
};

export const fbCallback = user => ({
  type: `FB_CALLBACK`,
  payload: { user }
});

export const clearError = () => ({
  type: `CLEAR_ERROR`,
  payload: null
});
