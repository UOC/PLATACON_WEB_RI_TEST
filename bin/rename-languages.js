/* Renames files to language separator "." or "-".
   If you want to rename to "filname.en.md" then $ node rename-languages.js "." --> hugo compatible --> usually for build
   If you want to rename to "filname-en.md" then $ node rename-languages.js "-" --> netlifycms compatible --> usually for git push
 */

var fsloop = require('./looper')().fsloop;
var fs = require('fs');
var path = require('path');
var siteLanguages = ["ca", "es", "en"];

var destLangSeparator = process.argv[2] || ".";
var langSeparator = destLangSeparator==="." ? "-" : ".";

function renameFile(_old, _new){
  fs.rename(_old, _new, function(err) {
      if(err){
        console.log('Error: ' + err);
      }
  });
}

function languageFiles(file){
  var pos = -1;
  for(var l=0, ls=siteLanguages.length; l<ls; l++){
    pos = file.indexOf(langSeparator+siteLanguages[l]+".md");
    if(pos>-1){
      renameFile(file, file.slice(0,pos)+destLangSeparator+siteLanguages[l]+".md");
    }
  }
}

//loops content folder
fsloop(
  "./content", 
  null,
  function(file){
    languageFiles(file);
  }, 
  function(err, message){
    if(err){
      console.log("error " + err);
      return;
    }
  }
)