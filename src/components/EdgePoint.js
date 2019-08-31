import React from 'react';
import { scale } from '../utils/free-transform';

const onScaleHandleMouseDown = (
  event,
  element,
  onUpdate,
  pointPosition,
  onUpdateEnd
) => {
  event.stopPropagation();
  event.preventDefault();
  let data;

  const drag = scale(
    pointPosition,
    {
      startX: event.pageX,
      startY: event.pageY,
      scaleFromCenter: event.altKey,
      aspectRatio: event.shiftKey,
      ...element
    },
    ({ x, y, scaleX, scaleY }) => {
      data = { x, y, scaleX, scaleY };
      onUpdate(data);
    }
  );

  const up = () => {
    onUpdateEnd(data);
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', up);
  };

  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', up);
};

const onScaleHandleTouchDown = (
  event,
  element,
  onUpdate,
  pointPosition,
  onUpdateEnd
) => {
  event.stopPropagation();
  event.preventDefault();
  let data;

  const drag = scale(
    pointPosition,
    {
      startX: event.changedTouches[0].pageX,
      startY: event.changedTouches[0].pageY,
      scaleFromCenter: event.altKey,
      aspectRatio: event.shiftKey,
      ...element
    },
    ({ x, y, scaleX, scaleY }) => {
      data = { x, y, scaleX, scaleY };
      onUpdate(data);
    }
  );

  const up = () => {
    onUpdateEnd(data);
    document.removeEventListener('touchmove', drag, { passive: false });
    document.removeEventListener('touchend', up);
  };

  document.addEventListener('touchmove', drag, { passive: false });
  document.addEventListener('touchend', up);
};
export default function EdgePoint({
  position,
  onUpdate,
  onUpdateEnd,
  ...rest
}) {
  return (
    <div
      className={`tr-transform__scalepoint tr-transform__scalepoint--${position}`}
      onMouseDown={e =>
        onScaleHandleMouseDown(
          e,
          {
            x: rest.x,
            y: rest.y,
            scaleX: rest.scaleX,
            scaleY: rest.scaleY,
            width: rest.width,
            height: rest.height,
            angle: rest.angle,
            scaleLimit: 0.4
          },
          onUpdate,
          position,
          onUpdateEnd
        )
      }
      onTouchStart={e =>
        onScaleHandleTouchDown(
          e,
          {
            x: rest.x,
            y: rest.y,
            scaleX: rest.scaleX,
            scaleY: rest.scaleY,
            width: rest.width,
            height: rest.height,
            angle: rest.angle,
            scaleLimit: 0.4
          },
          onUpdate,
          position,
          onUpdateEnd
        )
      }
    />
  );
}
