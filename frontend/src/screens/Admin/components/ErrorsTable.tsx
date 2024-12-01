import React from 'react';
import { View, Text, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { format } from 'date-fns';

interface ErrorLog {
  id: string;
  errorMessage: string;
  timestamp: string;
  context: any;
}

const Container = styled(View)`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  overflow: hidden;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 3;
`;

const Row = styled(View)<{ isHeader?: boolean }>`
  flex-direction: row;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme, isHeader }) =>
    isHeader ? theme.colors.light : 'white'};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const Cell = styled(View)<{ flex?: number }>`
  flex: ${({ flex }) => flex || 1};
`;

const HeaderText = styled(Text)`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const CellText = styled(Text)`
  color: ${({ theme }) => theme.colors.text};
`;

const TimeText = styled(Text)`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
`;

export const ErrorsTable = () => {
  const renderHeader = () => (
    <Row isHeader>
      <Cell flex={2}>
        <HeaderText>Error</HeaderText>
      </Cell>
      <Cell>
        <HeaderText>Time</HeaderText>
      </Cell>
    </Row>
  );

  const renderItem = ({ item }: { item: ErrorLog }) => (
    <Row>
      <Cell flex={2}>
        <CellText>{item.errorMessage}</CellText>
      </Cell>
      <Cell>
        <TimeText>
          {format(new Date(item.timestamp), 'MMM d, HH:mm')}
        </TimeText>
      </Cell>
    </Row>
  );

  return (
    <Container>
      {renderHeader()}
      <FlatList
        data={[]}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </Container>
  );
};