const fs = require('fs');
const path = require('path');

// Function to update IDs in a JSON file
function updateIdsInFile(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Update quiz/question IDs
    if (Array.isArray(data)) {
      data.forEach((quiz, quizIndex) => {
        quiz.id = (quizIndex + 1).toString();

        if (quiz.questions && Array.isArray(quiz.questions)) {
          quiz.questions.forEach((question, questionIndex) => {
            question.id = (questionIndex + 1).toString();
          });
        }

        // Update card set/card IDs
        if (quiz.cards && Array.isArray(quiz.cards)) {
          quiz.cards.forEach((card, cardIndex) => {
            card.id = (cardIndex + 1).toString();
          });
        }
      });
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated IDs in ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
}

// Get all JSON files in quizzes and cards directories
const quizzesDir = path.join(__dirname, 'lib', 'data', 'quizzes');
const cardsDir = path.join(__dirname, 'lib', 'data', 'cards');

function processDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
      if (file.endsWith('.json')) {
        const filePath = path.join(dirPath, file);
        updateIdsInFile(filePath);
      }
    });
  } else {
    console.log(`Directory ${dirPath} does not exist`);
  }
}

console.log('Starting ID update process...');
processDirectory(quizzesDir);
processDirectory(cardsDir);
console.log('ID update process completed.');
