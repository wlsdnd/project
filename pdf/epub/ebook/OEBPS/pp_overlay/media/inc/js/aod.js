$(document).ready(function(){
	var aod = $('audio');
	if(aod.length > 0){
		aod[0].load();
		aod[0].removeAttribute('controls');

		aod.on('loadedmetadata', function() {
            $('.aod-progress-bar').css('width',0);  
            $('.aodpause').hide();
            $('.aodplay').css('display','block');
            $('.ttime').text(timeFormat(aod[0].duration));
            updateVolume(0, 1);
        });

		aod[0].onplay = function () {
            $('.aodplay').hide();
            $('.aodpause').css('display','block');
        };

        aod.on('ended',function(){
            $('.aodpause').hide();
            $('.aodplay').css('display','block');
        });

        //시간값 변경
        var timeFormat = function(seconds){
            var m = Math.floor(seconds/60)<10 ? "0"+Math.floor(seconds/60) : Math.floor(seconds/60);
            var s = Math.floor(seconds-(m*60))<10 ? "0"+Math.floor(seconds-(m*60)) : Math.floor(seconds-(m*60));
            return m+":"+s;
        };

        aod.on('timeupdate',function(){
        	var currentPos = aod[0].currentTime;
            var maxduration = aod[0].duration;
            var perc = 100 * currentPos / maxduration;
        	$('.aod-progress-bar').css('width',perc+'%');  
            $('.ctime').text(timeFormat(currentPos));  
        });

        //프로그래스 바
        var updatebar = function(x) {
            var progress = $('.aodprogress');
            
            var maxduration = aod[0].duration;
            var position = x - progress.offset().left;
            var percentage = 100 * position / progress.width();
            if(percentage > 100) {
                percentage = 100;
            }
            if(percentage < 0) {
                percentage = 0;
            }
            $('.aod-progress-bar').css('width',percentage+'%'); 
            aod[0].currentTime = maxduration * percentage / 100;
        };
        
        var timeDrag = false;
        $('.aodprogress').on('mousedown', function(e) {
            timeDrag = true;
            updatebar(e.pageX);
        });
        $(document).on('mouseup', function(e) {
            if(timeDrag) {
                timeDrag = false;
                updatebar(e.pageX);
            }
        });
        $(document).on('mouseout', function(e) {
            if(timeDrag) {
                timeDrag = false;
                updatebar(e.pageX);
            }
        });
        $(document).on('mousemove', function(e) {
            if(timeDrag) {
                updatebar(e.pageX);
            }
        });

        //볼륨 컨트롤
        var volumeDrag = false;
        $('.aodvolume').on('mousedown', function(e) {
            volumeDrag = true;
            aod[0].muted = false;
            $('.aodsound').removeClass('muted');
            updateVolume(e.pageX);
        });
        $(document).on('mouseup', function(e) {
            if(volumeDrag) {
                volumeDrag = false;
                updateVolume(e.pageX);
            }
        });
        $(document).on('mousemove', function(e) {
            if(volumeDrag) {
                updateVolume(e.pageX);
            }
        });

        var updateVolume = function(x, vol) {
            var volume = $('.aodvolume');
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
            
            $('.aodvolumeBar').css('width',percentage+'%');    
            aod[0].volume = percentage / 100;
            
            if(aod[0].volume == 0){
                $('.aodsound').addClass('muted');
            }else{
                $('.aodsound').removeClass('muted');
            }
            
        };

        $('.aodplay').click(function(){
        	$('.aodplay').hide();
            $('.aodpause').css('display','block');
            aod[0].play();
        });

         $('.aodpause').click(function(){
        	$('.aodpause').hide();
            $('.aodplay').css('display','block');
            aod[0].pause();
        });

         $('.aodstop').click(function(){

         	$('.aodpause').hide();
            $('.aodplay').css('display','block');
            updatebar($('.aodprogress').offset().left);
            aod[0].pause();
	    });

         $('.aodsound').click(function(e){
            aod[0].muted = !aod[0].muted;
         	if($(this).hasClass('muted')){
         		$(this).removeClass('muted');
         		$('.aodvolumeBar').css('width',aod[0].volume*100+'%');
         	}else{
         		$(this).addClass('muted');
         		$('.aodvolumeBar').css('width',0);
         	}
        });
	}
});

