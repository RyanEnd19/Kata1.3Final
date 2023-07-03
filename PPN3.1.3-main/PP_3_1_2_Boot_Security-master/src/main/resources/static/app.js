const url2 = 'http://localhost:8090/api/admin/userinfo'

//head
const header= document.getElementById('userHeader')
const header2= document.getElementById('userHeader2')

//main table
const tableId = document.getElementById('table-body')

//table for auth user
const userInfo = document.getElementById('authUserInfo')




async function getTable() {
    let temp = await fetch('http://localhost:8090/api/admin/table/')
    if (temp.ok) {
        let listUsers = await temp.json()
        getTableUsers(listUsers)
    } else {
        alert('Error, ${temp.status}')
    }
}
function getTableUsers(listUsers) {
    let temp = '';
    for( let user of listUsers) {
        let roles1 = []
        for(let roles of user.roles) {
            roles1.push(" " + roles.role.toString()
                .replaceAll("ROLE_", ""))
        }
        temp += `<tr>
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>${roles1}</td>
            <td>
                <button type="button" id="ed_btn" class="btn btn-primary" data-bs-toogle="modal"
                data-bs-target="#editModal"
                onclick="contentEditModal(${user.id})">Edit</button>
            </td>

            <td>
                <button class="btn btn-danger" data-bs-toogle="modal"
                data-bs-target="#deleteModal"
                onclick="contentDeleteModal(${user.id})">Delete</button>
            </td>
        </tr>`
    }
tableId.innerHTML = temp
}
getTable();
getUserInfo()
async function getUserInfo() {       //header
    let temp = await fetch(url2)
    if (temp.ok) {
        let user = await temp.json()
        let email = user.email
        let roles = user.roles
        getUser(user)
        getNavBar({email, roles})
    } else {
        alert('Error, ${temp.status}')
    }

}
function getNavBar({email, roles}) {    //header
    let roles1 = ''
    for (let el of roles) {
        roles1 += ' '
        roles1 += el.role.toString()
            .replaceAll("ROLE_", "");
    }
    header.innerHTML = email
    header2.innerHTML = roles1
}
function getUser(user) {
    let rtemp =[]
    for (let rel of user.roles) {
        rtemp.push(" " + rel.role.toString()
            .replaceAll("ROLE_", ""))
    }
    let temp = ''
    temp +=
        `<tr>
          <td>${user.id}</td>
          <td>${user.firstName}</td>
          <td>${user.lastName}</td>
          <td>${user.age}</td>
          <td>${user.email}</td>
          <td>${rtemp}</td>
         </tr>`;
    userInfo.innerHTML = temp
}
//new user start
const form_n = document.getElementById('newUserForm')
const roles_n = document.querySelector('#roleNew').selectedOptions

form_n.addEventListener('submit', newUser)
async function newUser(ev) {
    ev.preventDefault()
    //console.log(form_n.user.roles.value)
    let newRoles = []
    for(let i = 0; i < roles_n.length; i++){
        newRoles.push({
            id:roles_n[i].value
        })
    }


    let method = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            firstName: document.getElementById('newFirstName').value,
            lastName: document.getElementById('newLastName').value,
            age: document.getElementById('newage').value,
            email: document.getElementById('newemail').value,
            password: document.getElementById('newpassword').value,
            roles: newRoles
        })
    }
    fetch('http://localhost:8090/api/admin/add/', method).then(() => {
        document.getElementById('nav-home-tab').click()
        form_n.reset();
        getTable()
    })
}
//new user end


//editUser start
const ed_id = document.getElementById('idEdit')
const ed_fn = document.getElementById('firstnameEdit')
const ed_ln = document.getElementById('lastNameEdit')
const ed_age = document.getElementById('ageEdit')
const ed_email = document.getElementById('emailEdit')
const ed_pw = document.getElementById('passwordEdit')
const ed_rs = document.getElementById('rolesEdit')
const ed_form = document.getElementById('editForm')



window.contentEditModal = contentEditModal
async function contentEditModal(id) {
    $('#modalEdit').modal('show')
    let ed_url2 = 'http://localhost:8090/api/admin/user/' + id
    let temp = await fetch(ed_url2)
    if (temp.ok) {
        await temp.json().then(async user => {
            ed_id.value = user.id
            ed_fn.value = user.firstName
            ed_ln.value = user.lastName
            ed_age.value = user.age
            ed_email.value = user.email
            ed_pw.value = user.password

        })
    } else {
        alert('error')
    }
}
ed_form.addEventListener('submit', e => {
    e.preventDefault()
    let ed_url = 'http://localhost:8090/api/admin/update/'
    let editRoles = []

    for (let i = 0; i < ed_form.roles.options.length; i++) {
        if (ed_form.roles.options[i].selected) {
            let tmp = {}
            tmp["id"] = ed_form.roles.options[i].value
            editRoles.push(tmp)
        }
    }
    let method = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: document.getElementById('idEdit').value,
            firstName: document.getElementById('firstnameEdit').value,
            lastName: document.getElementById('lastNameEdit').value,
            age: document.getElementById('ageEdit').value,
            email: document.getElementById('emailEdit').value,
            password: document.getElementById('passwordEdit').value,
            roles: editRoles
        })
    }
    fetch(ed_url, method)
        .then(res => res.json())
        .then(() => {
            $('#footered').click();
            getTable()
        }).catch(error => console.log(error))
})
//edit user end

//delete user start
//delete fields etc
const id_del = document.getElementById('idDelete')
const del_fn = document.getElementById('firstNameDelete')
const del_ln = document.getElementById('lastNameDelete')
const del_age = document.getElementById('ageDelete')
const del_email = document.getElementById('emailDelete')
const del_rs = document.getElementById('rolesDelete')
const del_form = document.getElementById('del_form')

window.contentDeleteModal = contentDeleteModal
async function contentDeleteModal(id) {
    $('#deleteModal').modal('show')
    let del_url2 = 'http://localhost:8090/api/admin/user/' + id
    let temp = await fetch(del_url2)
    if(temp.ok) {
        await temp.json().then(user => {
            let t = ''
            t += user.roles.map(r => r.role.replaceAll("ROLE_", "")).join(", ")
            id_del.value = user.id
            del_fn.value = user.firstName
            del_ln.value = user.lastName
            del_age.value = user.age
            del_email.value = user.email
            del_rs.value = t
        })
    } else {
        alert('delete error')
    }
}
del_form.addEventListener('submit', e => {
    e.preventDefault()
    let del_url = 'http://localhost:8090/api/admin/delete/' + id_del.value;
    let method = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    }
    fetch(del_url, method)
        .then(res => res.json())
        .then(() => {
            $('#footerdel').click()
            getTable()
        }).catch(error => console.log(error))
})

//delete user end