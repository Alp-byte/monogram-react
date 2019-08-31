import types from './types';

const GET_PROFILE = types.getProfile;
const LOGIN = types.login;
const SIGNUP = types.signup;
const LOGOUT = types.logout;
const RESET_PASSWORD = types.resetPassword;
const FORGOT = types.forgot;
const initialState = {
  user: null,
  user_ip: null,
  error: null,
  loading: false,
  profileFetchFinished: false,
  forgotLinkSent: false,
  frame_list: [],
  font_list: []
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    case `${GET_PROFILE}_STARTED`:
      return {
        ...state,
        error: null,
        loading: true
      };

    case `${GET_PROFILE}_SUCCESS`: {
      return {
        ...state,
        profileFetchFinished: true,
        user: payload.user || null,
        user_ip: payload.user_ip || null,
        frame_list: payload.frame_list || [],
        font_list: payload.font_list || [],
        loading: false
      };
    }

    case `${GET_PROFILE}_FAILURE`:
      return {
        ...state,
        profileFetchFinished: true,
        loading: false
      };
    case `${SIGNUP}_STARTED`:
      return {
        ...state,
        error: null,
        loading: true
      };

    case `${SIGNUP}_SUCCESS`: {
      return {
        ...state,

        user: payload.user,
        loading: false
      };
    }

    case `${SIGNUP}_FAILURE`:
      return {
        ...state,
        loading: false,
        error: payload.error
      };

    case `${LOGIN}_STARTED`:
      return {
        ...state,
        error: null,
        loading: true
      };

    case `${LOGIN}_SUCCESS`: {
      return {
        ...state,
        user: payload.user,
        loading: false
      };
    }

    case `${LOGIN}_FAILURE`:
      return {
        ...state,
        loading: false,
        error: payload.error
      };
    case `${LOGOUT}_STARTED`:
      return {
        ...state,
        error: null,
        loading: true
      };

    case `${LOGOUT}_SUCCESS`: {
      return {
        ...state,
        user: payload.user,
        loading: false
      };
    }

    case `${LOGOUT}_FAILURE`:
      return {
        ...state,
        loading: false,
        error: payload.error
      };
    case `${FORGOT}_STARTED`:
      return {
        ...state,
        error: null,
        loading: true
      };

    case `${FORGOT}_SUCCESS`: {
      return {
        ...state,
        forgotLinkSent: true,
        loading: false
      };
    }

    case `${FORGOT}_FAILURE`:
      return {
        ...state,
        loading: false,
        error: payload.error
      };
    case `${RESET_PASSWORD}_STARTED`:
      return {
        ...state,
        error: null,
        loading: true
      };

    case `${RESET_PASSWORD}_SUCCESS`: {
      return {
        ...state,
        user: payload.user,
        passwordResetSuccess: true,
        loading: false
      };
    }

    case `${RESET_PASSWORD}_FAILURE`:
      return {
        ...state,
        loading: false,
        error: payload.error
      };
    case `FB_CALLBACK`:
      return {
        ...state,
        error: null,
        user: payload.user
      };

    case `CLEAR_ERROR`:
      return {
        ...state,
        error: null,
        forgotLinkSent: false,
        passwordResetSuccess: false
      };
    default:
      return state;
  }
};
