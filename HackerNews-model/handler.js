// 业务模块

// 封装了不同请求对应的处理方法

var fs=require('fs');
var path=require('path');
var querystring=require('querystring');

module.exports={
	index:function(req,res){
		// 在 index 页面中渲染数据
		// 获取data.json中的数据
		readDataJson(function(list){
			res.render(path.join(__dirname,"views","index.html"),{"pagetitle":"news list","list":list});
		});
	},
	details:function(req,res){
		// 获取data.json中的数据
		readDataJson(function(list){

			var model;
			for(var i=0;i<list.length;i++){
				if(list[i].id===parseInt(req.query.id)){
					model=list[i];
					break;
				}
			}
			console.log(model);
			if(model){
				res.render(path.join(__dirname,"views","details.html"),{"list":model});
			}else{
				res.end("No Such Item.")
			}
		});
	},
	submit:function(req,res){
		res.render(path.join(__dirname,"views","submit.html"));
	},
	addGet:function(req,res){
		// 表示 get 方式提交数据
		// 1. 获取用户提交过来的数据
		// req.url
		// urlObj.query 通过 url 模块解析后，就可以获取 用户 get 提交过来的数据

		// 获取data.json数据，将其转换成list数组
		// fs.readFile(path.join(__dirname,"data","data.json"),'utf8',function(err,data){
		// 	if(err&&!err.code==="ENOENT"){
		// 		throw err;
		// 	}

		// 	// 将获取的字符串转换成数组
		// 	var list = JSON.parse(data||'[]');

		readDataJson(function(list){

			// 在 push 数据到 list 前，为每条新闻添加一个 id
      		// 做了一个假的自增
			// 将urlObj.query加入list数组中
			req.query.id=list.length;

			list.push(req.query);

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
	},
	addPost:function(req,res){
		// 表示 post 方式提交数据
		// 获取用户提交过来的数据

		// fs.readFile(path.join(__dirname,"data","data.json"),'utf-8',function(err,data){
		// 	if(err&&!err==="ENOENT"){
		// 		throw err;
		// 	}
		// 	var list=JSON.parse(data||'[]');

		readDataJson(function(list){
			// var arr=[];//空数组接收post数据

			// // 获取post方式的数据，需要监听request对象的data和end事件
			// req.on("data",function(chunk){
			// 	// 该事件中获取请求的数据是一片一片的提交过来的
			// 	// chunk是一个二进制对象
			// 	arr.push(chunk);
			// });
			// req.on("end",function(){
   //  			// 当该事件被触发的时候，表示用户数据都接收完毕了
   //  			// 把arr数组中的每一个buffer对象拼接起来，最终要生成Buffer对象
   //  			var buffer = Buffer.concat(arr);

			// 把Buffer对象转换为字符串，title=biaoti&url=lujing&text=hahahaha
			var reqBody=req.body.toString('utf-8');

			// querystring，通过该模块可以把一个查询字符串转化成json对象
			reqBody=querystring.parse(reqBody);

			// 为每条新闻添加一个 id
			reqBody.id=list.length;

			// 将新数据加入数据文本中
			list.push(reqBody);

			fs.writeFile(path.join(__dirname,"data","data.json"),JSON.stringify(list),'utf-8',function(err){
				if(err){
					throw err;
				}else{
					console.log("写入成功！");

					// 执行重定向操作：通过服务器向浏览器响应一个http报文头来实现
					// 设置响应状态码
					res.statusCode=302;
					res.statusMessage="Found";
					res.setHeader("Location","/");
					res.end();
				}
			});
		})
	},
	errors:function(req,res){
		res.statusCode=404;
		res.statusMessage="Not Found";
		res.render(path.join(__dirname,"views","404.html"));
	},
	statics:function(req,res){
		// 如果请求是以 /resources 开头的，表示请求的是静态资源
    	// 如果是静态资源就直接读取 resources 目录下的资源直接返回
		res.render(path.join(__dirname,req.url));
	}
};


// 封装读取 data.json 文件的代码

function readDataJson(callback){
	fs.readFile(path.join(__dirname,"data","data.json"),"utf-8",function(err,data){
		if(err&&!err==="ENOENT"){
			throw err;
		}
		var list=JSON.parse(data||'[]');
		callback(list);
	})
}