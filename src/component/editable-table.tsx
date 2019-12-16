import React from "react";
import antd, { InputNumber, Input, Checkbox } from "antd";
import Table, { ColumnProps } from "antd/lib/table";
import { Icon } from "antd";

type KeyedObject = { [key: string]: any };

interface EditableTableProps<T>
{
    columns: ColumnProps<T>[];
    dataSource: T[];
    onEdit?: (newData: T, oldData: T) => void;
    onDelete?: (data: T) => void;
}
interface EditableTableState<T>
{
    editing: number;
    oldRecord: T;
    dataSource: T[];
}


export class EditableTable<T> extends React.Component<EditableTableProps<T>, EditableTableState<T>>
{
    get editing()
    {
        return this.state.editing < 0
            ? null
            : this.state.dataSource[this.state.editing];
    }
    columns: ColumnProps<T>[];
    constructor(props: EditableTableProps<T>)
    {
        super(props);
        this.columns = props.columns;
        this.columns.push({
            title: "Operation",
            dataIndex: "operation",
            render: (text, record, idx) =>
            {
                if (this.state.editing === idx)
                    return (
                        <span>
                            <Icon type="save" onClick={() => this.save(idx)} style={{ fill: "#8BC34A" }} />
                            <Icon type="close" onClick={() => this.cancel(idx)} style={{ fill: "#F44336" }} />
                        </span>
                    );
                else
                    return (
                        <span>
                            <Icon type="edit" onClick={() => this.edit(idx)} style={{ fill: "#8BC34A" }} />
                            <Icon type="delete" onClick={() => this.delete(idx)} style={{ fill: "#F44336" }} />
                        </span>
                    );
            }
        });
        this.state = {
            dataSource: props.dataSource,
            editing: -1,
            oldRecord: null
        };
    }
    data(idx: number): T
    {
        return this.state.dataSource[idx];
    }
    edit(idx: number)
    {
        if (this.state.editing !== idx)
            this.cancel(this.state.editing);
        this.setState({ editing: idx, oldRecord: Object.assign({}, this.data(idx)) });
    }
    editCell(idx: number, key: string, value: any)
    {
        (this.state.dataSource[idx] as KeyedObject)[key] = value;
        this.setState({ dataSource: this.state.dataSource });
    }
    delete(idx: number)
    {
        if (0 <= idx && idx < this.state.dataSource.length)
        {
            this.props.onDelete && this.props.onDelete(this.data(idx));
            this.setState({
                dataSource: this.props.dataSource.filter((_, i) => i != idx),
                editing: -1,
                oldRecord: null
            });
        }
    }
    save(idx: number)
    {
        this.props.onEdit && this.props.onEdit(this.data(idx), this.state.oldRecord);
        this.setState({ editing: -1, oldRecord: null });
    }
    cancel(idx: number)
    {
        Object.assign(this.state.editing, this.state.oldRecord);
        this.setState({
            dataSource: this.state.dataSource,
            editing: -1,
            oldRecord: null
        });
    }
    render()
    {
        const columns = this.columns.map((column) =>
        {
            const { render, ...others } = column;
            column = {
                ...column, render: (text, record, idx) =>
                {
                    return this.state.editing !== idx 
                        ? (<span>{text}</span>)
                        : (<EditableCell value={1} idx={idx} key={column.key.toString()} onEdit={(value)=>this.editCell(idx, column.key.toString(), value)}/>)
                }
            };
            return column;
        });
        return (
            <Table
                columns={columns}
                bordered
                dataSource={this.state.dataSource}
            >
            </Table>
        )
    }
}

interface EditableCellProps<T>
{
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
                    <InputNumber value={this.state.value} onChange={(v) => this.change(v as any as T)}></InputNumber>
                );
            case "boolean":
                return (
                    <Checkbox checked={this.state.value} onChange={(v) => this.change(!v as any as T)}></Checkbox>
                );
            default:
                return (
                    <Input value={this.state.value.toString()} onChange={(v) => this.change(v as any as T)}></Input>
                );
        }
    }
    change(value: T)
    {
        this.props.onEdit(value, this.state.value);
        this.setState({ value: value });
    }
}