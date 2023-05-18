import { Placeholder, Graph, TopCountries, Segmentation, Satisfication, AddComponent } from "../utils/template.js"
const { useState, useEffect, useLayoutEffect, useMemo } = React;
import { candidate_domains } from "../utils/config.js";
import { SendRequest } from "../utils/network.js";
import { plot_page3_graph } from "../utils/graphvis.js"
import { LoadingIcon } from "../utils/component.js";

function getRandomArrayElements(arr, count) {
    let shuffled = arr.slice(0);
    let length = arr.length;
    let min = length - count;

    while (length-- > min) {
        let index = Math.floor((length + 1) * Math.random());
        let temp = shuffled[index]
        shuffled[index] = shuffled[length];
        shuffled[length] = temp
    }
    return shuffled.slice(min);
}

export function Page3({ PageId }) {
    const [selectedId, setSelectedId] = useState(0);

    const [candidates, setCandidate] = useState(getRandomArrayElements(candidate_domains, 8))

    const [page3GraphData, setPage3GraphData] = useState({ nodes: [], edges: [] })
    const [loading, setLoading] = useState(false);

    return (
        React.createElement("section", { id: "Page" + PageId, className: " h-screen flex-grow overflow-x-hidden overflow-auto flex flex-wrap content-start p-2" }, /*#__PURE__*/


            React.createElement("div", { className: "w-full p-2 lg:w-2/3 h-full" }, /*#__PURE__*/
                React.createElement("div", { className: "rounded bg-card sm:h-30 h-full relative" }, /*#__PURE__*/
                    loading && React.createElement(LoadingIcon),
                    React.createElement(GraphZone, { page3GraphData, setLoading}))), /*#__PURE__*/


            React.createElement("div", { className: "w-full p-2 lg:w-1/3 h-full" }, /*#__PURE__*/
                React.createElement("div", { className: "grid rounded bg-gray-900 h-full p-6" },
                    /*#__PURE__*/
                    React.createElement("div", null, /*#__PURE__*/
                        React.createElement("input", {
                            id: "search-input",
                            class: "shadow-lg focus:shadow border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent w-4/6 rounded h-10",
                            defaultValue: candidates[selectedId]
                        },
                        ), /*#__PURE__*/
                        React.createElement("button", {
                            class: "shadow-xl focus:shadow bg-blue-600 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 w-28 ml-2 h-10 rounded text-white mb-10",
                            onClick: () => {
                                let domain_id = document.getElementById("search-input").value;
                                setLoading(true);
                                SendRequest({
                                    url: "/real_time",
                                    method: "POST",
                                    data: {
                                        domain_id: domain_id
                                    },
                                    success: (res) => {
                                        setPage3GraphData(res)
                                    }
                                })
                            }

                        }, "Search")
                    ), /*#__PURE__*/
                    candidates.map((item, index) => {
                        return (
                            React.createElement(create_tag,
                                { tagName: item, Index: index, selectedId: selectedId, setSelectedId: setSelectedId, candidates: candidates }
                            )
                        )
                    }),

                    React.createElement("button", {
                        className: "place-self-end shadow-xl focus:shadow bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 w-3/6 h-10 rounded text-white mb-10",
                        onClick: () => {
                            setCandidate(getRandomArrayElements(candidate_domains, 8))
                        }
                    }, "Regenerate")))
            // React.createElement(create_range_input_win10),/*#__PURE__*/
            // React.createElement(create_range_input_rounded),
            // React.createElement(create_switch),
            // React.createElement(create_switch))), /*#__PURE__*/
        )
    );
}

function create_range_input_win10() {
    return (
        React.createElement("input", {
            type: "range",
            class: "win10-thumb"
        })
    )
}
function create_range_input_rounded() {
    return (
        React.createElement("input", {
            type: "range",
            class: ""
        })
    )
}

function create_tag({
    tagName = "Default",
    Index = 0,
    selectedId = 0,
    setSelectedId,
    candidates
}) {
    return (
        React.createElement("ul", {
            class: "ks-cboxtags w-full"
        }, /*#__PURE__*/
            React.createElement("li", { className: "w-full" }, /*#__PURE__*/
                React.createElement("input", {
                    type: "checkbox",
                    id: "tag_" + tagName + Index,
                    value: tagName,
                    checked: (Index === selectedId) ? true : false,
                    onClick: () => {
                        setSelectedId(Index),
                        document.getElementById("search-input").value = candidates[Index]
                    }
                }), /*#__PURE__*/React.createElement("label", {
                    for: "tag_" + tagName + Index,
                }, tagName.slice(0, 30) + '...')))
    )
}



function GraphZone({ page3GraphData, setLoading }) {
    useEffect(() => {
        if (page3GraphData.nodes.length === 0) {
            return
        }
        plot_page3_graph({
            container_id: "page3_graph_container", page3GraphData, setLoading
        });
        return () => {
            document.getElementById("page3_graph_container").innerHTML = "";
        }
    }, [page3GraphData])
    return (
        React.createElement("div", { className: "flex-grow w-full h-full" },
            React.createElement("div", {
                id: "page3_graph_container",
                className: "w-full h-full"
            }) /*#__PURE__*/
        )
    )
}