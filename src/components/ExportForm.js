import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';
import SelectControl from './SelectControl';
import Loader from './Loader';

const qualityOptions = [
  { value: 1, label: 'Small' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'Large' },
  { value: 4, label: 'Ultra Large' }
];

const colourStyles = {
  control: styles => ({
    ...styles,
    ':focus': { outline: 'none' },
    backgroundColor: 'white',
    zIndex: 1000
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isSelected && '#79c2e9',

      ':hover': {
        backgroundColor: isSelected ? '#79c2e9' : '#f1f1f1'
      }
    };
  }
};

export default function ExportForm({
  extension,
  quality,
  handleQualityChange,
  onSetExtension,
  saveCache,
  onChange,
  loading,
  handleDownloadSubmit,
  user
}) {
  return (
    <section className="modal_body">
      <label className="label-helper">File Name:</label>
      <div className="InputAdd">
        <div className="InputAddOn">
          <input
            className="InputAddOn-field"
            type="text"
            placeholder="input file name"
            name="filename"
            onChange={onChange}
            maxLength={24}
          />

          <span className="InputAddOn-item-right">.{extension}</span>
        </div>
      </div>
      <label className="label-helper">File Type:</label>
      <div className="select_extensions">
        <div
          className={`select_extensions_item ${
            extension === 'png' ? 'selected' : ''
          }`}
          onClick={() => onSetExtension('png')}
        >
          <FiCheck className="select_extensions_item_icon" />
          <span>PNG</span>
        </div>
        <div
          className={`select_extensions_item ${
            extension === 'svg' ? 'selected' : ''
          }`}
          onClick={() => onSetExtension('svg')}
        >
          <FiCheck className="select_extensions_item_icon" />
          <span>SVG</span>
        </div>

        <React.Fragment>
          <div
            className={`select_extensions_item ${
              extension === 'eps' ? 'selected' : ''
            }`}
            onClick={() => onSetExtension('eps')}
          >
            <FiCheck className="select_extensions_item_icon" />
            <span>EPS</span>
          </div>
          <div
            className={`select_extensions_item ${
              extension === 'dxf' ? 'selected' : ''
            }`}
            onClick={() => onSetExtension('dxf')}
          >
            <FiCheck className="select_extensions_item_icon" />

            <span>DXF</span>
          </div>
          <div
            className={`select_extensions_item ${
              extension === 'zip' ? 'selected' : ''
            }`}
            onClick={() => onSetExtension('zip')}
          >
            <FiCheck className="select_extensions_item_icon" />
            <span>ALL</span>
          </div>
        </React.Fragment>
      </div>

      {extension === 'png' && (
        <div className="select_resolution">
          <label className="label-helper">File resolution:</label>
          <SelectControl
            isSearchable={false}
            clearable={false}
            defaultValue={qualityOptions[quality - 1]}
            onChange={handleQualityChange}
            options={qualityOptions}
            styles={colourStyles}
            theme={theme => ({
              ...theme,
              colors: {
                ...theme.colors,

                primary: '#79c2e9'
              }
            })}
          />
        </div>
      )}
      <div
        style={{
          fontSize: '13px',
          margin: '15px 0 4px 0'
        }}
      >
        Your download is licensed under our{' '}
        <Link onClick={saveCache} to="/license">
          Premium License
        </Link>
      </div>
      {user && (
        <div
          style={{
            fontSize: '13px',
            margin: '2px 0 8px 0'
          }}
        >
          By entering your email you agree to our{' '}
          <Link onClick={saveCache} to="/privacypolicy">
            Privacy Policy
          </Link>
        </div>
      )}

      <button
        className="button button_download"
        disabled={loading}
        onClick={handleDownloadSubmit}
      >
        {loading ? (
          <Loader
            style={{
              margin: 'auto',
              fontSize: '7px'
            }}
            size="sm"
          />
        ) : (
          'Download'
        )}
      </button>
    </section>
  );
}
