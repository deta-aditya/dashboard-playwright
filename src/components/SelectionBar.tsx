import { Space, Button, message } from 'antd'
import { DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as css from '../App.styles';
import { EmployeeStatus } from '../types';

interface SelectionBarProps {
  checkedEmployees: string[];
  onDelete: () => void;
}

interface StatusMutationPayload  {
  ids: string[]
  status: EmployeeStatus
}

interface StatusMutationResponse {
  success: boolean
}

function SelectionBar({ checkedEmployees, onDelete }: SelectionBarProps) {
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

  if (checkedEmployees.length === 0) {
    return null;
  }

  return (
    <Space size="middle" className={css.selectionBar}>
      <b>{checkedEmployees.length} employees selected</b>
      <Button onClick={onDelete} icon={<DeleteOutlined />}>Delete</Button>
      <Button loading={isMutatingStatus} onClick={handleActivateBatch} icon={<CheckCircleOutlined />}>Activate</Button>
      <Button loading={isMutatingStatus} onClick={handleDeactivateBatch} icon={<CloseCircleOutlined />}>Deactivate</Button>
    </Space>
  )
}

export default SelectionBar
