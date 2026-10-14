// const gemini = require("../services/gemini");
// const validateMessage = require("../validators/chatValidators");

// async function chat(req, res) {
//     const message = req.body.message;
//     const messageValidation = validateMessage(message);

//     try {
//         if(messageValidation) {
//             return res.status(400).json({
//                 error: messageValidation
//             });
//         }

//         const result = await gemini(message);
//         // throw new Error("Test Gemini error");
//         // const error = new Error("Test quota error");
//         res.json({ 
//             message: result.candidates[0].content.parts[0].text 
//         });

//         //#testing API
//         // res.json({
//         //     message: "Mock response",
//         //     received: message
//         // });
//     } catch (error) {
//         console.error("Error details :", error);
        
//         if (error.status === 429) {
//             return res.status(429).json({
//             error: "Too many requests"
//         });
//         }

//         return res.status(500).json({
//             error: "Internal Server Error"
//         });
//     }
// }

// module.exports = chat;

const { validateMessage, validateGeminiResponse } = require("../validators/chatValidators");
const { addMessage, getHistory } = require("../services/conversationservice");

const formatForGemini = require("../services/conversationformater");    

function createChatController(gemini, logger = console) {

    const chat = async function(req, res) {
        const message = req.body.message;
        const messageValidation = validateMessage(message);

        try {
            if(messageValidation) {
                return res.status(400).json({
                    error: messageValidation
                });
            }

            addMessage("user", message);
            const history = getHistory();
            const contents = formatForGemini(history);

            const result = await gemini(contents);

            const responseValidation = validateGeminiResponse(result);

            if (responseValidation) {
                return res.status(502).json({
                    error: responseValidation
                });
            }

            const reply = result.candidates[0].content.parts[0].text;
            addMessage("model", reply);
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
            logger.error("Error details :", error);
            
            if (error.status === 429) {
                return res.status(429).json({
                    error: "Too many requests"
                });
            }

            return res.status(500).json({
                error: "Internal Server Error"
            });
        }
    };

    return chat;
}

module.exports = createChatController;