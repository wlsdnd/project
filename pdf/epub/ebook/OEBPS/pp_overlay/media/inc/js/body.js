var video ;
$(document).ready(function(){
	initVideo();
});

var checkEventKind = function () {
    var isTouch = ('ontouchstart' in window) ? true : false;
    var retDown = isTouch ? 'touchstart' : 'mousedown';
    var retUp = isTouch ? 'touchend' : 'mouseup';
    var retMove = isTouch ? 'touchmove' : 'mousemove';
    var retLeave = isTouch ? 'touchcancel' : 'mouseleave';
    var retEnter = isTouch ? '' : 'mouseenter';

    return {
        down : function () {
            return retDown;
        },
        up : function () {
            return retUp;
        },
        move : function () {
            return retMove;
        },
        leave : function () {
            return retLeave;
        },
        enter : function () {
            return retEnter;
        },
        isTouch : function () {
            return isTouch;
        }
    }
};

var playpause = function() {
	if(video[0].paused || video[0].ended) {
		{
			var myID = $(window.frameElement).parent().attr('id');

			var g = window.parent.parent;
			var gfs = $(g.document).find("iframe");

			var allSoundArr = new Array();

			for (var i=0; i<gfs.length; i++)
			{
				var soundArr = $(gfs[i].contentWindow.document).find("iframe");
				for (var j=0; j<soundArr.length; j++)
				{
					allSoundArr.push(soundArr[j]);
				}
			}

			for(var i=0; i<allSoundArr.length; i++) {
				var iID = $(allSoundArr[i]).parent().attr("id");
				if (iID != myID) {
					allSoundArr[i].contentWindow.pause();
				}
			}
		}
		video[0].play();
		$('.playBtn .pause').css('display','block');
		$('.playBtn .play').hide();
	}
	else {
		video[0].pause();
		$('.playBtn .pause').hide();
		$('.playBtn .play').css('display','block');
	}
};

