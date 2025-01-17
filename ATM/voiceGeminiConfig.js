const dotenv = require('dotenv');
dotenv.config();
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generationConfig = {
  maxOutputTokens: 800,
  temperature: 0.8,
  topP: 0.2,
  topK: 15,
};

const safetySettings = [
  {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const modelOptions = {
  model: "gemini-1.5-flash",
  systemInstruction:
`
The context of this is that the prompts will be things that were translated from voice to text.
I want you to convert the speech's text to instructions based on the syntax below.
1. Withdraw x dollars -> If there is no ammount stated, x = 0. x must always be > 0
2. Deposit x dollars into x Account -> If there is no ammount stated, x = 0. x must always be > 0. Account must be a 16 digit code
2. Transfer x dollars into x Account -> If there is no ammount stated, x = 0. x must always be > 0. Account must be a 16 digit code
3. Report -> This can be called when asking for financial report or balance, as the report contains both.
4. Exit
5. View Tutorials
6. Activate Tutorial x -> x can be ["Cash Transfer", "Cash Withdraw", "Cash Deposit"]
7. Register Face ID
8. Report A Problem
If the text cannot be converted into the above 8 types, then give back "Nothing"
`,
  generationConfig: generationConfig,
  safetySettings: safetySettings,
};

const geminiChatModel = genAI.getGenerativeModel(modelOptions);

module.exports = geminiChatModel;