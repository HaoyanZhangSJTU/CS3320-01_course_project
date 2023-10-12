import heapq
from DataManipulation import *
import csv

w={}
w['Domain'] = {
	'r_cert': 6,            # 很强
	'r_subdomain': 2,
	'r_request_jump': 3,
	'r_dns_a': 5,
	'r_whois_name': 1,      # 较强
	'r_whois_email': 1,
	'r_whois_phone': 1,
	'r_cert_chain': 0,      # 一般
	'r_cname': 0,
	'r_asn': 0,             # 较弱
	'r_cidr': 0
}
w['IP'] = {
	'r_cert': 0,            # 很强
	'r_subdomain': 0,
	'r_request_jump': 0,
	'r_dns_a': 5,
	'r_whois_name': 0,      # 较强
	'r_whois_email': 0,
	'r_whois_phone': 0,
	'r_cert_chain': 0,      # 一般
	'r_cname': 0,
	'r_asn': 1,             # 较弱
	'r_cidr': 1
}
w['Cert'] = {
	'r_cert': 5,            # 很强
	'r_subdomain': 0,
	'r_request_jump': 0,
	'r_dns_a': 0,
	'r_whois_name': 0,      # 较强
	'r_whois_email': 0,
	'r_whois_phone': 0,
	'r_cert_chain': -1,     # 一般
	'r_cname': 0,
	'r_asn': 0,             # 较弱
	'r_cidr': 0
}

#社区检测

fa = {}
def getfa(id):
	if fa.get(id, -1) == -1 or fa.get(id, -1) == id:
		fa[id] = id
		return fa[id]
	else:
		fa[id] = getfa(fa[id])
		return fa[id]

number = 14
print(number)

node_dict = build_graph('./Node and Link/Node/Node'+str(number)+'.csv', './Node and Link/Link/Link'+str(number)+'.csv')
for kkk in node_dict.keys():
	root = [kkk]
	break

na = 3000
nb = 6000

if len(node_dict)<=12000:
	na = 400
	nb = 800
elif len(node_dict)>12000 and len(node_dict)<=14000:
	na = 800
	nb = 1600

def extract(root, node_dict):
	re_node = []
	re_edge = []
	print("Start Extracting...")
	heap = [(-99, root[0], 3, None)]
	getfa(root[0])
	#getfa(root[1])
	#heapq.heapify(heap)
	while len(heap):
		#print(len(heap))
		_, now, jump, edg = heap[0]
		del(heap[0])
		u = node_dict.get(now, -1)
		if now in re_node:
			if edg is not None and edg not in re_edge:
				re_edge.append(edg)
			continue
		re_node.append(now)
		if edg is not None and edg not in re_edge:
			re_edge.append(edg)
		if len(re_node) >= 400 or len(re_edge) >= 800:
			break
		if not jump:
			continue
		jump -= 1
		nei = u.in_nodes+u.out_nodes
		h = []
		noww = weight
		if u.type == 'IP' or u.type == 'Cert' or u.type == 'Domain':
			noww = w[u.type]
		for n, r in nei:
			v = node_dict.get(n, -1)
			h.append((-v.imp-noww[r], n, r))
		heapq.heapify(h)
		i = 20
		while len(h) and i:
			_, ne, r = heapq.heappop(h)
			i-=1
			edg = (ne,now,r)
			if (ne, r) in u.out_nodes:
				edg = (now, ne, r)
			if ne in re_node:
				if edg not in re_edge:
					re_edge.append(edg)
				continue
			v = node_dict.get(ne, -1) 
			j = jump
			if weight[r]==0 and j >= 2:
				j = 1
			if v.imp > 1:
				heap.append((-v.imp-noww[r], ne, 3, edg))
			elif j > 0:
				heap.append((-v.imp-noww[r], ne, j, edg))
	return re_node, re_edge

def extract2(root, node_dict):
	re_node = []
	re_edge = []
	print("Start Extracting...")
	heap = [(-99, root[0], 3, None), (-99, root[1], 3, None)]
	heapq.heapify(heap)
	while len(heap):
		_, now, jump, edg = heapq.heappop(heap)
		u = node_dict.get(now, -1)
		re_node.append(now)
		if edg is not None and edg not in re_edge:
			re_edge.append(edg)
		#if len(re_node) >= 400 or len(re_edge) >= 800:
		#	return re_node, re_edge
		if not jump:
			continue
		jump -= 1
		nei = u.in_nodes+u.out_nodes
		h = []
		for n, r in nei:
			v = node_dict.get(n, -1)
			h.append((-v.imp-weight[r], n, r))
		
		for ne, r in u.in_nodes:
			if ne in re_node:
				if (ne,now,r) not in re_edge:
					re_edge.append((ne,now,r))
				continue
			v = node_dict.get(ne, -1)
			j = jump
			if weight[r]==0 and j >= 2:
				j = 1
			if v.imp > 1:
				heapq.heappush(heap, (-v.imp-weight[r], ne, 3, (ne,now,r)))
			elif j > 0:
				heapq.heappush(heap, (-v.imp-weight[r], ne, j, (ne,now,r)))
		for ne, r in u.out_nodes:
			if ne in re_node:
				if (now,ne,r) not in re_edge:
					re_edge.append((now,ne,r))
				continue
			v = node_dict.get(ne, -1)
			j = jump
			if weight[r]==0 and j >= 2:
				j = 1
			if v.imp > 1:
				heapq.heappush(heap, (-v.imp-weight[r], ne, 3, (now,ne,r)))
			elif j > 0:
				heapq.heappush(heap, (-v.imp-weight[r], ne, j, (now,ne,r)))
	return re_node, re_edge

