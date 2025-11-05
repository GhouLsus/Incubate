from app.core.database import SessionLocal
from app.models.sweet import Sweet

def seed_sweets():
    db = SessionLocal()

    # Clear existing records for a clean start
    db.query(Sweet).delete()
    db.commit()

    sweets_data = [
        # 🍯 Traditional
        {
            "name": "Gulab Jamun",
            "category": "Traditional",
            "description": "Soft, syrupy fried dough balls soaked in cardamom syrup.",
            "price": 50.0,
            "quantity": 20,
        },
        {
            "name": "Jalebi",
            "category": "Traditional",
            "description": "Crispy, spiral sweet soaked in saffron sugar syrup.",
            "price": 40.0,
            "quantity": 25,
        },

        # 🥛 Milk-based
        {
            "name": "Milk Barfi",
            "category": "Milk Sweet",
            "description": "Creamy fudge made from condensed milk and sugar.",
            "price": 45.0,
            "quantity": 18,
        },
        {
            "name": "Kalakand",
            "category": "Milk Sweet",
            "description": "Grainy, rich milk cake topped with pistachios.",
            "price": 60.0,
            "quantity": 12,
        },

        # 🌰 Dry Fruit Specials
        {
            "name": "Kaju Katli",
            "category": "Dry Fruit",
            "description": "Cashew diamond fudge — rich and smooth.",
            "price": 100.0,
            "quantity": 10,
        },
        {
            "name": "Badam Halwa",
            "category": "Dry Fruit",
            "description": "Ground almond pudding cooked in ghee and milk.",
            "price": 90.0,
            "quantity": 8,
        },

        # 🌸 Festive Favorites
        {
            "name": "Motichoor Ladoo",
            "category": "Festive",
            "description": "Golden pearls of gram flour bound with ghee and sugar.",
            "price": 35.0,
            "quantity": 30,
        },
        {
            "name": "Besan Ladoo",
            "category": "Festive",
            "description": "Roasted gram flour balls with cardamom flavor.",
            "price": 30.0,
            "quantity": 22,
        },

        # 🍬 Regional
        {
            "name": "Rasgulla",
            "category": "Bengali",
            "description": "Spongy cottage cheese balls soaked in sugar syrup.",
            "price": 40.0,
            "quantity": 15,
        },
        {
            "name": "Sandesh",
            "category": "Bengali",
            "description": "Delicate milk sweet infused with rose and cardamom.",
            "price": 55.0,
            "quantity": 14,
        },

        # 💜 Specials
        {
            "name": "Chocolate Barfi",
            "category": "Fusion",
            "description": "Layered barfi with rich chocolate and vanilla flavors.",
            "price": 70.0,
            "quantity": 10,
        },
        {
            "name": "Coconut Ladoo",
            "category": "Coconut",
            "description": "Soft, chewy coconut sweets made with milk and sugar.",
            "price": 25.0,
            "quantity": 28,
        },
    ]

    for sweet_data in sweets_data:
        sweet = Sweet(**sweet_data)
        db.add(sweet)

    db.commit()
    db.close()
    print("✅ Added sample sweets successfully!")

if __name__ == "__main__":
    seed_sweets()
