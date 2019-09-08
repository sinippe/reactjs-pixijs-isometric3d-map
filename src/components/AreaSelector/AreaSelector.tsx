import React from 'react';
import styled from 'styled-components';

export type AreaSelectorProps = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function AreaSelector(props: AreaSelectorProps) {
  let { x, y, width, height } = props;
  if (width < 0) {
    width = Math.abs(width);
    x -= width;
  }
  if (height < 0) {
    height = Math.abs(height);
    y -= height;
  }

  const AreaContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
  `;
  const Area = styled.div`
    position: absolute;
    border: 4px solid black;
    background: rgba(255, 255, 255, 0.2);
    z-index: 9999;
    pointer-events: none;
    top: ${y}px;
    left: ${x}px;
    width: ${width}px;
    height: ${height}px;
  `;
  return (
    <AreaContainer>
      <Area></Area>
    </AreaContainer>
  );
}
