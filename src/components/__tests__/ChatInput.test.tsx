import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ChatInput } from '../chat/ChatInput';

describe('ChatInput', () => {
  const mockProps = {
    onSubmit: vi.fn(),
    isLoading: false,
    input: '',
    setInput: vi.fn(),
  };

  it('renders input field', () => {
    render(<ChatInput {...mockProps} />);
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
  });

  it('handles submit on button click', () => {
    render(<ChatInput {...mockProps} input="test message" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockProps.onSubmit).toHaveBeenCalledWith('test message');
  });

  it('handles submit on Enter key', () => {
    render(<ChatInput {...mockProps} input="test message" />);
    
    const textarea = screen.getByPlaceholderText('Type your message...');
    fireEvent.keyDown(textarea, { key: 'Enter' });

    expect(mockProps.onSubmit).toHaveBeenCalledWith('test message');
  });

  it('disables submit when loading', () => {
    render(<ChatInput {...mockProps} isLoading={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});