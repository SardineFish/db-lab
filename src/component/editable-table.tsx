import React from "react";
import antd, { InputNumber, Input, Checkbox, Popconfirm } from "antd";
import Table, { ColumnProps } from "antd/lib/table";
import { Icon } from "antd";

type KeyedObject = { [key: string]: any };

interface EditableTableProps<T>
{
    columns: ColumnProps<T>[];
    dataSource: T[];
    onEdit?: (newData: T, oldData: T) => Promise<boolean | void>;
    onDelete?: (data: T) => Promise<boolean | void>;
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
    async delete(idx: number)
    {
        if (0 <= idx && idx < this.state.dataSource.length)
        {
            if (this.props.onDelete && (await this.props.onDelete(this.data(idx)) === false))
            {
                this.cancel(idx);
                return;
            }
            this.setState({
                dataSource: this.state.dataSource.filter((_, i) => i != idx),
                editing: -1,
                oldRecord: null
            });
        }
    }
    async save(idx: number)
    {
        if (this.props.onEdit && (await this.props.onEdit(this.data(idx), this.state.oldRecord)) === false)
        {
            this.cancel(idx);
            return;
        }
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
                    return (<EditableCell
                        editable={this.state.editing === idx}
                        value={(record as KeyedObject)[column.key]}
                        idx={idx}
                        key={column.key.toString()}
                        onEdit={(value) => this.editCell(idx, column.key.toString(), value)}
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
                if (this.state.editing === idx)
                    return (
                        <span>
                            <Icon type="save" onClick={() => this.save(idx)} theme="twoTone" twoToneColor="#8BC34A" style={{ fontSize: 20, margin: "0 16px" }} />
                            <Icon type="close-circle" onClick={() => this.cancel(idx)} theme="twoTone" twoToneColor="#F44336" style={{ fontSize: 20, margin: "0 16px" }} />
                        </span>
                    );
                else
                    return (
                        <span>
                            <Icon type="edit" onClick={() => this.edit(idx)} theme="twoTone" twoToneColor="#8BC34A" style={{ fontSize: 20, margin: "0 16px" }} />
                            <Popconfirm title="Are you sure delete this student?" onConfirm={() => this.delete(idx)}>
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
                            <Input value={this.state.value.toString()} onChange={(v) => this.change(v.target.value as any as T)} style={{ width: "7em" }}></Input>
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