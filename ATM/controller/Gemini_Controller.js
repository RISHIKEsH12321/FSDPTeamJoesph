const geminiChatModel = require("../geminiConfig");

const startingPrompt = 
"Say 123 Hello for testing purposes";



// Function to start a input data and get a description with Gemini
async function startOneTimeChat(req, res) {
  try {
    const data = req.body.data;
    // Sample body
    // {
    //   "data": "Say 123 Hello for testing purposes. POSTMAasdN"
    // }
    
    // Add any data you want to send with the prompt here
    // const fullPrompt = `${startingPrompt} ${data}`;
    const fullPrompt = data;

    const geminiChat = await geminiChatModel.startChat({
      parts: [
        {
          role: "user",
          parts: [data],
        },
      ],
    });
    
    // Get the AI's response to the prompt
    const result = await geminiChat.sendMessage(fullPrompt);
    const response = await result.response;
    const text = await response.text();
    // console.log(text);
    
    res.status(200).json(text);
  } catch (error) {
    console.error("Error starting chat with Gemini:", error);
    throw new Error("Error starting chat with Gemini");
  }
}

// Express route to handle the one-time chat request
const postUserInput = async (req, res) => {
  const query = req.body.query;

  try {
    const responseText = await startOneTimeChat(query);
    return res.status(200).json({ message: responseText });
  } catch (error) {
    console.error("Error querying AI:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { startOneTimeChat,postUserInput  };
