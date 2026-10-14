const { GoogleGenAI } = require("@google/genai");
const { geminiApiKey } = require("../config/env");
const formatForGemini = require("./conversationFormatter");

const ai = new GoogleGenAI({
    apiKey: geminiApiKey,
});


async function gemini(content){
    //MOCK RESPONSE
    // return {
    //     candidates: [
    //         {
    //             content: {
    //                 parts: [
    //                     {
    //                         text: `Mock response for: ${message}`
    //                     }
    //                 ]
    //             }
    //         }
    //     ]
    // };
    const response = await ai.models.generateContent({ 
        model: "gemini-3.8-flash",
        contents: content
    })
    return response;
}

module.exports = gemini;
