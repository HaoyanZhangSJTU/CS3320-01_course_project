import pandas as pd
import csv
import networkx as nx
import json

def compute_all_centrality_measures(graph):
    """
    度中心性（Degree Centrality）：一个节点的度中心性越高，说明它直接连接的节点越多，可能具有较大的影响力。

    接近中心性（Closeness Centrality）：一个节点的接近中心性越高，说明它到网络中其他节点的平均距离越短，可以更快地影响到其他节点。

    介数中心性（Betweenness Centrality）：一个节点的介数中心性越高，说明它在网络中的其他两个节点之间的最短路径中出现的次数越多，表示该节点在网络中的控制力或者说“媒介”作用越大。

    特征向量中心性（Eigenvector Centrality）：一个节点的特征向量中心性越高，说明它的邻居节点越重要，或者说，它连接了许多重要的节点。

    PageRank：一个节点的PageRank值越高，说明它越重要。PageRank考虑了节点的入度和出度，因此它反映的是一个节点在网络中的整体重要性。

    Katz中心性（Katz Centrality）：一个节点的Katz中心性越高，说明它可以通过较短的路径到达更多的节点，或者说，它的影响力可以迅速扩散到网络中的其他节点。
    """
    nodes = graph.nodes()
    measures = {}
    
    # Degree centrality
    degree_centralities = nx.degree_centrality(graph)
    
    # Closeness centrality
    closeness_centralities = nx.closeness_centrality(graph)
    
    # Betweenness centrality
    betweenness_centralities = nx.betweenness_centrality(graph)
    
    # Eigenvector centrality
    eigenvector_centralities = nx.eigenvector_centrality(graph)
    
    # PageRank
    pageranks = nx.pagerank(graph)
    
    # Katz centrality
    try:
        katz_centralities = nx.katz_centrality(graph, alpha=0.005, max_iter=10000)
    except nx.PowerIterationFailedConvergence:
        print("Katz centrality computation didn't converge")


    for node in nodes:
        measures[node] = {
            'degree': degree_centralities[node],
            'closeness': closeness_centralities[node],
            'betweenness': betweenness_centralities[node],
            'eigenvector': eigenvector_centralities[node],
            'pagerank': pageranks[node],
            'katz': katz_centralities[node]
        }
        
    return measures

# 权重字典
weights = {
    'Domain': {
        'r_cert': 5,          
        'r_subdomain': 2,
        'r_request_jump': 3,
        'r_dns_a': 4,
        'r_whois_name': 1,    
        'r_whois_email': 1,
        'r_whois_phone': 1,
        'r_cert_chain': 0,   
        'r_cname': 0,
        'r_asn': 0,          
        'r_cidr': 0
    },
    'IP': {
        'r_cert': 0,            
        'r_subdomain': 0,
        'r_request_jump': 0,
        'r_dns_a': 5,
        'r_whois_name': 0,     
        'r_whois_email': 0,
        'r_whois_phone': 0,
        'r_cert_chain': 0,     
        'r_cname': 0,
        'r_asn': 1,            
        'r_cidr': 1
    },
    'Cert': {
        'r_cert': 5,            
        'r_subdomain': 0,
        'r_request_jump': 0,
        'r_dns_a': 0,
        'r_whois_name': 0,     
        'r_whois_email': 0,
        'r_whois_phone': 0,
        'r_cert_chain': 1,     
        'r_cname': 0,
        'r_asn': 0,            
        'r_cidr': 0
    }
}

for idx in range(1, 11):

    # 读取CSV文件
    links_data = pd.read_csv(f'CS3320-01_course_project/Dataset/out/examples/Link{idx}.csv')
    nodes_data = pd.read_csv(f'CS3320-01_course_project/Dataset/out/examples/Node{idx}.csv')


    # 提取节点类型
    node_types = {row['id']: row['type'] for _, row in nodes_data.iterrows()}

    # 创建邻接表
    adjacency_list = {}

    for _, link in links_data.iterrows():
        source = link['source']
        target = link['target']
        relation = link['relation']

        source_type = node_types[source]
        target_type = node_types[target]

        source_weight = weights.get(source_type, {}).get(relation, 0)
        target_weight = weights.get(target_type, {}).get(relation, 0)

        # 添加source到target的边
        if source not in adjacency_list:
            adjacency_list[source] = []
        adjacency_list[source].append((target, source_weight))

        # 添加target到source的边
        if target not in adjacency_list:
            adjacency_list[target] = []
        adjacency_list[target].append((source, target_weight))

    # 输出邻接表到json文件
    with open(f'CS3320-01_course_project/Dataset/out/node_importance/adjacency_list_{idx}.json', 'w') as f:
        json.dump(adjacency_list, f)

    print(f'Successfully created adjacency list_{idx}.')



    # 从json文件中读取邻接列表
    with open(f'CS3320-01_course_project/Dataset/out/node_importance/adjacency_list_{idx}.json', 'r') as f:
        adjacency_list = json.load(f)

    # 创建无向图
    G = nx.Graph()

    # 添加边到图
    for node, edges in adjacency_list.items():
        for edge, weight in edges:
            G.add_edge(node, edge, weight=weight)
    

    # 使用函数计算所有中心性度量
    all_measures = compute_all_centrality_measures(G)

    # 打印出所有节点的所有中心性度量
    # for node, measures in all_measures.items():
    #     print(f"Node: {node}")
    #     for measure, value in measures.items():
    #         print(f"{measure.capitalize()}: {value}")
    #     print()

    with open(f'CS3320-01_course_project/Dataset/out/node_importance/centrality_measures_{idx}.json', 'w') as f:
        json.dump(all_measures, f)
