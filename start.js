//loading animation
setTimeout(() => {
    let anim = document.getElementById('load-anim')
    anim.style.display = 'none'
    let disp = document.getElementById('disp')
    disp.style.display = 'flex'
    let main = document.getElementById('primary-toogle-display')
    main.style.display = 'block'
}, 500)
// side bar menu
const hamburger = document.getElementById('hamburger');
const sideBar = document.getElementById('sideBar');

hamburger.addEventListener('click', () => {
  sideBar.classList.toggle('active');
});

let Impend_only_first_name = document.getElementById('username')
let Impend_full_name = document.getElementById('username-full')
let user_F = localStorage.getItem('Firstname')
let user_L = localStorage.getItem('Lastname')

Impend_only_first_name.innerHTML = user_F
Impend_full_name.innerHTML = user_F + user_L

// primary toogle display...

var homeTool = document.getElementById('home-tool')
var setTool = document.getElementById('set-tool')
var runTool = document.getElementById('run-tool')

var toogleLoad = document.getElementById('toogle-load')

var homeDis = document.getElementById('home-page-dis')
var lessonDis = document.getElementById('lesson-page-dis')
var markDis = document.getElementById('mark-page-dis')

function homeFunc(){
    homeDis.style.display = 'flex'
    lessonDis.style.display = 'none'
    markDis.style.display = 'none'
}

function lessonFunc(){
    lessonDis.style.display = 'flex'
    homeDis.style.display = 'none'
    markDis.style.display = 'none'
}

function markFunc(){
    markDis.style.display = 'block'
    homeDis.style.display = 'none'
    lessonDis.style.display = 'none'
}

