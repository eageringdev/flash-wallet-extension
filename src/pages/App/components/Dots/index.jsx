import React from 'react';
import './index.scss';

const Dots = ({ current, totalCount, activeColor, inActiveColor, ...rest }) => {
  const dotsArray = Array(totalCount).fill(0);
  return (
    <div className={'display-v-h-center ' + rest.className || ''}>
      {dotsArray.map((_, index) => {
        if (current === index) {
          return (
            <div
              key={'dots' + index}
              className="pagination-dot"
              style={{ backgroundColor: activeColor }}
            ></div>
          );
        } else {
          return (
            <div
              key={'dots' + index}
              className="pagination-dot"
              style={{ backgroundColor: inActiveColor }}
            ></div>
          );
        }
      })}
    </div>
  );
};

export default Dots;
