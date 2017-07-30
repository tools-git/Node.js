// 封装一个为 req 和 res 扩展功能的模块

var url=require("url");
var fs=require("fs");
var mime=require("mime");
var _=require("underscore");

module.exports=function(req,res){
	// 为req对象添加属性

	// 获取用户请求路径
	var reqUrl=req.url.toLowerCase();

	// 参数2为true，表示urlObj.query属性被解析成一个json对象
	// 如果是false，那么urlObj.query依然是一个字符串
	var urlObj=url.parse(reqUrl,true);
	req.query=urlObj.query;
	req.pathname=urlObj.pathname;

	// 调用 reqBody 为 req.body 属性设置 post 提交的数据
	reqBody(req);

	res.render=function(filename,tepData){
		fs.readFile(filename,function(err,data){
			if(err){
				throw err;
			}
			// 判断是否需要替换模板
			if(tepData){	
				var compiled=_.template(data.toString());
				data=compiled(tepData);
			}
			// 设置正确的mime类型
			res.setHeader('Content-Type',mime.lookup(filename));
			res.end(data);
		})
	}
}

function reqBody(req){
	var arr=[];
	req.on('data',function(chunk){
		arr.push(chunk);
	});

	req.on('end',function(){
		var buffer=Buffer.concat(arr);
		req.body=buffer;
	})
}