def extract3(root, node_dict):
	re_node = []
	re_edge = []
	print("Start Extracting...")
	heap = [(-99, root[0], 3, None)]
	heapq.heapify(heap)
	while len(heap):
		#print(len(heap))
		_, now, jump, edg = heapq.heappop(heap)
		u = node_dict.get(now, -1)
		if now in re_node:
			if edg is not None and edg not in re_edge:
				re_edge.append(edg)
			continue
		re_node.append(now)
		if edg is not None and edg not in re_edge:
			re_edge.append(edg)
		if len(re_node) >= 200 or len(re_edge) >= 400:
			break
		if not jump:
			continue
		jump -= 1
		nei = u.in_nodes+u.out_nodes
		h = []
		noww = weight
		if u.type == 'IP' or u.type == 'Cert' or u.type == 'Domain':
			noww = w[u.type]
		for n, r in nei:
			v = node_dict.get(n, -1)
			h.append((-v.imp-noww[r], n, r))
		heapq.heapify(h)
		i = 20
		while len(h) and i:
			_, ne, r = heapq.heappop(h)
			i-=1
			edg = (ne,now,r)
			if (ne, r) in u.out_nodes:
				edg = (now, ne, r)
			if ne in re_node:
				if edg not in re_edge:
					re_edge.append(edg)
				continue
			v = node_dict.get(ne, -1) 
			j = jump
			if weight[r]==0 and j >= 2:
				j = 1
			if v.imp > 1:
				heapq.heappush(heap, (-v.imp-noww[r], ne, 3, edg))
			elif j > 0:
				heapq.heappush(heap, (-v.imp-noww[r], ne, j, edg))
	heap = [(-99, root[1], 3, None)]
	heapq.heapify(heap)
	while len(heap):
		#print(len(heap))
		_, now, jump, edg = heapq.heappop(heap)
		u = node_dict.get(now, -1)
		if now in re_node:
			if edg is not None and edg not in re_edge:
				re_edge.append(edg)
			continue
		re_node.append(now)
		if edg is not None and edg not in re_edge:
			re_edge.append(edg)
		if len(re_node) >= 400 or len(re_edge) >= 800:
			break
		if not jump:
			continue
		jump -= 1
		nei = u.in_nodes+u.out_nodes
		h = []
		noww = weight
		if u.type == 'IP' or u.type == 'Cert' or u.type == 'Domain':
			noww = w[u.type]
		for n, r in nei:
			v = node_dict.get(n, -1)
			h.append((-v.imp-noww[r], n, r))
		heapq.heapify(h)
		i = 20
		while len(h) and i:
			_, ne, r = heapq.heappop(h)
			i-=1
			edg = (ne,now,r)
			if (ne, r) in u.out_nodes:
				edg = (now, ne, r)
			if ne in re_node:
				if edg not in re_edge:
					re_edge.append(edg)
				continue
			v = node_dict.get(ne, -1) 
			j = jump
			if weight[r]==0 and j >= 2:
				j = 1
			if v.imp > 1:
				heapq.heappush(heap, (-v.imp-noww[r], ne, 3, edg))
			elif j > 0:
				heapq.heappush(heap, (-v.imp-noww[r], ne, j, edg))
	return re_node, re_edge

node, link = extract(root, node_dict)
csvfile = open('./510/Node'+str(number)+'.csv', mode='w', newline='', encoding='utf-8')
fieldnames = ['id','name','type','industry']
write = csv.DictWriter(csvfile, fieldnames=fieldnames)
#write.writeheader()
count_d = {}
count = {}
for no in node:
	u = node_dict.get(no, -1)
	if count.get(u.type, -1) == -1:
		count[u.type] = 1
	else:
		count[u.type] += 1
	if u.type == 'Domain':
		if count_d.get(u.industry, -1) == -1:
			count_d[u.industry] = 1
		else:
			count_d[u.industry] += 1
	ind = u.industry
	ans = '['
	if len(ind) > 0:
		ans += ind[0]
		for i in range(1, len(ind)):
			ans = ans + ',' + ind[i]
	ans += ']'
	write.writerow({'id': u.id, 'name': u.name, 'type': u.type, 'industry': ans})
for m in count.keys():
	print(m, count[m])
for m in count_d.keys():
	print(m, count_d[m])
csvfile = open('./510/Link'+str(number)+'.csv', mode='w', newline='', encoding='utf-8')
fieldnames = ['relation','source','target']
write = csv.DictWriter(csvfile, fieldnames=fieldnames)
#write.writeheader()
for s,t,r in link:
	write.writerow({'relation': r, 'source': s, 'target': t})