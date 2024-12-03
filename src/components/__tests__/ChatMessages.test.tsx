import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChatMessages } from '../chat/ChatMessages';

describe('ChatMessages', () => {
  const mockMessages = [
    { id: '1', role: 'user', content: 'Hello' },
    { id: '2', role: 'assistant', content: 'Hi there!' },
  ];

  it('renders all messages', () => {
    render(<ChatMessages messages={mockMessages} />);
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
  });

  it('shows correct role labels', () => {
    render(<ChatMessages messages={mockMessages} />);
    
    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('AI Mentor')).toBeInTheDocument();
  });

  it('handles empty message list', () => {
    render(<ChatMessages messages={[]} />);
    const container = screen.getByRole('region');
    expect(container).toBeInTheDocument();
    expect(container.children).toHaveLength(0);
  });
});