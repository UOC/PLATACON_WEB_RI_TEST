
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
		console.log('submitSearch for all filter...')	
		submitSearch(e);
	});
	$("#collapse-codi input[name='search_sbm']").click(function(e){	
		console.log('submitSearch for codi...')	
		submitSearch(e);
	});
	$(".cercadorTextual form").submit(function(e){ //Free text search
		e.preventDefault();
		console.log('submitSearch for keywords...')	
		var freeTextQuery= $(".cercadorTextual input#search").val();
		searchParams={
			s: freeTextQuery
		};
		settingTabParams();
		//$(".tab.cercadorFiltres h3").click();
		//$(".tab.cercadorSectors h3").click();
		querySearchEngine(searchParams);
		
	});
	searchParams=parseQueryString(location.search);
	console.log('incoming Params :: ',searchParams);
	settingTabParams();
	if(searchParams["target"]!= '3') querySearchEngine(searchParams);				//All results in first load
	//console.log('incoming Params after SS :: ',searchParams);
	$(document).on('click', ".pagination__item", function(e){
		console.log('$(".pagination__item").unbind() ',$(".pagination__item").unbind());
		$(".pagination__item").unbind();
		e.stopImmediatePropagation();
		e.preventDefault();
		
	});
	$(document).on('click', ".pagination__item a", function(e){
		console.log('$(".pagination__item a").unbind(); ',$(".pagination__item a").unbind());
		$(".pagination__item a").unbind();
		e.stopImmediatePropagation();
		e.preventDefault();

	});

	$('.filters-main__box').on('click', '.tab', function() {
		//console.log('clicking box--->',$(this)[0])
		//$(this).focus();
        settingTabParams();
		if(searchParams["target"]!='3') querySearchEngine(searchParams);
	});

});

function settingTabParams(){	
	searchParams["target"] = sessionStorage.getItem("target");
	resetListAndPaginationValues();
	loadTab2Search(searchParams["target"] ? searchParams["target"] : 1);
	//getSearchFormValues();
	setFilterValues(searchParams);
}

function resetListAndPaginationValues(){
	var fitxaResults = $(".fitxaResults .row");
	var grupResults = $(".grupResults .row");
	var solucionsTecResults = $(".solucionsTecResults .row");
	var patentsResults = $(".patentsResults .row");
	var serveisResults = $(" .serveisResults .row");
	var spinResults = $(" .spinResults .row");
	var results = [fitxaResults,grupResults,solucionsTecResults,patentsResults,serveisResults,spinResults];
	for(var r=0;r<(results.length);r++){
		
		for(var _r = 0; _r<results[r].length; _r++){
			if(results[r][_r].children.length > 0){
				console.log('reset before....',results[r]);
				console.log('children ------> ',results[r][_r].children);
				//results[r].innerHTML = '';
				console.log('reset after....',results[r].innerHTML);
				//delete results[r][_r].children;	
			} //delete results[r][_r].children;
		}
		//console.log('reseting....',results[r][_r]);
	}
}
/***********************************************************************
							UTILS METHODS								
***********************************************************************/
function parseQueryString(queryString){
	var searchParams = {};
	if(queryString!= null && queryString!=""){
		var pairs = queryString.substring(1, queryString.length).split("&");
		for (var i = 0; i < pairs.length; i++) {
			var param = pairs[i].split("=");
			var key = decodeURIComponent(param[0]);
			var val = decodeURIComponent(param[1]);
			searchParams[key] = val;
		}
	}
	searchParams["target"] = sessionStorage.getItem("target")? sessionStorage.getItem("target") : '1';
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
	//console.log('showing tab number...#tab-content-',tab)
	//console.log('tab-content',$("div.filters-main__box"));
	var filtersBox = $("div.filters-main__box");
	for(var filter = 0 ; filter <= (filtersBox.length - 1) ;filter ++){
		//console.log('filtersBox[filter]-->',filtersBox[filter]);
		if(filter==(tab-1)){
			filtersBox[filter].classList.add("box-green-selected")
		} else {
			filtersBox[filter].classList.remove("box-green-selected")
		}
		//console.log('filter-->',filter);
	}
	$("#tab-content-"+tab).show().siblings("div").hide();
	$("#tab-content-"+tab).focus();
	//sessionStorage.setItem("target",tab);
	//reseting target param url
	//location.href.replace(/(target=).*?(&)/,'$1' + tab + '$2');
    
}

