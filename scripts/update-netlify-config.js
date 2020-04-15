const fs = require('fs');
const yaml = require('js-yaml');

try {
    //Load yml file
    let config = fs.readFileSync('./public/admin/config.yml', 'utf8');
    let data = yaml.safeLoad(config);

    //Set values
    if(process.env.GITHUB_REPO) data.backend.repo = process.env.GITHUB_REPO;
    if(process.env.BASE_URL) data.base_url = process.env.BASE_URL;

    //Save file
    let yamlStr = yaml.safeDump(data);
    fs.writeFileSync('./public/admin/config.yml', yamlStr, 'utf8');

} catch (e) {
    console.log(e);
}