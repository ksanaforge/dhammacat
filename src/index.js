const store=require("./store");
const React=require("react");
const ReactDOM=require("react-dom");
const E=React.createElement;
const {useStrict}=require("mobx");
const Main=require("./main");

//useStrict(true)
ReactDOM.render(E(Main,{store}),document.getElementById("root"));