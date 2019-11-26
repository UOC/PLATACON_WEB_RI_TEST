
/***********************************************************************
							INIT METHODS								
***********************************************************************/
var recordsPerPage = 3;								//Pagination
var literals = {
	results: {
		noresults: {
			ca : "No s'ha trobat resultats amb els filtres indicats.",
			es : "No se han encontrado resultados con los filtros utilizados.",
			en : "No results found using current filters."
		},
		connectionError: {
			ca : "No s'ha pogut comunicar amb el servei de cerca.",
			es : "No se ha podido comunicar con el servicio de búsqueda",
			en : "No connection could be made since the service is not responding." 
		},
		and: {
			ca : "i ",
			es : "y ",
			en : "and " 
		}
	},
	query : {
		showing: {
			ca : "Mostrant ",
			es : "Mostrando ",
			en : "Showing " 
		},
		results: {
			ca : " resultat(s) ",
			es : " resultado/s ",
			en : " result(s) " 
		},
		matching: {
			ca : "que coincideixen amb ",
			es : "que coinciden con ",
			en : "matching " 
		}
	},
	pagination: {
		next: {
			ca : "Següent",
			es : "Siguiente",
			en : "Next"
		},
		previous: {
			ca : "Anterior",
			es : "Anterior",
			en : "Previous"
		}
	},
	fields : {
		ambit_especialitzacio : {
			ca : "el(s) àmbit(s) d'especialització: ",
			es : "el/los ámbito/s de especialización: ",
			en : "specialized area(s): " 
		},
		ods : {
			ca : "el(s) objectiu(s) ODS: ",
			es : "el/los objetivo/s ODS: ",
			en : "ODS objective(s): " 
		},
		unesco : {
			ca : "el codi UNESCO: ",
			es : "el código UNESCO: ",
			en : "UNESCO code: " 
		},
		centre : {
			ca : "el(s) centre(s): ",
			es : "el/los centro/s: ",
			en : "centre(s): " 
		},
		s: {
			ca : "el text: ",
			es : "el texto: ",
			en : "the following text: "
		}
	}
};
jQuery(document).ready(function ($) {
	searchParams =	{};
	$(".uoc_submitSearch").click(function(e){		
		submitSearch(e);
	});
	$("#collapse-codi input[name='search_sbm']").click(function(e){		
		submitSearch(e);
	});
	$(".cercadorTextual form").submit(function(e){ //Free text search
		e.preventDefault();
		var freeTextQuery= $(".cercadorTextual input#search").val();
		searchParams={
			s: freeTextQuery
		};
		$(".tab.cercadorFiltres h3").click();
		$(".tab.cercadorSectors h3").click();
		querySearchEngine(searchParams);
		
	});
	searchParams=parseQueryString(location.search);
	querySearchEngine(searchParams);				//All results in first load
	console.log('incoming Params :: ',searchParams);
	loadTab2Search(searchParams["target"]);
	$(document).on('click', ".pagination__item", function(e){
		$(".pagination__item").unbind();
		e.stopImmediatePropagation();
		e.preventDefault();
		
	});
	$(document).on('click', ".pagination__item a", function(e){
		$(".pagination__item a").unbind();
		e.stopImmediatePropagation();
		e.preventDefault();

	});
});



/***********************************************************************
							UTILS METHODS								
***********************************************************************/
function parseQueryString(queryString){
	var searchParams = {};
	if(queryString!= null && queryString!=""){
		var pairs = queryString.substring(1, queryString.length).split("&");
		for (var i = 0; i < pairs.length; i++) {
			var param = pairs[i].split("=");
			var key = param[0];
			var val = param[1];
			searchParams[key] = val;
		}
	}
	return searchParams;
}
function getCurrentLanguage(){
	var lang = document.documentElement.lang;
	if(lang == null){
		lang = 'ca';
	}
	return lang;
}

function loadTab2Search(tab){
	console.log('showing tab number...#tab-content-',tab)
	console.log('tab-content',$("div.filters-main__box"));
	var filtersBox = $("div.filters-main__box");
	for(var filter = 0 ; filter <= (filtersBox.length - 1) ;filter ++){
		console.log('filtersBox[filter]-->',filtersBox[filter]);
		if(filter==(tab-1)){
			filtersBox[filter].classList.add("box-green-selected")
		} else {
			filtersBox[filter].classList.remove("box-green-selected")
		}
		console.log('filter-->',filter);
	}
	$("#tab-content-"+tab).show().siblings("div").hide();
}

