import React from "react";
import ReactDOM from "react-dom";
import antd, { Layout, Menu, Icon } from "antd";
import Sider from "antd/lib/layout/Sider";

const App = () => (
    <Layout style={{ height: "100%", width: "100%", position: "absolute" }}>
        <Layout.Header>
            <div className="logo"></div>
            <Menu theme="dark">
                <Menu.Item>
                    <Icon type="user" />
                    <span>Students</span>
                </Menu.Item>
                <Menu.Item>
                    <Icon type="book" />
                    <span>Courses</span>
                </Menu.Item>
                <Menu.Item>
                    <Icon type="container" />
                    <span>Grade</span>
                </Menu.Item>
            </Menu>
        </Layout.Header>
        <Layout.Sider width={200}>
            <Menu theme="light">
                <Menu.Item>
                    <Icon type="home" />
                    <span>Home</span>
                </Menu.Item>
                <Menu.Item>
                    <Icon type="home" />
                    <span>Home</span>
                </Menu.Item>
                <Menu.Item>
                    <Icon type="home" />
                    <span>Home</span>
                </Menu.Item>
            </Menu>
        </Layout.Sider>
    </Layout>
);

const element = document.querySelector("#root");
ReactDOM.render((<App></App>), element);