import React, { FormEvent, CSSProperties } from "react";
import { Layout, Menu, Spin, Alert, message, Input, InputNumber, Select, Button, Statistic, PageHeader, Descriptions } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import { Page } from "../component/page";
import { StudentCourse, Course, Student } from "../data-mode/data";
import { EditableTable, EditableColumnProps } from "../component/editable-table";
import Table, { ColumnProps } from "antd/lib/table";
import { DepartmentController } from "../controller/department-controller";
import { StudentCourseController, DepartmentStatistics } from "../controller/student-course-controller";
import linq from "linq";
import Form, { WrappedFormInternalProps } from "antd/lib/form/Form";
import { StudentController } from "../controller/student-controller";
import { CourseController } from "../controller/course-controller";


interface StudentCourseState
{
    view: string;
    departments: string[];
    data: StudentCourse[];
}
const contentStyle: React.CSSProperties = {
    margin: 24,
    padding: 24,
    background: "#fff"
};

let WrappedStudentQuery: typeof React.Component;

export class StudentCourseManager extends React.Component<{}, StudentCourseState>
{
    constructor(props: {})
    {
        super(props);
        this.state = {
            view: "data",
            departments: [],
            data: null
        };
    }
    componentDidMount()
    {
        this.reloadData();
    }
    async reloadData()
    {
        this.setState({
            departments: await DepartmentController.get(),
            data: await StudentCourseController.get()
        });
    }
    render()
    {
        return (
            <Layout>
                <Layout.Sider theme="light">
                    <Menu mode="inline" defaultSelectedKeys={["data"]} onSelect={e=>this.setState({view: e.key})}>
                        <Menu.Item key="data">Student Course Data</Menu.Item>
                        <Menu.Item key="stat">Grade Statistics</Menu.Item>
                        <SubMenu title={
                            <span>
                                Department Grade
                                {
                                    this.state.departments.length <= 0
                                        ? <Spin size="small" style={{marginLeft:"1em"}}></Spin>
                                        : null
                                }
                            </span>
                            
                        }>
                            {
                                this.state.departments.map(dept => (
                                    <Menu.Item key={dept}>{dept}</Menu.Item>
                                ))
                            }
                        </SubMenu>
                        <Menu.Item key="query">Data Query</Menu.Item>
                    </Menu>
                </Layout.Sider>
                <Page visible={this.state.view === "data"}>
                    <StudentCourseData data={this.state.data} onNewRecord={() => this.reloadData()}></StudentCourseData>
                </Page>
                <Page visible={this.state.view === "stat"}>
                    <GradeStatistics />
                </Page>
                {
                    this.state.departments.map(department =>
                        (<Page visible={this.state.view===department}>
                            <DepartmentGrade department={department}/>
                        </Page>))
                }
                <Page visible={this.state.view === "query"}>
                    <Layout.Content >
                        <WrappedStudentQuery/>
                    </Layout.Content>
                </Page>
            </Layout>        
        );
    }
}

