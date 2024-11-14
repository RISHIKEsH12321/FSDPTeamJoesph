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
The context of your usage is the following. A report is being created in an ATM. The main feature that you are trying to support is 
increasing financial awareness of young adults. To do this a new ATM feature is being created. This feature shows the user how 
they have been spending money via graphs. In order to make the visit to the ATM a short one, a report is complied based on data 
used in the graphs. This data will be given to you.
You will be given data of the several types. 
1. Monthly total transaction amounts (Personal Transactions)
2. Spending breakdown by category (Personal Transactions: Medical, Shopping, Entertainment, etc)
3. Average spending per category (Personal Transactions: Medical, Shopping, Entertainment, etc)
4. Income vs. expenses by month (Both Personal and ATM (deposits, withdrawals, etc) transactions)
5. Number of transactions per day of the week
6. Balance over time (all of 2024's months)(Both Personal and ATM (deposits, withdrawals, etc) transactions)
Your Purpose is to give me a description of the financial situation based on the data given to you and advice on how to proceed in the future.
You will have to make 3 different description.
1. Which categories they are spending in and if that category(s) is affecting their finances in a negative or positive way.
2. How their income vs expenses are going on, what is the cause of the trends and how their balance will be like in the future if 
the current trend continies.
3. This will be a comprehensive plan on how to make them better manage their money. Give them some advice.
The 3 descriptions must be seperated via the following string '**SECTION SPLITS OFF HERE**'
This is an example:

## Financial Situation Analysis:
**1. Spending Categories and Impact:**
Your spending is primarily concentrated in three categories: Medical, Shopping, and
Entertainment. While these are common spending areas, the high amounts suggest they might
be impacting your finances negatively.
* **Medical:** It's important to ensure these expenses are necessary and not avoidable.
Consider exploring options like generic medications or negotiating medical bills.
* **Shopping:** This category often represents discretionary spending. Analyzing your
shopping habits and identifying areas where you can cut back or find cheaper alternatives can
significantly improve your financial situation.
* **Entertainment:** Entertainment is a crucial part of life, but it's essential to manage it within
your budget. Consider setting a monthly entertainment budget and sticking to it.

**SECTION SPLITS OFF HERE**

**2. Income vs. Expenses and Future Balance:**
Your income is consistently lower than your expenses, resulting in a steadily declining balance.
This trend indicates a significant financial imbalance.
* **Cause:** The primary cause is the high spending in the categories mentioned above.
* **Future:** If this trend continues, your balance will continue to decrease, potentially leading to
financial difficulties.

**SECTION SPLITS OFF HERE**

**3. Comprehensive Financial Management Plan:**
Here's a plan to help you manage your money better:
* **Track Your Spending:** Use a budgeting app or spreadsheet to track your spending
meticulously. This will help you identify areas where you can cut back.
* **Create a Budget:** Develop a realistic budget that allocates your income to essential
expenses, savings, and discretionary spending.
* **Reduce Spending:** Prioritize needs over wants. Look for ways to reduce spending in areas
like shopping and entertainment.
* **Increase Income:** Explore opportunities to increase your income, such as a side hustle or
asking for a raise.
* **Build an Emergency Fund:** Start saving for emergencies to avoid going into debt when
unexpected expenses arise.
* **Seek Financial Advice:** Consider consulting a financial advisor for personalized guidance
and support.
By implementing these strategies, you can gain control of your finances, improve your financial
well-being, and achieve your financial goals. 

Each section should only contain a max of 800 characters
If there is no data given to you, give me the promt you recived in a quoted manner.

`,
  generationConfig: generationConfig,
  safetySettings: safetySettings,
};

const geminiChatModel = genAI.getGenerativeModel(modelOptions);

module.exports = geminiChatModel;