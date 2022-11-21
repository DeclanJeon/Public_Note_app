import { optionsPost } from "./options.js";
import { showMenu, deleteNote, updateNote } from "./note_module.js";

window.showMenu = showMenu;
window.deleteNote = deleteNote;
window.updateNote = updateNote;

const addBox = document.querySelector(".add-box");
const popupBox = document.querySelector(".popup-box");
const popupTitle = document.querySelector("header p");
const closeIcon = popupBox.querySelector("header i");
const addBtn = popupBox.querySelector("button");
const noteIdTag = popupBox.querySelector("span#note_id");
const userTag = popupBox.querySelector("input#user");
const titleTag = popupBox.querySelector("input#title");
const descTag = popupBox.querySelector("textarea#desc");

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

// const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let notes;
let noteInfo;

let noteUser;
let noteTitle;
let noteDesc;

addBox.addEventListener("click", () => {
    titleTag.focus();
    popupBox.classList.add("show");
});

closeIcon.addEventListener("click", () => {
    userTag.value = "";
    titleTag.value = "";
    descTag.value = "";
    addBtn.innerText = "Add Note";
    popupTitle.innerText = "Add a new Note";
    popupBox.classList.remove("show");
});

async function showNotes() {
    const selectNotes = document.querySelectorAll(".note");

    let db = await axios.get("/note/list");
    notes = db.data.notes;

    if (selectNotes.length !== 0) {
        selectNotes.forEach((note) => {
            note.remove();
        });
    }

    notes.forEach((note, index) => {
        let note_id = note.note_id;
        let user = note.user_id;
        let title = note.note_title;
        let desc = note.note_description;
        let date = note.date_at;

        let liTag = `<li class="note">
            <div class="details">
                <p class="note-user">${user}</p>
                <p class="note-title">${title}</p>
                <pre class="note-desc">${desc}</pre>
            </div>
            <div class="bottom-content">
                <span>${date}</span>
                <div class="settings"> 
                    <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                    <ul class="menu">
                        <li onclick="updateNote(${note_id})"><i class="uil uil-pen"></i>Edit</li>
                        <li onclick="deleteNote(${note_id})"><i class="uil uil-trash"></i>Delete</li>
                    </ul>
                </div>
            </div>
        </li>`;

        addBox.insertAdjacentHTML("afterend", liTag);
    });
}

addBtn.addEventListener("click", (e) => {
    const btnText = e.target.innerText;
    if (btnText.includes("Add")) {
        sendToServerCreate();
    } else {
        sendToServerUpdate();
    }

    // 초기화
    userTag.value = "";
    titleTag.value = "";
    descTag.value = "";

    addBtn.innerText = "Add Note";
    popupTitle.innerText = "Add a new Note";
});

const sendToServerUpdate = async () => {
    noteDesc = descTag.value;

    noteDesc = noteDesc.replaceAll("<br/>", "\r\n");

    noteInfo = {
        note_id: noteIdTag.innerText,
        user_id: userTag.value,
        title: titleTag.value,
        description: noteDesc,
    };
    optionsPost.data = noteInfo;
    optionsPost.url = `/note/update`;

    axiosFunction(optionsPost);
    popupBox.classList.remove("show");

    // await showNotes();
};

const sendToServerCreate = async () => {
    noteUser = userTag.value;
    noteTitle = titleTag.value;
    noteDesc = descTag.value;

    noteDesc = noteDesc.replace(/(?:\r\n|\r|\n)/g, "<br/>");

    noteInfo = {
        user: noteUser,
        title: noteTitle,
        description: noteDesc,
    };

    optionsPost.data = noteInfo;
    optionsPost.url = "/note/add";

    axiosFunction(optionsPost);

    popupBox.classList.remove("show");

    // await showNotes();
};

const axiosFunction = async (options) => {
    await axios(options)
        .then((res) => {
            if (res.data.success === 1) {
                console.log("Data Response Successfully");
                showNotes();
            } else {
                console.log("Data Response Failed");
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

document.addEventListener("DOMContentLoaded", showNotes);

export { showNotes };
