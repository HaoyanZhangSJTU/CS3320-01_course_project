import csv
import codecs
from tqdm import tqdm

class Node:
    def __init__(self, node_id: str, name: str, node_type: str, industry: str):
        """
        :param node_id:
        :param name:
        :param node_type:
        :param industry:
        """

        self.id = node_id
        self.name = name
        self.type = node_type
        my_industry = industry.replace("[", "").replace("]", "").replace(",", "").replace("'", "").replace(" ", "")

        self.industry = my_industry
        self.marked = 0  # 0 not marked;1 marked
        self.in_nodes = []  # save indices
        self.out_nodes = []  # save indices

    def add_in_node(self, next_id: str, link_type: str):
        self.in_nodes.append((next_id, link_type))

    def add_out_node(self, next_id: str, link_type: str):
        self.out_nodes.append((next_id, link_type))


if __name__ == "__main__":
    node_dict = {}
    with codecs.open("./Node.csv", encoding="utf-8-sig") as node_file:
        for row in csv.DictReader(node_file, skipinitialspace=True):
            node = Node(row["id"], row["name"], row["type"], row["industry"])
            node_dict[row["id"] ] = node
    node_file.close()

    print("Finish loading nodes")

    with codecs.open("./Link.csv", encoding="utf-8-sig") as link_file:
        for row in csv.DictReader(link_file, skipinitialspace=True):
            source = row["source"]
            target = row["target"]
            link_type = row["relation"]

            source_node = node_dict.get(source, -1)
            target_node = node_dict.get(target, -1)

            if source_node != -1 and target_node != -1:
                source_node.add_out_node(target, link_type)
                target_node.add_out_node(source, link_type)

    print("Finish loading links")

    #BFS
    for key, node in node_dict:
        pass



