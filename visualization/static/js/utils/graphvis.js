import { black_market_type_dict } from "./config.js";
import { groups_default } from "./config.js";


const defaultOptions = {
    /*
    configure: {
        enabled: true,
        filter: 'physics',
        container: undefined,
        showButton: true
    },*/
    nodes: {
        shape: "dot",
        size: 30,
        font: {
            size: 32,
        },
        borderWidth: 2,
        shadow: false,
        scaling: {
            min: 30,
            max: 80,
        },
        color: {
            highlight: {
                border: "red"
            }
        }
    },
    groups: groups_default,
    edges: {
        width: 4,
        shadow: false,
        color: { highlight: "#FF6B6B" },
    },
    layout: {
        randomSeed: 114514,
        improvedLayout: true,
        clusterThreshold: 150,
        hierarchical: {
            enabled: false,
            levelSeparation: 150,
            nodeSpacing: 100,
            treeSpacing: 200,
            blockShifting: true,
            edgeMinimization: true,
            parentCentralization: true,
            direction: 'UD',        // UD, DU, LR, RL
            sortMethod: 'hubsize',  // hubsize, directed
            shakeTowards: 'leaves'  // roots, leaves
        }
    },
    interaction: {
        dragNodes: true,
        hideEdgesOnDrag: true,
        hideEdgesOnZoom: true,
        hideNodesOnDrag: false,

    },
    physics: {
        forceAtlas2Based: {
            theta: 0.5,
            gravitationalConstant: -200,
            centralGravity: 0.01,
            springConstant: 5,
            springLength: 300,
            damping: 0.5,
            avoidOverlap: 0.5
        },
        maxVelocity: 300,
        minVelocity: 100,
        solver: "forceAtlas2Based",
        timestep: 0.1,
        stabilization: {
            enabled: true,
            iterations: 200,
            updateInterval: 10,
        },
        wind: {
            x: 0, y: 0
        }
    },
};

let main_graph_network, page2_graph_network, key_link_network, page3_graph_network;

export function plot_main_graph({
    id,
    data = {},
    options = defaultOptions,
    setLoading,
    setLoadingPercentage,
    currKeyLinks,

}) {

    setLoading(true)
    setLoadingPercentage(0);
    console.log("plot_main_graph")
    // create an array with nodes
    const raw_nodes = data.nodes;
    if (raw_nodes.length === 0) {
        return;
    }

    let core_nodes_set = new Set();
    currKeyLinks.nodes.filter((item) => item.core === "1").map((item) => {
        core_nodes_set.add(item.id)
    })

    const vis_nodes = raw_nodes.map((item) => {

        let node = { id: item.id, label: item.name + '/' + item.industry.map((item) => { return black_market_type_dict[item] }).toString(), group: item.type }
        if (item.industry.length !== 0)
            node.group = "black";

        node.value = (core_nodes_set.has(node.id)) ? 60 : 30;
        return node;
    });
    var nodes = new vis.DataSet(vis_nodes);

    // create an array with edges
    const raw_edges = data.edges;
    const vis_edges = raw_edges.map((item) => {
        return {
            from: item.source,
            to: item.target,
            color: {
                color: item.relation === "r_cert" ? "#FF9933" :
                    item.relation === "r_subdomain" ? "#A1C7E0" :
                        item.relation === "r_request_jump" ? "green" :
                            item.relation === "r_dns_a" ? "#0099DD" :
                                (item.relation === "r_whois_name" || item.relation === "r_whois_email" || item.relation === "r_whois_phone") ? "#00ABBD"
                                    : "grey"
            },
            width: (core_nodes_set.has(item.source) && core_nodes_set.has(item.source)) ? 12 :
                item.relation === "r_cert" ? 8 :
                    item.relation === "r_subdomain" ? 8 :
                        item.relation === "r_request_jump" ? 8 :
                            item.relation === "r_dns_a" ? 8 :
                                (item.relation === "r_whois_name" || item.relation === "r_whois_email" || item.relation === "r_whois_phone") ? 8
                                    : 2,

            arrows: {
                to: {
                    enabled: true,
                    scaleFactor: item.relation === "r_cert" ? 2 :
                        item.relation === "r_subdomain" ? 2 :
                            item.relation === "r_request_jump" ? 2 :
                                item.relation === "r_dns_a" ? 2 :
                                    (item.relation === "r_whois_name" || item.relation === "r_whois_email" || item.relation === "r_whois_phone") ? 2
                                        : 1,
                    type: "arrow"
                }
            }
            // customize edge here, with item.relation means the type of link
        }
    })
    var edges = new vis.DataSet(vis_edges);
    var options = options;
    // create a networ
    var container = document.getElementById(id);

    var data = {
        nodes: nodes,
        edges: edges,
    };

    if (container.hasChildNodes()) {
        console.log("update main_graph")
        main_graph_network.setData(data);
        main_graph_network.setOptions(options)
    } else {
        main_graph_network = new vis.Network(container, data, options);
        main_graph_network.on("stabilizationProgress", function (params) {
            var widthFactor = params.iterations / params.total;
            setLoadingPercentage(Math.round(widthFactor * 100));
        });
        main_graph_network.once("stabilizationIterationsDone", function () {
            setTimeout(function () {
                setLoading(false);
            }, 500);
        });
    }
}





