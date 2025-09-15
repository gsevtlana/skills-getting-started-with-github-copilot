import argparse
import json
import os
import csv
from datetime import datetime, timedelta

DATA_FILE = "flashcards.json"

def load_data():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_data(cards):
    with open(DATA_FILE, "w") as f:
        json.dump(cards, f, indent=2)

def add_card(front, back):
    cards = load_data()
    card = {
        "front": front,
        "back": back,
        "interval": 1,
        "due": datetime.now().isoformat(),
        "repetitions": 0,
        "ease": 2,
        "last_rating": None
    }
    cards.append(card)
    save_data(cards)
    print(f"Added: {front} -> {back}")

def import_csv(filename):
    cards = load_data()
    with open(filename, "r", newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            cards.append({
                "front": row["front"],
                "back": row["back"],
                "interval": 1,
                "due": datetime.now().isoformat(),
                "repetitions": 0,
                "ease": 2,
                "last_rating": None
            })
    save_data(cards)
    print(f"Imported from {filename}")

def review():
    cards = load_data()
    now = datetime.now()
    due_cards = [c for c in cards if datetime.fromisoformat(c["due"]) <= now]
    if not due_cards:
        print("No cards due for review.")
        return
    for card in due_cards:
        print(f"Front: {card['front']}")
        input("Press Enter to show answer...")
        print(f"Back: {card['back']}")
        rating = input("How did you do? (0=forgot, 1=hard, 2=medium, 3=easy): ")
        try:
            rating = int(rating)
        except ValueError:
            rating = 0
        # Simple SM-2-lite scheduling
        if rating == 0:
            card["interval"] = 1
        elif rating == 1:
            card["interval"] = max(1, card["interval"])
        elif rating == 2:
            card["interval"] = int(card["interval"] * 2)
        elif rating == 3:
            card["interval"] = int(card["interval"] * 3)
        else:
            card["interval"] = 1
        card["due"] = (now + timedelta(days=card["interval"])).isoformat()
        card["repetitions"] += 1
        card["ease"] = rating
        card["last_rating"] = rating
    save_data(cards)
    print("Review complete.")

def stats():
    cards = load_data()
    print(f"Total cards: {len(cards)}")
    due = sum(datetime.fromisoformat(c["due"]) <= datetime.now() for c in cards)
    print(f"Cards due: {due}")
    print(f"Average ease: {sum(c.get('ease',2) for c in cards)/len(cards) if cards else 0:.2f}")

def main():
    parser = argparse.ArgumentParser(description="CLI Flashcard Review")
    subparsers = parser.add_subparsers(dest="cmd")

    add_p = subparsers.add_parser("add")
    add_p.add_argument("front")
    add_p.add_argument("back")

    import_p = subparsers.add_parser("import")
    import_p.add_argument("filename")

    subparsers.add_parser("review")
    subparsers.add_parser("stats")

    args = parser.parse_args()

    if args.cmd == "add":
        add_card(args.front, args.back)
    elif args.cmd == "import":
        import_csv(args.filename)
    elif args.cmd == "review":
        review()
    elif args.cmd == "stats":
        stats()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
