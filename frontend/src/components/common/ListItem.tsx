import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import styled from 'styled-components/native';
import { ChevronRight } from 'lucide-react-native';

interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showChevron?: boolean;
  onPress?: () => void;
  destructive?: boolean;
}

const Container = styled(TouchableHighlight).attrs(({ theme }) => ({
  underlayColor: theme.colors.background.secondary
}))`
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const Content = styled(View)`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.lg}px;
  min-height: 44px;
`;

const IconContainer = styled(View)`
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const TextContainer = styled(View)`
  flex: 1;
`;

const Title = styled(Text)<{ destructive?: boolean }>`
  font-size: ${({ theme }) => theme.typography.sizes.body}px;
  color: ${({ theme, destructive }) => 
    destructive ? theme.colors.danger : theme.colors.text.primary};
`;

const Subtitle = styled(Text)`
  font-size: ${({ theme }) => theme.typography.sizes.footnote}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const RightContainer = styled(View)`
  margin-left: ${({ theme }) => theme.spacing.md}px;
`;

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  showChevron = false,
  onPress,
  destructive = false
}) => {
  return (
    <Container onPress={onPress} disabled={!onPress}>
      <Content>
        {leftIcon && <IconContainer>{leftIcon}</IconContainer>}
        <TextContainer>
          <Title destructive={destructive}>{title}</Title>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </TextContainer>
        {(rightIcon || showChevron) && (
          <RightContainer>
            {rightIcon || <ChevronRight size={20} color="#C7C7CC" />}
          </RightContainer>
        )}
      </Content>
    </Container>
  );
};