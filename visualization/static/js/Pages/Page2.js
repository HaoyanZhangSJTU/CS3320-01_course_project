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
import { auto_ani } from "../utils/auto_ani.js"
import { Icon, IconButton, Image, LoadingIcon, TabsButton } from "../utils/component.js";
import { plot_page2_graph } from "../utils/graphvis.js";
import { SendRequest } from "../utils/network.js";
import { legendsWithSVG, black_market_type_dict } from "../utils/config.js";

export function Page2({ PageId, currGraphData, currExample, currKeyLinks }) {

    const [selectedNodeId, setSelectedNodeId] = useState(0);
    const [visNetwork, setVisNetwork] = useState(undefined);
    const [reset, setReset] = useState(false)
    const [removedList, setRemovedList] = useState({removed: []})
    const [remainPercentage, setRemainPercentage] = useState(100)
    const [logText, setLogText] = useState({text:[]});
    const [figureData, setFigureData] = useState({data: [{step: 0, percent: 100}]})

    function resetPage() {
        setRemovedList({ removed: [] });
        setSelectedNodeId(0);
        setRemainPercentage(100);
        setLogText({ text: [] });
        setFigureData({ data: [{ step: 0, percent: 100 }] })
    }

    return (
        React.createElement("section", { id: "Page" + PageId, className: " h-screen flex-grow overflow-x-hidden overflow-auto flex flex-wrap content-start p-2" }, /*#__PURE__*/
            React.createElement("div", { className: "p-2 lg:w-2/3 h-full" }, /*#__PURE__*/
                React.createElement("div", { className: "flex flex-col relative rounded h-full w-full bg-card" }, /*#__PURE__*/
                    React.createElement(check_box, { reset, setRemovedList, setReset, resetPage}),
                    React.createElement(ResultZone, { remainPercentage}),
                    React.createElement("div", { className: "flex ml-2 -mt-2 text-gray-400" }, "Reset"), /*#__PURE__*/
                    React.createElement(Page2Graph, { page2GraphData: currGraphData, currExample, setSelectedNodeId, setVisNetwork, reset, resetPage}),
                    React.createElement("div", { className: "absolute shadow-sm bottom-0 rounded w-full h-1/3 flex flex-row float-card p-2" },
                        React.createElement(PanelZone, { selectedNodeId }),
                        React.createElement(PanelInfo, {
                            selectedNodeId, visNetwork, removedList, setRemovedList, setRemainPercentage, setLogText, setFigureData,
                            coreNodes: currKeyLinks.nodes.map((item) => {
                                return {
                                    id: item.id,
                                    name: item.name + '/' + item.industry.map((item) => { return black_market_type_dict[item] }).toString(),
                                    type: item.type,
                                    core: item.core === "1",
                                    weight: Number(item.weight)
                                }
                            })
                        }),
                        // React.createElement(panel_button),
                    ),
                    /*
                    React.createElement("div", { id: "mask", className: "animate-pulse mask absolute shadow-sm bottom-0 rounded w-full h-1/3 hidden rounded" },
                        React.createElement("div", { className: "float-left mt-32 ml-20 text-xl text-white font-semibold" }, "Auto-strike System"), 
                        React.createElement("div", {
                            id: "wrap",
                            className: "float-left ml-80 w-1/2"
                        }),
                        React.createElement("button", {
                            className: "button_2 mt-28 float-right mr-8",
                            onClick: () => {
                                var mask = document.querySelector(".mask");
                                var c = document.querySelector("canvas");
                                console.log(c)
                                var cxt = c.getContext("2d");
                                cxt.clearRect(0, 0, c.width, c.height);
                                mask.style.display = 'none'
                            }
                        }, "Stop"))*/
                )),
            React.createElement("div", { className: "lg:w-1/3 h-full flex flex-col" }, /*#__PURE__*/
                React.createElement("div", { className: "h-1/3 w-full p-2" },
                    React.createElement("div", { className: "rounded relative h-full bg-card flex flex-col" }, /*#__PURE__*/
                        React.createElement("div", { className: "w-full h-16 flex-shrink-0 add-component-head rounded-t pt-2 pl-4",
                        style:{
                            "border-bottom": "4px solid #F0AF19",
                        }},
                        React.createElement("div", { className: "text-2xl font-semibold text-white text-opacity-100" },"实时核心资产排行"),         
        React.createElement("div", { className: "text-xs text-white text-opacity-50" }, "Real-Time Core Assets Ranking")),
                        //React.createElement(Drop_down), /*#__PURE__*/
                        React.createElement(RankZone, {
                            coreNodes: currKeyLinks.nodes.map((item) => {return {
                                id: item.id,
                                name: item.name + '/' + item.industry.map((item) => { return black_market_type_dict[item] }).toString(),
                                type: item.type,
                                core: item.core === "1",
                                weight: Number(item.weight)
                            }}),
                            removedList,
                        })
                    ),
                ),
                React.createElement("div", { className: "h-1/3 w-full p-1" },
                    React.createElement("div", { className: "rounded  h-full bg-card flex flex-col" },
                        React.createElement("div", { className: "w-full h-16 flex-shrink-0 add-component-head rounded-t pt-2 pl-4",
                        style:{
                            "border-bottom": "4px solid #F0AF19",
                        } },
                        React.createElement("div", { className: "text-2xl font-semibold text-white text-opacity-100" },"黑产打击曲线"),         
        React.createElement("div", { className: "text-xs text-white text-opacity-50" }, "Strike Curve")),
                        
                        React.createElement(FigureZone, { figureData })
                    ),
                ),
                React.createElement("div", { className: "h-1/3 w-full p-1" },
                    React.createElement("div", { className: "rounded h-full bg-card" },
                        React.createElement(LogZone, { logText })/*#__PURE__*/
                    )
                )
            )
        )
    )
}





