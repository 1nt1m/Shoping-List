//STATUS 1 - shopping list | 2 - done | 3 - deleted
add.addEventListener("click",addItem);
edit.addEventListener("click",editItem);
let maxKey = 0;
let action = 0;

let btns = buttons.getElementsByTagName("button");
btns[0].onclick = () => drow();  
btns[1].onclick = () => drow(2);  
btns[2].onclick = () => drow(3);  

drow();

function changeTitle(status){
	if (status===1)	titlename.innerHTML = "Shopping List";
	if (status===2) titlename.innerHTML = "Done";
	if (status===3) titlename.innerHTML = "Deleted";
}

function drow(status){
	if (status === undefined) status = 1;
	changeTitle(status);
	tbody.innerHTML = "";
	let totalCounter = 0;
	for (let i = 0; i<localStorage.length; i++ ){
		let key = +localStorage.key(i);
		let parseItem = JSON.parse(localStorage.getItem(key));

		if (parseItem.status === status) {
			let itemArr = [parseItem.id,parseItem.name,parseItem.quant,parseItem.price];
			tbody.append(drowTr(status,itemArr));
			totalCounter += (parseItem.quant*parseItem.price);
		}
	}
	tbody.append(drowFoot(totalCounter));
}

function drowTr(status, array){

	let tr = document.createElement("tr");

	for(let i = 0; i<=3; i++){
		let td = document.createElement("td");
		td.innerHTML = array[i];
		tr.append(td);
	}

	let tdButton = document.createElement("td");
	if (status===1) {
		tdButton.append(drowButton("action_b green","doneid","+",array[0]));
		tdButton.append(drowButton("action_b yellow","editid","/",array[0]));
		tdButton.append(drowButton("action_b red","deleteid","X",array[0]));
	}
	if (status===2) {
		tdButton.append(drowButton("action_b red","deleteid","X",array[0]));
	}
	if (status===3) {
		tdButton.append(drowButton("action_b green","doneid","+",array[0]));
		tdButton.append(drowButton("action_b red","finaldeleteid","X",array[0]));
	}
	tr.append(tdButton);
	return tr;
}

function drowButton(myClass,myAtr,myHtml,myId){

	let button = document.createElement("button");
	button.className = myClass;
	button.setAttribute(myAtr,myId);
	button.innerHTML = myHtml;

	return button;
}

function drowFoot(counter){
	let tr = document.createElement("tr");
	tr.className = "foot";

	let td1 = document.createElement("td");
	td1.className = "total";
	td1.setAttribute("colspan","4");
	td1.innerHTML = "Total:";
	tr.append(td1);

	let td2 = document.createElement("td");
	td2.innerHTML = counter;
	tr.append(td2);

	return tr;
}

function clearInputs(){
	iname.value = "";
	iquant.value = "";
	iprice.value = "";
}

function createObject(idO, statusO, nameO, quatnO, priceO){
	if (nameO === undefined) nameO = iname.value;
	if (quatnO === undefined) quatnO = iquant.value;
	if (priceO === undefined) priceO = iprice.value;
	
	let item = {
		id: idO,
		name: nameO,
		quant: quatnO,
		price: priceO,
		status: statusO,
	} 
	return item;
}

function editItem(){
	let item = createObject(action,1);
	localStorage.setItem(action,JSON.stringify(item));
	edit.classList.add("hidden");
	drow();
	clearInputs();
}

function addItem(){
	getMaxKey();
	let item = createObject(maxKey,1);
	localStorage.setItem(maxKey,JSON.stringify(item));
	drow();
	clearInputs();
}

function getMaxKey(){
	for (let i = 0; i<localStorage.length; i++ ){
		let key = localStorage.key(i);
		if (key>maxKey) {
			key = parseInt(key);
			maxKey = key;
		}
	}
	maxKey++;
}

tbody.onclick = function(event){

	let target = event.target;
	if (target.tagName != "BUTTON") return;

	if (target.hasAttribute("editid")) {
		action = +target.getAttribute("editid");
		let editItem = JSON.parse(localStorage.getItem(action));

		iname.value = editItem.name;
		iquant.value = editItem.quant;
		iprice.value = editItem.price;

		edit.classList.remove("hidden");
	}
	if (target.hasAttribute("doneid")) {
		
		action = +target.getAttribute("doneid");
		let editItem = JSON.parse(localStorage.getItem(action));
		let newItem = createObject(action, 2, editItem.name, 
			editItem.quant, editItem.price);
		localStorage.setItem(action,JSON.stringify(newItem));
		drow();

	}

	if (target.hasAttribute("deleteid")) {
		action = +target.getAttribute("deleteid");
		let editItem = JSON.parse(localStorage.getItem(action));
		let newItem = createObject(action, 3, editItem.name, 
			editItem.quant, editItem.price);
		localStorage.setItem(action,JSON.stringify(newItem));
		drow();
	}
	if (target.hasAttribute("finaldeleteid")) {
		action = +target.getAttribute("finaldeleteid");
		localStorage.removeItem(action);
		drow(3);
	}
}