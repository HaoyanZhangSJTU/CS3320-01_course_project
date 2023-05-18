
const { useSpring, animated, config } = ReactSpring;
const { LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer } = Recharts;

import { Icon, IconButton, Image, TabsButton } from "./component.js";

const map = (value, sMin, sMax, dMin, dMax) => {
    return dMin + (value - sMin) / (sMax - sMin) * (dMax - dMin);
};
const pi = Math.PI;
const tau = 2 * pi;



const Countrydata = [
    { name: 'USA', rise: true, value: 21942.83, id: 1 },
    { name: 'Ireland', rise: false, value: 19710.0, id: 2 },
    { name: 'Ukraine', rise: false, value: 12320.3, id: 3 },
    { name: 'Sweden', rise: true, value: 9725.0, id: 4 }];

const segmentationData = [
    { c1: 'Not Specified', c2: '800', c3: '#363636', color: '#535353' },
    { c1: 'Male', c2: '441', c3: '#818bb1', color: '#595f77' },
    { c1: 'Female', c2: '233', c3: '#2c365d', color: '#232942' },
    { c1: 'Other', c2: '126', c3: '#334ed8', color: '#2c3051' }];





const graphData = [
    'Nov',
    'Dec',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July'].
    map(i => {
        const revenue = 500 + Math.random() * 2000;
        const expectedRevenue = Math.max(revenue + (Math.random() - 0.5) * 2000, 0);
        return {
            name: i,
            revenue,
            expectedRevenue,
            sales: Math.floor(Math.random() * 500)
        };

    });

export function Placeholder({ PageId }) {
    return React.createElement("div", { className: "flex p-4 h-full flex-col" }, /*#__PURE__*/
        React.createElement("div", { className: "" },
            React.createElement("div", { className: "sm:flex-grow flex justify-between" }, /*#__PURE__*/
                React.createElement("div", { className: "flex items-center" }, /*#__PURE__*/
                    React.createElement("div", { className: "text-1xl font-normal text-white" }, "假装这里是第" + (PageId + 1) + "个页面"), /*#__PURE__*/
                ), /*#__PURE__*/
            )
        )
    )
}


export function Graph() {
    const CustomTooltip = () => /*#__PURE__*/
        React.createElement("div", { className: "rounded-xl overflow-hidden tooltip-head" }, /*#__PURE__*/
            React.createElement("div", { className: "flex items-center justify-between p-2" }, /*#__PURE__*/
                React.createElement("div", { className: "" }, "Revenue"), /*#__PURE__*/
                React.createElement(Icon, { path: "res-react-dash-options", className: "w-2 h-2" })), /*#__PURE__*/

            React.createElement("div", { className: "tooltip-body text-center p-3" }, /*#__PURE__*/
                React.createElement("div", { className: "text-white font-bold" }, "$1300.50"), /*#__PURE__*/
                React.createElement("div", { className: "" }, "Revenue from 230 sales")));



    return /*#__PURE__*/(
        React.createElement("div", { className: "flex p-4 h-full flex-col" }, /*#__PURE__*/
            React.createElement("div", { className: "" }, /*#__PURE__*/
                React.createElement("div", { className: "flex items-center" }, /*#__PURE__*/
                    React.createElement("div", { className: "font-bold text-white" }, "Your Work Summary"), /*#__PURE__*/
                    React.createElement("div", { className: "flex-grow" }), /*#__PURE__*/

                    React.createElement(Icon, { path: "res-react-dash-graph-range", className: "w-4 h-4" }), /*#__PURE__*/
                    React.createElement("div", { className: "ml-2" }, "Last 9 Months"), /*#__PURE__*/
                    React.createElement("div", { className: "ml-6 w-5 h-5 flex justify-center items-center rounded-full icon-background" }, "?")), /*#__PURE__*/



                React.createElement("div", { className: "font-bold ml-5" }, "Nov - July")), /*#__PURE__*/


            React.createElement("div", { className: "flex-grow" }, /*#__PURE__*/
                React.createElement(ResponsiveContainer, { width: "100%", height: "100%" }, /*#__PURE__*/
                    React.createElement(LineChart, { width: 500, height: 300, data: graphData }, /*#__PURE__*/
                        React.createElement("defs", null, /*#__PURE__*/
                            React.createElement("linearGradient", { id: "paint0_linear", x1: "0", y1: "0", x2: "1", y2: "0" }, /*#__PURE__*/
                                React.createElement("stop", { stopColor: "#6B8DE3" }), /*#__PURE__*/
                                React.createElement("stop", { offset: "1", stopColor: "#7D1C8D" }))), /*#__PURE__*/


                        React.createElement(CartesianGrid, {
                            horizontal: false,
                            strokeWidth: "6",
                            stroke: "#252525"
                        }), /*#__PURE__*/

                        React.createElement(XAxis, {
                            dataKey: "name",
                            axisLine: false,
                            tickLine: false,
                            tickMargin: 10
                        }), /*#__PURE__*/

                        React.createElement(YAxis, { axisLine: false, tickLine: false, tickMargin: 10 }), /*#__PURE__*/
                        React.createElement(Tooltip, { content: /*#__PURE__*/React.createElement(CustomTooltip, null), cursor: false }), /*#__PURE__*/
                        React.createElement(Line, {
                            activeDot: false,
                            type: "monotone",
                            dataKey: "expectedRevenue",
                            stroke: "#242424",
                            strokeWidth: "3",
                            dot: false,
                            strokeDasharray: "8 8"
                        }), /*#__PURE__*/

                        React.createElement(Line, {
                            type: "monotone",
                            dataKey: "revenue",
                            stroke: "url(#paint0_linear)",
                            strokeWidth: "4",
                            dot: false
                        }))))));






}

export function TopCountries() {
    return /*#__PURE__*/(
        React.createElement("div", { className: "flex p-4 flex-col h-full" }, /*#__PURE__*/
            React.createElement("div", { className: "flex justify-between items-center" }, /*#__PURE__*/
                React.createElement("div", { className: "text-white font-bold" }, "Top Countries"), /*#__PURE__*/
                React.createElement(Icon, { path: "res-react-dash-plus", className: "w-5 h-5" })), /*#__PURE__*/

            React.createElement("div", { className: "" }, "favourites"),
            Countrydata.map(({ name, rise, value, id }) => /*#__PURE__*/
                React.createElement("div", { className: "flex items-center mt-3", key: id }, /*#__PURE__*/
                    React.createElement("div", { className: "" }, id), /*#__PURE__*/

                    React.createElement(Image, { path: `res-react-dash-flag-${id}`, className: "ml-2 w-6 h-6" }), /*#__PURE__*/
                    React.createElement("div", { className: "ml-2" }, name), /*#__PURE__*/
                    React.createElement("div", { className: "flex-grow" }), /*#__PURE__*/
                    React.createElement("div", { className: "" }, `$${value.toLocaleString()}`), /*#__PURE__*/
                    React.createElement(Icon, {
                        path:
                            rise ? 'res-react-dash-country-up' : 'res-react-dash-country-down',

                        className: "w-4 h-4 mx-3"
                    }), /*#__PURE__*/

                    React.createElement(Icon, { path: "res-react-dash-options", className: "w-2 h-2" }))), /*#__PURE__*/


            React.createElement("div", { className: "flex-grow" }), /*#__PURE__*/
            React.createElement("div", { className: "flex justify-center" }, /*#__PURE__*/
                React.createElement("div", { className: "" }, "Check All"))));



}

export function Segmentation() {
    return /*#__PURE__*/(
        React.createElement("div", { className: "p-4 h-full" }, /*#__PURE__*/
            React.createElement("div", { className: "flex justify-between items-center" }, /*#__PURE__*/
                React.createElement("div", { className: "text-grey-600 font-bold" }, "Segmentation"), /*#__PURE__*/

                React.createElement(Icon, { path: "res-react-dash-options", className: "w-2 h-2" })), /*#__PURE__*/

            React.createElement("div", { className: "mt-3" }, "All users"),
            segmentationData.map(({ c1, c2, c3, color }) => /*#__PURE__*/
                React.createElement("div", { className: "flex items-center", key: c1 }, /*#__PURE__*/
                    React.createElement("div", {
                        className: "w-2 h-2 rounded-full",
                        style: {
                            background: color
                        }
                    }), /*#__PURE__*/


                    React.createElement("div", { className: "ml-2", style: { color } },
                        c1), /*#__PURE__*/

                    React.createElement("div", { className: "flex-grow" }), /*#__PURE__*/
                    React.createElement("div", { className: "", style: { color } },
                        c2), /*#__PURE__*/

                    React.createElement("div", { className: "ml-2 w-12 card-stack-border" }), /*#__PURE__*/
                    React.createElement("div", { className: "ml-2 h-8" }, /*#__PURE__*/
                        React.createElement("div", {
                            className: "w-20 h-28 rounded overflow-hidden",
                            style: {
                                background: c3
                            }
                        },


                            c1 === 'Other' && /*#__PURE__*/
                            React.createElement("img", { src: "static/img/res-react-dash-user-card.svg", alt: "" }))))), /*#__PURE__*/






            React.createElement("div", { className: "flex mt-3 px-3 items-center justify-between bg-details rounded-xl w-36 h-12" }, /*#__PURE__*/
                React.createElement("div", { className: "" }, "Details"), /*#__PURE__*/
                React.createElement(Icon, { path: "res-react-dash-chevron-right", className: "w-4 h-4" }))));



}

export function Satisfication() {
    const { dashOffset } = useSpring({
        dashOffset: 78.54,
        from: { dashOffset: 785.4 },
        config: config.molasses
    });

    return /*#__PURE__*/(
        React.createElement("div", { className: "p-4 h-full" }, /*#__PURE__*/
            React.createElement("div", { className: "flex justify-between items-center" }, /*#__PURE__*/
                React.createElement("div", { className: "text-white font-bold" }, "Satisfication"), /*#__PURE__*/
                React.createElement(Icon, { path: "res-react-dash-options", className: "w-2 h-2" })), /*#__PURE__*/

            React.createElement("div", { className: "mt-3" }, "From all projects"), /*#__PURE__*/
            React.createElement("div", { className: "flex justify-center" }, /*#__PURE__*/
                React.createElement("svg", {
                    viewBox: "0 0 700 380",
                    fill: "none",
                    width: "300",
                    xmlns: "http://www.w3.org/2000/svg",
                    id: "svg"
                }, /*#__PURE__*/

                    React.createElement("path", {
                        d: "M100 350C100 283.696 126.339 220.107 173.223 173.223C220.107 126.339 283.696 100 350 100C416.304 100 479.893 126.339 526.777 173.223C573.661 220.107 600 283.696 600 350",
                        stroke: "#2d2d2d",
                        strokeWidth: "40",
                        strokeLinecap: "round"
                    }), /*#__PURE__*/

                    React.createElement(animated.path, {
                        d: "M100 350C100 283.696 126.339 220.107 173.223 173.223C220.107 126.339 283.696 100 350 100C416.304 100 479.893 126.339 526.777 173.223C573.661 220.107 600 283.696 600 350",
                        stroke: "#2f49d0",
                        strokeWidth: "40",
                        strokeLinecap: "round",
                        strokeDasharray: "785.4",
                        strokeDashoffset: dashOffset,
                        id: "svgPath",
                        className: "svgPath"
                    }), /*#__PURE__*/


                    React.createElement(animated.circle, {
                        cx: dashOffset.interpolate(
                            x => 350 + 250 * Math.cos(map(x, 785.4, 0, pi, tau))),

                        cy: dashOffset.interpolate(
                            x => 350 + 250 * Math.sin(map(x, 785.4, 0, pi, tau))),

                        r: "12",
                        fill: "#fff"
                    }), /*#__PURE__*/

                    React.createElement("circle", { cx: "140", cy: "350", r: "5", fill: "#2f49d0" }), /*#__PURE__*/
                    React.createElement("circle", {
                        cx: "144.5890038459008",
                        cy: "306.3385449282706",
                        r: "5",
                        fill: "#2f49d0"
                    }), /*#__PURE__*/

                    React.createElement("circle", {
                        cx: "158.15545389505382",
                        cy: "264.58530495408195",
                        r: "5",
                        fill: "#2f49d0"
                    }), /*#__PURE__*/

                    React.createElement("circle", {
                        cx: "180.10643118126103",
                        cy: "226.56509701858067",
                        r: "5",
                        fill: "#2f49d0"
                    }), /*#__PURE__*/

                    React.createElement("circle", {
                        cx: "209.48257266463972",
                        cy: "193.93958664974724",
                        r: "5",
                        fill: "#2f49d0"
                    }), /*#__PURE__*/

                    React.createElement("circle", {
                        cx: "244.9999999999999",
                        cy: "168.1346652052679",
                        r: "5",
                        fill: "#2f49d0"
                    }), /*#__PURE__*/

                    React.createElement("circle", {
                        cx: "285.10643118126103",
                        cy: "150.27813157801776",
                        r: "5",
                        fill: "#2f49d0"
                    }), /*#__PURE__*/

                    React.createElement("circle", {
                        cx: "328.0490227137926",
                        cy: "141.15040197266262",
                        r: "5",
                        fill: "#2f49d0"
                    }), /*#__PURE__*/

                    React.createElement("circle", {
                        cx: "371.95097728620715",
                        cy: "141.1504019726626",
                        r: "5",
                        fill: "#2f49d0"
                    }), /*#__PURE__*/

                    React.createElement("circle", {
                        cx: "414.8935688187389",
                        cy: "150.27813157801774",
                        r: "5",
                        fill: "#2f49d0"
                    }), /*#__PURE__*/

                    React.createElement("circle", {
                        cx: "454.9999999999999",
                        cy: "168.1346652052678",
                        r: "5",
                        fill: "#2f49d0"
                    }), /*#__PURE__*/

                    React.createElement("circle", {
                        cx: "490.51742733536014",
                        cy: "193.93958664974713",
                        r: "5",
                        fill: "#2f49d0"
                    }), /*#__PURE__*/

                    React.createElement("circle", {
                        cx: "519.8935688187389",
                        cy: "226.5650970185806",
                        r: "5",
                        fill: "#2f49d0"
                    }), /*#__PURE__*/

                    React.createElement("circle", {
                        cx: "541.8445461049462",
                        cy: "264.58530495408183",
                        r: "5",
                        fill: "#2f49d0"
                    }), /*#__PURE__*/

                    React.createElement("circle", {
                        cx: "555.4109961540992",
                        cy: "306.33854492827044",
                        r: "5",
                        fill: "#2f49d0"
                    }), /*#__PURE__*/

                    React.createElement("circle", { cx: "560", cy: "349.99999999999994", r: "5", fill: "#2f49d0" }), /*#__PURE__*/
                    React.createElement("path", {
                        d: "M349.292 375C395.845 375 433.583 337.261 433.583 290.708C433.583 244.155 395.845 206.417 349.292 206.417C302.739 206.417 265 244.155 265 290.708C265 337.261 302.739 375 349.292 375Z",
                        fill: "white"
                    }), /*#__PURE__*/

                    React.createElement("path", {
                        d: "M349.292 358.708C386.847 358.708 417.292 328.264 417.292 290.708C417.292 253.153 386.847 222.708 349.292 222.708C311.736 222.708 281.292 253.153 281.292 290.708C281.292 328.264 311.736 358.708 349.292 358.708Z",
                        fill: "#D2D6E7"
                    }), /*#__PURE__*/

                    React.createElement("path", {
                        d: "M347.167 343.833C376.898 343.833 401 319.731 401 290C401 260.269 376.898 236.167 347.167 236.167C317.435 236.167 293.333 260.269 293.333 290C293.333 319.731 317.435 343.833 347.167 343.833Z",
                        fill: "#FFE17D"
                    }), /*#__PURE__*/

                    React.createElement("path", {
                        d: "M347.167 316.482C339.696 316.482 332.608 313.623 328.204 308.835C327.391 307.953 327.449 306.58 328.331 305.768C329.213 304.956 330.588 305.013 331.399 305.896C334.996 309.807 340.89 312.141 347.167 312.141C353.443 312.141 359.338 309.807 362.935 305.896C363.745 305.013 365.121 304.956 366.003 305.768C366.885 306.58 366.942 307.953 366.13 308.835C361.725 313.623 354.637 316.482 347.167 316.482Z",
                        fill: "#AA7346"
                    }), /*#__PURE__*/

                    React.createElement("path", {
                        d: "M328.933 290C326.535 290 324.592 288.056 324.592 285.659V282.186C324.592 279.788 326.535 277.844 328.933 277.844C331.33 277.844 333.274 279.788 333.274 282.186V285.659C333.274 288.056 331.33 290 328.933 290Z",
                        fill: "#7D5046"
                    }), /*#__PURE__*/

                    React.createElement("path", {
                        d: "M328.933 277.844C328.635 277.844 328.345 277.875 328.064 277.932V283.922C328.064 285.361 329.231 286.527 330.669 286.527C332.108 286.527 333.274 285.361 333.274 283.922V282.186C333.274 279.788 331.331 277.844 328.933 277.844Z",
                        fill: "#9C6846"
                    }), /*#__PURE__*/

                    React.createElement("path", {
                        d: "M365.401 290C363.003 290 361.059 288.056 361.059 285.659V282.186C361.059 279.788 363.003 277.844 365.401 277.844C367.798 277.844 369.742 279.788 369.742 282.186V285.659C369.742 288.056 367.798 290 365.401 290Z",
                        fill: "#7D5046"
                    }), /*#__PURE__*/

                    React.createElement("path", {
                        d: "M365.401 277.844C365.103 277.844 364.813 277.875 364.532 277.932V283.922C364.532 285.361 365.699 286.527 367.137 286.527C368.576 286.527 369.742 285.361 369.742 283.922V282.186C369.742 279.788 367.798 277.844 365.401 277.844Z",
                        fill: "#9C6846"
                    }), /*#__PURE__*/

                    React.createElement("path", {
                        d: "M354.981 336.019C325.25 336.019 301.148 311.917 301.148 282.186C301.148 269.31 305.673 257.496 313.213 248.232C301.085 258.103 293.333 273.144 293.333 290C293.333 319.731 317.435 343.833 347.167 343.833C364.023 343.833 379.064 336.081 388.935 323.953C379.671 331.493 367.857 336.019 354.981 336.019Z",
                        fill: "#FFD164"
                    }))), /*#__PURE__*/




            React.createElement("div", { className: "flex justify-center" }, /*#__PURE__*/
                React.createElement("div", { className: "flex justify-between mt-2", style: { width: '300px' } }, /*#__PURE__*/
                    React.createElement("div", { className: "", style: { width: '50px', paddingLeft: '16px' } }, "0%"), /*#__PURE__*/


                    React.createElement("div", {
                        className: "",
                        style: {
                            width: '150px',
                            textAlign: 'center'
                        }
                    }, /*#__PURE__*/


                        React.createElement("div", {
                            className: "font-bold",
                            style: { color: '#2f49d1', fontSize: '18px' }
                        }, "97.78%"), /*#__PURE__*/



                        React.createElement("div", { className: "" }, "Based on Likes")), /*#__PURE__*/

                    React.createElement("div", { className: "", style: { width: '50px' } }, "100%")))));






}

export function AddComponent() {
    return /*#__PURE__*/(
        React.createElement("div", null, /*#__PURE__*/
            React.createElement("div", { className: "w-full h-20 add-component-head" }), /*#__PURE__*/
            React.createElement("div", {
                className: "flex flex-col items-center",
                style: {
                    transform: 'translate(0, -40px)'
                }
            }, /*#__PURE__*/


                React.createElement("div", {
                    className: "",
                    style: {
                        background: '#414455',
                        width: '80px',
                        height: '80px',
                        borderRadius: '999px'
                    }
                }, /*#__PURE__*/


                    React.createElement("img", {
                        src: "static/img//res-react-dash-rocket.svg",
                        alt: "",
                        className: "w-full h-full"
                    })), /*#__PURE__*/


                React.createElement("div", { className: "text-white font-bold mt-3" }, "No Components Created Yet"), /*#__PURE__*/


                React.createElement("div", { className: "mt-2" }, "Simply create your first component"), /*#__PURE__*/
                React.createElement("div", { className: "mt-1" }, "Just click on the button"), /*#__PURE__*/
                React.createElement("div", {
                    className: "flex items-center p-3 mt-3",
                    style: {
                        background: '#2f49d1',
                        borderRadius: '15px',
                        padding: '8px 16px',
                        justifyContent: 'center',
                        color: 'white'
                    }
                }, /*#__PURE__*/


                    React.createElement(Icon, { path: "res-react-dash-add-component", className: "w-5 h-5" }), /*#__PURE__*/
                    React.createElement("div", { className: "ml-2" }, "Add Component"), /*#__PURE__*/
                    React.createElement("div", {
                        className: "ml-2",
                        style: {
                            background: '#4964ed',
                            borderRadius: '15px',
                            padding: '4px 8px 4px 8px'
                        }
                    }, "129")))));


}