export function Drop_down() {
    return (
        /*#__PURE__*/
        React.createElement("div", {
            class: "selectdiv absolute top-0"
        }, /*#__PURE__*/
            React.createElement("label", null, /*#__PURE__*/
                React.createElement("select", null, /*#__PURE__*/
                    React.createElement("option", {
                        selected: true
                    }, " Select Box "), /*#__PURE__*/
                    React.createElement("option", null, "Last long option"))))
    )
    /*#__PURE__*/
}

function check_box({ reset, setReset, resetPage }) {
    return (
        // React.createElement("ul", {
        //     class: "ks-cboxtags inline"
        // }, /*#__PURE__*/
        /*#__PURE__*/
        React.createElement("button", {
            id: "refresh",
            className: "m-2 flex flex-wrap content-center p-2",
            onClick: () => {
                setReset(!reset);
                resetPage();
            }
        }, /*#__PURE__*/React.createElement("svg", {
            class: "icon",
            width: "25px",
            height: "25px",
            viewBox: "0 0 322.447 322.447",
            // style: {"enable-background":new 0 0 322.447 322.447;}
        }, /*#__PURE__*/
            React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
                d: "M321.832,230.327c-2.133-6.565-9.184-10.154-15.75-8.025l-16.254,5.281C299.785,206.991,305,184.347,305,161.224 c0-84.089-68.41-152.5-152.5-152.5C68.411,8.724,0,77.135,0,161.224s68.411,152.5,152.5,152.5c6.903,0,12.5-5.597,12.5-12.5 c0-6.902-5.597-12.5-12.5-12.5c-70.304,0-127.5-57.195-127.5-127.5c0-70.304,57.196-127.5,127.5-127.5 c70.305,0,127.5,57.196,127.5,127.5c0,19.372-4.371,38.337-12.723,55.568l-5.553-17.096c-2.133-6.564-9.186-10.156-15.75-8.025 c-6.566,2.134-10.16,9.186-8.027,15.751l14.74,45.368c1.715,5.283,6.615,8.642,11.885,8.642c1.279,0,2.582-0.198,3.865-0.614 l45.369-14.738C320.371,243.946,323.965,236.895,321.832,230.327z"
            })))
            // React.createElement("li", null, /*#__PURE__*/React.createElement("input", {
            //     className: "inline-block ",
            //     type: "button",
            //     id: "checkboxTwo",
            //     onClick: ()=> {
            //         setReset(!reset);
            //     }
            // }), /*#__PURE__*/React.createElement("label", {
            //     className: " inline-block w-20",
            //     for: "checkboxTwo"
            // }, "Reset")
            // )
        )
    )
}


