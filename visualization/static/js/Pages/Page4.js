import { Placeholder, Graph, TopCountries, Segmentation, Satisfication, AddComponent } from "../utils/template.js"
const { useState, useEffect, useLayoutEffect, useMemo } = React;
const { useSpring, animated, config } = ReactSpring;
const { AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer } = Recharts;

import { plot_statistics_graph_node, plot_statistics_graph_link, plot_prob_sub } from "../utils/figures.js"
import { Icon, IconButton, Image, TabsButton } from "../utils/component.js";
import { plot_globe } from "../utils/canvas.js";
import { SendRequest } from "../utils/network.js";

export function Page4({ PageId }) {
    const [asnData, setASNData] = useState({nodes: [], })

    useEffect(() => {
        SendRequest({
            url: "/global_node",
            data: {
                "None": ""
            },
            method: "POST",
            success: (res) => {
                setASNData(res)
                plot_globe(res)
            }
        }) 
    }, [])
    return (
        React.createElement("section", { id: "Page" + PageId, className: "relative flex justify-center h-screen flex-grow overflow-x-hidden overflow-auto flex flex-wrap content-start p-2" }, /*#__PURE__*/
            React.createElement("div", { className: "flex flex-col relative rounded h-full w-full bg-card" }, /*#__PURE__*/
                React.createElement("div", { className: "bg-gradient-to-r from-black w-80 absolute top-60 left-72 h-20 page4_title" },
                    React.createElement(title_text)),
                    /*
                React.createElement("div", { className: "w-1/3 absolute bottom-10 left-44 h-1/4" },
                React.createElement(select_zone, {filepath:"static/img/examples-thumbnail-1.jpg", Index: 0}),
                React.createElement(select_zone, {filepath:"static/img/examples-thumbnail-2.jpg", Index: 1}),
                React.createElement(select_zone, {filepath:"static/img/examples-thumbnail-3.jpg", Index: 2}),
                React.createElement(select_zone, {filepath:"static/img/examples-thumbnail-4.jpg", Index: 3}),
                React.createElement(select_zone, {filepath:"static/img/examples-thumbnail-5.jpg", Index: 4}),
                React.createElement(select_zone, {filepath:"static/img/examples-thumbnail-6.jpg", Index: 5}),
                React.createElement(select_zone, {filepath:"static/img/examples-thumbnail-7.jpg", Index: 6}),
                React.createElement(select_zone, {filepath:"static/img/examples-thumbnail-8.jpg", Index: 7}),
                React.createElement(select_zone, {filepath:"static/img/examples-thumbnail-9.jpg", Index: 8}),
                ),
                */
                React.createElement(plot_globe_page4),
                React.createElement("div", { className: "w-1/3 absolute bottom-10 right-40 h-2/5 float-card rounded border-black border-opacity-50 border-t-8 border-b-8 border-l-2 border-r-2 p-4 flex" },
                    React.createElement(info_zone, { asnData}),
                ),
                React.createElement("div", { className: "w-1/3 absolute top-20 right-40 h-2/5 border-black border-opacity-50" },
                    React.createElement(parameter_zone))
            )
        )
    )

}

function plot_globe_page4() {
    return (
        /*#__PURE__*/
        React.createElement("div", { className: "tips self-center" }),
        React.createElement("canvas", { id: "scene", className: " mt-16 self-center" })
    );
}

function title_text() {
    return (
        React.createElement("div", { className: "text-white h-full w-full"},
        React.createElement("div", { className: "text-white w-3/5 ml-4 text-left pt-2 text-2xl border-b-4 border-green-300 font-bold" }, "GLOBAL RISK."),
        React.createElement("div", { className: "text-white w-3/5 ml-4 text-left" }, "Monitoring Sys."))
    )
}

