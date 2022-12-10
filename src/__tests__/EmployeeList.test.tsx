import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import useGetEmployees from '../hooks/useGetEmployees';
import EmployeeList from '../EmployeeList';

const mockUseGetEmployees = useGetEmployees as Mock
vi.mock('../hooks/useGetEmployees');

vi.mock('@tanstack/react-query', () => ({
  useMutation: () => ({ mutate: vi.fn(), isLoading: false }),
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
    mockUseGetEmployees.mockReturnValue({
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
        {
          id: '3',
          name: 'Test Name 3',
          title: 'Quality Assurance',
          organization: 'Core',
          status: 'inactive',
        },
      ],
      isLoading: false,
    });
  });

  it('should display employees based on filtered data result', () => {
    const { unmount } = render(<EmployeeList />);

    fireEvent.click(screen.getAllByText(/^Inactive$/)[0]);
    fireEvent.change(screen.getAllByPlaceholderText<HTMLInputElement>(/Search/)[0], { target: { value: 'name 2' } });
  
    expect(screen.queryByText(/Test Name 2/)).not.toBeNull();
    expect(screen.queryByText(/Productivity/)).not.toBeNull();
    expect(screen.queryByText(/Branch/)).not.toBeNull();
    expect(screen.queryAllByText(/Inactive/)[1]).not.toBeNull();

    unmount();
  });

  it('should show error message when data source is error', async () => {
    mockUseGetEmployees.mockImplementationOnce(({ onError }) => {
      onError()
      return { loading: false, data: [] }
    })
    const { unmount } = render(<EmployeeList />);

    await waitFor(() => {
      expect(screen.queryByText(/Uh oh, something is wrong!/)).not.toBeNull();
      unmount();
    });
  });

  it('should go to employee creation page when add button is clicked', () => {
    const { unmount } = render(<EmployeeList />);
    
    fireEvent.click(screen.getAllByText(/Add New Employee/)[0]);

    expect(mockNavigate).toBeCalledWith('/create');
    unmount();
  });

  it('should go to employee edit page with correct employee when edit button is clicked', () => {
    const { unmount } = render(<EmployeeList />);
    
    fireEvent.click(screen.getAllByText(/Edit/)[0]);

    expect(mockNavigate).toBeCalledWith('/edit/1');
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
