const { test } = require("node:test");
const assert = require("node:assert");

const { validateMessage, validateGeminiResponse } = require("../src/validators/chatValidators");

test("Pesan tidak boleh kosong", () => {
    const result = validateMessage("");

    assert.strictEqual(result, "Message cannot be empty");
});

test("Pesan tidak boleh angka", () => {
    const result = validateMessage(123);

    assert.strictEqual(result, "Message must be a string");
});

test("Pesan tidak boleh kedowoen", () => {
    const result = validateMessage("a".repeat(501));

    assert.strictEqual(result, "Message is too long");
});

test("all good", () => {
    const result = validateMessage("Hello, world!");
    assert.strictEqual(result, null);
});