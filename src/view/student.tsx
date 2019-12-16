import React from "react";
import antd, { Layout, Menu, Icon, Spin, Alert, message, PageHeader, Form, Input } from "antd";
import { ColumnProps } from "antd/lib/table";
import { Student } from "../data-mode/data";
import { EditableTable, EditableColumnProps } from "../component/editable-table";
import { DataBase } from "../db/db";
import { StudentController } from "../controller/student-controller";
import { FormWrappedProps } from "antd/lib/form/interface";
import { FormComponentProps } from "antd/lib/form";
import { WrappedNewStudentForm } from "../component/new-student";

const StudentTableColumns: EditableColumnProps<Student>[] = [
    {
        title: "ID",
        dataIndex: "sno",
        key: "sno",
        editable: false
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

export class StudentManager extends React.Component<{}, { mode: "data" | "new" | string, students: Student[],  }>
{
    constructor(props: {})
    {
        super(props);
        this.state = {
            mode: "data",
            students: null
        };
    }
    async componentDidMount()
    {
        const data = await StudentController.get();
        this.setState({ students: data });
    }
    async deleteStudent(student: Student)
    {
        try
        {
            await StudentController.remove(student);
            message.success("Delete succeed.");
        }
        catch (err)
        {
            var x = err;
            message.error(`Delete failed: ${err.message}`);
            return false;
        }
    }
    async editStudent(student: Student)
    {
        try
        {
            await StudentController.update(student);
            message.success("Student updated.");
        }
        catch (err)
        {
            var x = err;
            message.error(`Update failed: ${err.message}`);
            return false;
        }

    }
    async addStudent(student: Student)
    {
        try
        {
            await StudentController.add(student);
            message.success("A new student added.");
            this.setState({ mode: "data", students: null });
            this.setState({ students: await StudentController.get() });
        }
        catch (err)
        {
            var x = err;
            message.error(`Failed to add: ${err.message}`);
        }

    }
    render()
    {
        return (
            <Layout>
                <Layout.Sider width={200} theme="light">
                    <Menu defaultSelectedKeys={["data"]} onSelect={(e)=>this.setState({mode:e.key})}>
                        <Menu.Item key="data" onSelect={() => this.setState({ mode: "data" })}>
                            <Icon type="database" />
                            <span>Students Info</span>
                        </Menu.Item>
                        <Menu.Item key="new" onSelect={() => this.setState({ mode: "new" })}>
                            <Icon type="usergroup-add" />
                            <span>New Student</span>
                        </Menu.Item>
                    </Menu>
                </Layout.Sider>
                <Layout.Content style={{ background: "#fff", padding: 24, margin: 24 }}>
                    {
                        this.state.mode == "data"
                            ? this.state.students === null
                                ? <Spin tip="Loading Data...">
                                    <Alert message="Data not found" description="Nothing here." type="info"/>
                                </Spin>
                                : (<Layout.Content>
                                    <PageHeader title="Students Info"></PageHeader>
                                    <EditableTable columns={StudentTableColumns} dataSource={this.state.students} onEdit={s=>this.editStudent(s)} onDelete={d=>this.deleteStudent(d)} >
                                    
                                    </EditableTable>
                                </Layout.Content>)
                            : <Layout.Content>
                                <PageHeader title="New Student"></PageHeader>
                                <WrappedNewStudentForm  wrappedComponentRef={((form: any)=> form && (form.onCreate = (s:Student)=>this.addStudent(s)))}></WrappedNewStudentForm>
                            </Layout.Content>
                    }
                </Layout.Content>
            </Layout>
        )
    }
}
