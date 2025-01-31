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

1. Withdraw x dollars:
If no amount is stated, amount = 0 (default).
Amount must always be greater than 0.
Output:
{
"task": "Withdraw",
"amount": x,
"type": null
}
2. Deposit x Account:
x can be one of: "Current Account", "Savings Account", "360 Account", "null".
Output:
{
"task": "Deposit",
"amount": null,
"type": x
}
3. Transfer x dollars into x Account:
If no amount is stated, amount = 0 (default).
Amount must always be greater than 0.
Account must be a 16-digit code.
Output:
{
"task": "Transfer",
"amount": x,
"type": null
}
4.Report:
Called when asking for a financial report or balance (both are included in "Report").
Output:
{
"task": "Report",
"amount": null,
"type": null
}
5.Exit:
Output:
{
"task": "Exit",
"amount": null,
"type": null
}
6.View Tutorials:
Output:
{
"task": "ViewTutorials",
"amount": null,
"type": null
}
7.Activate Tutorial x:
x can be one of: "Cash Transfer", "Cash Withdraw", "Cash Deposit".
Output:
{
"task": "ActivateTutorial",
"amount": null,
"type": x
}
8.Register Face ID:
Output:
{
"task": "RegisterFaceID",
"amount": null,
"type": null
}
9.Report A Problem:
Output:
{
"task": "ReportProblem",
"amount": null,
"type": null
}

General Rule:
If the text cannot be converted into any of the above types, return:
{
"task": "Nothing",
"amount": null,
"type": null
}
Return a stringified json.
`,
  generationConfig: generationConfig,
  safetySettings: safetySettings,
};

const geminiChatModel = genAI.getGenerativeModel(modelOptions);

module.exports = geminiChatModel;