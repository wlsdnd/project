function media_layer_open(id, top, left, src, track){

	var temp = $("#media_layer_contents_"+id);

	if (temp.find("iframe").length) {
		// exist iframe element
		temp.find("iframe").contents().find('#mediasrc').prop("src", src);
		temp.find("iframe").contents().find('#track').prop("src", track);
		temp.find("iframe").contents().find('#video')[0].volume = 0.7;
		temp.find("iframe").contents().find('#video')[0].load();
		temp.find("iframe").contents().find('#video')[0].play();

		$("#media_layer_"+id).fadeIn();

		var y = parseInt(top, 10);
		
		var pos = $("#media_layer_"+id).attr('name');	// 위인지 아래인지 확인
		var r = parseInt(pos.substring(0, 1));			// 배수 확인
		if (pos.indexOf('d') >= 0) {
			// down
			y += $('#'+id).outerHeight();
			y += ((r-1)*temp.find("iframe").outerHeight());
		} else {
			// up
			y -= (r*temp.find("iframe").outerHeight());
		}

		if (y <= 30) {	// y(top) 값이 너무 작거나 크면 화면을 벗어날 수 있으므로
			y = 30;
		} else if (y + temp.find("iframe").outerHeight() >= viewportSize.height - 30) {
			y = viewportSize.height - 30 - temp.find("iframe").outerHeight();
		}

		$("#media_layer_"+id).css('top', y + 'px');	// top 값 설정
		
		var x = parseInt(left);
		// x(left) 값 또한 화면을 벗어나지 않도록
		if (x + temp.find("iframe").outerWidth() >= viewportSize.width - 30)
		{
			$("#media_layer_"+id).css('left', (viewportSize.width - temp.find("iframe").outerWidth() - 30) + 'px');
		} else {
			$("#media_layer_"+id).css('left', x + 'px');
		}
		// iframe 내부의 미디어 플레이어 위치
		if (temp.find("iframe").outerWidth() < $(document).width()) temp.css('margin-left', '-'+temp.find("iframe").outerWidth()/2+'px');
		else temp.css('left', '0px');

		$("#media_layer_"+id).width((temp.find("iframe").outerWidth()+30));	// 너비 지정
		$("#media_layer_"+id).height(74);	// 높이 강제 지정
		temp.css('top', '0px');
		temp.css('left', (temp.find("iframe").outerWidth()/2+25)+'px');
	} else {
		// not exist, create, 동적 생성
		var iFrame = document.createElement('iframe');
		iFrame.name = "sound";
		iFrame.id = "mediapop";
		switch (parseInt(temp.data("type"))) {		// type에 맞추어 미디어 플레이어 생성
			case 1:
				iFrame.src = "pp_overlay/media/media1.html";	// 투명
				break;
			case 2:
				iFrame.src = "pp_overlay/media/media2.html";	// 기본
				break;
			case 3:
				iFrame.src = "pp_overlay/media/media3.html";	// 자막보기 추가
				break;
		}
		temp[0].appendChild(iFrame);	// 미디어 플레이어 추가 및 로딩 완료시 열기. type 1 의 경우 이동 아이콘 숨김 처리.
		iFrame.onload = function () {if(parseInt(temp.data("type"))===1)hideMoveIcon(id);media_layer_open(id,top,left,src,track);};
	}
}

function image_layer_open(id){	// 이미지 레이어 표시
	if (id.indexOf("img") < 0)	// id 에 img가 없는 경우 추가
	{
		id = id + "_img";
	}

	if ($('#image_layer_contents_'+id).length > 0)	// 현재 화면에 image layer가 존재하는 경우
	{
		if ($('#image_layer_'+id).css('display') !== 'none')
		{
			$('#image_layer_'+id).css('display', 'none');
			return;
		}
		$('#image_layer_'+id).fadeIn();				// display 상태 변경
	} else {										// 존재하지 않는 경우
		var g = window.parent;						// 최상위 뷰어 객체
		var gfs = $(g.document).find("iframe");		// 현재 loading 된 페이지들, 이하 동일

		if (gfs.contents().find('#image_layer_'+id).length <= 0)	// 이미지 레이어가 없는 경우
		{
			console.log("do not have image layer");
			return;
		}

		if (gfs.contents().find('#image_layer_'+id).css('display') !== 'none')
		{
			gfs.contents().find('#image_layer_'+id).css('display', 'none');
			return;
		}

		gfs.contents().find('#image_layer_'+id).fadeIn();	// 있으면 display 상태 변경
	}
}

