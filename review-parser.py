import pymongo
import csv
import os

mongo = pymongo.MongoClient("mongodb://localhost/reviews")
db = mongo["reviews"]
db["data"].drop()
data = db["data"]
photos = db["photos"]
revchars = db["revchars"]
def parse(key, value):
	types = [0,0,0,1,1,1,2,2,1,1,1,0]
	if types[key] == 0:
		return int(value)
	if types[key] == 1:
		if value == 'null' or len(value) == 0:
			return None	
		elif value[0] == '\"' and value[len(value) - 1] == '\"':
			return value[1:len(value) - 1]
	if types[key] == 2:
		return 'true' in value
	return value

with open('../reviews.csv', newline='') as csvfile:
	spamreader = csv.reader(csvfile, quotechar='|')
	n = 0
	for row in spamreader:
		review = {"photos" : [], "characteristics" : {}}
		if n == 0:
			col = row
		else:
			i = 0
			for item in row:
				review[col[i]] = parse(i, item)
				i = i + 1
		if n > 0:
			for photo in photos.find({"review_id": review["id"]}):
				review["photos"] = review["photos"] + [photo["url"]]
			for characteristic in revchars.find({"review_id": review["id"]}):
				review["characteristics"][characteristic["characteristic_id"]["name"]] = characteristic["value"]
			data.insert_one(review)
		if n % 10000 == 0:
			print(n)
		n = n + 1
print("reviews loaded into db")
data.create_index("product_id")
print("product id index done")
os.system("python3 product-db.py")
