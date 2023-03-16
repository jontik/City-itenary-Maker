module.exports.log = function(rating,timeRequired,time,adjacencyObj,visitedObj,start){
    const satisfaction = require('./satisfaction'); 
    const MINIMUM_FRACTION_OF_TIME_FOR_LAST_PLACE =0.5;
    var result = [];
    if(t<=0){return result;}
    
    var N = rating.length;
    visitedObj.setVisited(start); 
    result.push(start);    

    while(1){
        var next=-1,s=-1;

        for(var i=1;i<N;i++){
            if(visitedObj.is_visited(i)){continue;}
            var t = adjacencyObj.queryDistanceFromAdjacency(start,i);
            if(time > t + MINIMUM_FRACTION_OF_TIME_FOR_LAST_PLACE*timeRequired[i] && s<=satisfaction.log(rating[i],t+timeRequired[i]) ){
                s = satisfaction.log(rating[i],t+timeRequired[i]);
                next = i;
            }
        }
        
        if(next==-1){break;}
        else{
            visitedObj.setVisited(next);
            time=time - adjacencyObj.queryDistanceFromAdjacency(start,next) - timeRequired[next];
            result.push(next);
            start=next;
        }
    }
    return result;
}