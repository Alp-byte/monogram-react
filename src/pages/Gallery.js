import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { MdClose } from 'react-icons/md';

import { setQuery, deleteQuery } from '../utils';

import GalleryItemsList from '../components/gallery/GalleryItemsList';

import {
  fetchUserMonograms,
  fetchTags,
  saveScroll,
  fetchPublicMonograms,
  resetGallery,
  deleteMonogramById,
  changeMonogramStatus,
  upvoteMonogramId,
  reportMonogramById
} from '../redux/gallery/actions';

import Filter from '../components/gallery/Filter';
import TagsList from '../components/gallery/TagsList';
import Tabs from '../components/gallery/Tabs';

class Gallery extends Component {
  constructor(props) {
    super();
    this.state = {
      tab: queryString.parse(props.location.search).tab,
      tag: queryString.parse(props.location.search).tag,
      user: queryString.parse(props.location.search).user,
      search: queryString.parse(props.location.search).search || '',
      byUser: props.byUser.name,
      sort: parseFloat(queryString.parse(props.location.search).sort) || 1,
      showFilter: window.innerWidth > 555
    };
  }

  async componentDidMount() {
    const { tab, tag, user, sort } = queryString.parse(
      this.props.location.search
    );

    if (!tab) {
      await this.setQuery({ tab: 'public' });
    }

    if (
      this.state.tab !== 'my' &&
      this.props.isFilter.sort &&
      sort !== this.props.isFilter.sort
    ) {
      this.setState({ sort: this.props.isFilter.sort });
      this.setQuery({ sort: this.props.isFilter.sort });
    }

    if (this.props.monograms.length) {
      if (
        !Object.entries(this.props.isFilter).length ||
        this.props.isFilter.tag !== tag ||
        this.props.isFilter.user !== user ||
        this.props.isFilter.search !== this.state.search
      ) {
        await this.props.resetGallery('public');
      }
    }
    this.fetchByTab();
  }

  async componentDidUpdate(prevProps, prevState) {
    const { tab, tag, user } = queryString.parse(this.props.location.search);

    if (!Array.isArray(tab) && tab !== this.state.tab) {
      this.setState({ tab });
      this.fetchByTab();
    }

    if (!Array.isArray(tag) && tag !== this.state.tag) {
      await this.setState({ tag });
      await this.props.resetGallery('public');
      await this.fetchByTab();
    }

    if (!Array.isArray(user) && user !== this.state.user) {
      await this.setState({ user });
      await this.props.resetGallery('public');
      await this.fetchByTab();
    }

    if (!this.state.byUser && this.props.byUser.name) {
      this.setState({ byUser: this.props.byUser.name });
    }

    if (this.props.profileFetchFinished && !this.props.user && tab === 'my') {
      this.setQuery({ tab: 'public' });
    }
  }

  setQuery = querys => {
    setQuery(querys, this.props.history);
  };

  getUserMonograms = async skip => {
    await this.props.fetchUserMonograms({ limit: 20, skip: skip || 0 });
  };

  getPublicMonograms = async skip => {
    await this.props.fetchPublicMonograms({
      limit: 20,
      skip: skip || 0,
      sort: this.state.sort,
      tag: this.state.tag,
      search: this.state.search,
      user: this.state.user
    });
  };

  onSearch = async search => {
    !search.length && (await deleteQuery(['search'], this.props.history));
    search.length && (await this.setQuery({ search }));
    await this.setState({ search });
    await this.props.resetGallery('public');
    this.getPublicMonograms();
  };

  setTab = async tab => {
    if (tab === 'my') {
      const { tag, user, search } = queryString.parse(
        this.props.location.search
      );
      if (tag) {
        this.deleteTag();
      }
      if (user) {
        this.deleteUser();
      }
      if (search) {
        await this.setState({ search: '' });
        await deleteQuery(['search'], this.props.history);
        await this.props.resetGallery('public');
      }
    }
    await this.setQuery({ tab });
  };

  fetchByTab = async () => {
    const tab = queryString.parse(this.props.location.search).tab;
    switch (tab) {
      case 'public': {
        if (!this.props.monograms.length && !this.props.loading) {
          this.getPublicMonograms();
        }
        return;
      }

      case 'my': {
        if (!this.props.userMonograms.length && !this.props.loading) {
          this.getUserMonograms();
        }
        return;
      }
      case 'tags': {
        if (!this.props.tags.length) {
          this.props.fetchTags();
        }
        if (!this.props.monograms.length && !this.props.loading) {
          await this.getPublicMonograms();
        }
        return;
      }
      default:
        return;
    }
  };

