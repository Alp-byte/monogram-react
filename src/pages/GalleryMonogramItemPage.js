import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { MdSentimentNeutral } from 'react-icons/md';
import {
  getMonogramById,
  deleteMonogramById,
  builderLoadMonogram,
  upvoteMonogramId,
  changeMonogramStatus
} from '../redux/gallery/actions';
import { setLayers } from '../redux/builder';
import TagsList from '../components/gallery/TagsList';
import GalleryItemUpvotes from '../components/gallery/GalleryItemUpvotes';
import BreadCrumbs from '../components/gallery/BreadCrumbs';
import Badge from '../components/Badge';
import Loader from '../components/Loader';
import { loadFont } from '../utils';
import PopConfirm from '../components/PopConfirm';

export class GalleryMonogramPage extends Component {
  state = {
    visible: false
  };
  componentDidMount() {
    const { getMonogramById, match, isMobile } = this.props;
    const monogramParamsId = match.params.monogramId;
    if (monogramParamsId) {
      getMonogramById(monogramParamsId);
    } else {
      return <Redirect to="/gallery" />;
    }
    if (isMobile) {
      const appDom = document.getElementById('app');
      appDom.classList.add('no-height-app');
    }
  }
  componentWillUnmount() {
    if (this.props.isMobile) {
      const appDom = document.getElementById('app');
      appDom.classList.remove('no-height-app');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { getMonogramById, match } = this.props;
    const { match: prevMatch } = prevProps;
    const monogramParamsId = match.params.monogramId;

    if (prevMatch && prevMatch.params.monogramId !== monogramParamsId) {
      getMonogramById(monogramParamsId);
    }
  }
  onVisibleChange = visible => {
    this.setState({
      visible
    });
  };
  handleBuilderLoad = async () => {
    const {
      monogramPage,
      setLayers,
      builderLoadMonogram,
      history
    } = this.props;

    const layersWithFontLoadPromises = monogramPage.builderData.map(
      async layer => {
        if (layer.target === 'text') {
          const loadedFont = await loadFont(layer.font['font_family']);
          const fontData = {
            ...layer.font,
            isLowerCase:
              layer.font.font_id === 14
                ? false
                : !!loadedFont.charToGlyph('a').unicode,
            isUpperCase: !!loadedFont.charToGlyph('A').unicode,
            loadedSVGFont: loadedFont,
            isLoaded: true,
            error: false
          };
          return {
            ...layer,
            font: fontData
          };
        }
        return layer;
      }
    );
    const layers = await Promise.all(layersWithFontLoadPromises);

    // FONT FETCH!!!
    await setLayers(layers);
    await builderLoadMonogram(monogramPage);
    history.push('/');
  };
  handleDelete = async id => {
    const { history, deleteMonogram } = this.props;
    await deleteMonogram(id);
    history.replace('/gallery/?tab=my');
  };
  render() {
    const {
      monogramPage,
      galleryLoading,
      user,
      upvote,
      user_ip,
      changeMonogramStatus,
      profileFetchFinished
    } = this.props;

    if (galleryLoading || !profileFetchFinished)
      return (
        <div className="monogram-page-wrapper monogram-page-wrapper-fullscreen">
          {' '}
          <Loader style={{ margin: 'auto' }} size="lg" />
        </div>
      );
    if (!monogramPage)
      return (
        <div className="monogram-page-wrapper monogram-page-wrapper-fullscreen">
          <div className="not-found">
            <MdSentimentNeutral />
            <span>Not Found</span>
          </div>
        </div>
      );

    if (monogramPage.privacy === 'private' && profileFetchFinished && !user) {
      return <Redirect to="/gallery" />;
    }
    const isCreator =
      this.props.user &&
      monogramPage.creator &&
      this.props.user._id === monogramPage.creator._id;
    return (
      <div className="monogram-page-wrapper">
        <div className="monogram-header">
          <div className="monogram-header-title">
            {monogramPage.title}{' '}
            {new Date(monogramPage.creationDate).getTime() +
              3 * 24 * 60 * 60 * 1000 >
              new Date().getTime() && (
              <Badge
                style={{
                  backgroundColor: 'green'
                }}
                text={'New'}
              />
            )}
            {isCreator && (
              <Badge
                text={monogramPage.privacy}
                style={{
                  backgroundColor:
                    monogramPage.privacy === 'public' ? '#1bb71b' : '#b12ebd'
                }}
              />
            )}
            {monogramPage.isTopRated && (
              <Badge
                style={{
                  backgroundColor: 'orange'
                }}
                text={'Top Rated'}
              />
            )}
            {isCreator && (
              <Badge
                style={{
                  backgroundColor: 'red'
                }}
                text={'OWNER'}
              />
            )}
          </div>

          {isCreator && (
            <div className="monogram-actions">
              <button
                onClick={() => changeMonogramStatus(monogramPage.monogramId)}
                className="button button_switch"
                style={{
                  backgroundColor:
                    monogramPage.privacy === 'private' ? '#1bb71b' : '#b12ebd'
                }}
              >
                Switch To{' '}
                {monogramPage.privacy === 'public' ? (
                  <strong>Private</strong>
                ) : (
                  <strong>Public</strong>
                )}
              </button>
              <PopConfirm
                visible={this.state.visible}
                placement="left"
                okText="Yes"
                cancelText="Cancel"
                onCancel={e => {
                  e.stopPropagation();
                  this.setState({ visible: false });
                }}
                onConfirm={e => this.handleDelete(monogramPage.monogramId)}
                title="Delete this monogram?"
                onVisibleChange={this.onVisibleChange}
                trigger="click"
              >
                <button className="button button_delete">Delete</button>
              </PopConfirm>
            </div>
          )}
        </div>
        <BreadCrumbs
          path={`/g/${monogramPage.monogramId}/${monogramPage.slug}`}
          pathTitle={monogramPage.title}
        />

        <div className="monogram-content">
          <div className="monogram-preview">
            <div
              className="monogram-preview-img"
              style={{
                background: `url(data:image/png;base64,${monogramPage.previewImage}) 50% 50% no-repeat`,
                backgroundSize: 'contain, auto'
              }}
            />

            <div className="monogram-info-upvotes">
              <GalleryItemUpvotes
                upvotes={monogramPage.upvotes && monogramPage.upvotes.length}
                onUpvote={() => upvote(monogramPage.monogramId)}
                active={
                  monogramPage.upvotes &&
                  monogramPage.upvotes.length &&
                  monogramPage.upvotes.filter(
                    m => String(m.ip) === String(user_ip)
                  ).length
                }
              />
            </div>
          </div>
          <div className="monogram-info">
            <div className="monogram-info-title">
              <strong>TITLE:</strong> <span>{monogramPage.title}</span>
            </div>
            {this.props.user && monogramPage.creator.name && (
              <div className="monogram-info-creator">
                <strong>BY:</strong>{' '}
                <span
                  onClick={() =>
                    this.props.history.push(
                      `/gallery/?tab=tags&user=${monogramPage.creator.userId}`
                    )
                  }
                >
                  {monogramPage.creator.name}
                </span>
              </div>
            )}

            {monogramPage.description && (
              <div className="monogram-info-description">
                <strong>DESCRIPTION: </strong>
                <span>{monogramPage.description}</span>
              </div>
            )}

            <div className="monogram-info-tags">
              <strong>TAGS:</strong>{' '}
              <TagsList
                isLink
                history={this.props.history}
                tags={monogramPage.tags}
              />{' '}
            </div>
          </div>
        </div>
        <div
          className="button button_loadmonogram monogram-load"
          onClick={this.handleBuilderLoad}
        >
          Load Into Monogram Maker
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  user_ip: state.auth.user_ip,
  profileFetchFinished: state.auth.profileFetchFinished,
  monogramPage: state.gallery.monogramPage,
  galleryLoading: state.gallery.loading
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getMonogramById,
      builderLoadMonogram,
      setLayers,
      upvote: upvoteMonogramId,
      changeMonogramStatus,
      deleteMonogram: deleteMonogramById
    },
    dispatch
  );

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(GalleryMonogramPage)
);