function stop_sound_all() {		// 현재 모든 sound player를 찾아서 pause 시키는 function
	var g = window.parent;
	var gfs = $(g.document).find("iframe");

	var allSoundArr = new Array();	// sound player array

	for (var i=0; i<gfs.length; i++)
	{
		var soundArr = $(gfs[i].contentWindow.document).find("iframe");
		for (var j=0; j<soundArr.length; j++)
		{
			allSoundArr.push(soundArr[j]);	// 모두 찾아서 push
		}
	}

	//var soundIframes = document.getElementsByName("sound");
	for (var i=0; i<allSoundArr.length; i++)
	{
		allSoundArr[i].contentWindow.pause();	// puase
	}
}

function stop_sound_this() {	// 현재 페이지에 있는 sound player만 puase
	var soundIframes = document.getElementsByName("sound");
	for (var i=0; i<soundIframes.length; i++)
	{
		soundIframes[i].contentWindow.pause();
	}
}

function stop_sound(idx) {		// 현재 페이지에 있는 sound player 중 index 값에 해당하는 것만 puase
	var soundIframes = document.getElementsByName("sound");
	soundIframes[idx].contentWindow.pause();
}

window.onload = function () {		// 로딩 완료시 0.5sec 단위로 interval 실행
	setInterval(intervalFunc, 500);
}

var viewportSize = new Object();	// viewport 크기 데이터
var cntCheck = 0;					// 중복 체크용

$( document ).ready(function() {
	if (cntCheck++) return;	// 기존 버전의 overlay.js의 import 때문에 중복 실행이 되는 현상 발생하여 count 확인
	// meta tag 내 viewport 크기 계산
	var metaData = $("meta[name='viewport']").attr('content');
	viewportSize.width = parseInt(metaData.substring(metaData.indexOf('width=')+6), metaData.indexOf(','));
	viewportSize.height = parseInt(metaData.substring(metaData.indexOf('height=')+7, metaData.length));

	$(document.getElementsByName("sound")).each(function (idx) {	// 미디어 재생 iframe 동적 생성을 위한 코드
		var $this = $(this), $parent = $this.parent();				// 구버전과의 호환성 때문에 만듦
		if (!$parent.data("type")) {	// old version
			if ($this.attr("src").indexOf("media1")>=0) {
				$parent.data("type", 1);
			} else if ($this.attr("src").indexOf("media2")>=0) {
				$parent.data("type", 2);
			} else if ($this.attr("src").indexOf("media3")>=0) {
				$parent.data("type", 3);
			} else {
				// 누구냐 넌
			}
		}
	});

    $(".video").off('click').on('click', function (e) {	// 기존의 click event off 이후 새로 on
//		media_layer_open("../assets/video/"+event.target.id+".mp4");return false;
	});

    $(".image").off('click').on('click', function (e) {	// 이미지 표기 버튼
		image_layer_open(event.target.id);
	});
	
    $(".type1").off('click').on('click', function (e) {	// type1 버튼 (투명)
		if ($(this).hasClass('url'))		// url 이동 버튼인 경우
		{
			var cName = $(this).attr('class').split(' ');
        	goUrl(cName[cName.length-1]);
		}
		else if ($(this).hasClass('goto'))	// 페이지 이동 버튼인 경우
		{
			var cName = $(this).attr('class').split(' ');
			goPage(cName[cName.length-1]);
		}
		else								// 그 외에는 모두 음원 버튼
		{
			mediaBtn(e);
		}
	});
    $(".type2").off('click').on('click', function (e) {	// type2 음원 버튼
		mediaBtn(e);
	});
    $(".type3").off('click').on('click', function (e) {	// type3 음원 버튼
		mediaBtn(e);
	});
	$(".type1").hover(function() {	// 마우스 over 시 설정
		$(document).find('#'+$(this).attr('id')).each(function () {
			$(this).css('opacity', '0.2');	// mouse enter
		});
	}, function() {
		$(document).find('#'+$(this).attr('id')).each(function () {
			$(this).css('opacity', '0');	// mouse leave
		});
	});
	findThis();
});

