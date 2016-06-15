$(function(){
	var canvasS=600;
	var row =15;
	var block=canvasS/row;
	console.dir($('#canvas'))
	 var ctx = $('#canvas').get(0).getContext('2d');
		$('#canvas').get(0).height=canvasS;
	 $('#canvas').get(0).width=canvasS;
	 var r=function(e){
			return (Math.PI/180)*e;
			}
	 var jiange=block/2+0.5;
	 var lineWidth=canvasS-block;
	 var starReads=3;
	 //画棋盘
	 var draw=function(){
	 	ctx.save();
	 	ctx.beginPath();
	 	ctx.translate(jiange,jiange);
	 	for(var i=0;i<row;i++){
	 	ctx.moveTo(0,0);
	 	ctx.lineTo(lineWidth,0);
	 	ctx.translate(0,block);

	 	}
	 	ctx.stroke();
	 	ctx.closePath();
	 	ctx.restore();

	 	ctx.save();
	 	ctx.beginPath();
	 	ctx.translate(jiange,jiange);
	 	for(var i=0;i<row;i++){
	 	ctx.moveTo(0,0);
	 	ctx.lineTo(0,lineWidth);
	 	ctx.translate(block,0);
	 	}
	 	ctx.stroke();
	 	ctx.closePath();
	 	ctx.restore();
	 	 //画点点
	 	var pas=[3.5*block+0.5,11.5*block+0.5]
	 	for(var i=0;i<2;i++){
	 		for(var j=0;j<2;j++){
	 		var	x=pas[i];
	 		var	y=pas[j];
	 	ctx.save();
	 	ctx.translate(x,y);
	 	ctx.beginPath();	
	 	ctx.arc(0,0,starReads,0,(Math.PI/180)*360);
	 	ctx.fill();
	 	ctx.closePath();
	 	ctx.restore();
	 		}
	 	}
	 	ctx.save();
	 	ctx.translate(7.5*block+0.5,7.5*block+0.5);
	 	ctx.beginPath();	
	 	ctx.arc(0,0,starReads,0,(Math.PI/180)*360);
	 	ctx.fill();
	 	ctx.closePath();
	 	ctx.restore();


	 }
	
	 draw();
	 //落棋
	 var kaiguan=true;
	 var qizi={};
	 var rr=15;
	 var jilu={};
	 var drop=function(qizi,rr){
	 	ctx.save();
	 	ctx.translate((qizi.x+0.5)*block,(qizi.y+0.5)*block);
	 	ctx.beginPath();
	 	if(kaiguan){
	 		ctx.fillStyle="block";	
	 		kaiguan=false;	
	 	}else{
	 		ctx.fillStyle="#fff";	
		kaiguan=true;
	 	}
	 	ctx.arc(0,0,15,0,r(360));
	 	ctx.fill();
	 	ctx.closePath();
	 	ctx.restore();

	 }
	//判断属性
	var shujua={};
	var hang,shu,xieleft,xieright;
	var dep=1;
	var panduan=function(qizi){
		 hang=1;shu=1;xieleft=1;xieright=1;
		$.each(jilu,function(k,v){
			if(v.color===qizi.color){// '1-1':{x:1,y:1,color:1,dep:1}
				shujua[k]=v;
			}
		})
		//行向判断
		var tx=qizi.x;
		var ty=qizi.y;
		while(shujua[(tx+1)+'-'+ty]){
			hang++;tx++;
		}
		tx=qizi.x;
	    ty=qizi.y;
	    while(shujua[(tx-1)+'-'+ty]){
			hang++;tx--;
		}
		//竖向判断
		 var tx,ty;
        tx = qizi.x;
        ty = qizi.y;
		while(shujua[tx+'-'+(ty-1)]){
	
			shu++;ty--;
		}
		tx=qizi.x;
	    ty=qizi.y;
	    while(shujua[tx+'-'+(ty+1)]){
	    	shu++;ty++;
	    }

	    //左斜
	    while(shujua[(tx-1)+'-'+(ty-1)]){
	    	xieleft++;tx--;ty--;
	    }
	    tx=qizi.x;
	    ty=qizi.y;
	    while(shujua[(tx+1)+'-'+(ty+1)]){
           xieleft++;tx++;ty++;
	    }

	    //右斜
	    while(shujua[(tx-1)+'-'+(ty+1)]){
          xieright++;tx--;ty++;
	    }
	      tx=qizi.x;
	    ty=qizi.y;
	    while(shujua[(tx+1)+'-'+(ty-1)]){
          xieright++;tx++;ty--;
	    }

	}
	//点击事件
	$('#canvas').on('click',function(e){	
		var x=Math.floor(e.offsetX/block);
		var y=Math.floor(e.offsetY/block);
		if(jilu[x+'-'+y]){
			return;
		}
		if(kaiguan){
			$('#block_b').get(0).play();
		  qizi={x:x,y:y,color:'1',dep:dep++};
		}else{
			$('#block_w').get(0).play();
			qizi={x:x,y:y,color:'0',dep:dep++}
		}
		console.log(qizi)
		drop(qizi,rr);
		jilu[x+'-'+y]=qizi;
		panduan(qizi);
		if(hang==5||shu==5||xieleft==5||xieright==5){
			//生成棋谱
			  for(i in jilu){
			ctx.save();
             	ctx.beginPath();
             	ctx.font='20px consolas';
             	ctx.textAlign="center";
             	ctx.textBaseline="middle";
             	if(jilu[i].color==='1'){
             		ctx.fillStyle="white";
             	}
         	ctx.fillText(jilu[i].dep,jilu[i].x*block+20.5,jilu[i].y*block+20.5)
         	ctx.fill();
             	ctx.closePath();
             	ctx.restore();
			}
		if(qizi.color=='1'){
			$('.tips').css('left','1000px');
			$('.neirong').css('left','1150px');
			$('.tips').text('黑棋赢')
		}else{
			$('.tips').css('left','1000px');
			$('.neirong').css('left','1150px');
			$('.tips').text('白棋赢')
		}
		$('.neirong').on('click',function(){
			$('.tips').css('left','-1000px');
			$('.neirong').css('left','-1150px');
			  jilu = {};
			ctx.clearRect(0,0,canvasS,canvasS);
            ctx.clearRect(0,0,canvasS,canvasS);
        draw();
		})
	}
	

	})
	/* $('#save').on('click',function(){
     	$(this).text('保存成功');
     	var image = $('#canvas').get(0).toDataURL('image/png',1);
     	$(this).attr('href',image);
     	$(this).attr('dowload','qipu.png');
     })*/
})