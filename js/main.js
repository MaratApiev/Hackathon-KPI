// input connect
let firstName = document.querySelector('#input-fname')
let lastName = document.querySelector('#input-lname')
let phoneNum = document.querySelector('#input-phone')
let weekKPI = document.querySelector('#input-week-kpi')
let monthKPI = document.querySelector('#input-month-kpi')
let addStudent = document.querySelector('#add-btn')


// add student
const STUDENT_API = ' http://localhost:8000/students';

async function addStudentFunc(){

    if(
        !firstName.value.trim() ||
        !lastName.value.trim() ||
        !phoneNum.value.trim() ||
        !weekKPI.value.trim() ||
        !monthKPI.value.trim() 
    ){
        alert('Some inputs are empty!');
        return;
    };

    let studentObj = {
        firstName: firstName.value,
        lastName: lastName.value,
        phoneNum: phoneNum.value,
        weekKPI: weekKPI.value,
        monthKPI: monthKPI.value,
    };

    fetch(STUDENT_API, {
        method: 'POST',
        body: JSON.stringify(studentObj),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    });

    alert('Student added successfully!');

    firstName.value = '';
    lastName.value = '';
    phoneNum.value = '';
    weekKPI.value = '';
    monthKPI.value = '';

    render();
};

addStudent.addEventListener('click', addStudentFunc);


let currentPage = 1;
let search = '';
let category = '';
let limit = 2;
// render
async function render(){
    let studContainer = document.querySelector('.student-container');
    studContainer.innerHTML = '';

    let requestAPI = `${STUDENT_API}?q=${search}&category=${category}&_page=${currentPage}&_limit=${limit}`;
    if(!category){
        requestAPI = `${STUDENT_API}?q=${search}&_page=${currentPage}&_limit=${limit}`;
    }
    if(search !== ''){
        requestAPI = `${STUDENT_API}?q=${search}`
    }

    let res = await fetch(requestAPI);
    let data = await res.json();
    data.forEach(item => {
    studContainer.innerHTML += `
        <div class="card" id="${item.id}" style="width: 18rem;">
        <img src="https://as1.ftcdn.net/v2/jpg/01/50/42/14/1000_F_150421416_uwITMwNvRXhyKa1EPhUa4OFYqsCRCqSx.jpg" style="height: 300px;" class="card-img-top" alt="error((((((((">
        <div class="card-body">
        <h3 class="card-title">First Name: ${item.firstName}</h3>
        <h3 class="card-title">Last Name: ${item.lastName}</h3>
        <p class="card-text">Phone Number:(+996) ${item.phoneNum}</p>
        <p class="card-text">Week KPI: ${item.weekKPI} %</p>
        <p class="card-text">Month KPI: ${item.monthKPI} %</p>
        <a href="#" class="btn btn-danger btn-delete" id="${item.id}">Delete</a>
        <a href="#" class="btn btn-success btn-edit" data-bs-toggle="modal" data-bs-target="#exampleModal2" id="${item.id}">Update</a>
        </div>
        </div>
        `
    });

    if(data.length === 0) return;
    addEditEvent();
    addDeleteEvent();
};
render();

// update

let saveChangesBtn = document.querySelector('#update-btn');

let firstNameUpdate = document.querySelector('#input-update-fname')
let lastNameUpdate = document.querySelector('#input-update-lname')
let phoneNumUpdate = document.querySelector('#input-update-phone')
let weekKPIupdate = document.querySelector('#input-week-kpi-update')
let monthKPIupdate = document.querySelector('#input-month-kpi-update') 

async function addStudentsDataToForm(e){
    let studentId = e.target.id;
    let res = await fetch(`${STUDENT_API}/${studentId}`);
    let studentObj = await res.json();


    firstNameUpdate.value = studentObj.firstName;
    lastNameUpdate.value = studentObj.lastName;
    phoneNumUpdate.value = studentObj.phoneNum;
    weekKPIupdate.value = studentObj.weekKPI;
    monthKPIupdate.value = studentObj.monthKPI;

    saveChangesBtn.setAttribute('id', studentObj.id);
}

function addEditEvent(){
    let btnEditProduct = document.querySelectorAll('.btn-edit');
    btnEditProduct.forEach(item => {
        item.addEventListener('click', addStudentsDataToForm)
    })
};

async function saveChanges(e){
    let updatedStudentObj = {
        id: e.target.id,
        firstName: firstNameUpdate.value,
        lastName: lastNameUpdate.value,
        phoneNum: phoneNumUpdate.value,
        weekKPI: weekKPIupdate.value,
        monthKPI: monthKPIupdate.value
    };

    await fetch(`${STUDENT_API}/${e.target.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedStudentObj),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    });

    firstNameUpdate.value = '';
    lastNameUpdate.value = '';
    phoneNumUpdate.value = '';
    weekKPIupdate.value = '';
    monthKPIupdate.value = ''

    saveChangesBtn.removeAttribute('id');


    render()
};

saveChangesBtn.addEventListener('click', saveChanges);

// delete accounts

async function deleteStudent(e){
    let studentsId = e.target.id;

    await fetch(`${STUDENT_API}/${studentsId}`, {
        method: 'DELETE'
    });

    render();
};

function addDeleteEvent(){
    let deleteStudentBtn = document.querySelectorAll('.btn-delete');
    deleteStudentBtn.forEach(item => {
        item.addEventListener('click', deleteStudent)
    });
};

// pagination

let prevPageBtn = document.querySelector('#prev-page-btn');
let nextPageBtn = document.querySelector('#next-page-btn');

prevPageBtn.addEventListener('click', () => { 
    currentPage -- ; 
    render(); 
    maxProd(); 
}); 
nextPageBtn.addEventListener('click', () => { 
    currentPage++; 
    render(); 
    maxProd(); 
}); 
 
prevPageBtn.style.display = 'none' 
 
    async function maxProd() { 
        let res = await fetch(STUDENT_API); 
        let data = await res.json(); 
        console.log(data); 
        let amount = data.length; 
        let pageNum = Math.ceil(amount / limit); 
 
        if (currentPage == 1) { 
         prevPageBtn.style.display = 'none' 
        } else{ 
         prevPageBtn.style.display = 'block' 
        } 
         
        if(currentPage == pageNum){ 
            nextPageBtn.style.display = 'none' 
        }else{ 
            nextPageBtn.style.display = 'block' 
        } 
    } 
 
    maxProd()

    // search

    let searchInp = document.querySelector('#search-inp');
    searchInp.addEventListener('input', () => {
    search = searchInp.value;
    render();
})