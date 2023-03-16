// Create connection

class createAdjacencyMatrix {
    constructor(N) {
        this.adjacencyTimeMatrix = new Array(N);
        for (var i = 0; i < N; i++) { this.adjacencyTimeMatrix[i] = new Array(N).fill(0);}
    }

    async Build(lat,lon,db){
        var N=lat.length;
        for(var i=0;i<N;i++){
            for(var j=0;j<N;j++){
                var t = await db.getTimeFromLatLong(lat[i],lon[i],lat[j],lon[j]);
                this.adjacencyTimeMatrix[i][j] = t;
            }
        }
    }
    queryDistanceFromAdjacency(i,j){
        if(this.adjacencyTimeMatrix[i][j]==-1){return 100000;}
        return this.adjacencyTimeMatrix[i][j];
    }


}
module.exports = createAdjacencyMatrix;