"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const antd_1 = require("antd");
const editable_table_1 = require("./editable-table");
const StudentTableColumns = [
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
];
class StudentManager extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "data",
            students: 
        };
    }
    render() {
        return (react_1.default.createElement(antd_1.Layout, null,
            react_1.default.createElement(antd_1.Layout.Sider, { width: 200 },
                react_1.default.createElement(antd_1.Menu, null,
                    react_1.default.createElement(antd_1.Menu.Item, { onSelect: () => this.setState({ mode: "data" }) },
                        react_1.default.createElement(antd_1.Icon, { type: "database" }),
                        react_1.default.createElement("span", null, "\u5B66\u751F\u4FE1\u606F")),
                    react_1.default.createElement(antd_1.Menu.Item, { onSelect: () => this.setState({ mode: "new" }) },
                        react_1.default.createElement(antd_1.Icon, { type: "usergroup-add" }),
                        react_1.default.createElement("span", null, "\u65B0\u751F\u5165\u5B66")))),
            this.state.mode == "data"
                ? react_1.default.createElement(antd_1.Layout, null,
                    react_1.default.createElement(editable_table_1.EditableTable, { columns: StudentTableColumns, dataSource: this.state.students }))
                : react_1.default.createElement(antd_1.Layout, null)));
    }
}
