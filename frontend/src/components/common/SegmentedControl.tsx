import React from 'react';
import { View, Text, TouchableWithoutFeedback, Animated } from 'react-native';
import styled from 'styled-components/native';

interface SegmentedControlProps {
  segments: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

const Container = styled(View)`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  padding: ${({ theme }) => theme.spacing.xs}px;
  flex-direction: row;
`;

const SegmentContainer = styled(View)`
  flex: 1;
  height: 32px;
  justify-content: center;
  align-items: center;
`;

const SegmentText = styled(Text)<{ isSelected: boolean }>`
  color: ${({ theme, isSelected }) => 
    isSelected ? theme.colors.text.inverse : theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.sizes.callout}px;
  font-weight: ${({ theme }) => theme.typography.weights.medium};
`;

const Indicator = styled(Animated.View)`
  position: absolute;
  height: 28px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
`;

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  segments,
  selectedIndex,
  onChange
}) => {
  const [containerWidth, setContainerWidth] = React.useState(0);
  const indicatorAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(indicatorAnim, {
      toValue: selectedIndex,
      useNativeDriver: true,
      speed: 20,
      bounciness: 0
    }).start();
  }, [selectedIndex]);

  const segmentWidth = containerWidth / segments.length;
  const indicatorStyle = {
    width: segmentWidth - 8,
    transform: [{
      translateX: indicatorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [4, segmentWidth + 4]
      })
    }]
  };

  return (
    <Container onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
      <Indicator style={indicatorStyle} />
      {segments.map((segment, index) => (
        <TouchableWithoutFeedback
          key={segment}
          onPress={() => onChange(index)}
        >
          <SegmentContainer>
            <SegmentText isSelected={selectedIndex === index}>
              {segment}
            </SegmentText>
          </SegmentContainer>
        </TouchableWithoutFeedback>
      ))}
    </Container>
  );
};