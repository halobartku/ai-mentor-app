import React from 'react';
import { View, Text, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react-native';

interface Insight {
  type: string;
  category: string;
  message: string;
}

interface InsightsListProps {
  insights: Insight[];
}

const Container = styled(View)`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 3;
`;

const Title = styled(Text)`
  font-size: ${({ theme }) => theme.typography.h3.fontSize}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const InsightItem = styled(View)`
  flex-direction: row;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const IconContainer = styled(View)<{ category: string }>`
  margin-right: ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  background-color: ${({ theme, category }) => 
    category === 'improvement' ? theme.colors.warning :
    category === 'achievement' ? theme.colors.success :
    theme.colors.info};
`;

const Message = styled(Text)`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.text};
`;

const getIcon = (category: string) => {
  switch (category) {
    case 'improvement':
      return <AlertCircle size={24} color="white" />;
    case 'achievement':
      return <CheckCircle size={24} color="white" />;
    default:
      return <TrendingUp size={24} color="white" />;
  }
};

export const InsightsList: React.FC<InsightsListProps> = ({ insights }) => {
  const renderInsight = ({ item }: { item: Insight }) => (
    <InsightItem>
      <IconContainer category={item.category}>
        {getIcon(item.category)}
      </IconContainer>
      <Message>{item.message}</Message>
    </InsightItem>
  );

  return (
    <Container>
      <Title>Insights & Recommendations</Title>
      <FlatList
        data={insights}
        renderItem={renderInsight}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};