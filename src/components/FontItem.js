import React, { PureComponent } from 'react';
import { MIRRORED_FONTS_IDS } from '../constants';
import { loadFont } from '../utils';
import Loader from './Loader';
export default class FontItem extends PureComponent {
  state = {
    loading: true
  };
  async componentDidMount() {
    const { font, onFontLoaded, onSetDefaultFont } = this.props;
    let fontData;
    try {
      const loadedFont = await loadFont(font['font_family']);
      fontData = {
        ...font,
        isLowerCase:
          font.font_id === 14 ? false : !!loadedFont.charToGlyph('a').unicode,
        isUpperCase: !!loadedFont.charToGlyph('A').unicode,
        loadedSVGFont: loadedFont,
        isLoaded: true,
        error: false
      };
      onFontLoaded(fontData);

      this.setState({
        loading: false
      });
    } catch (err) {
      const fontData = {
        ...font,
        error: true,
        isLoaded: false
      };
      onFontLoaded(fontData);

      this.setState({
        loading: false
      });
    }

    // SETTING DEFAULT FONT OF APP, CURRENT FONT = ArtMono-Regular
    if (font['font_family'] === 'ArtMono-Regular') {
      onSetDefaultFont(fontData);
    }
  }

  render() {
    const { font } = this.props;
    const { loading } = this.state;
    const chars = font.error ? 'Loading error' : 'AG';
    const mirroredChars = font.error ? 'Loading error' : 'Ag';
    const fontSize =
      font['font_family'] === 'STDMonograms-Regular' ? '26px' : '36px';

    const errorStyle = font.error
      ? {
          wordBreak: 'break-word',
          wordSpacing: '24px',
          fontSize: '13px',
          color: '#610b0b',
          fontFamily: 'sans-serif',
          textAlign: 'center'
        }
      : {
          fontFamily: font['font_family'],
          fontSize: fontSize
        };

    return (
      <span className="font-preview" style={errorStyle}>
        {loading && (
          <Loader
            size="mid"
            style={{
              fontSize: 6
            }}
          />
        )}
        {!loading &&
          (MIRRORED_FONTS_IDS.includes(font.font_id) ? mirroredChars : chars)}
      </span>
    );
  }
}
