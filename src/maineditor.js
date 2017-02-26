const React=require("react");
const E=React.createElement;
const PT=React.PropTypes;
const CodeMirror=require("ksana-codemirror").Component;

class TranslationEditor extends React.Component {
	setCM(cm){
		if (cm) this.cm=cm.getCodeMirror();
	}

	getSourceTextMarker(cm,at){
		const marks=cm.findMarksAt(at).filter(
			m=>m.widgetNode&&m.widgetNode.children[0].className=="sourcetext");
		if (marks.length) return marks[0];
	}
	getTranslated(cm,at){
		const marks=cm.findMarksAt(at).filter(m=>m.className=="translated");

		if (marks.length) return marks[0];
	}
	getSourceText(from,to){
		return this.props.text.substring(from,to);
	}
	addSourceTextMark(cm,pos,from,to){
		const t=this.getSourceText(from,to);
		const widget=document.createElement("span");
		widget.innerHTML=t;
		widget.className="sourcetext";
		cm.setBookmark(pos,{widget,handleMouseEvents:true});
	}
	getTextPos(cm,linech){
		return cm.indexFromPos(linech);
	}
	sameposition(p1,p2){
		return p1.from.line==p2.from.line && p1.from.ch==p2.from.ch && p1.to.line==p2.from.line && p1.to.ch==p2.to.ch
	}
	onBeforeChange(cm,chobj){
		var cancel=true;
		const f=chobj.from,t=chobj.to;
		if (f.line==t.line) {
			const translated=this.getTranslated(cm,cm.getCursor());
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
						const start=this.getTextPos(cm,f),end=this.getTextPos(cm,t);

						this.addSourceTextMark(cm,f,start,end);
						setTimeout(()=>{
							cm.markText(f,next,{className:"translated",inclusiveRight:true});
						},10);							
						cancel=false;						
					}
				} else {
					if (chobj.origin=="+delete") {
						const m=translated.find();
						if (this.sameposition(m,chobj)) {
							translated.clear();
							const sourcetext=this.getSourceTextMarker(cm,f);
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