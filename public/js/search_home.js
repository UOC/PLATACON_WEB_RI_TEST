/***********************************************************************
							INIT METHODS								
***********************************************************************/
$(document).ready(function(){
	initCercaHome();
});
function initCercaHome(){
	$(".tab-content.cercaFiltres form").on('submit', function(e){
		e.preventDefault();
		searchParams=getFormValues();
		window.location = buildURL(searchParams);
	});
	$(".tab-content.cercaTextual form").on('submit', function(e){
		e.preventDefault();
		searchParams={};
		searchParams.s = $(".tab-content.cercaTextual form input#search").val();
		window.location = buildURL(searchParams);
	});
}
function getFormValues(){
	searchParams={};
	if($(".tab-content.cercaFiltres .tag-list.ambits_especialitzacio .active").length>0){									//Ambits checked
		searchParams.ambit_especialitzacio = [];
		$(".tab-content.cercaFiltres .tag-list.ambits_especialitzacio .active").each(function( index ) {
			searchParams.ambit_especialitzacio.push($(this).attr("data-ambit"));
		});	
		if(searchParams.ambit_especialitzacio.includes($($(".tab-content.cercaFiltres .tag-list.ambits_especialitzacio li")[0]).text())){
			delete searchParams["ambit_especialitzacio"];
		}
	}
	if($(".tab-content.cercaFiltres .tag-icons.ods .select-icon").length>0){								//ODS checked
		searchParams.ods = [];
		$(".tab-content.cercaFiltres .tag-icons.ods .select-icon").each(function( index ) {
			searchParams.ods.push($(this).find(".title").text());
		});	
	}
	if($(".tab-content.cercaFiltres input.unesco").val().length>0){											//Unesco code
		searchParams.unesco = $(".tab-content.cercaFiltres input.unesco").val();
	}
	if($(".tab-content.cercaFiltres .tag-list.centre .active").length>0){									//Centres checked
		searchParams.centre = [];
		$(".tab-content.cercaFiltres .tag-list.centre .active").each(function( index ) {
			searchParams.centre.push($(this).text());
		});	
		if(searchParams.centre.includes($($(".tab-content.cercaFiltres .tag-list.centre li")[0]).text())){
			delete searchParams["centre"];
		}
	}
	return searchParams;
}
function buildURL(searchParams){
	//var cercadorURL comes from HUGO layout for home page
	if(searchParams!=null){
		var queryString = "?";
		for (var key in searchParams) {
			queryString+=key+"="+searchParams[key]+"&";
		}
		queryString = queryString.substring(0,queryString.length-1);
		cercadorURL += queryString;	
	}
	return cercadorURL;
	
}