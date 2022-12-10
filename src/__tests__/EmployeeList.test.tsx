import { PropsWithChildren } from 'react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import EmployeeList from '../EmployeeList';

const mockUseQuery = useQuery as Mock
const mockUseMutation = useMutation as Mock
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: () => ({ 
    invalidateQuery: vi.fn(),
  }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('EmployeeList', () => {
  beforeEach(() => {
    mockUseQuery.mockReturnValue({
      data: [
        {
          id: '1',
          name: 'Test Name 1',
          title: 'Tester',
          organization: 'Core',
          status: 'active',
        },
        {
          id: '2',
          name: 'Test Name 2',
          title: 'Productivity',
          organization: 'Branch',
          status: 'inactive',
        },
      ],
      isLoading: false,
    });
    mockUseMutation.mockImplementation(({ onSuccess }) => {
      const mutate = (payload: any) => {
        onSuccess({ success: true }, payload)
      }
      return { mutate, isLoading: false }
    });
  });

  it('should display employees from data source', () => {
    const { unmount } = render(<EmployeeList />);
  
    expect(screen.queryByText(/Test Name 1/)).not.toBeNull();
    expect(screen.queryByText(/Tester/)).not.toBeNull();
    expect(screen.queryByText(/Core/)).not.toBeNull();
    expect(screen.queryAllByText(/Active/)[1]).not.toBeNull();

    expect(screen.queryByText(/Test Name 2/)).not.toBeNull();
    expect(screen.queryByText(/Productivity/)).not.toBeNull();
    expect(screen.queryByText(/Branch/)).not.toBeNull();
    expect(screen.queryAllByText(/Inactive/)[1]).not.toBeNull();

    unmount();
  });

  it('should show loading state table when data source is loading', () => {
    mockUseQuery.mockReturnValueOnce({
      data: [],
      isLoading: true,
    });
    const { container, unmount } = render(<EmployeeList />);
    const loadingIndicator = container.querySelector('[aria-live="polite"][aria-busy="true"]')

    expect(loadingIndicator).not.toBeNull();
    unmount();
  });

  it('should show error message when data source is error', async () => {
    mockUseQuery.mockImplementationOnce(({ onError }) => {
      onError()
      return { loading: false, data: [] }
    })
    const { unmount } = render(<EmployeeList />);

    await waitFor(() => {
      expect(screen.queryByText(/Uh oh, something is wrong!/)).not.toBeNull();
      unmount();
    });
  });

  it('should display all employees when there is no search query', () => {
    const { unmount } = render(<EmployeeList />);
    const searchInput = screen.getAllByPlaceholderText<HTMLInputElement>(/Search/)[0];
    
    fireEvent.change(searchInput, { target: { value: '' } });

    expect(screen.queryByText(/Test Name 1/)).not.toBeNull();
    expect(screen.queryByText(/Test Name 2/)).not.toBeNull();
    unmount();
  });

  it('should only display employees whose name matches the search query', () => {
    const { unmount } = render(<EmployeeList />);
    const searchInput = screen.getAllByPlaceholderText<HTMLInputElement>(/Search/)[0];
    
    fireEvent.change(searchInput, { target: { value: 'name 2' } });

    expect(screen.queryByText(/Test Name 1/)).toBeNull();
    expect(screen.queryByText(/Test Name 2/)).not.toBeNull();
    unmount();
  });

  it('should display both active and inactive employees when all status filter is on', () => {
    const { unmount } = render(<EmployeeList />);

    fireEvent.click(screen.getByText(/All Status/));

    expect(screen.queryByText(/Test Name 1/)).not.toBeNull();
    expect(screen.queryByText(/Test Name 2/)).not.toBeNull();
    unmount();
  });

  it('should only display active employees when active filter is on', () => {
    const { unmount } = render(<EmployeeList />);

    fireEvent.click(screen.getAllByText(/^Active$/)[0]);

    expect(screen.queryByText(/Test Name 1/)).not.toBeNull();
    expect(screen.queryByText(/Test Name 2/)).toBeNull();
    unmount();
  });

  it('should only display inactive employees when inactive filter is on', () => {
    const { unmount } = render(<EmployeeList />);

    fireEvent.click(screen.getAllByText(/^Inactive$/)[0]);

    expect(screen.queryByText(/Test Name 1/)).toBeNull();
    expect(screen.queryByText(/Test Name 2/)).not.toBeNull();
    unmount();
  });

  it('should not show selection bar when no employees are selected', () => {
    const { unmount } = render(<EmployeeList />);
    
    expect(screen.queryByText(/employees selected/)).toBeNull();
    unmount();
  });

  it('should show selection bar with the number of selected employee when some row is selected', () => {
    const { unmount } = render(<EmployeeList />);
    
    fireEvent.click(screen.getAllByRole('checkbox')[1]);

    expect(screen.queryByText(/1 employees selected/)).not.toBeNull();
    unmount();
  });

  it('should activate selected employees when activate button is clicked', async () => {
    const { unmount } = render(<EmployeeList />);

    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    fireEvent.click(screen.queryByText(/Activate/) as HTMLButtonElement);

    await waitFor(() => {
      expect(screen.queryByText(/Successfully activated 2 employees/)).not.toBeNull();
      unmount();
    });
  });

  it('should deactivate selected employees when deactivate button is clicked', async () => {
    const { unmount } = render(<EmployeeList />);

    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    fireEvent.click(screen.queryByText(/Deactivate/) as HTMLButtonElement);

    await waitFor(() => {
      expect(screen.queryByText(/Successfully deactivated 2 employees/)).not.toBeNull();
      unmount();
    });
  });

  it('should show delete confirmation modal with number of selected employees when delete button is clicked', async () => {
    const { unmount } = render(<EmployeeList />);

    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    fireEvent.click(screen.queryAllByText(/Delete/)[0]);

    await waitFor(() => {
      expect(screen.queryByText(/Are you sure to delete 2 employees/)).not.toBeNull();
      unmount();
    });
  });

  it('should go to employee creation page when add button is clicked', () => {
    const { unmount } = render(<EmployeeList />);
    
    fireEvent.click(screen.getByText(/Add New Employee/) as HTMLButtonElement);

    expect(mockNavigate).toBeCalledWith('/create')
    unmount();
  });

  it('should go to employee edit page with correct employee when edit button is clicked', () => {
    const { unmount } = render(<EmployeeList />);
    
    fireEvent.click(screen.getAllByText(/Edit/)[0]);

    expect(mockNavigate).toBeCalledWith('/edit/1')
    unmount();
  });

  it('should show delete confirmation modal with correct employee when delete button is clicked', async () => {
    const { unmount } = render(<EmployeeList />);
    
    fireEvent.click(screen.getAllByText(/Delete/)[1]);

    await waitFor(() => {
      expect(screen.queryByText(/Are you sure to delete 1 employees/)).not.toBeNull();
      unmount();
    });
  });
});
