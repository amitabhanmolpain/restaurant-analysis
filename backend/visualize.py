import matplotlib
matplotlib.use('Agg')  # Use non-GUI backend
import os
import logging
from datetime import datetime
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

# Configure logging
logger = logging.getLogger(__name__)

def generate_graphs(order_collection, menu_collection):
    try:
        logger.info("Starting generate_graphs function")
        # Ensure the graphs directory exists
        graph_dir = os.path.join(os.getcwd(), "graphs")
        os.makedirs(graph_dir, exist_ok=True)
        logger.info(f"Graph directory: {graph_dir}")

        # Fetch data from MongoDB
        orders = list(order_collection.find())
        menu_items = list(menu_collection.find())
        logger.info(f"Fetched {len(orders)} orders and {len(menu_items)} menu items")
        logger.debug(f"Orders: {orders}")
        logger.debug(f"Menu items: {menu_items}")

        # If no data, return empty list
        if not orders or not menu_items:
            logger.info("No data to generate visualizations")
            return []

        # Create a menu lookup dictionary for quick access to cuisine
        menu_lookup = {}
        for item in menu_items:
            if "name" not in item or "cuisine" not in item:
                logger.warning(f"Skipping menu item with missing name or cuisine: {item}")
                continue
            if not isinstance(item["name"], str) or not isinstance(item["cuisine"], str):
                logger.warning(f"Skipping menu item with invalid name or cuisine type: {item}")
                continue
            menu_lookup[item["name"]] = item["cuisine"]
        logger.info(f"Created menu lookup with {len(menu_lookup)} items")

        # Create a list for order data
        order_data = []
        for order in orders:
            # Skip orders without a valid datetime
            if "datetime" not in order or not isinstance(order["datetime"], str):
                logger.warning(f"Skipping order with missing or invalid datetime: {order}")
                continue
            try:
                order_datetime = datetime.fromisoformat(order["datetime"])
            except ValueError as e:
                logger.warning(f"Skipping order with invalid datetime format: {order['datetime']} - {e}")
                continue

            # Process each item in the order
            for item in order.get("items", []):
                if not isinstance(item, str):
                    logger.warning(f"Skipping invalid item (not a string): {item}")
                    continue
                # Skip items not in the menu
                if item not in menu_lookup:
                    logger.warning(f"Skipping item not found in menu: {item}")
                    continue
                cuisine = menu_lookup[item]
                order_data.append({
                    "item": item,
                    "datetime": order_datetime,
                    "cuisine": cuisine
                })

        # Create DataFrame
        if not order_data:
            logger.info("No valid order data to generate visualizations")
            return []

        df = pd.DataFrame(order_data)
        logger.info(f"Created DataFrame with {len(df)} rows: {df.head().to_dict()}")

        # If DataFrame is empty, return empty list
        if df.empty:
            logger.info("DataFrame is empty, no visualizations to generate")
            return []

        # Convert the 'datetime' column to pandas datetime64, handling timezone-aware datetimes
        try:
            df['datetime'] = pd.to_datetime(df['datetime'], utc=True).dt.tz_localize(None)
            logger.info("Converted 'datetime' column to timezone-naive datetime64")
        except Exception as e:
            logger.error(f"Failed to convert datetime column: {e}", exc_info=True)
            return []

        # Check for invalid datetime values
        invalid_datetimes = df['datetime'].isna().sum()
        if invalid_datetimes > 0:
            logger.warning(f"Found {invalid_datetimes} invalid datetime values in DataFrame")
            df = df.dropna(subset=['datetime'])
            logger.info(f"DataFrame after dropping invalid datetimes: {len(df)} rows")

        # If DataFrame is empty after dropping invalid datetimes, return empty list
        if df.empty:
            logger.info("DataFrame is empty after dropping invalid datetimes, no visualizations to generate")
            return []

        # List to store graph URLs
        graph_urls = []

        # 1. Cuisine Pie Chart
        try:
            cuisine_counts = df['cuisine'].value_counts()
            if cuisine_counts.empty:
                logger.warning("No cuisine data to plot, skipping Cuisine Pie Chart")
            else:
                plt.figure(figsize=(8, 8))
                plt.pie(cuisine_counts, labels=cuisine_counts.index, autopct='%1.1f%%', startangle=140)
                plt.title("Distribution of Orders by Cuisine")
                cuisine_graph_path = os.path.join(graph_dir, "cuisine_pie.png")
                plt.savefig(cuisine_graph_path)
                plt.close()
                logger.info(f"Saved graph: {cuisine_graph_path}")
                graph_urls.append("cuisine_pie.png")
        except Exception as e:
            logger.error(f"Error generating Cuisine Pie Chart: {e}", exc_info=True)

        # 2. Monthly Sales Graph
        try:
            logger.debug(f"Datetime column before to_period: {df['datetime'].head().to_list()}")
            df['month'] = df['datetime'].dt.to_period('M')
            logger.debug(f"Months after to_period: {df['month'].head().to_list()}")
            monthly_sales = df.groupby('month').size()
            logger.debug(f"Monthly sales: {monthly_sales.to_dict()}")
            if monthly_sales.empty:
                logger.warning("No monthly sales data to plot, skipping Monthly Sales Graph")
            else:
                plt.figure(figsize=(10, 6))
                sns.barplot(x=monthly_sales.values, y=monthly_sales.index.astype(str))
                plt.title("Monthly Sales (Number of Orders)")
                plt.xlabel("Number of Orders")
                plt.ylabel("Month")
                monthly_sales_graph_path = os.path.join(graph_dir, "monthly_sales.png")
                plt.savefig(monthly_sales_graph_path)
                plt.close()
                logger.info(f"Saved graph: {monthly_sales_graph_path}")
                graph_urls.append("monthly_sales.png")
        except Exception as e:
            logger.error(f"Error generating Monthly Sales Graph: {e}", exc_info=True)

        # 3. Top Items Graph
        try:
            item_counts = df['item'].value_counts().head(10)
            if item_counts.empty:
                logger.warning("No item data to plot, skipping Top Items Graph")
            else:
                plt.figure(figsize=(10, 6))
                sns.barplot(x=item_counts.values, y=item_counts.index)
                plt.title("Top 10 Most Ordered Items")
                plt.xlabel("Number of Orders")
                plt.ylabel("Item")
                top_items_graph_path = os.path.join(graph_dir, "top_items.png")
                plt.savefig(top_items_graph_path)
                plt.close()
                logger.info(f"Saved graph: {top_items_graph_path}")
                graph_urls.append("top_items.png")
        except Exception as e:
            logger.error(f"Error generating Top Items Graph: {e}", exc_info=True)

        # 4. Peak Hours Graph
        try:
            df['hour'] = df['datetime'].dt.hour
            hourly_orders = df.groupby('hour').size()
            if hourly_orders.empty:
                logger.warning("No hourly data to plot, skipping Peak Hours Graph")
            else:
                plt.figure(figsize=(10, 6))
                sns.barplot(x=hourly_orders.index, y=hourly_orders.values)
                plt.title("Orders by Hour of Day (Peak Hours)")
                plt.xlabel("Hour of Day (0-23)")
                plt.ylabel("Number of Orders")
                plt.xticks(rotation=45)
                peak_hours_graph_path = os.path.join(graph_dir, "peak_hours.png")
                plt.savefig(peak_hours_graph_path)
                plt.close()
                logger.info(f"Saved graph: {peak_hours_graph_path}")
                graph_urls.append("peak_hours.png")
        except Exception as e:
            logger.error(f"Error generating Peak Hours Graph: {e}", exc_info=True)

        # If no graphs were generated, log a warning
        if not graph_urls:
            logger.warning("No graphs were generated due to lack of data")
            return []

        logger.info(f"Generated {len(graph_urls)} visualizations: {graph_urls}")
        return graph_urls
    except Exception as e:
        logger.error(f"Error in generate_graphs: {e}", exc_info=True)
        raise
