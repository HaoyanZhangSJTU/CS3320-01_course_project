const { useState, useEffect, useLayoutEffect, useMemo } = React;

import { SendRequest } from "./network.js";


let checkBeforeDraw = function (Chart) {
    if (Chart != null && Chart != "" && Chart != undefined) {
        Chart.dispose(); //销毁
    }
}

let graph_node_chart;
export function plot_statistics_graph_node({ graph_name, currExample }) {
    useEffect(() => {
        SendRequest({
            url: "/stat_node",
            method: "POST",
            data: {
                example_id: currExample
            },
            success: (data) => {
                checkBeforeDraw(graph_node_chart)
                var container = document.getElementById(graph_name);
                container.innerHTML = ""
                function getStyle(el, name) {
                    if (window.getComputedStyle) {
                        return window.getComputedStyle(el, null);
                    } else {
                        return el.currentStyle;
                    }
                }
                function resizeContainer() {
                    var wi = getStyle(container, 'width').width;
                    var hi = getStyle(container, 'height').height;
                    console.log(container.style.width)
                    container.style.height = hi;
                    container.style.width = 0.2 * window.innerWidth + "px";
                }
                // $(window).on('resize', function () {
                //     resizeContainer();
                //     graph_node_chart.resize();
                // });
                // resizeContainer();
                //console.log(window.innerWidth)
                //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
                graph_node_chart = echarts.init(container);
                var option = {
                    title: {
                        text: '各类型节点\n比例',
                        left: 'center',
                        top: 'bottom',
                        textStyle: {
                            fontSize: 14
                        }
                    },
                    itemStyle: {
                        borderRadius: 2,
                        borderColor: "#fff",
                        borderWidth: 2,
                    },
                    series: [
                        {
                            type: 'pie',
                            data: data,
                            radius: ['30%', '70%']
                        }
                    ]
                };
                graph_node_chart.setOption(option);
            }
        });
    }, [currExample]);

    return (
        React.createElement("div", { className: "flex-grow h-full", id: graph_name })
    )
};

let graph_link_chart;
export function plot_statistics_graph_link({ graph_name, currExample }) {
    useEffect(() => {
        SendRequest({
            url: "/stat_link",
            method: "POST",
            data: {
                example_id: currExample,
            },
            success: (data) => {
                checkBeforeDraw(graph_link_chart)
                var container = document.getElementById(graph_name);
                container.innerHTML = ""
                function getStyle(el, name) {
                    if (window.getComputedStyle) {
                        return window.getComputedStyle(el, null);
                    } else {
                        return el.currentStyle;
                    }
                }
                function resizeContainer() {
                    var wi = getStyle(container, 'width').width;
                    var hi = getStyle(container, 'height').height;
                    console.log(container.style.width)
                    container.style.height = hi;
                    container.style.width = 0.2 * window.innerWidth + "px";
                }
                // $(window).on('resize', function () {
                //     resizeContainer();
                //     graph_link_chart.resize();
                // });
                // resizeContainer();
                //console.log(window.innerWidth)
                //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
                graph_link_chart = echarts.init(container);
                var option = {
                    title: {
                        text: '各类型连边\n比例',
                        left: 'center',
                        top: 'bottom',
                        textStyle: {
                            fontSize: 14
                        }
                    },
                    itemStyle: {
                        borderRadius: 2,
                        borderColor: "#fff",
                        borderWidth: 2,
                    },
                    series: [
                        {
                            type: 'pie',
                            data: data,
                            radius: ['30%', '70%']
                        }
                    ]
                };
                graph_link_chart.setOption(option);
            }
        });
    }, [currExample]);

    return (
        React.createElement("div", { className: "flex-grow h-full", id: graph_name })
    )



};

// function resizeContainer(container) {
//     var wi = getStyle(container).width;
//     var hi = getStyle(container).height;
//     console.log(container.style.width)
//     container.style.height = hi;
//     container.style.width = 0.2 * window.innerWidth + "px";
// }

// function getStyle(el) {
//         if (window.getComputedStyle) {
//             return window.getComputedStyle(el, null);
//         } else {
//             return el.currentStyle;
//         }
// }
var color=[ "#FF5733", "#6D4C41", "#FFE4C4", "#7FFFD4", "#8B0000", "#8FBC8F", "#00CED1", "#F08080", "#191970", "#FFFF00" ]

