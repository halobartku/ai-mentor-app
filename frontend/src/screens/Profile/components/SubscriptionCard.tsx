import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Crown, ChevronRight } from 'lucide-react-native';
import { format } from 'date-fns';

interface SubscriptionCardProps {
  tier: string;
  expiresAt?: string;
  onUpgrade?: () => void;
}

const Container = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const Header = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const TierContainer = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const TierText = styled(Text)`
  font-size: ${({ theme }) => theme.typography.h3.fontSize}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-left: ${({ theme }) => theme.spacing.sm}px;
  text-transform: capitalize;
`;

const ExpiryText = styled(Text)`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const UpgradeContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing.md}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
`;

const UpgradeText = styled(Text)`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.primary};
`;

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  tier,
  expiresAt,
  onUpgrade
}) => {
  return (
    <Container onPress={onUpgrade} disabled={!onUpgrade}>
      <Header>
        <TierContainer>
          <Crown
            size={24}
            color={tier === 'premium' ? '#FFD700' : '#666'}
          />
          <TierText>{tier} Plan</TierText>
        </TierContainer>
      </Header>

      {expiresAt && (
        <ExpiryText>
          Expires: {format(new Date(expiresAt), 'MMMM d, yyyy')}
        </ExpiryText>
      )}

      {tier !== 'premium' && (
        <UpgradeContainer>
          <UpgradeText>Upgrade to Premium</UpgradeText>
          <ChevronRight size={20} color="#007AFF" />
        </UpgradeContainer>
      )}
    </Container>
  );
};