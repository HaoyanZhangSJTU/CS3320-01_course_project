
import mimetypes
import csv
import json
import math
import numpy as np
import os
import logging


mimetypes.add_type('application/javascript', '.js')

from flask import Flask, render_template, url_for, redirect, request, jsonify
import subprocess

dataset_dir = os.path.join(os.path.dirname(__file__), "..", "dataset")

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

app.jinja_env.variable_start_string = '[['
app.jinja_env.variable_end_string = ']]'

@app.route('/')
def index():
    return render_template("index.html", static_folder='app/static')


@app.route('/test', methods = ['GET', 'POST'])
def test():
    if request.method == 'GET':
        text = {"Test": "GET Success!"}
        msg = jsonify(text)
    return msg


@app.route('/stat_node', methods=['GET', 'POST'])
def stat_node():
    if request.method == 'POST':
        if not request.data:
            return jsonify({"fail": "true"})
        example_id = request.json.get("example_id")
        csv_info = {}
        csv_reader = csv.reader(open(os.path.join(dataset_dir, "out", "examples", "Node{}.csv".format(example_id)), encoding="utf-8"))
        for line in csv_reader:
            node_type = line[2]
            if node_type == 'Domain':
                if len(line[3]) > 4:
                    node_type += '_black'
                else:
                    node_type += '_normal'
            if not node_type in csv_info:
                csv_info[node_type] = 0
            csv_info[node_type] += 1
        msg = []
        for k, v in csv_info.items():
            msg.append({"name": k, "value": v})
        msg = jsonify(msg)
    return msg

@app.route('/stat_link', methods=['GET', 'POST'])
def stat_link():
    if request.method == 'POST':
        if not request.data:
            return jsonify({"fail": "true"})
        example_id = request.json.get("example_id")
        print("Example id: {}".format(example_id))
        csv_info = {}
        csv_reader = csv.reader(open(os.path.join(dataset_dir, "out", "examples", "Link{}.csv".format(example_id))))
        for line in csv_reader:
            link_type = line[0]
            if not link_type in csv_info:
                csv_info[link_type] = 0
            csv_info[link_type] += 1
        msg = []
        for k, v in csv_info.items():
            msg.append({"name": k, "value": v})
        msg = jsonify(msg)
    return msg

@app.route('/stat_prob', methods=['GET', 'POST'])
def stat_prob():
    def softmax(a, T=10.):
        a=np.array(a)/T
        c = np.max(a)
        exp_a = np.exp(a - c)
        sum_exp_a = np.sum(exp_a)
        y = exp_a / sum_exp_a
        return y.tolist()
    black_market_type_dict = {
        'A': '涉黄', 'B': '涉赌', 'C': '诈骗', 'D': '涉毒', 'E': '涉枪', 'F': '黑客', 'G': '非法交易平台', 'H': '非法支付平台', 'I': '其他'
    }
    if request.method == 'POST':
        if not request.data:
            return jsonify({"fail": "true"})
        example_id = request.json.get("example_id")
        black_market_type = []
        csv_reader = csv.reader(open(os.path.join(
            dataset_dir, "out", "examples", "Node{}.csv".format(example_id)), encoding="utf-8"))
        for line in csv_reader:
            black_market_type += line[3]
            
        black_market_type_cnt = [black_market_type.count(
            i) for i in black_market_type_dict.keys()]
        black_market_type_prob = softmax(black_market_type_cnt)
        msg = [list(black_market_type_dict.values()), black_market_type_prob]
        msg = jsonify(msg)
    return msg

