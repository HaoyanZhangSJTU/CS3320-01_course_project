const { useState, useEffect, useLayoutEffect, useMemo } = React;
const { useSpring, animated, config } = ReactSpring;

import { plot_statistics_graph_node, plot_statistics_graph_link, plot_prob_main, plot_prob_sub, plot_cloud } from "../utils/figures.js"
import { Icon, IconButton, Image, LoadingIcon, TabsButton } from "../utils/component.js";
import { plot_main_graph, plot_key_link } from "../utils/graphvis.js";
import { SendRequest } from "../utils/network.js";
import { main_graph_options_per_example, legendsWithSVG, choices } from "../utils/config.js";


export function Page1({ PageId, currExample, setCurrExample, currGraphData, currKeyLinks }) {
    let data_stack = [[1, 2, 3], [6, 5, 4]];
    let buttons = []
    for (let i = 0; i < 10; i++) {
        buttons.push({
            label: (i + 1),
            onClick: () => {
                setCurrExample(i + 1);
            }
        })
    }


    return (
        React.createElement("section", {
            id: "Page" + PageId,
            className: "h-screen w-full flex-grow overflow-x-hidden overflow-auto flex flex-row content-start p-2"
        }, /*#__PURE__*/
            React.createElement("div", { className: "h-full w-2/3 flex flex-col" },
                React.createElement("div", { className: "h-5/9 w-full flex flex-row" },
                    // Fine-grained Graph Zone
                    React.createElement("div", { className: "pl-2 pt-2 w-3/4 h-full" }, /*#__PURE__*/
                        React.createElement("div", { className: "rounded-t h-full bg-card" }, /*#__PURE__*/
                            React.createElement(FineGrainedGraphZone, { currExample: currExample, setCurrExample: setCurrExample, currGraphData, currKeyLinks }), /*#__PURE__*/
                        ),
                    ),
                    React.createElement("div", { className: " pr-2 pt-2 w-1/4 h-full" },
                        React.createElement("div", { className: "bg-card h-full" }, /*#__PURE__*/
                            React.createElement(LegendZone, { legendsWithSVG: legendsWithSVG })
                        )
                    )),
                React.createElement("div", { className: "pl-2 pr-2 pb-2 w-full h-1/9" },
                    React.createElement("div", { className: "rounded-b bg-card h-full" }, /*#__PURE__*/
                        React.createElement(TabsButton, {
                            tabsButtonName: "ExampleTab",
                            buttons: buttons
                        })
                    )),
                // Key-path Zone
                React.createElement("div", { className: "h-1/3 w-full p-2" }, /*#__PURE__*/
                    React.createElement("div", { className: "rounded bg-card h-full" }, /*#__PURE__*/
                        React.createElement(KeyPathZone, { currExample: currExample, currKeyLinks })
                    )
                )), /*#__PURE__*/
            React.createElement("div", { className: "h-full w-1/3 flex flex-col" },
                React.createElement("div", { className: "h-1/4 w-full p-2" }, /*#__PURE__*/
                    React.createElement("div", { className: "rounded bg-card h-full" },
                        /*#__PURE__*/
                        React.createElement(InfoZone, { currExample: currExample }))), /*#__PURE__*/

                React.createElement("div", { className: "h-1/3 w-full p-2" },
                    React.createElement(FiguresZone, { currExample: currExample })
                ),),

            //         React.createElement("div", { className: "w-3/12 flex flex-col" }, 
            //             React.createElement("div", { className: "w-full  h-full" },
            //                 // Figures Zone
            //                 React.createElement("div", { className: "w-full p-2 h-1/3" }, /*#__PURE__*/
            //                     React.createElement("div", { className: "rounded bg-card h-full" }, /*#__PURE__*/
            //                         React.createElement(FiguresZone, { currExample: currExample }))), /*#__PURE__*/

            //                 // Info Zone
        )
        // )
    )
}




