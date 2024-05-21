let pages = ['home', 'small-monsters', 'large-monsters', 'elder-monsters', 'monster-page']
let renderedSmall = false;
let renderedLarge = false;
let renderedElder = false;

let missingMonsters = [];

function changePage(id) {
    for (let i = 0; i < pages.length; i++) {
        if (id === pages[i]) {
            document.querySelector(`#${id}`).style.display = 'block';
            if (pages[i] === 'small-monsters') {
                document.querySelector('#nav-small').style.backgroundColor = '#253d3d';
                getMonsters('small');
            }
            else if (pages[i] === 'large-monsters') {
                document.querySelector('#nav-large').style.backgroundColor = '#253d3d';
                getMonsters('large');
            }
            else if (pages[i] === 'elder-monsters') {
                document.querySelector('#nav-elder').style.backgroundColor = '#253d3d';
                getMonsters('elder');
            }
        }
        else {
            document.querySelector(`#${pages[i]}`).style.display = 'none';
            if (pages[i] === 'small-monsters') {
                document.querySelector('#nav-small').style.backgroundColor = 'darkslategray';
            }
            else if (pages[i] === 'large-monsters') {
                document.querySelector('#nav-large').style.backgroundColor = 'darkslategray';
            }
            else if (pages[i] === 'elder-monsters') {
                document.querySelector('#nav-elder').style.backgroundColor = 'darkslategray';
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
            <div class="monster-tile flex align-center" onclick="viewMonster('${monsterList[i].name}')">
                <div class='col-bio'>
                    <img src="${iconSrc}" alt="Monster Icon">
                    <p class='monster-name'>${monsterList[i].name.toUpperCase()}</p>
                    <P class='monster-loc'>${monstLoc}</p>
                </div>
                <div class='col-info'>
                    <p class="monster-res flex">RES: ${monstRes}</p>
                    <p class="monster-wk flex">WEAK: ${monstWk}</p>
                </div>
                
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



async function viewMonster(name) {
    changePage('monster-page');
    let response = await fetch(`https://mhw-db.com/monsters?q={"name":"${name}"}`);
    let monsterArray = await response.json();
    let currMonster = monsterArray[0];
    console.log(currMonster);
    let elem = document.querySelector('#monster-page');

    // Grab the monster locations and zones
    let monsterLocs = [];
    for(let i =0; i<currMonster.locations.length; i++) {
        monsterLocs.push(currMonster.locations[i].name.toUpperCase() + ' (' + currMonster.locations[i].zoneCount + ')' );
    }

    // Grab monster ailments
    let monsterAilments = [];
    for(let i=0;i<currMonster.ailments.length;i++) {
        monsterAilments.push(currMonster.ailments[i].name.toUpperCase());
    }

    elem.innerHTML = `
    <div class="monster-page-bio flex-col align-center">
        <img src='assets/icons/${name}.png'>
        <h2>${name.toUpperCase()}</h2>
        <div>
            <div class="monster-species">
                <h3>SPECIES</h3>
                <p>${currMonster.species.toUpperCase()}</p>
            </div>
            <div class="monster-locations">
                <h3>LOCATIONS</h3>
                <p>${monsterLocs.join(', ')}</p>
            </div>
        </div>
    </div>
    <div class="monster-page-info flex-col justify-between">
        <h3>EFFECTIVENESS</h3>
        <div class="monster-eff flex justify-around">
            <div class="monster-eff-elements flex gap-1">
                <ul class="elements-labels">
                    <li>FIRE</li>
                    <li>WATER</li>
                    <li>THUNDER</li>
                    <li>ICE</li>
                    <li>DRAGON</li>
                </ul>
                <ul class="elements-pwr">
                    <li class='fire'></li>
                    <li class='water'></li>
                    <li class='thunder'></li>
                    <li class='ice'></li>
                    <li class='dragon'></li>
                </ul>
            </div>
            <div class="monster-eff-statuses flex gap-1">
                <ul class="statuses-labels">
                    <li>POISON</li>
                    <li>SLEEP</li>
                    <li>PARALYSIS</li>
                    <li>BLAST</li>
                    <li>STUN</li>
                </ul>
                <ul class="statuses-pwr">
                    <li class='poison'></li>
                    <li class='sleep'></li>
                    <li class='paralysis'></li>
                    <li class='blast'></li>
                    <li class='stun'></li>
                </ul>
            </div>
        </div>
        <h3>DANGER: MONSTER AILMENTS</h3>
        <p class="monster-ailments">${monsterAilments.join(', ')}</p>
    </div>
    `

    // Grab the monster resistances and conditions
    let monsterRes = [];
    for(let i =0; i<currMonster.resistances.length; i++) {
        if(currMonster.resistances[i].condition != null) {
            monsterRes.push(currMonster.resistances[i].element.toUpperCase() + "!");
        }
        else {
            monsterRes.push(currMonster.resistances[i].element.toUpperCase());
        }
    }
    
    let docMonsterEff = ['fire','water','thunder','ice','dragon','poison','sleep','paralysis','blast','stun'];

    // Place an X if the monster has resistance to that element/status
    for(let i = 0; i<monsterRes.length;i++) {
        for(let j = 0; j < docMonsterEff.length; j++) {
            if(monsterRes[i] === docMonsterEff[j].toUpperCase() + "!") {
                document.querySelector(`.${docMonsterEff[j]}`).innerHTML += '(<span class="x-icon">X</span>)';
            }
            else if(monsterRes[i] === docMonsterEff[j].toUpperCase()) {
                document.querySelector(`.${docMonsterEff[j]}`).innerHTML += '<span class="x-icon">X</span>';
            }
        }
    }
    
    // Grab the monster weaknesses, stars, conditions
    let monsterWeaks = [];
    for(let i=0;i<currMonster.weaknesses.length; i++) {
        if(currMonster.weaknesses[i].condition != null) {
            monsterWeaks.push(currMonster.weaknesses[i].element.toUpperCase() + currMonster.weaknesses[i].stars + "!");
        }
        else {
            monsterWeaks.push(currMonster.weaknesses[i].element.toUpperCase() + currMonster.weaknesses[i].stars);
        }
    }
    
    // Place stars based on effectiveness and parentheses if there are conditions 
    // (eventually add tooltip for what the condition actually is)
    for(let i =0;i < monsterWeaks.length;i++) {
        for(let j=0;j<docMonsterEff.length; j++) {
            if(monsterWeaks[i] === docMonsterEff[j].toUpperCase() + "1" + "!") {
                document.querySelector(`.${docMonsterEff[j]}`).innerHTML += '(<span class="star">&starf;</span>)'
            }
            else if(monsterWeaks[i] === docMonsterEff[j].toUpperCase() + "2" + "!") {
                document.querySelector(`.${docMonsterEff[j]}`).innerHTML += '(<span class="star">&starf;&starf;</span>)'
            }
            else if(monsterWeaks[i] === docMonsterEff[j].toUpperCase() + "3" + "!") {
                document.querySelector(`.${docMonsterEff[j]}`).innerHTML += '(<span class="star">&starf;&starf;&starf;</span>)'
            }
            else if(monsterWeaks[i] === docMonsterEff[j].toUpperCase() + "1") {
                document.querySelector(`.${docMonsterEff[j]}`).innerHTML += '<span class="star">&starf;</span>'
            }
            else if(monsterWeaks[i] === docMonsterEff[j].toUpperCase() + "2") {
                document.querySelector(`.${docMonsterEff[j]}`).innerHTML += '<span class="star">&starf;&starf;</span>'
            }
            else if(monsterWeaks[i] === docMonsterEff[j].toUpperCase() + "3") {
                document.querySelector(`.${docMonsterEff[j]}`).innerHTML += '<span class="star">&starf;&starf;&starf;</span>'
            }
        }
    }
}