var _sourceText="";
const	markAllSourceText=function(cm){
		var start=0;
		for (var i=0;i<_sourceText.length;i++) {
			if (_sourceText[i]=="\n"){
				markSource(cm,start,i);
				start=i;
			}
		}
		markSource(cm,start,_sourceText.length-1);
}
const	markSource=function(cm,start,end){
	const s=cm.posFromIndex(start);
	const e=cm.posFromIndex(end);
	cm.markText(s,e,{className:"source"});
}
const getSourceTextMarker=function(cm,at,type){
		const marks=cm.findMarksAt(at).filter(m=>m.className=="source");
		if (marks.length) return marks[0];
}
const getSourceWordMarker=function(cm,at){
		const marks=cm.findMarksAt(at).filter(
			m=>m.widgetNode&&m.widgetNode.children[0].className=="sourceword");
		if (marks.length) return marks[0];
}
const	getTranslated=function(cm,at){
		const marks=cm.findMarksAt(at).filter(m=>m.className=="translated");
		if (marks.length) return marks[0];
}
const getTextPos=function(cm,linech){
		return cm.indexFromPos(linech);
}

const getSourceWord=function(cm,from,to){
	return _sourceText.substring(from,to);
}
//start-end of source text
//from to of 
const	addSourceTextMark=function(cm,start,end){
		const from=getTextPos(cm,start),to=getTextPos(cm,end);
		const t=getSourceWord(cm,from,to);
		const widget=document.createElement("span");
		breakSourceText(cm,start,end);
		widget.innerHTML=t;
		widget.className="sourceword";
		cm.setBookmark(start,{widget,handleMouseEvents:true});
}

const breakSourceText=function(cm,start,end){
		const marker=getSourceTextMarker(cm,start);
		const m=marker.find();
		
		cm.markText(m.from,start,{className:"source"});
		cm.markText(end,m.to,{className:"source"});
		marker.clear();
}
const setSourceText=function(s){
	_sourceText=s;
}
module.exports={markSource,markAllSourceText,setSourceText,
getSourceWordMarker,getSourceTextMarker,getTranslated,breakSourceText,addSourceTextMark}