function FineGrainedGraphZone({ currExample, setCurrExample, currGraphData, currKeyLinks }) {

    const [loading, setLoading] = useState(true);
    const [loadingPercentage, setLoadingPercentage] = useState(0);

    useEffect(() => {
        plot_main_graph({
            id: "main_graph_container", data: currGraphData, options: main_graph_options_per_example[currExample],
            setLoading: setLoading,
            setLoadingPercentage: setLoadingPercentage,
            progressing_bar_id: "main_graph_progressing_bar",
            currKeyLinks,
        })

        return () => {
            document.getElementById("main_graph_container").innerHTML = ""
        }
    }, [currGraphData, currKeyLinks])

    return React.createElement("div", { className: "flex p-1 relative w-full h-full flex-col" }, /*#__PURE__*/

        React.createElement("div", { className: "flex-grow w-full h-full" },
            React.createElement("div", { id: "main_graph_container", className: "w-full h-full", }),
            loading && React.createElement("div", {
                id: "main_graph_progressing_bar",
                className: "absolute top-0 left-0 h-full w-full z-1 flex items-center",
                style: {
                    background: "black"
                }
            },
                React.createElement("div", {
                    className: "m-auto p-2 w-1/3 h-14 flex flex-row items-center", style: {
                        background: "linear - gradient(to bottom, rgba(252, 252, 252, 1) 0 %,rgba(237, 237, 237, 1) 100 %)",
                        borderRadius: "100px",
                    }
                },
                    React.createElement("div", { className: "mr-4" }, loadingPercentage + "%"),
                    React.createElement("div", {
                        className: "flex-grow h-3/4 flex items-center overflow-hidden rounded-full shadow border-2 border-gray-600", style: {
                        }
                    },
                        React.createElement("div", {
                            className: "h-full bg-gradient-to-r from-green-400 to-blue-500", style: {
                                width: loadingPercentage + "%",
                                borderRadius: "100px",
                                transition: "all 0.1s ease",
                                //border: "1px solid rgba(30, 30, 30, 0.05)",
                            }
                        })
                    ),
                )
            )
        ),
    )
}

function CoarseGrainedGraphZone({ currExample, setCurrExample }) {

    const [zoom, setZoom] = useState(false);
    const [currNode, setCurrNode] = useState(currExample);
    const { x } = useSpring({
        from: { x: 0 },
        x: zoom ? 1 : 0,
        config: { duration: 200 }
    });
    useEffect(() => {
        plot_sub_graph({ id: "sub_graph_container", setCurrNode: setCurrNode })
    }, [])

    return (
        React.createElement(animated.div, {
            className: "absolute content-box py-0 px-5 z-40",//+ x.to({ range: [0, 1], output: [" w-1/3 h-1/3 ", " w-2/3 h-full "]}),
            style: {
                width: x.to({
                    range: [0, 1],
                    output: ["33.333%", "100%"],
                }),
                height: x.to({
                    range: [0, 1],
                    output: ["33.333%", "100%"],
                }),
            },
        },
            React.createElement("div", { className: "relative rounded content-box border-2 p-2 border-gray-300 w-auto h-auto flex-grow flex flex-col justify-between float-card shadow-md -left-4 bottom-0" }, /*#__PURE__*/
                React.createElement("div", { className: "flex flex-row items-center w-full opacity-75 px-2 py-1 text-sm font-bold bg-black" }, /*#__PURE__*/
                    // React.createElement("div", { className: "text-xl font-normal text-black flex-grow-0" }, "FloatGraph"), /*#__PURE__*/
                    // React.createElement("div", { className: "flex-1" }),
                    React.createElement("button", {
                        label: "总图",
                        type: "button",
                        className: "flex-grow-0",
                        onClick: () => {
                            setZoom(!zoom);
                        },

                    }, "总图",
                        zoom ? React.createElement("img", {
                            src: "static/img/res-react-dash-minus.svg",
                            alt: "",
                            className: "w-full h-full"
                        }) :
                            React.createElement("img", {
                                src: `static/img/res-react-dash-plus.svg`,
                                alt: "",
                                className: "w-full h-full"
                            })
                    )
                ), /*#__PURE__*/
                React.createElement("div", { id: "sub_graph_container", className: "flex-grow w-full h-full" }),
                zoom && (currNode !== currExample) && React.createElement("div", { className: "flex flex-row items-center rounded-bl-lg rounded-tr-lg bg-details bg-opacity-95 absolute -right-4 -bottom-4 w-80" }, /*#__PURE__*/
                    React.createElement("div", { className: "text-l font-medium text-yellow-100 underline flex-grow-0 py-6 px-2 ml-2" }, "确认选择子图示例" + currNode + "?"), /*#__PURE__*/
                    React.createElement("div", { className: "flex-1" }),
                    React.createElement("button", {
                        type: "button",
                        className: "flex-grow-0",
                        onClick: () => {
                            setZoom(false);
                            setCurrExample(currNode);

                        }
                    },
                        React.createElement("img", {
                            src: `static/img/res-react-dash-check.svg`,
                            alt: "",
                            className: "w-10 h-10 mr-2"
                        })
                    )
                ), /*#__PURE__*/
            )
        )
    )
}

