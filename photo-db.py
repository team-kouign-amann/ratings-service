import pymongo
import csv
import os
mongo = pymongo.MongoClient("mongodb://localhost/reviews")
db = mongo["reviews"]
db["photos"].drop()
data = db["photos"]

def parse(key, value):
	types = [0,0,1]
	if types[key] == 0:
		return int(value)
	if types[key] == 1:
		if value == 'null' or len(value) == 0:
			return None	
		elif value[0] == '\"' and value[len(value) - 1] == '\"':
			return value[1:len(value) - 1]
	return value


with open('../reviews_photos.csv', newline='') as csvfile:
	spamreader = csv.reader(csvfile, quotechar='|')
	n = 0
	for row in spamreader:
		photo = {}
		if n == 0:
                    col = row
		else:
                    i = 0
                    for item in row:
                        photo[col[i]] = parse(i, item)
                        i = i + 1
                    data.insert_one(photo)
                    if n % 10000 == 0:
                        print(n)
		n = n + 1
print("photos loaded into db")
data.create_index("review_id")
print("review id index done")
os.system("python3 review-parser.py")
