const {autorun,extendObservable,observable} =require("mobx");

const store= observable({
	status:"status"
})
window.store=store;
/*
autorun(()=>{
	console.log(store.todos[0]);
})
*/
module.exports=store;
