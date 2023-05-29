# CS3320-01 Course Project: Malicious Network Black Asset Mining and Visualization

## Frontend

In folder `visualization`.

TBD

## Backend

## Calculate Importance of Node in the Subgraph

In the `node_importance` folder, we provide scripts to compute the centrality measures of nodes in a given network. Specifically, we calculate six different types of centrality measures: **Degree Centrality, Closeness Centrality, Betweenness Centrality, Eigenvector Centrality, PageRank, and Katz Centrality**.

1. Degree Centrality
    Degree centrality is one of the simplest centrality measures, which quantifies the level of connectivity of a node in a network. The degree centrality of a node is defined as the number of connections it has with other nodes. Nodes with higher degree centrality are considered more connected within the network.

    Application: Degree centrality is commonly used to identify nodes that have significant influence in a network. In social networks, highly connected nodes often represent important opinion leaders or information spreaders.

2. Closeness Centrality
    Closeness centrality measures the distance between a node and other nodes in a network. It quantifies how easily a node can reach other nodes based on the average shortest path length.

    Application: Closeness centrality can be used to assess the information flow and influence of a node in a network. Nodes with high closeness centrality are typically more central and have faster access to information and resources.

3. Betweenness Centrality
    Betweenness centrality measures the extent to which a node lies on the shortest paths between pairs of other nodes in the network. It quantifies the node's importance in facilitating communication and information flow between different parts of the network.

    Application: Betweenness centrality is useful for identifying critical nodes that act as bridges or intermediaries between different groups or communities in a network. These nodes play a crucial role in maintaining connectivity and communication between disparate parts of the network.

4. Eigenvector Centrality
    Eigenvector centrality assigns a score to each node based on the concept of "prestige" or "importance." It considers both the node's own centrality and the centrality of its neighbors, assuming that nodes with high centrality are connected to other nodes with high centrality.

    Application: Eigenvector centrality is often used to identify influential nodes that have connections to other influential nodes. It can reveal nodes with a significant impact on the overall network structure and dynamics.

5. PageRank
    PageRank is a centrality measure originally developed by Google for ranking web pages. It assigns scores to nodes based on the principle that nodes are important if they are pointed to by other important nodes. PageRank considers the global structure of the network to determine the importance of a node.

    Application: PageRank is commonly used in web analytics, recommendation systems, and network analysis to identify influential nodes in a network or rank search results based on importance.

6. Katz Centrality
    Katz centrality measures the influence of a node based on the number of paths connecting the node to other nodes in the network. It assigns higher importance to nodes that are connected to other important nodes.

    Application: Katz centrality is useful for identifying nodes that have indirect influence or connections to important nodes. It can capture the cumulative influence of a node's neighbors and their neighbors, revealing hidden influence within a network.

These centrality measures provide valuable insights into the importance and influence of nodes in a network, enabling researchers to understand the structure and dynamics of complex systems.

These measures give different aspects of the "importance" of a node in a network. For example, nodes with high degree centrality are those that are directly connected to many other nodes, while nodes with high betweenness centrality are those that act as bridges between different parts of the network.

The results of these computations are saved in the `/Dataset/out/node_importance` folder. The result for each node is a JSON file named after the node, and the content of each file is a dictionary where the key is the type of the centrality measure and the value is the calculated centrality value. Here is an example of what a file might look like:

```json
{
"Domain_c58c149eec59bb14b0c102a0f303d4c20366926b5c3206555d2937474124beb9": 
{
"degree": 0.007518796992481203,
"closeness": 0.16514247348821304,
"betweenness": 0.001240538532260299,
"eigenvector": 0.0755641040022707,
"pagerank": 0.002149806924500917,
"katz": 0.05006013549623993
},
...
}
```

To read these JSON files in Python, you can use the json library's load function, like this:

```python
import json

with open('/Dataset/out/node_importance/centrality_measures_1.json', 'r') as f:
    centrality_measures = json.load(f)

print(centrality_measures)
```
This script will print a dictionary similar to the one above, showing the centrality measures for `Node_1`.