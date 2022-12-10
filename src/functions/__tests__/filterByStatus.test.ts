import { describe, expect, it } from 'vitest';
import filterByStatus from '../filterByStatus';

describe('filterByStatus', () => {
  it('should return all employees when all status filter is on', () => {
    const result = filterByStatus([
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
    ], 'all-status')

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

  it('should only return active employees when active filter is on', () => {
    const result = filterByStatus([
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
    ], 'active')

    expect(result).toStrictEqual([
      {
        id: '1',
        key: '1',
        name: 'Test Name 1',
        title: 'Tester',
        organization: 'Core',
        status: 'active',
      },
    ])
  })

  it('should only return inactive employees when inactive filter is on', () => {
    const result = filterByStatus([
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
    ], 'inactive')

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
