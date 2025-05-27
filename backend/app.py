from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import os
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configure CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
CORS(app, resources={r"/*": {
    "origins": allowed_origins,
    "methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type", "Origin"]
}})
logger.info(f"CORS configured for origins: {allowed_origins}")

# Add security headers and ensure CORS
@app.after_request
def add_security_headers(response):
    logger.info(f"Adding headers to response for request: {request.method} {request.path}")
    origin = request.headers.get('Origin')
    if origin in allowed_origins or '*' in allowed_origins:
        response.headers['Access-Control-Allow-Origin'] = origin if origin else '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Origin'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response

# Handle preflight OPTIONS requests
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        logger.info(f"Handling preflight OPTIONS request from origin: {request.headers.get('Origin')}")
        response = jsonify({"message": "Preflight request successful"})
        response.status_code = 200
        return response

# MongoDB Connection
try:
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
    client.admin.command("ping")
    logger.info("Connected to MongoDB successfully")
except ConnectionFailure as e:
    logger.error(f"Failed to connect to MongoDB: {e}", exc_info=True)
    raise SystemExit("MongoDB connection failed")

db = client["restaurant"]
menu_collection = db["restaurant_menu"]
order_collection = db["food_order"]
feedback_collection = db["feedback"]  # New collection for feedback

# Ensure graph directory exists
GRAPH_DIR = os.path.join(os.getcwd(), "graphs")
os.makedirs(GRAPH_DIR, exist_ok=True)
logger.info(f"Graph directory ensured at: {GRAPH_DIR}")

# Helper function to validate menu item data
def validate_menu_item(data):
    required_fields = ["name", "category", "cuisine", "selling_price", "actual_price"]
    missing_fields = [field for field in required_fields if field not in data or data[field] is None]
    if missing_fields:
        logger.warning(f"Validation failed for menu item: missing fields {missing_fields}")
        return False, f"Missing required fields: {missing_fields}"
    
    # Validate field types
    if not all(isinstance(data[field], str) for field in ["name", "category", "cuisine"]):
        logger.warning("Validation failed for menu item: name, category, and cuisine must be strings")
        return False, "Name, category, and cuisine must be strings"
    
    # Validate prices
    try:
        selling_price = float(data["selling_price"])
        actual_price = float(data["actual_price"])
        if selling_price < 0 or actual_price < 0:
            logger.warning("Validation failed for menu item: prices must be non-negative")
            return False, "Selling price and actual price must be non-negative numbers"
    except (ValueError, TypeError) as e:
        logger.warning(f"Validation failed for menu item: invalid price format - {str(e)}")
        return False, "Selling price and actual price must be valid numbers"
    
    return True, ""

# Helper function to validate order data
def validate_order(data):
    if not isinstance(data.get("items"), list) or not data.get("items"):
        logger.warning("Validation failed for order: items must be a non-empty list")
        return False, "Items must be a non-empty list"
    if not isinstance(data.get("datetime"), str):
        logger.warning("Validation failed for order: datetime must be a string")
        return False, "Datetime must be a string"
    try:
        datetime.fromisoformat(data["datetime"])
    except ValueError as e:
        logger.warning(f"Validation failed for order: invalid datetime format - {e}")
        return False, f"Invalid datetime format: {str(e)}"
    if not all(isinstance(item, str) for item in data["items"]):
        logger.warning("Validation failed for order: all items must be strings")
        return False, "All items must be strings"
    return True, ""

# Helper function to validate feedback data
def validate_feedback(data):
    required_fields = ["name", "email", "feedback"]
    missing_fields = [field for field in required_fields if field not in data or data[field] is None]
    if missing_fields:
        logger.warning(f"Validation failed for feedback: missing fields {missing_fields}")
        return False, f"Missing required fields: {missing_fields}"
    
    # Validate field types
    if not all(isinstance(data[field], str) for field in required_fields):
        logger.warning("Validation failed for feedback: name, email, and feedback must be strings")
        return False, "Name, email, and feedback must be strings"
    
    # Validate email format
    import re
    email_pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    if not re.match(email_pattern, data["email"]):
        logger.warning("Validation failed for feedback: invalid email format")
        return False, "Invalid email format"
    
    return True, ""

