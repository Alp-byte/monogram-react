import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Rodal from 'rodal';
import classNames from 'classnames';
import { MdKeyboardBackspace } from 'react-icons/md';
import { FaSave, FaInfoCircle } from 'react-icons/fa';

import Badge from '../components/Badge';

import background from '../assets/Layer 4.png';
import gallery from '../assets/Gallery.png';
import monogram from '../assets/Monogram.png';
import saveto from '../assets/Save to.png';

import {
  CANVAS_FORMAT_DXF,
  CANVAS_FORMAT_EPS,
  CANVAS_FORMAT_PNG,
  CANVAS_FORMAT_SVG
} from '../constants';

import { canvasToBlob } from 'blob-util';

import trimCanvas from 'trim-canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { DownloadEspFile, getCanvasBlob, validateEmail } from '../utils';
import Portal from '../HOC/Portal';
import ExportForm from '../components/ExportForm';
import ShareForm from '../components/ShareForm';
import AuthForm from '../components/AuthForm';

import DownloadEmail from '../components/DownloadEmail';
import { request } from '../utils';

const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

export class BuilderDownload extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      ...(props.builderDownloadData
        ? { ...props.builderDownloadData, show: true }
        : {
            show: false,
            isDirty: false,
            extension: 'png',
            canvasWidth: 0,
            canvasHeight: 0,
            tab: 'export',
            filename: '',
            loading: false,
            quality: 2,
            showEmailPrompt: false,
            email: '',

            formError: false
          })
    };
    if (props.builderDownloadData) {
      this.props.deleteBuilderDownloadData();
    }
  }

  saveCache = () => {
    this.props.saveBuilderDownloadData(this.state);
  };
  handleClose = () => {
    this.setState({ show: false, showEmailPrompt: false });
  };

  handleShow = () => {
    const canvasDom = document.getElementById('canvas');

    this.setState({
      show: true,
      canvasWidth: canvasDom.clientWidth,
      canvasHeight: canvasDom.clientHeight
    });
  };

  validEmail = e => {
    const isValidEmail = validateEmail(e.target.value);
    this.setState({
      formError: !isValidEmail
    });
  };

  handleDownloadSubmit = () => {
    if (!this.props.user) {
      this.setState({
        showEmailPrompt: true
      });
    } else {
      this.onDownloadSelected();
    }
  };

  handleEmailChange = e => {
    this.setState({
      email: e.target.value
    });
  };
  handleEmailSubmit = e => {
    e.preventDefault();

    const isValidEmail = validateEmail(this.state.email);
    if (isValidEmail) {
      this.setState({ formError: false, loading: true });
      request({
        method: 'POST',
        url: 'emails/new',
        data: { email: this.state.email }
      });
      // API CALL HERE
      // localStorage.setItem('email', this.state.email);

      if (process.env.NODE_ENV !== 'development') {
        //eslint-disable-next-line
        fbq('track', 'CompleteRegistration');
      }

      this.onDownloadSelected();
    }
    if (!isValidEmail) {
      this.setState({
        formError: true
      });
    }
  };
  onChange = e => {
    const inputName = e.target.name;
    const inputValue = e.target.value;
    this.setState({ [inputName]: inputValue });
  };
  handleQualityChange = select => {
    this.setState({
      quality: select.value
    });
  };

  onSetExtension = extension => {
    this.setState({ extension });
  };

  getSvgBlob = svgData => {
    return new Blob([svgData], { type: 'image/svg+xml' });
  };
  getPngBlob = svgData => {
    const { isMobile } = this.props;
    return new Promise(resolve => {
      var canvas = document.createElement('canvas');
      // get svg data

      const ctx = canvas.getContext('2d');

      const image = document.createElement('img');
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      canvas.setAttribute('width', isMobile ? 1548 : 4548);
      canvas.setAttribute('height', isMobile ? 1548 : 4548);

      image.addEventListener(
        'load',
        () => {
          ctx.drawImage(
            image,
            0,
            0,

            this.state.canvasWidth,
            this.state.canvasHeight,
            0,
            0,
            this.state.canvasWidth * this.state.quality,
            this.state.canvasHeight * this.state.quality
          );
          trimCanvas(canvas);

          // HERE NEED TO TRANSFROM CANVAS TO BLOB

          canvasToBlob(canvas, 'image/png').then(blob => {
            resolve(blob);
          });
        },
        {
          once: true
        }
      );
      image.src = url;
    });

    // draw the image onto the canvas
  };

  getCanvasBlob = async (svgData, fileName, extension, isZip) => {
    const file = new File([svgData], `${fileName}.svg`, {
      type: 'image/svg+xml;charset=utf-8'
    });
    const data = await DownloadEspFile(file, extension);

    if (data) {
      const blob = new Blob([data]);
      if (!isZip) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${fileName}.${extension}`);
        document.body.appendChild(link);
        link.click();
      } else {
        return blob;
      }
    }
    return null;
  };

  downloadMonogramsZip = async (svgData, fileName, fullName) => {
    const svgBlob = this.getSvgBlob(svgData);
    const pngBlob = await this.getPngBlob(svgData);
    const epsBlob = await this.getCanvasBlob(svgData, fileName, 'eps', true);
    const dxfBlob = await this.getCanvasBlob(svgData, fileName, 'dxf', true);

    var zip = new JSZip();
    zip.file(`${fileName}.svg`, svgBlob);
    zip.file(`${fileName}.png`, pngBlob);
    zip.file(`${fileName}.eps`, epsBlob);
    zip.file(`${fileName}.dxf`, dxfBlob);

    zip
      .generateAsync({ type: 'blob', mimeType: 'application/zip' })
      .then(content => {
        if (iOS) {
          const reader = new FileReader();

          reader.onload = function(e) {
            window.location.href = reader.result;
          };
          reader.readAsDataURL(content);
        } else {
          saveAs(content, `${this.state.filename || 'monograms'}.zip`);
        }
      });
  };

  onDownloadSelected = async () => {
    const { layers, removeActive } = this.props;
    const { extension, canvasWidth, canvasHeight } = this.state;

    if (!layers.length) {
      return;
    }

    this.setState({ loading: true });
    await removeActive();

    request({
      method: 'POST',
      url: '/update-assests',
      data: layers.map(layer => {
        if (layer.target === 'text') {
          return {
            ...layer,
            font: {
              _id: layer.font._id
            }
          };
        }
        return layer;
      })
    });
    const fileName = this.state.filename || `monoframe_${new Date().getTime()}`;
    const fullName = `${fileName}.${extension}`;
    const svgData = getCanvasBlob(layers, canvasWidth, canvasHeight);

    let uploadBlob;

    switch (extension) {
      case CANVAS_FORMAT_PNG:
        uploadBlob = await this.getPngBlob(svgData);
        break;
      case CANVAS_FORMAT_SVG:
        // IOS FileReader
        if (iOS) {
          const reader = new FileReader();

          reader.onload = function(e) {
            window.location.href = reader.result;
          };
          reader.readAsDataURL(await this.getSvgBlob(svgData));
        } else {
          uploadBlob = await this.getSvgBlob(svgData);
        }
        break;
      case CANVAS_FORMAT_DXF:
      case CANVAS_FORMAT_EPS:
        // IOS ZIP
        if (iOS) {
          var zip = new JSZip();
          zip.file(
            `${fileName}.${extension}`,
            await this.getCanvasBlob(svgData, fileName, extension, true)
          );
          zip
            .generateAsync({ type: 'blob', mimeType: 'application/zip' })
            .then(content => {
              const reader = new FileReader();

              reader.onload = function(e) {
                window.location.href = reader.result;
              };
              reader.readAsDataURL(content);
            });
        } else {
          uploadBlob = await this.getCanvasBlob(svgData, fileName, extension);
        }
        break;
      case 'zip':
        await this.downloadMonogramsZip(svgData, fileName, fullName);
        break;
      default:
        return;
    }

    if (uploadBlob) {
      saveAs(uploadBlob, fullName);
    }
    this.setState({ loading: false, showEmailPrompt: false, show: false });
  };

  changeTab = tab => {
    this.setState({ tab });
  };

  renderBottomSection = () => {
    return (
      <div className="bottom-section">
        <Badge
          style={{
            position: 'absolute',
            marginLeft: 0,
            fontSize: 15,
            paddingLeft: 10,
            paddingRight: 10,
            top: 10,
            left: 10
          }}
          text="NEW"
        />
        <img
          className="bottom-section_background"
          src={background}
          alt="background"
        />
        <div className="bottom-section_content">
          <img
            style={{
              width: 80,
              margin: 'auto'
            }}
            src={saveto}
            alt="saveto"
          />
          <div
            style={{
              width: 300
            }}
          >
            <img
              style={{
                width: '50%'
              }}
              src={monogram}
              alt="monogram"
            />
            <img
              style={{
                width: '50%'
              }}
              src={gallery}
              alt="gallery"
            />
          </div>
          <span
            style={{
              marginTop: 15,
              fontSize: 17,
              fontWeight: 800,
              textAlign: 'center'
            }}
          >
            Save and Share with your friends!
          </span>
          <button
            onClick={() => this.changeTab('share')}
            className="bottom-section_content-button"
          >
            Save Now
          </button>
        </div>
      </div>
    );
  };

  render() {
    const { extension, show } = this.state;
    const { isMobile } = this.props;

    // 551

    const isLayerTemp = this.props.layers.every(
      layer => layer.target === 'temp'
    );

    const isTextEmpty = this.props.layers.every(
      layer => layer.target === 'text' && !layer.value.length
    );

    return (
      <Fragment>
        {!isTextEmpty && !isLayerTemp && !isMobile && (
          <button className="button button_save" onClick={this.handleShow}>
            <FaSave
              style={{
                marginRight: '5px'
              }}
            />
            Save
          </button>
        )}
        {!isTextEmpty && !isLayerTemp && isMobile && (
          <div
            className={classNames({
              'download-button': true
            })}
            onClick={this.handleShow}
          >
            SaveFile
          </div>
        )}
        <Portal>
          <Rodal
            visible={show}
            onClose={this.handleClose}
            closeMaskOnClick={false}
            className="modal_download"
            customStyles={{
              width: 500,
              height: 'auto'
            }}
          >
            {show && (
              <div>
                {!this.state.showEmailPrompt && this.state.tab !== 'success' && (
                  <div className="save-btns">
                    <button
                      onClick={() => this.changeTab('export')}
                      className={`save-btns_btn ${
                        this.state.tab === 'export' ? ' active' : ''
                      }`}
                    >
                      Export
                    </button>
                    <button
                      onClick={() => this.changeTab('share')}
                      className={`save-btns_btn ${
                        this.state.tab === 'share' ? 'active' : ''
                      }`}
                    >
                      Save/Share <Badge text="NEW" />
                    </button>
                  </div>
                )}
                {this.state.showEmailPrompt && (
                  <span
                    onClick={() => {
                      this.setState({ showEmailPrompt: false });
                    }}
                    className="back-arrow"
                  >
                    <MdKeyboardBackspace
                      style={{
                        width: 25,
                        height: 25,
                        color: '#999'
                      }}
                    />
                  </span>
                )}
                {this.state.tab === 'export' &&
                  (this.state.showEmailPrompt ? (
                    <DownloadEmail
                      handleEmailSubmit={this.handleEmailSubmit}
                      email={this.state.email}
                      formError={this.state.formError}
                      handleEmailChange={this.handleEmailChange}
                      loading={this.state.loading}
                      validEmail={this.validEmail}
                      saveCache={this.saveCache}
                    />
                  ) : (
                    <ExportForm
                      extension={extension}
                      quality={this.state.quality}
                      handleQualityChange={this.handleQualityChange}
                      onSetExtension={this.onSetExtension}
                      onChange={this.onChange}
                      saveCache={this.saveCache}
                      loading={this.state.loading}
                      handleDownloadSubmit={this.handleDownloadSubmit}
                      user={this.props.user}
                    />
                  ))}
                {this.state.tab === 'share' &&
                  (this.props.user ? (
                    <ShareForm
                      user={this.props.user}
                      tagOptions={this.state.tagOptions}
                      layers={this.props.layers}
                      canvasWidth={this.state.canvasWidth}
                      canvasHeight={this.state.canvasHeight}
                      isMobile={isMobile}
                    />
                  ) : (
                    <div className="auth-modal">
                      <div className="auth-modal-message">
                        <FaInfoCircle />
                        <span>Please Log In To Save Your Monogram</span>
                      </div>

                      <AuthForm />
                    </div>
                  ))}
                {this.state.tab === 'export' &&
                  !this.state.showEmailPrompt &&
                  this.renderBottomSection()}
              </div>
            )}
          </Rodal>
        </Portal>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(withRouter(BuilderDownload));