function SelectZone({ choices, currExample, setCurrExample }) {
    return (
        // React.createElement("div",
        //     { className: "flex flex-rom w-full h-full", },
        // choices.map((item, index) => {
        //     return React.createElement("div", {
        //         key: item.idx,
        //         className: "flex flex-row items-center",
        //         style: {
        //             width: (100 / (choices.length + 1)) + "%"
        //         }
        //     },
        //         React.createElement(selectItem, {item, setCurrExample}),//, onClick: choice, selected:setChoice
        //         React.createElement("div", { className: "flex-grow" }),
        //         React.createElement("div", { className: "flex flex-grow-0 mx-auto text-xs font-normal text-black" }, item.idx),
        //         React.createElement("div", { className: "flex-grow" }),
        //     )
        // })

        // )
        React.createElement(TabsButton,
            {
                tabsButtonName: "FigureTab",
                buttons: [
                    {
                        label: "1",
                        onClick: () => {
                            setCurrentFigure(0);
                        }
                    },
                    {
                        label: "子图",
                        onClick: () => {
                            setCurrentFigure(1);
                        }
                    }
                ]
            })
    )
}

function selectItem({ item: { idx }, setCurrExample }) {//, onClick, selected 
    return /*#__PURE__*/(
        React.createElement("img", {
            src: 'static/img/' + `examples-thumbnail-${idx}.jpg`,
            className:
                "flex w-8 h-10 flex-grow-0 p-1 choice",
            // + ((selected === idx) ? 'choice-item-selected' : 'choice-item'),
            // onClick: () => {
            //     onClick(id);

            // },
            onClick: () => {
                setCurrExample(idx);
            }
        },
        ))
}

function LegendZone({ legendsWithSVG }) {
    return (
        React.createElement("div",
            { className: "flex flex-col w-full h-full", },
            legendsWithSVG.map((item, index) => {
                return React.createElement("div", {
                    key: item.group,
                    className: "flex flex-row items-center",
                    style: {
                        height: (100 / (legendsWithSVG.length + 2)) + "%"
                    }
                },
                    Icon({
                        path: item.svg,
                        className: "flex w-8 h-8 flex-grow-0 p-1",
                    }),
                    React.createElement("div", { className: "flex-grow" }),
                    React.createElement("div", { className: "flex flex-grow-0 mx-auto text-xs font-normal text-black" }, item.info),
                    React.createElement("div", { className: "flex-grow" }),
                )
            })
        )
    )
}

