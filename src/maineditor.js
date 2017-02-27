const React=require("react");
const E=React.createElement;
const PT=React.PropTypes;
const CodeMirror=require("ksana-codemirror").Component;
const sourcetext=require("./sourcetext");
const utils=require("./utils");
class TranslationEditor extends React.Component {
	constructor(props){
		super(props);
		this.state={sourceMarks:[]};
	}
	setCM(cm){
		if (cm) this.cm=cm.getCodeMirror();
	}
	componentDidMount(){
		sourcetext.setSourceText(this.props.text);
		sourcetext.markAllSourceText(this.cm);
	}

	onBeforeChange(cm,chobj){
		var cancel=true;
		const f=chobj.from,t=chobj.to;
		if (f.line==t.line) {
			const translated=sourcetext.getTranslated(cm,cm.getCursor());
			if (f.ch==t.ch) {
				if (translated) {
					if (f.ch>translated.find().from.ch)cancel=false;
				} else if (chobj.origin=="restore") {
					const from=chobj.from;
					setTimeout(()=>{
						cm.setCursor(from);
					},10)
					cancel=false;
				}
			} else {
				if (!translated) {
					if (chobj.origin=="+input") {
						const next={line:f.line,ch:f.ch+chobj.text[0].length}

						sourcetext.addSourceTextMark(cm,f,t);
						setTimeout(()=>{
							cm.markText(f,next,{className:"translated",inclusiveRight:true});
						},10);							
						cancel=false;						
					}
				} else {
					if (chobj.origin=="+delete") {
						const m=translated.find();
						if (utils.sameposition(m,chobj)) {
							translated.clear();
							const sourcetext=sourcetext.getSourceWordMarker(cm,f);
							const at=sourcetext.find();
							const text=sourcetext.widgetNode.children[0].innerHTML;
							setTimeout(()=>{
								cm.replaceRange(text,at,at,"restore");
								sourcetext.clear();
							},10);
						}
						cancel=false;
					}
				}
			}
		}
		if(cancel)chobj.cancel();
	}
	render(){
		return E("div",{},
	  	E(CodeMirror,{ref:this.setCM.bind(this)
	  	,value:this.props.text
	  	,theme:this.props.theme
  	  ,onCursorActivity:this.props.onCursorActivity
  	  ,onBeforeChange:this.onBeforeChange.bind(this)
  	  ,onFocus:this.props.onFocus
  	  ,onBlur:this.props.onBlur
  	  ,extraKeys:this.props.extraKeys
  	  ,onViewportChange:this.props.onViewportChange})
  	 )
	}
}
module.exports=TranslationEditor;