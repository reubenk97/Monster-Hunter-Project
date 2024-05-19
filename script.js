var pages = ['home', 'small-monsters', 'large-monsters', 'elder-monsters', 'search']
function changePage(id) {
    for(let i = 0; i < pages.length;i++) {
        if(id === pages[i]) {
            document.querySelector(`#${id}`).style.display = 'block';
            console.log(`${id}:yes`);        }
        else {
            document.querySelector(`#${pages[i]}`).style.display = 'none';
            console.log(`${id}:no`);
        }
    }
}