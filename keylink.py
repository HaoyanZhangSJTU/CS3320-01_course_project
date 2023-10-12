import heapq
from DataManipulation import *
import csv
import json

for i in range(6,11):
	with open('Dataset/out/node_importance/centrality_measures_'+str(i)+'.json', 'r') as f:
		centrality_measures = json.load(f)

	imp = []
	for node in centrality_measures.keys():
		dic = {}
		dic['id'] = node
		for k in centrality_measures[node].keys():
			dic[k] = centrality_measures[node][k]
		imp.append(dic)
	
	node_dict = build_graph('Dataset/out/examples_head/Node'+str(i)+'.csv', 'Dataset/out/examples_head/Link'+str(i)+'.csv')
	
	imp.sort(key=lambda x:(x['degree'], x['pagerank'], x['betweenness'], x['closeness'], x['eigenvector'], x['katz']), reverse=True)
	'''
	for i in range(5):
		print(imp[i])
		node = node_dict[imp[i]['id']]
		print(node.name)
	'''
	
	que = []
	dis = {}
	pre = {}
	dis[imp[0]['id']] = 0
	que.append(imp[0]['id'])
	while len(que):
		uu = que[0]
		del que[0]
		u = node_dict.get(uu, -1)
		for vv, _ in u.in_nodes:
			dv = dis.get(vv, -1)
			if vv != uu and (dv == -1 or dv > dis[uu]+1):
				dis[vv] = dis[uu]+1
				pre[vv] = uu
				if vv not in que:
					que.append(vv)
		for vv, _ in u.out_nodes:
			dv = dis.get(vv, -1)
			if dv == -1 or dv > dis[uu]+1:
				dis[vv] = dis[uu]+1
				pre[vv] = uu
				if vv not in que:
					que.append(vv)
	node_list = []
	link_list = []
	node_list.append(imp[0]['id'])
	for id in imp[1:5]:
		now = id['id']
		while pre.get(now, -1) != -1:
			if now not in node_list:
				node_list.append(now)
			bef = pre.get(now, -1)
			#print(bef)
			if (bef, now, 'r_request_jump') not in link_list:
				link_list.append((bef, now, 'r_request_jump'))
			now = bef
	
	count_d = {}
	count = {}
	for n in node_dict.keys():
		a = node_dict.get(n, -1)
		if count.get(a.type, -1) == -1:
			count[a.type] = 1
		else:
			count[a.type] += 1
		if a.type == 'Domain':
			if count_d.get(a.industry, -1) == -1:
				count_d[a.industry] = 1
			else:
				count_d[a.industry] += 1
	for m in count.keys():
		print(m, count[m])
	for m in count_d.keys():
		print(m, count_d[m])
	
	for n in imp[0:5]:
		print(n['id'])
	
	csvfile = open('keylink/Node'+str(i)+'.csv', mode='w', newline='', encoding='utf-8')
	fieldnames = ['id','name','type','industry','weight','score']
	write = csv.DictWriter(csvfile, fieldnames=fieldnames)
	write.writeheader()
	for no in node_list:
		u = node_dict.get(no, -1)
		ind = u.industry
		ans = '['
		if len(ind) > 0:
			ans += ind[0]
			for j in range(1, len(ind)):
				ans = ans + ',' + ind[j]
		ans += ']'
		write.writerow({'id': u.id, 'name': u.name, 'type': u.type, 'industry': ans, 'weight': centrality_measures[u.id]['degree'], 'score': centrality_measures[u.id]['pagerank']})
	
	csvfile = open('keylink/Link'+str(i)+'.csv', mode='w', newline='', encoding='utf-8')
	fieldnames = ['relation','source','target']
	write = csv.DictWriter(csvfile, fieldnames=fieldnames)
	#write.writeheader()
	for s,t,r in link_list:
		write.writerow({'relation': r, 'source': s, 'target': t})
	
	csvfile = open('keylink/Node_Imp'+str(i)+'.csv', mode='w', newline='', encoding='utf-8')
	fieldnames = ['id','name','degree', 'pagerank', 'betweenness', 'closeness', 'eigenvector', 'katz']
	write = csv.DictWriter(csvfile, fieldnames=fieldnames)
	write.writeheader()
	for no in imp:
		u = node_dict.get(no['id'], -1)
		write.writerow({'id': u.id, 'name':u.name, 'degree':no['degree'], 'pagerank':no['pagerank'], 'betweenness':no['betweenness'], 'closeness':no['closeness'], 'eigenvector':no['eigenvector'], 'katz':no['katz']})
	
	print()