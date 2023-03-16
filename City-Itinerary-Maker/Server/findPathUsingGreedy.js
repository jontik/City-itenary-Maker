module.exports.log = async function(rating,lat,lon,timeRequired,time,db){
    const satisfaction = require('./satisfaction'); 
    const MINIMUM_FRACTION_OF_TIME_FOR_LAST_PLACE =0.5;
    var result = [0];
    console.log("Hello World" );
    var N = rating.length;
async function FindPath(rating,lat,lon,timeRequired,time,adjacencyTimeMatrix){
    // Create a fully connected graph----
    result=[0];
    console.log(time);
    

    // fill adjacency matrix---
    for(var i=0;i<N;i++){
        for(var j=0;j<N;j++){
            var t = await db.getTimeFromLatLong(lat[i],lon[i],lat[j],lon[j]);
            if(t==-1.0){t=100000;}
            adjacencyTimeMatrix[i][j] = t;
        }
    }

    // Make visited Matrix----
    var visited = new Array(N).fill(0);
    var start=0;
    visited[start]=1;
    
    while(1){
        var next=-1,s=-1;
        for(var i=1;i<N;i++){
            if(visited[i]){continue;}
            if(time > adjacencyTimeMatrix[start][i] + MINIMUM_FRACTION_OF_TIME_FOR_LAST_PLACE*timeRequired[i] && s<=satisfaction.log(rating[i],adjacencyTimeMatrix[start][i]+timeRequired[i]) ){
                s = satisfaction.log(rating[i],adjacencyTimeMatrix[start][i]+timeRequired[i]);
                next = i;
            }
        }
        // console.log(next);
        // console.log("time is ",time);
        if(next==-1){break;}
        else{
            visited[next]=1;
            time=time - adjacencyTimeMatrix[start][next] - timeRequired[next];
            result.push(next);
            start=next;
        }
    }
    return result;
}

function returnFormat(path,timeRequired,lat,lon,adjacencyTimeMatrix){
    time_actual = [];
    time_intermediate = [];
    for(var i=0;i<path.length-1;i++){
        time_actual.push(timeRequired[path[i]]);
        time_intermediate.push(adjacencyTimeMatrix[path[i]][path[i+1]]);
    }

    time_actual.push(timeRequired[path[path.length-1]]);


    
    for(var i=0;i<time_actual.length;i++){
        time_actual[i]=Math.round(time_actual[i]);
    }
    for(var i=0;i<time_intermediate.length;i++){
        time_intermediate[i] = Math.round(time_intermediate[i]);
    }

    return {path,time_actual,time_intermediate};
}



// make Adjacency Matrix----
var adjacencyTimeMatrix = new Array(N);
for (var i = 0; i < N; i++) { adjacencyTimeMatrix[i] = new Array(N).fill(0);}
var path = await FindPath(rating,lat,lon,timeRequired,time,adjacencyTimeMatrix);
return returnFormat(path,timeRequired,lat,lon,adjacencyTimeMatrix);

}