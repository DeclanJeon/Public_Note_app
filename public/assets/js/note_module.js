import { optionsPost } from "./options.js";
import { showNotes } from "./note.js";

const addBox = document.querySelector(".add-box");
const popupBox = document.querySelector(".popup-box");
const popupTitle = document.querySelector("header p");
const addBtn = popupBox.querySelector("button");
const noteIdTag = popupBox.querySelector("span#note_id");
const userTag = popupBox.querySelector("input#user");
const titleTag = popupBox.querySelector("input#title");
const descTag = popupBox.querySelector("textarea");

function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", (e) => {
        if (e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

async function deleteNote(noteId) {
    let confirmDel = confirm("Are you sure you want to delete this note?");
    if (!confirmDel) return;

    let data = {
        note_id: noteId,
    };

    optionsPost.data = data;
    optionsPost.url = "/note/delete";

    await axios(optionsPost)
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
}

async function updateNote(noteId) {
    addBox.click();
    let noteInfo = await axios.get(`/note/edit/${noteId}`);

    if (noteInfo.data.data.length !== 0) {
        noteInfo.data.data.forEach((item) => {
            noteIdTag.innerText = item.note_id;
            userTag.value = item.user_id;
            titleTag.value = item.note_title;
            descTag.value = item.note_description.replaceAll("<br/>", "\r\n");
        });
    }

    addBtn.innerText = "Update Note";
    popupTitle.innerText = "Update a Note";
}

export { showMenu, deleteNote, updateNote };
