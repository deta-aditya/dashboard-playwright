import { Employee, EmployeeStatusFilter } from "../types";

export const filterByStatus = (employees: Employee[], activeFilter: EmployeeStatusFilter) => {
  const result = [];
  
  for (let employee of employees) {
    if (activeFilter !== 'all-status' && employee.status !== activeFilter) {
      continue;
    }
    result.push({
      key: employee.id,
      ...employee,
    });
  }

  return result;
}

export default filterByStatus
