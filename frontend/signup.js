async function signupUser() {

    const name =
        document.getElementById("name").value;

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    try {

        const response = await fetch('/auth/signup', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {

            alert("Signup successful!");

            window.location.href = "login.html";

        } else {

            alert(data.message);
        }

    } catch (error) {

        console.log(error);

        alert("Signup failed");
    }
}