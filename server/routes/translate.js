import express from 'express';
import translate from 'translate';

const router = express.Router();

// Language codes
const LANGUAGE_MAP = {
    'English': 'en',
    'Hindi': 'hi',
    'Tamil': 'ta',
    'Telugu': 'te',
    'Malayalam': 'ml',
    'Kannada': 'kn'
};

// Mock translations for fallback (when network unavailable)
const MOCK_TRANSLATIONS = {
    en: 'Property Record (7/12 Extract)\nVillage: Shirur\nTaluka: Shirur, Dist: Pune\nSurvey/Gat No: 45A/2\nOwner: Amit Kumar',
    hi: 'संपत्ति रिकॉर्ड (7/12)\nगांव: शिरूर\nतालुका: शिरूर, जिला: पुणे\nसर्वे नंबर: 45A/2\nमालिक: अमित कुमार',
    ta: 'சொத்து ரெக்கார்ட் (7/12)\nகிராமம்: ஷிரூர்\nதாலுகா: ஷிரூர், மாவட்டம்: புனே\nசர்வே எண்: 45A/2\nஉரிமையாளர்: அமித் குமார்',
    te: 'ఆస్తి రికార్డు (7/12)\nగ్రామం: శిరూర్\nతాలూకా: శిరూర్, జిల్లా: పూణే\nసర్వే నం: 45A/2\nయజమాని: అమిత్ కుమార్',
    ml: 'വസ്തു രേഖ (7/12)\nഗ്രാമം: ഷിരൂർ\nതാലൂക്ക്: ഷിരൂർ, ജില്ല: പൂനെ\nസർവേ നമ്പർ: 45A/2\nഉടമ: അമിത് കുമാർ',
    kn: 'ಆಸ್ತಿ ದಾಖಲೆ (7/12)\nಗ್ರಾಮ: ಶಿರೂರು\nತಾಲೂಕು: ಶಿರೂರು, ಜಿಲ್ಲೆ: ಪುಣೆ\nಸರ್ವೆ ಸಂಖ್ಯೆ: 45A/2\nಮಾಲೀಕ: ಅಮಿತ್ ಕುಮಾರ್'
};

/**
 * POST /translate
 * Body: { text: string, language: 'English'|'Hindi'|... }
 * Returns: { translated: string, language: string }
 */
router.post('/', async (req, res) => {
    const { text, language } = req.body;

    if (!text || !language) {
        return res.status(400).json({ error: 'text and language are required.' });
    }

    const targetCode = LANGUAGE_MAP[language] || 'en';

    // If target is English source, return as-is (or attempt reverse translation)
    if (targetCode === 'en' && !text.match(/[\u0900-\u097F\u0B00-\u0B7F\u0C00-\u0C7F\u0D00-\u0D7F]/)) {
        return res.json({ translated: text, language, code: targetCode });
    }

    try {
        // Use the `translate` npm package (no API key needed for free tier)
        translate.engine = 'google';
        const translated = await translate(text, { to: targetCode, from: 'auto' });
        res.json({ translated, language, code: targetCode });
    } catch (err) {
        console.warn('[TRANSLATE] Google Translate failed, using mock:', err.message);
        // Return mock translation
        const fallback = MOCK_TRANSLATIONS[targetCode] || MOCK_TRANSLATIONS['en'];
        res.json({ translated: fallback, language, code: targetCode, fallback: true });
    }
});

export default router;
