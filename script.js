let pages = ['home', 'small-monsters', 'large-monsters', 'elder-monsters', 'search', 'monster-page']
let renderedSmall = false;
let renderedLarge = false;
let renderedElder = false;

let missingMonsters = [];

function changePage(id) {
    for (let i = 0; i < pages.length; i++) {
        if (id === pages[i]) {
            document.querySelector(`#${id}`).style.display = 'block';
            if (pages[i] === 'small-monsters') {
                document.querySelector(`#nav-small`).style.backgroundColor = '#253d3d';
                getMonsters('small');
            }
            else if (pages[i] === 'large-monsters') {
                document.querySelector(`#nav-large`).style.backgroundColor = '#253d3d';
                getMonsters('large');
            }
            else if (pages[i] === 'elder-monsters') {
                document.querySelector(`#nav-elder`).style.backgroundColor = '#253d3d';
                getMonsters('elder');
            }
        }
        else {
            document.querySelector(`#${pages[i]}`).style.display = 'none';
            if (pages[i] === 'small-monsters') {
                document.querySelector(`#nav-small`).style.backgroundColor = 'darkslategray';
            }
            else if (pages[i] === 'large-monsters') {
                document.querySelector(`#nav-large`).style.backgroundColor = 'darkslategray';
            }
            else if (pages[i] === 'elder-monsters') {
                document.querySelector(`#nav-elder`).style.backgroundColor = 'darkslategray';
            }
        }
    }
}

async function getMonsters(size) {
    let response = await fetch("https://mhw-db.com/monsters");
    let monsterList = await response.json();
    let elem = document.querySelector(`#${size}-monster-list`);

    // Prevent page from rendering extra tiles. Variables set to true at end of function.
    if (renderedSmall === true && size === 'small' || renderedLarge === true && size === 'large' || renderedElder === true && size === 'elder') {
        return;
    }

    for (let i = 0; i < monsterList.length; i++) {
        if (monsterList[i].type === size && monsterList[i].species != 'elder dragon' || size === 'elder' && monsterList[i].species === 'elder dragon') {
            let iconSrc = "assets/icons/" + monsterList[i].name.toLowerCase() + ".png";
            let monstLoc = [];
            let monstRes = [];
            let monstWk = [];

            // Populate monster location array
            for (let j = 0; j < monsterList[i].locations.length; j++) {
                monstLoc.pop();
                monstLoc.push(monsterList[i].locations[j].name.toUpperCase());
            }
            if (monsterList[i].locations.length <= 0) {
                monstLoc.push('NONE');
            }

            // Populate monster resistances array
            for (let j = 0; j < monsterList[i].resistances.length; j++) {
                monstRes.pop();
                monstRes.push(monsterList[i].resistances[j].element.toUpperCase());
            }
            if (monsterList[i].resistances.length <= 0) {
                monstRes.push('NONE');
            }

            // Populate monster weaknesses array
            for (let j = 0; j < monsterList[i].weaknesses.length; j++) {
                monstWk.pop();
                monstWk.push(monsterList[i].weaknesses[j].element.toUpperCase());
            }
            if (monsterList[i].weaknesses.length <= 0) {
                monstWk.push('NONE');
            }



            elem.innerHTML += `
            <div class="monster-tile flex align-center gap-3" onclick="viewMonster('${monsterList[i].name}')">
                <img src="${iconSrc}" alt="Monster Icon">
                <p>${monsterList[i].name.toUpperCase()}</p>
                <P>${monstLoc}</p>
                <p class="monster-res flex">RES: ${monstRes}</p>
                <p class="monster-wk flex">WEAK: ${monstWk}</p>
            </div>
            `
        }
    }

    // Prevent page from rendering extra tiles.
    if (size === 'small')
        renderedSmall = true;
    else if (size === 'large')
        renderedLarge = true;
    else if (size === 'elder')
        renderedElder = true;
}

function viewItems(elem) {
    let e = document.querySelector(`${elem}`);
    if (e.style.display === 'block') {
        e.style.display = 'none';
        console.log(`${elem} is no longer showing.`);
    }
    else {
        e.style.display = 'block';
        console.log(`${elem} is showing.`);
    }
}

onresize = (event) => {
    if (window.innerWidth >= 1024) {
        document.querySelector('#nav-links').style.display = 'flex';
    }
    else {
        document.querySelector('#nav-links').style.display = 'none';
    }
    if (window.innerWidth >= 640) {
        document.querySelector('#search-bar').style.display = 'flex';
        document.querySelector('.filter-list').style.display = 'block';
    }
    else {
        document.querySelector('#search-bar').style.display = 'none';
        document.querySelector('.filter-list').style.display = 'none';
    }
};

function viewMonster(name) {
    let elem = document.querySelector('#monster-page');

    elem.innerHTML = `
    <div id="left-col" class="flex-col align-center gap-3">
        <img src='assets/icons/${name}>
        <div>
            <h2>Class</h2>
            <h2>Locations</h2>
        </div>
    </div>
    <div id="right-col" class="flex-col justify-between gap-3">
        <h2>Resistances</h2>
        <h2>Weaknesses</h2>
        <h2>Recommended Protection</h2>
    </div>
    `
    
    changePage('monster-page');
    console.log('yes');
}