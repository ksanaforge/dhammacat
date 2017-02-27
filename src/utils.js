const sameposition=function(p1,p2){
	return p1.from.line==p2.from.line && p1.from.ch==p2.from.ch && p1.to.line==p2.from.line && p1.to.ch==p2.to.ch
}
module.exports={sameposition};