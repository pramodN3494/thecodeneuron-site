const form = document.getElementById("contact-form");
const toast = document.getElementById("contact-toast");
const submitButton = document.getElementById("contact-submit");

if (form) {

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const payload = {
            name: document.getElementById("fullName").value.trim(),
            email: document.getElementById("email").value.trim(),
            subject: document.getElementById("subject").value.trim(),
            message: document.getElementById("message").value.trim()
        };

        // Basic validation
        if (!payload.name || !payload.email || !payload.subject || !payload.message) {
            showToast("⚠️ Please complete all required fields.");
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        try {

            const response = await fetch("/api/contact", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(payload)

            });

            const result = await response.json();

            if (response.ok && result.success) {

                form.reset();

                showToast(
                    "✅ Thank you! Your message has been sent successfully. I'll get back to you soon."
                );

            } else {

                showToast(
                    result.message || "❌ Unable to send your message."
                );

            }

        }

        catch (error) {

            console.error(error);

            showToast(
                "❌ Something went wrong. Please try again later."
            );

        }

        finally {

            submitButton.disabled = false;
            submitButton.textContent = "Send Message";

        }

    });

}

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("is-visible");

    setTimeout(() => {

        toast.classList.remove("is-visible");

    }, 5000);

}