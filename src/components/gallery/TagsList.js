import React from 'react';
import TagItem from './TagItem';

import { shuffle } from '../../utils';

export default class TagsList extends React.PureComponent {
  render() {
    const { tags, fetchByTag, isLink, history } = this.props;
    const tagsArr = shuffle([...tags]);
    const max = tags && tags.length && tags[0].useQuantity; // Should be computed
    const min = tags && tags.length && tags[tags.length - 1].useQuantity; // Should be computed
    const fontMin = 10;
    const fontMax = 20;
    return (
      <div className="gallery_tags">
        {tagsArr.map(tag => (
          <TagItem
            fetchByTag={fetchByTag}
            tag={tag}
            key={tag._id}
            size={
              isLink
                ? 14
                : tag.useQuantity === min
                ? fontMin
                : (tag.useQuantity / max) * (fontMax - fontMin) + fontMin
            }
            onClick={() =>
              isLink
                ? history.push(`/gallery/?tab=tags&tag=${tag.name}`)
                : fetchByTag(tag.name)
            }
          />
        ))}
      </div>
    );
  }
}
