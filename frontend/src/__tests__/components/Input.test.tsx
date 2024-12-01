import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import { Input } from '../../components/common/Input';
import { theme } from '../../theme';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('Input Component', () => {
  it('renders correctly with label', () => {
    const { getByText, getByPlaceholderText } = render(
      <Input
        label="Test Label"
        placeholder="Test Placeholder"
        value=""
        onChangeText={() => {}}
      />,
      { wrapper }
    );

    expect(getByText('Test Label')).toBeTruthy();
    expect(getByPlaceholderText('Test Placeholder')).toBeTruthy();
  });

  it('handles text changes', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input
        placeholder="Test Placeholder"
        value=""
        onChangeText={onChangeText}
      />,
      { wrapper }
    );

    fireEvent.changeText(getByPlaceholderText('Test Placeholder'), 'new text');
    expect(onChangeText).toHaveBeenCalledWith('new text');
  });

  it('shows error message when provided', () => {
    const { getByText } = render(
      <Input
        value=""
        onChangeText={() => {}}
        error="Test Error"
      />,
      { wrapper }
    );

    expect(getByText('Test Error')).toBeTruthy();
  });

  it('applies secure text entry when specified', () => {
    const { getByPlaceholderText } = render(
      <Input
        placeholder="Password"
        value=""
        onChangeText={() => {}}
        secureTextEntry
      />,
      { wrapper }
    );

    expect(getByPlaceholderText('Password').props.secureTextEntry).toBe(true);
  });
});