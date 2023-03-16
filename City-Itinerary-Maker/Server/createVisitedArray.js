
class createVisitedArray {
    constructor(N) {
        this.visited = new Array(N);
        for(var i=0;i<N;i++){this.visited[i]=0;}
    }

    setVisited(i){
        this.visited[i]=1;
    }

    is_visited(i){
        return this.visited[i];
    }
}
module.exports = createVisitedArray;