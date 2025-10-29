/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Define the mappings for Sinhala characters
const VOWELS = {
  a: "අ",
  aa: "ආ",
  ae: "ඇ",
  aee: "ඈ",
  i: "ඉ",
  ii: "ඊ",
  u: "උ",
  uu: "ඌ",
  e: "එ",
  E: "ඒ",
  ee: "ඊ", // Changed to handle 'ee' as long 'i'
  ai: "ඓ",
  o: "ඔ",
  O: "ඕ", // Changed to handle 'O' as long 'o'
  oo: "ඕ",
  au: "ඖ",
  R: "ඍ",
  RR: "ඎ",
  I: "ඏ",
  II: "ඐ",
};

const VOWEL_MODIFIERS = {
  a: "",
  aa: "ා",
  ae: "ැ",
  aee: "ෑ",
  i: "ි",
  ii: "ී",
  u: "ු",
  uu: "ූ",
  e: "ෙ",
  E: "ේ",
  ee: "ී", // Changed to handle 'ee' as long 'i'
  ai: "ෛ",
  o: "ො",
  O: "ෝ", // Changed to handle 'O' as long 'o'
  oo: "ෝ",
  au: "ෞ",
  R: "ෘ",
  RR: "ෲ",
  I: "ෟ",
  II: "ෳ",
};

const CONSONANTS = {
  nnd: "ඬ",
  nng: "ඟ",
  h: "හ",
  n: "න",
  g: "ග",
  k: "ක",
  d: "ද",
  c: "ච",
  j: "ජ",
  t: "ට",
  p: "ප",
  b: "බ",
  m: "ම",
  y: "ය",
  r: "ර",
  l: "ල",
  v: "ව",
  w: "ව",
  s: "ස",
  S: "ෂ",
  sh: "ශ",
  f: "ෆ",
  x: "ං",
  N: "ණ",
  L: "ළ",
  K: "ඛ",
  G: "ඝ",
  C: "ඡ",
  J: "ඣ",
  T: "ඨ",
  D: "ඪ",
  P: "ඵ",
  B: "භ",
  th: "ත",
  dh: "ධ",
  ch: "ච",
  kh: "ඛ",
  gh: "ඝ",
  jh: "ඣ",
  ph: "ඵ",
  bh: "භ",
};

// Get the input and output elements
const inputElement = document.getElementById("singlish-input");
const outputElement = document.getElementById("unicode-output");
const predictionArea = document.getElementById('prediction-area'); // Get the prediction area element

// Function to find the longest matching key from a mapping
const findLongestMatch = (text, mapping) => {
  for (let i = 3; i > 0; i--) {
    if (text.length >= i) {
      const sub = text.substring(0, i);
      if (mapping[sub] !== undefined) {
        return sub;
      }
    }
  }
  return null;
};

// Function to convert Singlish to Unicode
const convertToUnicode = (text) => {
  let output = "";
  let i = 0;
  while (i < text.length) {
    let consumed = 0;

    // Check for consonant + vowel modifier
    let longestConsonant = findLongestMatch(text.substring(i), CONSONANTS);

    if (longestConsonant) {
      let nextPart = text.substring(i + longestConsonant.length);
      let longestVowel = findLongestMatch(nextPart, VOWEL_MODIFIERS);

      if (longestVowel) {
        output += CONSONANTS[longestConsonant] + VOWEL_MODIFIERS[longestVowel];
        consumed = longestConsonant.length + longestVowel.length;
      } else {
        output += CONSONANTS[longestConsonant] + "්";
        consumed = longestConsonant.length;
      }
    }

    if (consumed > 0) {
      i += consumed;
      continue;
    }

    // Check for standalone vowel
    let vowelMatch = findLongestMatch(text.substring(i), VOWELS);
    if (vowelMatch) {
      output += VOWELS[vowelMatch];
      consumed = vowelMatch.length;
    }

    if (consumed > 0) {
      i += consumed;
      continue;
    }

    // If no match, append the character as is
    output += text[i];
    i++;
  }
  return output;
};

