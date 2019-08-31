import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FaInbox } from 'react-icons/fa';
import Loader from '../Loader';

import GalleryItem from './GalleryItem';

export default class GalleryItemsList extends Component {
  constructor() {
    super();
    this.state = {
      showLoader: false
    };
  }

  fetchMoreData = async () => {
    this.setState({ showLoader: true });
    const skip = this.props.monograms.length;
    await this.props.getMonograms(skip);
    this.setState({ showLoader: false });
  };

  render() {
    if (!this.props.monograms.length && this.props.loading) {
      return <Loader style={{ margin: 'auto' }} size="lg" />;
    }
    return (
      <div
        className={`${
          this.props.showFilter && !this.props.showBadge
            ? 'gallery_items gallery_items-showfilter'
            : 'gallery_items'
        }`}
      >
        {this.props.monograms && this.props.monograms.length ? (
          <InfiniteScroll
            dataLength={this.props.monograms.length}
            next={this.fetchMoreData}
            hasMore={this.props.hasMore}
            loader={
              this.state.showLoader && (
                <Loader style={{ margin: 'auto' }} size="mid" />
              )
            }
            endMessage={
              <p style={{ textAlign: 'center', color: '#9c9c9c' }}>
                You have seen it all
              </p>
            }
          >
            <div className="gallery_items-row">
              {this.props.monograms.map((monogram, i) => (
                <GalleryItem
                  changeMonogramStatus={this.props.changeMonogramStatus}
                  showBadge={this.props.showBadge}
                  isCreator={this.props.userId === monogram.creator}
                  modalClose={this.props.modalClose}
                  key={monogram._id}
                  monogram={monogram}
                  upvote={this.props.upvote}
                  user_ip={this.props.user_ip}
                  onDelete={this.props.deleteMonogram}
                  onReport={this.props.onReport}
                />
              ))}
            </div>
          </InfiniteScroll>
        ) : (
          <div className="gallery_items-empty">
            <FaInbox />
            <span>Empty List</span>
          </div>
        )}
      </div>
    );
  }
}
