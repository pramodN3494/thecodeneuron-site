export default async function handler(req, res) {

    // Allow only POST requests
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method Not Allowed"
        });
    }

    try {

        // Ensure the environment variable exists
        if (!process.env.WEB3FORMS_ACCESS_KEY) {
            return res.status(500).json({
                success: false,
                message: "Web3Forms access key is not configured."
            });
        }

        const { name, email, subject, message } = req.body;

        // Basic validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });
        }

        // Send request to Web3Forms
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                access_key: process.env.WEB3FORMS_ACCESS_KEY,
                name,
                email,
                subject,
                message
            })
        });

        const responseText = await response.text();

        console.log("========== WEB3FORMS ==========");
        console.log("Status:", response.status);
        console.log("Headers:", Object.fromEntries(response.headers.entries()));
        console.log("Body:");
        console.log(responseText);
        console.log("================================");

        let result;

        try {
            result = JSON.parse(responseText);
        } catch {
            return res.status(500).json({
                success: false,
                message: "Web3Forms returned HTML instead of JSON."
            });
        }

        if (response.ok && result.success) {
            return res.status(200).json({
                success: true,
                message: "Message sent successfully."
            });
        }

        return res.status(response.status).json({
            success: false,
            message: result.message || "Unable to send message."
        });

    } catch (error) {

        console.error("Contact Form Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

}