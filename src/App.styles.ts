import { css } from '@emotion/css';

export const app = css`
  background-color: #F5F6FB;
`;

export const sidebar = css`
  background: transparent;
  min-height: 100vh;
`;

export const appTitle = css`
  font-family: 'Lily Script One', cursive;
  font-size: 24px;
  padding: 16px;
`;

export const sidebarLinkGroup = css`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
`;

export const sidebarLink = css`
  padding: 12px 16px;
  color: #565656;
  cursor: pointer;
  
  &:hover {
    background-color: #E0E4EE;
  }
`;

export const sidebarLinkActive = css`
  ${sidebarLink}
  padding: 12px 16px;
  background-color: #BAE0FF;
  color: #565656;
  cursor: pointer;
  
  &:hover {
    background-color: #BAE0FF;
  }
`;
  
export const content = css`
  background: #FFFFFF;
  border-left: 1px solid #EEEEEE;
  min-height: 100vh;
`;

export const contentHeader = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #EEEEEE;
  padding: 16px;
`;

export const contentTitle = css`
  font-size: 16px;
  margin: 0;
`;

export const secondaryBar = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 16px;
  border-bottom: 1px solid #EEEEEE;
`;

export const selectionBar = css`
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #EEEEEE;
`;

export const searchInput = css`
  width: 400px;
`;

export const employeeForm = css`
  padding: 32px;
`;