const CORE_NODES_TEMPLATE = [
    { id: "Domain_b93a6afd88f8cf90473e9e7ea7f66f7941c57fef1506dfc1002c3c2672f20698", name: "b93a6afd88.com", type: "Domain", core: 1, weight: 3}, 
    { id: "IP_2cd519c4d08e9c3aacc7b7a3bb28318184e4ecfab25978160790a6a635fb080c", name: "8.210.xxx.xxx", type: "IP", core: 1, weight: 10}, 
    { id: "Domain_7242c5f2a6c30572f93bb7233a2648974776f5b985038754f9043263e2d385ba", name: "7242c5f2a6.com", type: "Domain", core: 0},
    { id: "Domain_058afa1130fcbec31b9d4894541ea35c0df4447d50858156d1b575e8031f04d1", name: "058afa1130.com", type: "Domain", core: 1, weight: 4}

]

function RankZone({coreNodes = CORE_NODES_TEMPLATE, removedList}) {

    return ( React.createElement("div", {className: "flex-col flex-grow overflow-y-scroll"},
            coreNodes
            .filter((item) => {return item.core && !(removedList.removed.reduce((last, t) => { return (t === item.id) ? true : last}, false) )})
            .sort((a, b) => {return b.weight - a.weight})
            .map(({ id, name, type, weight }, index) => /*#__PURE__*/
                React.createElement("div", { className: "flex items-center mt-3 px-4", key: id }, /*#__PURE__*/
                    React.createElement("div", { className: "" }, index + 1), /*#__PURE__*/

                    React.createElement(Icon, {
                        path: legendsWithSVG.reduce((last, curr) => {
                            return (curr.group === type.split("_")[0]) ? curr.svg : last;
                        }, "No-Icon"), 
                        className: "ml-2 w-6 h-6" }), /*#__PURE__*/
                    React.createElement("div", { className: "ml-2" }, name), /*#__PURE__*/
                    React.createElement("div", { className: "flex-grow" }), /*#__PURE__*/
                    React.createElement("div", { className: "" }, `${weight}`), /*#__PURE__*/
                    //React.createElement(Icon, { path: "res-react-dash-options", className: "w-2 h-2" })
                )
            )
        )
    )
}


function Page2Graph({ page2GraphData, setSelectedNodeId, setVisNetwork, reset, resetPage}) {
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        plot_page2_graph({
            container_id: "page2_graph_container", page2GraphData, setSelectedNodeId, setVisNetwork, setLoading
        });
        resetPage();
        return () => {
            document.getElementById("page2_graph_container").innerHTML = "";
        }
    }, [page2GraphData, reset])

    return (
        React.createElement("div", { className: "flex-grow w-full h-full relative" },
            loading && React.createElement(LoadingIcon),
            React.createElement("div", {
                id: "page2_graph_container",
                className: "w-full h-full"
            }) /*#__PURE__*/
        )
    )
}

