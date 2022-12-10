import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Employee } from '../types';

interface UseGetEmployeesParams {
  onError?: UseQueryOptions['onError'];
}

const useGetEmployees = (params?: UseGetEmployeesParams) => {
  const { onError } = params || {}
  const { isLoading, data } = useQuery({
    queryKey: ['employees'],
    queryFn: () => fetch('http://localhost:3000/employees').then(res => res.json()),
    select: data => data as Employee[],
    onError,
  });

  return { isLoading, data }
}

export default useGetEmployees
