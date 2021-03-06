import pymongo
import csv

mongo = pymongo.MongoClient("mongodb://localhost/reviews")
db = mongo["reviews"]
db["products"].drop()
products = db["products"]
data = db["data"]
chars = db["chars"]

with open('../product.csv', newline='') as csvfile:
	spamreader = csv.reader(csvfile, quotechar='|')
	n = 0
	for row in spamreader:
		if n != 0:
			product = {"id" : int(row[0]), "reviews" : [], "characteristics" : []}
			i = 0
			for review in data.find({"product_id" : int(row[0])},
				{"_id" : 0, "id" : 0, "product_id" : 0}):
				indrev = review
				indrev["index"] = i
				product["reviews"] = product["reviews"] + [indrev]
				i = i + 1
			for characteristic in chars.find({"product_id" : int(row[0])}):
				product["characteristics"] = product["characteristics"] + [characteristic["name"]]
			products.insert_one(product)
			if n % 10000 == 0:
                        	print(n)
		n = n + 1
print("loaded all reviews into database")
ratings.create_index("id")
print("product id index done. database ready for dump")