function PanelZone({ selectedNodeId }) {
    return (
        React.createElement("div", {
            id: "panel_node",
            className: "flex-grow-0 w-1/3 h-full flex flex-col bg-black rounded opacity-50 z-1 px-4"
        },
            React.createElement("div",
                { className: "flex text-center mx-auto pt-4 font-bold text-2xl text-white" },
                (selectedNodeId === 0) ? "未选中任何结点" : "当前选中节点"),
            React.createElement("div", {
                className: "flex w-2/3 h-1 bg-green-600 self-center"
            }),
            (selectedNodeId !== 0) && React.createElement(Icon, {
                path: legendsWithSVG.reduce((last, curr) => {
                    return (curr.group === selectedNodeId.split("_")[0]) ? curr.svg : last;
                }, "No-Icon"),
                className: "flex w-20 h-20 p-4 self-center"
            }
            ),
            (selectedNodeId !== 0) && React.createElement("div", {
                className: "flex mb-2 align-bottom items-left mt-4"
            }, 
            React.createElement("div", {
                className: "flex font-semibold text-xl bg-white px-1"
            },"节点类型:\t"),
            React.createElement("div", {
                className: "flex text-xl text-white align-bottom pl-1"
            },  selectedNodeId.split("_")[0])),
            (selectedNodeId !== 0) && React.createElement("div", {
                className: "flex mb-4 align-bottom"
            },
                React.createElement("div", {
                    className: "flex font-semibold text-xl bg-white px-1"
                }, "节点ID:\t"),
                React.createElement("div", {
                    className: "flex text-xl text-white align-bottom pl-1"
                }, selectedNodeId.slice(0, 12) + "..."),
                )
        )
    )
}