export function plot_key_link({
    container_id,
    currKeyLinks,
    setLoading
}) {
    console.log("plot key links")
    const raw_nodes = currKeyLinks.nodes;
    if (raw_nodes.length === 0) {
        return;
    }

    setLoading(true);
    let significant_node = raw_nodes.reduce((last, item) => {
        return Number(item.weight) > Number(last.weight) ? item : last
    }, { id: "None", weight: 0 })
    console.log("sig node: " + significant_node)
    const vis_nodes = raw_nodes.map((item) => {
        let node = {
            id: item.id, label: item.name + '/' + item.industry.map((item) => { return black_market_type_dict[item] }).toString(), group: item.type,
            core: (item.core === 1) ? true : false, value: Number(item.weight)
        }
        if (item.id === significant_node.id) {
            node.fixed = true
        }
        if (item.industry.length !== 0)
            node.group = "black";
        return node;
    })
    const nodes = new vis.DataSet(vis_nodes);


    const raw_edges = currKeyLinks.edges;
    const vis_edges = raw_edges.map((item) => {
        return {
            from: item.source,
            to: item.target,
            color: {
                color: item.relation === "r_cert" ? "#FF9933" :
                    item.relation === "r_subdomain" ? "#A1C7E0" :
                        item.relation === "r_request_jump" ? "green" :
                            item.relation === "r_dns_a" ? "#0099DD" :
                                (item.relation === "r_whois_name" || item.relation === "r_whois_email" || item.relation === "r_whois_phone") ? "00ABBD"
                                    : "grey"
            },
            width: item.relation === "r_cert" ? 8 :
                item.relation === "r_subdomain" ? 8 :
                    item.relation === "r_request_jump" ? 8 :
                        item.relation === "r_dns_a" ? 8 :
                            (item.relation === "r_whois_name" || item.relation === "r_whois_email" || item.relation === "r_whois_phone") ? 8
                                : 2,

            arrows: {
                to: {
                    enabled: true,
                    scaleFactor: item.relation === "r_cert" ? 2 :
                        item.relation === "r_subdomain" ? 2 :
                            item.relation === "r_request_jump" ? 2 :
                                item.relation === "r_dns_a" ? 2 :
                                    (item.relation === "r_whois_name" || item.relation === "r_whois_email" || item.relation === "r_whois_phone") ? 2
                                        : 1,
                    type: "arrow"
                }
            }
            // customize edge here, with item.relation means the type of link
        }
    });

    const edges = new vis.DataSet(vis_edges);

    const data = { nodes: nodes, edges: edges };

    const options = {
        /*
        configure: {
            enabled: true,
            filter: 'physics',
            container: undefined,
            showButton: true
        },*/
        nodes: {
            shape: "dot",
            font: {
                size: 32,
            },
            borderWidth: 2,
            shadow: false,
            scaling: {
                min: 20,
                max: 60,
                customScalingFunction: function (min, max, total, value) {
                    if (max === min) {
                        return 0.5;
                    }
                    else {
                        var scale = 1 / (max - min);
                        return Math.max(0, (value - min) * scale);
                    }
                }
            },
            color: {
                highlight: {
                    border: "red"
                }
            }
        },
        groups: groups_default,
        edges: {
            width: 4,
            shadow: false,
            color: { highlight: "#FF6B6B" },
        },
        layout: {
            randomSeed: 114514,
            improvedLayout: true,
            clusterThreshold: 150,
            hierarchical: {
                enabled: false,
                levelSeparation: 150,
                nodeSpacing: 100,
                treeSpacing: 200,
                blockShifting: true,
                edgeMinimization: true,
                parentCentralization: true,
                direction: 'UD',        // UD, DU, LR, RL
                sortMethod: 'hubsize',  // hubsize, directed
                shakeTowards: 'leaves'  // roots, leaves
            }
        },
        interaction: {
            dragNodes: true,
            hideEdgesOnDrag: true,
            hideEdgesOnZoom: true,
            hideNodesOnDrag: false,
            // selectable: true,
        },
        physics: {
            forceAtlas2Based: {
                theta: 0.5,
                gravitationalConstant: -1000,
                centralGravity: 0.01,
                springConstant: 5,
                springLength: 300,
                damping: 0.5,
                avoidOverlap: 0.5
            },
            maxVelocity: 500,
            minVelocity: 40,
            solver: "forceAtlas2Based",
            timestep: 0.1,
            stabilization: {
                enabled: true,
                iterations: 100,
                updateInterval: 10,
            },
            wind: {
                x: 300, y: 0
            }
        },
    };

    const container = document.getElementById(container_id);

    if (container.hasChildNodes()) {
        console.log("update key links")
        key_link_network.setData(data);
        key_link_network.setOptions(options);
    } else {
        key_link_network = new vis.Network(container, data, options);
        key_link_network.once("stabilizationIterationsDone", function () {
            setTimeout(function () {
                setLoading(false);
            }, 500);
        });
    }
}