function info_zone({asnData}) {
    const nodes = asnData.nodes;
    let max_size = 200;
    const interval = 10;
    let length = Math.floor(max_size / interval) + 1
    let count = new Array();
    for (let i = 0;  i< length; i++) {
        count.push(0);
    }

    nodes.filter(item => item.id.split("_")[0] !== "ASN").map((item) => {
        count[Math.floor((Number(item.count) > max_size ? max_size : Number(item.count)) / interval)] += 1;
    })
    let statData = count.map((item, index) => {
        return { size: index * interval, count: item }
    })
    return (
        React.createElement("div", {
            class: "flex-grow w-full p-4"
        }, /*#__PURE__*/
            React.createElement("div", { className: "text-2xl font-bold" }, "全局风险监测系统."), /*#__PURE__*/
            React.createElement(ResponsiveContainer, {style: {width: "100%", height: "80%"}},
                React.createElement(AreaChart, {width: 100, height: 40, data: statData},
                    React.createElement(CartesianGrid, {strokeDashArra : "3 3"}),
                    React.createElement(XAxis, {dataKey: "size", label: {
                        value: "域名簇大小",
                        position: "insideBottomRight"
                    }}),
                    React.createElement(YAxis, {label: {
                        value: "数量", angle: -90, position: 'InsideLeft',
                        },
                    }),
                    React.createElement(Tooltip, null),
                    React.createElement(Area, {
                        type: "monotone", 
                        dataKey: "count",
                        stroke: "#444444",
                        fill: "#888888"
                    }),

                )
            )
        )
    )
}

function parameter_zone() {
    return (
        React.createElement("div", {
            class: "text-right grid justify-items-end gap-y-2"
        }, /*#__PURE__*/
            React.createElement("div", { className: "text-2xl border-b-4 border-green-300 w-1/2 font-bold" }, "Figure Legend."), /*#__PURE__*/
            React.createElement("div", {className:"flex items-center" },
            React.createElement("div", {className:"flex-initial w-4 h-4 rounded-full mr-2", style: {
                backgroundColor: "rgba(255, 111, 0,0.8)",
            }}),React.createElement("div", {className:"flex-initial mr-3" },"ASN" ),
            React.createElement("div", {className:"flex-initial w-4 h-4 rounded-full mr-2", style: {
                backgroundColor: "rgba(70, 70,70,0.8)",
            }}),React.createElement("div", {className:"flex-initial" },"Multiple Related Domains" ) ), /*#__PURE__*/
            React.createElement("div", {className: "flex w-80 bg-gradient-to-r from-black h-6"}, ),
            React.createElement("div", {className:"flex items-center w-80 -mt-2 text-sm" }, 
            React.createElement("div",{className:"w-1/3 text-left"}, "1.0"),React.createElement("div", {className:"w-1/3 text-center"}),React.createElement("div", {className:"w-1/3 text-right"}, "0.0")),
            React.createElement("div", {className:"text-center w-80 -mt-3"}, "Proportion of Black Market Domains"),
            React.createElement("div", {className:"flex items-center" },
            React.createElement("div", {className:"flex-initial w-5 h-5 rounded-full mr-2", style: {
                backgroundColor: "rgba(70, 70,70,0.8)",
            }}),React.createElement("div", {className:"flex-initial" },"Max Domain Number: 5223" )),
            React.createElement("div", {className:"flex items-center" },
            React.createElement("div", {className:"flex-initial w-2 h-2 rounded-full mr-2", style: {
                backgroundColor: "rgba(70, 70,70,0.8)",
            }}),React.createElement("div", {className:"flex-initial" },"Min Domain Number: 25" ))

            )
    )
}

function select_zone({
    filepath = "Default",
    Index = 0
}) {
    return (
        React.createElement("div", {
            class: "border-2 border-gray-800 shadow subgraph-card absolute pt-4 bg-white bg-opacity-20",
            style:{
                right:0+Index*10 + "%"
            }
        }, React.createElement("img", {
            src: filepath,
            alt: filepath,
            class: "w-full"
        }),
        React.createElement("div", {
            class: "w-1/2 bg-gradient-to-r from-gray-700 to-gray-500 h-5 text-white text-xs bottom-0 right-0 absolute p-1"
        },"Group"+Index))
    )

}