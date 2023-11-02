const tabsButtons = document.querySelectorAll(".tabs__nav-btn");
const tabsItems = document.querySelectorAll(".tabs__item");

const feedbackForm = document.querySelector(".feedback-form");

import { LStorage, TodoList, sortByDoneButton, sortByTimeButton} from "./todo.js";

let todos = [];

const storage = new LStorage(todos);
const list = new TodoList(storage);
list.init();

sortByDoneButton.addEventListener("click", function () {
    list.sortByKey("done");
});

sortByTimeButton.addEventListener("click", function () {
    list.sortByKey("time");
});




tabsButtons.forEach(function (item) {
    item.addEventListener("click", function () {
        const currentBtn = item;
        const tabId = currentBtn.getAttribute("data-tab");
        const currentTab = document.querySelector(tabId);

        if (!currentBtn.classList.contains('active')) {
            tabsButtons.forEach(function (item) {
                item.classList.remove("active");
            });
            tabsItems.forEach(function (item) {
                item.classList.remove("active");
            });

            currentBtn.classList.add("active");
            currentTab.classList.add("active");
        }
    });
});


feedbackForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const feedback = {
        name: document.querySelector(".feedback-name").value,
        email: document.querySelector(".feedback-email").value,
        text: document.querySelector(".feedback-text").value
    };
    // console.log(JSON.stringify(feedback));
    console.log(feedback);
    document.querySelector(".feedback-name").value = "";
    document.querySelector(".feedback-email").value = "";
    document.querySelector(".feedback-text").value = "";
});