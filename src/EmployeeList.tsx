import { Key, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Space, Input, Button, Radio, Table, Tag, message } from 'antd'
import { UserOutlined, SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useQuery } from '@tanstack/react-query';
import * as css from './App.styles';

type EmployeeStatus = 'active' | 'inactive'
type EmployeeStatusFilter = EmployeeStatus | 'all-status'

interface Employee {
  id: string;
  name: string;
  title: string;
  organization: string;
  status: EmployeeStatus;
}

function EmployeeList() {
  const [activeFilter, setActiveFilter] = useState<EmployeeStatusFilter>('all-status');
  const [searchText, setSearchText] = useState('');
  const [checkedEmployees, setCheckedEmployees] = useState<Key[]>([]);

  const { isLoading, data } = useQuery({ 
    queryKey: ['employees'], 
    queryFn: () => fetch('http://localhost:3000/employees').then(res => res.json()),
    select: data => data as Employee[],
    onError: () => {
      message.error('Uh oh, something is wrong! Check your internet connection and try again')
    },
  });

  const dataSource = [];
  for (let employee of (data || [])) {
    if (activeFilter !== 'all-status' && employee.status !== activeFilter) {
      continue;
    }
    if (searchText && !employee.name.toLowerCase().includes(searchText.toLowerCase())) {
      continue;
    }

    dataSource.push({
      key: employee.id,
      ...employee,
    });
  };

  const columns: ColumnsType<typeof dataSource[number]> = [
    {
      width: '200px',
      title: 'Name',
      dataIndex: 'name',
    },
    {
      width: '250px',
      title: 'Title',
      dataIndex: 'title',
    },
    {
      width: '250px',
      title: 'Organization',
      dataIndex: 'organization',
    },
    {
      width: '150px',
      title: 'Status',
      dataIndex: 'status',
      render: (value: EmployeeStatus, record: Employee) => {
        switch (value) {
          case 'active':
            return <Tag className={`status-${record.name.toLowerCase()}`} color="green">Active</Tag>
          case 'inactive':
            return <Tag className={`status-${record.name.toLowerCase()}`} color="red">Inactive</Tag>
        }
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: () => (
        <Space>
          <Button size="small" icon={<EditOutlined />}>Edit</Button>
          <Button size="small" icon={<DeleteOutlined />}>Delete</Button>
        </Space>
      )
    },
  ];

  return (
    <>
      <div className={css.contentHeader}>
        <h1 className={css.contentTitle}>Employee List</h1>
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <span>Admin</span>
        </Space>
      </div>
      <div className={css.secondaryBar}>
        <Space size="middle">
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={css.searchInput}
            placeholder="Search..."
            prefix={<SearchOutlined />}
          />
          <Radio.Group value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}>
            <Radio.Button value="all-status">All Status</Radio.Button>
            <Radio.Button className="filter-active" value="active">Active</Radio.Button>
            <Radio.Button value="inactive">Inactive</Radio.Button>
          </Radio.Group>
        </Space>
        <Link to="/create">
          <Button type="primary">
            <PlusOutlined /> Add New Employee
          </Button>
        </Link>
      </div>
      {checkedEmployees.length > 0 && (
        <Space size="middle" className={css.selectionBar}>
          <b>{checkedEmployees.length} employees selected</b>
          <Button icon={<DeleteOutlined />}>Delete</Button>
          <Button icon={<CheckCircleOutlined />}>Activate</Button>
          <Button icon={<CloseCircleOutlined />}>Deactivate</Button>
        </Space>
      )}
      <Table
        loading={isLoading}
        rowSelection={{
          columnWidth: '50px',
          selectedRowKeys: checkedEmployees,
          onChange: setCheckedEmployees,
        }}
        size="middle"
        dataSource={dataSource}
        columns={columns}
      />
    </>
  )
}

export default EmployeeList
