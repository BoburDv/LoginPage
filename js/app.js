window.addEventListener("load", function(){
    const user = JSON.parse(localStorage.getItem("user"));
    if(user){
        window.location.href = "/index.html";
    }
});

const elForm = document.getElementById("form");

elForm.addEventListener("submit", function(e){
    e.preventDefault();

    const formData = new FormData(e.target);
    const result = {};
    for (const [key, value] of formData.entries()){
        result[key] = value;
    }
    const checker = validator(result);

    if (checker) {
        // Toast message for validation error
        const toast = document.getElementById("toast-warning");
        const toastText = document.getElementById("toast-warning-message");
        toastText.textContent = checker.massage;
        toast.classList.remove("hidden");
        toast.classList.add("flex");
        setTimeout(() => {
            toast.classList.add("hidden");
            toast.classList.remove("flex");
        }, 3000);
        e.target[checker.target].focus();
    } else {
        login(result);
    }
});

function validator(obj){
    if(obj.username.trim() === ""){
        return{
            target: "username",
            massage: "Foydalanuvchi ismi bo'sh bo'lishi mumkin emas"
        };
    }

    if(obj.password.trim() === ""){
        return{
            target: "password",
            massage: "Foydalanuvchi paroli bo'sh bo'lishi mumkin emas"
        };
    }
    return false;
}

function login(userData){
    const spinner = document.querySelector('button svg');
    spinner.style.display = "inline-block"; // Show spinner when form is submitted

    fetch("https://json-api.uz/api/project/fn37/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    })
    .then((res) => res.json())
    .then((res) => {
        if (res.token) {
            localStorage.setItem("user", JSON.stringify(res.user));
            
            // Toast success message
            const toast = document.getElementById("toast-success");
            const toastText = document.getElementById("toast-success-message");
            toastText.textContent = "Kirish muvaffaqiyatli bo‘ldi";
            toast.classList.remove("hidden");
            toast.classList.add("flex");

            setTimeout(() => {
                toast.classList.add("hidden");
                toast.classList.remove("flex");
                window.location.href = "/index.html";  // Redirect after success
            }, 2000);
        } else {
            // Toast danger message for invalid login or password
            const toast = document.getElementById("toast-danger");
            const toastText = document.querySelector("#toast-danger .ms-3");
            toastText.textContent = "Login yoki parol noto‘g‘ri!";
            toast.classList.remove("hidden");
            toast.classList.add("flex");

            setTimeout(() => {
                toast.classList.add("hidden");
                toast.classList.remove("flex");
            }, 3000);
        }
    })
    .catch((error) => {
        console.log(error);
        const toast = document.getElementById("toast-danger");
        const toastText = document.querySelector("#toast-danger .ms-3");
        toastText.textContent = "Serverda xatolik yuz berdi";
        toast.classList.remove("hidden");
        toast.classList.add("flex");

        setTimeout(() => {
            toast.classList.add("hidden");
            toast.classList.remove("flex");
        }, 3000);
    })
    .finally(() => {
        spinner.style.display = "none"; // Hide spinner after response
    });
}
