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

        # Create a menu lookup dictionary for quick access to cuisine, prices
        menu_lookup = {}
        for item in menu_items:
            if "name" not in item or "cuisine" not in item or "selling_price" not in item or "actual_price" not in item:
                logger.warning(f"Skipping menu item with missing fields: {item}")
                continue
            if not isinstance(item["name"], str) or not isinstance(item["cuisine"], str):
                logger.warning(f"Skipping menu item with invalid name or cuisine type: {item}")
                continue
            try:
                selling_price = float(item["selling_price"])
                actual_price = float(item["actual_price"])
            except (ValueError, TypeError) as e:
                logger.warning(f"Skipping menu item with invalid prices: {item} - {e}")
                continue
            menu_lookup[item["name"]] = {
                "cuisine": item["cuisine"],
                "selling_price": selling_price,
                "actual_price": actual_price
            }
        logger.info(f"Created menu lookup with {len(menu_lookup)} items")

        # Create a list for order data
        order_data = []
        for order in orders:
            if "datetime" not in order or not isinstance(order["datetime"], str):
                logger.warning(f"Skipping order with missing or invalid datetime: {order}")
                continue
            try:
                order_datetime = datetime.fromisoformat(order["datetime"])
            except ValueError as e:
                logger.warning(f"Skipping order with invalid datetime format: {order['datetime']} - {e}")
                continue

            for item in order.get("items", []):
                if not isinstance(item, str):
                    logger.warning(f"Skipping invalid item (not a string): {item}")
                    continue
                if item not in menu_lookup:
                    logger.warning(f"Skipping item not found in menu: {item}")
                    continue
                cuisine = menu_lookup[item]["cuisine"]
                selling_price = menu_lookup[item]["selling_price"]
                actual_price = menu_lookup[item]["actual_price"]
                profit_loss = selling_price - actual_price  # Profit per unit

                # Assign category based on order time
                # Breakfast: 6:00 AM - 10:59 AM
                # Lunch: 11:00 AM - 3:59 PM
                # Dinner: 4:00 PM - 9:59 PM
                # Other: All other times (e.g., late-night orders)
                hour = order_datetime.hour
                if 6 <= hour < 11:
                    category = "Breakfast"
                elif 11 <= hour < 16:
                    category = "Lunch"
                elif 16 <= hour < 22:
                    category = "Dinner"
                else:
                    category = "Other"

                order_data.append({
                    "item": item,
                    "datetime": order_datetime,
                    "cuisine": cuisine,
                    "profit_loss": profit_loss,
                    "selling_price": selling_price,
                    "category": category
                })

        # Create DataFrame
        if not order_data:
            logger.info("No valid order data to generate visualizations")
            return []

        df = pd.DataFrame(order_data)
        logger.info(f"Created DataFrame with {len(df)} rows")

        if df.empty:
            logger.info("DataFrame is empty, no visualizations to generate")
            return []

        # Convert 'datetime' to timezone-naive datetime64
        try:
            df['datetime'] = pd.to_datetime(df['datetime'], errors='coerce', utc=True).dt.tz_localize(None)
            invalid_datetimes = df['datetime'].isna().sum()
            if invalid_datetimes > 0:
                logger.warning(f"Found {invalid_datetimes} invalid datetime values, dropping them")
                df = df.dropna(subset=['datetime'])
                logger.info(f"DataFrame after dropping invalid datetimes: {len(df)} rows")
            logger.info("Converted 'datetime' column to timezone-naive datetime64")
        except Exception as e:
            logger.error(f"Failed to convert datetime column: {e}", exc_info=True)
            return []

        if df.empty:
            logger.info("DataFrame is empty after datetime processing, no visualizations to generate")
            return []

        # List to store graph URLs
        graph_urls = []

        # Set consistent seaborn style for all plots
        sns.set_style("whitegrid")

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
                plt.savefig(cuisine_graph_path, bbox_inches='tight')
                plt.close()
                logger.info(f"Saved graph: {cuisine_graph_path}")
                graph_urls.append("cuisine_pie.png")
        except Exception as e:
            logger.error(f"Error generating Cuisine Pie Chart: {e}", exc_info=True)

        # 2. Monthly Sales Graph
        try:
            df['month'] = df['datetime'].dt.to_period('M')
            monthly_sales = df.groupby('month').size()
            if monthly_sales.empty:
                logger.warning("No monthly sales data to plot, skipping Monthly Sales Graph")
            else:
                plt.figure(figsize=(10, 6))
                sns.barplot(x=monthly_sales.values, y=monthly_sales.index.astype(str), hue=monthly_sales.index.astype(str), legend=False)
                plt.title("Monthly Sales (Number of Orders)")
                plt.xlabel("Number of Orders")
                plt.ylabel("Month")
                monthly_sales_graph_path = os.path.join(graph_dir, "monthly_sales.png")
                plt.savefig(monthly_sales_graph_path, bbox_inches='tight')
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
                sns.barplot(x=item_counts.values, y=item_counts.index, hue=item_counts.index, legend=False)
                plt.title("Top 10 Most Ordered Items")
                plt.xlabel("Number of Orders")
                plt.ylabel("Item")
                top_items_graph_path = os.path.join(graph_dir, "top_items.png")
                plt.savefig(top_items_graph_path, bbox_inches='tight')
                plt.close()
                logger.info(f"Saved graph: {top_items_graph_path}")
                graph_urls.append("top_items.png")
        except Exception as e:
            logger.error(f"Error generating Top Items Graph: {e}", exc_info=True)

        # 4. Peak Hours Graph
        try:
            df['hour'] = df['datetime'].dt.hour.astype(int)  # Ensure hour is numeric
            hourly_orders = df.groupby('hour').size()
            if hourly_orders.empty:
                logger.warning("No hourly data to plot, skipping Peak Hours Graph")
            else:
                plt.figure(figsize=(10, 6))
                sns.barplot(x=hourly_orders.index, y=hourly_orders.values, hue=hourly_orders.index, legend=False)
                plt.title("Orders by Hour of Day (Peak Hours)")
                plt.xlabel("Hour of Day (0-23)")
                plt.ylabel("Number of Orders")
                plt.xticks(rotation=45)
                peak_hours_graph_path = os.path.join(graph_dir, "peak_hours.png")
                plt.savefig(peak_hours_graph_path, bbox_inches='tight')
                plt.close()
                logger.info(f"Saved graph: {peak_hours_graph_path}")
                graph_urls.append("peak_hours.png")
        except Exception as e:
            logger.error(f"Error generating Peak Hours Graph: {e}", exc_info=True)

        # 5. Profit and Loss by Item
        try:
            profit_loss_by_item = df.groupby('item')['profit_loss'].sum()
            if profit_loss_by_item.empty:
                logger.warning("No profit/loss data to plot, skipping Profit and Loss by Item Graph")
            else:
                plt.figure(figsize=(10, 6))
                sns.barplot(x=profit_loss_by_item.values, y=profit_loss_by_item.index, hue=profit_loss_by_item.index, palette='RdYlGn', legend=False)
                plt.title("Total Profit/Loss by Item")
                plt.xlabel("Profit/Loss (₹)")
                plt.ylabel("Item")
                profit_loss_item_path = os.path.join(graph_dir, "profit_loss_by_item.png")
                plt.savefig(profit_loss_item_path, bbox_inches='tight')
                plt.close()
                logger.info(f"Saved graph: {profit_loss_item_path}")
                graph_urls.append("profit_loss_by_item.png")
        except Exception as e:
            logger.error(f"Error generating Profit and Loss by Item Graph: {e}", exc_info=True)

        # 6. Most Profitable Items
        try:
            profit_by_item = df.groupby('item')['profit_loss'].sum().nlargest(5)
            if profit_by_item.empty:
                logger.warning("No profit data to plot, skipping Most Profitable Items Graph")
            else:
                plt.figure(figsize=(10, 6))
                sns.barplot(x=profit_by_item.values, y=profit_by_item.index, hue=profit_by_item.index, palette='Greens', legend=False)
                plt.title("Top 5 Most Profitable Items")
                plt.xlabel("Total Profit (₹)")
                plt.ylabel("Item")
                most_profitable_path = os.path.join(graph_dir, "most_profitable_items.png")
                plt.savefig(most_profitable_path, bbox_inches='tight')
                plt.close()
                logger.info(f"Saved graph: {most_profitable_path}")
                graph_urls.append("most_profitable_items.png")
        except Exception as e:
            logger.error(f"Error generating Most Profitable Items Graph: {e}", exc_info=True)

        # 7. Top Items with Losses
        try:
            loss_by_item = df.groupby('item')['profit_loss'].sum()
            loss_by_item = loss_by_item[loss_by_item < 0].nsmallest(5, key=abs)  # Top 5 items with losses (most negative)
            if loss_by_item.empty:
                logger.warning("No loss data to plot, skipping Top Items with Losses Graph")
            else:
                plt.figure(figsize=(10, 6))
                sns.barplot(x=loss_by_item.values, y=loss_by_item.index, hue=loss_by_item.index, palette='Reds', legend=False)
                plt.title("Top 5 Items with Losses")
                plt.xlabel("Total Loss (₹)")
                plt.ylabel("Item")
                loss_item_path = os.path.join(graph_dir, "loss_by_item.png")
                plt.savefig(loss_item_path, bbox_inches='tight')
                plt.close()
                logger.info(f"Saved graph: {loss_item_path}")
                graph_urls.append("loss_by_item.png")
        except Exception as e:
            logger.error(f"Error generating Top Items with Losses Graph: {e}", exc_info=True)

        # 8. Profit and Loss Over Time
        try:
            profit_loss_by_month = df.groupby('month')['profit_loss'].sum()
            if profit_loss_by_month.empty:
                logger.warning("No profit/loss data to plot, skipping Profit and Loss Over Time Graph")
            elif profit_loss_by_month.nunique() <= 1:
                logger.warning("Profit/Loss data has no variation, skipping Profit and Loss Over Time Graph")
            else:
                plt.figure(figsize=(10, 6))
                profit_loss_by_month.plot(kind='line', marker='o', color='purple')
                plt.title("Profit/Loss Over Time")
                plt.xlabel("Month")
                plt.ylabel("Profit/Loss (₹)")
                plt.xticks(rotation=45)
                plt.grid(True)
                profit_loss_time_path = os.path.join(graph_dir, "profit_loss_over_time.png")
                plt.savefig(profit_loss_time_path, bbox_inches='tight')
                plt.close()
                logger.info(f"Saved graph: {profit_loss_time_path}")
                graph_urls.append("profit_loss_over_time.png")
        except Exception as e:
            logger.error(f"Error generating Profit and Loss Over Time Graph: {e}", exc_info=True)

        # 9. Category Pie Chart
        try:
            category_counts = df['category'].value_counts()
            if category_counts.empty:
                logger.warning("No category data to plot, skipping Category Pie Chart")
            else:
                plt.figure(figsize=(8, 8))
                plt.pie(category_counts, labels=category_counts.index, autopct='%1.1f%%', startangle=140)
                plt.title("Distribution of Orders by Category (Breakfast, Lunch, Dinner)")
                category_graph_path = os.path.join(graph_dir, "category_pie.png")
                plt.savefig(category_graph_path, bbox_inches='tight')
                plt.close()
                logger.info(f"Saved graph: {category_graph_path}")
                graph_urls.append("category_pie.png")
        except Exception as e:
            logger.error(f"Error generating Category Pie Chart: {e}", exc_info=True)

        # 10. Orders by Category Over Time
        try:
            category_by_month = df.groupby(['month', 'category']).size().unstack(fill_value=0)
            if category_by_month.empty:
                logger.warning("No category data to plot, skipping Orders by Category Over Time Graph")
            else:
                plt.figure(figsize=(12, 6))
                category_by_month.plot(kind='line', marker='o')
                plt.title("Orders by Category Over Time")
                plt.xlabel("Month")
                plt.ylabel("Number of Orders")
                plt.xticks(rotation=45)
                plt.legend(title="Category")
                plt.grid(True)
                category_time_path = os.path.join(graph_dir, "category_over_time.png")
                plt.savefig(category_time_path, bbox_inches='tight')
                plt.close()
                logger.info(f"Saved graph: {category_time_path}")
                graph_urls.append("category_over_time.png")
        except Exception as e:
            logger.error(f"Error generating Orders by Category Over Time Graph: {e}", exc_info=True)

        if not graph_urls:
            logger.warning("No graphs were generated due to lack of data")
            return []

        logger.info(f"Generated {len(graph_urls)} visualizations: {graph_urls}")
        return graph_urls
    except Exception as e:
        logger.error(f"Error in generate_graphs: {e}", exc_info=True)
        raise