function setFilterValues(params){
	var all =  true;
	var gr = true,inv = true,sols_innov = true,spin_off = true;
	console.log('paramsssssss->>>>>>>',params);
	if(params.visualitzacio && params.visualitzacio.length > 0){
		var visualitzacio = params.visualitzacio;
		for(v=0;v>visualitzacio.length;v++){

			$(".general-filter.visualitzacio input").each(function(ev){
				console.log('having visualitzacio per init value--->',$(this))
				if($(this).attr("value")==visualitzacio[v]) {
					$(this).attr("checked",true);
					//añadir visualizar por, según valores, mostrar/esconder listas
				} 
			});
		}
		all=false;
	} else {
		$("input[id*='visual']").each(function(e){
			//console.log('inpuuuuuuuuuuuut--->',event);
			console.log($(this))
			$(this).attr("checked",true);
		});
	}

	switch (params["target"]? params["target"]: '1'){
		case '1':
			console.log('printing filter view for grups or investigadors!!')
			if(params.ambit_especialitzacio && params.ambit_especialitzacio.length > 0){
				var ambits = typeof params.ambit_especialitzacio != 'string' ? params.ambit_especialitzacio : params.ambit_especialitzacio.split(",");
				for(var a=0;a<ambits.length;a++){
					var inputId = "input[id='" + ambits[a] + "']";
					console.log('input ambits 2 check-->',inputId);
					$(inputId).attr("checked",true);
					//$(inputId).attr("checked",true);
				}
			}
			if(params.ods && params.ods.length > 0){

				var ods = params.ods.split(",");
				for(var o=0;o<ods.length;o++){
					var inputId = "input[id='" + ods[o] + "']";
					console.log('input ods 2 check-->',inputId);
					$(inputId).attr("checked",true);
				}

			}

			if(params.unesco && params.unesco.length > 0) $("#collapse-codi input[name='searchWords']").val() = params.unesco;

			if(params.centre && params.centre.length > 0){
				var centres = params.centre.split(",");
				for(var c=0;c<centres.length;c++){
					var inputId = "input[id='"+centres[c]+"']";
					console.log('input centre 2 check-->',inputId);
					$(inputId).attr("checked",true);
				}
			}

			break;
		case '2':
			console.log('printing filter view for solucions innovadores or spin-offs!!')
			if(params.sector_productiu && params.sector_productiu.length > 0){
				var sectors = params.sector_productiu.split(",");
				console.log('sectors--->',sectors);
				for(var s=0;s<sectors.length;s++){
					var inputId = "input[id='"+sectors[s] + "']";
					console.log('input sectors 2 check-->',inputId);
					$(inputId).attr("checked",true);
				}
			}
			

			if(params.centre && params.centre.length > 0){
				var centres = params.centre.split(",");
				for(var c=0;c<centres.length;c++){
					var inputId = "input[id='"+centres[c]+"']";
					console.log('input centre 2 check-->',inputId);
					$(inputId).attr("checked",true);
				}
			
			}
			break;
		case '3':
			if(params.s && params.s.length) {
				console.log('input search -->',$("input[id='search']"));
				$("input[id='search']").each(function(k){
					$(this).attr("value",params.s);
				});
			}
			break;
		default:
			break;

	}

}

