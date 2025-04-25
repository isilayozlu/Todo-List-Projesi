//gerekli olan tüm elemanlarımı seçtim
const form = document.querySelector("#todoAddForm");
const todoInput = document.querySelector("#todoInput");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const clearButton = document.querySelector("#clearTodos");
const filterInput = document.querySelector("#searchTodo");

let todos = [];
runEvents();

//EVENTLAR
function runEvents(){
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", pageLoaded);
    secondCardBody.addEventListener("click", removeTodo);
    clearButton.addEventListener("click", allTodosEverywhere);
    filterInput.addEventListener("keyup", filter);
}

// Sayfa yüklendiğinde localStorage'dan verileri çeker
function pageLoaded() {
    checkTodosFromStorage();
    todos.forEach(function(todo) {
        addTodoUI(todo);
    });
}


//TODO EKLEME
function addTodo(e){
    const inputText = todoInput.value.trim();

    if(inputText == ""){
        showAlert("warning", "Lütfen bir değer giriniz");
    }else{
        addTodoUI(inputText);
        addTodoLocalStorage(inputText);
        showAlert("success", "Todo Eklendi");
        todoInput.value = "";  // Burada input alanını boşaltıyoruz.
    }
    e.preventDefault();
}

//ARAYÜZE EKLEME
function addTodoUI(newTodo){
    const li = document.createElement("li");
    li.className="list-group-item d-flex justify-content-between";
    li.textContent=newTodo;

    const a= document.createElement("a");
    a.className="delete-item";
    a.href="#";

    const i= document.createElement("i");
    i.className="fa fa-remove";

    a.appendChild(i);
    li.appendChild(a);

    todoList.appendChild(li);
}


//LOCAL STORAGE'A EKLEME
function addTodoLocalStorage(newInput){
    checkTodosFromStorage();//önceden kayıtlı bir liste var mı diye bakar varsa todos dizisine aktarıryoksa boş bir dizi başlatır
    todos.push(newInput);
    localStorage.setItem("todos",JSON.stringify(todos)); //array formatınfda bir stinge dönüştürüp localStorage kaydeder.
}
//localStoragesadece string veri tutabildiği için JSON.stringfy() ve JSON.parse()kullanılıyor.


//STORAGE'I KONTROL EDİYORUM DEĞER VAR MI YOK MU
function checkTodosFromStorage(){
    if(localStorage.getItem("todos") === null){
        todos=[];
    }else{
        todos=JSON.parse(localStorage.getItem("todos"));// daha öncce eklenmiş todo varsa string olarak tutulduğu içn JSOn.parse() ile tekrar diziye çevirilir.
    }
}


//TODO SİLME
function removeTodo(e){

if(e.target.classList.contains("fa-remove")){// e.target tıklanan html etiketini gösterir bana
    const todoItem = e.target.parentElement.parentElement;// parant parent giderek li elemanına ulaşıyorum
    const todoText = todoItem.textContent.trim();//li elemanını silicem

    //arayüzden sil
    todoItem.remove();

    //local stoageden sil
    deleteTodoFromStorage(todoText);

    showAlert("success","silme işlemi tamamlandı");
}}

// LocalStorage'tan tek bir todo sil
function deleteTodoFromStorage(deleteTodo){
    checkTodosFromStorage();
    todos = todos.filter(function(todo){
        return todo !== deleteTodo;
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Tüm todoları sil (arayüz + localStorage)
function allTodosEverywhere() {
    const todoItems = document.querySelectorAll(".list-group-item");
    if (todoItems.length > 0) {
        todoItems.forEach(function(todo) {
            todo.remove();
        });
        localStorage.removeItem("todos");
        showAlert("success", "Tüm todolar silindi");
    } else {
        showAlert("warning", "Silmek için en az bir todo olmalı");
    }
}



// filtreleme
function filter(e){
    console.log("filtreleme çalışsti", e.target.value);
    const filterValue=e.target.value.toLowerCase().trim();
    const todoListesi = document.querySelectorAll(".list-group-item");
    
    if(todoListesi.length>0){
        todoListesi.forEach(function(todo){
            if(todo.textContent.toLowerCase().trim().includes(filterValue)){
                todo.setAttribute("style","display:block");
            }
            else{
                todo.setAttribute("style", "display:none !important");
            }
        });

    }else{
        showAlert("warning", "filtreleme yapılamz")
    }
    
}

//BİLGİLENDİRME MESAJI
function showAlert(type , message){
    const div = document.createElement("div");
    div.className=`alert alert-${type}`;
    div.role="alert";
    div.textContent=message;

    firstCardBody.appendChild(div);

    setTimeout(function(){
        div.remove();
    },2500);
}
