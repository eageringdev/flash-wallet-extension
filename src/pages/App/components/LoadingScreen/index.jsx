import React from 'react';
import './index.scss';

// import styles
import { colors } from '../../styles';

export default function LoadingScreen() {
  return (
    <div className="display-v-h-center h-100 w-100">
      <div className="text-center">
        <div
          className="spinner-border loading-spinner"
          role="status"
          style={{ color: colors.primary5 }}
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  );
}
