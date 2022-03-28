import './App.css';
import 'antd/dist/antd.min.css';
import { useState, useEffect } from "react";
import { Layout, Menu } from 'antd';
import { BrowserRouter as Router, Routes, Route, Link,useLocation } from "react-router-dom";
import Home from './Home'
import Race from './Race'
import React from 'react';

import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;


function App() {

  const url = "https://ergast.com/api/f1/current.json"

  function toTimeString(date){
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const day = String(date.getDate()).padStart(2, '0');

    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
            
    const strDate = day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second;
    return strDate;
  }

  function toHeader(race){
    const round = race["round"];
    const raceName = race["raceName"];
    const date = toTimeString(new Date(race["date"] + "T" + race["time"]));
    return <div>
      <div>{`${round}. ${raceName}`}</div>
      <div>{date}</div>
    </div>
  }

  function diffDays(race){
    const raceDate = new Date(race["date"] + "T" + race["time"]);
    const now = new Date();

    const oneDay = 1000 * 60 * 60 * 24;

    const diffinTime = raceDate.getTime() - now.getTime();

    return Math.round(diffinTime / oneDay);
  }

  function headerColor(race){
    const red = "#FF0000";
    const yellow = "#FFFF00";
    const green = "#3BE13B";
    const white = "#FFFFFF";
    const diffDay = diffDays(race);
    if(0 <= diffDay && diffDay <= 7) return green;
    if(0 > diffDay) return red;
    if(diffDay > 7) return yellow;
    return white;
  }

  const [races, setRaces] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [defaultKey, setDefaultKey] = useState(-1);

  const onCollapse = collapsed => {
    setCollapsed(collapsed);
  };

  const toggle = () => {
    setCollapsed(!collapsed);
  }


  useEffect(() => {
    if(window.location.pathname === "/") setDefaultKey(1);
    if(window.location.pathname === "/race") setDefaultKey(2);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
         setRaces(data["MRData"]["RaceTable"]["Races"]);
         //console.log(data["MRData"]["RaceTable"]["Races"]);
         
         //console.log('----------------------------------------');
         //console.log(races);
      })
   }, []);

   // https://stackoverflow.com/questions/52021381/how-to-change-content-based-on-menu-item-click-in-antd-react-ui-library
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
          <Sider trigger={null} breakpoint="lg" collapsedWidth="0" collapsed={collapsed}>
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={[window.location.pathname]}>
              <Menu.Item key="/" icon={<PieChartOutlined />}>
                <Link to="/">Home</Link>
              </Menu.Item>
              <Menu.Item key="/race" icon={<DesktopOutlined />}>
                <Link to="/race">Race</Link>
              </Menu.Item>
              <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                <Menu.Item key="3">Tom</Menu.Item>
                <Menu.Item key="4">Bill</Menu.Item>
                <Menu.Item key="5">Alex</Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                <Menu.Item key="6">Team 1</Menu.Item>
                <Menu.Item key="8">Team 2</Menu.Item>
              </SubMenu>
              <Menu.Item key="9" icon={<FileOutlined />}>
                Files
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ paddingLeft: 24, position: "fixed", zIndex: 1, width: "100%" }}>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: toggle,
              })}
            </Header>
            <Content style={{ padding: '0 5px', marginTop: 64 }}>
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/race" element={<Race races={races}/>}/>
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Router>
      /*
    <div>
      {races.length>0?
        <Collapse>
          {races.map((race) =>
            <Panel key={race["round"]} header={toHeader(race)} style={{backgroundColor: headerColor(race)}}>
              <p>{race["round"]}</p>
              <p>{diffDays(race)}</p>
              <RaceCard {...race}/>
            </Panel>
          )}
        </Collapse>
        :
        <div>Loading...</div>
      }
    </div>*/
    
  );
}

export default App;




/*<Collapse>
          <Panel style={{backgroundColor: '#FF0000'}} id="finished" header="First" key="1">
            <p>111111111111111111111</p>
          </Panel>
          <Panel header="Second" key="2">
            <p>222222222222222222222</p>
          </Panel>
          <Panel header="Third" key="3">
            <p>3333333333333333333333</p>
          </Panel>
          <Panel header={toHeader(races[0])} key="0">
            <p>Hello World</p>
          </Panel>
        </Collapse>*/