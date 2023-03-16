module.exports.log = function(path1,adjacencyObj){
    var V = path1.length;
    var initial_path=[];
    for(var i=0;i<path1.length;i++){
        initial_path.push(path1[i]);
    }

    var A = new Array(V);
    var new_graph = new Array(V);
    for (var i = 0; i < V; i++) { A[i] = new Array(V); new_graph[i] = new Array();}

    for(var i=0;i<V;i++){
        for(var j=0;j<V;j++){
            A[i][j] = adjacencyObj.queryDistanceFromAdjacency(path1[i],path1[j]);
        }
    }

    // now i have a 0 to V-1 node and adjacency matrix for it ---
    function minKey(key, mstSet)
    {
            let min = Number.MAX_VALUE, min_index;
        
            for (let v = 0; v < V; v++){
                if (mstSet[v] == false && key[v] < min){min = key[v], min_index = v;}
            }
            return min_index;
    }

    function makeMST(parent, graph)
    {
        for (let i = 1; i < V; i++){

            new_graph[parent[i]].push(i);
            new_graph[i].push(parent[i]);
            //console.log(parent[i] + "   -  " + i + "     " + graph[i][parent[i]] + "<br>");
        }
    }

function primMST(graph)
{
    let parent = [];
    let key = [];
    let mstSet = [];
    for (let i = 0; i < V; i++){key[i] = Number.MAX_VALUE, mstSet[i] = false;}
    
    key[0] = 0;
    parent[0] = -1; // First node is always root of MST
 
    for (let count = 0; count < V - 1; count++)
    {
        let u = minKey(key, mstSet);

        mstSet[u] = true;

        for (let v = 0; v < V; v++){
            if (graph[u][v] && mstSet[v] == false && graph[u][v] < key[v]) {parent[v] = u, key[v] = graph[u][v];}
        }
    }
 
    // print the constructed MST
    makeMST(parent, graph);
}

primMST(A);
var ans = [];
var visited = new Array(V).fill(0);


function DFS(x){
    ans.push(x);
    for(var i=0;i<new_graph[x].length;i++){
        if(visited[new_graph[x][i]]==0){
            visited[new_graph[x][i]]=1;
            DFS(new_graph[x][i]);
        }
    }
}

var start=0;
visited[start]=1;
DFS(start);
for(var i=0;i<ans.length;i++){ans[i]=initial_path[ans[i]];}
return ans;
}