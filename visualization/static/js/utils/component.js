const { useState, useEffect, useLayoutEffect, useMemo } = React;
const { useSpring, animated, config } = ReactSpring;

export function TabsButton({
    tabsButtonName = "Default",
    defaultIndex = 0,
    buttons = [
        { label: "default", onClick: () => { console.log("Not Implemented error! Tabs Button Clicked!") } },
    ],
}) {
    if (tabsButtonName === "Default") {
        return ("Error! Please specif tabs button name")
    }

    let [current, setCurrent] = useState(defaultIndex);
    return (
        React.createElement("div",
            { className: "container w-full" },
            React.createElement("div",
                { className: "tabs" },
                buttons.map(({ label, onClick }, index) => {
                    return [

                        React.createElement("input",
                            {
                                type: "radio", key: label, id: tabsButtonName + "radio-" + (index + 1), name: "tabs",
                                onChange: () => {
                                    if (index !== current) {
                                        onClick();
                                        setCurrent(index)
                                    }
                                }
                            },
                        ),
                        React.createElement("label",
                            { className: "tab", for: tabsButtonName + "radio-" + (index + 1) },
                            label
                        )
                    ]
                }
                ),
                React.createElement("span",
                    {
                        className: "glider",
                        style: {
                            width: 100 / buttons.length + "%",
                            transform: "translateX(" + current * 100 + "%)",
                            transition: "transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)",
                        }
                    }
                )
            )
        )
    )
}

export function Icon({ path = 'options', className = 'w-4 h-4' }) {
    return /*#__PURE__*/(
        React.createElement("img", {
            src: `static/img/${path}.svg`,
            alt: "",
            className: className
        }));

}

export function IconButton({
    onClick = () => { },
    icon = 'options',
    className = 'w-4 h-4' }) {
    return /*#__PURE__*/(
        React.createElement("button", { onClick: onClick, type: "button", className: className }, /*#__PURE__*/
            React.createElement("img", {
                src: `static/img/${icon}.svg`,
                alt: "",
                className: "w-full h-full"
            })));



}

export function Image({ path = '1', className = 'w-4 h-4' }) {
    return /*#__PURE__*/(
        React.createElement("img", {
            src: `static/img/${path}.jpg`,
            alt: "",
            className: className
        }));


}

export function LoadingIcon() {
    return (React.createElement("div", { className: "absolute w-full h-full z-10 opacity-70 flex flex-row items-center", style: { backgroundColor: "rgba(200, 200, 200, 0.8)"}},
        React.createElement("div", { className: "flex-grow" }),
        React.createElement("div", { className: "load-3" },
            React.createElement("div", { className: "load-line m-2" }),
            React.createElement("div", { className: "load-line m-2" }),
            React.createElement("div", { className: "load-line m-2" }),
        ),
        React.createElement("div", { className: "flex-grow" }),
    ))
}