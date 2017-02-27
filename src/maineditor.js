const React=require("react");
const E=React.createElement;
const PT=React.PropTypes;
const CodeMirror=require("ksana-codemirror").Component;
const sourcetext=require("./sourcetext");
const utils=require("./utils");
const printStatus=require("./status");
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
	onCursorActivity(cm){
		printStatus(cm,store)
	}
	onBeforeChange(cm,chobj){
		var cancel=true;
		const f=chobj.from,t=chobj.to;
		if (f.line==t.line) {
			const translated=sourcetext.getTranslated(cm,cm.getCursor());
			if (f.ch==t.ch) {
				if (translated) {
					if (f.ch>translated.find().from.ch&&f.ch<=translated.find().to.ch) {
						cancel=false;
					}
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
						const sw=sourcetext.getSourceWord(cm,f,t);
						const sp=sourcetext.getSourceTextPos(cm,f)
						
						sourcetext.breakSourceText(cm,f,t);
						setTimeout(()=>{
							sourcetext.markTranslated(cm,f,next,sw,sp);
						},10);							
						cancel=false;						
					}
				} else {
					if (chobj.origin=="+delete") {
						const m=translated.find();
						if (utils.sameposition(m,chobj)) {
							const source=translated.source;
							const sourcepos=translated.sourcepos;
							translated.clear();
							const at={line:m.from.line,ch:m.from.ch};
							
							
							const lefttranslated=sourcetext.getTranslated(cm,chobj.from);
							const tempt=sourcetext.saveTranslated(lefttranslated);
							
							setTimeout(()=>{
								cm.replaceRange(source,at,at,"restore");
								sourcetext.markSource(cm,at ,{line:at.line,ch:at.ch+source.length},sourcepos);
								sourcetext.mergeSourceMarker(cm,at.line);
								sourcetext.restoreTranslated(cm,tempt);
							},10);
							cancel=false;
						}
						if (m.from.ch<=chobj.from.ch) {
							cancel=false
						}
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
  	  ,onCursorActivity:this.onCursorActivity.bind(this)
  	  ,onBeforeChange:this.onBeforeChange.bind(this)
  	  ,onFocus:this.props.onFocus
  	  ,onBlur:this.props.onBlur
  	  ,extraKeys:this.props.extraKeys
  	  ,onViewportChange:this.props.onViewportChange})
  	 )
	}
}
module.exports=TranslationEditor;