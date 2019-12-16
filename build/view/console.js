"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const antd_1 = require("antd");
const App = () => (react_1.default.createElement(antd_1.Layout, { style: { height: "100%", width: "100%", position: "absolute" } },
    react_1.default.createElement(antd_1.Layout.Header, null,
        react_1.default.createElement("div", { className: "logo" }),
        react_1.default.createElement(antd_1.Menu, { theme: "dark" },
            react_1.default.createElement(antd_1.Menu.Item, null,
                react_1.default.createElement(antd_1.Icon, { type: "user" }),
                react_1.default.createElement("span", null, "Students")),
            react_1.default.createElement(antd_1.Menu.Item, null,
                react_1.default.createElement(antd_1.Icon, { type: "book" }),
                react_1.default.createElement("span", null, "Courses")),
            react_1.default.createElement(antd_1.Menu.Item, null,
                react_1.default.createElement(antd_1.Icon, { type: "container" }),
                react_1.default.createElement("span", null, "Grade")))),
    react_1.default.createElement(antd_1.Layout.Sider, { width: 200 },
        react_1.default.createElement(antd_1.Menu, { theme: "light" },
            react_1.default.createElement(antd_1.Menu.Item, null,
                react_1.default.createElement(antd_1.Icon, { type: "home" }),
                react_1.default.createElement("span", null, "Home")),
            react_1.default.createElement(antd_1.Menu.Item, null,
                react_1.default.createElement(antd_1.Icon, { type: "home" }),
                react_1.default.createElement("span", null, "Home")),
            react_1.default.createElement(antd_1.Menu.Item, null,
                react_1.default.createElement(antd_1.Icon, { type: "home" }),
                react_1.default.createElement("span", null, "Home"))))));
const element = document.querySelector("#root");
react_dom_1.default.render((react_1.default.createElement(App, null)), element);
