import React from "react";
import antd, { Layout, Menu, Icon } from "antd";
import { ColumnProps } from "antd/lib/table";
import { Student } from "../data/data";
import { EditableTable } from "./editable-table";

const StudentTableColumns: ColumnProps<Student>[] = [
    {
        title: "ID",
        dataIndex: "sno",
        key: "sno"
    },
    {
        title: "Name",
        dataIndex: "name",
        key: "name"
    },
    {
        title: "Gender",
        dataIndex: "gender",
        key: "gender"
    },
    {
        title: "Age",
        dataIndex: "age",
        key: "age"
    },
    {
        title: "Department",
        dataIndex: "department",
        key: "department"
    },
    {
        title: "Scholarship",
        dataIndex: "scholarship",
        key: "scholarship"
    },
]

class StudentManager extends React.Component<{}, { mode: "data" | "new", students:Student[] }>
{
    constructor(props: {})
    {
        super(props);
        this.state = {
            mode: "data",
            students: 
        };
    }
    render()
    {
        return (
            <Layout>
                <Layout.Sider width={200}>
                    <Menu>
                        <Menu.Item onSelect={() => this.setState({ mode: "data" })}>
                            <Icon type="database" />
                            <span>学生信息</span>
                        </Menu.Item>
                        <Menu.Item onSelect={() => this.setState({ mode: "new" })}>
                            <Icon type="usergroup-add" />
                            <span>新生入学</span>
                        </Menu.Item>
                    </Menu>
                </Layout.Sider>
                    {
                        this.state.mode == "data"
                        ? <Layout>
                            <EditableTable columns={StudentTableColumns} dataSource={this.state.students} >

                            </EditableTable>
                        </Layout>
                        : <Layout>

                        </Layout>
                    }
            </Layout>
        )
    }
}
