const { useState, useEffect, useLayoutEffect, useMemo } = React;
const { useSpring, animated, config } = ReactSpring;


import { Icon, IconButton } from "./utils/component.js";
import { Page1 } from "./Pages/Page1.js";
import { Page2 } from "./Pages/Page2.js";
import { Page3 } from "./Pages/Page3.js";
import { Page4 } from "./Pages/Page4.js";
import { SendRequest } from "./utils/network.js";

const App = () => {
    const [showSidebar, onSetShowSidebar] = useState(false);
    let [currExample, setCurrExample] = useState(1); // 1-base
    return /*#__PURE__*/(
        React.createElement("div", { className: "root flex" }, /*#__PURE__*/
            (showSidebar) && React.createElement(Sidebar, {
                onSidebarHide: () => {
                    onSetShowSidebar(false);
                },
                showSidebar: showSidebar,
                currExample
            }), /*#__PURE__*/


            React.createElement(Content, {
                onSidebarHide: () => {
                    onSetShowSidebar(true);
                },
                showSidebar: showSidebar,
                currExample: currExample,
                setCurrExample: setCurrExample
            })

        ));
};

function Sidebar({ onSidebarHide, showSidebar, currExample }) {
    const sidebarItems = [

        { id: '0', title: '主页', notifications: false },
        { id: '1', title: '黑产打击模拟', notifications: false },
        { id: '2', title: '实时子图搜索', notifications: false },
        { id: '3', title: '全局风险监测', notifications: false },
    ];

    const [selected, setSelected] = useState('0');
    const { dashOffset, indicatorWidth, precentage } = useSpring({
        dashOffset: 26.015,
        indicatorWidth: 70,
        precentage: 77,
        from: { dashOffset: 113.113, indicatorWidth: 0, precentage: 0 },
        config: config.molasses
    });

    return /*#__PURE__*/(
        React.createElement("div", {
            className:
                'sidebar-card w-35 flex-shrink-0 inset-y-0 left-0  flex flex-col z-10'
        }, /*#__PURE__*/
            React.createElement("div", { className: "flex flex-shrink-0 h-full ", style: { width: "14rem" } }),
            React.createElement("div", { className: "flex-grow fixed w-35 h-screen p-2 flex flex-col" },

                // Icon and Team Name
                React.createElement("div", { className: "flex-grow-0 flex items-center p-2 sidebar-separator-top" }, /*#__PURE__*/
                    React.createElement(IconButton, {
                        icon: "res-react-dash-sidebar-open",
                        className: "flex-shrink-0 h-12",
                        onClick: () => {
                            window.location.href = "#header"
                        }
                    }), /*#__PURE__*/

                    React.createElement(IconButton, {
                        icon: "res-react-dash-sidebar-close",
                        className: "flex-shrink-0 w-5 h-5 m-2",
                        onClick: onSidebarHide
                    })
                ),

                // Sidebar Items
                React.createElement("div", { className: "flex-grow-0 overflow-x-hidden overflow-y-auto flex flex-col" }, /*#__PURE__*/


                    sidebarItems.map((i) => /*#__PURE__*/
                        React.createElement(MenuItem, {
                            key: i.id,
                            item: i,
                            onClick: setSelected,
                            selected: selected
                        })), /*#__PURE__*/




                ), /*#__PURE__*/

                // React.createElement("div", { className: "flex-grow" }), /*#__PURE__*/
                // React.createElement("div", { className: "flex-grow-0 p-3 h-32 w-66" },
                //     React.createElement("div", {
                //         className: "rounded-xl h-full px-3 overflow-hidden example-card",
                //     },
                //         // React.createElement("div", { className: "flex flex-row items-center h-full" },
                //         //     React.createElement("div", { className: "font-bold text-grey-100 text-2xl border-b-4 border-green-400" }, "当前选择案例: "),
                //         //     React.createElement("div", { className: "flex-grow text-center font-bold text-white text-4xl" }, currExample),
                //         // )
                //     )
                // )
            )
        )
    );





}
function MenuItem({ item: { id, title, notifications }, onClick, selected }) {
    return /*#__PURE__*/(
        React.createElement("div", {
            className:
                'flex flex-row w-full mt-8  items-center px-3  justify-start  sm:mt-6 xl:mt-3 cursor-pointer '
                + ((selected === id) ? 'sidebar-item-selected' : 'sidebar-item'),
            onClick: () => {
                onClick(id);
                window.location.href = "#Page" + id;
            },
        }, /*#__PURE__*/
            // React.createElement(SidebarIcons, { id: id }), /*#__PURE__*/
            React.createElement("div", { className: "block ml-2" }, title), /*#__PURE__*/
            React.createElement("div", { className: "block flex-grow" }),
            notifications && /*#__PURE__*/
            React.createElement("div", { className: "flex  bg-pink-600  w-5 h-5 flex items-center justify-center rounded-full mr-2" }, /*#__PURE__*/
                React.createElement("div", { className: "text-white text-base" }, notifications))));
}



