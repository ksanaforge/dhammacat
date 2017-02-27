const {action}=require("mobx")
const sourcetext=require("./sourcetext");
const printlinech=function(linech,name){
	return name+" "+linech.line+":"+linech.ch+"\n";
}
const printrange=function(range,name){
	return name+"From "+range.from.line+":"+range.from.ch+
	" To "+range.to.line+":"+range.to.ch+"\n";	
}
const printStatus=action(function(cm,store){
	const cursor=cm.getCursor();
	var out=printlinech(cursor,"Cursor");

	const sourcetextmarker=sourcetext.getSourceTextMarker(cm,cursor);
	if (sourcetextmarker) {
		const p=sourcetextmarker.find();
		out+=printrange(p,"SourceText:");
		out+=("source pos "+sourcetextmarker.start+"\n");
	}
	const translated=sourcetext.getTranslated(cm,cursor);
	if (translated) {
		const p=translated.find();
		out+=printrange(p,"Translated:");
		out+="source pos "+translated.sourcepos+" "+translated.source;
	}

	store.status=out;
});
module.exports=printStatus;