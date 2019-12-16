import React from "react";
import { Layout } from "antd";

export function Page(props: { visible: boolean, children?: React.ReactNode })
{
    return props.visible
        ? <Layout>
            {props.children}
        </Layout>
        : null;
}