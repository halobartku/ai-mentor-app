import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import styled from 'styled-components/native';

interface CircularProgressProps {
  progress: number;
  size: number;
  strokeWidth: number;
  progressColor: string;
  backgroundColor: string;
}

const Container = styled(View)`
  justify-content: center;
  align-items: center;
`;

export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size,
  strokeWidth,
  progressColor,
  backgroundColor
}) => {
  const radius = (size - strokeWidth) / 2;
  const circleCircumference = radius * 2 * Math.PI;
  const strokeDashoffset = circleCircumference - (progress / 100) * circleCircumference;

  return (
    <Container>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circleCircumference} ${circleCircumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </Container>
  );
};