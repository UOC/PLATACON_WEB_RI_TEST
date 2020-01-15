module.exports = function(){
	var fs = require('fs');
	var path = require('path');

	/**
	 * Loops over a folder and executes a function when a dir is found, a file is found or all is done
	 * @param {String} directory - directory to loop
	 * @param {Function} dirFn - Function to execute when a directory is found
	 * @param {Function} fileFn - Function to execute when a file is found
	 * @param {Function} done - functions that receives params "err" and "message"
	 */
	function fsloop(directory, dirFn, fileFn, done) {
	  if(!done){done=function(){}}	
	  fs.readdir(directory, function(err, list) {
	    if (err) return done(err);
	    var pending = list.length;
	    if (!pending){
	    	return done(null, "ok");
	    }
	    list.forEach(function(file) {
	      file = path.resolve(directory, file);
	      fs.stat(file, function(err, stat) {
	        if (stat && stat.isDirectory()) {
	          if(dirFn){
	          	dirFn(file);
	          }
	          fsloop(file, dirFn, fileFn, function(err, res) {
	            if (!--pending) done(null, "ok");
	          });
	        } else {
	          if(fileFn){
	          	fileFn(file);
	          }
	          if (!--pending) done(null, "ok");
	        }
	      });
	    });
	  });
	}	

	return {
		'fsloop' : fsloop			
	}
}