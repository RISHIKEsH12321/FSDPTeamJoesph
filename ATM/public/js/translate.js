// Get all the text elements on the page
function getTextElements() {
  // Get all text nodes within the body, excluding script, style, iframe, and #languageSelector (including its options)
  return $('body').find('*').not('script, style, iframe, #languageSelector, #languageSelector option').contents().filter(function() {
    return this.nodeType === 3 && this.nodeValue.trim() !== '';  // Text nodes only
  }).map(function() {
    return this.nodeValue.trim();  // Return the text content
  }).get();
}

// Sleep function to delay the next request
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Translate the text using DeepL API
// async function translateText(textArray, targetLang) {
//   const url = '/translate'; // Use the proxy endpoint

//   const requests = textArray.map((text) => {
//       return $.post(url, {
//           text: text,
//           target_lang: targetLang
//       });
//   });

//   Promise.all(requests)
//       .then(responses => {
//           responses.forEach((response, index) => {
//               const translatedText = response.translations[0].text;
//               replaceText(translatedText, textArray[index]);
//           });
//       })
//       .catch(err => {
//           console.error('Error translating text:', err);
//       });
// }
async function translateText(textArray, targetLang) { 
  const url = '/translate'; 
 
  try { 
      console.log("Sending request:", { textArray, targetLang }); 
 
      // Send all text elements in a single request 
      const response = await $.post(url, { text: textArray, target_lang: targetLang }); 
 
      console.log("Translation response:", response); 
 
      // Ensure response format is correct before replacing text 
      if (response.translations && response.translations.length === textArray.length) { 
          response.translations.forEach((translation, index) => { 
              replaceText(translation.text, textArray[index]); 
          }); 
      } else { 
          console.error('Translation response mismatch:', response); 
      } 
 
  } catch (error) { 
      console.error('Error translating text:', error); 
  } 
}


// Replace the original text with the translated text
function replaceText(translatedText, originalText) {
  // Iterate through all elements in the body
  $('body').find('*').each(function() {
    // Find text nodes and replace the text content if it matches the original text
    $(this).contents().filter(function() {
      return this.nodeType === 3 && this.nodeValue.trim() === originalText;
    }).each(function() {
      // Replace only the text node's content, keeping the HTML structure intact
      this.nodeValue = translatedText;
    });
  });
}

// Event listener for language change
$(document).ready(function() {
  // Check if language is stored in sessionStorage when page loads
  const storedLang = sessionStorage.getItem('selectedLang');
  console.log(storedLang);
  if (storedLang) {
    $('#languageSelector').val(storedLang); // Set the selected language
    const textElements = getTextElements();
    translateText(textElements, storedLang); // Translate based on the stored language
  }

  $('#languageSelector').change(function() {
    const targetLang = $(this).val();  // Get selected language
    sessionStorage.setItem('selectedLang', targetLang);  // Store the selected language in sessionStorage
    const textElements = getTextElements();  // Get all text on the page
    translateText(textElements, targetLang);  // Translate the text
  });
});