"use strict"

// 加载模块
var http=require('http');
var fs=require('fs');
var path=require('path');
var url=require('url');
var mime=require('mime');

// 创建服务，并监听request事件
var server=http.createServer(function(req,res){

	render(res);

	// 获取用户请求路径
	var reqUrl=req.url.toLowerCase();

	// 参数2为true，表示urlObj.query属性被解析成一个json对象
	// 如果是false，那么urlObj.query依然是一个字符串
	var urlObj=url.parse(reqUrl,true);

	// 让reqUrl中保存的值变成urlObj.pathname
	reqUrl=urlObj.pathname;

	// 把 /favicon.ico 的请求替换成一张图片的请求
	reqUrl=(reqUrl==="/favicon.ico")?"/resources/images/y18.gif":reqUrl;

	// 设置响应头
	res.setHeader("Content-Type","text/html;charset=utf-8")

	if(reqUrl === "/" || reqUrl ==="/index"){

		res.render(path.join(__dirname,"views","index.html"));
	}else if(reqUrl==="/details"){

		res.render(path.join(__dirname,"views","details.html"));
	}else if(reqUrl==="/submit"){

		res.render(path.join(__dirname,"views","submit.html"));
	}else if(reqUrl==="/add"&&req.method.toLowerCase()==="get"){

		// 表示 get 方式提交数据
		// 1. 获取用户提交过来的数据
		// req.url
		// urlObj.query 通过 url 模块解析后，就可以获取 用户 get 提交过来的数据

		// 获取data.json数据，将其转换成list数组
		fs.readFile(path.join(__dirname,"data","data.json"),'utf8',function(err,data){
			if(err&&!err.code==="ENOENT"){
				throw err;
			}

			// 将获取的字符串转换成数组
			var list = JSON.parse(data||'[]');

			// 将urlObj.query加入list数组中
			list.push(urlObj.query);

			// 将数组写入data.json文件中
			fs.writeFile(path.join(__dirname,"data","data.json"),JSON.stringify(list),function(err){
				if(err){
					throw err;
				}
				console.log("文件写入成功！");

				// 执行重定向操作：通过服务器向浏览器响应一个http报文头来实现
				// 设置响应状态码
				res.statusCode= 302;
				res.statusMessage="Found";
				// 设置响应头
				res.setHeader('Location', '/');
				// 请求结束
				res.end();
			})
		});

	}else if(reqUrl==="/add"&&req.method.toLowerCase()==="post"){

	}else if(reqUrl.startsWith("/resources")){

		// 如果请求是以 /resources 开头的，表示请求的是静态资源
    	// 如果是静态资源就直接读取 resources 目录下的资源直接返回
		res.render(path.join(__dirname,reqUrl));
	}else{
		res.statusCode=404;
		res.statusMessage="Not Found";
		res.render(path.join(__dirname,"views","404.html"))
	}
});


server.listen(8080,function(){
	console.log("http://localhost:8080");
});


// 封装一个渲染方法挂载在res下
function render(res){
	res.render=function(filename){
		fs.readFile(filename,function(err,data){
			if(err){
				throw err;
			}
			// 设置正确的mime类型
			res.setHeader('Content-Type',mime.lookup(filename));
			res.end(data);
		})
	}
}