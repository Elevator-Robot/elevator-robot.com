"use strict";
exports.id = 691;
exports.ids = [691];
exports.modules = {

/***/ 7200:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7021);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3240);
/* provided dependency */ var fetch = __webpack_require__(1515);


const containerStyles = "flex flex-col items-center justify-center h-screen p-16 bg-blue-200";
const chatContainerStyles = "bg-white rounded-lg p-7 w-full max-w-xl overflow-y-auto mb-8 shadow-lg";
const messageContainerStyles = "flex justify-start";
const messageStyles = "bg-blue-500 text-white p-4 rounded-lg mb-4 self-start transition-transform duration-300 transform hover:scale-105";
const botMessageStyles = "bg-gray-200 text-black p-4 rounded-lg mb-4 self-start";
const formStyles = "flex flex-col w-full max-w-xl";
const inputStyles = "rounded-lg p-4 mb-4";
const sendButtonStyles = "rounded-lg px-4 py-2 bg-blue-500 text-white font-bold transition-transform duration-200 transform";
const sendButtonPressedStyles = "transform scale-95";
const IndexPage = () => {
  const {
    0: messages,
    1: setMessages
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const {
    0: chatInput,
    1: setChatInput
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const chatContainer = document.getElementById("chatContainer");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);
  async function handleChatInputSubmit(event) {
    event.preventDefault();
    if (chatInput) {
      const userMessage = {
        message: chatInput,
        user: "user"
      };
      setMessages(oldMessages => [...oldMessages, userMessage]);
      setChatInput(""); // Clear the input field immediately after sending the message

      const response = await fetch('https://dcwzi4igl1.execute-api.us-east-1.amazonaws.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userMessage)
      });
      const data = await response.json();
      if (data.message) {
        setMessages(oldMessages => [...oldMessages, {
          message: data.message,
          user: "assistant"
        }]);
      }
    }
  }
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_1__/* .jsx */ .tZ)("main", {
    className: containerStyles
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_1__/* .jsx */ .tZ)("div", {
    className: `border border-gray-300 p-2 rounded-lg mb-4 ${chatContainerStyles}`,
    id: "chatContainer"
  }, messages.map((messageObj, index) => (0,_emotion_react__WEBPACK_IMPORTED_MODULE_1__/* .jsx */ .tZ)("div", {
    key: index,
    className: messageObj.user === "user" ? `${messageContainerStyles} ${messageStyles}` : botMessageStyles
  }, messageObj.message))), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_1__/* .jsx */ .tZ)("form", {
    onSubmit: handleChatInputSubmit,
    className: formStyles
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_1__/* .jsx */ .tZ)("input", {
    type: "text",
    value: chatInput,
    onChange: e => setChatInput(e.target.value),
    className: inputStyles
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_1__/* .jsx */ .tZ)("button", {
    type: "submit",
    className: sendButtonStyles,
    onClick: () => console.log("Button pressed") // Replace with your logic
  }, "Enter")));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (IndexPage);

/***/ })

};
;
//# sourceMappingURL=component---src-pages-index-tsx.js.map