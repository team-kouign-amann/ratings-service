import pymongo
import csv

mongo = pymongo.MongoClient("mongodb://localhost/reviews")
db = mongo["reviews"]
#for x in db["data"].find():
#	print(x)
db["data"].drop()
data = db["data"]

def parse(key, value):
	types = [0,0,0,1,1,1,2,2,1,1,1,0]
	if types[key] == 0:
		return int(value)
	if types[key] == 1:
		return value[1:len(value) - 1]
	if types[key] == 2:
		return 'true' in value
	return value

with open('reviews.csv', newline='') as csvfile:
	spamreader = csv.reader(csvfile, quotechar='|')
	n = 0
	for row in spamreader:
		review = {}
		if n == 0:
			col = row
		else:
			i = 0
			for item in row:
				review[col[i]] = parse(i, item)
				i = i + 1
		if n > 0:
			data.insert_one(review)
			print(review)
		n = n + 1
