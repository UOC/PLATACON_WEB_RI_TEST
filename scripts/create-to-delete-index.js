//1. read previous json from S3 (previous index list)
//   (from public folder) aws s3 cp s3://${BUCKET_S3}/${DEST_FOLDER}/ca/index.json ./ca/previous-index.json  --acl public-read
//2. read current json from public folder after executing hugo (current index list)
//3. Find indexes that were in the previous index list and are no longer in the current index list.
//4. Create list of indexes to delete to push to aws cloudsearch

var fs = require('fs');

//Assumes from public folder
var previousIndexList = JSON.parse(fs.readFileSync('./previous-index.json', 'utf8')); //has been downloaded previously from S3 bucket
var currentIndexList = JSON.parse(fs.readFileSync('./index.json', 'utf8'));


if(previousIndexList && currentIndexList) {

    var toDeleleteIndexList = previousIndexList.filter(o1 => currentIndexList.filter(o2 => o2.id === o1.id).length === 0);
    console.log('There are ' + toDeleleteIndexList.length + ' items to delete');
    
    
    var cloudSearchDeleteList = [];
    
    for(var item of toDeleleteIndexList){
        cloudSearchDeleteList.push({
            type: "delete",
            id: item.id
        })
    }
    
    if(cloudSearchDeleteList.length) {
        var json = JSON.stringify(cloudSearchDeleteList);
        fs.writeFileSync('./index-to-delete.json', json, 'utf8');
    }
    console.log('Finished!');
    
} else {
    console.log('Either previous-index.json or index.json is missing. Skip.');
}







