const form = document.getElementById("contact-form");
const toast = document.getElementById("contact-toast");
const submitButton = document.getElementById("contact-submit");

if (form) {

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        try {

            const formData = new FormData(form);

            const response = await fetch(form.action, {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.success) {

                form.reset();

                showToast(
                    "✅ Thank you! Your message has been sent successfully. I'll get back to you soon."
                );

            } else {

                showToast(
                    result.message || "❌ Unable to send your message."
                );

            }

        } catch (error) {

            console.error(error);

            showToast(
                "❌ Something went wrong. Please try again later."
            );

        } finally {

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