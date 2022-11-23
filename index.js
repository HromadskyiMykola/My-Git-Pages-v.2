//get node
const listRepos = document.querySelector('.list-repos');
const containerForm = document.querySelector('.container-form');
const input = document.querySelector('.form-input');
const button = document.querySelector('.form-button');
const containerLoader = document.querySelector(".container-loader");
//add listener
button.addEventListener('click', getValueAndClose);
input.addEventListener('keyup', ({key}) => {
    if (key === 'Enter'){
        getValueAndClose()
    }
})
//  add global value
let inputValue;
let url;
//get value in form
function getValueAndClose (){
    inputValue = input.value.replace(/\s/g, '').toLowerCase();
    containerForm.setAttribute('style', 'display:none');
    getInfoAcc(`https://api.github.com/users/${inputValue}`)
}

function getInfoAcc (url){
    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            getRepos(data)
            getName(data)
            getLink(data)
            getCreateGit(data)
            getLastUpdate(data)
            getAvatar(data)
            getMail(data)
            getAmountPublicRepo(data)
        })
        .catch(e => {
            //log Error
            console.log(e)
            containerForm.setAttribute('style', ' ')
            errorBlockHide()

        })
}
function getName (data) {
    if (!data.name){
        document.querySelector('.name').classList.add('hide');
        return
    }
    const block = document.querySelector('#name')
    block.innerHTML = data.name
}
function  getLink (data) {
    if (!data.html_url){
        document.querySelector('.git-page-url').classList.add('hide');
        return
    }
    const block = document.querySelector('.git-page-url')
    block.setAttribute('href', data.html_url)
}
function getCreateGit (data) {
    if(!data.created_at){
        document.querySelector('.date-create-git').classList.add('hide')
        return
    }
    const block = document.querySelector('#date-create-git')
    block.innerHTML = data.created_at.replace(/[TZ]/g, ' ')
}
function getLastUpdate (data) {
    if(!data.updated_at){
        document.querySelector('.last-commit').classList.add('hide')
        return
    }
    const block = document.querySelector('.date-last-commit');
    block.innerHTML =` ${data.updated_at.replace(/[TZ]/g, ' ')}`
}
function getAvatar (data){
    if(!data.avatar_url){
        return
    }
    const block = document.querySelector('.img-profile');
    block.setAttribute('src', data.avatar_url)
}
function getMail (data) {
    if(!data.mail){
        document.querySelector('.mail').classList.add('hide')
        return
    }
    const blockText = document.querySelector('.mail-span')
    blockText.innerHTML = data.mail;
}
function getAmountPublicRepo (data){
    const block = document.querySelector('.amount-repos');
    block.innerHTML = data.public_repos;
}
 function getRepos (data){
    url = data.repos
     fetch(data.repos_url)
         .then(response => {
             return response.json();
         })
         .then(data => {
             //render repos
             render(data)
             containerLoader.classList.add('hide')
             setTimeout( () =>containerLoader.remove(),0.6*1000)
         })
         .catch(e =>{
             //log error
             console.log("Error fetch GET Repos", e)
             //back to form input
             containerForm.setAttribute('style', ' ')
             errorBlockHide()
         })
 }
function createHtml (data) {
    const HTML = `<li class="repo" id="${data.id}" data-url="${data.url}" data-create-expand="false">
                       <div class="name-repo" ><i class="fa-brands fa-git-alt"></i>${data.name}</div>
<!--                       <div class="date-last-commit hide"><a href="${data.html_url}" class="style-url"><i class="fa-brands fa-git-alt"></i></a>${data.updated_at.replace(/[TZ]/g, ' ')}</div>-->
                  </li>`
    listRepos.insertAdjacentHTML('beforeend',HTML)
}
// render
function render (data) {
    data.forEach(e=>createHtml(e))
    const repo = document.querySelectorAll('.repo');
    repo.forEach(e => e.addEventListener('click',expand));
}
// expand
function expand (event) {
    const parentNode = event.target.closest('li')
    if (parentNode.getAttribute('data-create-expand') === "false"){
        console.log('do')
        const idRepos = parentNode.getAttribute('data-url')
        fetch(idRepos)
            .then(response =>{
                return response.json()
            }).then(data =>{
            createExpand(data)
        }).catch(e=>{
            console.log(e)
        })
        function createExpand (data){
            const createExpandHTML = `<div class="date-last-commit-repos ">${data.updated_at.replace(/[TZ]/g, ' ')}<a href="${data.html_url}" class="style-url"><i class="fa-solid fa-link"></i></a></div>`
            parentNode.insertAdjacentHTML('beforeend', createExpandHTML )
            parentNode.setAttribute('data-create-expand', 'true');
        }
    }
    const blockTime = parentNode.querySelector('.date-last-commit-repos')
    blockTime.classList.toggle('hide')
}
// hide error text
function errorBlockHide(){
    const errorNode = document.querySelector('.container-error')
    const errorText = document.querySelector('.error-text')
    errorNode.classList.remove('hide')
    errorText.innerHTML = 'Error try one more time'
    setTimeout(()=>{
        errorNode.classList.add('hide')
    },3*1000)
}
