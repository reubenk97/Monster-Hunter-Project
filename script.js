let pages = ['home', 'small-monsters', 'large-monsters', 'elder-monsters', 'monster-page', 'search-page']
let renderedSmall = false;
let renderedLarge = false;
let renderedElder = false;
let searchInput = '';

// API is missing many monsters, manually keeping track here.
let missingMonsters = ['Acidic Glavenus', 'Alatreon', 'Anteka', 'Banbaro', 'Barioth', 'Beotodus', 'Blackveil Vaal Hazak', 'Brachydios', 'Brute Tigrex', 'Coral Pukei-Pukei', 'Cortos', 'Deviljho', 'Ebony Odogaron', 'Fatalis', 'Frostfang Barioth', 'Fulgur Anjanath', 'Furious Rajang', 'Glavenus', 'Gold Rathian', 'Nargacuga', 'Nightshade Paolumu', 'Popo', 'Raging Brachydios', 'Ruiner Nergigante', 'Savage Deviljho', 'Scarred Yian Garuga', 'Seething Bazelgeuse', 'Shara Ishvalda', 'Shrieking Legiana', 'Silver Rathalos', 'Tigrex', 'Velkhana', 'Wulg', 'Yian Garuga'];


function changePage(id) {
    for (let i = 0; i < pages.length; i++) {
        if (id != 'monster-page') {
            document.querySelector('#monster-page').innerHTML = '';
        }

        if (id != 'search-page') {
            document.querySelector('#search-page').innerHTML = '';
            document.querySelector('#search-bar input').value = '';
            searchInput = '';
        }

        if (window.innerWidth < 640) {
            document.querySelector('#nav-links').style.display = 'none';
            document.querySelector('#search-bar').style.display = 'none';
        }
        else if (window.innerWidth < 1024) {
            document.querySelector('#nav-links').style.display = 'none';
        }

        if (id === pages[i]) {
            if (pages[i] === 'small-monsters') {
                document.querySelector(`#${id}`).style.display = 'block';
                document.querySelector('#nav-small').style.backgroundColor = '#253d3d';
                if(document.querySelector('#small-monsters select').value != 'NONE') {
                    document.querySelector('#small-monsters select').value = 'NONE';
                    filterList(document.querySelector('#small-filters'),'small');
                }
                getMonsters('small');
            }
            else if (pages[i] === 'large-monsters') {
                document.querySelector(`#${id}`).style.display = 'block';
                document.querySelector('#nav-large').style.backgroundColor = '#253d3d';
                if(document.querySelector('#large-monsters select').value != 'NONE') {
                    document.querySelector('#large-monsters select').value = 'NONE';
                    filterList(document.querySelector('#large-filters'),'large');
                }
                getMonsters('large');
            }
            else if (pages[i] === 'elder-monsters') {
                document.querySelector(`#${id}`).style.display = 'block';
                document.querySelector('#nav-elder').style.backgroundColor = '#253d3d';
                if(document.querySelector('#elder-monsters select').value != 'NONE') {
                    document.querySelector('#elder-monsters select').value = 'NONE';
                    filterList(document.querySelector('#elder-filters'),'elder');
                }
                getMonsters('elder');
            }
            else if (pages[i] === 'search-page') {
                document.querySelector(`#${id}`).style.display = 'flex';
                getSearch();
            }
            else {
                document.querySelector(`#${id}`).style.display = 'block';
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
    let response = {};
    // Prevent page from rendering extra tiles. Variables set to true at end of function.
    if (renderedSmall === true && size === 'small' || renderedLarge === true && size === 'large' || renderedElder === true && size === 'elder') {
        return;
    }

    if (size === 'small') {
        response = await fetch('https://mhw-db.com/monsters?q={"type":"small"}');
    }
    else if (size === 'large') {
        response = await fetch('https://mhw-db.com/monsters?q={"type":"large"}');
    }
    else {
        response = await fetch('https://mhw-db.com/monsters?q={"species":"elder dragon"}');
    }
    let monsterList = await response.json();
    let elem = document.querySelector(`#${size}-monster-list`);

    // Check if size is large and not elder dragon, since elder dragon is a species, not type. Only for large monster list, other lists are fine.
    if (size === 'large') {
        for (let i = 0; i < monsterList.length; i++) {
            if (monsterList[i].species === 'elder dragon') {
                continue;
            }
            else {
                let monstLoc = '';
                let monstRes = '';
                let monstWk = [];

                // Show monster location preview
                if (monsterList[i].locations.length > 0) {
                    monstLoc = monsterList[i].locations[0].name.toUpperCase();
                }
                else {
                    monstLoc = 'NONE';
                }

                // Show monster resistance preview
                if (monsterList[i].resistances.length > 0) {
                    monstRes = monsterList[i].resistances[0].element.toUpperCase();
                }
                else
                    monstRes = 'NONE';

                // Populate monster weaknesses array with 3 stars
                for (let j = 0; j < monsterList[i].weaknesses.length; j++) {
                    if (monsterList[i].weaknesses[j].stars === 3) {
                        if (monstWk.length >= 2) {
                            monstWk.push('...');
                            break;
                        }
                        else {
                            monstWk.push(monsterList[i].weaknesses[j].element.toUpperCase());
                        }
                    }
                }
                if (monstWk.length <= 0) {
                    monstWk.push('NONE');
                }
                // !Need to fix the onclick for Xeno and Safi since they have ' in their names.

                elem.innerHTML += `
                    <div class="monster-tile flex align-center" onclick="viewMonster('${monsterList[i].name}')">
                        <div class='col-bio'>
                            <img src="assets/icons/${monsterList[i].name.toLowerCase()}.png" alt="Monster Icon">
                            <p class='monster-name'>${monsterList[i].name.toUpperCase()}</p>
                            <P class='monster-loc'>${monstLoc}</p>
                        </div>
                        <div class='col-info'>
                            <p class="monster-res flex">${monstRes}</p>
                            <p>|</p>
                            <p class="monster-wk flex">${monstWk.join(', ')}</p>
                        </div>
                        
                    </div>
                `
            }
        }
    }
    else {
        for (let i = 0; i < monsterList.length; i++) {
            let iconSrc = "assets/icons/" + monsterList[i].name.toLowerCase() + ".png";
            let monstLoc = '';
            let monstRes = '';
            let monstWk = [];

            // Show monster location preview
            if (monsterList[i].locations.length > 0) {
                monstLoc = monsterList[i].locations[0].name.toUpperCase();
            }
            else {
                monstLoc = 'NONE';
            }

            // Show monster resistance preview
            if (monsterList[i].resistances.length > 0) {
                monstRes = monsterList[i].resistances[0].element.toUpperCase();
            }
            else
                monstRes = 'NONE';

            // Populate monster weaknesses array with 3 stars
            for (let j = 0; j < monsterList[i].weaknesses.length; j++) {
                if (monsterList[i].weaknesses[j].stars === 3) {
                    if (monstWk.length >= 2) {
                        monstWk.push('...');
                        break;
                    }
                    else {
                        monstWk.push(monsterList[i].weaknesses[j].element.toUpperCase());
                    }
                }
            }
            if (monstWk.length <= 0) {
                monstWk.push('NONE');
            }

            if (monsterList[i].name.includes("Xeno")) {
                var monsterName = "Xenojiiva";
                console.log('i am there')
            }
            else if (monsterList[i].name.includes("Safi")) {
                var monsterName = "Safijiiva";
            }
            else {
                var monsterName = monsterList[i].name;
            }

            elem.innerHTML += `
                <div class="monster-tile flex align-center" onclick='viewMonster("${monsterName}")'>
                    <div class='col-bio'>
                        <img src="assets/icons/${monsterList[i].name.toLowerCase()}.png" alt="Monster Icon">
                        <p class='monster-name'>${monsterList[i].name.toUpperCase()}</p>
                        <P class='monster-loc'>${monstLoc}</p>
                    </div>
                    <div class='col-info'>
                        <p class="monster-res flex">${monstRes}</p>
                        <p>|</p>
                        <p class="monster-wk flex">${monstWk.join(', ')}</p>
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
    let e = document.querySelectorAll(`${elem}`);
    e.forEach((element) => {
        if (element.style.display === 'block') {
            element.style.display = 'none';
            console.log(`${elem} is no longer showing.`);
        }
        else {
            element.style.display = 'block';
            console.log(`${elem} is showing.`);
        }
    });
}

// Show and hide nav menu, search bar, and filter menu based on window size. Basically a reset for the toggling on the hamburger menu, search icon, and filter icon.
onresize = (event) => {
    if (window.innerWidth >= 1024) {
        document.querySelector('#nav-links').style.display = 'flex';
    }
    else {
        document.querySelector('#nav-links').style.display = 'none';
    }

    if (window.innerWidth >= 640) {
        document.querySelector('#search-bar').style.display = 'flex';
        let e = document.querySelectorAll('.filter-list');
        e.forEach((elem) => {
            elem.style.display = 'block';
        });
    }
    else {
        document.querySelector('#search-bar').style.display = 'none';
        let e = document.querySelectorAll('.filter-list');
        e.forEach((elem) => {
            elem.style.display = 'none';
        });
    }
};


async function viewMonster(name) {
    changePage('monster-page');
    response = [];

    // Manually change name of Safi and Xeno back to the API name.
    if (name === 'Xenojiiva') {
        name = "Xeno'jiiva";
    }
    else if (name === 'Safijiiva') {
        name = "Safi'jiiva";
    }

    response = await fetch(`https://mhw-db.com/monsters?q={"name":"${name}"}`);

    let monsterArray = await response.json();
    let currMonster = monsterArray[0];
    console.log(currMonster);
    let elem = document.querySelector('#monster-page');

    // Grab the monster locations and zones
    let monsterLocs = [];
    for (let i = 0; i < currMonster.locations.length; i++) {
        monsterLocs.push(currMonster.locations[i].name.toUpperCase() + ' (' + currMonster.locations[i].zoneCount + ')');
    }

    // Grab monster ailments
    let monsterAilments = [];
    for (let i = 0; i < currMonster.ailments.length; i++) {
        monsterAilments.push(currMonster.ailments[i].name.toUpperCase());
    }
    if (monsterAilments.length === 0) {
        monsterAilments.push('NONE');
    }

    elem.innerHTML = `
    <div class="monster-page-bio flex-col align-center">
        <div class="monster-pic">
            <img src="assets/full-size/${name}.png">
            <h2>${name.toUpperCase()}</h2>
        </div>
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
        <div class="monster-ailments">
            <h3>DANGER: MONSTER AILMENTS</h3>
            <p>${monsterAilments.join(', ')}</p>
        </div>
    </div>
    `

    // Grab the monster resistances and conditions
    let monsterRes = [];
    for (let i = 0; i < currMonster.resistances.length; i++) {
        if (currMonster.resistances[i].condition != null) {
            monsterRes.push(currMonster.resistances[i].element.toUpperCase() + "!");
        }
        else {
            monsterRes.push(currMonster.resistances[i].element.toUpperCase());
        }
    }

    let docMonsterEff = ['fire', 'water', 'thunder', 'ice', 'dragon', 'poison', 'sleep', 'paralysis', 'blast', 'stun'];

    // Place an X if the monster has resistance to that element/status
    for (let i = 0; i < monsterRes.length; i++) {
        for (let j = 0; j < docMonsterEff.length; j++) {
            if (monsterRes[i] === docMonsterEff[j].toUpperCase() + "!") {
                document.querySelector(`.${docMonsterEff[j]}`).innerHTML += '(<span class="x-icon">&#x2715;</span>)';
            }
            else if (monsterRes[i] === docMonsterEff[j].toUpperCase()) {
                document.querySelector(`.${docMonsterEff[j]}`).innerHTML += '<span class="x-icon">&#x2715;</span>';
            }
        }
    }

    // Grab the monster weaknesses, stars, conditions
    let monsterWeaks = [];
    for (let i = 0; i < currMonster.weaknesses.length; i++) {
        if (currMonster.weaknesses[i].condition != null) {
            monsterWeaks.push(currMonster.weaknesses[i].element.toUpperCase() + currMonster.weaknesses[i].stars + "!");
        }
        else {
            monsterWeaks.push(currMonster.weaknesses[i].element.toUpperCase() + currMonster.weaknesses[i].stars);
        }
    }

    // Place stars based on effectiveness and parentheses if there are conditions 
    // (eventually add tooltip for what the condition actually is)
    for (let i = 0; i < monsterWeaks.length; i++) {
        for (let j = 0; j < docMonsterEff.length; j++) {
            if (monsterWeaks[i] === docMonsterEff[j].toUpperCase() + "1" + "!") {
                document.querySelector(`.${docMonsterEff[j]}`).innerHTML += '(<span class="star">&starf;</span>)';
            }
            else if (monsterWeaks[i] === docMonsterEff[j].toUpperCase() + "2" + "!") {
                document.querySelector(`.${docMonsterEff[j]}`).innerHTML += '(<span class="star">&starf;&starf;</span>)';
            }
            else if (monsterWeaks[i] === docMonsterEff[j].toUpperCase() + "3" + "!") {
                document.querySelector(`.${docMonsterEff[j]}`).innerHTML += '(<span class="star">&starf;&starf;&starf;</span>)';
            }
            else if (monsterWeaks[i] === docMonsterEff[j].toUpperCase() + "1") {
                document.querySelector(`.${docMonsterEff[j]}`).innerHTML += '<span class="star">&starf;</span>';
            }
            else if (monsterWeaks[i] === docMonsterEff[j].toUpperCase() + "2") {
                document.querySelector(`.${docMonsterEff[j]}`).innerHTML += '<span class="star">&starf;&starf;</span>';
            }
            else if (monsterWeaks[i] === docMonsterEff[j].toUpperCase() + "3") {
                document.querySelector(`.${docMonsterEff[j]}`).innerHTML += '<span class="star">&starf;&starf;&starf;</span>';
            }
        }
    }
}

// Event listener for the search bar.
let searchBar = document.querySelector('#search-bar input');
searchBar.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault;
        changePage('search-page');
    }
});

// !Eventually have autofill dropdown to show options, if possible.
function updateSearchInput() {
    searchInput = document.querySelector('#search-bar input').value;
}

// Searches API for exact name or beginning letters.
async function getSearch() {
    let searchElem = document.querySelector('#search-page');
    let response = await fetch('https://mhw-db.com/monsters');
    let monsterList = await response.json();
    let foundMonster = false;
    let halfSearch = false;

    searchElem.innerHTML = '';

    for (let i = 0; i < monsterList.length; i++) {
        for (let j = 0; j < searchInput.length; j++) {
            if (searchInput.toLowerCase().split('')[j] === monsterList[i].name.toLowerCase().split('')[j]) {
                halfSearch = true;
            }
            else {
                halfSearch = false;
                break;
            }
        }
        if (halfSearch) {
            let monstLoc = '';
            let monstRes = '';
            let monstWk = [];
            foundMonster = true;

            // Show monster location preview
            if (monsterList[i].locations.length > 0) {
                monstLoc = monsterList[i].locations[0].name.toUpperCase();
            }
            else {
                monstLoc = 'NONE';
            }

            // Show monster resistance preview
            if (monsterList[i].resistances.length > 0) {
                monstRes = monsterList[i].resistances[0].element.toUpperCase();
            }
            else
                monstRes = 'NONE';

            // Populate monster weaknesses array with 3 stars
            for (let j = 0; j < monsterList[i].weaknesses.length; j++) {
                if (monsterList[i].weaknesses[j].stars === 3) {
                    if (monstWk.length >= 2) {
                        monstWk.push('...');
                        break;
                    }
                    else {
                        monstWk.push(monsterList[i].weaknesses[j].element.toUpperCase());
                    }
                }
            }
            if (monstWk.length <= 0) {
                monstWk.push('NONE');
            }

            searchElem.innerHTML += `
                <div class="monster-tile flex align-center" onclick='viewMonster("${monsterList[i].name}")'>
                    <div class='col-bio'>
                        <img src="assets/icons/${monsterList[i].name.toLowerCase()}.png" alt="Monster Icon">
                        <p class='monster-name'>${monsterList[i].name.toUpperCase()}</p>
                        <P class='monster-loc'>${monstLoc}</p>
                    </div>
                    <div class='col-info'>
                        <p class="monster-res flex">${monstRes}</p>
                        <p>|</p>
                        <p class="monster-wk flex">${monstWk.join(', ')}</p>
                    </div>
                </div>
                `
        }
    }

    if (!foundMonster) {
        searchElem.innerHTML = `
        <p>Search returned no results.</p>
        `
    }
}

// Filter current list.
async function filterList(elem, size) {
    let currFilter = elem.value;
    let type = '';
    let filteredElem = document.querySelector(`#${size}-monster-list`);
    let response = {};
    
    if (size === 'small') {
        response = await fetch('https://mhw-db.com/monsters?q={"type":"small"}');
        renderedSmall = false;
    }
    else if (size === 'large') {
        response = await fetch('https://mhw-db.com/monsters?q={"type":"large"}');
        renderedLarge = false;
    }
    else {
        response = await fetch('https://mhw-db.com/monsters?q={"species":"elder dragon"}');
        renderedElder = false;
    }
    let monsterList = await response.json();

    // Remove elder dragons from the large response list.
    if(size === 'large') {
        monsterList = monsterList.filter((monst) => monst.species != 'elder dragon');
    }
    
    // Establish type of filter to look for.
    if (currFilter === 'FIRE' || currFilter === 'WATER' || currFilter === 'THUNDER' || currFilter === 'ICE' || currFilter === 'DRAGON' || currFilter === 'POISON' || currFilter === 'PARALYSIS' || currFilter === 'SLEEP' || currFilter === 'BLAST' || currFilter === 'STUN') {
        type = 'element';
    }
    else if (currFilter === 'ANCIENT FOREST' || currFilter === 'WILDSPIRE WASTE' || currFilter === 'CORAL HIGHLANDS' || currFilter === 'ROTTEN VALE' || currFilter === "ELDER'S RECESS" || currFilter === 'HOARFROST REACH' || currFilter === 'CAVERNS OF EL DORADO' || currFilter === 'CONFLUENCE OF FATES' || currFilter === 'GREAT RAVINE' || currFilter === 'SECLUDED VALLEY') {
        type = 'location';
    }
    else if (currFilter === 'ALPHA') {
        type = 'alpha';
    }
    else if (currFilter === 'ZALPHA') {
        type = 'zalpha';
    }
    
    // Clear the current list.
    filteredElem.innerHTML = '';

    if (type === 'element') {
        for (let i = 0; i < monsterList.length; i++) {
            for (let j = 0; j < monsterList[i].weaknesses.length; j++) {
                if (currFilter === monsterList[i].weaknesses[j].element.toUpperCase()) {
                    if (monsterList[i].weaknesses[j].stars === 3) {
                        let monstLoc = '';
                        let monstRes = '';
                        let monstWk = [];

                        // Show monster location preview
                        if (monsterList[i].locations.length > 0) {
                            monstLoc = monsterList[i].locations[0].name.toUpperCase();
                        }
                        else {
                            monstLoc = 'NONE';
                        }

                        // Show monster resistance preview
                        if (monsterList[i].resistances.length > 0) {
                            monstRes = monsterList[i].resistances[0].element.toUpperCase();
                        }
                        else
                            monstRes = 'NONE';

                        // Populate monster weaknesses array with 3 stars
                        for (let j = 0; j < monsterList[i].weaknesses.length; j++) {
                            if (monsterList[i].weaknesses[j].stars === 3) {
                                if (monstWk.length >= 2) {
                                    monstWk.push('...');
                                    break;
                                }
                                else {
                                    monstWk.push(monsterList[i].weaknesses[j].element.toUpperCase());
                                }
                            }
                        }
                        if (monstWk.length <= 0) {
                            monstWk.push('NONE');
                        }

                        filteredElem.innerHTML += `
                            <div class="monster-tile flex align-center" onclick='viewMonster("${monsterList[i].name}")'>
                                <div class='col-bio'>
                                    <img src="assets/icons/${monsterList[i].name.toLowerCase()}.png" alt="Monster Icon">
                                    <p class='monster-name'>${monsterList[i].name.toUpperCase()}</p>
                                    <P class='monster-loc'>${monstLoc}</p>
                                </div>
                                <div class='col-info'>
                                    <p class="monster-res flex">${monstRes}</p>
                                    <p>|</p>
                                    <p class="monster-wk flex">${monstWk.join(', ')}</p>
                                </div>
                            </div>
                        `
                    }
                }
            }
        }
    }
    else if (type === 'location') {
        for (let i = 0; i < monsterList.length; i++) {
            for (let j = 0; j < monsterList[i].locations.length; j++) {
                if (currFilter === monsterList[i].locations[j].name.toUpperCase()) {
                    let monstLoc = '';
                    let monstRes = '';
                    let monstWk = [];

                    // Show monster location preview
                    if (monsterList[i].locations.length > 0) {
                        monstLoc = monsterList[i].locations[0].name.toUpperCase();
                    }
                    else {
                        monstLoc = 'NONE';
                    }

                    // Show monster resistance preview
                    if (monsterList[i].resistances.length > 0) {
                        monstRes = monsterList[i].resistances[0].element.toUpperCase();
                    }
                    else
                        monstRes = 'NONE';

                    // Populate monster weaknesses array with 3 stars
                    for (let j = 0; j < monsterList[i].weaknesses.length; j++) {
                        if (monsterList[i].weaknesses[j].stars === 3) {
                            if (monstWk.length >= 2) {
                                monstWk.push('...');
                                break;
                            }
                            else {
                                monstWk.push(monsterList[i].weaknesses[j].element.toUpperCase());
                            }
                        }
                    }
                    if (monstWk.length <= 0) {
                        monstWk.push('NONE');
                    }
                    filteredElem.innerHTML += `
                        <div class="monster-tile flex align-center" onclick='viewMonster("${monsterList[i].name}")'>
                            <div class='col-bio'>
                                <img src="assets/icons/${monsterList[i].name.toLowerCase()}.png" alt="Monster Icon">
                                <p class='monster-name'>${monsterList[i].name.toUpperCase()}</p>
                                <P class='monster-loc'>${monstLoc}</p>
                            </div>
                            <div class='col-info'>
                                <p class="monster-res flex">${monstRes}</p>
                                <p>|</p>
                                <p class="monster-wk flex">${monstWk.join(', ')}</p>
                            </div>
                        </div>
                    `
                }
            }
        }
    }
    else if (type === 'alpha') {
        let tempArr = [];
        
        for (let i = 0; i < monsterList.length; i++) {
            tempArr.push(monsterList[i].name);
        }
        tempArr.sort();

        for (let i = 0; i < tempArr.length; i++) {
            let monstLoc = '';
            let monstRes = '';
            let monstWk = [];

            // Show monster location preview
            if (monsterList[i].locations.length > 0) {
                monstLoc = monsterList[i].locations[0].name.toUpperCase();
            }
            else {
                monstLoc = 'NONE';
            }

            // Show monster resistance preview
            if (monsterList[i].resistances.length > 0) {
                monstRes = monsterList[i].resistances[0].element.toUpperCase();
            }
            else
                monstRes = 'NONE';

            // Populate monster weaknesses array with 3 stars
            for (let j = 0; j < monsterList[i].weaknesses.length; j++) {
                if (monsterList[i].weaknesses[j].stars === 3) {
                    if (monstWk.length >= 2) {
                        monstWk.push('...');
                        break;
                    }
                    else {
                        monstWk.push(monsterList[i].weaknesses[j].element.toUpperCase());
                    }
                }
            }
            if (monstWk.length <= 0) {
                monstWk.push('NONE');
            }

            filteredElem.innerHTML += `
            <div class="monster-tile flex align-center" onclick='viewMonster("${tempArr[i]}")'>
                <div class='col-bio'>
                    <img src="assets/icons/${tempArr[i].toLowerCase()}.png" alt="Monster Icon">
                    <p class='monster-name'>${tempArr[i].toUpperCase()}</p>
                    <P class='monster-loc'>${monstLoc}</p>
                </div>
                <div class='col-info'>
                    <p class="monster-res flex">${monstRes}</p>
                    <p>|</p>
                    <p class="monster-wk flex">${monstWk.join(', ')}</p>
                </div>
            </div>
            `
        }
    }
    else if (type === 'zalpha') {
        let tempArr = [];
        console.log('i am here')
        
        for (let i = 0; i < monsterList.length; i++) {
            tempArr.push(monsterList[i].name);
        }
        tempArr.sort();
        tempArr.reverse();
        console.log(tempArr)

        for (let i = 0; i < tempArr.length; i++) {
            let monstLoc = '';
            let monstRes = '';
            let monstWk = [];

            // Show monster location preview
            if (monsterList[i].locations.length > 0) {
                monstLoc = monsterList[i].locations[0].name.toUpperCase();
            }
            else {
                monstLoc = 'NONE';
            }

            // Show monster resistance preview
            if (monsterList[i].resistances.length > 0) {
                monstRes = monsterList[i].resistances[0].element.toUpperCase();
            }
            else
                monstRes = 'NONE';

            // Populate monster weaknesses array with 3 stars
            for (let j = 0; j < monsterList[i].weaknesses.length; j++) {
                if (monsterList[i].weaknesses[j].stars === 3) {
                    if (monstWk.length >= 2) {
                        monstWk.push('...');
                        break;
                    }
                    else {
                        monstWk.push(monsterList[i].weaknesses[j].element.toUpperCase());
                    }
                }
            }
            if (monstWk.length <= 0) {
                monstWk.push('NONE');
            }

            filteredElem.innerHTML += `
            <div class="monster-tile flex align-center" onclick='viewMonster("${tempArr[i]}")'>
                <div class='col-bio'>
                    <img src="assets/icons/${tempArr[i].toLowerCase()}.png" alt="Monster Icon">
                    <p class='monster-name'>${tempArr[i].toUpperCase()}</p>
                    <P class='monster-loc'>${monstLoc}</p>
                </div>
                <div class='col-info'>
                    <p class="monster-res flex">${monstRes}</p>
                    <p>|</p>
                    <p class="monster-wk flex">${monstWk.join(', ')}</p>
                </div>
            </div>
            `
        }
    }

    // Reset the page if filter is none.
    if (currFilter === 'NONE') {
        getMonsters(size);
    }
}