@app.route('/stat_prob_all', methods=['GET', 'POST'])
def stat_prob_all():
    def softmax(a, T=10.):
        a=np.array(a)/T
        c = np.max(a)
        exp_a = np.exp(a - c)
        sum_exp_a = np.sum(exp_a)
        y = exp_a / sum_exp_a
        return y.tolist()
    
    black_market_type_dict = {
        'A': '涉黄', 'B': '涉赌', 'C': '诈骗', 'D': '涉毒', 'E': '涉枪', 'F': '黑客', 'G': '非法交易平台', 'H': '非法支付平台', 'I': '其他'
    }
    type_all=list()
    if request.method == 'POST':
        if not request.data:
            return jsonify({"fail": "true"})
        for i in range(10):
            black_market_type = []
            csv_reader = csv.reader(open(os.path.join(
                dataset_dir, "out", "examples", "Node{}.csv".format(i+1)), encoding="utf-8"))
            for line in csv_reader:
                black_market_type += line[3]
            black_market_type_cnt = [black_market_type.count(
                j) for j in black_market_type_dict.keys()]
            black_market_type_prob = softmax(black_market_type_cnt)
            type_all.append(black_market_type_prob)
        
        msg = type_all

        msg = jsonify(msg)
    return msg

@app.route('/stat_cloud', methods=['GET', 'POST'])
def stat_cloud():
    def softmax(a, T=10.):
        a=np.array(a)/T
        c = np.max(a)
        exp_a = np.exp(a - c)
        sum_exp_a = np.sum(exp_a)
        y = exp_a / sum_exp_a
        return y.tolist()
    black_market_type_dict = {
        'A': '涉黄', 'B': '涉赌', 'C': '诈骗', 'D': '涉毒', 'E': '涉枪', 'F': '黑客', 'G': '非法交易平台', 'H': '非法支付平台', 'I': '其他'
    }
    type_all=dict()
    for i in range(len(black_market_type_dict)):
        type_all[list(black_market_type_dict.values())[i]]=0
    if request.method == 'POST':
        if not request.data:
            return jsonify({"fail": "true"})
        example_id = request.json.get("example_id")
        black_market_type = []
        csv_reader = csv.reader(open(os.path.join(
            dataset_dir, "out", "examples", "Node{}.csv".format(example_id)), encoding="utf-8"))
        for line in csv_reader:
            black_market_type += line[3]
        print(black_market_type)
        black_market_type_cnt = [black_market_type.count(
            j) for j in black_market_type_dict.keys()]
        black_market_type_prob = softmax(black_market_type_cnt)
        for j in range(9):
            type_all[list(black_market_type_dict.values())[j]]+=black_market_type_prob[j]
        msg=list()
        for i in range(9):
            msg.append({'name':list(black_market_type_dict.values())[i], 'value':black_market_type_prob[i]})
        msg = jsonify(msg)
    return msg

@app.route('/stat_info', methods=['GET', 'POST'])
def stat_info():
    if request.method == 'POST':
        if not request.data:
            return jsonify({"fail": "true"})
        example_id = request.json.get("example_id")
        info = {}
        with open(os.path.join(dataset_dir, "out", "examples", "Node{}.csv".format(example_id)), encoding="utf-8") as f:
            info['Node'] = len(f.readlines())
        with open(os.path.join(dataset_dir, "out", "examples", "Link{}.csv".format(example_id)), encoding="utf-8") as f:
            info['Link'] = len(f.readlines())
        with open(os.path.join(dataset_dir, "out", "info_text", "text{}.txt".format(example_id)), encoding="utf-8") as f:
            info['text'] = f.readline()
        msg = jsonify(info)
    return msg

@app.route('/example', methods=["POST"])
def example(): 
    if request.method == "POST":
        if not request.data:
            return jsonify({"fail": "true"})
        example_id = request.json.get("example_id")
        
        nodes = []
        with open(os.path.join(dataset_dir, "out", "examples", "Node{}.csv".format(example_id)), encoding='utf-8') as f:
            csv_reader = csv.reader(f)
            for line in csv_reader:
                node = {"id": line[0], 
                    "name": line[1],
                        "type": line[2], 
                        "industry": line[3][1:-1].split(",") if line[3] != "[]" else []}
                nodes.append(node)

        edges = []
        with open(os.path.join(dataset_dir, "out", "examples", "Link{}.csv".format(example_id)), encoding='utf-8') as f:
            csv_reader = csv.reader(f)
            for line in csv_reader:
                edge = {"relation": line[0], "source": line[1], "target": line[2]}
                edges.append(edge)
        
        data = {"example_id": example_id, "nodes": nodes, "edges": edges}
        msg = jsonify(data)
        return msg

