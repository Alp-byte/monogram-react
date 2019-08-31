import React, { Component } from 'react';
import classNames from 'classnames';

export default class Tabs extends Component {
  render() {
    const { user, tab, setTab, isMobile } = this.props;
    return (
      <div className={isMobile ? 'gallery_tabs-mobile' : 'gallery_tabs'}>
        {user && (
          <span
            onClick={() => setTab('my')}
            className={classNames({
              'gallery_tabs-active-tab': tab === 'my'
            })}
          >
            Saved
          </span>
        )}

        <span
          onClick={() => setTab('public')}
          className={classNames({
            'gallery_tabs-active-tab': tab === 'public'
          })}
        >
          Public
        </span>
        <span
          onClick={() => setTab('tags')}
          className={classNames({
            'gallery_tabs-active-tab': tab === 'tags'
          })}
        >
          Tags
        </span>
      </div>
    );
  }
}
