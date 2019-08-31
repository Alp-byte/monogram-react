import React, { useState } from 'react';
import { MdMoreVert } from 'react-icons/md';
import classNames from 'classnames';
import ClickOutside from '../../HOC/ClickOutside';
import PopConfirm from '../PopConfirm';
import { Link } from 'react-router-dom';
function GalleryItemMenu({
  isCreator,
  onDelete,
  openLink,
  privacy,
  monogram_id,
  changeMonogramStatus,
  onReport
}) {
  const [visible, setVisible] = useState(0);
  const [showConfirm, setConfirm] = useState(0);
  const [showReport, setReport] = useState(0);
  return (
    <ClickOutside onClickOutside={() => setVisible(false)}>
      <div
        className={classNames({
          'gallery-item-menu-icon': true,
          active: !!visible
        })}
      >
        <MdMoreVert
          onClick={() => {
            setVisible(!visible);
          }}
        />
      </div>

      <div
        className={classNames({
          'gallery-item-menu-list': true,
          open: !!visible
        })}
      >
        <ul>
          <Link to={openLink}>
            <li>Open</li>
          </Link>
          {isCreator && (
            <li onClick={() => changeMonogramStatus(monogram_id)}>
              Switch To {privacy === 'public' ? 'Private' : 'Public'}
            </li>
          )}
          <PopConfirm
            visible={!!showReport}
            placement="bottom"
            okText="Yes"
            cancelText="Cancel"
            onCancel={e => {
              e.stopPropagation();
              setReport(false);
            }}
            onConfirm={e => {
              onReport(monogram_id);
              setReport(false);
            }}
            title="Report this monogram?"
            onVisibleChange={showReport => setReport(!!showReport)}
            trigger="click"
          >
            <li>Report</li>
          </PopConfirm>

          {isCreator && (
            <PopConfirm
              visible={!!showConfirm}
              placement="bottom"
              okText="Yes"
              cancelText="Cancel"
              onCancel={e => {
                e.stopPropagation();
                setConfirm(false);
              }}
              onConfirm={e => onDelete()}
              title="Delete this monogram?"
              onVisibleChange={showConfirm => setConfirm(!!showConfirm)}
              trigger="click"
            >
              <li className="delete-option">Delete</li>
            </PopConfirm>
          )}
        </ul>
      </div>
    </ClickOutside>
  );
}

export default GalleryItemMenu;