function PanelInfo({ selectedNodeId, visNetwork, removedList, setRemovedList, coreNodes, setRemainPercentage, setLogText, setFigureData}) {
    const totalWeight = coreNodes.filter((item) => item.core).reduce((last, curr) => {
        return last + curr.weight
    }, 0)

    // function RemoveSelectedNode(node_id, )
    return (
        React.createElement("div", { className: "flex flex-col w-2/3 z-10 p-4" },
            React.createElement("div", { id: "info_zone_text", className: "float-left justify-items-stretch lg:w-full px-8 grid grid-cols-3 gap-1 h-1/2" },
            React.createElement("div", { id: "info_title_1", className: "text-2xl w-full font-semibold text-gray-800 col-span-3 text-center" }, "动态子图统计数据"),
                React.createElement("div", { id: "info_title_1", className: "text-2xl w-30 font-semibold text-gray-800" }, "Cost."),
                React.createElement("div", { id: "info_title_2", className: "text-2xl w-30 font-semibold text-blue-600" }, "Nodes."),
                React.createElement("div", { id: "info_title_3", className: "text-2xl w-30 font-semibold text-red-600" }, "Links."),
                React.createElement("div", { id: "info_title_1", className: "text-xl w-20 text-gray-800" }, (selectedNodeId === 0) ? "No info." : visNetwork.getConnectedEdges(visNetwork.getSelectedNodes()[0]).length),
                React.createElement("div", { id: "info_title_2", className: "text-xl w-20 text-blue-600" }, (visNetwork === undefined)? 0:visNetwork.body.data.nodes.length),
                React.createElement("div", { id: "info_title_3", className: "text-xl w-20 text-red-600" }, (visNetwork === undefined)? 0:visNetwork.body.data.edges.length), /*#__PURE__*/
            ),
            React.createElement("div", { id: "button_zone", className: "flex flex-col w-full items-center" },
                React.createElement("div", {
                    class: "bt_wrap flex w-1/2 justify-self-center m-2 relative"
                }, /*#__PURE__*/
                    //React.createElement("div", { className: "absolute z-10 w-full h-full", onClick: () => { document.getElementById("remove-select-button").click()}}, ), 
                    React.createElement("button", {
                        id: "remove-select-button",
                        class: "button_1 w-full z-20",
                        disabled: (selectedNodeId === 0) ? true : false,
                        style: {
                            cursor: (selectedNodeId === 0) ? "not-allowed" : "pointer",
                            opacity: (selectedNodeId === 0) ? 0.6 : 1.0,
                        },
                        onClick: () => {
                            console.log(visNetwork.nodes)
                            setRemovedList((item) => { 
                                let new_removed = item.removed.slice()
                                new_removed.push(visNetwork.getSelectedNodes()[0]);
                                return {removed: new_removed}
                            })
                            const selected = visNetwork.getSelectedNodes()[0];
                            const tmp_length = visNetwork.getConnectedEdges(visNetwork.getSelectedNodes()[0]).length
                            setFigureData(
                                (item) => {
                                    let new_data = item.data.slice()
                                    let last_one = new_data[new_data.length - 1]
                                    new_data.push({
                                        step: last_one.step + 1,
                                        percent: last_one.percent - coreNodes.reduce((last, item) => ((item.id == selected && item.core) ? item : last), { weight: 0 }).weight / totalWeight * 100
                                    })
                                    return {data: new_data}
                                }
                            )
                            setRemainPercentage(
                                (item) => {
                                    return item - coreNodes.reduce((last, item) => ((item.id == selected && item.core) ? item : last), {weight: 0}).weight / totalWeight * 100;
                                }
                            )
                            setLogText((item) => {
                                let new_text = item.text.slice();
                                new_text.push("Removing " + selected + ", striking cost is " + tmp_length + ";")
                                return {
                                    text: new_text
                                }
                            });
                            visNetwork.deleteSelected()

                        }
                    }, "打击当前选中节点")),
                React.createElement("div", {
                    class: "bt_wrap flex w-1/2 justify-self-center m-2"
                }, /*#__PURE__*/React.createElement("button", {
                    class: "button_1 w-full",
                    onClick: () => {
                        let maxWeightNode = coreNodes
                            .filter((item) => (item.core && !(removedList.removed.reduce((last, t) => { return (t === item.id) ? true : last }, false))))
                            .reduce((last, item) => {
                                return (last.weight < item.weight) ? item : last
                            })
                        visNetwork.unselectAll();
                        visNetwork.selectNodes([maxWeightNode.id]);
                        const tmp_length = visNetwork.getConnectedEdges(visNetwork.getSelectedNodes()[0]).length
                        visNetwork.deleteSelected();
                        
                        setRemainPercentage(
                            (item) => {
                                return item - maxWeightNode.weight / totalWeight * 100;
                            }
                        )

                        setFigureData(
                            (item) => {
                                let new_data = item.data.slice()
                                let last_one = new_data[new_data.length - 1]
                                new_data.push({
                                    step: last_one.step + 1,
                                    percent: last_one.percent - maxWeightNode.weight / totalWeight * 100
                                })
                                return { data: new_data }
                            }
                        )
                        setRemovedList((item) => {
                            let new_removed = item.removed.slice()
                            new_removed.push(maxWeightNode.id);

                            return { removed: new_removed }
                        })
                        setLogText((item) => {
                            let new_text = item.text.slice();
                            new_text.push("Removing " + maxWeightNode.id + ", striking cost is " + tmp_length + ";")
                            return {
                                text: new_text
                            }
                        });
                        /*
                        var c = document.querySelector("canvas");
                        console.log(c)
                        var cxt = c.getContext("2d");
                        cxt.fillStyle = "#000000";
                        cxt.beginPath();
                        cxt.fillRect(0, 0, c.width, c.height);
                        cxt.closePath();
                        auto_mode()
                        auto_ani(document.getElementById('wrap'),)
                        */
                    }
                }, "打击当前最核心资产")))
        )
    )
}


function auto_mode() {
    var mask = document.querySelector(".mask");
    mask.style.display = 'block'
    console.log(mask.style)
}

