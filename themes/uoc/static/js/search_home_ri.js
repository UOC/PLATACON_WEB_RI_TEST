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
		window.location = buildURL(searchParams,'cercadorFiltres');
	});
	$(".tab-content.cercaSectors form").on('submit', function(e){
		e.preventDefault();
		searchParams=getFormValues();
		window.location = buildURL(searchParams,'cercadorSectors');
	});
	$(".tab-content.cercaTextual form").on('submit', function(e){
		e.preventDefault();
		searchParams={};
		searchParams.s = $(".tab-content.cercaTextual form input#search").val();
		window.location = buildURL(searchParams,'cercadorTextual');
	});
}
function getFormValues(){
	searchParams={};
	if($(".tab-content.cercaFiltres .tag-list.ambits_especialitzacio .active").length>0){									//Ambits checked
		searchParams.ambit_especialitzacio = [];
		$(".tab-content.cercaFiltres .tag-list.ambits_especialitzacio .active").each(function( index ) {
			console.log('adding value--->',$(this).attr("data-ambit"));
			searchParams.ambit_especialitzacio.push($(this).attr("data-ambit"));
		});	
		if(searchParams.ambit_especialitzacio.includes($($(".tab-content.cercaFiltres .tag-list.ambits_especialitzacio li")[0]).text())){
			delete searchParams["ambit_especialitzacio"];
		}
	}
	if($(".tab-content.cercaFiltres .tag-icons.ods .select-icon").length>0){								//ODS checked
		searchParams.ods = [];
		$(".tab-content.cercaFiltres .tag-icons.ods .select-icon").each(function( index ) {
			console.log('ods:::::',$(this).text());
			searchParams.ods.push($(this).find('#name-ods').text());
		});	
	}
	if($(".tab-content.cercaFiltres select.unesco").val().length>0){											//Unesco code
		searchParams.unesco = $(".tab-content.cercaFiltres select.unesco").val();
	}
	if($(".tab-content.cercaFiltres .tag-list.centre .active").length>0){									//Centres checked
		searchParams.centre = [];
		$(".tab-content.cercaFiltres .tag-list.centre .active").each(function( index ) {
			console.log('adding value--->',$(this).text());
			searchParams.centre.push($(this).text());
		});	
		if(searchParams.centre.includes($($(".tab-content.cercaFiltres .tag-list.centre li")[0]).text())){
			console.log('Deleting search params centre');
			delete searchParams["centre"];
		}
	}
	if($(".tab-content.cercaSectors .tag-list.centre .active").length>0){									//Centres checked
		searchParams.centre = [];
		$(".tab-content.cercaSectors .tag-list.centre .active").each(function( index ) {
			console.log('adding value--->',$(this).text());
			searchParams.centre.push($(this).text());
		});	
		if(searchParams.centre.includes($($(".tab-content.cercaSectors .tag-list.centre li")[0]).text())){
			delete searchParams["centre"];
		}
	}
	if($(".tab-content.cercaSectors .tag-list.sector_productiu .active").length>0){									//sector_productiu checked
		searchParams.sector_productiu = [];
		$(".tab-content.cercaSectors .tag-list.sector_productiu .active").each(function( index ) {
			console.log('adding value--->',$(this).text());
			searchParams.sector_productiu.push($(this).text());
		});	
		if(searchParams.sector_productiu.includes($($(".tab-content.cercaSectors .tag-list.sector_productiu li")[0]).text())){
			delete searchParams["sector_productiu"];
		}
	}
	console.log('gettingFormValues in searchParams in search_home js value...',searchParams);
	return searchParams;
}
function buildURL(searchParams,target){
	//var cercadorURL comes from HUGO layout for home page
	if(searchParams!=null){
		var queryString = "?";
		for (var key in searchParams) {
			queryString+=key+"="+encodeURIComponent(searchParams[key])+"&";
		}
		queryString+="target="+target.trim();
		//queryString = queryString.substring(0,queryString.length-1);		
		cercadorURL += queryString;
		
	}
	return cercadorURL;
}