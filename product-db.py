import pymongo

mongo = pymongo.MongoClient("mongodb://localhost/reviews")
db = mongo["reviews"]
db["products"].drop()
data = db["data"]
products = db["products"]
ids = {}
n = 0
for review in data.find({}, { "product_id" : 1, "_id" : 1 }):
        if review["product_id"] in ids:
            query =  { "_id" : ids[review["product_id"]] }
        #if products.find(query).count() > 0:
            products.update_one( query, { "$addToSet" : { "reviews" : [review["_id"]] }})
        else:
            x = products.insert_one({"product_id" : review["product_id"], "reviews" : [review["_id"]]})
            ids[review["product_id"]] = x.inserted_id
        n = n + 1
        if n % 10000 == 0:
            print(n)
