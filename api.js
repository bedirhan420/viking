const express = require('express');
const app = express();

const fs = require('fs');

const icelandicText = fs.readFileSync('icelandic.txt', 'utf8');
const englishText = fs.readFileSync('english.txt', 'utf8');

const icelandicVerses = icelandicText.split(/\r\n\d+\.\r\n/).filter(verse => verse.trim());
const englishVerses = englishText.split(/\r\n\d+\.\r\n/).filter(verse => verse.trim());

const havamal = {};
icelandicVerses.forEach((icelandic, index) => {
    havamal[index + 1] = {
        icelandic: icelandic.trim(),
        english: englishVerses[index].trim()
    };
});

const runes = {'F': 'ᚠ', 'U': 'ᚢ', 'TH': 'ᚦ', 'A': 'ᚨ', 'R': 'ᚱ', 'K': 'ᚲ', 'G': 'ᚷ', 'W': 'ᚹ', 'H': 'ᚺ', 'N': 'ᚾ', 'I': 'ᛁ', 'J': 'ᛃ', 'EO': 'ᛇ', 'P': 'ᛈ', 'X': 'ᛉ', 'S': 'ᛊ', 'T': 'ᛏ', 'B': 'ᛒ', 'E': 'ᛖ', 'M': 'ᛗ', 'L': 'ᛚ', 'NG': 'ᛜ', 'D': 'ᛞ','O': 'ᛟ'}

// Importing the mythology data from the separate file
const mythologyPromise = new Promise((resolve, reject) => {
    try {
        const mythology = require('./mythology');
        resolve(mythology);
    } catch (error) {
        reject(error);
    }
});

app.get('/', (req, res) => {
    res.send('Hoş geldiniz! API\'ye erişmek için /havamal adresini kullanabilirsiniz.');
});

app.get('/havamal', (req, res) => {
    res.json(havamal);
});

app.get("/havamal/:id",(req,res)=>{
    const id = parseInt(req.params.id)
    res.json(havamal[id])
})

app.get('/havamal/:language/:id', (req, res) => {
    const language = req.params.language.toLowerCase();
    const id = parseInt(req.params.id);

    let verse;
    if (language === 'icelandic') {
        verse = havamal[id].icelandic;
    } else if (language === 'english') {
        verse = havamal[id].english;
    } else {
        return res.status(400).json({ error: 'Desteklenmeyen dil.' });
    }

    res.json({ verse });
});

app.get("/runes", (req, res) => {
    res.json(runes);
});

app.get("/mythology", async (req, res) => {
    try {
        const mythology = await mythologyPromise;
        res.json(mythology);
        console.log(mythology);
        console.log("aaaaaaa");
    } catch (error) {
        console.error('Error fetching mythology:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
