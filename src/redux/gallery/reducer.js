import types from './types';

const GET_MONOGRAMS = types.getMonograms;
const GET_USER_MONOGRAMS = types.getUserMonograms;
const GET_MONOGRAM_BY_ID = types.getMonogramById;
const GET_TAGS = types.getTags;
const GET_PUBLIC_MONOGRAMS = types.getPublicMonograms;
const BUILDER_LOAD_MONOGRAM = types.builderLoadMonogram;
const RESET_GALLERY = types.resetGallery;
const UPVOTE = types.upvote;
const CHANGE_STATUS = types.change_status;
const DELETE_MONOGRAM = types.deleteMonogram;

const initialState = {
  monograms: [],
  tags: [],
  userMonograms: [],
  byUser: {},
  isFilter: {},
  hasMorePublic: true,
  hasMorePrivate: true,
  error: {},
  monogramPage: null,
  builderLoadedMonogram: null,
  loading: false
};

export default (state = initialState, { payload, type, isFilter }) => {
  switch (type) {
    case RESET_GALLERY: {
      if (payload === 'my') {
        return {
          ...state,
          userMonograms: []
        };
      }

      if (payload === 'public') {
        return {
          ...state,
          monograms: [],
          byUser: {}
        };
      }
      return {
        ...state,
        byUser: {},
        userMonograms: [],
        monograms: []
      };
    }
    case `${GET_USER_MONOGRAMS}_STARTED`:
      return {
        ...state,
        error: {},
        loading: true
      };

    case `${GET_USER_MONOGRAMS}_SUCCESS`: {
      const monograms = payload.monograms || [];
      const hasMorePrivate = monograms.length >= 20;
      return {
        ...state,
        userMonograms: [...state.userMonograms, ...monograms],
        hasMorePrivate,
        loading: false
      };
    }

    case `${GET_USER_MONOGRAMS}_FAILURE`:
      return {
        ...state,
        loading: false
      };
    case `${GET_PUBLIC_MONOGRAMS}_STARTED`:
      return {
        ...state,
        error: {},
        loading: true
      };

    case `${GET_PUBLIC_MONOGRAMS}_SUCCESS`: {
      const monograms = payload.monograms || [];
      const hasMorePublic = monograms.length >= 20;
      return {
        ...state,
        monograms: [...state.monograms, ...monograms],
        byUser: payload.byUser || {},
        hasMorePublic,
        isFilter,
        loading: false
      };
    }

    case `${GET_PUBLIC_MONOGRAMS}_FAILURE`:
      return {
        ...state,
        loading: false
      };
    case `${GET_TAGS}_STARTED`:
      return {
        ...state,
        error: {}
      };

    case `${GET_TAGS}_SUCCESS`: {
      return {
        ...state,
        tags: payload.tags || []
      };
    }

    case `${GET_TAGS}_FAILURE`:
      return {
        ...state
      };
    case `${GET_MONOGRAM_BY_ID}_STARTED`:
      return {
        ...state,
        error: {},
        loading: true
      };

    case `${GET_MONOGRAM_BY_ID}_SUCCESS`: {
      return {
        ...state,
        monogramPage: payload.monogram || null,
        loading: false
      };
    }

    case `${GET_MONOGRAM_BY_ID}_FAILURE`:
      return {
        ...state,
        loading: false
      };
    case `${DELETE_MONOGRAM}_STARTED`:
      return {
        ...state,
        error: {},
        loading: true
      };

    case `${DELETE_MONOGRAM}_SUCCESS`: {
      const updatedPublicMonograms = state.monograms.filter(monogram => {
        return monogram.monogramId !== payload.monogramId;
      });

      const updatedUserMonograms = state.userMonograms.filter(monogram => {
        return monogram.monogramId !== payload.monogramId;
      });
      return {
        ...state,
        monograms: updatedPublicMonograms,
        userMonograms: updatedUserMonograms,
        monogramPage: null,
        loading: false
      };
    }

    case `${DELETE_MONOGRAM}_FAILURE`:
      return {
        ...state,
        loading: false
      };

    case `${UPVOTE}_STARTED`:
      return {
        ...state,
        error: {}
      };

    case `${UPVOTE}_SUCCESS`: {
      const updatedPublicMonograms = state.monograms.map(monogram => {
        if (monogram._id === payload.monogramId) {
          return { ...monogram, upvotes: payload.monogramUpvotes };
        }
        return monogram;
      });

      const updatedUserMonograms = state.userMonograms.map(monogram => {
        if (monogram._id === payload.monogramId) {
          return { ...monogram, upvotes: payload.monogramUpvotes };
        }
        return monogram;
      });
      return {
        ...state,
        monograms: updatedPublicMonograms,
        userMonograms: updatedUserMonograms,
        monogramPage: state.monogramPage
          ? {
              ...state.monogramPage,
              upvotes: payload.monogramUpvotes
            }
          : null,
        loading: false
      };
    }

    case `${UPVOTE}_FAILURE`:
      return {
        ...state,
        loading: false
      };

    case `${CHANGE_STATUS}_STARTED`:
      return {
        ...state,
        error: {}
      };

    case `${CHANGE_STATUS}_SUCCESS`: {
      let updatedPublicMonograms;
      let updatedUserMonograms = state.userMonograms.map(monogram => {
        if (monogram._id === payload.monogramId) {
          return { ...monogram, privacy: payload.monogramPrivacy };
        }
        return monogram;
      });

      if (payload.monogramPrivacy === 'private') {
        updatedPublicMonograms = state.monograms.filter(monogram => {
          return monogram._id !== payload.monogramId;
        });
      }

      if (payload.monogramPrivacy === 'public') {
        updatedPublicMonograms = state.monograms;
        // TODO: PLACE NEW MONOGRAM IN PUBLIC TAB ---- NEED TO RETURN MONOGRAM FROM SERVER
      }

      return {
        ...state,
        monograms: updatedPublicMonograms,
        userMonograms: updatedUserMonograms,
        monogramPage: state.monogramPage
          ? {
              ...state.monogramPage,
              privacy: payload.monogramPrivacy
            }
          : null,
        loading: false
      };
    }

    case `${CHANGE_STATUS}_FAILURE`:
      return {
        ...state,
        loading: false
      };

    case `${BUILDER_LOAD_MONOGRAM}`: {
      return {
        ...state,
        builderLoadedMonogram: payload.monogram
      };
    }
    default:
      return state;
  }
};
