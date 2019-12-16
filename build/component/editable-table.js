"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const antd_1 = require("antd");
const table_1 = __importDefault(require("antd/lib/table"));
const antd_2 = require("antd");
class EditableTable extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.columns = props.columns;
        this.columns.push({
            title: "Operation",
            dataIndex: "operation",
            render: (text, record, idx) => {
                if (this.state.editing === idx)
                    return (react_1.default.createElement("span", null,
                        react_1.default.createElement(antd_2.Icon, { type: "save", onClick: () => this.save(idx), style: { fill: "#8BC34A" } }),
                        react_1.default.createElement(antd_2.Icon, { type: "close", onClick: () => this.cancel(idx), style: { fill: "#F44336" } })));
                else
                    return (react_1.default.createElement("span", null,
                        react_1.default.createElement(antd_2.Icon, { type: "edit", onClick: () => this.edit(idx), style: { fill: "#8BC34A" } }),
                        react_1.default.createElement(antd_2.Icon, { type: "delete", onClick: () => this.delete(idx), style: { fill: "#F44336" } })));
            }
        });
        this.state = {
            dataSource: props.dataSource,
            editing: -1,
            oldRecord: null
        };
    }
    get editing() {
        return this.state.editing < 0
            ? null
            : this.state.dataSource[this.state.editing];
    }
    data(idx) {
        return this.state.dataSource[idx];
    }
    edit(idx) {
        if (this.state.editing !== idx)
            this.cancel(this.state.editing);
        this.setState({ editing: idx, oldRecord: Object.assign({}, this.data(idx)) });
    }
    editCell(idx, key, value) {
        this.state.dataSource[idx][key] = value;
        this.setState({ dataSource: this.state.dataSource });
    }
    delete(idx) {
        if (0 <= idx && idx < this.state.dataSource.length) {
            this.props.onDelete && this.props.onDelete(this.data(idx));
            this.setState({
                dataSource: this.props.dataSource.filter((_, i) => i != idx),
                editing: -1,
                oldRecord: null
            });
        }
    }
    save(idx) {
        this.props.onEdit && this.props.onEdit(this.data(idx), this.state.oldRecord);
        this.setState({ editing: -1, oldRecord: null });
    }
    cancel(idx) {
        Object.assign(this.state.editing, this.state.oldRecord);
        this.setState({
            dataSource: this.state.dataSource,
            editing: -1,
            oldRecord: null
        });
    }
    render() {
        const columns = this.columns.map((column) => {
            const { render, ...others } = column;
            column = {
                ...column, render: (text, record, idx) => {
                    return this.state.editing !== idx
                        ? (react_1.default.createElement("span", null, text))
                        : (react_1.default.createElement(EditableCell, { value: 1, idx: idx, key: column.key.toString(), onEdit: (value) => this.editCell(idx, column.key.toString(), value) }));
                }
            };
            return column;
        });
        return (react_1.default.createElement(table_1.default, { columns: columns, bordered: true, dataSource: this.state.dataSource }));
    }
}
exports.EditableTable = EditableTable;
class EditableCell extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        };
    }
    render() {
        switch (typeof (this.state.value)) {
            case "number":
                return (react_1.default.createElement(antd_1.InputNumber, { value: this.state.value, onChange: (v) => this.change(v) }));
            case "boolean":
                return (react_1.default.createElement(antd_1.Checkbox, { checked: this.state.value, onChange: (v) => this.change(!v) }));
            default:
                return (react_1.default.createElement(antd_1.Input, { value: this.state.value.toString(), onChange: (v) => this.change(v) }));
        }
    }
    change(value) {
        this.props.onEdit(value, this.state.value);
        this.setState({ value: value });
    }
}
