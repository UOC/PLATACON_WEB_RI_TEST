jQuery(document).ready(function ($) {

    var difusionsList = [];
    var allDifusions = [];
    allDifusions = allDifusions.concat(difusionsDestacades);
    allDifusions = allDifusions.concat(restaDifusions);

    console.log(allDifusions);
    var idx=2;
    for(var difusio of allDifusions){
		difusionsList.push(getResultMarkup(difusio, idx));
		idx+=1;
    }
    initPagination(difusionsList);
})

function getResultMarkup(difusio, idx){

    var label;
    if(difusio.type == 'noticia') label = noticiaLabel;
    else if(difusio.type == 'esdeveniment') label = esdevenimentLabel;

    var markup='<div class="col-xs-6 col-md-3" role="listitem" data-id="">';
    	
		markup+='<div class="card">';
			markup+='<a href="' + difusio.link + '" class="card-absolute-link" aria-hidden="true" aria-labelledby="x'+ idx +'" tabindex="-1"></a>';
    		markup+='<div class="card__image">';
    			if(difusio.img) markup+='<img src="'+ difusio.img + '" alt="">';
    			markup+='</div>';
    	markup+='<div class="card__contents" >';
    if(difusio.titol) markup+='<h3 class="h5 text font-alternate"><a id="x' + idx + '" href="'+ difusio.link +'">' + difusio.titol + '<span class="visually-hidden">' + LinkLang + '</span></a></h3>'
    markup+='</div><div class="card__footer"><span class="float-left p-left-x  icon icon--external-link" aria-hidden="true"></span>';
	markup+='<span class="float-right p-right-x"><span class="visually-hidden">Tag: </span>'+ label +'</span>';
    markup+='</div></div>';
    markup+='</div>';

	return markup;
}

/***********************************************************************
							PAGINATION METHODS								
***********************************************************************/

function initPagination(dataset) {

	//console.log('Entering initPagination for content type: ' + content_type + '. Tab: ' + tab);
	//console.log('Looking for element: .pagination-'+content_type+'_'+tab+' .pagination-'+content_type+'-container_'+ tab);

    $('.resultsDifusions .pagination-difusions .pagination-difusions-container').pagination({
	    dataSource: dataset,
	    pageSize: 8,
	    autoHidePrevious: true,
	    autoHideNext: true,
	    callback: function(data, pagination) {
			// template method of yourself
			//console.log('Entering initPagination callback for content type: ' + content_type);
			var html = data;
			//console.log('There is more than one match: '+ $('.'+content_type+'Results_' + tab +' .list-'+content_type).length)
            $('.resultsDifusions .list-difusions').html(html);
	    },
	    afterRender: function(isForced) {
	    	if($('.pagination-difusions-container .J-paginationjs-page').length > 1){
				//console.log('There is more than one match: '+ $('.pagination-difusions-container_' + tab +' .J-paginationjs-page').length)
		    	$('.pagination-difusions-container .J-paginationjs-page').addClass("col-md-1");
		    	$('.pagination-difusions-container .paginationjs-ellipsis').addClass("col-md-1");
				$('.pagination-difusions-container .J-paginationjs-previous').addClass("col-md-2");
				$('.pagination-difusions-container .J-paginationjs-next').addClass("col-md-2");
				//last item width
				var cols = 12 - $('.pagination-difusions-container .paginationjs-ellipsis').length;
				cols -= ($('.pagination-difusions-container .J-paginationjs-previous').length * 2);
				cols -= ($('.pagination-difusions-container .J-paginationjs-next').length * 2);
				cols -= $('.pagination-difusions-container .J-paginationjs-page').length;
				$('.pagination-difusions-container .J-paginationjs-page').last().removeClass("col-md-1");
				cols++;
				$('.pagination-difusions-container .J-paginationjs-page').last().addClass("col-md-"+cols);
				$('.pagination-difusions .pagination-difusions-container').show();
	    	} else {
	    		$('.pagination-difusions .pagination-difusions-container').hide();
	    	}
	    	$(".pagination-difusions>div>div").removeClass("col-md-4");
	    },
	    afterPaging: function(){
	    	if($('.difusionsResults .js-changeVist').hasClass("change-to-list")){
	    		$(".difusionsResults .list-difusions div").removeClass("col-md-4");
	    		$(".pagination-difusions>div>div").removeClass("col-md-4");
	    	}
	    },
	    prevText: literals.pagination.previous,
	    nextText: literals.pagination.next,
	    pageRange: 1
	});	
}

$(".link-trigger").click(function() {
    window.location = $(this).find("a").attr("href");
    return false;
});