let history = [];

function addMessage(role, message) {
    history.push({role,message});
}

function getHistory() {
    return history;
}   

function clearHistory() {
    history = [];
}

module.exports = { addMessage, getHistory, clearHistory };