function ResultZone({remainPercentage}) {
    return (
        React.createElement("div", {className: "w-1/2 px-4 pt-2 absolute right-2 h-10"},
            React.createElement("div", {className:"flex flex-row"},
                React.createElement("div", {className: "flex text-semibold text-xl px-2"}, "该黑灰产集团核心资产完整度:"),
                React.createElement("div", {className: "flex-grow"}),
                React.createElement("div", {className: "flex text-bold text-3xl"}, Math.round(remainPercentage.toString()) + "%"),
            ),
            React.createElement("div", {
                className: "flex h-full w-full z-1 flex items-center -mt-4",
                style: {
                    //backgroundColor: "rgba(200, 200, 200, 0.8)",
                    transition: "all 0.5s ease",
                }
            },
                React.createElement("div", {
                    className: "m-auto px-2 w-full h-14 flex flex-row items-center", style: {
                        background: "linear - gradient(to bottom, rgba(252, 252, 252, 1) 0 %,rgba(237, 237, 237, 1) 100 %)",
                        borderRadius: "100px",
                    }
                },
                    React.createElement("div", {
                        className: "flex-grow h-1/2 flex items-center overflow-hidden border-2 border-black", style: {
                        }
                    },
                        React.createElement("div", {
                            className: "h-full", style: {
                                width: Math.round(remainPercentage) + "%",
                                transition: "all 0.1s ease",
                                background: "#2d2d2d"
                                //border: "1px solid rgba(30, 30, 30, 0.05)",
                            }
                        })
                    ),
                )
            )
        )
    )
}



function LogZone({logText}) {
    return (
        React.createElement("div", { className: "flex flex-grow-0 flex-col h-full w-full" },
            React.createElement("div", {
                className: "flex-grow w-full overflow-y-scroll rounded", style: {
                    backgroundColor: "rgba(23, 23, 23,0.8)",
                } },
                React.createElement("div", {className: "h-full w-full p-2 text-normal text-white flex flex-col"}, 
                    logText.text.map(
                        (item) => {
                            return React.createElement("div", {
                                className: "flex ",
                                key: item
                            }, item)
                        }
                    ))
            ),
            React.createElement("button", {
                class: "flex-grow-0 flex-shrink-0 bg-gray-500 w-full h-10 rounded-b text-white hover:bg-white hover:text-black"
            }, "Download log")
        )
    )
}

function FigureZone({figureData}) {

    return (
        React.createElement("div", {className: "flex-grow w-full pr-6 p-2"},
            React.createElement(ResponsiveContainer, {
                width: "100%", 
                height: "100%"
            }, 
                React.createElement(AreaChart, {
                    width: 100,
                    height: 60,
                    data: figureData.data.map((item) => {return {step: item.step, percent: Math.round(item.percent)}})
                }, 
                    React.createElement(CartesianGrid, {
                        strokeDasharray: "3 3"
                    }),
                    React.createElement(XAxis, {
                        dataKey: "step",
                        label: {
                            value: "已执行步数",
                            position: "insideBottomRight"
                        }
                    }),
                    React.createElement(YAxis, {
                        label: {
                            value: "核心资产完整度(%)", angle: -90, position: 'InsideLeft', offset: -10,
                            },
                        domain: [0, 100],
                        interval: "preserveEnd"
                    }),
                    React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
                        id: "colorUv",
                        x1: "0",
                        y1: "0",
                        x2: "0",
                        y2: "1"
                      }, /*#__PURE__*/React.createElement("stop", {
                        offset: "5%",
                        stopColor: "black",
                        stopOpacity: 1.0
                      }), /*#__PURE__*/React.createElement("stop", {
                        offset: "95%",
                        stopColor: "#F0AF19",
                        stopOpacity: 0.8
                      }))),
                    React.createElement(Tooltip, null),
                    React.createElement(Area, {
                        type: "monotone",
                        dataKey: "percent",
                        stroke: "black",
                        fill: "url(#colorUv)"
                    }),
                )
            )
            
        )
    )
}