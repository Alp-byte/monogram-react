import React, { PureComponent } from 'react';
import { slide as Menu } from 'react-burger-menu';
import { FiX } from 'react-icons/fi';

export default class MobileSidebar extends PureComponent {
  render() {
    const { children, ...rest } = this.props;
    return (
      <Menu disableAutoFocus {...rest}>
        <div className="mobile-sidebar_content">
          <div className={`mobile-sidebar_content-header`}>
            {this.props.title && (
              <div className="mobile-sidebar_content-header-item">
                {this.props.title}
              </div>
            )}

            <div
              onClick={this.props.closeSidebar}
              className="mobile-sidebar_content-header-item"
            >
              <span>Close</span>
              <FiX className="topbar-icon" />
            </div>
          </div>
          {children}
        </div>
      </Menu>
    );
  }
}
