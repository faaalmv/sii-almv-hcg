import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import React, { useState } from 'react';
import Toast from './Toast';

// Mock the Icon component to prevent errors in the test environment
vi.mock('./icons/Icon', () => ({
  default: {
    CheckCircle: (props: any) => <svg {...props} data-testid="check-icon" />,
    X: (props: any) => <svg {...props} data-testid="x-icon" />,
  },
}));

// A simple wrapper component to simulate re-renders
const ToastWrapper = ({ initialOnClose }: { initialOnClose: () => void }) => {
  const [count, setCount] = useState(0);
  const [onClose, setOnClose] = useState(() => initialOnClose);

  const handleRerender = () => {
    // Each re-render will create a new function for onClose, simulating the bug
    setOnClose(() => initialOnClose);
    setCount(count + 1);
  };

  return (
    <div>
      <button onClick={handleRerender}>Rerender</button>
      <Toast message="Test Toast" onClose={onClose} />
    </div>
  );
};


describe('Toast component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should close after 5 seconds even if parent re-renders with a new onClose function', async () => {
    const handleClose = vi.fn();
    render(<ToastWrapper initialOnClose={handleClose} />);

    // Check that the toast is initially visible
    expect(screen.getByText('Test Toast')).toBeInTheDocument();

    // Simulate re-renders within the 5-second window
    fireEvent.click(screen.getByText('Rerender'));
    vi.advanceTimersByTime(1000);
    fireEvent.click(screen.getByText('Rerender'));
    vi.advanceTimersByTime(1000);
    fireEvent.click(screen.getByText('Rerender'));
    vi.advanceTimersByTime(1000);

    // Now, advance time to the 5-second mark from the initial render
    vi.advanceTimersByTime(2000);

    // With the bug, the toast will still be visible. After the fix, it should be gone.
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Test Toast')).not.toBeInTheDocument();
  });
});