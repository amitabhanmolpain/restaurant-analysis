# app.py (Streamlit Frontend)

import streamlit as st
import requests
from datetime import datetime

BASE_URL = "http://localhost:5000"

st.title("Restaurant Analytics Dashboard")

menu = st.sidebar.selectbox("Choose Option", ["Add Item to Menu", "Place Order", "Visualize", "Delete Item"])	

if menu == "Add Item to Menu":
    st.header("Add New Food Item")
    
    name = st.text_input("Food Name")
    price = st.number_input("Price", min_value=0.0, step=0.1)
    category = st.selectbox("Category", ["Breakfast", "Lunch", "Dinner"])
    cuisine = st.selectbox("Cuisine", [
        "North Indian", "South Indian", "Chinese", "Chaat", "Sweets", "Beverages", "Other"
    ])

    if st.button("Add Item"):
        if name.strip() == "":
            st.error("Please enter a food name.")
        else:
            data = {
                "name": name,
                "price": price,
                "category": category,
                "cuisine": cuisine
            }
            try:
                response = requests.post(f"{BASE_URL}/add_item", json=data)
                if response.status_code == 200:
                    st.success(response.json().get("message", "Item added!"))
                else:
                    st.error("Failed to add item.")
            except Exception as e:
                st.error(f"Error: {e}")



elif menu == "Place Order":
    st.header("Place an Order")
    # Use /get_items to fetch menu items (make sure this route exists in your backend)
    try:
        items_response = requests.get(f"{BASE_URL}/get_items")
        if items_response.status_code == 200:
            items = items_response.json().get("items", [])
            if not items:
                st.warning("No menu items available. Please add items first.")
            else:
                item_names = [item["name"] for item in items]
                selected_items = st.multiselect("Select Items", item_names)
                if st.button("Place Order") and selected_items:
                    order = {
                        "items": selected_items,
                        "datetime": datetime.now().isoformat()
                    }
                    order_response = requests.post(f"{BASE_URL}/place_order", json=order)
                    if order_response.status_code == 200:
                        st.success(order_response.json().get("message", "Order placed!"))
                    else:
                        st.error("Failed to place order.")
        else:
            st.error("Failed to fetch menu items.")
    except Exception as e:
        st.error(f"Error: {e}")

elif menu == "Visualize":
    st.header("Sales Visualizations")
    try:
        response = requests.get(f"{BASE_URL}/visualize")
        if response.status_code == 200:
            images = response.json().get("images", [])
            if not images:
                st.warning("No visualizations available.")
            for img_url in images:
               st.image(img_url, use_container_width=True)
        else:
            st.error(f"Failed to fetch visualizations (Status: {response.status_code}).")
    except Exception as e:
        st.error(f"Error fetching visualizations: {e}")
#deleting items from menu        
elif menu == "Delete Item":
    st.header("Delete Menu Items")

    try:
        response = requests.get(f"{BASE_URL}/get_items")
        if response.status_code == 200:
            items = response.json().get("items", [])
            if not items:
                st.warning("No items in the menu.")
            else:
                # Group items by category and cuisine
                grouped = {}
                for item in items:
                    category = item.get("category", "Unspecified")
                    cuisine = item.get("cuisine", "Unspecified")
                    grouped.setdefault(category, {}).setdefault(cuisine, []).append(item["name"])

                selected_to_delete = []

                for category, cuisines in grouped.items():
                    st.subheader(f"Category: {category}")  # Replace expander with subheader
                    for cuisine, names in cuisines.items():
                        st.write(f"**Cuisine: {cuisine}**")  # Replace expander with a simple label
                        selected = st.multiselect(
                            f"Select items to delete from {cuisine} ({category})",
                            names,
                            key=f"{category}-{cuisine}"
                        )
                        selected_to_delete.extend(selected)

                if selected_to_delete:
                    if st.button("Delete Selected Items"):
                        try:
                            del_response = requests.post(
                                f"{BASE_URL}/delete_items",
                                json={"items": selected_to_delete}
                            )
                            if del_response.status_code == 200:
                                st.success("Selected items deleted.")
                            else:
                                st.error("Failed to delete items.")
                        except Exception as e:
                            st.error(f"Error deleting items: {e}")
                else:
                    st.info("Select at least one item to delete.")
        else:
            st.error("Failed to fetch menu items.")
    except Exception as e:
        st.error(f"Error fetching menu: {e}")
1 