  handleChange = async select => {
    if (select.value !== this.state.sort) {
      await this.setState({ sort: select.value });
      await this.setQuery({ sort: select.value });
      await this.props.resetGallery('public');
      await this.getPublicMonograms();
    }
  };

  onShowFilter = () => {
    this.setState(prevState => {
      return {
        showFilter: !prevState.showFilter
      };
    });
  };

  fetchByTag = async tag => {
    if (tag !== this.state.tag) {
      await this.setQuery({ tag });
    }
  };

  deleteTag = async () => {
    await this.setState({ tag: undefined });
    await deleteQuery(['tag'], this.props.history);
  };

  deleteUser = async () => {
    await this.setState({ user: undefined });
    await deleteQuery(['user'], this.props.history);
  };
  deleteSearch = async () => {
    await this.setState({ search: '' });
    await deleteQuery(['search'], this.props.history);
    await this.props.resetGallery('public');
    await this.fetchByTab();
  };

  render() {
    const {
      tags,
      fetchTags,
      user,
      monograms,
      userMonograms,
      isMobile,
      upvote,
      changeMonogramStatus,
      user_ip
    } = this.props;

    return (
      <div className={`${isMobile ? 'gallery gallery-mobile' : 'gallery'}`}>
        {!this.props.isMobile && (
          <React.Fragment>
            <div className="gallery-splash-back-bg" />
            <Link to="/" className="gallery-splash-back-text">
              Go To MonogramMaker App >
            </Link>
          </React.Fragment>
        )}

        <div className="gallery-title">
          <span>Gallery</span>
          {isMobile && this.state.tab !== 'my' && (
            <button onClick={this.onShowFilter} className="button">
              {this.state.showFilter ? 'Close' : 'Open'} Filter
            </button>
          )}
        </div>
        <Tabs
          setTab={this.setTab}
          tab={this.state.tab}
          user={user}
          isMobile={isMobile}
        />
        {this.state.tab !== 'my' && isMobile && this.state.showFilter && (
          <Filter
            search={this.state.search}
            onSearch={this.onSearch}
            deleteSearch={this.deleteSearch}
            sort={this.state.sort}
            handleChange={this.handleChange}
          />
        )}
        {this.state.tab !== 'my' && !isMobile && (
          <Filter
            search={this.state.search}
            onSearch={this.onSearch}
            deleteSearch={this.deleteSearch}
            sort={this.state.sort}
            handleChange={this.handleChange}
          />
        )}
        {this.state.tab === 'tags' && (
          <TagsList
            fetchByTag={this.fetchByTag}
            fetchTags={fetchTags}
            tags={tags}
          />
        )}
        <div className="active_filters">
          {this.state.tag && (
            <div className="active_filters-filter">
              <span className="active_filters-filter-title">By tag:</span>
              <span className="active_filters-filter-value">
                {this.state.tag}
                <MdClose onClick={this.deleteTag} />
              </span>
            </div>
          )}
          {this.state.user && this.state.byUser && (
            <div className="active_filters-filter">
              <span className="active_filters-filter-title">By User:</span>
              <span className="active_filters-filter-value">
                {this.state.byUser}
                <MdClose onClick={this.deleteUser} />
              </span>
            </div>
          )}
        </div>

        <GalleryItemsList
          modalClose={this.props.modalClose}
          loading={this.props.loading}
          showFilter={this.state.showFilter}
          changeMonogramStatus={changeMonogramStatus}
          getMonograms={
            this.state.tab === 'my'
              ? this.getUserMonograms
              : this.getPublicMonograms
          }
          hasMore={
            this.state.tab === 'my'
              ? this.props.hasMorePrivate
              : this.props.hasMorePublic
          }
          userId={user && user._id}
          showBadge={this.state.tab === 'my'}
          upvote={upvote}
          monograms={this.state.tab === 'my' ? userMonograms : monograms}
          user_ip={user_ip}
          deleteMonogram={this.props.deleteMonogram}
          onReport={this.props.onReport}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  user_ip: state.auth.user_ip,
  profileFetchFinished: state.auth.profileFetchFinished,
  hasMorePrivate: state.gallery.hasMorePrivate,
  hasMorePublic: state.gallery.hasMorePublic,
  tags: state.gallery.tags,
  isFilter: state.gallery.isFilter,
  userMonograms: state.gallery.userMonograms,
  monograms: state.gallery.monograms,
  byUser: state.gallery.byUser,
  loading: state.gallery.loading
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchUserMonograms,
      fetchPublicMonograms,
      saveScroll,
      fetchTags,
      resetGallery,
      changeMonogramStatus,
      upvote: upvoteMonogramId,
      deleteMonogram: deleteMonogramById,
      onReport: reportMonogramById
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Gallery));
