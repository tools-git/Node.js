"use strict"

// 加载模块
var http=require('http');
var context=require('./context.js');
var router=require('./router.js');

var fs=require('fs');
var path=require('path');
var url=require('url');
var mime=require('mime');
var querystring=require("querystring");
var _=require("underscore");

// 创建服务，并监听request事件
var server=http.createServer(function(req,res){
	// 为req和res对象扩展属性
	context(req,res);

	// 渲染页面
	router(req,res);
});


server.listen(8080,function(){
	console.log("http://localhost:8080");
});

// 封装获取 post 数据的代码

function getPostData(req,callback){
	var arr=[];//空数组接收post数据

		// 获取post方式的数据，需要监听request对象的data和end事件
		req.on("data",function(chunk){
			// 该事件中获取请求的数据是一片一片的提交过来的
			// chunk是一个二进制对象
			arr.push(chunk);
		});

		req.on("end",function(){
			// 当该事件被触发的时候，表示用户数据都接收完毕了
			// 把arr数组中的每一个buffer对象拼接起来，最终要生成Buffer对象
			var buffer = Buffer.concat(arr);

			callback(buffer);
		});
}