function hideMoveIcon(id) {	// 이동 버튼 투명화
	$('#media_layer_'+id).css('background', 'Transparent');
	$('#media_layer_'+id).css('cursor', 'default');
	$('#media_layer_'+id).css('z-index', 50);
}

var mediaCount = 0;

function mediaBtn(event) {
	image_layer_open(event.target.id);
	for (var i=0;i<document.getElementsByName("sound").length ; i++) {
		if (document.getElementsByName("sound")[i].parentElement.id===("media_layer_contents_"+event.target.id)) {
			if (document.getElementsByName("sound")[i].src.indexOf("media1")>=0) {
				stop_sound_all();
				$('#media_layer_'+event.target.id).css('display', 'none');
				$('#media_layer_'+event.target.id).find('iframe').remove();
				media_layer_open(event.target.id, $(event.target).css('top'), $(event.target).css('left'), "../assets/mp3/"+event.target.id+".mp3","../assets/vtt/"+event.target.id+".vtt");
				return false;
			}
		}
	}

	if ($('#media_layer_'+event.target.id).css('display')=="block") {
		mediaCount--;
		for (var i=0;i<document.getElementsByName("sound").length ; i++) {
			if (document.getElementsByName("sound")[i].parentElement.id===("media_layer_contents_"+event.target.id)) {
				stop_sound(i);
				break;
			}
		}
		$('#media_layer_'+event.target.id).css('display', 'none');
		$('#media_layer_'+event.target.id).find('iframe').remove();
		var cutLine = $('#media_layer_'+event.target.id).css('z-index');	// 현재 media layer 의 z-index 값 확인
		$('#media_layer_'+event.target.id).css('z-index', 100);				// 현재 media layer 의 z-index 값 100으로 재설정

		/**
		 * 모든 레이어에 대하여 현재 media layer 의 z-index 였던 값(cutLine)보다 크다면
		 * 현재 media layer보다 상위에 위치하고 있는 것이므로
		 * z-index 값을 -1 하여 z 위치 조정
		 * 보여지는 z-index 값은 무조건 ~(100+mediaCount), 보이지 않는다면 무조건 100
		 * 현재 매우 빠른 속도로 버튼을 클릭하면 문제가 생기나 media layer보다 상위에 존재할 layer가 없기 때문에
		 * 당장 수정은 하지 않았으나, 추후에 필요하다면 버튼 터치에 대한 입력 시간을 확인하여
		 * 빠른 시간 내에 다시 터치되는 것을 방지하는 코드 필요
		 */
		var mediaLayers = $('.media_layer');
		for (var i=0;i<mediaLayers.length;i++) {
			if ($(mediaLayers[i]).css('z-index') > cutLine)
				$(mediaLayers[i]).css('z-index', $(mediaLayers[i]).css('z-index')-1);
		}
	} else {
		/**
		 * mediaCount를 증가하며, 증가한 만큼 z-index 값을 설정
		 * 가장 마지막에 클릭한 버튼의 media layer가 무조건 최상위에 표시
		 */
		mediaCount++;
		stop_sound_all();
		media_layer_open(event.target.id, $(event.target).css('top'), $(event.target).css('left'), "../assets/mp3/"+event.target.id+".mp3","../assets/vtt/"+event.target.id+".vtt");
		$('#media_layer_'+event.target.id).css('z-index', 100+mediaCount);
		/*--------------------------샘플 미디어 위치 수정--------------------------*/
		//$("#media_layer_contents_track004").css({'left': '580px', 'top': '100px'});
		//$("#media_layer_contents_track005").css({'left': '700px', 'top': '745px'});
		/*-----------------------------------------------------------------------*/
		return false;
	}
}

