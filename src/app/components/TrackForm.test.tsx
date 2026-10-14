import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import TrackForm from './TrackForm';

describe('TrackForm', () => {
  it('calls onSubmit with the entered name and color', async () => {
    const handleSubmit = vi.fn();
    render(<TrackForm onSubmit={handleSubmit} />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('New track name'), 'dev');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(handleSubmit).toHaveBeenCalledWith('dev', '#4d9de0');
  });

  it('does not call onSubmit if the name is empty', async () => {
    const handleSubmit = vi.fn();
    render(<TrackForm onSubmit={handleSubmit} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('clears the input after a successful submit', async () => {
    const handleSubmit = vi.fn();
    render(<TrackForm onSubmit={handleSubmit} />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('New track name') as HTMLInputElement;
    await user.type(input, 'dev');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(input.value).toBe('');
  });

  it('shows "Adding..." and disables the button when isPending is true', () => {
    render(<TrackForm onSubmit={vi.fn()} isPending={true} />);
    const button = screen.getByRole('button', { name: /adding/i });
    expect(button).toBeDisabled();
  });
});