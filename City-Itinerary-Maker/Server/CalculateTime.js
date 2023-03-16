module.exports.log = function(path1,adjacencyObj,timeRequired){
    var N = path1.length;
    var t=0;
    for(var i=1;i<N;i++){
            t = t + timeRequired[path1[i]];
            t= t + adjacencyObj.queryDistanceFromAdjacency(path1[i-1],path1[i]);
    }
    return t;
}