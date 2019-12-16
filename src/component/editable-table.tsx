import React from "react";
import antd, { InputNumber, Input, Checkbox, Popconfirm } from "antd";
import Table, { ColumnProps } from "antd/lib/table";
import { Icon } from "antd";
import { setValueThrough, getValueThrough } from "../utils/utility";

type KeyedObject = { [key: string]: any };

interface EditableTableProps<T>
{
    columns: EditableColumnProps<T>[];
    dataSource: T[];
    onEdit?: (newData: T, oldData: T) => Promise<boolean | void>;
    onDelete?: (data: T) => Promise<boolean | void>;
}
interface EditableTableState<T>
{
    editing: T;
    oldRecord: T;
    dataSource: T[];
}

export interface EditableColumnProps<T> extends ColumnProps<T>
{
    editable?: boolean;    
}

export class EditableTable<T> extends React.Component<EditableTableProps<T>, EditableTableState<T>>
{
    constructor(props: EditableTableProps<T>)
    {
        super(props);
        this.state = {
            dataSource: props.dataSource,
            editing: null,
            oldRecord: null
        };
    }
    edit(record: T)
    {
        if (this.state.editing !== record)
            this.cancel(this.state.editing);
        this.setState({ editing: record, oldRecord: Object.assign({}, record) });
    }
    editCell(record: T, key: string, value: any)
    {
        setValueThrough(record, key, value);
        //(this.state.dataSource[idx] as KeyedObject)[key] = value;
        this.setState({ dataSource: this.state.dataSource });
    }
    async delete(record: T)
    {
        if (this.state.dataSource.indexOf(record) >= 0)
        {
            if (this.props.onDelete && (await this.props.onDelete(record) === false))
            {
                this.cancel(record);
                return;
            }
            this.setState({
                dataSource: this.state.dataSource.filter(t => t !== record),
                editing: null,
                oldRecord: null
            });
        }
    }
    async save(record: T)
    {
        if (this.props.onEdit && (await this.props.onEdit(record, this.state.oldRecord)) === false)
        {
            this.cancel(record);
            return;
        }
        this.setState({ editing: null, oldRecord: null });
    }
    cancel(record: T)
    {
        if (record)
        {
            Object.assign(this.state.dataSource[this.state.dataSource.indexOf(record)], this.state.oldRecord);
            this.setState({
                dataSource: this.state.dataSource,
                editing: null,
                oldRecord: null
            });
        }
    }
    render()
    {
        const columns = this.props.columns.map((column) =>
        {
            const { render, ...others } = column;
            column = {
                ...column, render: (text, record, idx) =>
                {
                    return (<EditableCell
                        editable={this.state.editing === record && (column.editable === false ? false : true)}
                        value={getValueThrough(record, column.key.toString())}
                        idx={idx}
                        key={column.key.toString()}
                        onEdit={(value) => this.editCell(record, column.key.toString(), value)}
                    />)
                }
            };
            return column;
        });
        columns.push({
            title: "Operation",
            dataIndex: "operation",
            align: "center",
            render: (text, record, idx) =>
            {
                if (this.state.editing === record)
                    return (
                        <span>
                            <Icon type="save" onClick={() => this.save(record)} theme="twoTone" twoToneColor="#8BC34A" style={{ fontSize: 20, margin: "0 16px" }} />
                            <Icon type="close-circle" onClick={() => this.cancel(record)} theme="twoTone" twoToneColor="#F44336" style={{ fontSize: 20, margin: "0 16px" }} />
                        </span>
                    );
                else
                    return (
                        <span>
                            <Icon type="edit" onClick={() => this.edit(record)} theme="twoTone" twoToneColor="#8BC34A" style={{ fontSize: 20, margin: "0 16px" }} />
                            <Popconfirm title="Are you sure delete this student?" onConfirm={() => this.delete(record)}>
                                <Icon type="delete" theme="twoTone" twoToneColor="#F44336" style={{ fontSize: 20, margin: "0 16px" }} />
                            </Popconfirm>
                        </span>
                    );
            }
        });
        return (
            <Table
                columns={columns}
                bordered
                dataSource={this.state.dataSource}
                style={{background:"transparent"}}
            >
            </Table>
        )
    }
}

interface EditableCellProps<T>
{
    editable: boolean;
    idx: number;
    key: string;
    value: T;
    onEdit: (value: T, previous: T) => void;
}
class EditableCell<T = any> extends React.Component<EditableCellProps<T>, {value: T}>
{
    constructor(props: EditableCellProps<T>)
    {
        super(props);
        this.state = {
            value: props.value
        };
    }
    render()
    {
        switch (typeof (this.state.value))
        {
            case "number":
                return (
                    !this.props.editable
                        ? <span>{this.state.value}</span>
                        : <InputNumber value={this.state.value} onChange={(v) => this.change(v as any as T)}></InputNumber>
                );
            case "boolean":
                return (
                    !this.props.editable
                        ? <Checkbox checked={this.state.value} ></Checkbox>
                        : <Checkbox checked={this.state.value} onChange={(v) => this.change(!this.state.value as any as T)}></Checkbox>
                );
            default:
                return (
                    !this.props.editable
                        ? <span>{this.state.value}</span>
                        : <div>
                            <Input value={this.state.value as any as string} onChange={(v) => this.change(v.target.value as any as T)} style={{ width: "7em" }}></Input>
                        </div> 
                );
        }
    }
    componentWillReceiveProps(props: EditableCellProps<T>)
    {
        this.setState({
            value: props.value
        });
    }
    change(value: T)
    {
        this.props.onEdit(value, this.state.value);
        this.setState({ value: value });
    }
}