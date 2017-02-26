const {autorun,extendObservable,observable} =require("mobx");

const store= observable({
			todos : ["buy mild","buy eggs"],
			get total(){
				return this.todos.length;
			}
})
window.store=store;
autorun(()=>{
	console.log(store.todos[0]);
})
module.exports=store;
