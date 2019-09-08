import React from 'react';
import styled from 'styled-components';

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function AreaSelector(props: Props) {
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
    top: ${props.y}px;
    left: ${props.x}px;
    width: ${props.width}px;
    height: ${props.height}px;
  `;
  return (
    <AreaContainer>
      <Area></Area>
    </AreaContainer>
  );
}
