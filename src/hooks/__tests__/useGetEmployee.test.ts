import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import useGetEmployees from '../useGetEmployees';

const mockUseQuery = useQuery as Mock
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

describe('useGetEmployee', () => {
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
  });

  it('should return employees from data source', () => {
    const { result } = renderHook(() => useGetEmployees());
    expect(result.current.data).toStrictEqual([
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
    ]);
  });
});
