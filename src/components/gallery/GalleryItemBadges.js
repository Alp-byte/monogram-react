import React from 'react';
import Badge from '../Badge';
function GalleryItemBadges({
  showPrivacyBadge,
  privacy,
  showTopRated,
  showisCreator,
  showNew
}) {
  return (
    <div
      className="badge-list"
      style={{
        left: 5,
        top: 12
      }}
    >
      {showNew && (
        <Badge
          style={{
            backgroundColor: 'green'
          }}
          text={'New'}
        />
      )}
      {showPrivacyBadge && (
        <Badge
          style={{
            backgroundColor: privacy === 'public' ? '#1bb71b' : '#b12ebd'
          }}
          text={privacy}
        />
      )}
      {!showPrivacyBadge && showisCreator && (
        <Badge
          style={{
            backgroundColor: 'red'
          }}
          text={'OWNER'}
        />
      )}

      {showTopRated && (
        <Badge
          style={{
            backgroundColor: 'orange'
          }}
          text={'Top Rated'}
        />
      )}
    </div>
  );
}

export default GalleryItemBadges;