export function plot_page2_graph({
    container_id,
    page2GraphData,
    options = defaultOptions,
    setSelectedNodeId,
    setVisNetwork,
    setLoading
}) {
    console.log("plot_page2_graph");
    const raw_nodes = page2GraphData.nodes;
    if (raw_nodes.length === 0) {
        return;
    }
    setLoading(true)
    const vis_nodes = raw_nodes.map((item) => {
        let node = { id: item.id, label: item.name + '/' + item.industry.map((item) => { return black_market_type_dict[item] }).toString(), group: item.type }
        if (item.industry.length !== 0)
            node.group = "black";
        node.value = (node.group === "Whois_Name" || node.group === "Whois_Phone" || node.group === "Whois_Email") ? 50 : 30;
        return node;
    });

    let nodes = new vis.DataSet(vis_nodes);
    const raw_edges = page2GraphData.edges;
    const vis_edges = raw_edges.map((item) => {
        return {
            from: item.source,
            to: item.target,
            color: {
                color: item.relation === "r_cert" ? "#FF9933" :
                    item.relation === "r_subdomain" ? "#A1C7E0" :
                        item.relation === "r_request_jump" ? "green" :
                            item.relation === "r_dns_a" ? "#0099DD" :
                                (item.relation === "r_whois_name" || item.relation === "r_whois_email" || item.relation === "r_whois_phone") ? "00ABBD"
                                    : "grey"
            },
            width: item.relation === "r_cert" ? 8 :
                item.relation === "r_subdomain" ? 8 :
                    item.relation === "r_request_jump" ? 8 :
                        item.relation === "r_dns_a" ? 8 :
                            (item.relation === "r_whois_name" || item.relation === "r_whois_email" || item.relation === "r_whois_phone") ? 8
                                : 2,

            arrows: {
                to: {
                    enabled: true,
                    scaleFactor: item.relation === "r_cert" ? 2 :
                        item.relation === "r_subdomain" ? 2 :
                            item.relation === "r_request_jump" ? 2 :
                                item.relation === "r_dns_a" ? 2 :
                                    (item.relation === "r_whois_name" || item.relation === "r_whois_email" || item.relation === "r_whois_phone") ? 2
                                        : 1,
                    type: "arrow"
                }
            }
            // customize edge here, with item.relation means the type of link
        }
    });

    var edges = new vis.DataSet(vis_edges);
    var options = options;
    var container = document.getElementById(container_id);

    var data = {
        nodes: nodes,
        edges: edges,
    };


    if (container.hasChildNodes()) {
        console.log("update page2_graph")
        page2_graph_network.setData(data);
        page2_graph_network.setOptions(options)
    } else {

        page2_graph_network = new vis.Network(container, data, options);
        setVisNetwork(page2_graph_network)
        page2_graph_network.on("selectNode", () => {
            let nodes = page2_graph_network.getSelectedNodes();
            setSelectedNodeId(nodes[0])
        })
        page2_graph_network.on("deselectNode", () => {
            setSelectedNodeId(0)
        })
        page2_graph_network.once("stabilizationIterationsDone", function () {
            setTimeout(function () {
                setLoading(false);
            }, 500);
        });
        /*
        main_graph_network.on("stabilizationProgress", function (params) {
            var widthFactor = params.iterations / params.total;
            setLoadingPercentage(Math.round(widthFactor * 100));
        });
        main_graph_network.once("stabilizationIterationsDone", function () {
            setTimeout(function () {
                setLoading(false);
            }, 500);
        });*/
    }
}



