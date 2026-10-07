const { test } = require("node:test");
const assert = require("node:assert");
const express = require("express");
const request = require("supertest");

const createChatController = require("../src/controllers/chatControllers");

async function fakeGemini(message) {
    return {
        candidates: [
            {
                content: {
                    parts: [
                        {
                            text: "Mock response"
                        }
                    ]
                }
            }
        ]
    };
}

async function fakeGeminiError(message) {
    throw new Error("Test Gemini error");
}

async function fakeGeminiQuotaError(message) {
    const error = new Error("Quota exceeded");
    error.status = 429;

    throw error;
}

async function fakeGeminiEmptyResponse(message) {
    return {
        candidates: []
    }
}

async function fakeGeminiNoCandidates(message) {
    return {
        somethingElse:[]
    }
}

const fakeLogger = {
    error : function() {}
}

function createAppGlobal(geminiType, logger) {
    const app = express();

    app.use(express.json());

    const chatController = createChatController(geminiType, logger);
    app.post("/api/chat", chatController);

    return app;
}

const app = createAppGlobal(fakeGemini);
const appError = createAppGlobal(fakeGeminiError, fakeLogger);
const appQuotaError = createAppGlobal(fakeGeminiQuotaError, fakeLogger);
const appEmptyResponse = createAppGlobal(fakeGeminiEmptyResponse, fakeLogger);
const appNoCandidates = createAppGlobal(fakeGeminiNoCandidates, fakeLogger);

function createTestApp(option) {
    test(option.description, async () => {
        const response = await request(option.app)
            .post("/api/chat")
            .send({
                message: option.message
            });

        assert.strictEqual(
            response.statusCode,
            option.expectedStatusCode
        );

        if (option.expectedResponseMessage !== null) {
            assert.strictEqual(
                response.body.message,
                option.expectedResponseMessage
            );
        }

        if (option.expectedResponseError !== null) {
            assert.strictEqual(
                response.body.error,
                option.expectedResponseError
            );
        }
    });
}
createTestApp({
    description: "Pesan kosong harus menghasilkan 400 ",
    app,
    expectedStatusCode: 400,
    message: "",
    expectedResponseMessage: null,
    expectedResponseError: "Message cannot be empty"
});
createTestApp({
    description: "Pesan valid harus menghasilkan 200",
    app,
    expectedStatusCode: 200,
    message: "Hello",
    expectedResponseMessage: "Mock response",
    expectedResponseError: null
});
createTestApp({ 
    description: "Gemini error harus menghasilkan 500",
    app: appError,
    expectedStatusCode: 500,
    message: "Hello",
    expectedResponseMessage: null,
    expectedResponseError: "Internal Server Error"
});
createTestApp({ 
    description: "Gemini quota error harus menghasilkan 429",
    app: appQuotaError,
    expectedStatusCode: 429,
    message: "Hello",
    expectedResponseMessage: null,
    expectedResponseError: "Too many requests"
});
createTestApp({
    description: "Gemini tidak mengembalikan candidates harus menghasilkan 502",
    app: appNoCandidates,
    expectedStatusCode: 502,
    message: "Hello",
    expectedResponseMessage: null,
    expectedResponseError: "Invalid Gemini response"
});
createTestApp({
    description: "Gemini mengembalikan candidates kosong harus menghasilkan 502",
    app: appEmptyResponse,
    expectedStatusCode: 502,
    message: "Hello",
    expectedResponseMessage: null,
    expectedResponseError: "Invalid Gemini response"
});
// createTestApp("Pesan valid harus menghasilkan 200", app, 200,"Hello","Mock response");
// createTestApp("Gemini error harus menghasilkan 500", appError, 500,"Hello",null,"Internal Server Error");
// createTestApp("Gemini quota error harus menghasilkan 429", appQuotaError, 429,"Hello",null,"Too many requests");
// createTestApp("Gemini mengembalikan candidates kosong harus menghasilkan 500",appEmptyResponse,502,"Hello",null,"Invalid Gemini response");
// createTestApp("Gemini tidak mengembalikan candidates harus menghasilkan 502",appNoCandidates,502,"Hello",null,"Invalid Gemini response");

// function createTestApp(errorMessage,errorType,expectedStatusCode,message="",expectedResponseMessage = null) {
//     test(errorMessage, async () => {
//         const response = await request(errorType)
//             .post("/api/chat")
//             .send({
//                 message: message
//             });

//         assert.strictEqual(response.statusCode, expectedStatusCode);

//         if (expectedResponseMessage !== null) {
//             assert.strictEqual(
//                 response.body.message,
//                 expectedResponseMessage
//             );
//         }
//     });
// }

// createTestApp("Pesan kosong harus menghasilkan 400", app, 400,"",null,"Message cannot be empty");
// createTestApp("Pesan valid harus menghasilkan 200", app, 200,"Hello","Mock response");
// createTestApp("Gemini error harus menghasilkan 500", appError, 500,"Hello",null,"Internal Server Error");
// createTestApp("Gemini quota error harus menghasilkan 429", appQuotaError, 429,"Hello",null,"Too many requests");
// createTestApp("Gemini mengembalikan candidates kosong harus menghasilkan 500",appEmptyResponse,502,"Hello",null,"Invalid Gemini response");
// createTestApp("Gemini tidak mengembalikan candidates harus menghasilkan 502",appNoCandidates,502,"Hello",null,"Invalid Gemini response");