function FiguresZone({ currExample }) {
    let [currentFigure, setCurrentFigure] = useState(0);

    return React.createElement("div", { className: "flex h-full flex-col figures" }, /*#__PURE__*/
        React.createElement("div", { className: "flex flex-col items-start h-full w-full" }, /*#__PURE__*/
            React.createElement("div", {
                className: "flex-grow prob_info w-full h-full justify-center"
            },
                currentFigure === 0 && React.createElement(
                    plot_cloud,
                    { graph_name: "cloud", currExample: currExample },
                ),
                currentFigure === 1 && React.createElement(
                    plot_prob_sub,
                    { graph_name: "sub_prob", currExample: currExample }
                )
            ),
            React.createElement(TabsButton,
                {
                    tabsButtonName: "FigureTab",
                    buttons: [
                        {
                            label: "总图",
                            onClick: () => {
                                setCurrentFigure(0);
                            }
                        },
                        {
                            label: "子图",
                            onClick: () => {
                                setCurrentFigure(1);
                            }
                        }
                    ]
                }
            ),
        ), /*#__PURE__*/
    )

}

function InfoZone({ currExample }) {
    useEffect(() => {
        SendRequest({
            url: "/stat_info",
            method: "POST",
            data: {
                example_id: currExample,
            },
            success: (data) => {
                let info_zone_text = document.getElementById("info_num_1");
                info_zone_text.innerHTML = currExample;

                info_zone_text = document.getElementById("info_num_2");
                info_zone_text.innerHTML = data['Node'];

                info_zone_text = document.getElementById("info_num_3");
                info_zone_text.innerHTML = data['Link'];
            }
        })
    }, [currExample])

    return React.createElement("div", { className: "flex p-4 flex-col" }, /*#__PURE__*/
        React.createElement("div", { className: "" },
            React.createElement("div", { className: "sm:flex-grow flex justify-between" }, /*#__PURE__*/
                React.createElement("div", { className: "flex flex-col" }, /*#__PURE__*/
                    React.createElement("div", { id: "info_zone_title", className: "grid grid-cols-3 gap-4 py-1" },
                        React.createElement("div", { id: "info_title_1", className: "text-2xl w-80 font-semibold text-gray-800" }, "Group."),
                        React.createElement("div", { id: "info_title_2", className: "text-2xl w-80 font-semibold text-blue-600" }, "Nodes."),
                        React.createElement("div", { id: "info_title_3", className: "text-2xl w-80 font-semibold text-red-600" }, "Links."),
                        React.createElement("div", { id: "info_num_1", className: "text-xl w-80 text-gray-800" }, "10"),
                        React.createElement("div", { id: "info_num_2", className: "text-xl w-80 text-blue-600" }, "2080"),
                        React.createElement("div", { id: "info_num_3", className: "text-xl w-80 text-red-600" }, "3090"), /*#__PURE__*/
                    ),
                    React.createElement("div", { id: "info_zone_text", className: "text-lg" }, "")
                ), /*#__PURE__*/
            )
        )
    )
}

function KeyPathZone({ currExample, currKeyLinks }) {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        plot_key_link({ container_id: "Key_link_container", currKeyLinks, setLoading });
        return () => {
            document.getElementById("Key_link_container").innerHTML = ""
        }
    }, [currKeyLinks])
    return React.createElement("div", { className: "flex-grow h-full p-1 flex flex-row" }, /*#__PURE__*/
        React.createElement("div", { className: "w-1/10 flex-grow-0" },
            React.createElement("div", { className: "sm:flex-grow flex justify-between" }, /*#__PURE__*/

                React.createElement("div", { className: "flex items-left " }, /*#__PURE__*/
                    React.createElement("div", { className: "text-l font-normal text-black font-semibold w-full border-b-4" }, "关键路径",
                    ), /*#__PURE__*/
                ), /*#__PURE__*/
            )
        ),

        React.createElement("div", { className: "flex flex-grow w-9/10 h-full relative" },
            loading && React.createElement(LoadingIcon),
            React.createElement("div", { id: "Key_link_container", className: "flex flex-grow h-full" },
            )
        )
    )
}