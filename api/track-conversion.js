export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { clickId } = req.body;

    if (!clickId) {
        return res.status(400).json({ error: 'Missing clickId parameter' });
    }

    // Secure S2S Postback URL targeting Offer18 servers directly
    const offer18Url = `https://growstream634474.o18a.com/p?o=21982031&m=29851&tid=${clickId}&event=quest_complete`;

    try {
        console.log(`Forwarding server postback request to: ${offer18Url}`);
        
        const response = await fetch(offer18Url, { method: 'GET' });
        const responseText = await response.text();

        // Check if Offer18 threw an IP whitelist block or similar message
        if (responseText.includes('IP not in Whitelist')) {
            return res.status(403).json({ 
                success: false, 
                message: "Offer18 rejected request: Backend server IP must be whitelisted or S2S disabled.",
                raw: responseText
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: "S2S Postback cleanly processed by server pipeline.",
            offer18Response: responseText 
        });
    } catch (error) {
        console.error("Internal Server Error during network fetch wrapper:", error);
        return res.status(500).json({ error: error.message });
    }
}