function Content({ onSidebarHide, showSidebar, currExample, setCurrExample }) {
    const [currGraphData, setCurrGraphData] = useState({ nodes: [], edges: [] })
    const [currKeyLinks, setCurrKeyLinks] = useState({ nodes: [], edges: [] })
    useEffect(() => {

        // get graph data
        SendRequest({
            url: "/example",
            method: "POST",
            data: {
                example_id: currExample,
            },
            success: (res) => {
                setCurrGraphData(res)
            }
        });

        // get core nodes
        SendRequest({
            url: "/key_link",
            method: "POST",
            data: {
                example_id: currExample
            },
            success: (res) => {
                setCurrKeyLinks(res)
            }
        })
    }, [currExample])
    return /*#__PURE__*/(
        React.createElement("div", { className: "flex-grow flex flex-row w-full" }, /*#__PURE__*/

            // button for showing sidebar 
            (!showSidebar) && React.createElement("div", { className: "flex-grow-0 w-20 bg-sidebar-card-top" },
                React.createElement("div", { className: "w-16" }),
                React.createElement(IconButton, {
                    icon: "res-react-dash-sidebar-open",
                    className: "w-16 h-16 mr-1 fixed",
                    onClick: onSidebarHide
                }),
            ),

            React.createElement("div", { className: "flex flex-col w-full" },
                React.createElement(Header, null),
                React.createElement(Page1, { PageId: 0, currExample, setCurrExample, currGraphData, currKeyLinks }),
                // React.createElement(Page2, { PageId: 1, currGraphData, currExample, currKeyLinks}),
                // React.createElement(Page3, { PageId: 2 }),
                // React.createElement(Page4, { PageId: 3 }),
            )
        )
    )
}

function Header({ }) {
    return (
        React.createElement("section", { id: 'header', className: "w-full flex p-3 items-end title-card" }, /*#__PURE__*/

            // Title
            React.createElement("div", { className: "flex-grow flex justify-between" }, /*#__PURE__*/
                React.createElement("div", { className: "" }, /*#__PURE__*/
                    React.createElement("div", { className: "flex items-center" }, /*#__PURE__*/
                        React.createElement("div", { className: "text-3xl font-bold text-black " }, "黑灰产网络资产图谱"), /*#__PURE__*/
                    ), /*#__PURE__*/

                    React.createElement("div", { className: "flex items-center" }, /*#__PURE__*/

                        React.createElement("div", { className: "ml-2 text-black" }, "Black Market Network Knowledge Graph"))
                ), /*#__PURE__*/
            ), /*#__PURE__*/

            // // Search
            // React.createElement("div", { className: "w-full sm:w-56 mt-4 sm:mt-0 relative border-gray-300" }, /*#__PURE__*/
            //     React.createElement(Icon, {
            //         path: "res-react-dash-search",
            //         className: "w-5 h-5 search-icon left-3 absolute"
            //     }), /*#__PURE__*/

            //         // React.createElement("input", {
            //         //     type: "text",
            //         //     id: "upper_search",
            //         //     className: "pl-12 py-2 pr-2 block w-full rounded  bg-sidebar-card-top border-gray-100",
            //         //     placeholder: "输入黑产域名",
            //         //     onKeyUp: (e) => {
            //         //         if (e.keyCode === 13) {
            //         //             // enter
            //         //             document.getElementById("search-input").value = document.getElementById("upper_search").value
            //         //             window.location.href = "#Page2"
            //         //         }
            //         //     }
            //         // })
            // )
        )
    );
}