var thisIFrame;

function findThis() {	// 뷰어에 로딩된 페이지(iframe object) 중 현재 페이지 확인
	var g = window.parent;
	var gfs = $(g.document).find("iframe");

	for (var i=0; i<gfs.length; i++)
	{
		if (gfs[i].src === location.href)
		{
			thisIFrame = gfs[i];	// location 주소가 동일하면 같은 것으로 판별
		}
	}
}

function intervalFunc() {	// 현재 iframe의 화면 표시 상태를 체크, 표시되지 않는 경우 sound 정지
	if (thisIFrame==null || thisIFrame.parentElement==null) {
		return;
	}
	
	// check z-index
	var zIdx = thisIFrame.parentElement.parentElement.style.zIndex;

	if (zIdx == 10000)	// 10000 이면 화면 표시중, 아닐 경우엔 -10000
	{
		// visible
	}
	else
	{
		// invisible
		stop_sound_this();
	}
}

// media player drag 용 object
var img_L = 0;	// 움직일 객체의 left
var img_T = 0;	// 				top
var targetObj;

// touch device check
var isTouchDevice;
try {
	document.createEvent("TouchEvent");
	isTouchDevice = true; 
} catch (e) {
	isTouchDevice = false;
}

// target 움직이기
function moveDrag(e){
	var dmvx = parseInt(e.clientX + img_L);
	var dmvy = parseInt(e.clientY + img_T);

	if (isTouchDevice) {	// touch device의 경우
		dmvx = parseInt(e.touches[0].clientX + img_L);
		dmvy = parseInt(e.touches[0].clientY + img_T);
	}
	var w = parseInt(targetObj.style.width);
	var h = parseInt(targetObj.style.height);	// 크기
	if (dmvx > (viewportSize.width - w + 30))	// 화면의 우측으로 벗어나지 않도록 강제로 drag stop
	{
		stopDrag();
	}
	if (dmvx < 0)	// 좌측으로 벗어난다면
	{
		dmvx = 0;
	} else if ((dmvx + w) > viewportSize.width)	// 우측
	{
		dmvx = viewportSize.width - w;
	}
	if (dmvy < 0)	// 상단으로 벗어나는 경우
	{
		dmvy = 0;
	} else if ((dmvy + h) > viewportSize.height)	// 하단
	{
		dmvy = viewportSize.height - h;
	}
	targetObj.style.left = dmvx +"px";
	targetObj.style.top = dmvy +"px";	// 위치 설정
    if(e.preventDefault)e.preventDefault();
	return false;
}

// 드래그 시작
function startDrag(e, obj){
    targetObj = obj;
	
	// target의 좌측과 상단 확인
	isTouchDevice ? img_L = parseInt(obj.style.left) - e.touches[0].clientX : img_L = parseInt(obj.style.left) - e.clientX;
	isTouchDevice ? img_T = parseInt(obj.style.top) - e.touches[0].clientY : img_T = parseInt(obj.style.top) - e.clientY;

	// drag event listener 설정
	isTouchDevice ? document.ontouchmove = moveDrag : document.onmousemove = moveDrag;
	isTouchDevice ? document.ontouchend = stopDrag : document.onmouseup = stopDrag;
	
	document.onmouseleave = stopDrag;	// 마우스가 벗어나는 경우 stop
    if(e.preventDefault)e.preventDefault(); 
}

// 드래그 멈추기
function stopDrag() {	// event listener reset
	if (isTouchDevice) {
		document.ontouchmove = null;
		document.ontouchend = null;
	} else {
		document.onmousemove = null;
		document.onmouseup = null;
	}
	document.onmouseleave = null;
}

function goPage(idx) {		// 페이지 이동
    window.parent.goPageWithIdx(idx);	// 뷰어에 존재하는 함수 호출 (url 동일)
}

function goUrl(url) {		// url 이동
    window.parent.linkAction(url);
}