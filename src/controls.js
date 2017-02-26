const React=require("react");
const E=React.createElement;
const styles={
	container:{background:"black",height:"100%"}
}
class Controls extends React.Component{
	render(){
		return E("div",{style:styles.container},"controls")
  }
};
module.exports=Controls