function SidebarIcons({ id }) {
    const icons = {
        0: /*#__PURE__*/
            /*#__PURE__*/
            React.createElement("svg", {
                viewBox: "0 0 20 20",
                fill: "currentColor",
                id: "cube-transparent",
                class: "w-8 h-8 text-cool-gray-800 dark:text-cool-gray-200 group-hover:text-purple-600 group-focus:text-purple-600 dark:group-hover:text-purple-50 dark:group-focus:text-purple-50"
            }, /*#__PURE__*/React.createElement("path", {
                "fill-rule": "evenodd",
                d: "M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z",
                "clip-rule": "evenodd"
            })),



        1: /*#__PURE__*/
            /*#__PURE__*/
            React.createElement("path", {
                "fill-rule": "evenodd",
                d: "M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z",
                "clip-rule": "evenodd"
            }),



        2: /*#__PURE__*/
            /*#__PURE__*/
            React.createElement("svg", {
                viewBox: "0 0 20 20",
                fill: "currentColor",
                id: "search-circle",
                class: "w-8 h-8 text-cool-gray-800 dark:text-cool-gray-200 group-hover:text-purple-600 group-focus:text-purple-600 dark:group-hover:text-purple-50 dark:group-focus:text-purple-50"
            }, /*#__PURE__*/React.createElement("path", {
                d: "M9 9a2 2 0 114 0 2 2 0 01-4 0z"
            }), /*#__PURE__*/React.createElement("path", {
                "fill-rule": "evenodd",
                d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z",
                "clip-rule": "evenodd"
            })),


        3: /*#__PURE__*/
            /*#__PURE__*/
            React.createElement("svg", {
                viewBox: "0 0 20 20",
                fill: "currentColor",
                id: "globe",
                class: "w-8 h-8 text-cool-gray-800 dark:text-cool-gray-200 group-hover:text-purple-600 group-focus:text-purple-600 dark:group-hover:text-purple-50 dark:group-focus:text-purple-50"
            }, /*#__PURE__*/React.createElement("path", {
                "fill-rule": "evenodd",
                d: "M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z",
                "clip-rule": "evenodd"
            })),


        4: /*#__PURE__*/
            React.createElement(React.Fragment, null, /*#__PURE__*/
                React.createElement("path", { d: "M19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4H7V2H9V4H15V2H17V4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22ZM5 10V20H19V10H5ZM5 6V8H19V6H5ZM17 14H7V12H17V14Z" })),


        5: /*#__PURE__*/
            React.createElement(React.Fragment, null, /*#__PURE__*/
                React.createElement("path", { d: "M21.266 20.998H2.73301C2.37575 20.998 2.04563 20.8074 1.867 20.498C1.68837 20.1886 1.68838 19.8074 1.86701 19.498L11.133 3.49799C11.3118 3.1891 11.6416 2.9989 11.9985 2.9989C12.3554 2.9989 12.6852 3.1891 12.864 3.49799L22.13 19.498C22.3085 19.8072 22.3086 20.1882 22.1303 20.4975C21.9519 20.8069 21.6221 20.9976 21.265 20.998H21.266ZM12 5.99799L4.46901 18.998H19.533L12 5.99799ZM12.995 14.999H10.995V9.99799H12.995V14.999Z" }), /*#__PURE__*/
                React.createElement("path", { d: "M11 16H13V18H11V16Z" })),


        6: /*#__PURE__*/
            React.createElement(React.Fragment, null, /*#__PURE__*/
                React.createElement("path", { d: "M13.82 22H10.18C9.71016 22 9.3036 21.673 9.20304 21.214L8.79604 19.33C8.25309 19.0921 7.73827 18.7946 7.26104 18.443L5.42404 19.028C4.97604 19.1709 4.48903 18.9823 4.25404 18.575L2.43004 15.424C2.19763 15.0165 2.2777 14.5025 2.62304 14.185L4.04804 12.885C3.98324 12.2961 3.98324 11.7019 4.04804 11.113L2.62304 9.816C2.27719 9.49837 2.19709 8.98372 2.43004 8.576L4.25004 5.423C4.48503 5.0157 4.97204 4.82714 5.42004 4.97L7.25704 5.555C7.5011 5.37416 7.75517 5.20722 8.01804 5.055C8.27038 4.91269 8.53008 4.78385 8.79604 4.669L9.20404 2.787C9.30411 2.32797 9.71023 2.00049 10.18 2H13.82C14.2899 2.00049 14.696 2.32797 14.796 2.787L15.208 4.67C15.4888 4.79352 15.7623 4.93308 16.027 5.088C16.274 5.23081 16.5127 5.38739 16.742 5.557L18.58 4.972C19.0277 4.82967 19.5142 5.01816 19.749 5.425L21.569 8.578C21.8015 8.98548 21.7214 9.49951 21.376 9.817L19.951 11.117C20.0158 11.7059 20.0158 12.3001 19.951 12.889L21.376 14.189C21.7214 14.5065 21.8015 15.0205 21.569 15.428L19.749 18.581C19.5142 18.9878 19.0277 19.1763 18.58 19.034L16.742 18.449C16.5095 18.6203 16.2678 18.7789 16.018 18.924C15.7559 19.0759 15.4854 19.2131 15.208 19.335L14.796 21.214C14.6956 21.6726 14.2895 21.9996 13.82 22ZM7.62004 16.229L8.44004 16.829C8.62489 16.9652 8.81755 17.0904 9.01704 17.204C9.20474 17.3127 9.39801 17.4115 9.59604 17.5L10.529 17.909L10.986 20H13.016L13.473 17.908L14.406 17.499C14.8133 17.3194 15.1999 17.0961 15.559 16.833L16.38 16.233L18.421 16.883L19.436 15.125L17.853 13.682L17.965 12.67C18.0142 12.2274 18.0142 11.7806 17.965 11.338L17.853 10.326L19.437 8.88L18.421 7.121L16.38 7.771L15.559 7.171C15.1998 6.90671 14.8133 6.68175 14.406 6.5L13.473 6.091L13.016 4H10.986L10.527 6.092L9.59604 6.5C9.39785 6.58704 9.20456 6.68486 9.01704 6.793C8.81878 6.90633 8.62713 7.03086 8.44304 7.166L7.62204 7.766L5.58204 7.116L4.56504 8.88L6.14804 10.321L6.03604 11.334C5.98684 11.7766 5.98684 12.2234 6.03604 12.666L6.14804 13.678L4.56504 15.121L5.58004 16.879L7.62004 16.229ZM11.996 16C9.7869 16 7.99604 14.2091 7.99604 12C7.99604 9.79086 9.7869 8 11.996 8C14.2052 8 15.996 9.79086 15.996 12C15.9933 14.208 14.204 15.9972 11.996 16ZM11.996 10C10.9034 10.0011 10.0139 10.8788 9.99827 11.9713C9.98262 13.0638 10.8466 13.9667 11.9387 13.9991C13.0309 14.0315 13.9469 13.1815 13.996 12.09V12.49V12C13.996 10.8954 13.1006 10 11.996 10Z" }))
    };



    return /*#__PURE__*/(
        React.createElement("svg", {
            className: "w-8 h-8",
            viewBox: "0 0 24 24",
            fill: "currentColor",
            xmlns: "http://www.w3.org/2000/svg"
        },

            icons[id]));


}



ReactDOM.render( /*#__PURE__*/React.createElement(App, null),
    document.getElementById("root"));