# UOC_WebRI

## Start hugo server
````
node ./bin/rename-languages.js
hugo server
````
The script rename-languages.js updates the suffix of files in content, e.g., cercador-ca.md becomes cercador.ca.md

The reason why this is necessary is because NetlifyCMS is not able to save files with suffixes. However, hugo needs the language suffix to generate 
the multi-language static files.

## Stop hugo server 
````
node ./bin/rename-languages.js -
````
WARNING: It's very important to run the previous script before committing any files to the repository.