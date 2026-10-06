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

            const result = await gemini(message);

            const responseValidation = validateGeminiResponse(result);

            if (responseValidation) {
                return res.status(502).json({
                    error: responseValidation
                });
            }

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