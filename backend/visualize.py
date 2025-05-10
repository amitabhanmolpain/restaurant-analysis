import matplotlib.pyplot as plt
import seaborn as sns
import os
from collections import Counter, defaultdict
from datetime import datetime
import matplotlib
matplotlib.use('Agg')

GRAPH_DIR = os.path.join(os.getcwd(), "graphs")
os.makedirs(GRAPH_DIR, exist_ok=True)
BASE_URL = "http://localhost:5000/graphs/"

def generate_graphs(order_collection, menu_collection):
    orders = list(order_collection.find())
    menu = list(menu_collection.find({}, {"_id": 0, "name": 1, "category": 1, "cuisine": 1}))

    item_to_category = {item["name"]: item.get("category", "Other") for item in menu}
    item_to_cuisine = {item["name"]: item.get("cuisine", "Other") for item in menu}

    all_items = []
    category_count = defaultdict(int)
    cuisine_count = defaultdict(int)
    category_bar = defaultdict(int)
    hourly_count = defaultdict(int)
    monthly_count = defaultdict(int)
    weekday_count = defaultdict(int)

    for order in orders:
        items = order.get("items", [])
        all_items.extend(items)

        for item in items:
            category = item_to_category.get(item, "Other")
            cuisine = item_to_cuisine.get(item, "Other")
            category_count[category] += 1
            cuisine_count[cuisine] += 1
            category_bar[category] += 1

        dt_str = order.get("datetime")
        if dt_str:
            try:
                dt = datetime.fromisoformat(dt_str)
                hour = dt.hour
                weekday = dt.strftime("%A")
                month = dt.strftime("%Y-%m")
                hourly_count[hour] += 1
                weekday_count[weekday] += 1
                monthly_count[month] += 1
            except:
                continue

    images = []

    # Top 10 Food Items
    if all_items:
        top_items = Counter(all_items).most_common(10)
        items, counts = zip(*top_items)
        plt.figure(figsize=(10, 6))
        sns.barplot(x=list(items), y=list(counts))
        plt.title("Top 10 Food Items")
        plt.xticks(rotation=45)
        plt.tight_layout()
        file = "top_items.png"
        plt.savefig(os.path.join(GRAPH_DIR, file))
        images.append(BASE_URL + file)
        plt.close()

    # Monthly Sales Trend
    if monthly_count:
        months, counts = zip(*sorted(monthly_count.items()))
        plt.figure(figsize=(10, 5))
        sns.lineplot(x=months, y=counts, marker="o")
        plt.title("Monthly Sales Trend")
        plt.xticks(rotation=45)
        plt.tight_layout()
        file = "monthly_sales.png"
        plt.savefig(os.path.join(GRAPH_DIR, file))
        images.append(BASE_URL + file)
        plt.close()

    # Sales by Day of the Week
    if weekday_count:
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        counts = [weekday_count.get(day, 0) for day in days]
        plt.figure(figsize=(10, 5))
        sns.barplot(x=days, y=counts)
        plt.title("Sales by Day of the Week")
        plt.xticks(rotation=45)
        plt.tight_layout()
        file = "weekday_sales.png"
        plt.savefig(os.path.join(GRAPH_DIR, file))
        images.append(BASE_URL + file)
        plt.close()

    # Category-wise Order Distribution (Pie)
    if category_count:
        labels, values = zip(*category_count.items())
        plt.figure(figsize=(6, 6))
        plt.pie(values, labels=labels, autopct='%1.1f%%', startangle=140)
        plt.title("Category-wise Order Distribution")
        plt.tight_layout()
        file = "category_pie.png"
        plt.savefig(os.path.join(GRAPH_DIR, file))
        images.append(BASE_URL + file)
        plt.close()

    # Cuisine-wise Order Distribution (Pie)
    if cuisine_count:
        labels, values = zip(*cuisine_count.items())
        plt.figure(figsize=(6, 6))
        plt.pie(values, labels=labels, autopct='%1.1f%%', startangle=140)
        plt.title("Cuisine-wise Order Distribution")
        plt.tight_layout()
        file = "cuisine_pie.png"
        plt.savefig(os.path.join(GRAPH_DIR, file))
        images.append(BASE_URL + file)
        plt.close()

    # Sales by Category (Bar)
    if category_bar:
        labels, values = zip(*category_bar.items())
        plt.figure(figsize=(8, 5))
        sns.barplot(x=labels, y=values)
        plt.title("Sales by Category (Breakfast, Lunch, Dinner)")
        plt.xticks(rotation=45)
        plt.tight_layout()
        file = "sales_by_category.png"
        plt.savefig(os.path.join(GRAPH_DIR, file))
        images.append(BASE_URL + file)
        plt.close()

    # Peak Hour Analysis
    if hourly_count:
        hours = list(range(24))
        values = [hourly_count.get(h, 0) for h in hours]
        plt.figure(figsize=(10, 5))
        sns.lineplot(x=hours, y=values, marker="o")
        plt.title("Peak Hour Order Distribution")
        plt.xlabel("Hour of Day")
        plt.ylabel("Number of Orders")
        plt.xticks(hours)
        plt.tight_layout()
        file = "peak_hours.png"
        plt.savefig(os.path.join(GRAPH_DIR, file))
        images.append(BASE_URL + file)
        plt.close()

    return images
