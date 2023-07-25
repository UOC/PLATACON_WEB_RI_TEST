# UOC_WebRI

## Start hugo server
````
node ./scripts/rename-languages.js
node ./scripts/get-data.js
hugo server
````
The script rename-languages.js updates the suffix of files in content, e.g., cercador-ca.md becomes cercador.ca.md

The script get-data is going to download the required information for some templates.

The reason why this is necessary is because NetlifyCMS is not able to save files with suffixes. However, hugo needs the language suffix to generate 
the multi-language static files.

## Stop hugo server 
````
node ./bin/rename-languages.js -
````
WARNING: It's very important to run the previous script before committing any files to the repository.

## Workarounds

If you edit any CSS included at head.html, it's highly recommended to update the cssVersion parameter at config/_default/config.toml for properly spread CSS changes.