@app.route('/key_link', methods=['POST'])
def key_link():
    if request.method == "POST":
        if not request.data:
            return jsonify({"fail": "true"})
        example_id = request.json.get("example_id")

        nodes = []
        with open(os.path.join(dataset_dir, "out", "keylink", "Node{}.csv".format(example_id)), encoding='utf-8') as f:
            csv_reader = csv.reader(f)
            for line in csv_reader:
                node = {"id": line[0],
                        "name": line[1],
                        "type": line[2],
                        "industry": line[3][1:-1].split(",") if line[3] != "[]" else [],
                        "weight": line[4],
                        "core": line[5]
                        }
                nodes.append(node)

        edges = []
        with open(os.path.join(dataset_dir, "out", "keylink", "Link{}.csv".format(example_id)), encoding='utf-8') as f:
            csv_reader = csv.reader(f)
            for line in csv_reader:
                edge = {"relation": line[0], "source": line[1], "target": line[2]}
                edges.append(edge)
        
        data = {"example_id": example_id, "nodes": nodes, "edges": edges}
        msg = jsonify(data)
        return msg

@app.route("/real_time", methods=['POST'])
def real_time():
    if request.method == "POST":
        if not request.data:
            return jsonify({"fail": "true"})
        domain = request.json.get("domain_id")
        print("Starting Real Time Search: " + domain)
        command = [os.path.join(dataset_dir, "exe", "main.exe"), domain]
        print(os.path.join(dataset_dir, "exe", "main.exe") + " " + domain)
        p = subprocess.Popen(command, cwd=os.path.join(dataset_dir, "exe"))
        return_code = p.wait()
        if return_code == 1:
            print("Real Time Search Failed")
            return jsonify({"fail": "true"})
        elif return_code == 0: 
            nodes = []
            print("Real Time Search Succeeded! ")
            with open(os.path.join(dataset_dir, "exe", "realtime_example", "Node1.csv"), encoding='utf-8') as f:
                csv_reader = csv.reader(f)
                for line in csv_reader:
                    node = {"id": line[0],
                            "name": line[1],
                            "type": line[2],
                            "industry": line[3][1:-1].split(",") if line[3] != "[]" else []}
                    nodes.append(node)

            edges = []
            with open(os.path.join(dataset_dir, "exe", "realtime_example", "Link1.csv"), encoding='utf-8') as f:
                csv_reader = csv.reader(f)
                for line in csv_reader:
                    edge = {"relation": line[0],
                            "source": line[1], "target": line[2]}
                    edges.append(edge)

            data = {"domain": domain, "nodes": nodes, "edges": edges}
            msg = jsonify(data)
            return msg


@app.route('/global_node', methods=['POST'])
def global_node():
    if request.method == "POST":
        if not request.data:
            return jsonify({"fail": "true"})
        nodes = []
        with open(os.path.join(dataset_dir, "asn", "output.csv"), encoding='utf-8') as f:
            csv_reader = csv.reader(f)
            for line in csv_reader:
                node = {
                    "id": line[0],
                    "type": line[0].split("_")[0],
                    "size": line[1],
                    "x": line[2],
                    "y": line[3],
                    "ratio": line[4],
                    "count": line[5],
                    "black_count": line[6],
                }
                nodes.append(node)

        data = {"nodes": nodes, "canvas": {"min_x": "-2588", "min_y": "-2651.000000", "max_x": "5055.000000", "max_y": "4849.000000", "min_size": 30, "max_size": 60}}
        msg = jsonify(data)
        return msg
            


if __name__ == '__main__':
    app.run(debug=True)

