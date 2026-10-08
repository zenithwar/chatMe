const { test } = require("node:test");
const assert = require("node:assert");

const formatForGemini = require("../src/services/conversationformater");

test("history harus bisa diubah ke format Gemini", () => {
    const history = [
        {
            role: "user",
            message: "Hello"
        },
        {
            role: "model",
            message: "Hi!"
        }
    ];

    const result = formatForGemini(history);

    assert.deepStrictEqual(result, [
        {
            role: "user",
            parts: [
                {
                    text: "Hello"
                }
            ]
        },
        {
            role: "model",
            parts: [
                {
                    text: "Hi!"
                }
            ]
        }
    ]);
});