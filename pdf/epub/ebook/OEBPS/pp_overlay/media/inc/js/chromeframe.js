var is_editor = (typeof editor != 'undefined');

var needGCF = false;
if (!is_editor) {
  function getIeVersion() {
      var agentStr = navigator.userAgent;
      var version = 7;
      var isCompatible = false;
      if (agentStr.indexOf("Trident/7.0") > -1) {
          if (agentStr.indexOf("MSIE 7.0") > -1) {
              isCompatible = true;
          }
          version = 11;
      }
      else if (agentStr.indexOf("Trident/6.0") > -1) {
          if (agentStr.indexOf("MSIE 7.0") > -1) {
              isCompatible = true;
          }
          version = 10;
      }
      else if (agentStr.indexOf("Trident/5.0") > -1) {
          if (agentStr.indexOf("MSIE 7.0") > -1) {
              isCompatible = true;
          }
          version = 9;
      }
      else if (agentStr.indexOf("Trident/4.0") > -1) {
          if (agentStr.indexOf("MSIE 7.0") > -1) {
              isCompatible = true;
          }
          version = 8;
      }
      
      return version;
  }
  
  function isIE() {
    var agentStr = navigator.userAgent;
    if (agentStr.indexOf("Trident") > -1 || agentStr.indexOf("MSIE") > -1) {
      return true;
    }
    return false;
  }
  
  function IsGCFInstalled() {
    try {
      var i = new ActiveXObject('ChromeTab.ChromeFrame');
      if (i) {
        return true;
      }
    } catch(e) {
    	//console.log('ChromeFrame not available, error:', e.message);
    }
    return false;
  }
  
  function isNeededGCF() {
    return (isIE() == true && getIeVersion() < 10 && IsGCFInstalled() == false);
  }
  
  needGCF = isNeededGCF();
}

if (needGCF) {
  var _domReadyState = null;
  
  function readyEvent(func) {
    if (document.addEventListener) // all browser except IE before version 9
      document.addEventListener("DOMContentLoaded", func, false);
    else if (document.attachEvent) { // IE before version 9 
      document.onreadystatechange = function () {
        // alternative to DOMContentLoaded
        if (document.readyState === "interactive") {
          _domReadyState = document.readyState;
          func();
        }
        // alternative to load event
        if (document.readyState === "complete") {
          if (_domReadyState == null) {
            func();
            _domReadyState = null;
          }
        }
      };
    }
  }
  
  readyEvent(function () {
    if (document.body) {
      var nodes = document.body.childNodes;
      for(var i = nodes.length - 1; i >= 0; i--) {
        try{
        nodes[i].style.display = "none";
        }catch(e){}
      }
      
      var txt  = '<div id="cfText" style="background-image:url(\'img/popup_chrome_frame.jpg\');background-repeat:no-repeat;width:100%;height:670px;background-position:center center;">\n';
          txt += '  <div>.</div>\n';
          txt += '  <div style="font-size:50px;text-align:center;margin-top:533px;">\n';
          txt += '    <a href="./inc/util/GoogleChromeframeStandaloneEnterprise.msi" style="display:block;">\n';
          txt += '      <div style="width: 400px; border:solid 2px transparent; height:50px; display:inline-block; text-align:center;">&nbsp;</div>\n';
          txt += '    </a>\n';
          txt += '  </div>\n';
          txt += '</div>\n';
          
      document.body.innerHTML = txt;
      
      //document.body.style.display = "";
    }
  });
}
else { }
// >> for chrome frame