/***********************************************************************
							FORM METHODS								
***********************************************************************/
function submitSearch(caller){
	console.log('submitsearch caller ---->',caller);
		if(caller != null){
			caller.preventDefault();	
		}
		getSearchFormValues();
		settingTabParams();
		querySearchEngine(searchParams);
		
		// $(".cercadorFiltres .collapse.results").addClass("hidden");						//Hide depending on "visualitza per" options
		// for(selector in searchParams.visualitzacio){
		// 	$(".cercadorFiltres .collapse."+searchParams.visualitzacio[selector]).removeClass("hidden");
		// }		
}
function getSearchFormValues(){
	var target = searchParams["target"];
	console.log('searchParams--->',searchParams)
	searchParams={
		ambit_especialitzacio : "",
		ods:"",
		codi:"",
		sector_productiu:"",
		centre:"",
		s:""
	};

	switch(target){
		case '1':

			if($("#collapse-ambits_especialitzacio input:checked").length>0){									//Ambits checked
				//searchParams.ambit_especialitzacio = [];
				var ambits = [];
				$("#collapse-ambits_especialitzacio input:checked").each(function( index ) {
					if($(this).val()!=undefined){
						if(searchParams.ambit_especialitzacio != "") searchParams.ambit_especialitzacio += ',' + $(this).val();
						else searchParams.ambit_especialitzacio += $(this).val();
					}
				});	
			} else {
				searchParams.ambit_especialitzacio = "";
			}

			if($("#collapse-ods input:checked").length>0){										//Ods checked
				//searchParams.ods = [];
				$("#collapse-ods input:checked").each(function( index ) {
					//searchParams.ods.push($(this).val());
					if($(this).val()!=undefined){
						if(searchParams.ods != "") searchParams.ods += ',' + $(this).val();
						else searchParams.ods += $(this).val();
					}
					
				});	
			} else {
				searchParams.ods = "";
			}

			var unescoFreeTextSearch = $("#collapse-codi input[name='searchWords']").val();		//UNESCO Free text search
			if (unescoFreeTextSearch != null && unescoFreeTextSearch != ""){
				searchParams.unesco = unescoFreeTextSearch;
			} else {
				searchParams.unesco = "";
			}
			
			if($(".general-filter.centre input:checked").length>0){								//Centres checked
				//searchParams.centre = [];
				$(".general-filter.centre input:checked").each(function( index ) {
					//searchParams.centre.push($(this).val());
					if($(this).val()!=undefined){
						if(searchParams.centre != "") searchParams.centre += ',' + $(this).val();
						else searchParams.centre += $(this).val();
					}
					
				});	
			} else {
				searchParams.centre = "";
			}
			break;
		case '2':
			if($("#collapse-sector_productiu input:checked").length>0){								//sol_tec checked
				//searchParams.solucions_tecnologiques = [];
				$("#collapse-sector_productiu input:checked").each(function( index ) {
					//searchParams.sector_productiu.push($(this).val());
					console.log($(this).val())
					if($(this).val()!= undefined){
						if(searchParams.sector_productiu != "") searchParams.sector_productiu += ',' + $(this).val();
						else searchParams.sector_productiu += $(this).val();
					}
					
				});	
			} else {
				searchParams.sector_productiu = "";
			}

			if($(".general-filter.centre input:checked").length>0){								//Centres checked
				//searchParams.centre = [];
				$(".general-filter.centre input:checked").each(function( index ) {
					//searchParams.centre.push($(this).val());
					if($(this).val()!=undefined){
						if(searchParams.centre != "") searchParams.centre += ',' + $(this).val();
						else searchParams.centre += $(this).val();
					}
					
				});	
			} else {
				searchParams.centre = "";
			}
		
			break;
		default:
			break;
	}
	
	if($(".general-filter.visualitzacio input:checked").length>0){						//Visualitza per checked
		searchParams.visualitzacio = "";
		$(".general-filter.visualitzacio input:checked").each(function( index ) {
			//searchParams.visualitzacio.push($(this).val());
			console.log('checked')
			if(index<4){
				if(searchParams.visualitzacio != "") searchParams.visualitzacio += ',' + $(this).val();
				else searchParams.visualitzacio += $(this).val();
			}
			
		});	
	} else {
		searchParams.visualitzacio = "grup,fitxa,sol_innov,spin_offs";
	}

	console.log('searchParams created for search ::', searchParams);
}


/***********************************************************************
							SEARCH METHODS								
***********************************************************************/
function buildQuery(endpointUrl,searchParams){
	var endpointURI =  endpointUrl;
	var queryString = "?idioma="+getCurrentLanguage();									//Mandatory
	for (var key in searchParams) {
		if(searchParams.hasOwnProperty(key) && (key != "target") && (searchParams[key]!="")) {
			queryString += "&" + key + "=" +encodeURIComponent(searchParams[key]);
		}
	}
	return  endpointURI+queryString;
}

