import React from "react";
import ReactDOM from "react-dom";
import antd, { Layout, Menu, Icon } from "antd";
import Sider from "antd/lib/layout/Sider";
import { DataBase } from "../db/db";
import { StudentManager } from "./student";
import { CourseManager } from "./course";
import { StudentCourseManager } from "./student-course";

class App extends React.Component<{}, {view: "student" | "course" | "student-course" | string}>
{
    constructor(props: {})
    {
        super(props);
        this.state = {
            view: "student"
        };
    }
    render()
    {
        return (
            <Layout style={{ height: "100%", width: "100%", position: "absolute" }}>
                <Layout.Header>
                    <div className="logo"></div>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["student"]} style={{lineHeight:"64px"}} onSelect={(e)=>this.setState({view:e.key})}>
                        <Menu.Item key="student">
                            <Icon type="user" />
                            <span>Students</span>
                        </Menu.Item>
                        <Menu.Item key="course">
                            <Icon type="book" />
                            <span>Courses</span>
                        </Menu.Item>
                        <Menu.Item key="sc">
                            <Icon type="container" />
                            <span>Grade</span>
                        </Menu.Item>
                    </Menu>
                </Layout.Header>
                {
                    this.state.view === 'student'
                        ? <StudentManager></StudentManager>
                        : this.state.view === "course"
                            ? <CourseManager></CourseManager>
                            : <StudentCourseManager></StudentCourseManager>
                }
            </Layout>)
    };
}

(async () =>
{

    const element = document.querySelector("#root");
    ReactDOM.render((<App></App>), element);

})();