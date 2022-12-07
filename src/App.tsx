import { Col, message, Row, Space } from 'antd'
import { DashboardOutlined, UsergroupAddOutlined, LineChartOutlined, FileTextOutlined, SettingOutlined } from '@ant-design/icons';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as css from './App.styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={css.app}>
        <Row>
          <Col className={css.sidebar} span={4}>
            <div className={css.appTitle}>Dashboard Demo</div>
            <div className={css.sidebarLinkGroup}>
              <Space className={css.sidebarLink}>
                <DashboardOutlined />
                Dashboard
              </Space>
              <Space className={css.sidebarLinkActive}>
                <UsergroupAddOutlined />
                Employees
              </Space>
              <Space className={css.sidebarLink}>
                <LineChartOutlined />
                Performances
              </Space>
              <Space className={css.sidebarLink}>
                <FileTextOutlined />
                Reports
              </Space>
              <Space className={css.sidebarLink}>
                <SettingOutlined />
                Settings
              </Space>
            </div>
          </Col>
          <Col className={css.content} span={20}>
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={<EmployeeList />}
                />
                <Route
                  path="/create"
                  element={<EmployeeForm />}
                />
              </Routes>
            </BrowserRouter>
          </Col>
        </Row>
      </div>
    </QueryClientProvider>
  )
}

export default App
