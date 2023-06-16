import React, { useEffect, useMemo, useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import { Outlet } from 'react-router-dom';

import { LinkConfig, LinkConfigObject } from '../route/config';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

function findDefaultLv1Route() {
  const pathname = window.location.pathname;
  // 根据前缀进行匹配
  let defaultLv1Route = '';
  LinkConfig.forEach((item) => {
    if(pathname.startsWith(item.path)) {
      defaultLv1Route = item.key;
    }
  });
  return defaultLv1Route;
}

function findDefaultLv2Route(Lv2Routes:LinkConfigObject[]) {
  const pathname = window.location.pathname;
  // 根据前缀进行匹配
  let defaultLv2Route = '';
  Lv2Routes.forEach((item) => {
    if(pathname.startsWith(item.path)) {
      defaultLv2Route = item.key;
    }
    const children = item.children || [];
    children.forEach((child) => {
      if(pathname.startsWith(child.path)) {
        defaultLv2Route = child.key;
      }
    });
  });
  return defaultLv2Route;
}

const AppLayout: React.FC = () => {

  const Navigate = useNavigate()

  // 生成一级路由 和 二级路由的选择器
  const [Lv1Routes, Lv2RoutesSelector] = useMemo(() => {
    const Lv1Routes: LinkConfigObject[] = [];
    const Lv2RoutesSelector: {
      [key: string]: LinkConfigObject
    } = {};
     
    LinkConfig.forEach((item) => {
      const { key, path, label, children } = item;
      Lv1Routes.push({ key, path, label });
      if (children) {
        Lv2RoutesSelector[item.key] = {...item};
      }
    });
    return [Lv1Routes, Lv2RoutesSelector];
  }, []);

  // 控制一级路由和二级路由的选择 和 二级路由的展开
  const [selectLv1Route, setSelectLv1Route] = useState<string[]>(['']);
  const [selectLv2Route, setSelectLv2Route] = useState<string[]>(['']);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // 生成默认选中的一级路由
  useEffect(() => {
    const defaultLv1Route = findDefaultLv1Route();
    if(defaultLv1Route) {
      setSelectLv1Route([defaultLv1Route]);
    }
  }, [Lv1Routes]);

  
  // 根据一级路由和二级路由的选择器生成二级路由
  const Lv2Routes = useMemo(() => {
    return Lv2RoutesSelector[selectLv1Route[0]]?.children || [];
  }, [selectLv1Route,Lv2RoutesSelector]);

  // 生成默认展开的二级路由
  // 生成默认选中的二级路由
  useEffect(() => {
      const defaultLv2Route = findDefaultLv2Route(Lv2Routes);
      setSelectLv2Route([defaultLv2Route||'']);
      setOpenKeys(Lv2Routes.map((item) => item.key));
  }, [Lv2Routes]);
  
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{
      height: '100%',
    }}>
      <Header className="header">
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={selectLv1Route}
          items={Lv1Routes}
          onClick={(res) => {
            const route = Lv1Routes.find((item) => item.key === res.key);
            Navigate(route?.path || '/home');
            setSelectLv1Route([res.key]);
          }} 
        />
      </Header>
      <Layout>
        {
          // 侧边栏
          Lv2Routes.length > 0 && (
            <Sider width={200} style={{ background: colorBgContainer }}>
              <Menu
                mode="inline"
                selectedKeys={selectLv2Route}
                openKeys={openKeys}
                style={{ height: '100%', borderRight: 0 }}
                items={Lv2Routes}
                onClick={(res) => {
                  const [key, parentKey] = res.keyPath;
                  const parent = Lv2Routes.find((item) => item.key === parentKey);
                  const route = parent?.children?.find((item) => item.key === key);
                  Navigate(route?.path || '/home');
                  setSelectLv2Route([res.key]);
                }}
                onOpenChange={(openKeys) => {
                  setOpenKeys(openKeys);
                }}
              />
            </Sider>
          )
        }
        <Layout style={{ padding: '24px 24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: "280px",
              background: colorBgContainer,
              overflowY: 'auto',
            }}
          >
            <Outlet />
          </Content>
          {/* <Footer style={{ 
            textAlign: 'center',
            padding: 24,
            margin: 0, 
        }}>Ant Design ©2018 Created by Ant UED</Footer> */}
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;