/***********************************************************************
							FORM METHODS								
***********************************************************************/
function submitSearch(caller){
		if(caller != null){
			caller.preventDefault();	
		}
		getSearchFormValues();
		querySearchEngine(searchParams);
		
		$(".cercadorFiltres .collapse.results").addClass("hidden");						//Hide depending on "visualitza per" options
		for(selector in searchParams.visualitzacio){
			$(".cercadorFiltres .collapse."+searchParams.visualitzacio[selector]).removeClass("hidden");
		}		
}
function getSearchFormValues(){
	searchParams={};
	if($("#collapse-ambits_especialitzacio input:checked").length>0){									//Ambits checked
		searchParams.ambit_especialitzacio = [];
		$("#collapse-ambits_especialitzacio input:checked").each(function( index ) {
			searchParams.ambit_especialitzacio.push($(this).val());
		});	
	}
	if($("#collapse-ods input:checked").length>0){										//Ods checked
		searchParams.ods = [];
		$("#collapse-ods input:checked").each(function( index ) {
			searchParams.ods.push($(this).val());
		});	
	}
	var unescoFreeTextSearch = $("#collapse-codi input[name='searchWords']").val();		//UNESCO Free text search
	if (unescoFreeTextSearch != null && unescoFreeTextSearch != ""){
		searchParams.unesco = unescoFreeTextSearch;
	}
	
	if($(".general-filter.centre input:checked").length>0){								//Centres checked
		searchParams.centre = [];
		$(".general-filter.centre input:checked").each(function( index ) {
			searchParams.centre.push($(this).val());
		});	
	}

	if($(".general-filter.solucions_tecnologiques input:checked").length>0){								//sol_tec checked
		searchParams.solucions_tecnologiques = [];
		$(".general-filter.solucions_tecnologiques input:checked").each(function( index ) {
			searchParams.solucions_tecnologiques.push($(this).val());
		});	
	}

	if($(".general-filter.patents input:checked").length>0){								//patents checked
		searchParams.patents = [];
		$(".general-filter.patents input:checked").each(function( index ) {
			searchParams.patents.push($(this).val());
		});	
	}

	if($(".general-filter.serveis input:checked").length>0){								//serveis checked
		searchParams.serveis = [];
		$(".general-filter.serveis input:checked").each(function( index ) {
			searchParams.serveis.push($(this).val());
		});	
	}

	if($(".general-filter.spin_offs input:checked").length>0){								//spin-offs checked
		searchParams.spin_offs = [];
		$(".general-filter.spin_offs input:checked").each(function( index ) {
			searchParams.spin_offs.push($(this).val());
		});	
	}
	if($(".general-filter.visualitzacio input:checked").length>0){						//Visualitza per checked
		searchParams.visualitzacio = [];
		$(".general-filter.visualitzacio input:checked").each(function( index ) {
			searchParams.visualitzacio.push($(this).val());
		});	
	} else {
		searchParams.visualitzacio = [];
		searchParams.visualitzacio.push("grup");
		searchParams.visualitzacio.push("fitxa");
		searchParams.visualitzacio.push("sol_innov");
		searchParams.visualitzacio.push("spin_offs");
	}
}


