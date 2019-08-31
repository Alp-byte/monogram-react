import React, { PureComponent } from 'react';
import FlipMove from 'react-flip-move';
import classNames from 'classnames';
import { FaAngleDown, FaAngleUp, FaTimes } from 'react-icons/fa';

import { readFileAsync, bytesToSize } from '../utils';

const imageReg = /[/image/](jpg|jpeg|svg|[svg+xml]|png)$/i;
const maxFileSize = 3145728;

export default class BackgroundList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      offset: 10,

      readFilesCount: 0,
      fileError: []
    };
    this.expandRef = null;
    this.fileInputRef = React.createRef();
  }
  renderMessageBox = () => {
    const { fileError, readFilesCount } = this.state;
    const show = !fileError.length && !readFilesCount;
    return (
      <div
        className="info-messages"
        style={{
          display: show ? 'none' : 'block'
        }}
      >
        <div className="message-box">
          <div className="message-content">
            <span className="import-text">
              Imported <strong>{readFilesCount}</strong> file(s)
            </span>

            {!!fileError.length && (
              <div className="error-box">
                {fileError.map(({ error, filename }) => {
                  return (
                    <div className="error-item" key={filename}>
                      <span className="filename-error">{filename}</span>
                      <span className="error-reason">{error}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  selectFiles = e => {
    const input = e.target;

    const errors = [];
    const validFiles = Array.from(input.files).filter(file => {
      if (!imageReg.test(file.type)) {
        errors.push({
          filename: file.name,
          error: 'Invalid file type'
        });
        return null;
      }

      if (file.size > maxFileSize) {
        errors.push({
          filename: file.name,
          error: `Maximum size: ${bytesToSize(maxFileSize)}`
        });
        return null;
      }

      return file;
    });

    this.setState({
      fileError: errors,
      readFilesCount: validFiles ? validFiles.length : 0
    });
    setTimeout(() => {
      this.setState({
        fileError: [],
        readFilesCount: 0
      });
    }, 5000);
    this.readFiles(validFiles);
  };

  readFiles = async files => {
    if (!files.length) {
      return;
    }
    const arr = [];
    for (let index = 0; index < files.length; index++) {
      const imgUrl = await readFileAsync(files[index]);
      arr[index] = {
        id: new Date().valueOf(),
        filename: files[index].name,
        filesize: files[index].size,
        filetype: files[index].type,
        imgUrl
      };
    }

    this.saveFiles(arr);
  };

  saveFiles = files => {
    if (!files.length) {
      return;
    }

    this.props.onSaveUploadedFiles(files);

    this.fileInputRef.current.value = null;
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.expanded && this.state.expanded !== prevState.expanded) {
      this.expandRef.scrollTop = this.expandRef.scrollTop + 1;
      this.setState({
        offset: 380
      });
    }
  }

  handleArrow = () => {
    this.setState(prevState => ({
      expanded: !prevState.expanded
    }));
  };

  backgroundSelect = async background => {
    const {
      onCreateLayer,
      onSetBackground,
      activeLayer,
      setActiveSelector,
      isMobile
    } = this.props;

    if (activeLayer.target === 'temp' && isMobile) {
      setActiveSelector(null);
    }
    if (
      activeLayer.target === 'temp' ||
      (activeLayer.target === 'frame' && activeLayer.isBackground)
    ) {
      return onSetBackground(activeLayer.id, background);
    }
    if (!activeLayer.target || !activeLayer.isBackground) {
      const template = {
        target: 'frame',
        isBackground: true,
        color: { r: 10, g: 20, b: 30, a: 1 },
        width: isMobile ? 200 : 400,
        height: 0,
        scaleX: 1,
        scaleY: 1,
        frame: background,
        angle: 0,
        name: background.filename || 'Background',
        active: true
      };
      await onCreateLayer(template);
      if (isMobile) {
        setActiveSelector(null);
      }
    }
  };

  render() {
    const { uploadedFiles, blurAll, isMobile } = this.props;
    let withBlur = false;
    return (
      <div
        className={classNames({
          'bg-list-mobile': isMobile,
          'sidebar-section__bglist': !isMobile,
          'sidebar-section': !isMobile,
          'expanded-open': !isMobile && this.state.expanded,
          'expanded-close-bg': !isMobile && !this.state.expanded
        })}
      >
        {(withBlur || blurAll) && (
          <div id="overlay">{withBlur && 'Select Frame To Edit'}</div>
        )}
        <div className="sidebar-section-content">
          <div className="sidebar-section-content__title sidebar-section-content__title__yellow">
            Select a Background
            {!isMobile && (
              <div
                className="sidebar-section-content__title sidebar-section-content__title__arrow"
                onClick={this.handleArrow}
              >
                {this.state.expanded ? <FaAngleUp /> : <FaAngleDown />}
              </div>
            )}
          </div>
          {!isMobile && this.renderMessageBox()}

          <FlipMove
            duration={200}
            ref={ref => (this.expandRef = ref)}
            className="sidebar__list sidebar__list_fonts  no-bottom-border"
          >
            <label
              htmlFor="upload"
              className={classNames({
                sidebar__list__item: true,
                'no-files': !uploadedFiles || !uploadedFiles.length
              })}
              style={{
                display: 'flex',
                backgroundColor: '#eaeaea'
              }}
            >
              <span
                className="sidebar__list__plus"
                style={{
                  ...(isMobile
                    ? {}
                    : {
                        fontSize: 60,
                        margin: 'auto',
                        color: 'rgb(175, 175, 175)',
                        fontWeight: 300
                      })
                }}
              >
                {isMobile ? '+ Add Your Background' : '+'}
              </span>
              <input
                ref={this.fileInputRef}
                name="myFile"
                type="file"
                onChange={this.selectFiles}
                multiple
                id="upload"
                style={{ display: 'none' }}
              />
            </label>

            {uploadedFiles &&
              uploadedFiles.map(file => {
                const itemClassName = classNames({
                  sidebar__list__item: true,
                  sidebar__list__background: true
                });

                return (
                  <div
                    key={file.id}
                    className={itemClassName}
                    onDragStart={e => {
                      e.dataTransfer.setData(
                        'shape',
                        JSON.stringify({ ...file, isBackground: true })
                      );
                    }}
                    draggable
                  >
                    <span
                      className="crossbar"
                      onClick={() => this.props.onDeleteUploadFile(file.id)}
                    >
                      <FaTimes
                        style={{ margin: 'auto', width: 15, height: 15 }}
                      />
                    </span>

                    <img
                      onClick={() => this.backgroundSelect(file)}
                      src={file.imgUrl}
                      alt={file.filename}
                    />
                  </div>
                );
              })}
          </FlipMove>
        </div>
      </div>
    );
  }
}
