require("dotenv").config();

if(!process.env.GEMINI_API_KEY){
    throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
}

module.exports = {
    geminiApiKey: process.env.GEMINI_API_KEY,
    port: process.env.PORT || 3000
};