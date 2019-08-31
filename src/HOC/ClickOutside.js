import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Component that alerts if you click outside of it
 */
export default class ClickOutside extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    onClickOutside: PropTypes.func.isRequired,
    elementProps: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    document.addEventListener('touchstart', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    document.removeEventListener('touchstart', this.handleClickOutside);
  }

  /**
   * Set the wrapper ref
   */
  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.onClickOutside(event);
    }
  }

  render() {
    const { children, onClickOutside, elementProps = {}, ...rest } = this.props;
    return (
      <div {...elementProps} {...rest} ref={this.setWrapperRef}>
        {children}
      </div>
    );
  }
}
