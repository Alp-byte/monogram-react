import React from 'react';
import Tooltip from 'rc-tooltip';
import { FaInfoCircle } from 'react-icons/fa';

export default function PopConfirm({
  children,
  title,
  onConfirm,
  onCancel,
  okText,
  cancelText,
  customClass,
  ...rest
}) {
  return (
    <Tooltip
      overlay={
        <div className={customClass}>
          <div className="confirm-title">
            <FaInfoCircle /> <span>{title}</span>
          </div>

          <div className="popconfirm-btns">
            <div onClick={onCancel} className="popconfirm-btns-btn">
              {cancelText}
            </div>
            <div
              onClick={onConfirm}
              style={{
                background: '#79c2e9',
                color: 'white'
              }}
              className="popconfirm-btns-btn"
            >
              {okText}
            </div>
          </div>
        </div>
      }
      overlayClassName="confirm"
      {...rest}
    >
      {children}
    </Tooltip>
  );
}
