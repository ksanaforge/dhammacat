const React=require("react");
const E=React.createElement;
const styles={
	container:{background:"black",color:"white",height:"100%"},
	status:{whiteSpace:"pre"}
}
const {observer}=require("mobx-react");
module.exports=observer(class Controls extends React.Component{
	render(){
		return E("div",	{style:styles.container},
			E("br"),
			E("br"),
			E("span",{style:styles.status},this.props.store.status))

  }
});