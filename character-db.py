import pymongo
import csv
import os
mongo = pymongo.MongoClient("mongodb://localhost/reviews")
db = mongo["reviews"]
db["chars"].drop()
db["revchars"].drop()
chars = db["chars"]
revchars = db["revchars"]
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


with open('../characteristics.csv', newline='') as csvfile:
	spamreader = csv.reader(csvfile, quotechar='|')
	n = 0
	for row in spamreader:
		character = {}
		if n == 0:
                    col = row
		else:
                    i = 0
                    for item in row:
                        character[col[i]] = parse(i, item)
                        i = i + 1
                    chars.insert_one(character)
                    if n % 10000 == 0:
                        print(n)
		n = n + 1
print("characteristics.csv loaded")
chars.create_index("id")
print("id index done")
chars.create_index("product_id")
print("product id index done")
def charparse(key, value):
	if key == 1:
		for characteristic in chars.find({"id" : int(value)},
			{"name" : 1}):
			return characteristic
	else:
		return int(value)
with open('../characteristic_reviews.csv', newline='') as csvfile:
	spamreader = csv.reader(csvfile, quotechar='|')
	n = 0
	for row in spamreader:
		revchar = {}
		if n == 0:
                    col = row
		else:
                    i = 0
                    for item in row:
                        revchar[col[i]] = charparse(i, item)
                        i = i + 1
                    revchars.insert_one(revchar)
                    if n % 10000 == 0:
                        print(n)
		n = n + 1
print("characteristic_reviews.csv loaded")
revchars.create_index("review_id")
print("review id index done")
os.system("python3 photo-db.py")
