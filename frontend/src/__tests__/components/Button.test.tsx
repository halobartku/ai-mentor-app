import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import { Button } from '../../components/common/Button';
import { theme } from '../../theme';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('Button Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={() => {}} />,
      { wrapper }
    );

    expect(getByText('Test Button')).toBeTruthy();
  });

  it('handles press events', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPress} />,
      { wrapper }
    );

    fireEvent.press(getByText('Test Button'));
    expect(onPress).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    const { getByTestId } = render(
      <Button title="Test Button" onPress={() => {}} loading />,
      { wrapper }
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('disables button when specified', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPress} disabled />,
      { wrapper }
    );

    fireEvent.press(getByText('Test Button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});