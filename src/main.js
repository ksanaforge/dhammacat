const React=require("react");
const E=React.createElement;
const DevTools=require("mobx-react-devtools").default;
const local=window.location.host.indexOf("127.0.0.1")>-1;
const MainEditor=require("./maineditor");
const Controls=require("./controls");
const {observer}=require("mobx-react");
const styles={
	container:{display:"flex"},
	left:{flex:3},
	right:{flex:1}
}

const text=require("./data").replace(/\r?\n/g,"\n");
module.exports = observer(class Main extends React.Component{
	render(){
		return E("div",{style:styles.container},
			local?E(DevTools):null,
			E("div",{style:styles.left},E(MainEditor,{theme:"ambiance",text})),
			E("div",{style:styles.right},E(Controls))
		)
	}
})

