const randomNumber = () => Math.random() * 199999999999
let notes = []
const refs = {
  form: document.querySelector(".js-form"),
  container: document.querySelector(".js-items"),
};

document.addEventListener("DOMContentLoaded", () => {
const checkImportValue = importFromLS().filter(item => item !== null)
if(checkImportValue.length > 0){
notes = checkImportValue
const markup = notesTemplate(notes)
refs.container.insertAdjacentHTML('afterbegin', markup)
return;
}
console.log('Жодної замітки не знайдено :(')
});
refs.form.addEventListener('submit', e => {
  e.preventDefault()
  const formData = new FormData(refs.form)
  const userData = Object.fromEntries(formData)
  userData.id = Math.round(randomNumber())
  userData.title = userData['input-value'] || 'none'
  delete userData['input-value']
  notes.push(userData)
  const markup = noteTemplate(userData)
  refs.container.insertAdjacentHTML('afterbegin', markup)
  saveToLS()
  refs.form.reset()
})
function noteTemplate(note) {
  return `<li class="box item ${note.priority}"data-id="${note.id}">
            <h3>${note.title}</h3>
            <h5>Priority - ${note.priority}</h5>
            <div class="fb">
              <p class="item-desc">
              ${note.description}
              </p>
              <img src="${note.image}" alt="">
            </div>
            <button class="form-control" data-type="show">SHOW MORE</button>
            <button class="form-control" data-type="delete">DELETE</button>
          </li>`;
}
function notesTemplate(notes) {
  return notes.map(noteTemplate).join("")
}
refs.container.addEventListener("click", e => {
  if(!e.target.classList.contains("form-control")){
    return;
  }
  if(e.target.dataset.type === 'delete'){
    const parentLi = e.target.closest(".item")
    notes.forEach(note => {
      if(+note.id === +parentLi.dataset.id){ 
      const getElementIndex = notes.indexOf(note)
      delete notes[getElementIndex]
      const done = notes.filter(item => item !== undefined)
        localStorage.setItem("notes", JSON.stringify(notes))
      }
    })
    parentLi.remove()
  }
})
function saveToLS() {
localStorage.setItem("notes", JSON.stringify(notes))
}
function importFromLS() {
  try{
    return JSON.parse(localStorage.getItem("notes"))
  }
  catch{
    return;
  }
}