let graph_stack;
export function plot_prob_main({graph_name}) {
    
    useEffect(() => {
        SendRequest({
            url: "/stat_prob_all",
            method: "POST",
            data: {
                example_id: 10,
            },
            success: (data) => {
    var stack_container = document.getElementById(graph_name);
    // stack_container.innerHTML = ""

    // $(window).on('resize', function () {
    //     resizeContainer(stack_container);
    //     graph_stack.resize();
    // });
    // resizeContainer(stack_container);
    graph_stack = echarts.init(stack_container);
    var series_ = []
    for(var i = 0; i<data.length; i++){
        series_.push({
            type: 'bar',
            stack: 'x',            
            data: data[i],
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
            },
            itemStyle: {
                color: color[i]
            }
        });
    }

    var option = {
        xAxis: {
            type: 'category',
            data: ['涉黄','涉赌','诈骗','涉毒','涉枪','黑客','非法交易平台','非法支付平台','其他']
        },
        yAxis: {
            type: 'value',
            nameTextStyle: {
                fontSize: 4
            }
        },
        series: series_
        }
    graph_stack.setOption(option);
    }
    });
    }, [])
    
    return (
    React.createElement("div" , {className: "flex-grow place-content-center h-full" , id: graph_name })
)
}

let graph_prob_chart;
export function plot_prob_sub({ graph_name, currExample  }) {
    useEffect(() => {
        SendRequest({
            url: "/stat_prob",
            method: "POST",
            data: {
                example_id: currExample,
            },
            success: (data) => {
                checkBeforeDraw(graph_prob_chart)
                var container = document.getElementById(graph_name);
                container.innerHTML = ""
                function getStyle(el, name) {
                    if (window.getComputedStyle) {
                        return window.getComputedStyle(el, null);
                    } else {
                        return el.currentStyle;
                    }
                }
                // function resizeContainer() {
                //     container.style.height = 0.35 * window.innerHeight + "px";
                //     container.style.width = 0.2 * window.innerWidth + "px";
                // }

                // $(window).on('resize', function () {
                //     resizeContainer();
                //     graph_prob_chart.resize();
                // });
                // resizeContainer();
                //console.log(window.innerWidth)
                //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
                graph_prob_chart = echarts.init(container);
                var xDataArr = data[0]
                var yDataArr = data[1]
                var option = {
                    
                    xAxis: {
                        type: 'category',
                        data: xDataArr,
                        nameTextStyle: {
                            fontSize: 4
                        },
                        axisLabel: {
                            color: '#1e1e1e',
                            interval: 0,
                            formatter: function (value) {
                                var ret = "";//拼接加\n返回的类目项  
                                var maxLength = 2;//每项显示文字个数  
                                var valLength = value.length;//X轴类目项的文字个数  
                                var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
                                if (rowN > 1)//如果类目项的文字大于3,  
                                {
                                    for (var i = 0; i < rowN; i++) {
                                        var temp = "";//每次截取的字符串  
                                        var start = i * maxLength;//开始截取的位置  
                                        var end = start + maxLength;//结束截取的位置  
                                        //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
                                        temp = value.substring(start, end) + "\n";
                                        ret += temp; //凭借最终的字符串  
                                    }
                                    return ret;
                                }
                                else {
                                    return value;
                                }
                            }
                        },
                    },
                    yAxis: {
                        type: 'value',
                        nameTextStyle: {
                            fontSize: 4
                        }
                    },
                    series: [
                        {
                            type: 'bar',
                            data: yDataArr,
                            showBackground: true,
                            backgroundStyle: {
                                color: 'rgba(180, 180, 180, 0.2)'
                            },
                            itemStyle: {
                                color: color[currExample-1]
                            }
                        }
                    ]
                }
                graph_prob_chart.setOption(option);
            }
        });
    }, [currExample])

    return (
        React.createElement("div" , {className: "flex-grow place-content-center h-full" , id: graph_name })
    )

}


let graph_cloud;
export function plot_cloud({graph_name, currExample}) {
    
    useEffect(() => {
        SendRequest({
            url: "/stat_cloud",
            method: "POST",
            data: {
                example_id: currExample,
            },
            success: (data) => {
    var cloud_container = document.getElementById(graph_name);
    // stack_container.innerHTML = ""

    // $(window).on('resize', function () {
    //     resizeContainer(stack_container);
    //     graph_stack.resize();
    // });
    // resizeContainer(stack_container);
    graph_cloud = echarts.init(cloud_container);

    var option = {
        series: [{
            type: 'wordCloud',
            sizeRange: [15, 80],
            rotationRange: [0, 0],
            rotationStep: 45,
            gridSize: 8,
            shape: 'circle',
            width: '100%',
            height: '100%',
             textStyle: {
                    color: function () {
                        return 'rgb(' + [
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160)
                        ].join(',') + ')';
                    },
                    fontFamily: 'sans-serif',
                    fontWeight: 'normal'
                ,
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            data: data
        }]
    };

    graph_cloud.setOption(option);
    }
    });
    }, [])
    
    return (
    React.createElement("div" , {className: "flex-grow place-content-center h-full" , id: graph_name })
)
}