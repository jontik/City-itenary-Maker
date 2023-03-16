module.exports.log = function(path,imageURL,Category,address,website,places,timeRequired,lat,lon,adjacencyObj,description){
    var res  = {};

    res.time_actual = [];
    res.time_intermediate = [];
    res.images = [];
    res.category = [];
    res.address = [];
    res.website = [];
    res.lat = [];
    res.lon = [];
    res.path=[];
    res.description = [];

    for(var i=0;i<path.length-1;i++){
        res.time_actual.push(timeRequired[path[i]]);
        res.time_intermediate.push( adjacencyObj.queryDistanceFromAdjacency(path[i],path[i+1]));
    }
    res.time_actual.push(timeRequired[path[path.length-1]]);

    for(var i=0;i<path.length;i++){
        res.images.push(imageURL[path[i]]);
        res.category.push(Category[path[i]]);
        res.address.push(address[path[i]]);
        res.website.push(website[path[i]]);
        res.lat.push(lat[path[i]]);
        res.lon.push(lon[path[i]]);
        res.description.push(description[path[i]]);
    }

    
    for(var i=0;i<path.length;i++){path[i]=places[path[i]];}
    res.path = path;

    for(var i=0;i<res.time_actual.length;i++){
        res.time_actual[i]=Math.round(res.time_actual[i]);
    }
    for(var i=0;i<res.time_intermediate.length;i++){
        res.time_intermediate[i] = Math.round(res.time_intermediate[i]);
    }

    return res;

}