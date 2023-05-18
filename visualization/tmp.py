import csv
csv_reader = csv.reader(open('../dataset/out/Node.csv'))
black_market_type = []
for line in csv_reader:
    black_market_type+=line[3]
print(black_market_type)