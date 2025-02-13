import { Layout, theme } from "antd";
import React from "react";
import { Outlet } from "react-router-dom";
import HeaderManagePage from "../../common/Header/HeaderManagePage";
import SliderComponent from "../../slider/Slider";

const { Content } = Layout;

function AdminLayout({ children }) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className="max-h-screen">
      <HeaderManagePage />
      <Layout>
        <SliderComponent />
        <Content
          style={{
            marginTop: "10px",
            marginLeft: "10px",
            marginRight: "10px",
            background: colorBgContainer,
          }}
          className="overflow-y-auto webkit-scrollbar"
        >
          <div className="">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;
