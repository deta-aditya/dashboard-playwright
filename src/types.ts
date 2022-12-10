export type EmployeeStatus = 'active' | 'inactive'

export type EmployeeStatusFilter = EmployeeStatus | 'all-status'

export interface Employee {
  id: string;
  name: string;
  title: string;
  organization: string;
  status: EmployeeStatus;
}
