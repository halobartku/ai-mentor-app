import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';

interface ListSectionProps {
  children: React.ReactNode;
  header?: string;
  footer?: string;
}

const Container = styled(View)`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const Header = styled(Text)`
  font-size: ${({ theme }) => theme.typography.sizes.footnote}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  margin: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.lg}px;
`;

const Content = styled(View)`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: ${({ theme }) => theme.colors.separator};
`;

const Footer = styled(Text)`
  font-size: ${({ theme }) => theme.typography.sizes.footnote}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.lg}px;
`;

const Separator = styled(View)`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.separator};
  margin-left: ${({ theme }) => theme.spacing.lg}px;
`;

export const ListSection: React.FC<ListSectionProps> = ({
  children,
  header,
  footer
}) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <Container>
      {header && <Header>{header}</Header>}
      <Content>
        {childrenArray.map((child, index) => (
          <React.Fragment key={index}>
            {child}
            {index < childrenArray.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </Content>
      {footer && <Footer>{footer}</Footer>}
    </Container>
  );
};