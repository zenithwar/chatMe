function validateMessage(message) {
      if (typeof message !== "string") {
        return "Message must be a string";
    }

    if (message.trim() === "") {
        return "Message cannot be empty";
    }

    if (message.length > 500) {
        return "Message is too long";
    }

    return null;
}

function validateGeminiResponse(result) {
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
        return "Invalid Gemini response";
    }

    return null;
}

module.exports = { validateMessage, validateGeminiResponse };