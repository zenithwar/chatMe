function formatForGemini(history) {
    return history.map((item) => {
        return {
            role: item.role,
            parts: [
                {
                    text: item.message
                }
            ]
        };
    });
}

module.exports = formatForGemini ;