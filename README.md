# Flashcards with Spaced Repetition

A web-based flashcard application implementing the spaced repetition learning technique. Created as part of the GitHub Copilot skills exercise.

## Features

- **Interactive Flashcards**: Create and study flashcards with a clean, user-friendly interface
- **Spaced Repetition Algorithm**: Uses SM-2 algorithm to optimize review intervals based on your performance
- **Performance Tracking**: Monitor your study statistics including success rate, streaks, and cards reviewed
- **Local Storage**: All data is saved locally in your browser
- **Responsive Design**: Works on desktop and mobile devices

## How to Use

1. **Open the Application**: Open `index.html` in your web browser
2. **Add Cards**: Go to "Manage Cards" tab to create new flashcards
3. **Study**: Use the "Study" tab to review cards due for review
4. **Rate Your Performance**: After seeing each answer, rate how well you knew it:
   - **Again (Hard)**: You didn't know the answer - card will be shown again soon
   - **Good**: You knew the answer with some effort - standard interval increase
   - **Easy**: You knew the answer immediately - longer interval before next review
5. **Track Progress**: Check the "Statistics" tab to see your learning progress

## Spaced Repetition Algorithm

The application uses the SM-2 (SuperMemo 2) algorithm which:
- Increases review intervals based on how well you know each card
- Cards you struggle with appear more frequently
- Cards you know well appear less frequently over time
- Maximizes long-term retention while minimizing study time

## Keyboard Shortcuts

While studying:
- **Spacebar**: Show answer
- **1**: Rate as "Again (Hard)"
- **2**: Rate as "Good"  
- **3**: Rate as "Easy"

## Technical Details

- Pure HTML, CSS, and JavaScript (no external dependencies)
- Responsive design with CSS Grid and Flexbox
- Local storage for data persistence
- Modern ES6+ JavaScript features

## Files

- `index.html`: Main application structure
- `styles.css`: All styling and responsive design
- `script.js`: Core functionality and spaced repetition algorithm

## Sample Cards

The application comes with sample cards to help you get started:
- HTML terminology
- Geography facts
- Basic math

You can delete these and add your own content for any subject you want to study.
