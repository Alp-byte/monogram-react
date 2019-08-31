import { request } from '../../utils';
import types from './types';

const GET_PUBLIC_MONOGRAMS = types.getPublicMonograms;
const GET_USER_MONOGRAMS = types.getUserMonograms;
const GET_MONOGRAM_BY_ID = types.getMonogramById;
const GET_TAGS = types.getTags;
const BUILDER_LOAD_MONOGRAM = types.builderLoadMonogram;
const RESET_GALLERY = types.resetGallery;
const SAVE_SCROLL = types.saveScroll;
const UPVOTE = types.upvote;
const CHANGE_STATUS = types.change_status;
const DELETE_MONOGRAM = types.deleteMonogram;
const REPORT_MONOGRAM = types.report;
export const fetchUserMonograms = ({ limit, skip }) => {
  return async (dispatch, getState) => {
    dispatch({ type: `${GET_USER_MONOGRAMS}_STARTED` });

    let response;

    try {
      response = await request({
        method: 'GET',
        url: `/monograms/user-monograms?limit=${limit}&skip=${skip}`
      });
    } catch (error) {
      return dispatch({ type: `${GET_USER_MONOGRAMS}_FAILURE`, error });
    }
    return dispatch({
      type: `${GET_USER_MONOGRAMS}_SUCCESS`,
      payload: response
    });
  };
};

export const fetchPublicMonograms = ({
  limit,
  skip,
  sort,
  tag,
  user,
  search
}) => {
  return async (dispatch, getState) => {
    dispatch({ type: `${GET_PUBLIC_MONOGRAMS}_STARTED` });

    let response;
    try {
      response = await request({
        method: 'GET',
        url: `/monograms/public-monograms?limit=${limit}&skip=${skip}&sort=${sort}&tag=${tag}&user=${user}&search=${search}`
      });
    } catch (error) {
      return dispatch({ type: `${GET_PUBLIC_MONOGRAMS}_FAILURE`, error });
    }
    const isFilter = { tag, user, sort, search };
    return dispatch({
      type: `${GET_PUBLIC_MONOGRAMS}_SUCCESS`,
      payload: response,
      isFilter
    });
  };
};

export const fetchTags = () => {
  return async (dispatch, getState) => {
    dispatch({ type: `${GET_TAGS}_STARTED` });

    let response;

    try {
      response = await request({
        method: 'GET',
        url: '/tags/top'
      });
    } catch (error) {
      return dispatch({ type: `${GET_TAGS}_FAILURE`, error });
    }
    return dispatch({
      type: `${GET_TAGS}_SUCCESS`,
      payload: response
    });
  };
};

export const getMonogramById = id => {
  return async (dispatch, getState) => {
    dispatch({ type: `${GET_MONOGRAM_BY_ID}_STARTED` });

    let response;

    try {
      response = await request({
        method: 'GET',
        url: `/monogram/${id}`
      });
    } catch (error) {
      return dispatch({ type: `${GET_MONOGRAM_BY_ID}_FAILURE`, error });
    }
    return dispatch({
      type: `${GET_MONOGRAM_BY_ID}_SUCCESS`,
      payload: response
    });
  };
};

export const deleteMonogramById = id => {
  return async (dispatch, getState) => {
    dispatch({ type: `${DELETE_MONOGRAM}_STARTED` });

    let response;

    try {
      response = await request({
        method: 'DELETE',
        url: `/monogram/${id}`
      });
    } catch (error) {
      return dispatch({ type: `${DELETE_MONOGRAM}_FAILURE`, error });
    }
    return dispatch({
      type: `${DELETE_MONOGRAM}_SUCCESS`,
      payload: response
    });
  };
};
export const upvoteMonogramId = id => {
  return async (dispatch, getState) => {
    dispatch({ type: `${UPVOTE}_STARTED` });

    let response;

    try {
      response = await request({
        method: 'GET',
        url: `/monogram/${id}/upvote`
      });
    } catch (error) {
      return dispatch({ type: `${UPVOTE}_FAILURE`, error });
    }
    return dispatch({
      type: `${UPVOTE}_SUCCESS`,
      payload: response
    });
  };
};

export const changeMonogramStatus = id => {
  return async (dispatch, getState) => {
    dispatch({ type: `${CHANGE_STATUS}_STARTED` });

    let response;

    try {
      response = await request({
        method: 'GET',
        url: `/monogram/${id}/change-status`
      });
    } catch (error) {
      return dispatch({ type: `${CHANGE_STATUS}_FAILURE`, error });
    }
    return dispatch({
      type: `${CHANGE_STATUS}_SUCCESS`,
      payload: response
    });
  };
};

export const reportMonogramById = id => {
  return async (dispatch, getState) => {
    dispatch({ type: `${REPORT_MONOGRAM}_STARTED` });

    let response;

    try {
      response = await request({
        method: 'GET',
        url: `/monogram/${id}/report`
      });
    } catch (error) {
      return dispatch({ type: `${REPORT_MONOGRAM}_FAILURE`, error });
    }
    return dispatch({
      type: `${REPORT_MONOGRAM}_SUCCESS`,
      payload: response
    });
  };
};
export const builderLoadMonogram = monogram => ({
  type: BUILDER_LOAD_MONOGRAM,
  payload: { monogram }
});

export const resetGallery = tab => ({
  type: RESET_GALLERY,
  payload: tab
});

export const saveScroll = scroll => ({
  type: SAVE_SCROLL,
  payload: scroll
});
