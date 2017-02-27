var _sourceText="";
const	markAllSourceText=function(cm){
		var start=0;
		for (var i=0;i<_sourceText.length;i++) {
			if (_sourceText[i]=="\n"){
				markSource(cm,start,i,start);
				start=i+1;
			}
		}
		markSource(cm,start,_sourceText.length-1,start);
}
const	markSource=function(cm,start,end, sourcestart){
	var s=start,e=end;
	if (typeof start=="number") {
		s=cm.posFromIndex(start);
		e=cm.posFromIndex(end);
	}
	return cm.markText(s,e,{className:"source",start:sourcestart});
}
const getSourceTextMarker=function(cm,at){
	const marks=cm.findMarksAt(at).filter(m=>m.className=="source");
	if (marks.length==1) return marks[0];
	//else if (marks.length>1) throw "more than one source text marker"
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
const getSourceTextPos=function(cm,linech){
	const m=getSourceTextMarker(cm,linech);
	const mpos=m.find();
	const dist=linech.ch-mpos.from.ch;
	return m.start + dist;
}

const getSourceWord=function(cm,from,to){
	const dist=to.ch-from.ch;
	if (typeof from!=="number") {
		from=getSourceTextPos(cm,from)
		to=from+dist;
	}
	return _sourceText.substring(from,to);
}
//start-end of source text
//from to of 

const	addSourceWordMark=function(cm,start,end){
	//const from=getSourceTextPos(cm,start),to=getSourceTextPos(cm,end);
	const t=getSourceWord(cm,from,to);
	
/*
	const widget=document.createElement("span");

	widget.innerHTML=t;
	widget.className="sourceword";
	widget.dataset.start=from;
	cm.setBookmark(start,{widget,handleMouseEvents:true});
*/	
}

const breakSourceText=function(cm,start,end){
	const marker=getSourceTextMarker(cm,start);
	const m=marker.find();
	
	if (start.ch>m.from.ch) markSource(cm,m.from,start,marker.start);
	if (m.to.ch>end.ch) markSource(cm,end,m.to,marker.start+end.ch-m.from.ch);

	marker.clear();
}
const setSourceText=function(s){
	_sourceText=s;
}
const mergeSourceMarker=function(cm,line){
	const l=cm.getLine(line);
	const allmarks=cm.findMarks({line,ch:0},{line,ch:l.length}).filter(m=>m.className=="source");
	if (allmarks.length<2)return;
	//marks are return in creation order, sort by position
	const ranges=[];
	for (var i=0;i<allmarks.length;i++) {
		const p=allmarks[i].find();
		ranges.push([p.from.ch,allmarks[i]]);
	}
	ranges.sort((a,b)=>a[0]-b[0]);
	const marks=ranges.map(item=>item[1]);

	var m=marks[0];
	var prev=m.find();
	for (var i=1;i<marks.length;i++) {
		const now=marks[i].find();
		if (prev.to.ch==now.from.ch) { //merge
			textstart=m.start;
			m.clear();
			marks[i].clear();
			m=markSource(cm,prev.from,now.to, textstart);
			prev=m.find();
		} else {
			m=marks[i];
			prev=m.find();
		}
	}
}
markTranslated=function(cm,s,e, source,sourcepos){
	return cm.markText(s,e,{className:"translated",inclusiveRight:true,source,sourcepos});
}
const saveTranslated=function(t){
	if (!t) return null
	const pos=t.find();
	const json= {
		from:JSON.parse(JSON.stringify(pos.from)),
		to:JSON.parse(JSON.stringify(pos.to)),
		source:t.source,
		sourcepos:t.sourcepos
	}
	t.clear();
	return json;
}
const restoreTranslated=function(cm,json){
	if (!json)return null;
	markTranslated(cm,json.from,json.to,json.source,json.sourcepos);
}
module.exports={markSource,markTranslated,markAllSourceText,setSourceText,
mergeSourceMarker,getSourceWord,getSourceTextPos,
restoreTranslated,saveTranslated,
getSourceWordMarker,getSourceTextMarker,getTranslated,breakSourceText,addSourceWordMark}