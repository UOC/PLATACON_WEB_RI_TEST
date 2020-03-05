var grups = [];
var grupsSelectOptions = [];
var investigadors = [];
var investigadorsSelectOptions = [];
var plataconApiUrl = "https://transfer-research.am.pre.uoc.es";

// Get Grups from API
fetch( plataconApiUrl + '/api/search?idioma=ca&tipus=grup',
    { 
      method: 'GET',
      mode: 'cors'
    }
)
.then(function(response) {
  return response.text()
})
.then(function(text){
  if(text){
    text.split("\n").map(function(searchResponse){
      let resObj = JSON.parse(searchResponse);
      var grupsResponse = resObj.hits["hit"];
      for (var i=0; i < grupsResponse.length; i++){
        grups.push({
          id: grupsResponse[i].id,
          name: grupsResponse[i].fields.nom_grup,
          description: grupsResponse[i].fields.descripcio,
          url: grupsResponse[i].fields.url,
          url_img: grupsResponse[i].fields.imatge_url
        })
        grupsSelectOptions.push({label: grupsResponse[i].fields.nom_grup, value: grupsResponse[i].id})
      }
    });
  }
})
.catch(function(err){
  console.log(err);
})

// Get Investigadors from API
fetch(plataconApiUrl + '/api/search?idioma=ca&tipus=fitxa',
    { 
      method: 'GET',
      mode: 'cors'
    }
)
.then(function(response) {
  return response.text()
})
.then(function(text){
  if(text){
    text.split("\n").map(function(searchResponse){
      let resObj = JSON.parse(searchResponse);
      var investigadorsResponse = resObj.hits["hit"];
      for (var i=0; i < investigadorsResponse.length; i++){
        investigadors.push({
          id: investigadorsResponse[i].id,
          name: investigadorsResponse[i].fields.nom_investigador,
          url: investigadorsResponse[i].fields.url,
          url_img: investigadorsResponse[i].fields.imatge_url
        })
        investigadorsSelectOptions.push({label: investigadorsResponse[i].fields.nom_investigador, value: investigadorsResponse[i].id})
      }
    });
  }
}); 



// Register Grups Custom List Widget
var GrupsCustomList = createClass({
  render: function() {

    // Get entries list and add the other grup fields (name, description, ...)
    if(this.props.value && this.props.value._tail && this.props.value._tail.array && this.props.value._tail.array.length > 0) {
      var entries = this.props.value._tail.array || [];
      for (var i=0; i < entries.length; i++) {
        if(entries[i] && entries[i]._root && entries[i]._root.entries && entries[i]._root.entries.length > 0) {
          var grupId = entries[i]._root.entries[0][1];
          if(grups.length){
            var grupObjects = grups.filter(obj => {return obj.id === grupId});
            var entriesArray = [];
            entriesArray.push(["id", grupId]);
            entriesArray.push(["name", grupObjects[0].name]);
            entriesArray.push(["description", grupObjects[0].description]);
            entriesArray.push(["url", grupObjects[0].url]);
            entriesArray.push(["url_img", (grupObjects[0].url_img == null || grupObjects[0].url_img == undefined) ? '' : grupObjects[0].url_img ]);
            if(entriesArray.length > 0) {
              this.props.value._tail.array[i]._root.entries = entriesArray;
            }
          }
        }
      }
    }

    //Register list widget
    var ListControl = CMS.getWidget('list').control;
    var listProps = { ...this.props };
    return h(ListControl, {...listProps});
  }
});

CMS.registerWidget('grups_custom_list', GrupsCustomList);


// Register Grups Custom Select Widget
var GrupsCustomSelect = createClass({
  handleChange: function(e) {
    this.props.onChange(e);
  },
  render: function() {
    var SelectControl = CMS.getWidget('select').control;
    var selectProps = { ...this.props };
    //Add groups to options
    selectProps.field = selectProps.field.set('options', grupsSelectOptions);
    selectProps.onChange = this.handleChange;
    // Register Custom Select Widget
    return h(SelectControl, {...selectProps});
  }
});

CMS.registerWidget('grups_custom_select', GrupsCustomSelect);



// Register Investigadors Custom List Widget
var InvestigadorsCustomList = createClass({
  render: function() {

    // Get entries list and add the other grup fields (name, description, ...)
    if(this.props.value && this.props.value._tail && this.props.value._tail.array && this.props.value._tail.array.length > 0) {
      var entries = this.props.value._tail.array || [];
      for (var i=0; i < entries.length; i++) {
        if(entries[i] && entries[i]._root && entries[i]._root.entries && entries[i]._root.entries.length > 0) {
          var investigadorId = entries[i]._root.entries[0][1];
          if(investigadors.length){
            var investigadorObjects = investigadors.filter(obj => {return obj.id === investigadorId});
            var entriesArray = [];
            entriesArray.push(["id", investigadorId]);
            entriesArray.push(["name", investigadorObjects[0].name]);
            entriesArray.push(["url", investigadorObjects[0].url]);
            entriesArray.push(["url_img", (investigadorObjects[0].url_img == null || investigadorObjects[0].url_img == undefined) ? '' : investigadorObjects[0].url_img ]);
            if(entriesArray.length > 0) {
              this.props.value._tail.array[i]._root.entries = entriesArray;
            }
          }
        }
      }
    }

    //Register list widget
    var ListControl = CMS.getWidget('list').control;
    var listProps = { ...this.props };
    return h(ListControl, {...listProps});
  }
});

CMS.registerWidget('investigadors_custom_list', InvestigadorsCustomList);




// Register Investigadors Custom Select Widget
var InvestigadorsCustomSelect = createClass({
  handleChange: function(e) {
    this.props.onChange(e);
  },
  render: function() {
    var SelectControl = CMS.getWidget('select').control;
    var selectProps = { ...this.props };
    //Add groups to options
    selectProps.field = selectProps.field.set('options', investigadorsSelectOptions);
    selectProps.onChange = this.handleChange;
    // Register Custom Select Widget
    return h(SelectControl, {...selectProps});
  }
});

CMS.registerWidget('investigadors_custom_select', InvestigadorsCustomSelect);