function buildAjaxQueryCallout2GrupOrFitxaAndProcessResultsFromCloudSearch(queryUrl,results, type){
	console.log('querying...',queryUrl);
	$.ajax({
		url: queryUrl
	}).done(
		function(data, returnCode, request){
			console.log('returning code----->',returnCode);
			console.log('returning request----->',request);
			console.log('returning data Investigadors>',data);
			if(data.hits.found == 0){
				results.html("<p style='font-style:italic'>"+literals.results.noresults[getCurrentLanguage()]+"</p>");
			} else {
				var items=data.hits.hit;
				var result="";
				for (var i = 0; i < items.length; i++) {
					result+=getResultMarkup(items[i], type, i);
				}
				result+=getPaginationMarkup(data.hits.found, type);
				results.html(result);
				navigateToPage(1, type);
				initPagination(type);
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
		console.log(xhr);
		console.log(textStatus);
		console.log(errorThrown)
		results.html("<p style='font-style:italic'>"+literals.results.connectionError[getCurrentLanguage()]+"</p>");
	});
}

function buildAjaxQueryCallout2TransfersAndProcessResultsFromCloudSearch(queryUrl,results,type){

	console.log('querying...',queryUrl);
	$.ajax({
		url: queryUrl,
		type: 'GET'
	}).done(
		function(data, returnCode, request){
			console.log('returning code----->',returnCode);
			console.log('returning request----->',request);
			console.log('returning data----->',data);
			// var contentTypes = ['grup','fitxa','solucio_tec','patent','servei','spin_off'];
			// if(data.hits.found == 0){
			// 	for(var r=0;r<res.length-1;r++){
			// 		res[r].html("<p style='font-style:italic'>"+literals.results.noresults[getCurrentLanguage()]+"</p>");
			// 	}
			// } else {
			// 	var items=data.hits.hit;
			// 	for(var r=0;r<res.length-1;r++){
			// 		var result="";
			// 		var type = ""
			// 		for (var i = 0; i < items.length; i++) {
			// 			if(type!=items[i].content_type)
			// 			result+=getResultMarkup(items[i], items[i].content_type, i);
			// 		}
			// 		result+=getPaginationMarkup(data.hits.found, type);
			// 		res[r].html(result);
			// 		navigateToPage(1, type);
			// 		initPagination(type);

			// 	}
				
			// 	//var searchWordsHelper = $(".cercadorFiltres .search");							//Show filters as text helper
			// 	var lang = getCurrentLanguage();
			// 	//searchWordsHelperText = literals.query.showing[lang] + data.hits.found + literals.query.results[lang];
				
			// 	/*if(Object.keys(searchParams).length){
			// 		searchWordsHelperText += literals.query.matching[lang];	
			// 		for (var key in searchParams) {
			// 			if(searchParams.hasOwnProperty(key) && key != "visualitzacio") {
			// 				literalAux = literals.fields[key];
			// 				searchWordsHelperText += literalAux[lang];
			// 				searchWordsHelperText += searchParams[key];
			// 				searchWordsHelperText += "; ";
			// 			}	
						
			// 		}
			// 	}*/
				
			// 	//searchWordsHelper.text(searchWordsHelperText);
			// }
		}
	).fail(function(xhr, textStatus, errorThrown){
		console.log(xhr);
		console.log(textStatus);
		console.log(errorThrown)
		//results.html("<p style='font-style:italic'>"+literals.results.connectionError[getCurrentLanguage()]+"</p>");
	});
}

function buildAjaxQueryCallout2SearchInnovativeSolutions(queryUrl,results,type){
	var solucionsTecResults = $(".solucionsTecResults .row");
	var patentsResults = $(".solucionsPatentsResults .row");
	var serveisResults = $(" .solucionsServeissResults .row");
	var spinResults = $(" .spinResults .row");
	console.log('querying...SolucionsInnovadores',queryUrl);
	$.ajax({
		url: queryUrl,
		type:'GET'
	}).done(
		function(data, returnCode, request){
			console.log('returning code----->',returnCode);
			console.log('returning request----->',request);
			console.log('returningSolucionsInnovadores----->',data);
			var lista=["solucio_tec","patent","servei","spin_off"];
			var solucio_tec=[];
			var patent=[];
			var servei=[];
			var spin_off=[];
			var items=data.hits.hit;
			for(var i =0;i < items.length;i++){
				var content_type=JSON.stringify(items[i].fields.content_type[0]);
				content_type=content_type.replace(/["']/g, "")
				if(lista.includes(content_type)){
					console.log('item compleix condicio',items[i]);
					switch(lista.indexOf(content_type)){
						case 0:
							solucio_tec.push(items[i]);
							break;
						case 1:
							patent.push(items[i]);
							break;
						case 2:
							servei.push(items[i]);
							break;
						case 3:
							spin_off.push(items[i]);
						default:
							break;
					}

				}
			}
			var resultPatent="";
			var resultSolTec="";
			var resultServei="";
			var resultSpinoff="";

			if(patent.length == 0){
				patentsResults.html("<p style='font-style:italic'>" + literals.results.noresults[getCurrentLanguage()] + "</p>");
			}else{
				for(var i=0; i<patent.length;i++){
					resultPatent+=getResultMarkup(patent[i],"patent",i);
				}
				patentsResults.html(resultPatent)
			}

			if(servei.length == 0){
				serveisResults.html("<p style='font-style:italic'>" + literals.results.noresults[getCurrentLanguage()] + "</p>");
			}else{
				for(var i=0; i<servei.length;i++){
					resultServei+=getResultMarkup(servei[i],"servei",i);
				}
				serveisResults.html(resultServei);
			}

			if(solucio_tec.length == 0){
				solucionsTecResults.html("<p style='font-style:italic'>" + literals.results.noresults[getCurrentLanguage()] + "</p>");
			}else{
				for(var i=0; i<solucio_tec.length;i++){
					resultSolTec+=getResultMarkup(solucio_tec[i],"solucio_tec",i);
				}
				solucionsTecResults.html(resultSolTec);
			}

			if(spin_off.length == 0){
				spinResults.html("<p style='font-style:italic'>" + literals.results.noresults[getCurrentLanguage()] + "</p>");
			}else{
				for(var i=0; i<spin_off.length;i++){
					resultSpinoff+=getResultMarkup(spin_off[i],"spin_off",i);
				}
				spinResults.html(resultSpinoff);
			}
			console.log("MIDES",servei.length,",",patent.length);

		}

	).fail(function(xhr, textStatus, errorThrown){
		console.log(xhr);
		console.log(textStatus);
		console.log(errorThrown)
		results.html("<p style='font-style:italic'>"+literals.results.connectionError[getCurrentLanguage()]+"</p>");
	});
}

function querySearchEngine(searchParams){
	
	var searchWordsHelperText = "";
	$(".cercadorFiltres .search").text("");
	// Content_type: fitxa
	console.log('switching ... || searchParams[target] = ',searchParams["target"], '|| ');
	console.log('searchParams = ',searchParams);
	switch(searchParams["target"]? searchParams["target"] : '1'){
		case '1' :
			console.log('calling fitxa or grup results...');
			var fitxaResults = $(".fitxaResults .row");
			var grupResults = $(".grupResults .row");
			var endpointUrl = "https://transfer-research.am.pre.uoc.es/api/search";
			var fitxaURL = buildQuery(endpointUrl,searchParams)+"&tipus=fitxa";
			var grupURL = buildQuery(endpointUrl,searchParams)+"&tipus=grup";
			buildAjaxQueryCallout2GrupOrFitxaAndProcessResultsFromCloudSearch(fitxaURL,fitxaResults, "fitxa");
			buildAjaxQueryCallout2GrupOrFitxaAndProcessResultsFromCloudSearch(grupURL,grupResults, "grup");
			break;
		case '2' :
			console.log('calling transfer results...');
			//var endpointUrl = "http://search-webri-2dz3yckt2f5cjq7hcsbois6nw4.eu-west-1.cloudsearch.amazonaws.com/2013-01-01/search";
			var endpointUrl = "https://hhbr3knf8j.execute-api.eu-west-1.amazonaws.com/dev/public/search";
			var transferURL = buildQuery(endpointUrl,searchParams);
			buildAjaxQueryCallout2TransfersAndProcessResultsFromCloudSearch(transferURL);
			break;
		case '3' :
			console.log('calling text results...');
			var fitxaResults = $(".fitxaResults .row");
			var grupResults = $(".grupResults .row");
			//var endpointUrlAl = "http://search-webri-2dz3yckt2f5cjq7hcsbois6nw4.eu-west-1.cloudsearch.amazonaws.com/2013-01-01/search";
			var endpointUrlAl = "https://transfer-research.am.pre.uoc.es/api/search";
			var endpointUrlUoc = "https://transfer-research.am.pre.uoc.es/api/search";
			var endpointUrlUocInnovSol = 'https://hhbr3knf8j.execute-api.eu-west-1.amazonaws.com/dev/public/search';
			var fitxaURL = buildQuery(endpointUrlUoc,searchParams)+"&tipus=fitxa";
			var grupURL = buildQuery(endpointUrlUoc,searchParams)+"&tipus=grup";
			var transferURL = buildQuery(endpointUrlAl,searchParams)+"&tipus=transfer";
			var innovSolUrl = buildQuery(endpointUrlUocInnovSol,searchParams);
			buildAjaxQueryCallout2GrupOrFitxaAndProcessResultsFromCloudSearch(fitxaURL,fitxaResults, "fitxa");
			buildAjaxQueryCallout2GrupOrFitxaAndProcessResultsFromCloudSearch(grupURL,grupResults, "grup");
			buildAjaxQueryCallout2TransfersAndProcessResultsFromCloudSearch(transferURL);
			buildAjaxQueryCallout2SearchInnovativeSolutions(innovSolUrl);
			break;
		default:
			break;
	}

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
	} else if(content_type == "grup"){
			markup+="<a href='"+item.fields.url+"'>"
			markup+='<div id="'+item.id+'" aria-label="region" class="card card-noimg"><div class="card__contents">';
			markup+='<p class="title">'+item.fields.nom_grup+'</p><p>'+item.fields.descripcio+'</p>';
			markup+='</div></div></a>';
	} else if(content_type == "patent") { // sols_tec, patent, servei, spin-off print view

			markup+="<a href='"+item.fields.url+"'>"
			markup+='<div id="'+item.id+'"  class="card card-people"><div class="card__contents img-wpr"><img src="'+item.fields.imatge_url+'" alt="" class="img-wpr__cover">';
			markup+='<div class="img-wpr__contents"><p class="title">'+item.fields.name+'</p>';
			markup+='</div></div></div></a>';
	}
	else if(content_type == "servei") {

		markup+="<a href='"+item.fields.url+"'>"
		markup+='<div id="'+item.id+'"  class="card card-people"><div class="card__contents img-wpr"><img src="'+item.fields.imatge_url+'" alt="" class="img-wpr__cover">';
		markup+='<div class="img-wpr__contents"><p class="title">'+item.fields.name+'</p>';
		markup+='</div></div></div></a>';
	}
	else if(content_type == "solucio_tec") {

		markup+="<a href='"+item.fields.url+"'>"
		markup+='<div id="'+item.id+'"  class="card card-people"><div class="card__contents img-wpr"><img src="'+item.fields.imatge_url+'" alt="" class="img-wpr__cover">';
		markup+='<div class="img-wpr__contents"><p class="title">'+item.fields.name+'</p>';
		markup+='</div></div></div></a>';
	}
	else if(content_type == "spin_off") {

		markup+="<a href='"+item.fields.url+"'>"
		markup+='<div id="'+item.id+'"  class="card card-people"><div class="card__contents img-wpr"><img src="'+item.fields.imatge_url+'" alt="" class="img-wpr__cover">';
		markup+='<div class="img-wpr__contents"><p class="title">'+item.fields.name+'</p>';
		markup+='</div></div></div></a>';
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
	console.log('selector for html elements---> ',selector);
	$('[class*=pagination__item]').click(function(e) {
		console.log('jump prevented');
		e.preventDefault();   //prevent the click from jumping esp on hashes
		e.stopPropagation();  //prevent from any parent click handlers that didn't prevent the jump
	
	
		return false;         //the natural way to prevent the jump
	});
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
		$('[class*=pagination__item]').click(function(e) {
			console.log('jump prevented');
			e.preventDefault();   //prevent the click from jumping esp on hashes
			e.stopPropagation();  //prevent from any parent click handlers that didn't prevent the jump
		
		
			return false;         //the natural way to prevent the jump
		});
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



