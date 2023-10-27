$(function(){
	$(".Logo , .LogoTitle").click(function() {//セレクタorでどっちかにマッチ
		location.href="/";
	}); 

	$(".stretch-btn").click(function() {
		console.log(".stretch-btn");
		$(".Left").css("width","10px") ;
	}); 
	
});
