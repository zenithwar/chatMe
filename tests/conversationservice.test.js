const { test,beforeEach } = require("node:test");
const asert = require("node:assert");

const { addMessage,getHistory,clearHistory } = require("../src/services/conversationservice");

beforeEach(() => {
    clearHistory();
});

test("History awal harus kosong", () => { 
    const history = getHistory();

    asert.deepStrictEqual(history, []);
});

test("pesan harus bisa ditambahkan ke history", () => {
    addMessage("user", "Hello");

    const history = getHistory();

    asert.deepStrictEqual(history, [
        {
            role: "user",
            message: "Hello"
        }
    ]);
});

test("history harus bisa dikosongkan", () => {
    addMessage("user", "Hello");

    clearHistory();

    asert.deepStrictEqual(getHistory(), []);
});

test("history saat ini masih menggabungkan pesan dari percakapan berbeda", () => {
    addMessage("user", "Nama saya Yasa");
    addMessage("user", "Nama saya Budi");

    asert.deepStrictEqual(getHistory(), [
        {
            role: "user",
            message: "Nama saya Yasa"
        },
        {
            role: "user",
            message: "Nama saya Budi"
        }
    ]);
});