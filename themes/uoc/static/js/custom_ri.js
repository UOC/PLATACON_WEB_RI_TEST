"use strict";

$(document).ready(function () {
  
    //Fitxa tablist   
    var tabs = $(".list-group");
    if(tabs.length > 0){
    	$(".list-group>li>a").each(function(i){
    		$(this).click(function(e){
    			e.preventDefault();
    			e.stopPropagation();
    			if(!$(this).hasClass("is-active")){
    				deactivateTabs();
    				$(this).addClass("is-active");
    				$(this).attr('aria-selected',true);
    				var contentId = $(this).attr("href");
    				if(!$(contentId).hasClass("is-active")){
    					$(contentId).addClass("is-active");
    					$(contentId).attr("aria-hidden", false);
    				}
    			}
    		});
    	});
    }
});
function deactivateTabs(){
	$(".list-group>li>a").each(function(i){
		$(this).removeClass("is-active");
		var contentId = $(this).attr("href");
		$(contentId).removeClass("is-active");
		$(contentId).attr("aria-hidden", true);
		$(this).attr('aria-selected',false);
	});
}
