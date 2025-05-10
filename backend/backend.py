# backend.py (Flask Backend)

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
import os
from visualize import generate_graphs

app = Flask(__name__)
CORS(app)

# MongoDB Connection
client = MongoClient("mongodb://localhost:27017/")
db = client["restaurant"]
menu_collection = db["restaurant_menu"]
order_collection = db["food_order"]

# Ensure graph directory exists
GRAPH_DIR = os.path.join(os.getcwd(), "graphs")
os.makedirs(GRAPH_DIR, exist_ok=True)

# Route to add a new menu item
@app.route("/add_item", methods=["POST"])
def add_item():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No data provided!"}), 400
    menu_collection.insert_one(data)
    return jsonify({"message": "Item added successfully"}), 200

# Route to get all menu items
@app.route("/get_items", methods=["GET"])
def get_items():
    items = list(menu_collection.find({}, {"_id": 0}))
    return jsonify({"items": items}), 200

# Route to place a new order
@app.route("/place_order", methods=["POST"])
def place_order():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No order data provided!"}), 400
    order_collection.insert_one(data)
    return jsonify({"message": "Order placed successfully"}), 200

# Route to generate and return graph URLs
@app.route("/visualize", methods=["GET"])
def visualize():
    try:
        image_urls = generate_graphs(order_collection, menu_collection)
        return jsonify({"images": image_urls}), 200
    except Exception as e:
        return jsonify({"message": f"Visualization error: {str(e)}"}), 500

# Serve static graph images
@app.route("/graphs/<path:filename>")
def serve_graph(filename):
    return send_from_directory(GRAPH_DIR, filename)

# Route to delete selected menu items
@app.route("/delete_items", methods=["POST"])
def delete_items():
    data = request.get_json()
    items_to_delete = data.get("items", [])
    if not items_to_delete:
        return jsonify({"message": "No items to delete."}), 400
    result = menu_collection.delete_many({"name": {"$in": items_to_delete}})
    return jsonify({"message": f"{result.deleted_count} items deleted."}), 200

if __name__ == "__main__":
    app.run(debug=True)