/***********************************************************************
							SEARCH METHODS								
***********************************************************************/
function buildQuery(searchParams){
	var endpointURI = "/api/search";
	var queryString = "?idioma="+getCurrentLanguage();									//Mandatory
	for (var key in searchParams) {
		if(searchParams.hasOwnProperty(key)) {
			queryString += "&" + key + "=" +searchParams[key];
		}	
		
	}
	return  endpointURI+queryString;
}
function querySearchEngine(searchParams,target){
	var fitxaResults = $(".fitxaResults .row");
	var grupResults = $(".grupResults .row");
	var fitxaURL = buildQuery(searchParams)+"&tipus=fitxa";
	var grupURL = buildQuery(searchParams)+"&tipus=grup";
	var searchWordsHelperText = "";
	$(".cercadorFiltres .search").text("");
	// Content_type: fitxa
	$.ajax({
		url: fitxaURL,
	}).done(
		function(data, returnCode, request){
			if(data.hits.found == 0){
				fitxaResults.html("<p style='font-style:italic'>"+literals.results.noresults[getCurrentLanguage()]+"</p>");
			} else {
				var items=data.hits.hit;
				var result="";
				for (var i = 0; i < items.length; i++) {
					result+=getResultMarkup(items[i], "fitxa", i);
				}
				result+=getPaginationMarkup(data.hits.found, "fitxa");
				fitxaResults.html(result);
				navigateToPage(1, "fitxa");
				initPagination("fitxa");
				//var searchWordsHelper = $(".cercadorFiltres .search");							//Show filters as text helper
				var lang = getCurrentLanguage();
				//searchWordsHelperText = literals.query.showing[lang] + data.hits.found + literals.query.results[lang];
				
				/*if(Object.keys(searchParams).length){
					searchWordsHelperText += literals.query.matching[lang];	
					for (var key in searchParams) {
						if(searchParams.hasOwnProperty(key) && key != "visualitzacio") {
							literalAux = literals.fields[key];
							searchWordsHelperText += literalAux[lang];
							searchWordsHelperText += searchParams[key];
							searchWordsHelperText += "; ";
						}	
						
					}
				}*/
				
				//searchWordsHelper.text(searchWordsHelperText);
			}
		}
	).fail(function(xhr, textStatus, errorThrown){
		fitxaResults.html("<p style='font-style:italic'>"+literals.results.connectionError[getCurrentLanguage()]+"</p>");
	});

	// Content_type: grup
	$.ajax({
		url: grupURL,
	}).done(
		function(data){
			if(data.hits.found == 0){
				grupResults.html("<p style='font-style:italic'>"+literals.results.noresults[getCurrentLanguage()]+"</p>");
			} else {
				var items=data.hits.hit;
				var result="";
				for (var i = 0; i < items.length; i++) {
					result+=getResultMarkup(items[i], "grup",i);
				}
				result+=getPaginationMarkup(data.hits.found, "grup");
				grupResults.html(result);
				navigateToPage(1, "grup");
				initPagination("grup");
			}
		}
	).fail(function(xhr, textStatus, errorThrown){
		grupResults.html("<p style='font-style:italic'>"+literals.results.connectionError[getCurrentLanguage()]+"</p>");
	});
}
function getResultMarkup(item, content_type, idx){
	var markup='<div class="col-xs-12 col-md-4" id="'+content_type+'Result_'+idx+'">';
	if(content_type == "fitxa"){
			var posicio = item.fields.posicio;
			if(typeof item.fields.posicio === 'undefined'){posicio=""}
			markup+="<a href='"+item.fields.url+"'>"
			markup+='<div id="'+item.id+'" class="card card-people"><div class="card__contents img-wpr"><img src="'+item.fields.imatge_url+'" alt="" class="img-wpr__cover">';
			markup+='<div class="img-wpr__contents"><p class="title">'+item.fields.nom_investigador+'</p>';
			markup+='</div><span class="author">'+posicio+'<span class="description">'+item.fields.entradeta+'</span></span>';
			markup+='</div></div></div></a>';
	} else {
			markup+="<a href='"+item.fields.url+"'>"
			markup+='<div id="'+item.id+'" aria-label="region" class="card card-noimg"><div class="card__contents">';
			markup+='<p class="title">'+item.fields.nom_grup+'</p><p>'+item.fields.descripcio+'</p>';
			markup+='</div></div></a>';
	}
	
	markup+='</div>';
	return markup;
}

/***********************************************************************
							PAGINATION METHODS								
***********************************************************************/
function getPaginationMarkup(totalResults, content_type){
	var markup="";
	if(totalResults>recordsPerPage){
		markup+='<div class="row '+content_type+'Pagination"><div class="col-xs-12">';
		markup+='<ul role="navigation" class="pagination">';
		markup+='<li class="hidden col-xs-12 col-md-3 pagination__item pagination__item--previous"><a href="#" title="Anterior" aria-label="Anterior" rel="previous" class="btn btn--primary">Anterior</a></li>';
		totalPages = totalResults/recordsPerPage + totalResults%recordsPerPage;
		for (var i = 1; i <= totalPages; i++) {
			var isActive = i==1 ? "is-active" : "";
			var columnsToExpand = 1;
			if(i == totalPages){
				columnsToExpand = 9 - (i-1);
			}
			markup+='<li id="Page_'+content_type+'_'+i+'" class="col-md-'+columnsToExpand+' pagination__item '+isActive+'">';
			if(i==1){
				markup+='<span title="Pagina '+i+'" aria-label="Pagina '+i+'" aria-selected="false" class="pagination__link">'+("0" + i).slice(-2)+'</span>';
			} else {
				markup+='<a href="#" title="Pagina '+i+'" aria-label="Pagina '+i+'" aria-selected="false" class="pagination__link">'+("0" + i).slice(-2)+'</a>';
			}
			markup+='</li>';
		}
		markup+='<li class="col-xs-12 col-md-3 pagination__item pagination__item--next"><a href="#" title="Següent" aria-label="Següent" rel="next" class="btn btn--primary">Següent</a></li>';
		markup+='</ul></div></div>';
	}
	return markup;
}

