import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import CreatableSelect from 'react-select/creatable';
import { Link } from 'react-router-dom';
import {
  FaCheckCircle,
  FaPinterest,
  FaFacebookSquare,
  FaTwitter,
  FaInstagram
} from 'react-icons/fa';

import { generatePreview, getCanvasBlob, request } from '../utils';
import Loader from './Loader';

import PopConfirm from './PopConfirm';

import { fetchTags } from '../redux/gallery/actions';

const customStyles = {
  control: styles => ({
    ...styles,
    backgroundColor: 'white',
    placeholder: {
      color: 'red'
    }
  }),
  placeholder: () => ({
    color: 'rgb(217, 217, 217)',
    position: 'absolute',
    fontWeight: 600
  }),
  multiValue: (styles, { data }) => {
    return {
      ...styles,
      backgroundColor: '#79c2e9'
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: 'white'
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: 'white'
  })
};

class ShareForm extends React.Component {
  constructor() {
    super();
    this.state = {
      form: { title: '', tags: [], description: '', shareToPublic: false },
      errors: {},
      loading: false,
      resMonogram: {},
      visible: false
    };

    this.isBackground = false;
    this.inputURL = null;
  }

  componentDidMount() {
    if (!this.props.tags.length) {
      this.props.fetchTags();
    }
  }

  checkForm = () => {
    const errors = {};
    if (Object.keys(this.state.errors).length) {
      this.setState({ errors: {} });
    }
    if (!this.state.form.tags.length) {
      errors['tags'] = 'At least 1 tag must be selected!';
    }
    if (!this.state.form.title.length) {
      errors['title'] = 'Provide title!';
    }

    if (Object.keys(errors).length) {
      this.setState({ errors });
    }
  };
  handleChange = value => {
    const arr = value || [];

    const tags = arr.map(item => item.value);

    const errors = { ...this.state.errors };
    delete errors['tags'];
    this.setState({
      form: {
        ...this.state.form,
        tags
      },
      errors
    });
  };
  inputChange = e => {
    const name = e.target.name;
    const errors = { ...this.state.errors };
    delete errors[name];
    this.setState({
      form: {
        ...this.state.form,
        [name]: e.target.value
      },
      errors
    });
  };

  checkboxChange = () => {
    this.setState(prevState => {
      return {
        form: {
          ...this.state.form,
          shareToPublic: !prevState.form.shareToPublic
        }
      };
    });
  };

