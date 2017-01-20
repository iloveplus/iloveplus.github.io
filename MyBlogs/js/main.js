jQuery(document).ready(function(event){
  var isAnimating = false,
    firstLoad = false;
  
  //trigger smooth transition from the actual page to the new one 
  $('main').on('click', '[data-type="page-transition"]', function(event){
      event.preventDefault();
      var _this=$(this);
      var newPage = _this.attr('href');

      //添加EndsWith扩展--解决手机端兼容问题
      if (!String.prototype.endsWith) {
          String.prototype.endsWith = function(searchString, position) {
              var subjectString = this.toString();
              if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
                  position = subjectString.length;
              }
              position -= searchString.length;
              var lastIndex = subjectString.lastIndexOf(searchString, position);
              return lastIndex !== -1 && lastIndex === position;
          };
      }
      if(newPage==""||newPage==undefined||location.href.endsWith(newPage)){
          return false;
      }

      var num=parseInt(_this.attr("data-num"));
      var label=_this.attr("data-label");

      if(label!=undefined){
          if(_this.parent().attr("id")=="sub-menus"){
              _this.addClass("active");
              _this.siblings().removeClass("active");
              $("#pagePrep").attr({"href":_this.prev()==undefined?"":_this.prev().attr("href"),"data-label":label,"data-num":(num-1)});
              $("#pageNext").attr({"href":_this.next()==undefined?"":_this.next().attr("href"),"data-label":label,"data-num":(num+1)});
          }else{
              var curdom = $("#sub-menus").find("a:eq(" + num + ")");
              curdom.addClass("active");
              curdom.siblings("a").removeClass("active");
              var choData=data.find(function (item) {
                  return item.label==label;
              });
              var blogs=choData.blogs;

              if(_this.attr("id")=="pagePrep"){
                  if(num <= 0){
                      $("#pagePrep").attr({"href":""});
                      $("#pageNext").attr({"href":blogs[num+1].url,"data-label":label,"data-num":(num+1)});
                  }else{
                      $("#pagePrep").attr({"href":blogs[num-1].url,"data-label":label,"data-num":(num-1)});
                      $("#pageNext").attr({"href":blogs[num+1].url,"data-label":label,"data-num":(num+1)});
                  }
              }
              if(_this.attr("id")=="pageNext"){
                  if(num >= blogs.length-1){
                      $("#pageNext").attr({"href":""});
                      $("#pagePrep").attr({"href":blogs[num-1].url,"data-label":label,"data-num":(num-1)});
                  }else{
                      $("#pagePrep").attr({"href":num-1<0?"":blogs[num-1].url,"data-label":label,"data-num":(num-1)});
                      $("#pageNext").attr({"href":blogs[num+1].url,"data-label":label,"data-num":(num+1)});
                  }
              }
          }
      }

    //detect which page has been selected
    //if the page is not already being animated - trigger animation
    if( !isAnimating ) changePage(newPage, true);
    firstLoad = true;
  });

  //detect the 'popstate' event - e.g. user clicking the back button
  $(window).on('popstate', function() {
  	if( firstLoad ) {
      /*
      Safari emits a popstate event on page load - check if firstLoad is true before animating
      if it's false - the page has just been loaded 
      */
      var newPageArray = location.pathname.split('/'),
        //this is the url of the page to be loaded 
        newPage = newPageArray[newPageArray.length - 1];
        if(location.pathname.indexOf("?http")){
            newPage=location.pathname.substring(location.pathname.indexOf("?http")+1);
        }
      if( !isAnimating ) changePage(newPage, false);
    }
    firstLoad = true;
	});

	function changePage(url, bool) {
    isAnimating = true;
    // trigger page animation
    $('body').addClass('page-is-changing');
    $('.cd-loading-bar').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
    	loadNewContent(url, bool);
      $('.cd-loading-bar').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
    });
    //if browser doesn't support CSS transitions
    if( !transitionsSupported() ) loadNewContent(url, bool);
	}

	function loadNewContent(url, bool) {
	    var flag=true;
        if ('' == url||'/' == url) {
            url = 'index.html';
            $("body").removeClass("show-content");
        } else {
            flag=!(url.indexOf("http://")>=0||url.indexOf("https://")>=0);
            if(flag){
                url = "/MyBlogs/pages/" + url;
            }else{
                url="/temp.html?" + url;
            }
            $("body").addClass("show-content");
        }
  	var section = $('<div class="page-content"></div>');

     //滚动条重置为初始位置
    $('.my-content').html("");

     if(flag){
         section.load(url+' .page-content', function(event){
             // load new content and replace <main> content with the new one
             $('.my-content').html(section);
             //if browser doesn't support CSS transitions - dont wait for the end of transitions
             var delay = ( transitionsSupported() ) ? 1200 : 0;
             setTimeout(function(){
                 //wait for the end of the transition on the loading bar before revealing the new content
                 $('body').removeClass('page-is-changing');
                 $('.cd-loading-bar').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
                     isAnimating = false;
                     $('.cd-loading-bar').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
                 });

                 if( !transitionsSupported() ) isAnimating = false;
             }, delay);

             if(url!=window.location && bool){
                 //add the new page to the window.history
                 //if the new page was triggered by a 'popstate' event, don't add it
                 window.history.pushState({path: url},'',url);
             }
         });
     }else{
         var path=url.substring(url.indexOf('?')+1);
         if(banByFrame(path)){
             $('.my-content').html('<div class="not-found"><img src="http://img.pc841.com/2015/0701/20150701071801322.jpeg" alt=""><p>由于拦截原因，请刷新后查看</p></div>');
         }else{
             $('.my-content').html('<iframe src="' + path + '"></iframe>');
         }

         var delay = ( transitionsSupported() ) ? 1200 : 0;
         setTimeout(function(){
             //wait for the end of the transition on the loading bar before revealing the new content
             $('body').removeClass('page-is-changing');
             $('.cd-loading-bar').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
                 isAnimating = false;
                 $('.cd-loading-bar').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
             });

             if( !transitionsSupported() ) isAnimating = false;
         }, delay);

         if(url!=window.location && bool){
             //add the new page to the window.history
             //if the new page was triggered by a 'popstate' event, don't add it
             window.history.pushState({path: url},'',url);
         }
     }
  }
  
  function banByFrame(url) {
      var arr=["https://github.com","https://www.iconfinder.com/","http://www.lazjs.com/","https://developer.mozilla.org","http://cnodejs.org","https://wrapbootstrap.com/","https://dsx.bugly.qq.com/"];
      return arr.some(function (item,index) {
          return url.indexOf(item)>=0;
      })
  }

  function transitionsSupported() {
    return $('html').hasClass('csstransitions');
  }
});