class StudentQuery extends React.Component<WrappedFormInternalProps, { student: Student, data: StudentCourse[] }>
{
    constructor(props: WrappedFormInternalProps)
    {
        super(props);
        this.state = {
            student: null,
            data: null
        };
    }
    async updateData(sno: string)
    {
        try
        {
            const student = await StudentController.getBySno(sno);
            if (student === null)
                throw new Error("Student not exists.");
            this.setState({
                student: student
            });
            this.setState({
                data: await StudentCourseController.getCoursesOfStudent(sno)
            });
        }
        catch (err)
        {
            message.error(`Failed to query: ${err.message}`);
        }
    }
    handelSubmit = (e: FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();
        this.props.form.validateFields();
        this.props.form.validateFields(async (err, values: { sno: string}) =>
        {
            if (!err)
            {
                this.updateData(values.sno);
            }
        });
    };
    render()
    {
        const { getFieldDecorator } = this.props.form;
        const columns: ColumnProps<StudentCourse>[] = [
            {
                title: "Course",
                key: "course",
                dataIndex: "course.name",
            },
            {
                title: "Credit",
                key: "credit",
                dataIndex: "course.credit",
            },
            {
                title: "Grade",
                key: "grade",
                dataIndex: "grade"
            }
        ];
        return (
            <Layout.Content style={contentStyle}>
                <PageHeader title="Student Query"></PageHeader>
                <Form layout="inline" onSubmit={this.handelSubmit}>
                    <Form.Item>
                        {getFieldDecorator("sno", {
                            rules: [
                                {
                                    required: true,
                                    message: "Student ID is required."
                                }
                            ]
                        })(<Input title="Student ID" placeholder="Student ID" />)}

                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Query</Button>
                    </Form.Item>

                </Form>
                {
                    this.state.student
                        ? <Layout.Content>
                            <Descriptions title="Student Info">
                                <Descriptions.Item label="Student ID">{this.state.student.sno}</Descriptions.Item>
                                <Descriptions.Item label="Name">{this.state.student.name}</Descriptions.Item>
                                <Descriptions.Item label="Age">{this.state.student.age}</Descriptions.Item>
                                <Descriptions.Item label="Gender">{this.state.student.gender}</Descriptions.Item>
                                <Descriptions.Item label="Department">{this.state.student.department}</Descriptions.Item>
                                <Descriptions.Item label="Scholarship">{this.state.student.scholarship? "Yes" : "No"}</Descriptions.Item>
                            </Descriptions>
                            <Table columns={columns} dataSource={this.state.data} bordered></Table>
                        </Layout.Content>
                        : null
                }
            </Layout.Content>
        )
    }
}

WrappedStudentQuery = Form.create()(StudentQuery);

class DepartmentGrade extends React.Component<{ department: string }, {data: StudentCourse[]}>
{
    constructor(props: { department: string })
    {
        super(props);
        this.state = {
            data: null
        };
    }
    componentDidMount()
    {
        this.updateData();
    }
    async updateData()
    {
        this.setState({
            data: await StudentCourseController.getGradesInDepartment(this.props.department)
        });
    }
    render()
    {
        const columns: ColumnProps<StudentCourse>[] = [
            {
                title: "Student Name",
                key: "sname",
                dataIndex: "student.name"
            },
            {
                title: "Course Name",
                key: "cname",
                dataIndex: "course.name"
            },
            {
                title: "Grade",
                key: "grade",
                dataIndex: "grade"
            }
        ];
        return this.state.data === null
            ? <Spin tip="Loading Data...">
                <Alert message="Data not found" description="Nothing here." type="info" />
            </Spin>
            : <Layout.Content style={contentStyle}>
                <PageHeader title="Students Grade" subTitle={`Department: ${this.props.department}`}></PageHeader>
                <Table columns={columns} bordered dataSource={this.state.data}/>
            </Layout.Content>
    }
}

class GradeStatistics extends React.Component<{}, {stat: DepartmentStatistics[]}>
{
    constructor(props: {})
    {
        super(props);
        this.state = {
            stat:null
        };
    }
    async componentDidMount()
    {
        this.setState({
            stat: await StudentCourseController.getDepartmentStatistics()
        });
    }
    render()
    {
        const columns: ColumnProps<DepartmentStatistics>[] = [
            {
                title: "Department",
                key: "department",
                dataIndex: "department"
            },
            {
                title: "Average Grade",
                key: "avgGrade",
                dataIndex: "avgGrade"
            },
            {
                title: "Min Grade",
                key: "minGrade",
                dataIndex: "minGrade"
            },
            {
                title: "Max Grade",
                key: "maxGrade",
                dataIndex: "maxGrade"
            },
            {
                title: "Excellent Rate",
                key: "goodCount",
                render: (text, record) => (<Statistic precision={2} value={record.goodCount / record.total * 100} suffix="%" valueStyle={{ color: "#3f8600"}}/>)
            },
            {
                title: "Fail Rate",
                key: "badCount",
                render: (text, record) => (<Statistic precision={2} value={record.badCount / record.total * 100} suffix="%" valueStyle={{ color: "#cf1322"}} />)
            }
        ]
        return (<Layout.Content style={contentStyle}>
            <PageHeader title="Statistics"></PageHeader>
            {
                this.state.stat === null
                    ? <Spin tip="Loading Data...">
                        <Alert message="Data not found" description="Nothing here." type="info" />
                    </Spin>
                    : <Layout.Content>
                        <Table columns={columns} bordered dataSource={this.state.stat}></Table>

                    </Layout.Content>
            }
        </Layout.Content>)
    }
}