function initVideo() {
    var evt = checkEventKind();
    var currentPageNum = $('.currentp').text();
    var totalPageNum = "04";
    $('.totalp').text(totalPageNum)
    video = $('audio');

    if(video.length > 0){
        //video[0].load()
        video[0].removeAttribute("controls");
        var pageVolume = $(parent.document).find('.pageVolume').text();
        video.on('loadedmetadata', function() {
            $('.current').text(timeFormat(0));
            $('.duration').text(timeFormat(video[0].duration));
            updateVolume(0, 0.5);
            setTimeout(startBuffer, 150);
            $('.progress-bar').css('width',0);
        });

        //버퍼링 바
        var startBuffer = function() {
            var currentBuffer = video[0].buffered.end(0);
            var maxduration = video[0].duration;
            var perc = 100 * currentBuffer / maxduration;
            $('.bufferBar').css('width',perc+'%');
            if(currentBuffer < maxduration) {
                setTimeout(startBuffer, 500);
            }
        };

		video[0].onplay = function () {
            $('.playBtn .play').hide();
            $('.playBtn .pause').css('display','block');
        };

        video.on('ended',function(){
            $('.playBtn .pause').hide();
            $('.playBtn .play').css('display','block');
            $('.currentTime').text(timeFormat(video[0].duration));
			video[0].pause();
        });

        //video 상태
        var startBuffer = function() {
            var currentBuffer = video[0].buffered.end(0);
            var maxduration = video[0].duration;
            var perc = 100 * currentBuffer / maxduration;
            if(currentBuffer < maxduration) {
                setTimeout(startBuffer, 500);
            }

        };

		var repeat = false;
        var repeatMove = false;
        var repeatStart;
        var repeatEnd;

        $('.repeat').on('click', function(){
            repeat = true;
            repeatMove = true;
            repeatBarLeft = $('.progress-bar').width();
            repeatStart = parseInt(video[0].currentTime);
            $(this).hide();
            $('.repeatA').css('display','block');
            $('.repeat-bar').show();
            $('.repeat-bar').css('left', repeatBarLeft);
			$('.progress-bar-jog').css('background','url(img/bottom/r_dot.png) 0 0px no-repeat');
        });

        $('.repeatA').on('click', function(){
            repeatMove = false;
            repeatBarRight = $('.progress').width() - $('.progress-bar').width();
            repeatEnd = parseInt(video[0].currentTime);
            video[0].currentTime = repeatStart;
            $(this).hide();
            $('.repeatAB').css('display','block');
            $('.repeat-bar').css('right', repeatBarRight);
        });

        $('.repeatAB').on('click', function(){
            $(this).hide();
            repeatOff();
        });

        function repeatOff(){
            repeat = false;
            repeatStart = undefined;
            repeatEnd = undefined;
            $('.repeat-bar').hide().css({'left':'', 'right':''});
            $('.repeatA, .repeatAB').hide();
            $('.repeat').css('display','block');
			$('.progress-bar-jog').css('background','url(img/bottom/dot.png) 0 0px no-repeat');
        }

        //프로그래스 바
        var updatebar = function(x) {
            var progress = $('.progress');
            var maxduration = video[0].duration;
            var position = x - progress.offset().left;
            var percentage = 100 * position / progress.width();
            if(percentage > 100) {
                percentage = 100;
            }
            if(percentage < 0) {
                percentage = 0;
            }
			
			var rs = repeatStart;
			var re = repeatEnd;
			var ct = parseInt(video[0].currentTime)+1;
					
            //반복구간 추가
            if(repeat){
				if(ct <= repeatStart) repeatOff();
                else if(parseInt(video[0].currentTime) >= repeatEnd) repeatOff();
                else video[0].currentTime = maxduration * percentage / 100;
            }else{
                $('.progress-bar').css('width',percentage+'%');
                video[0].currentTime = maxduration * percentage / 100;
            }
        };

        //볼륨 컨트롤
        var volumeDrag = false;
        $('.volume').on(evt.down(), function(e) {
            volumeDrag = true;
            video[0].muted = false;
            $('.sound').removeClass('muted');
            evt.isTouch() ? updateVolume(e.touches[0].pageX) : updateVolume(e.pageX);
        });
		//재생시간 이동
        var timeDrag = false;
        $('.progress').on(evt.down(), function(e) {
			video[0].pause();
            timeDrag = true;
            evt.isTouch() ? updatebar(e.touches[0].pageX) : updatebar(e.pageX);
        });
        $(document).on(evt.up(), function(e) {
            if(volumeDrag) {
                volumeDrag = false;
                evt.isTouch() ? updateVolume(e.touches[0].pageX) : updateVolume(e.pageX);
            } else if(timeDrag) {
                timeDrag = false;
                evt.isTouch() ? updatebar(e.touches[0].pageX) : updatebar(e.pageX);
				video[0].play();
            }
        });
        /*$(document).on(evt.enter(), function(e){
        });*/
        $(document).on(evt.leave(), function(e) {
            if(timeDrag) {
                timeDrag = false;
                evt.isTouch() ? updatebar(e.touches[0].pageX) : updatebar(e.pageX);
                video[0].play();
            }
        });
        $(document).on(evt.move(), function(e) {
            if(volumeDrag) {
                evt.isTouch() ? updateVolume(e.touches[0].pageX) : updateVolume(e.pageX);
            } else if(timeDrag) {
                evt.isTouch() ? updatebar(e.touches[0].pageX) : updatebar(e.pageX);
            }
        });

        //플레이 시간
        video.on('timeupdate', function() {
            var currentPos = video[0].currentTime;
            var maxduration = video[0].duration;
            var perc = 100 * currentPos / maxduration;
			//반복구간 추가
			if(repeat){
				if(repeatMove){
	                repeatBarRight = $('.progress').width() - $('.progress-bar').width();
	                $('.repeat-bar').css('right', repeatBarRight);
	            }
				
				var rs = repeatStart;
				var re = repeatEnd;
				var ct = parseInt(video[0].currentTime)+1;
					
				if(repeatStart > ct) {
					repeatOff();
				}
	            if(repeatEnd < parseInt(video[0].currentTime)) repeatOff();
	            if(repeatEnd == parseInt(video[0].currentTime)) video[0].currentTime = repeatStart;
			}
            $('.progress-bar').css('width',perc+'%');
            $('.currentTime').text(timeFormat(currentPos));
        });

        //시간값 변경
        var timeFormat = function(seconds){
            var m = Math.floor(seconds/60)<10 ? "0"+Math.floor(seconds/60) : Math.floor(seconds/60);
            var s = Math.floor(seconds-(m*60))<10 ? "0"+Math.floor(seconds-(m*60)) : Math.floor(seconds-(m*60));
            return m+":"+s;
        };

        var updateVolume = function(x, vol) {
            var volume = $('.volume');
            var percentage;
            if(vol) {
                percentage = vol * 100;
            }
            else {
                var position = x - volume.offset().left;
                percentage = 100 * position / volume.width();
            }

            if(percentage > 100) {
                percentage = 100;
            }
            if(percentage < 0) {
                percentage = 0;
            }

            $('.volumeBar').css('width',percentage+'%');
            video[0].volume = percentage / 100;
            updatePageVolume = percentage / 100;
            $(parent.document).find('.pageVolume').text(updatePageVolume);
            if(video[0].volume == 0){
                $('.soundBtn .sound').hide();
                $('.soundBtn .mute').css('display','block');
            }else{
                $('.soundBtn .sound').css('display','block');
                $('.soundBtn .mute').hide();
            }
        };

        //재생 일시정지
        video.on('click', function(e){ playpause(); });
        $('.playBtn a').on('click', function(e) { playpause(); } );



        //정지
        $('.rePlayBtn').on('click', function() {
            videoRe();
        });

        var videoRe = function(){
            $('.playBtn .play').css('display','block');
            $('.playBtn .pause').hide();
            updatebar($('.progress').offset().left);
			//배속 초기화 추가/////////////////////
			video[0].playbackRate=1.0;
			$(".rateGroup").find('.btn a').removeClass('selected');
			$(".rateGroup").find('.btna[rate="1.0"]').addClass('selected');
			/////////////////////////////////////////
            video[0].pause();
        };

        //10초전
        $(".backwardBtn").click(function(){
            video[0].currentTime -= 10;
        });

        //10초후
        $(".forwardBtn").click(function(){
            video[0].currentTime += 10;
        });

        //음소거
        $('.soundBtn').click(function() {
            video[0].muted = !video[0].muted;
            if(video[0].muted) {
                $('.volumeBar').css('width',0);
                $('.soundBtn .sound').hide();
                $('.soundBtn .mute').css('display','block');
            }
            else{
                $('.volumeBar').css('width', video[0].volume*100+'%');
                $('.soundBtn .sound').css('display','block');
                $('.soundBtn .mute').hide();
            }
        });
        //전체화면
        $('.fullScreen').click(function(e){
           fullScreen(e);
        });

        var fullScreen = function(e){
            var divObj = document.getElementById('audio');
            if($.isFunction(video[0].requestFullscreen)) {
                video[0].requestFullscreen();
            }
            else if ($.isFunction(video[0].mozRequestFullScreen)) {
                video[0].mozRequestFullScreen();
            }
            else if (video[0].msRequestFullscreen) {
                video[0].msRequestFullscreen();
            }
            else if ($.isFunction(video[0].webkitEnterFullscreen)) {
                video[0].webkitEnterFullscreen();
            }
            else {
                alert('지원하지 않는 브러우저 입니다.');
            }

        };


        //동영상 속도
        $(".rateGroup .btn.minus a").click(function(e){
            e.preventDefault();
			if(video[0].playbackRate > 0.7) video[0].playbackRate -= 0.1;
			var vdoRate = video[0].playbackRate;
			video[0].playbackRate = vdoRate.toFixed(1);
			$(this).parent().siblings('.speed').text((vdoRate*100).toFixed(0)+'%');
        });

		$(".rateGroup .btn.plus a").click(function(e){
            e.preventDefault();
            if(video[0].playbackRate < 1.3) video[0].playbackRate += 0.1;
			var vdoRate = video[0].playbackRate;
			video[0].playbackRate = vdoRate.toFixed(1);
			$(this).parent().siblings('.speed').text((vdoRate*100).toFixed(0)+'%');
        });

		$(".rateGroup .btn a").click(function(e){
			e.preventDefault();
			var vdoRate = video[0].playbackRate;
			var currentvdoRate = vdoRate.toFixed(1);
			if(currentvdoRate > 1.0){
				$(".rateGroup .btn.plus a").css('background','url(img/bottom/plus_o.png) 50% 50% no-repeat');
				$(".rateGroup .btn.minus a").css('background','url(img/bottom/minus.png) 50% 50% no-repeat');
			}else if(currentvdoRate < 1.0){
				$(".rateGroup .btn.plus a").css('background','url(img/bottom/plus.png) 50% 50% no-repeat');
				$(".rateGroup .btn.minus a").css('background','url(img/bottom/minus_o.png) 50% 50% no-repeat');
			}else if(currentvdoRate == 1.0){
				$(".rateGroup .btn.plus a").css('background','url(img/bottom/plus.png) 50% 50% no-repeat');
				$(".rateGroup .btn.minus a").css('background','url(img/bottom/minus.png) 50% 50% no-repeat');
			}
		});

        //자막
        var trackDisplay = "off";
        var track = document.getElementById("track");
		var disp = document.getElementById("scriptBox");
        if(trackDisplay == "on"){
            $('#display').css('display','block') ;
        }else{
            $('#display').css('display','none') ;
            $('.track').removeClass('on');
        }
        var basicColor = null, activeColor = null, scrollbarColor = null, scrollbarSize = null;
        if(track == null){
        }else{
            track.addEventListener("load", function () {
                var myTrack = this.track;               // track element is "this"
                var obj = null, myCues = myTrack.cues;  // obj - json object, myCues - all cue
                for (var c=0,l=myCues.length;c<l;c++) {
                    try {
                        // setting value
                        obj = JSON.parse(myCues[c].text);
                        break;
                    } catch (e) {
                        // isn't parse json object
                        console.log(e);
                        continue;
                    }
                }
                if (obj) {
                    obj["background color"] ? $('#display').css('background-color', obj["background color"]) : null;
                    obj["basic color"] ? $('#scriptBox').css('color', obj["basic color"]) : null;
                    obj["basic color"] ? basicColor = obj["basic color"] : null;
                    obj["active color"] ? activeColor = obj["active color"] : null;
                    obj["scrollbar color"] ? scrollbarColor = obj["scrollbar color"] : null;
                    obj["scrollbar size"] ? scrollbarSize = obj["scrollbar size"]+'px' : scrollbarSize = '8px';
                    parseInt(scrollbarSize) > 16 ? scrollbarSize = '16px' : null;
                    parseInt(scrollbarSize) < 1 ? scrollbarSize = '1px' : null;
                    obj["text size"] ? $('#scriptBox').css('font-size', obj["text size"]+'px') : null;
                }
            });
            track.addEventListener("cuechange", function () {
                var myTrack = this.track;             // track element is "this"
                var myCues = myTrack.activeCues;      // activeCues is an array of current cues.
                if (myCues.length > 0) {
					if(disp!=null) {
						disp.innerHTML = myCues[0].text;   // write the text
					}
					if(trackScroll && $('#scriptBox span.stand').length >= 1){
						var scrollMove = parseInt($('.scrollBox #scriptBox').find('span.stand').position().top);
						$('.scrollBox').mCustomScrollbar('scrollTo', scrollMove);
                    }
                    basicColor ? $('span.stand').css('color', basicColor) : null;
                    activeColor ? $('span.active').css('color', activeColor) : null;
                }
             });
        }

		var trackScroll = false;

		$(".track").click(function(e){
            e.preventDefault();
			var $display = $(this).parents('body').find('#display');
			var $bottom = $(this).parents('body').find('#bottom');
			var _curTrack = $(this).parents('body').find('#track').attr('src');
			var curTrack = _curTrack.substring(_curTrack.indexOf('vtt/')+4, _curTrack.indexOf('.vtt'));
            if(!$(this).hasClass('disable')){
				trackScroll = true;
                if($display.css('display') == 'none'){
					$('.scrollBox').mCustomScrollbar({setTop: '7px'});
					//자막창 스크롤X
					$('body', parent.document).css({
						'width': '1200px',
						'height': '100%',
						'overflow': 'hidden'
					});
					//자막창 사이즈
					$('#media_layer_contents_'+curTrack, parent.document).addClass('scriptOn');
					$('#media_layer_contents_'+curTrack+' #mediapop', parent.document).css({
						'width': '100%',
						'height': '100%'
					});
					$bottom.css('left','calc(50% - 500px)');
                    $display.css('display','block') ;
                    
                    $display.find('.mCSB_dragger_bar').css('width', '8px');
                    $bottom.css('top', '20px');
                    scrollbarColor ? $('.mCSB_dragger_bar').css('background-color', scrollbarColor) : null;
                    $(this).addClass('on');
                    (typeof parent.parent.viewer !== 'undefined') ? parent.parent.viewer.mediaSubtitlesOn() : null;
                }else{
					trackScroll = false;
					//스크롤
					$('body', parent.document).css({
						'width': '',
						'height': '',
						'overflow': ''
					});
					//자막창 사이즈
					$('#media_layer_contents_'+curTrack, parent.document).removeClass('scriptOn');
					$('#media_layer_contents_'+curTrack+' #mediapop', parent.document).css({
						'width': '',
						'height': ''
					});
					$bottom.css('left','0px');
                    $display.css('display','none') ;
                    $bottom.css('top', '');
                    $(this).removeClass('on');
                    (typeof parent.parent.viewer !== 'undefined') ? parent.parent.viewer.mediaSubtitlesOff() : null;
                };
            }
        });

		$('.scriptClose').click(function(){
			$('.track').click();
		});
    }

    //단축키 이벤트
    $(document).keydown(function(e){
        var tag = e.target.tagName.toLowerCase();
        if(tag == 'input' || tag == 'textarea'){
        }else{
            if(e.keyCode == 32){
                playpause();
            }else if(e.keyCode == 38){//위
                updateVolume(0,video[0].volume +0.1);
            }else if(e.keyCode == 40){//아래
                updateVolume(0,video[0].volume -0.1);
            }else if(e.keyCode == 37){//왼쪽
                video[0].currentTime -= 10;
            }else if(e.keyCode == 39){//오른쪽
                video[0].currentTime += 10;
            }else if(e.keyCode == 107){//속도 업
				$(".rateGroup .btn.plus a").click();
            }else if(e.keyCode == 109){//속도 다운
				$(".rateGroup .btn.minus a").click();
            }else if(e.altKey && e.which == 84){
				$(".track").click();
            }else if(e.which == 33){
                $('a.prevPageBtn').trigger('click');
            }else if(e.which == 34){
                $('a.nextPageBtn').trigger('click');
            }
        }
    });


    /*페이지 버튼*/
	$('.nextPage a').click(function(e){
        var page = Number(currentPageNum) + 1;
        if(page  < 10){
            page ++ ;
            page = "0" + page.toString();
        }else{
            page ++ ;
        }
        if(Number(currentPageNum) < Number(totalPageNum)){
            location.href= page+".html";
        }else{
            alert("마지막페이지입니다.");
        }
	});
    $('.prevPage a').click(function(e){
        var page = Number(currentPageNum) + 1;
        if(page  < 10){
            page -- ;
            page = "0" + page.toString();
        }else{
            page -- ;
        }
        if(Number(currentPageNum) > 0){
            location.href= page+".html";
        }else{
            alert("첫페이지입니다.");
        }
    });

   //우클릭 방지
	//document.oncontextmenu = new Function('return false');
}
