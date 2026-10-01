const gemini = require("../services/gemini");

async function chat(req, res) {
    const message = req.body.message;

    try {
        if(typeof message !== "string") {
            return res.status(400).json({ error: "Message must be a string" });
        }
        if(message.trim() === "") {
            return res.status(400).json({ error: "Message cannot be empty" });
        }
        if(message.length > 500) {
            return res.status(400).json({ error: "Message is too long" });
        }

        const result = await gemini(message);
        // throw new Error("Test Gemini error");
        // const error = new Error("Test quota error");
        res.json({ 
            message: result.candidates[0].content.parts[0].text 
        });

        //#testing API
        // res.json({
        //     message: "Mock response",
        //     received: message
        // });
    } catch (error) {
        console.error("Error details :", error);
        
        if (error.status === 429) {
            return res.status(429).json({
            error: "Too many requests"
        });
        }

        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
}

module.exports = chat;