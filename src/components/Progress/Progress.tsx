import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core';
import './Progress.scss';

type Props = {
  color?: string;
};

export default function Progress(props: Props) {
  const ColorCircularProgress = withStyles({
    root: {
      color: props.color || '#000',
      backgroundColor: 'none'
    }
  })(CircularProgress);

  return (
    <div className="loader-container">
      <ColorCircularProgress className="progress"></ColorCircularProgress>
      <p>Fetching data...</p>
    </div>
  );
}
