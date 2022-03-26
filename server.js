// const { error } = require("console");
const { response } = require("express");
var express = require("express");
// const res = require("express/lib/response");
var fs = require("fs");

var app = express();

app.use(express.json());

function writeFile(filePath,data){
    fs.writeFile(filePath,data,function(error){
        if(error){
            return "error occured";
        }
        else{
            return;
        }
    })
}

app.get("/",function(request , response){
    fs.readFile("./todo/index.html","utf-8",function(error , data){
        response.end(data);
    })
})

app.get("/style.css",function(request,response){
    fs.readFile("./todo/style.css","utf-8",function(error,data){
        response.end(data);
    })
})

app.get("/script.js",function(request,response){
    fs.readFile("./todo/script.js","utf-8",function(error,data){
        response.end(data);
    })
})

app.post("/saveTodo",function(request,response){
    // console.log(request.method);
    // console.log(request.url);
    fs.readFile("./data.txt","utf-8",function(error,data){
        var todoArray = [];
        
        if(data.length>0){
            todoArray = JSON.parse(data);
        }
        
        todoArray.push(request.body);
        
        var storable = JSON.stringify(todoArray);
        var res = writeFile("./data.txt",storable);
        response.end(res);
    })
})

app.get("/getTodo",function(request,response){
    fs.readFile("./data.txt","utf-8",function(error,data){
        if(error){
            response.end("error");
        }
        else{
            response.end(JSON.stringify(data));
        }
    })

})

app.delete("/deleteTodo",function(request,response){
    
    fs.readFile("./data.txt","utf-8",function(error,data){
        
        var idObj = request.body;
        //console.log(idObj.id);
        var todoArray = JSON.parse(data);
        
        var idx;
        for(var i=0;i<todoArray.length;i++){
            if(todoArray[i].id==idObj.id){
                idx = i;
                break;
            }
        }

        todoArray.splice(idx,1);
        console.log(todoArray);

        var storable = JSON.stringify(todoArray);
        var res = writeFile("./data.txt",storable);
        response.end(res);
    })
})

app.post("/read",function(request,response){
    var idObj = request.body;

    fs.readFile("./data.txt","utf-8",function(error,data){
       var todoArray = JSON.parse(data);
       
       for(var i=0;i,todoArray.length;i++){
           if(todoArray[i].id==idObj.id){
               todoArray[i].read = !(todoArray[i].read);
               break;
           }
       }

       var storable = JSON.stringify(todoArray);
       var res = writeFile("./data.txt",storable);
        response.end(res);
    })
    //console.log(todoArray.length);
})

app.listen(5500, function(){
    console.log(`server started at 5500`);
});