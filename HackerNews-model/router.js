// 路由操作模块

var handler=require("./handler.js");

module.exports=function(req,res){
	var reqUrl=req.pathname;

	// 把 /favicon.ico 的请求替换成一张图片的请求
	req.url=reqUrl=(reqUrl==="/favicon.ico")?"/resources/images/y18.gif":reqUrl;

	// 设置响应头
	res.setHeader("Content-Type","text/html;charset=utf-8")

	if(reqUrl === "/" || reqUrl ==="/index"){
		handler.index(req, res);

	}else if(reqUrl==="/details"){
		handler.details(req, res);
		
	}else if(reqUrl==="/submit"){
		handler.submit(req, res);

	}else if(reqUrl==="/add"&&req.method.toLowerCase()==="get"){
		handler.addGet(req, res);
		
	}else if(reqUrl==="/add"&&req.method.toLowerCase()==="post"){
		handler.addPost(req, res);

	}else if(reqUrl.startsWith("/resources")){
		handler.statics(req, res);
		
	}else{
		handler.errors(req, res);
	}
}
