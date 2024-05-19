var pages = ['home', 'small-monsters', 'large-monsters', 'elder-monsters', 'search']

function changePage(id) {
    for(let i = 0; i < pages.length;i++) {
        if(id === pages[i]) {
            document.querySelector(`#${id}`).style.display = 'block';
            if(pages[i] === 'small-monsters') {
                document.querySelector(`#nav-small`).style.backgroundColor = '#677583';
            }
            else if(pages[i] === 'large-monsters') {
                document.querySelector(`#nav-large`).style.backgroundColor = '#677583';
            }
            else if(pages[i] === 'elder-monsters') {
                document.querySelector(`#nav-elder`).style.backgroundColor = '#677583';
            }
        }
        else {
            document.querySelector(`#${pages[i]}`).style.display = 'none';
            if(pages[i] === 'small-monsters') {
                document.querySelector(`#nav-small`).style.backgroundColor = 'lightslategray';
            }
            else if(pages[i] === 'large-monsters') {
                document.querySelector(`#nav-large`).style.backgroundColor = 'lightslategray';
            }
            else if(pages[i] === 'elder-monsters') {
                document.querySelector(`#nav-elder`).style.backgroundColor = 'lightslategray';
            }
        }
    }
}

async function getSmallMonsters() {
    let response = await fetch("https://mhw-db.com/monsters");
    let monsterList = await response.json();
    let smallElem = document.querySelector('#small-monster-list');

    for(let i = 0; i < monsterList.length; i++) {
        if(monsterList[i].type === 'small') {
            let iconSrc = 'assets/' + monsterList[i].name.toLowerCase() + '.png';
            let monstLoc = [];
            let monstRes = [];
            let monstWk = [];

            // Populate monster location array
            for(let j=0; j<monsterList[i].locations.length;j++) {
                monstLoc.pop();
                monstLoc.push(monsterList[i].locations[j].name.toUpperCase());
            }
            if(monsterList[i].locations.length <= 0) {
                monstLoc.push('NONE');
            }

            // Populate monster resistances array
            for(let j=0; j<monsterList[i].resistances.length;j++) {
                monstRes.pop();
                monstRes.push(monsterList[i].resistances[j].element.toUpperCase());
            }
            if(monsterList[i].resistances.length <= 0) {
                monstRes.push('NONE');
            }
            
            // Populate monster weaknesses array
            for(let j=0; j<monsterList[i].weaknesses.length;j++) {
                monstWk.pop();
                monstWk.push(monsterList[i].weaknesses[j].element.toUpperCase());
            }
            if(monsterList[i].weaknesses.length <= 0) {
                monstWk.push('NONE');
            }
            
            

            smallElem.innerHTML += `
            <div class="small-item flex align-center gap-3">
                <img src='${iconSrc}' alt='Monster Icon'>
                <p>${monsterList[i].name.toUpperCase()}</p>
                <P>${monstLoc}</p>
                <p class="small-res flex">RES: ${monstRes}</p>
                <p class="small-wk flex">WEAK: ${monstWk}</p>
            </div>
            `
        }
    }
}

getSmallMonsters();