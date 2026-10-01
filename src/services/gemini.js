const { GoogleGenAI } = require("@google/genai");
const { geminiApiKey } = require("../config/env");

const ai = new GoogleGenAI({
    apiKey: geminiApiKey,
});


async function gemini(message){
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
        contents: message
    })
    return response;
}

module.exports = gemini;