function nextPage(selector){
	var paginationElement = $("."+selector+"Pagination");
	var pageActive = $("."+selector+"Pagination .is-active")[0].id.replace("Page_"+selector+"_", "");
	navigateToPage(Number(pageActive)+1, selector);
}
function previousPage(selector){
	var paginationElement = $("."+selector+"Pagination");
	var pageActive = $("."+selector+"Pagination .is-active")[0].id.replace("Page_"+selector+"_", "");
	navigateToPage(Number(pageActive)-1, selector);
}
function navigateToPage(pageNumber, selector){
	if($("."+selector+"Pagination .is-active").length > 0){
		var currentPage = $("."+selector+"Pagination .is-active")[0].id.replace("Page_"+selector+"_", "");
		var paginationItems = $("."+selector+"Pagination li");
		var pageCount = paginationItems.length - 2;
		if(pageNumber == pageCount){																//Hide "next" button
			$($("."+selector+"Pagination li")[pageCount+1]).addClass("hidden");
			$($("."+selector+"Pagination li")[0]).removeClass("hidden");
		}
		if (pageNumber == 1) {
			$($("."+selector+"Pagination li")[0]).addClass("hidden");								//Hide "Previous" button
			$($("."+selector+"Pagination li")[pageCount+1]).removeClass("hidden");	
		}
		$($("."+selector+"Pagination li")[currentPage]).removeClass("is-active");					//Change active item
		$($("."+selector+"Pagination li")[pageNumber]).addClass("is-active");

		$("[id^="+selector+"Result_]").addClass("hidden");											//Hide all elements before showing good ones
		var lastToShow = recordsPerPage*pageNumber-1;
		for (var i = lastToShow; i >= lastToShow-recordsPerPage+1; i--) {							//Show expected elements
			$("#"+selector+"Result_"+i).removeClass("hidden");
		}
		var oldTargetElement = $($("."+selector+"Pagination li")[pageNumber]).children("a");		//Transform anchor to span
		var newTargetElement = "<span title='"+oldTargetElement.attr("title")+"' aria-label='"+oldTargetElement.attr("aria-label")+"' aria-selected='false' class='pagination__link'>"+oldTargetElement.text()+"</span>";
		oldTargetElement.replaceWith(newTargetElement);
		var oldOriginElement = $($("."+selector+"Pagination li")[currentPage]).children("span");	//Transform span to anchor
		var newOriginElement = "<a href='#' title='"+oldOriginElement.attr("title")+"' aria-label='"+oldOriginElement.attr("aria-label")+"' aria-selected='false' class='pagination__link' onClick='navigateToPage("+currentPage+", \""+selector+"\")'>"+oldOriginElement.text()+"</span>";
		oldOriginElement.replaceWith(newOriginElement);
	}
	
}
function initPagination(content_type){
	if($("."+content_type+"Pagination")){
		var pages = $("."+content_type+"Pagination li");
		for (var i = $("."+content_type+"Pagination li").length - 1; i >= 0; i--) {
			if(i == $("."+content_type+"Pagination li").length-1){								//Next button
				$($("."+content_type+"Pagination li")[i]).attr("onClick", "nextPage('"+content_type+"')");
			} else if(i == 0) {																	//Previous button
				$($("."+content_type+"Pagination li")[i]).attr("onClick", "previousPage('"+content_type+"')");
			} else if(i != 1){																	//Regular buttons
				$($("."+content_type+"Pagination li")[i]).children("a").attr("onClick", "navigateToPage("+i+", '"+content_type+"')");
			}
		}
	}
}