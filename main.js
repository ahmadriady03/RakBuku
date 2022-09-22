const books = [];
const RENDER_EVENT = 'render-book'; 
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    };
}

document.addEventListener('DOMContentLoaded', function () {

    const submitForm = document.getElementById('inputBook');
    
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });

    if (isStorageExist()) {
      loadDataFromStorage();
    }

});

document.addEventListener(RENDER_EVENT, function () {
    //console.log(books);

    const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
    uncompletedBOOKList.innerHTML = '';

    const completedBOOKList = document.getElementById('completeBookshelfList');
    completedBOOKList.innerHTML = '';
 
    for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted)
    uncompletedBOOKList.append(bookElement);
    else
    completedBOOKList.append(bookElement);
  }
});

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

// menambahkan data baru

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function addBook() {
    const textTitle = document.getElementById('inputBookTitle').value;
    const textAuthor = document.getElementById('inputBookAuthor').value;
    const textYear = document.getElementById('inputBookYear').value;

   
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textTitle, textAuthor, textYear, false);
    books.push(bookObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
 
  if (bookTarget === -1) return;
 
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

//Menghapus File
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
 
  return -1;
}

function makeBook(bookObject){

    const textTitle = document.createElement('h2');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('h2');
    textAuthor.innerText = bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = bookObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isCompleted) {

      const undoButton = document.createElement('button');
    
      undoButton.classList.add('green');
      undoButton.innerText = 'Belum selesai dibaca';
      undoButton.addEventListener('click', function () {
        undoBookFromCompleted(bookObject.id);
      });
   
      const trashButton = document.createElement('button');
      trashButton.classList.add('red');
      trashButton.innerText = 'Hapus Buku';
      trashButton.addEventListener('click', function () {
        removeBookFromCompleted(bookObject.id);
      });
   
      container.append(undoButton, trashButton);
    } else {
      
      const checkButton = document.createElement('button');
      checkButton.classList.add('green');
      checkButton.innerText = 'Selesai dibaca';
      checkButton.addEventListener('click', function () {
        addBookToCompleted(bookObject.id);
      });
 
      
      const removeButton = document.createElement('button');
      removeButton.classList.add('red');
      removeButton.innerText = 'Hapus Buku';
      removeButton.addEventListener('click', function () {
        removeBookFromCompleted(bookObject.id);
      });
      
      container.append(checkButton, removeButton);
    }

    return container;
}

function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}