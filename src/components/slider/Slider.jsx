import React, { useEffect, useMemo } from "react";
import { Layout, Menu, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { filterMenuByRole, sliderMenu } from "../../utils/helpers";
import { globalSelector, userSelector } from "../../redux/selectors/selector";
import { setSliderMenuItemSelectedKey } from "../../redux/reducers/globalReducer";
import { areInArray } from "../../utils/common";

const { Sider } = Layout;
const SliderComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const userData = useSelector(userSelector);
  const globalData = useSelector(globalSelector);

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={globalData.collapsed}
      width={245}
      style={{
        background: colorBgContainer,
        marginTop: 10,
      }}
      className="slider-container"
    >
      <div className="demo-logo-vertical text-center uppercase text-2xl font-bold mb-10">
        General
      </div>
      <Menu
        mode="inline"
        selectedKeys={[globalData.sliderMenuItemSelectedKey]}
        items={sliderMenu.filter((t) =>
          areInArray(userData?.user?.role, ...t.roles)
        )}
        onClick={async (info) => {
          dispatch(setSliderMenuItemSelectedKey(info.key));
          navigate(`/${info.key}`);
        }}
        className="my-10"
      />
    </Sider>
  );
};

export default SliderComponent;
