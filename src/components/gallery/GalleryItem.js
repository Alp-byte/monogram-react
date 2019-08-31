import React from 'react';
import { Link } from 'react-router-dom';
import GalleryItemBadges from './GalleryItemBadges';

import GalleryItemUpvotes from './GalleryItemUpvotes';
import GalleryItemMenu from './GalleryItemMenu';

export default function GalleryItem({
  monogram,
  isCreator,
  showBadge,
  modalClose,
  user_ip,
  upvote,
  showTopRated,
  changeMonogramStatus,
  onDelete,
  onReport
}) {
  return (
    <div className="gallery_items-row-item">
      <Link
        style={{ color: '#000' }}
        // onClick={() => {
        //   if (modalClose) {
        //     modalClose();
        //   }
        // }}
        to={`/g/${monogram.monogramId}/${monogram.slug}`}
      >
        <div
          style={{
            background: `url(data:image/png;base64,${monogram.previewImage}) 50% 50% no-repeat`,
            backgroundSize: 'contain, auto'
          }}
          className="gallery_items-row-item-img"
        />
      </Link>

      <GalleryItemMenu
        isCreator={isCreator}
        monogram_id={monogram.monogramId}
        privacy={monogram.privacy}
        changeMonogramStatus={changeMonogramStatus}
        openLink={`/g/${monogram.monogramId}/${monogram.slug}`}
        onDelete={() => onDelete(monogram.monogramId)}
        onReport={onReport}
      />

      <GalleryItemBadges
        showPrivacyBadge={showBadge}
        privacy={monogram.privacy}
        showTopRated={monogram.isTopRated}
        showisCreator={isCreator}
        showNew={
          new Date(monogram.creationDate).getTime() + 3 * 24 * 60 * 60 * 1000 >
          new Date().getTime()
        }
      />

      <div className="gallery_items-row-item-bottom">
        <span className="gallery_items-row-item-bottom_title">
          {monogram.title}
        </span>
        <GalleryItemUpvotes
          upvotes={monogram.upvotes && monogram.upvotes.length}
          onUpvote={() => upvote(monogram.monogramId)}
          active={
            monogram.upvotes &&
            monogram.upvotes.length &&
            monogram.upvotes.filter(m => String(m.ip) === String(user_ip))
              .length
          }
        />
      </div>
    </div>
  );
}
