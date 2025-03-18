"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var button_1 = require("@/components/ui/button");
var CookiePolicy = function () {
    return (react_1.default.createElement("div", { className: "min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#e6e9f0]" },
        react_1.default.createElement("nav", { className: "p-4 flex justify-between items-center max-w-7xl mx-auto" },
            react_1.default.createElement("div", { className: "flex items-center gap-2" },
                react_1.default.createElement(react_router_dom_1.Link, { to: "/" },
                    react_1.default.createElement("img", { src: "/lovable-uploads/d8bfce19-2f0d-46f6-9fbe-924f64b656e2.png", alt: "Cozy Task Logo", className: "w-12 h-12 object-contain" })),
                react_1.default.createElement(react_router_dom_1.Link, { to: "/" },
                    react_1.default.createElement("span", { className: "text-2xl font-patrick text-primary" }, "Cozy Task"))),
            react_1.default.createElement("div", { className: "flex gap-4" },
                react_1.default.createElement(react_router_dom_1.Link, { to: "/" },
                    react_1.default.createElement(button_1.Button, { variant: "ghost" }, "Home")))),
        react_1.default.createElement("div", { className: "max-w-4xl mx-auto px-4 py-12" },
            react_1.default.createElement("h1", { className: "text-3xl font-bold mb-8" }, "Cookie Policy"),
            react_1.default.createElement("div", { className: "space-y-6" },
                react_1.default.createElement("section", null,
                    react_1.default.createElement("h2", { className: "text-xl font-semibold mb-3" }, "1. What Are Cookies"),
                    react_1.default.createElement("p", { className: "text-gray-700" }, "Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the service or a third-party to recognize you and make your next visit easier and more useful to you.")),
                react_1.default.createElement("section", null,
                    react_1.default.createElement("h2", { className: "text-xl font-semibold mb-3" }, "2. How We Use Cookies"),
                    react_1.default.createElement("p", { className: "text-gray-700" }, "When you use and access Cozy Task, we may place a number of cookie files in your web browser. We use cookies for the following purposes:"),
                    react_1.default.createElement("ul", { className: "list-disc pl-6 mt-2 text-gray-700" },
                        react_1.default.createElement("li", null, "To enable certain functions of the application"),
                        react_1.default.createElement("li", null, "To provide analytics"),
                        react_1.default.createElement("li", null, "To store your preferences"),
                        react_1.default.createElement("li", null, "To enable advertisements delivery, including behavioral advertising")),
                    react_1.default.createElement("p", { className: "text-gray-700 mt-2" }, "We use both session and persistent cookies on the application and we use different types of cookies to run the application:"),
                    react_1.default.createElement("ul", { className: "list-disc pl-6 mt-2 text-gray-700" },
                        react_1.default.createElement("li", null, "Essential cookies: These cookies are required for the operation of our application"),
                        react_1.default.createElement("li", null, "Analytical/performance cookies: These allow us to recognize and count the number of visitors and to see how visitors move around our application"),
                        react_1.default.createElement("li", null, "Functionality cookies: These are used to recognize you when you return to our application"),
                        react_1.default.createElement("li", null, "Targeting cookies: These cookies record your visit to our application, the pages you have visited and the links you have followed"))),
                react_1.default.createElement("section", null,
                    react_1.default.createElement("h2", { className: "text-xl font-semibold mb-3" }, "3. Third-Party Cookies"),
                    react_1.default.createElement("p", { className: "text-gray-700" }, "In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the application, deliver advertisements on and through the application, and so on.")),
                react_1.default.createElement("section", null,
                    react_1.default.createElement("h2", { className: "text-xl font-semibold mb-3" }, "4. Managing Cookies"),
                    react_1.default.createElement("p", { className: "text-gray-700" }, "Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary from browser to browser, and from version to version."))))));
};
exports.default = CookiePolicy;
