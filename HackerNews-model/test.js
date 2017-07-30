"use strict"

var http=require("http");
var url=require("url");
var fs=require("fs");
var _=require("underscore")

var server=http.createServer(function(req,res){
	var reqUrl=req.url.toLowerCase();
	res.setHeader("Content-Type","text/html");

	var dataJson=[{"name":"你"},{"name":"别"},{"name":"生"},{"name":"气"},{"name":"了"}];
	var tpldata={title:"你别生气了",list:dataJson};

	if(reqUrl==="/"||reqUrl==="test.html"){
		fs.readFile("test.html","utf-8",function(err,data){
			var compiled = _.template(data.toString());
			data=compiled(tpldata);
			res.end(data);
		});
	}else{
		res.end("404,未找到");
	}
});

server.listen(9090,function(){
	console.log("http://localhost:9090");
})