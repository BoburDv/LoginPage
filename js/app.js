window.addEventListener("load", function(){
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
        window.location.href = "/index.html";
    }
})

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
        const toast = document.getElementById("toast-warning")
        const toastText = document.getElementById("toast-warning-message")
        toastText.textContent = checker.massage
        toast.classList.remove("hidden")
        toast.classList.add("flex")
        setTimeout(() => {
            toast.classList.add("hidden")
            toast.classList.remove("flex")
        }, 3000);
        e.target[checker.target].focus();
    } else {
        login(result);
    }
})

function validator(obj){
    if(obj.username.trim() == ""){
        return{
            target: "username",
            massage: "Foydalanuvchi ismi bo'sh bo'lishi mumkin emas"
        };
    }

    if(obj.password.trim() == ""){
        return{
            target: "password",
            massage: "Foydalanuvchi paroli bo'sh bo'lishi mumkin emas"
        };
    }
    return false;
}

function login(userData){
    const spinner = document.querySelector('button svg');
    spinner.style.display = "inline-block";

    fetch("https://json-api.uz/api/project/fn37/auth/login",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    })
    .then((res) => res.json())
    .then((res) => {
        if (res.token){
            localStorage.setItem("user", JSON.stringify(res.user))

            const toast = document.getElementById("toast-success")
            const toastText = document.getElementById("toast-success-message")
            toastText.textContent = "Kirish muvaffaqiyatli"
            toast.classList.remove("hidden")
            toast.classList.add("flex")

            setTimeout(() => {
                toast.classList.add("hidden")
                toast.classList.remove("flex")
                window.location.href = "/index.html"
            }, 2000);
        } else {
            const toast = document.getElementById("toast-danger")
            const toastText = document.querySelector("#toast-danger .ms-3")
            toastText.textContent = "Login yoki parol noto'g'ri"
            toast.classList.remove("hidden")
            toast.classList.add("flex")

            setTimeout(() => {
                toast.classList.add("hidden")
                toast.classList.remove("flex")
            }, 3000);
        }
    })
    .catch((error) => {
        console.log(error);
        const toast = document.getElementById("toast-danger")
        const toastText = document.querySelector("#toast-danger .ms-3")
        toastText.textContent = "server xato"
        toast.classList.remove("hidden")
        toast.classList.add("flex")

        setTimeout(() => {
            toast.classList.add("hidden")
            toast.classList.remove("flex")
        }, 2000)
    })
    .finally(() =>{
        spinner.style.display = "none"
    });
}
