import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Check } from 'lucide-react-native';

interface PlanProps {
  plan: {
    id: string;
    name: string;
    price: number;
    features: string[];
  };
  onSubscribe: () => void;
  isLoading: boolean;
}

const Container = styled(View)`
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const Header = styled(View)`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const PlanName = styled(Text)`
  font-size: ${({ theme }) => theme.typography.h2.fontSize}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const Price = styled(Text)`
  font-size: ${({ theme }) => theme.typography.h3.fontSize}px;
  color: ${({ theme }) => theme.colors.primary};
`;

const FeatureList = styled(View)`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const FeatureItem = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const FeatureText = styled(Text)`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.text};
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

const SubscribeButton = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  align-items: center;
`;

const ButtonText = styled(Text)`
  color: white;
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  font-weight: bold;
`;

export const PlanCard: React.FC<PlanProps> = ({ plan, onSubscribe, isLoading }) => {
  return (
    <Container>
      <Header>
        <PlanName>{plan.name}</PlanName>
        <Price>${plan.price}/month</Price>
      </Header>

      <FeatureList>
        {plan.features.map((feature, index) => (
          <FeatureItem key={index}>
            <Check size={20} color="#34C759" />
            <FeatureText>{feature}</FeatureText>
          </FeatureItem>
        ))}
      </FeatureList>

      <SubscribeButton
        onPress={onSubscribe}
        disabled={isLoading}
        activeOpacity={0.7}
      >
        <ButtonText>
          {isLoading ? 'Processing...' : 'Subscribe Now'}
        </ButtonText>
      </SubscribeButton>
    </Container>
  );
};