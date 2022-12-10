import { describe, expect, it } from 'vitest';
import filterByName from '../filterByName';

describe('filterByName', () => {
  it('should return all employees when there is no search query', () => {
    const result = filterByName([
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
    ], '')

    expect(result).toStrictEqual([
      {
        id: '1',
        key: '1',
        name: 'Test Name 1',
        title: 'Tester',
        organization: 'Core',
        status: 'active',
      },
      {
        id: '2',
        key: '2',
        name: 'Test Name 2',
        title: 'Productivity',
        organization: 'Branch',
        status: 'inactive',
      },
    ])
  })

  it('should only return employees whose names match the search query', () => {
    const result = filterByName([
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
    ], 'name 2')

    expect(result).toStrictEqual([
      {
        id: '2',
        key: '2',
        name: 'Test Name 2',
        title: 'Productivity',
        organization: 'Branch',
        status: 'inactive',
      },
    ])
  })
});
