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
		//console.log(buildURL(searchParams,'cercadorFiltres'));
	});
	$(".tab-content.cercaSectors form").on('submit', function(e){
		e.preventDefault();
		searchParams=getFormValues();
		window.location = buildURL(searchParams,'cercadorSectors');
		//console.log(buildURL(searchParams,'cercadorSectors'));
	});
	$(".tab-content.cercaTextual form").on('submit', function(e){
		e.preventDefault();
		searchParams={};
		searchParams.s = $(".tab-content.cercaTextual form input#search").val();
		window.location = buildURL(searchParams,'cercadorTextual');
		//console.log(buildURL(searchParams,'cercadorTextual'));

	});
}
function getFormValues(){
	searchParams={};
	if($(".tab-content.cercaFiltres").is(":visible")) {
		if($(".tab-content.cercaFiltres .tag-list.ambits_especialitzacio .active").length>0){									//Ambits checked
			searchParams.ambit_especialitzacio = [];
			$(".tab-content.cercaFiltres .tag-list.ambits_especialitzacio .active").each(function( index ) {
				console.log('adding value--->',$(this).attr("data-ambit"));
				searchParams.ambit_especialitzacio.push($(this).attr("data-ambit"));
			});
			if(searchParams.ambit_especialitzacio.includes($($(".tab-content.cercaFiltres .tag-list.ambits_especialitzacio li")[0]).attr("data-ambit"))){
				delete searchParams["ambit_especialitzacio"];
				searchParams.form_all_ambits_selected = true;
			}
		}
		if($(".tab-content.cercaFiltres .tag-icons.ods .select-icon").length>0){								//ODS checked
			searchParams.ods = [];
			$(".tab-content.cercaFiltres .tag-icons.ods .select-icon").each(function( index ) {
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
		}
	} else if($(".tab-content.cercaSectors").is(":visible")) {
		if($(".tab-content.cercaSectors .tag-list.centre .active").length>0){									//Centres checked
			searchParams.centre = [];
			$(".tab-content.cercaSectors .tag-list.centre .active").each(function( index ) {
				console.log('adding value--->',$(this).text());
				searchParams.centre.push($(this).text());
			});
		}
		if($(".tab-content.cercaSectors .tag-list.sector_productiu .active").length>0){									//sector_productiu checked
			searchParams.sector_productiu = [];
			$(".tab-content.cercaSectors .tag-list.sector_productiu .active").each(function( index ) {
				console.log('adding value--->',$(this).text());
				searchParams.sector_productiu.push($(this).text());
			});
		}
	}
	console.log('gettingFormValues in searchParams in search_home js value...',searchParams);
	return searchParams;
}
function buildURL(searchParams,target){
	//var cercadorURL comes from HUGO layout for home page
	if(searchParams!=null){
		searchParams.target = target.trim();
		var queryString="?s="+encodeURIComponent(JSON.stringify(searchParams));
		cercadorURL += queryString;		
	}
	return cercadorURL;
}