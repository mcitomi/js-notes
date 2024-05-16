function $(id) {
    return document.getElementById(id);
}

function login() {
    if(!$("user").value || !$("pass").value) {
        return alert("Üres mező!");
    }
    if(localStorage.getItem(`${$("user").value}`)) {
        if(localStorage.getItem(`${$("user").value}`) != $("pass").value) {
            alert("Hibás jelszó!");
        } else {
            sessionStorage.setItem("logged", `${$("user").value}`);
            redirect("index");
        }
    } else {
        localStorage.setItem(`${$("user").value}`, `${$("pass").value}`);
        sessionStorage.setItem("logged", `${$("user").value}`);

        redirect("index");
    }
}

function logout() {
    sessionStorage.removeItem("logged");
    redirect("index");
}

function load() {
    if(sessionStorage.getItem("logged") && location.href.includes("index")) {
        $("authbtn").remove();
        $("auth").innerHTML += `<button class="btn btn-outline-warning"><a style="padding: 10px;" href="./editor.html">Szerkesztő</a></button>`;
        $("auth").innerHTML += `<button id="authbtn" class="btn btn-outline-danger" onclick="logout()">Kijelentkezés</button>`;
    
        var userCards = JSON.parse(localStorage.getItem(`${sessionStorage.getItem("logged")}_card`));
     
        for (let i = 0; i < userCards?.length; i++) {
            $("cardsPlace").innerHTML += ` <div class="card" style="width: 18rem;"><div class="card-body"> <h5 class="card-title" id="c-title">${userCards[i].card.title}</h5> <p class="card-text" id="c-desc">${userCards[i].card.desc}</p><a onclick="deleteCard(this)" class="card-link btn btn-outline-danger btn-sm">törlés</a><a onclick="editCard(this)" class="card-link btn btn-outline-warning btn-sm">szerkesztés</a></div></div>`;
        }

        if(!userCards || !userCards.length){
            $("cardsPlace").innerHTML += `<h1 id="loginAlert" class="text-center" style="margin-top: 50px;">Kártya készítéséhez lépj a <a href="./editor.html"><i>Szerkesztő</i>be</a>!</h1>`;

        }
    } else {
        location.href.includes("index") ? $("cardsPlace").innerHTML += `<h1 id="loginAlert" class="text-center" style="margin-top: 50px;"><a href="./login.html">Jelentkezz be!</a></h1>` : null;
    }

    if(location.href.includes("editor")){
        const urlParams = new URLSearchParams(location.search);
        if(urlParams.get("title") != null || urlParams.get("desc") != null) {
            $("c-title").innerText = $("editor-title").value = urlParams.get("title");
            $("c-desc").innerText = $("editor-desc").value = urlParams.get("desc");
        }
    }
}

function redirect(filename) {
    location.replace(location.href.slice(0, location.href.indexOf(location.href.split("/").pop())) + `${filename}.html`);
}

function deleteCard(t) {
    var cardElement = t.closest('.card');
    var userCards = JSON.parse(localStorage.getItem(`${sessionStorage.getItem("logged")}_card`));

    for (let i = 0; i < userCards.length; i++) {
        if(userCards[i].card.title == cardElement.querySelector('#c-title').textContent && userCards[i].card.desc == cardElement.querySelector('#c-desc').textContent) {
            userCards.splice(i, 1);
        }
    }

    cardElement.remove();   
    localStorage.setItem(`${sessionStorage.getItem("logged")}_card`, JSON.stringify(userCards));
}

function editCard(t) {
    var cardElement = t.closest('.card');
    location.replace(location.href.slice(0, location.href.indexOf(location.href.split("/").pop())) + `editor.html?title=${cardElement.querySelector('#c-title').textContent}&desc=${cardElement.querySelector('#c-desc').textContent}`);
    deleteCard(t);
}

function updateCard() {
    if($("editor-title").value != ""){
        $("c-title").innerText = $("editor-title").value;
    }

    if($("editor-desc").value != ""){
        $("c-desc").innerText = $("editor-desc").value;
    }   
}

function saveCard() {
    if($("editor-desc").value == "" && $("editor-title").value == "") {
        return redirect("index");
    }
    if(localStorage.getItem(`${sessionStorage.getItem("logged")}_card`)){
        let cards = JSON.parse(localStorage.getItem(`${sessionStorage.getItem("logged")}_card`));
      
        cards.push(JSON.parse(`
        {
            "card": {
                "title": "${$('c-title').innerText}",
                "desc": "${$('c-desc').innerText}"
            }
        }
        `));
        localStorage.setItem(`${sessionStorage.getItem("logged")}_card`, JSON.stringify(cards));
    } else{
        localStorage.setItem(`${sessionStorage.getItem("logged")}_card`, `
        [{
            "card": {
                "title": "${$('c-title').innerText}",
                "desc": "${$('c-desc').innerText}"
            }
        }]`);
    }
    $("editor-title").value = $("editor-desc").value = "";
    $("c-title").innerText = "Kártya címe ";
    $("c-desc").innerText = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
}

function activateButton(event) {
    if (event.key === "Enter" && location.href.includes("editor")) {
        saveCard();
    }

    if (event.key === "Enter" && location.href.includes("login")) {
        login();
    }

    if (event.key === "Enter" && location.href.includes("index")) {
        sessionStorage.getItem("logged") ? redirect("editor") : redirect("login");
    }
}

load();
document.addEventListener("keypress", activateButton);
$("userSpan") ? $("userSpan").textContent = sessionStorage.getItem("logged") : null;