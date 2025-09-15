#!/usr/bin/env python3
"""
Simple Flashcard Application
A command-line flashcard application for studying and memorization.
"""

import csv
import random
import os
import sys


class Flashcard:
    """Represents a single flashcard with a question and answer."""
    
    def __init__(self, question, answer):
        self.question = question
        self.answer = answer
    
    def __str__(self):
        return f"Q: {self.question} | A: {self.answer}"


class FlashcardDeck:
    """Manages a collection of flashcards."""
    
    def __init__(self):
        self.cards = []
    
    def add_card(self, question, answer):
        """Add a new flashcard to the deck."""
        card = Flashcard(question, answer)
        self.cards.append(card)
    
    def load_from_csv(self, filename):
        """Load flashcards from a CSV file."""
        try:
            with open(filename, 'r', encoding='utf-8') as file:
                reader = csv.reader(file)
                # Skip header row if present
                header = next(reader, None)
                if header and header[0].lower() != 'question':
                    # If first row doesn't look like a header, treat it as data
                    self.add_card(header[0], header[1] if len(header) > 1 else "")
                
                for row in reader:
                    if len(row) >= 2:
                        self.add_card(row[0], row[1])
            print(f"Loaded {len(self.cards)} flashcards from {filename}")
        except FileNotFoundError:
            print(f"Error: File '{filename}' not found.")
        except Exception as e:
            print(f"Error loading file: {e}")
    
    def shuffle(self):
        """Shuffle the order of flashcards."""
        random.shuffle(self.cards)
    
    def study_mode(self):
        """Interactive study mode."""
        if not self.cards:
            print("No flashcards available. Please load some first.")
            return
        
        print(f"\nStarting study session with {len(self.cards)} cards.")
        print("Press Enter to reveal answer, 'q' to quit, 's' to skip.\n")
        
        correct = 0
        total = 0
        
        for i, card in enumerate(self.cards, 1):
            print(f"Card {i}/{len(self.cards)}")
            print(f"Question: {card.question}")
            
            user_input = input("Press Enter to see answer (or 'q' to quit, 's' to skip): ").strip()
            
            if user_input.lower() == 'q':
                break
            elif user_input.lower() == 's':
                print("Skipped!\n")
                continue
            
            print(f"Answer: {card.answer}")
            
            while True:
                response = input("Did you get it right? (y/n): ").strip().lower()
                if response in ['y', 'yes']:
                    correct += 1
                    total += 1
                    print("Great job!\n")
                    break
                elif response in ['n', 'no']:
                    total += 1
                    print("Keep studying!\n")
                    break
                else:
                    print("Please enter 'y' for yes or 'n' for no.")
        
        if total > 0:
            percentage = (correct / total) * 100
            print(f"Study session complete!")
            print(f"Score: {correct}/{total} ({percentage:.1f}%)")


def main():
    """Main function to run the flashcard application."""
    deck = FlashcardDeck()
    
    print("Welcome to the Flashcard Application!")
    print("=====================================")
    
    while True:
        print("\nOptions:")
        print("1. Load flashcards from CSV file")
        print("2. Add a flashcard manually")
        print("3. View all flashcards")
        print("4. Shuffle deck")
        print("5. Start study session")
        print("6. Quit")
        
        choice = input("\nEnter your choice (1-6): ").strip()
        
        if choice == '1':
            filename = input("Enter CSV filename (default: examples.csv): ").strip()
            if not filename:
                filename = "examples.csv"
            deck.load_from_csv(filename)
        
        elif choice == '2':
            question = input("Enter question: ").strip()
            answer = input("Enter answer: ").strip()
            if question and answer:
                deck.add_card(question, answer)
                print("Flashcard added!")
            else:
                print("Both question and answer are required.")
        
        elif choice == '3':
            if deck.cards:
                print(f"\nAll flashcards ({len(deck.cards)}):")
                for i, card in enumerate(deck.cards, 1):
                    print(f"{i}. {card}")
            else:
                print("No flashcards in deck.")
        
        elif choice == '4':
            deck.shuffle()
            print("Deck shuffled!")
        
        elif choice == '5':
            deck.study_mode()
        
        elif choice == '6':
            print("Thanks for using the Flashcard Application!")
            break
        
        else:
            print("Invalid choice. Please enter a number between 1 and 6.")


if __name__ == "__main__":
    main()