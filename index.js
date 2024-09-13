const error = document.querySelector("#error");
const dataTable = document.querySelector("#dataSection");
const tbody = document.querySelector("tbody");
const studentName = document.querySelector("#name");
const studentId = document.querySelector("#id");
const studentEmail = document.querySelector("#email");
const studentContact = document.querySelector("#contact");
const form = document.querySelector("#add");
const submitBtn = document.querySelector("#submitBtn");
// const home = document.querySelector("#home");
// const register = document.querySelector("#register");
let isEditing = false;
let currId = null;

//                                    Storing data in Local storage

function setData(arr) {
  let newArr = JSON.stringify(arr);
  localStorage.setItem("studentData", newArr);
}
//                                   Getting data from local storage

function getData() {
  const res = localStorage.getItem("studentData");
  if (res) {
    return JSON.parse(res);
  } else return [];
}

//                                   Checking Input Values

function checkInput() {
  const namePattern = /^[A-Za-z\s]+$/;
  const idPattern = /^[0-9]+$/;
  const contactPattern = /^[0-9]+$/;
  let errorMsg = false;
  // checking name input

  if (!namePattern.test(studentName.value)) {
    studentName.value = "";
    studentName.placeholder = "Enter valid name";
    studentName.classList.add("errormsg");
    errorMsg = true;
  }

  //checking id value

  if (!idPattern.test(studentId.value)) {
    studentId.value = "";
    studentId.placeholder = "Enter valid id";
    studentId.classList.add("errormsg");
    errorMsg = true;
  }

  //Checking if same id present or not

  const resData = getData();
  resData.forEach((data) => {
    if (!isEditing && studentId.value === data.id) {
      studentId.value = "";
      studentId.placeholder = "This id already exist";
      studentId.classList.add("errormsg");
      errorMsg = true;
    }
  });

  //checking contact value

  if (!contactPattern.test(studentContact.value)) {
    studentContact.value = "";
    studentContact.placeholder = "Enter valid contact no";
    studentContact.classList.add("errormsg");
    errorMsg = true;
  }

  return !errorMsg;
}

//                                     submit eventListener function

function submitdata(e) {
  e.preventDefault();
  const resData = getData();

  if (!checkInput()) return;

  tbody.innerHTML = "";

  const newData = {
    name: studentName.value,
    id: studentId.value,
    email: studentEmail.value,
    contact: studentContact.value,
  };

  if (isEditing) {
    const mappedData = resData.map((data) => {
      if (data.id === currId) {
        return newData;
      }
      return data;
    });
    setData(mappedData);
    isEditing = false;
    currId = null;
    submitBtn.innerText = "Add";
  } else {
    resData.push(newData);
    setData(resData);
  }

  // clearing Input value

  studentName.value = "";
  studentId.value = "";
  studentEmail.value = "";
  studentContact.value = "";

  renderElement();
}

//                                  Rendering data stored in local storage

function renderElement() {
  const storedData = getData();
  console.log(storedData.length);

  if (storedData.length === 0) {
    error.style.display = "block";
    dataTable.style.display = "none";
    return;
  }

  error.style.display = "none";
  dataTable.style.display = "block";

  storedData.forEach((el) => {
    //            creating Elements

    const tableRow = document.createElement("tr");
    const nameRow = document.createElement("td");
    const idRow = document.createElement("td");
    const emailRow = document.createElement("td");
    const contactRow = document.createElement("td");
    const btnRow = document.createElement("td");
    const editBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");

    //          Adding Styling

    tableRow.classList.add("tableRow");
    nameRow.classList.add("tableData");
    idRow.classList.add("tableData");
    emailRow.classList.add("tableData");
    contactRow.classList.add("tableData");
    btnRow.classList.add("edit");

    //      Adding Value

    nameRow.innerText = el.name;
    idRow.innerText = el.id;
    emailRow.innerText = el.email;
    contactRow.innerText = el.contact;
    editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square fa-lg"></i>';
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash fa-lg">';

    // Editing Elements

    editBtn.addEventListener("click", () => {
      studentName.value = el.name;
      studentEmail.value = el.email;
      studentContact.value = el.contact;
      studentId.value = el.id;
      studentId.disabled = true;
      isEditing = true;
      currId = el.id;
      submitBtn.innerText = "Reset";

      document.querySelector("form").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    // deleting Element

    deleteBtn.addEventListener("click", () => {
      const resData = getData();
      const filterData = resData.filter((data) => data.id != el.id);
      setData(filterData);
      window.location.reload();
    });

    //          Merging Elements

    tbody.appendChild(tableRow);
    tableRow.appendChild(nameRow);
    tableRow.appendChild(idRow);
    tableRow.appendChild(emailRow);
    tableRow.appendChild(contactRow);
    tableRow.appendChild(btnRow);
    btnRow.appendChild(editBtn);
    btnRow.appendChild(deleteBtn);
  });
}

form.addEventListener("submit", submitdata);

// Nagivation events

document.querySelector("#home").addEventListener("click", () => {
  document.querySelector("body").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});
document.querySelector("#register").addEventListener("click", () => {
  document.querySelector("#registerSection").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

// removing error styling

studentName.addEventListener("input", () => {
  studentName.placeholder = "Student Name";
  studentName.classList.remove("errormsg");
});
studentId.addEventListener("input", () => {
  studentId.placeholder = "Student Id";
  studentId.classList.remove("errormsg");
});
studentContact.addEventListener("input", () => {
  studentContact.placeholder = "Contact";
  studentContact.classList.remove("errormsg");
});
renderElement();