  handleshareSubmit = async e => {
    const { isMobile } = this.props;

    e.preventDefault();
    await this.checkForm();

    if (!Object.keys(this.state.errors).length) {
      const filtredLayers = this.props.layers.filter(layer => {
        if (layer.isBackground) {
          return null;
        }
        return layer;
      });

      const layers = filtredLayers.map(layer => {
        if (layer.target === 'text') {
          return {
            ...layer,
            font: {
              font_id: layer.font.font_id,
              font_family: layer.font.font_family
            }
          };
        }
        return layer;
      });

      // Generate JPEG

      const previewImage = await generatePreview(
        getCanvasBlob(
          filtredLayers,
          this.props.canvasWidth,
          this.props.canvasHeight
        ),
        this.props.canvasWidth,
        this.props.canvasHeight,
        isMobile
      );

      const data = {
        ...this.state.form,
        builderData: layers,
        previewImage
      };
      this.setState({
        loading: true
      });
      request({
        method: 'POST',
        url: '/update-assests',
        data: layers
      });
      // TODO: REPLACE WITH {REQUEST} FROM UTILS
      fetch('monogram/api/monogram/new', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ monogram: data })
      })
        .then(res => {
          return res.json();
        })
        .then(data => {
          this.setState({
            resMonogram: data,
            loading: false
          });
        });
    }
  };

  copyURL = () => {
    const copyText = this.inputURL;
    copyText.select();
    document.execCommand('copy');
  };

  openConfirm = async () => {
    await this.checkForm();
    if (!Object.keys(this.state.errors).length) {
      this.setState({ visible: true });
    }
  };

  cancel = () => {
    this.setState({ visible: false });
  };

  render() {
    this.isBackground = this.props.layers.some(layer => layer.isBackground);

    const tagOptions = this.props.tags.map(tag => {
      return {
        value: tag.name,
        label: tag.name
      };
    });
    const { user } = this.props;
    const withBlur = user && !user.emailConfirmed;
    return (
      <section className="modal_body">
        {withBlur && (
          <div id="overlay">
            {withBlur && (
              <span>
                Please Activate Your Account from Link Sent to Your Email
              </span>
            )}
          </div>
        )}
        {!this.state.resMonogram.success ? (
          <div
            className={classNames({
              'blure-content': withBlur
            })}
          >
            {/* <div className="error-message">
              <span>server error</span>
            </div> */}

            <form onSubmit={this.handleshareSubmit}>
              <label className="label-helper">Title:</label>
              <div className="InputAdd">
                <div className="InputAddOn">
                  <input
                    onInput={this.inputChange}
                    className="InputAddOn-field"
                    type="text"
                    placeholder="Enter a name for your monogram"
                    name="title"
                    maxLength={24}
                  />
                </div>
                <span className="form-error">{this.state.errors['title']}</span>
              </div>
              <label className="label-helper">Select or Create Tags:</label>
              <div className="tag-selector">
                <CreatableSelect
                  placeholder="i.e. Floral, America, ect"
                  isMulti
                  closeMenuOnSelect={false}
                  onChange={this.handleChange}
                  isValidNewOption={(inputValue, selectValue) => {
                    const regex = /^[-a-zA-Z0-9_.]*$/;
                    return (
                      inputValue &&
                      regex.test(inputValue) &&
                      inputValue.length < 24
                    );
                  }}
                  noOptionsMessage={({ inputValue }) => {
                    const regex = /^[-a-zA-Z0-9_.]*$/;
                    if (inputValue.length > 23) {
                      return 'Too long name for tag';
                    }

                    if (!regex.test(inputValue)) {
                      return 'Invalid teg name';
                    }
                    return 'No Options';
                  }}
                  styles={customStyles}
                  options={tagOptions}
                  theme={theme => ({
                    ...theme,
                    colors: {
                      ...theme.colors,

                      primary: '#79c2e9'
                    }
                  })}
                />
                <span className="form-error">{this.state.errors['tags']}</span>
              </div>

              <label className="label-helper">Description:</label>
              <div className="InputAdd">
                <div className="InputAddOn">
                  <input
                    onInput={this.inputChange}
                    className="InputAddOn-field"
                    type="text"
                    placeholder="Enter a description of your monogram (optional)"
                    name="description"
                    maxLength={140}
                  />
                </div>
              </div>
              <label className="container">
                <span>Share to Public Gallery</span>
                <input onChange={this.checkboxChange} type="checkbox" />
                <span className="checkmark" />
              </label>
              <span className="share-form-info">
                By selecting Share to Public Gallery, your file will be visible
                & usable by other users via the Monogram Gallery
              </span>
              {this.isBackground ? (
                <PopConfirm
                  okText="Confirm"
                  onClick={this.openConfirm}
                  cancelText="Cancel"
                  customClass="background-confirm"
                  onVisibleChange={visible => {
                    if (this.state.visible) return this.setState({ visible });
                  }}
                  visible={this.state.visible}
                  onConfirm={this.handleshareSubmit}
                  onCancel={this.cancel}
                  title="Your monogram contains at least one background. 
                It (s) will be deleted after saving."
                  trigger="click"
                  placement="top"
                >
                  <button className="button button_download">
                    {this.state.loading ? (
                      <Loader
                        style={{
                          margin: 'auto',
                          fontSize: '7px'
                        }}
                        size="sm"
                      />
                    ) : (
                      'Save'
                    )}
                  </button>
                </PopConfirm>
              ) : (
                <button className="button button_download">
                  {this.state.loading ? (
                    <Loader
                      style={{
                        margin: 'auto',
                        fontSize: '7px'
                      }}
                      size="sm"
                    />
                  ) : (
                    'Save'
                  )}
                </button>
              )}
            </form>
          </div>
        ) : (
          <div className="share">
            <div className="share-link">
              <FaCheckCircle />
              <span>
                <strong>{this.state.resMonogram.monogram.title}</strong> was
                saved to the Monogram Gallery.
              </span>
              <Link to={`/g/${this.state.resMonogram.monogramUrl}`}>
                View in Gallery
              </Link>
            </div>
            <div className="share-url">
              <label className="label-helper">Sharing URL :</label>
              <div className="InputAdd">
                <div className="InputAddOn">
                  <input
                    readOnly
                    ref={element => (this.inputURL = element)}
                    value={`${document.location.protocol}//${
                      document.location.host
                    }/g/${this.state.resMonogram.monogramUrl}`}
                    className="InputAddOn-field"
                    type="text"
                    name="description"
                  />
                </div>
                <span className="InputAddOn-item-right">
                  <button onClick={this.copyURL}>Copy</button>
                </span>
              </div>
            </div>
            <div className="share-info">
              <span
                style={{
                  lineHeight: '18px'
                }}
              >
                By sharing your saved monogram, any user who clicks the link
                will be able to modify, save, and export copy of the monogram
                (your original copy will not be affected)
              </span>
            </div>
            <div className="share-social">
              <div className="share-social-icons">
                <FaFacebookSquare />
                <FaTwitter />
                <FaInstagram />
                <FaPinterest />
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }
}

const mapStateToProps = state => ({
  tags: state.gallery.tags
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchTags
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareForm);