class NewRecordForm extends React.Component<WrappedFormInternalProps, {courses: Course[], students: Student[]}>
{
    constructor(props: WrappedFormInternalProps)
    {
        super(props);
        this.state = {
            courses: [],
            students: []
        };
    }
    onSubmit: (data: {sno: string, cno: string, grade?: number}) => void;
    handleSubmit = (e: FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();
        this.props.form.validateFields();
        this.props.form.validateFields(async (err, values: { sno: string, cno: string, grade?: number }) =>
        {
            if (!err)
            {
                this.onSubmit && this.onSubmit(values);
                try
                {
                    await StudentCourseController.add(values);
                    message.success("Creation Succeed.");
                    this.onSubmit(values);
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
        this.setState({
            students: await StudentController.get(),
            courses: await CourseController.get()
        });
    }
    render()
    {
        const inputStyle: CSSProperties = {
            minWidth: "9em"
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline" onSubmit={this.handleSubmit}>
                <Form.Item label="Student ID">
                    {getFieldDecorator("sno", {
                        rules: [{ required: true, message: "Course ID is required." }]
                    })(<Select style={inputStyle}>
                        {this.state.students.map(student => (<Select.Option value={student.sno} title={student.sno}>
                            <div>{student.name}</div>
                            <div style={{color: "#888", fontSize:".8em"}}>{student.sno}</div>
                        </Select.Option>))}
                    </Select>)}
                </Form.Item>
                <Form.Item label="Course ID">
                    {getFieldDecorator("cno", {
                        rules: [{ required: true, message: "Course ID is required." }]
                    })(<Select style={inputStyle}>
                        {this.state.courses.map(course => (<Select.Option value={course.cno}>
                            <div>{course.name}</div>
                            <div style={{ color: "#888", fontSize: ".8em" }}>{course.cno}</div>
                        </Select.Option>))}
                    </Select>)}
                </Form.Item>
                <Form.Item label="Grade">
                    {getFieldDecorator("grade", {
                    })(<InputNumber />)}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Add Record</Button>
                </Form.Item>
            </Form>
        )
    }
}

const WrappedNewRecordForm = Form.create()(NewRecordForm);

function StudentCourseData(props: { data: StudentCourse[], onNewRecord: () => void; })
{
    const columns: EditableColumnProps<StudentCourse>[] = [
        {
            title: "Student ID",
            key: "student.sno",
            editable: false,
        },
        {
            title: "Student Name",
            key: "student.name",
            editable: false,
        },
        {
            title: "Course ID",
            key: "course.cno",
            editable: false,
        },
        {
            title: "Course Name",
            key: "course.name",
            editable: false,
            filters: linq.from(props.data)
                .select(data => data.course.name)
                .distinct()
                .select(name => ({
                    text: name,
                    value: name
                }))
                .toArray(),
            onFilter: (value, record) => record.course.name == value
        },
        {
            title: "Grade",
            key: "grade"
        }
    ];
    const edit = async (data: StudentCourse) =>
    {
        try
        {
            await StudentCourseController.update(data)
            message.success("Update succeed.");
        }
        catch (err)
        {
            message.error(`Update failed: ${err.message}`);
            return false;
        }
    };
    const remove = async (data: StudentCourse) =>
    {
        try
        {
            await StudentCourseController.remove(data)
            message.success("Delete succeed.");
        }
        catch (err)
        {
            message.error(`Delete failed: ${err.message}`);
            return false;
        }
    };
    return (<Layout.Content style={contentStyle}>
        <PageHeader title="Students' Course Data"/>
        {
            props.data === null
                ? <Spin tip="Loading Data...">
                    <Alert message="Data not found" description="Nothing here." type="info" />
                </Spin>
                : <Layout.Content>
                    <EditableTable columns={columns} dataSource={props.data} onEdit={edit} onDelete={remove}></EditableTable>
                    <WrappedNewRecordForm wrappedComponentRef={(form: any) => form && (form.onSubmit = () => props.onNewRecord())}></WrappedNewRecordForm>
                </Layout.Content>
        }
    </Layout.Content>)
    
        
}
