import React, { FormEvent } from "react";
import { Layout, Menu, PageHeader, Spin, Alert, Select, InputNumber, Input, Button, message } from "antd";
import { Course } from "../data-mode/data";
import { EditableTable, EditableColumnProps } from "../component/editable-table";
import { ColumnProps } from "antd/lib/table";
import { CourseController } from "../controller/course-controller";
import Form, { WrappedFormInternalProps } from "antd/lib/form/Form";

class NewCourseForm extends React.Component<WrappedFormInternalProps, { courses: Course[] }>
{
    constructor(props: WrappedFormInternalProps)
    {
        super(props);
        this.state = {
            courses: []
        };
    }
    onCreate: (course: Course) => void;
    handleSubmit = (e: FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();
        this.props.form.validateFields();
        this.props.form.validateFields(async (err, values: Course) =>
        {
            if (!err)
            {
                this.onCreate && this.onCreate(values);
                try
                {
                    await CourseController.add(values);
                    message.success("Creation Succeed.");
                }
                catch (err)
                {
                    message.error(`Creation failed: ${err.message}`);
                }
            }
        });
    };
    async componentDidMount()
    {
        this.setState({ courses: await CourseController.get() });
    }
    render()
    {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form style={{ maxWidth: 300 }} labelCol={{ xs: { span: 24 }, sm: { span: 8 } }} wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }} onSubmit={this.handleSubmit}>
                <Form.Item label="Course ID">
                    {getFieldDecorator("cno", {
                        rules: [{ required: true, message: "Course ID is required." }]
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="Name">
                    {getFieldDecorator("name", {
                        rules: [{ required: true, message: "Course name is required." }]
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="Credit">
                    {getFieldDecorator("credit", {
                        initialValue: 2,
                        rules: [{ required: true, message: "Credit of this course is required." }]
                    })(<InputNumber />)}
                </Form.Item>
                <Form.Item label="Prior Course">
                    {getFieldDecorator("priorCourse", {
                        initialValue: "",
                    })(<Select>
                        <Select.Option value=""><i>{"<NULL>"}</i></Select.Option>
                        {
                            this.state.courses.map((course, idx) => (<Select.Option key={idx} value={course.cno}>
                                {course.name}
                            </Select.Option>))
                        }
                    </Select>)}
                </Form.Item>
                <Form.Item wrapperCol={{
                    xs: {
                        span: 24,
                        offset: 0,
                    },
                    sm: {
                        span: 16,
                        offset: 8,
                    },
                }}>
                    <Button type="primary" htmlType="submit">Add Course</Button>
                </Form.Item>
            </Form>
        );
    }
}

const WrappedNewCourseForm = Form.create()(NewCourseForm);


const CourseTableColumn: EditableColumnProps<Course>[] = [
    {
        title: "ID",
        dataIndex: "cno",
        key: "cno",
        editable: false
    },
    {
        title: "Name",
        dataIndex: "name",
        key: "name"
    },
    {
        title: "Prior Course",
        dataIndex: "priorCourse",
        key: "priorCourse"
    },
    {
        title: "Credit",
        dataIndex: "credit",
        key: "credit"
    },
];

export class CourseManager extends React.Component<{}, {view:"course"|"new" |string, courses: Course[]}>
{
    constructor(props: {})
    {
        super(props);
        this.state = {
            view: "course",
            courses: null
        };
    }
    componentDidMount()
    {
        this.updateView();
    }
    async updateView()
    {
        this.setState({ view: "course", courses: await CourseController.get() });
    }
    render()
    {
        return (
            <Layout>
                <Layout.Sider theme="light">
                    <Menu defaultSelectedKeys={["course"]} onSelect={(e)=>this.setState({view: e.key})}>
                        <Menu.Item key="course">
                            All Courses
                        </Menu.Item>
                        <Menu.Item key="new">
                            Add New Course
                        </Menu.Item>
                    </Menu>
                </Layout.Sider>
                <Layout.Content style={{ background: "#fff", padding: 24, margin: 24 }}>
                    {
                        this.state.view === "course"
                            ? <Layout.Content>
                                <PageHeader title="Courses"></PageHeader>
                                {
                                    this.state.courses === null
                                        ? <Spin tip="Loading Data...">
                                            <Alert message="Data not found" description="Nothing here." type="info" />
                                        </Spin>
                                        : <CourseDataViewer course={this.state.courses}/>
                                }
                            </Layout.Content>
                            : <Layout.Content>
                                <PageHeader title="Add New Course" />
                                <WrappedNewCourseForm wrappedComponentRef={(form: NewCourseForm)=> form && (form.onCreate =()=>this.updateView())}></WrappedNewCourseForm>
                            </Layout.Content>
                        
                    }
                </Layout.Content>
            </Layout>
        )
    }
}


function CourseDataViewer(props: {course: Course[]})
{
    const edit = async (course: Course) =>
    {
        try
        {
            await CourseController.update(course);
            message.success("Update succeed.");
        }
        catch (err)
        {
            message.error(`Update failed: ${err.message}`);
            return false;
        }
    };
    const remove = async (course: Course) =>
    {
        try
        {
            await CourseController.remove(course);
            message.success("Delete succeed.");
        }
        catch (err)
        {
            message.error(`Delete failed: ${err.message}`);
            return false;
        }
    };
    return (
        <EditableTable columns={CourseTableColumn} dataSource={props.course} onEdit={edit} onDelete={remove} >

        </EditableTable>
    )
}