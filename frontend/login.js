async function loginUser() {

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    try {

        const response = await fetch('/auth/login', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {

            alert("Login successful!");

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            window.location.href = "index.html";

        } else {

            alert(data.message);
        }

    } catch (error) {

        console.log(error);

        alert("Login failed");
    }
}