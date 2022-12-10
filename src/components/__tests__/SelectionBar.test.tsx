import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { useMutation } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import SelectionBar from '../SelectionBar';

const mockUseMutation = useMutation as Mock
vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
  useQueryClient: () => ({ 
    invalidateQuery: vi.fn(),
  }),
}));

describe('SelectionBar', () => {
  beforeEach(() => {
    mockUseMutation.mockImplementation(({ onSuccess }) => {
      const mutate = (payload: any) => {
        onSuccess({ success: true }, payload)
      }
      return { mutate, isLoading: false }
    });
  });

  it('should not show selection bar when selected employees is empty', () => {
    const { unmount } = render(<SelectionBar checkedEmployees={[]} onDelete={() => {}} />);
    expect(screen.queryByText(/employees selected/)).toBeNull();
    unmount();
  });

  it('should show selection bar with the number of selected employee', () => {
    const { unmount } = render(<SelectionBar checkedEmployees={['1', '2']} onDelete={() => {}} />);
    expect(screen.queryByText(/2 employees selected/)).not.toBeNull();
    unmount();
  });

  it('should activate selected employees when activate button is clicked', async () => {
    const { unmount } = render(<SelectionBar checkedEmployees={['1', '2']} onDelete={() => {}} />);

    fireEvent.click(screen.queryByText(/Activate/) as HTMLButtonElement);

    await waitFor(() => {
      expect(screen.queryByText(/Successfully activated 2 employees/)).not.toBeNull();
      unmount();
    });
  });

  it('should deactivate selected employees when deactivate button is clicked', async () => {
    const { unmount } = render(<SelectionBar checkedEmployees={['1', '2']} onDelete={() => {}} />);

    fireEvent.click(screen.queryByText(/Deactivate/) as HTMLButtonElement);

    await waitFor(() => {
      expect(screen.queryByText(/Successfully deactivated 2 employees/)).not.toBeNull();
      unmount();
    });
  });

  it('should should emit onDelete event when delete button is clicked', async () => {
    const onDelete = vi.fn();
    const { unmount } = render(<SelectionBar checkedEmployees={['1', '2']} onDelete={onDelete} />);

    fireEvent.click(screen.queryByText(/Delete/) as HTMLButtonElement);

    expect(onDelete).toBeCalled();
    unmount();
  });
});
