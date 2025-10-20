
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data.json');

function readData() {
    if (!fs.existsSync(DATA_FILE)) {
        const initial = { users: [] };
        fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
    }
    const raw = fs.readFileSync(DATA_FILE);
    return JSON.parse(raw);
}

function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
    readData,
    writeData
};