export function plot_page3_graph({ page3GraphData, container_id, setLoading }) {
    console.log("plot page3 graph");
    const raw_nodes = page3GraphData.nodes;
    if (raw_nodes.length === 0) {
        return;
    }
    const vis_nodes = raw_nodes.map((item) => {

        let node = { id: item.id, label: item.name + '/' + item.industry.map((item) => { return black_market_type_dict[item] }).toString(), group: item.type }
        if (item.industry.length !== 0)
            node.group = "black";
        node.value = (node.group === "Whois_Name" || node.group === "Whois_Phone" || node.group === "Whois_Email") ? 50 : 30;
        return node;
    });
    var nodes = new vis.DataSet(vis_nodes);

    const raw_edges = page3GraphData.edges;
    const vis_edges = raw_edges.map((item) => {
        return {
            from: item.source,
            to: item.target,
            color: {
                color: item.relation === "r_cert" ? "#FF9933" :
                    item.relation === "r_subdomain" ? "#A1C7E0" :
                        item.relation === "r_request_jump" ? "green" :
                            item.relation === "r_dns_a" ? "#0099DD" :
                                (item.relation === "r_whois_name" || item.relation === "r_whois_email" || item.relation === "r_whois_phone") ? "00ABBD"
                                    : "grey"
            },
            width: item.relation === "r_cert" ? 8 :
                item.relation === "r_subdomain" ? 8 :
                    item.relation === "r_request_jump" ? 8 :
                        item.relation === "r_dns_a" ? 8 :
                            (item.relation === "r_whois_name" || item.relation === "r_whois_email" || item.relation === "r_whois_phone") ? 8
                                : 2,

            arrows: {
                to: {
                    enabled: true,
                    scaleFactor: item.relation === "r_cert" ? 2 :
                        item.relation === "r_subdomain" ? 2 :
                            item.relation === "r_request_jump" ? 2 :
                                item.relation === "r_dns_a" ? 2 :
                                    (item.relation === "r_whois_name" || item.relation === "r_whois_email" || item.relation === "r_whois_phone") ? 2
                                        : 1,
                    type: "arrow"
                }
            }
            // customize edge here, with item.relation means the type of link
        }
    })


    var edges = new vis.DataSet(vis_edges);

    var container = document.getElementById(container_id);

    var data = {
        nodes: nodes,
        edges: edges,
    };

    let options = defaultOptions

    if (container.hasChildNodes()) {
        console.log("update page3 graph")
        page3_graph_network.setData(data);
        page3_graph_network.setOptions(options)
    } else {
        page3_graph_network = new vis.Network(container, data, options);

        page3_graph_network.once("stabilizationIterationsDone", function () {
            setTimeout(function () {
                setLoading(false);
            }, 500);
        });
    }
}