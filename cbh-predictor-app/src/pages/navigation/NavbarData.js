import React from "react";
import { BiHomeAlt, BiBarChartAlt, BiLineChart, BiTable } from "react-icons/bi";

export const NavbarData = [
    {
        title: "Home",
        path: "/",
        icon: <BiHomeAlt/>,
        cName: "nav_text head",
    },
    {
        title: "Bing Data",
        path: "",
        icon: <BiBarChartAlt/>,
        cName: "nav_text head"
    },
    {
        title: "Charts",
        path: "/charts/bing",
        icon: <BiLineChart/>,
        cName: "nav_text"
    },
    {
        title: "Table",
        path: "/table/bing",
        icon: <BiTable/>,
        cName: "nav_text"
    },
    {
        title: "Google Data",
        path: "",
        icon: <BiBarChartAlt/>,
        cName: "nav_text head"
    },
    {
        title: "Charts",
        path: "/charts/google",
        icon: <BiLineChart/>,
        cName: "nav_text"
    },
    {
        title: "Table",
        path: "/table/google",
        icon: <BiTable/>,
        cName: "nav_text"
    },
    {
        title: "Lead Data",
        path: "",
        icon: <BiBarChartAlt/>,
        cName: "nav_text head"
    },
    {
        title: "Charts",
        path: "/charts/lead",
        icon: <BiLineChart/>,
        cName: "nav_text"
    },
    {
        title: "Table",
        path: "/table/lead",
        icon: <BiTable/>,
        cName: "nav_text"
    },
    {
        title: "Order Data",
        path: "",
        icon: <BiBarChartAlt/>,
        cName: "nav_text head"
    },
    {
        title: "Charts",
        path: "/charts/order",
        icon: <BiLineChart/>,
        cName: "nav_text"
    },
    {
        title: "Table",
        path: "/table/order",
        icon: <BiTable/>,
        cName: "nav_text"
    }
]