# Add Item
@app.route("/add_item", methods=["POST"])
def add_item():
    try:
        data = request.get_json()
        if not data:
            logger.warning("No data provided in add_item request")
            return jsonify({"error": "No data provided"}), 400
        
        # Validate the menu item data
        is_valid, error_message = validate_menu_item(data)
        if not is_valid:
            logger.warning(f"Invalid menu item data: {error_message}")
            return jsonify({"error": error_message}), 400
        
        # Check if item already exists
        if menu_collection.find_one({"name": data["name"]}):
            logger.info(f"Item already exists: {data['name']}")
            return jsonify({"error": "Item already exists"}), 409
        
        # Create item
        item = {
            "name": data["name"].strip(),
            "category": data["category"],
            "cuisine": data["cuisine"].strip(),
            "selling_price": float(data["selling_price"]),
            "actual_price": float(data["actual_price"])
        }
        
        menu_collection.insert_one(item)
        logger.info(f"Added menu item: {item['name']} with selling_price: {item['selling_price']}, actual_price: {item['actual_price']}")
        return jsonify({"message": "Item added successfully"}), 200
    except Exception as e:
        logger.error(f"Error adding item: {e}", exc_info=True)
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# Get Menu Items
@app.route("/get_items", methods=["GET"])
def get_items():
    try:
        logger.info("Received request for /get_items")
        items = list(menu_collection.find({}, {"_id": 0}))
        logger.info(f"Fetched {len(items)} menu items")
        return jsonify({"items": items}), 200
    except Exception as e:
        logger.error(f"Error fetching items: {e}", exc_info=True)
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# Place Order
@app.route("/place_order", methods=["POST"])
def place_order():
    try:
        data = request.get_json()
        if not data:
            logger.warning("No order data provided in place_order request")
            return jsonify({"error": "No order data provided"}), 400
        
        # Validate the order data
        is_valid, error_message = validate_order(data)
        if not is_valid:
            logger.warning(f"Invalid order data: {error_message}")
            return jsonify({"error": error_message}), 400
        
        # Check for invalid items
        invalid_items = [item for item in data["items"] if not menu_collection.find_one({"name": item})]
        if invalid_items:
            logger.info(f"Invalid items in order: {invalid_items}")
            return jsonify({"error": f"Invalid items: {invalid_items}"}), 400
        
        # Calculate total cost and loss
        total_cost = 0
        total_loss = 0
        for item_name in data["items"]:
            item = menu_collection.find_one({"name": item_name})
            total_cost += item["selling_price"]
            if item["actual_price"] > item["selling_price"]:
                total_loss += item["actual_price"] - item["selling_price"]
        
        order = {
            "items": data["items"],
            "datetime": data["datetime"],
            "total_cost": total_cost,
            "total_loss": total_loss
        }
        order_collection.insert_one(order)
        logger.info(f"Placed order with {len(data['items'])} items, total_cost: {total_cost}, total_loss: {total_loss}")
        return jsonify({"message": "Order placed successfully"}), 200
    except Exception as e:
        logger.error(f"Error placing order: {e}", exc_info=True)
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# Add Feedback
@app.route("/api/feedback", methods=["POST"])
def add_feedback():
    try:
        data = request.get_json()
        if not data:
            logger.warning("No data provided in add_feedback request")
            return jsonify({"error": "No data provided"}), 400
        
        # Validate the feedback data
        is_valid, error_message = validate_feedback(data)
        if not is_valid:
            logger.warning(f"Invalid feedback data: {error_message}")
            return jsonify({"error": error_message}), 400
        
        # Create feedback entry
        feedback = {
            "name": data["name"].strip(),
            "email": data["email"].strip(),
            "feedback": data["feedback"].strip(),
            "created_at": datetime.utcnow().isoformat()  # Store timestamp
        }
        
        result = feedback_collection.insert_one(feedback)
        feedback["id"] = str(result.inserted_id)  # Add the MongoDB ObjectID as 'id'
        logger.info(f"Added feedback from {feedback['name']} (email: {feedback['email']})")
        return jsonify({"message": "Feedback added successfully"}), 201
    except Exception as e:
        logger.error(f"Error adding feedback: {e}", exc_info=True)
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# Get Feedback
@app.route("/api/feedback", methods=["GET"])
def get_feedback():
    try:
        logger.info("Received request for /api/feedback")
        feedback_list = list(feedback_collection.find({}, {"_id": 1, "name": 1, "email": 1, "feedback": 1, "created_at": 1}))
        # Convert ObjectID to string and exclude '_id' from the response
        formatted_feedback = [
            {
                "id": str(fb["_id"]),
                "name": fb["name"],
                "email": fb["email"],
                "feedback": fb["feedback"],
                "created_at": fb["created_at"]
            }
            for fb in feedback_list
        ]
        logger.info(f"Fetched {len(formatted_feedback)} feedback entries")
        return jsonify(formatted_feedback), 200
    except Exception as e:
        logger.error(f"Error fetching feedback: {e}", exc_info=True)
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# Visualization route
@app.route("/visualize", methods=["GET"])
def visualize():
    try:
        try:
            from visualize import generate_graphs
        except ImportError as e:
            logger.error(f"Failed to import visualize module: {e}")
            return jsonify({"error": "Visualization module not available"}), 500
        image_urls = generate_graphs(order_collection, menu_collection)
        if not image_urls:
            logger.info("No visualizations generated due to empty data")
            return jsonify({"message": "No visualizations generated (empty data)"}), 200
        base_url = os.getenv("GRAPH_BASE_URL", "http://127.0.0.1:5001/graphs/")
        absolute_urls = [url if url.startswith('http') else f"{base_url}{url.split('/')[-1]}" for url in image_urls]
        logger.info(f"Generated {len(absolute_urls)} visualizations: {absolute_urls}")
        return jsonify({"images": absolute_urls}), 200
    except Exception as e:
        logger.error(f"Visualization error: {e}", exc_info=True)
        return jsonify({"error": f"Visualization error: {str(e)}"}), 500

