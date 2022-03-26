//const { request } = require("express");

//const { json } = require("express/lib/response");

var inputText = document.getElementById("inputText");
var todoContainer = document.getElementById("todoContainer");

onLoad();

function addTodoToContainer(todo){
    var todoNode = createTodoNode(todo);
    todoContainer.appendChild(todoNode);
}

function createTodoNode(todo){

    var todoDiv = document.createElement("div");
    var id = document.createElement("p");
    var todoText = document.createElement("h4");
    var readBtn = document.createElement("input");
    var deleteBtn = document.createElement("button");

    todoDiv.setAttribute("id","todoDiv");
    id.style.display = "none";
    readBtn.setAttribute("type","checkbox");
    deleteBtn.innerText = "Delete";

    id.innerText = todo.id;
    todoText.innerText = todo.text;

    if(todo.read){
        readBtn.checked = true;
        todoText.style["text-decoration"] = "line-through";
    }

    todoDiv.appendChild(id);
    todoDiv.appendChild(todoText);
    todoDiv.appendChild(readBtn);
    todoDiv.appendChild(deleteBtn);

    readBtn.addEventListener("click",onReadBtnClicked());
    deleteBtn.addEventListener("click",onDeleteBtnClicked());

    return todoDiv;
}

function onReadBtnClicked(){
    
    return function(event){
        //console.log("checkbox clicked");
        if(event.target.checked){
            var todo = event.target.parentNode;
            var todoText = todo.children[1];
            todoText.style["text-decoration"] = "line-through";
        }
        else{
            var todo = event.target.parentNode;
            var todoText = todo.children[1];
            todoText.style["text-decoration"] = "none";
        }
        saveReadInfoOnServer(event.target.parentNode.children[0].innerText);
    }
}

function onDeleteBtnClicked(){
    return function(event){
        var parent = event.target.parentNode;
        var grandParent = parent.parentNode;
        deleteTodofromServer(parent.children[0].innerText);
        grandParent.removeChild(parent);
        
    }
}

function onLoad(){
    var request = new XMLHttpRequest();
    request.open("GET","/getTodo");
    request.setRequestHeader("Context-type","application/json");
    request.send();

    request.addEventListener("load",function(){
        var todoArray = (JSON.parse(request.responseText));
        //console.log(todoArray);
        todoArray = JSON.parse(todoArray);
        //console.log(todoArray);
        if(todoArray.length){
            todoArray.forEach(function(todo){
                addTodoToContainer(todo);
            })
        }
    })
}

function saveTodoOnServer(todo){
    var request = new XMLHttpRequest();
    request.open("POST","/saveTodo");
    request.setRequestHeader("Content-type","application/json");
    request.send(JSON.stringify(todo));
}

function deleteTodofromServer(id){
    var request = new XMLHttpRequest();
    request.open("DELETE","/deleteTodo");
    request.setRequestHeader("Content-type","application/json");
    var idObj = {
        "id" : id
    }
    request.send(JSON.stringify(idObj));
}

function saveReadInfoOnServer(id){
    var idObj = {
        "id" : id
    };

    var request = new XMLHttpRequest();
    request.open("POST","/read");
    request.setRequestHeader("Content-type","application/json");
    request.send(JSON.stringify(idObj));
}

inputText.addEventListener("keydown",function(event){
    var keyCode = event.code;

    if(keyCode=="Enter"){
        if(inputText.value==""){
            inputText.value = "";
            alert("input cannot be empty");
        }
        else{
            var inputData = inputText.value;
            inputText.value = "";

            var todo = {
                "id" : Date.now(),
                "text" : inputData,
                "read" : 0
            };

            var getTodoNode = addTodoToContainer(todo);
            saveTodoOnServer(todo);
        }
    }
})