import React from 'react';

// import styles
import { colors } from '../../styles';

const Bars = ({ total = 0, current, color = colors.primary5, ...rest }) => {
  const totalArray = Array(total).fill(0);
  return (
    <div
      className={
        'd-flex flex-row align-item-center justify-content-around ' +
          rest.className || ''
      }
      style={{ height: '8px' }}
    >
      {totalArray.map((e, index) => {
        return (
          <div
            className="ml-1"
            key={'bars_' + index}
            style={{
              flex: 1,
              borderRadius: 2,
              backgroundColor: index <= current ? color : colors.grey23,
            }}
          ></div>
        );
      })}
    </div>
  );
};

export default Bars;
