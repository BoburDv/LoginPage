window.addEventListener("load", function(){
    const user = JSON.parse(localStorage.getItem("user"));
    if(user){
        window.location.href = "/index.html"
    }
})

const elForm = document.getElementById("form")

elForm.addEventListener("submit", function(e){
    e.preventDefault()

    const formData = new FormData(e.target)
    const result = {}
    for (const [key, value] of formData.entries()){
        result[key] = value
    }
    const checker = validator(result)

    if (checker) {
        alert(checker.massage);
        e.target[checker.target].focus();
    }
    else{
        login(result)
    }
})

function validator(obj){
    if(obj.username.trim() == ""){
        return{
            target: "username",
            massage: "Foydalanuvchi ismi bo'sh bo'lishi mumkin emas"
        }
    }
    
    if(obj.password.trim() == ""){
        return{
            target: "password",
            massage: "Foydalanuvchi paroli bo'sh bo'lishi mumkin emas"
        }
    }
    return false
}

function login(userData){
    const spinner = document.querySelector('button svg');
    spinner.style.display = "inline-block";

    fetch("https://json-api.uz/api/project/fn37/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    })
    .then((res) => res.json())
    .then((res) => {
        console.log(res);
    })
    .catch((error) => {
        console.log(error);
    })
    .finally(() => {
        spinner.style.display = "none";
        console.log("Tugadi");
    })
}
