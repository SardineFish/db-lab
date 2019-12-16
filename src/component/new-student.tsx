import React, { FormEvent } from "react";
import antd, { Form, Input, Select, InputNumber, Checkbox, Button } from "antd";
import { Student } from "../data-mode/data";
import { WrappedFormUtils, WrappedFormInternalProps } from "antd/lib/form/Form";

class NewStudentForm extends React.Component<WrappedFormInternalProps>
{
    onCreate: (student: Student) => void;
    handleSubmit = (e: FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();
        this.props.form.validateFields();
        this.props.form.validateFields((err, values: Student) =>
        {
            if (!err)
            {
                this.onCreate && this.onCreate(values);
            }
        });
    }
    render()
    {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form style={{maxWidth: 300}} labelCol={{xs:{span: 24}, sm:{span:8}}} wrapperCol={{xs:{span:24}, sm:{span: 16}}} onSubmit={this.handleSubmit}>
                <Form.Item label="ID">
                    {getFieldDecorator("sno", {
                        rules: [{required: true, message: "Student ID is required."}]
                    })(<Input/>)}
                </Form.Item>
                <Form.Item label="Name">
                    {getFieldDecorator("name", {
                        rules: [{ required: true, message: "Student name is required." }]
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="Gender">
                    {getFieldDecorator("gender", {
                        rules: [{ required: true, message: "Student gender is required." }]
                    })(<Select>
                        <Select.Option value="男">男</Select.Option>
                        <Select.Option value="女">女</Select.Option>
                    </Select>)}
                </Form.Item>
                <Form.Item label="Age">
                    {getFieldDecorator("age", {
                        initialValue: 18,
                        rules: [{ required: true, message: "Student age is required." }]
                    })(<InputNumber />)}
                </Form.Item>
                <Form.Item label="Department">
                    {getFieldDecorator("department", {
                        rules: [{ required: true, message: "Student department is required." }]
                    })(<Select>
                        <Select.Option value="CS">CS</Select.Option>
                        <Select.Option value="IS">IS</Select.Option>
                        <Select.Option value="MA">MA</Select.Option>
                    </Select>)}
                </Form.Item>
                <Form.Item label="Scholarship">
                    {getFieldDecorator("scholarship", {
                        initialValue: false
                    })(<Checkbox></Checkbox>)}
                </Form.Item>
                <Form.Item wrapperCol={{
                    xs: {
                        span: 24,
                        offset: 0,
                    },
                    sm: {
                        span: 16,
                        offset: 8,
                    },}}>
                    <Button type="primary" htmlType="submit">Add Student</Button>
                </Form.Item>
            </Form>
        )
    }
}

export const WrappedNewStudentForm = Form.create()(NewStudentForm);