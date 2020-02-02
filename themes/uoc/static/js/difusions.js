jQuery(document).ready(function ($) {

    var difusionsList = [];
    var allDifusions = [];
    allDifusions = allDifusions.concat(difusionsDestacades);
    allDifusions = allDifusions.concat(restaDifusions);

    console.log(allDifusions);
    
    for(var difusio of allDifusions){
        difusionsList.push(getResultMarkup(difusio));
    }
    initPagination(difusionsList);
})

function getResultMarkup(difusio){

    var label;
    if(difusio.type == 'noticies') label = noticiaLabel;
    else if(difusio.type == 'esdeveniments') label = esdevenimentLabel;

    var markup='<div class="col-xs-6 col-md-3" role="article" data-id="">';
    markup+='<a href="' + difusio.link + '" class="card-absolute-link"></a>';
    markup+='<div class="card" role="region" aria-label="Texto descriptivo" >';
    markup+='<div class="card__image">';
    if(difusio.img) markup+='<img src="'+ difusio.img + '" alt="Texto alternativo">';
    markup+='</div>';
    markup+='<div class="card__contents" >';
    if(difusio.titol) markup+='<p class="text-big text font-alternate">' + difusio.titol+ '</p>'
    markup+='</div><div class="card__footer"><div class="float-left p-left-x  icon icon--external-link"></div>';
    markup+='<div class="float-right p-right-x">'+ label +'</div>';
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