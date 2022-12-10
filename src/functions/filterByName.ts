import { Employee } from "../types";

const filterByName = (employees: Employee[], searchText: string) => {
  const result = [];
  
  for (let employee of employees) {
    if (searchText && !employee.name.toLowerCase().includes(searchText.toLowerCase())) {
      continue;
    }
    result.push({
      key: employee.id,
      ...employee,
    });
  }

  return result;
}

export default filterByName
