const express = require('express');
const router = express.Router();

// Mock AI responses for fallback when OpenAI is unavailable
const MOCK_EXPLANATION = {
    documentType: 'Agricultural Land Record (7/12 Extract)',
    entities: {
        owner: 'Amit Kumar',
        location: 'Shirur, Pune District, Maharashtra',
        surveyNumber: '45A/2',
        area: '2.5 Hectares',
        issuer: 'Government of Maharashtra'
    },
    summary: 'This document is a certified land revenue extract (7/12 Utara) issued by the Maharashtra government. It confirms that Amit Kumar holds clear Class-I occupant rights over agricultural land survey 45A/2 in Shirur. No encumbrances or litigations have been flagged.'
};

const getMockAnswer = (question) => {
    const q = question.toLowerCase();
    if (q.includes('owner')) return 'The owner of this land is Amit Kumar, listed as Class-I Occupant.';
    if (q.includes('area') || q.includes('size') || q.includes('hectare')) return 'The total land area is 2.5 Hectares (approx. 6.17 acres).';
    if (q.includes('loan') || q.includes('encumbr')) return 'No active encumbrances have been recorded. This property is eligible for institutional crop loans.';
    if (q.includes('location') || q.includes('village')) return 'The land is located in Shirur, Shirur Taluka, Pune District, Maharashtra.';
    if (q.includes('type') || q.includes('document')) return 'This is an agricultural land record extract, commonly known as 7/12 Utara in Maharashtra.';
    return 'Based on the document, no specific information regarding your query was found. The document certifies agricultural land ownership with no outstanding issues.';
};

/**
 * POST /ai/explain
 * Body: { text: string }
 * Returns: { documentType, entities, summary }
 */
router.post('/explain', async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'text is required.' });

    // Try OpenAI if API key is set
    if (process.env.OPENAI_API_KEY) {
        try {
            const OpenAI = require('openai');
            const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

            const completion = await client.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{
                    role: 'system',
                    content: 'You are a legal document intelligence system. Analyze the provided document text and return a JSON object with keys: documentType (string), entities (object with owner, location, and other found entities), and summary (1-3 sentences). Be factual and avoid hallucination. Return only valid JSON, no markdown.'
                }, {
                    role: 'user',
                    content: `Analyze this document:\n\n${text}`
                }],
                response_format: { type: 'json_object' },
                max_tokens: 512
            });

            const result = JSON.parse(completion.choices[0].message.content);
            return res.json(result);
        } catch (err) {
            console.warn('[AI EXPLAIN] OpenAI failed, falling back to mock:', err.message);
        }
    }

    // Fallback mock
    res.json(MOCK_EXPLANATION);
});

/**
 * POST /ai/chat
 * Body: { question: string, context: string }
 * Returns: { answer: string }
 */
router.post('/chat', async (req, res) => {
    const { question, context } = req.body;
    if (!question) return res.status(400).json({ error: 'question is required.' });

    // Try OpenAI if API key is set
    if (process.env.OPENAI_API_KEY) {
        try {
            const OpenAI = require('openai');
            const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

            const completion = await client.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{
                    role: 'system',
                    content: `You are a legal document assistant. Answer the user's question ONLY using the provided document context. If the answer is not in the document, say "This information is not found in the document." Keep answers short and clear.`
                }, {
                    role: 'user',
                    content: `Document Context:\n${context || 'No document uploaded yet.'}\n\nQuestion: ${question}`
                }],
                max_tokens: 256
            });

            return res.json({ answer: completion.choices[0].message.content.trim() });
        } catch (err) {
            console.warn('[AI CHAT] OpenAI failed, falling back to mock:', err.message);
        }
    }

    // Fallback mock answer
    res.json({ answer: getMockAnswer(question) });
});

module.exports = router;
