export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { clickId } = req.body;

    // Check if the variable is blank or undefined before sending to Offer18
    if (!clickId || clickId === '{tid}') {
        return res.status(400).json({ error: 'The backend received an empty or invalid clickId variable.' });
    }

    // Ensure template literals backticks (``) are used here so ${clickId} resolves cleanly
    const offer18Url = `https://growstream634474.o18a.com/p?o=21982031&m=29851&tid=${clickId}&event=quest_complete`;

    try {
        console.log(`Forwarding server postback request to: ${offer18Url}`);
        
        const response = await fetch(offer18Url, { method: 'GET' });
        const responseText = await response.text();

        return res.status(200).json({ 
            success: true, 
            offer18Response: responseText 
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}