// Function to generate and display predictions
const generatePredictions = (currentInput) => {
    predictionArea.innerHTML = ''; // Clear previous predictions

    if (currentInput.length === 0) {
        return;
    }

    // Get the last "word" or incomplete sequence for prediction
    const lastSpaceIndex = currentInput.lastIndexOf(' ');
    const originalActiveInput = lastSpaceIndex !== -1 ? currentInput.substring(lastSpaceIndex + 1) : currentInput;
    let activeInputForPrediction = originalActiveInput; // Use this for generating predictions

    if (activeInputForPrediction.length === 0) {
        return;
    }

    const predictions = [];
    const addedPredictions = new Set(); // To store unique predictions (singlish form)

    // Helper to add unique predictions
    const addUniquePrediction = (singlish, unicode) => {
        if (!addedPredictions.has(singlish)) {
            predictions.push({ singlish, unicode });
            addedPredictions.add(singlish);
        }
    };

    // --- Attempt predictions with activeInputForPrediction ---
    let foundPredictions = false;

    // Generate predictions from CONSONANTS
    for (const key in CONSONANTS) {
        if (key.startsWith(activeInputForPrediction)) {
            addUniquePrediction(key, CONSONANTS[key]);
            foundPredictions = true;
        }
    }

    // Generate predictions from VOWELS
    for (const key in VOWELS) {
        if (key.startsWith(activeInputForPrediction)) {
            addUniquePrediction(key, VOWELS[key]);
            foundPredictions = true;
        }
    }

    // Generate predictions for Consonant + Vowel Modifier combinations
    for (const consKey in CONSONANTS) {
        for (const vowelKey in VOWEL_MODIFIERS) {
            let combinedSinglish;
            let combinedUnicode;

            if (vowelKey === 'a') {
                combinedSinglish = consKey + 'a';
                combinedUnicode = CONSONANTS[consKey];
            } else {
                combinedSinglish = consKey + vowelKey;
                combinedUnicode = CONSONANTS[consKey] + VOWEL_MODIFIERS[vowelKey];
            }

            if (combinedSinglish.startsWith(activeInputForPrediction)) {
                addUniquePrediction(combinedSinglish, combinedUnicode);
                foundPredictions = true;
            }
        }
    }

    // --- Fallback: If no predictions found with activeInputForPrediction, try with its last character ---
    if (!foundPredictions && activeInputForPrediction.length > 0) {
        const lastCharOfActiveInput = activeInputForPrediction[activeInputForPrediction.length - 1];
        // Use the last character for fallback predictions
        const fallbackInput = lastCharOfActiveInput;

        // Generate predictions from CONSONANTS (starting with last char)
        for (const key in CONSONANTS) {
            if (key.startsWith(fallbackInput)) {
                addUniquePrediction(key, CONSONANTS[key]);
            }
        }

        // Generate predictions from VOWELS (starting with last char)
        for (const key in VOWELS) {
            if (key.startsWith(fallbackInput)) {
                addUniquePrediction(key, VOWELS[key]);
            }
        }

        // Generate predictions for Consonant + Vowel Modifier combinations (consonant part starting with last char)
        for (const consKey in CONSONANTS) {
            if (consKey.startsWith(fallbackInput)) { // Only if the consonant itself starts with the last char
                for (const vowelKey in VOWEL_MODIFIERS) {
                    let combinedSinglish;
                    let combinedUnicode;

                    if (vowelKey === 'a') {
                        combinedSinglish = consKey + 'a';
                        combinedUnicode = CONSONANTS[consKey];
                    } else {
                        combinedSinglish = consKey + vowelKey;
                        combinedUnicode = CONSONANTS[consKey] + VOWEL_MODIFIERS[vowelKey];
                    }
                    // Only add if the combinedSinglish starts with the fallbackInput
                    if (combinedSinglish.startsWith(fallbackInput)) {
                        addUniquePrediction(combinedSinglish, combinedUnicode);
                    }
                }
            }
        }
    }


    // Sort predictions for better user experience (e.g., alphabetically or by length)
    predictions.sort((a, b) => a.singlish.localeCompare(b.singlish));


    // Display predictions
    predictions.forEach(p => {
        const predictionItem = document.createElement('div');
        predictionItem.classList.add('prediction-item');
        predictionItem.textContent = `${p.singlish} -> ${p.unicode}`;
        predictionItem.addEventListener('click', () => {
            // Replace the last part of the input with the full prediction
            const newInputValue = currentInput.substring(0, currentInput.length - originalActiveInput.length) + p.singlish;
            inputElement.value = newInputValue;
            inputElement.dispatchEvent(new Event('input')); // Trigger input event
            inputElement.focus(); // Keep focus on the input
        });
        predictionArea.appendChild(predictionItem);
    });
};

// Add an event listener to the input element
inputElement.addEventListener("input", () => {
  const inputText = inputElement.value;
  const unicodeText = convertToUnicode(inputText);
  outputElement.textContent = unicodeText;
  generatePredictions(inputText); // Call generatePredictions
});

const copyButton = document.getElementById("copy-button");

copyButton.addEventListener("click", () => {
  const outputText = outputElement.textContent;
  navigator.clipboard.writeText(outputText).then(
    () => {
      copyButton.textContent = "Copied!";
      setTimeout(() => {
        copyButton.textContent = "Copy";
      }, 2000);
    },
    () => {
      // Handle potential errors here
      console.error("Failed to copy text to clipboard");
    }
  );
});

const clearButton = document.getElementById("clear-button");

clearButton.addEventListener("click", () => {
  inputElement.value = "";
  outputElement.textContent = "";
});

const helpIcon = document.getElementById('help-icon');
const helpModal = document.getElementById('help-modal');
const closeButton = document.querySelector('.close-button');

helpIcon.addEventListener('click', () => {
    helpModal.style.display = 'flex'; // Use flex to center the modal
});

closeButton.addEventListener('click', () => {
    helpModal.style.display = 'none';
});

// Close the modal if the user clicks outside of it
window.addEventListener('click', (event) => {
    if (event.target === helpModal) {
        helpModal.style.display = 'none';
    }
});

// Focus the input element when the page loads
inputElement.focus();