# Serve image files
@app.route("/graphs/<path:filename>")
def serve_graph(filename):
    try:
        logger.info(f"Serving graph file: {filename}")
        return send_from_directory(GRAPH_DIR, filename)
    except FileNotFoundError:
        logger.warning(f"Graph file not found: {filename}")
        return jsonify({"error": "Graph not found"}), 404
    except Exception as e:
        logger.error(f"Error serving graph: {e}", exc_info=True)
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# Delete items
@app.route("/delete_items", methods=["POST"])
def delete_items():
    try:
        data = request.get_json()
        items_to_delete = data.get("items", [])
        if not items_to_delete or not isinstance(items_to_delete, list):
            logger.warning("No valid items provided to delete")
            return jsonify({"error": "No valid items provided to delete"}), 400
        result = menu_collection.delete_many({"name": {"$in": items_to_delete}})
        logger.info(f"Deleted {result.deleted_count} menu items")
        return jsonify({"message": f"{result.deleted_count} items deleted"}), 200
    except Exception as e:
        logger.error(f"Error deleting items: {e}", exc_info=True)
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# Run Flask App
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    debug = os.getenv("FLASK_DEBUG", "True") == "True"
    logger.info(f"Starting Flask app on port {port} with debug={debug}")
    try:
        app.run(debug=debug, host="127.0.0.1", port=port)
    except Exception as e:
        logger.error(f"Failed to start Flask server: {e}", exc_info=True)
        raise
