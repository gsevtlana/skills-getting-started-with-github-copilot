# Flashcard Application

A simple command-line flashcard application for studying and memorization, created as part of the GitHub Copilot getting started exercise.

## Features

- Load flashcards from CSV files
- Add flashcards manually
- Interactive study mode with scoring
- Shuffle flashcards for randomized studying
- View all flashcards in your deck

## Files

- `flashcards.py` - Main application with flashcard functionality
- `examples.csv` - Sample flashcard data to get started
- `README.md` - This documentation file

## Getting Started

### Prerequisites

- Python 3.6 or higher

### Installation

1. Clone this repository or download the files
2. No additional packages required - uses only Python standard library

### Usage

#### Running the Application

```bash
python flashcards.py
```

#### Loading Sample Data

The application comes with sample flashcards in `examples.csv`. When prompted, you can:
1. Choose option 1 (Load flashcards from CSV file)
2. Press Enter to use the default `examples.csv` file

#### Creating Your Own Flashcards

You can create your own CSV file with flashcards using the format:
```csv
question,answer
Your question here,Your answer here
Another question,Another answer
```

#### Study Mode

- Select option 5 to start studying
- Read each question and think of the answer
- Press Enter to reveal the correct answer
- Indicate whether you got it right (y/n)
- Get a final score at the end of your session

## Example CSV Format

The `examples.csv` file contains sample questions covering various topics:
- Geography
- Mathematics
- Literature
- Science
- Technology

Feel free to modify or replace it with your own study material.

## Exercise: Getting Started with GitHub Copilot

This project was created as part of learning GitHub Copilot. The flashcard application demonstrates:
- Python programming fundamentals
- File I/O operations
- Interactive command-line interfaces
- CSV data handling
- Object-oriented programming concepts
