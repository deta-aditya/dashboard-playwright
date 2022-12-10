import { Key, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Space, Input, Button, Radio, Table, Tag, message, Modal } from 'antd'
import { UserOutlined, SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as css from './App.styles';

type EmployeeStatus = 'active' | 'inactive'
type EmployeeStatusFilter = EmployeeStatus | 'all-status'

type StatusMutationPayload = {
  ids: string[]
  status: EmployeeStatus
}

type StatusMutationResponse = {
  success: boolean
}

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
  const [checkedEmployees, setCheckedEmployees] = useState<string[]>([]);
  const navigate = useNavigate();

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
            return <Tag className={`status-${record.name.toLowerCase()}`} color="green">Active</Tag>;
          case 'inactive':
            return <Tag className={`status-${record.name.toLowerCase()}`} color="red">Inactive</Tag>;
        }
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record: Employee) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => navigate(`/edit/${record.id}`)}>Edit</Button>
          <Button size="small" icon={<DeleteOutlined />} onClick={() => handleDelete([record.id])}>Delete</Button>
        </Space>
      )
    },
  ];
  
  const queryClient = useQueryClient()
  const { mutate: mutateStatus, isLoading: isMutatingStatus } = useMutation<StatusMutationResponse, unknown, StatusMutationPayload>({
    mutationFn: payload => {
      return fetch('http://localhost:3000/employees/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }).then(res => res.json());
    },
    onSuccess: (data, payload) => {
      if (data.success) {
        message.success(`Successfully ${payload.status === 'active' ? 'activated' : 'deactivated'} ${checkedEmployees.length} employees`);
        queryClient.invalidateQueries({ queryKey: ['employees'] })
        return;
      }
      message.error('Uh oh, something is wrong! Check your internet connection and try again');
    },
    onError: () => {
      message.error('Uh oh, something is wrong! Check your internet connection and try again');
    },
    retry: false,
  })

  const handleActivateBatch = () => {
    mutateStatus({
      ids: checkedEmployees,
      status: 'active'
    })
  }

  const handleDeactivateBatch = () => {
    mutateStatus({
      ids: checkedEmployees,
      status: 'inactive'
    })
  }

  const handleDelete = (ids: string[]) => {
    Modal.confirm({
      title: `Are you sure to delete ${ids.length} employees?`,
      icon: <ExclamationCircleFilled />,
      onOk: () => {
        //
      },
    })
  }

  const handleCheckEmployees = (values: Key[]) => {
    setCheckedEmployees(values.map(key => String(key)));
  }

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
        <Button type="primary" onClick={() => navigate('/create')}>
          <PlusOutlined /> Add New Employee
        </Button>
      </div>
      {checkedEmployees.length > 0 && (
        <Space size="middle" className={css.selectionBar}>
          <b>{checkedEmployees.length} employees selected</b>
          <Button onClick={() => handleDelete(checkedEmployees)} icon={<DeleteOutlined />}>Delete</Button>
          <Button loading={isMutatingStatus} onClick={handleActivateBatch} icon={<CheckCircleOutlined />}>Activate</Button>
          <Button loading={isMutatingStatus} onClick={handleDeactivateBatch} icon={<CloseCircleOutlined />}>Deactivate</Button>
        </Space>
      )}
      <Table
        loading={isLoading}
        rowSelection={{
          columnWidth: '50px',
          selectedRowKeys: checkedEmployees,
          onChange: handleCheckEmployees,
        }}
        size="middle"
        dataSource={dataSource}
        columns={columns}
      />
    </>
  )
}

export default EmployeeList
