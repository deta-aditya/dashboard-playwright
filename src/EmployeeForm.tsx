import { Avatar, Space, Input, Button, Radio, Form, Select, notification, message } from 'antd'
import { UserOutlined, LeftOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import * as css from './App.styles';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type EmployeeStatus = 'active' | 'inactive'
interface EmployeePayload {
  name: string;
  title: string;
  organization: string;
  status: EmployeeStatus;
}
interface SaveEmployeeResponse {
  id: string,
  success: boolean,
}

function EmployeeForm() {
  const [form] = Form.useForm();
  const queryClient = useQueryClient()
  const navigate = useNavigate();

  const { mutate: saveEmployee, isLoading } = useMutation<SaveEmployeeResponse, unknown, EmployeePayload>({
    mutationFn: payload => {
      return fetch('http://localhost:3000/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }).then(res => res.json());
    },
    onSuccess: (data) => {
      if (data.success) {
        message.success(`Successfully saved new employee`);
        queryClient.invalidateQueries({ queryKey: ['employees'] });
        navigate('/');
      }
    },
    onError: () => {
      message.error('Uh oh, something is wrong! Check your internet connection and try again')
    },
  });

  const handleFinishCreateEmployee = (data: EmployeePayload) => {
    saveEmployee(data)
  }

  return (
    <>
      <div className={css.contentHeader}>
        <Space>
          <Link to="/">
            <Button type="link" icon={<LeftOutlined />}>
              Back
            </Button>
          </Link>
          <h1 className={css.contentTitle}>Add Employee</h1>
        </Space>
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <span>Admin</span>
        </Space>
      </div>
      <Form
        form={form}
        className={css.employeeForm}
        labelCol={{ offset: 3, span: 4 }}
        wrapperCol={{ span: 10 }}
        onFinish={handleFinishCreateEmployee}
        initialValues={{ status: 'active' }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Name is required!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Title is required!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Organization"
          name="organization"
          rules={[{ required: true, message: 'Title is required!' }]}
        >
          <Select onChange={(value) => form.setFieldValue('organization', value)}>
            <Select.Option value={'Core'}>Core</Select.Option>
            <Select.Option value={'Payment'}>Payment</Select.Option>
            <Select.Option value={'Insight'}>Insight</Select.Option>
            <Select.Option value={'Communication'}>Communication</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Status" name="status">
          <Radio.Group>
            <Radio value="active">Active</Radio>
            <Radio value="inactive">Inactive</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 7, span: 17 }}>
          <Button loading={isLoading} type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default EmployeeForm
