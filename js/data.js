import {
    validateAlmosVolgy,
    validateErdoSzele,
    validateFasor,
    validateGazdagVaros, validateGazdagVidek,
    validateHatarvidek, validateKorbekeritettHegy,
    validateKrumpliontozes,
    validateMagusokVolgye,
    validateOntozocsatorna,
    validateParatlanSilok,
    validateSorhaz,
    validateUresTelek
} from "./validators.js";

import structures from './structures.json' assert { type: 'json' };
import {shuffledElements, updateElement} from "./main.js";

export let stripEnabled = localStorage.stripEnabled === "true" || false;

export const TileTypes = {
    Village: "village",
    Forest: "forest",
    Farm: "farm",
    Mountain: "mountain",
    Water: "water",
    Plain: "plain"
}

export const sum = document.createElement("h4");
export const hiddenSum = document.createElement("h4");
export const requiredTime = document.createElement("h4");


export function setup() {
    let details = document.getElementById("details");
    let seasonWrapper = document.createElement("div");
    seasonWrapper.id = "seasons-wrapper";
    let seasons = document.createElement("div");
    seasons.id = "seasons";
    seasons.classList.add("holder");
    seasonWrapper.append(seasons);
    seasonWrapper.append(sum);
    seasonWrapper.append(hiddenSum);
    details.append(seasonWrapper);
    sum.id = "sum";
    sum.innerHTML = "Összesen:";
    hiddenSum.id = "hidden-sum";
    hiddenSum.innerHTML = "Rejtett küldetések:";
    let currentSeason = document.createElement("h4");
    currentSeason.id = "current-season";
    currentSeason.innerHTML = "Jelenlegi évszak:";
    details.append(currentSeason);
    details.append(document.createElement("hr"));
    let quests = document.createElement("div");
    quests.id = "quests";
    details.append(quests);
    let timer = document.createElement("h4");
    timer.id = "timer";
    timer.innerHTML = "Évszakból hátralévő idő:";
    details.append(timer);
    details.append(document.createElement("hr"));
    let tilePicker = document.createElement("div");
    tilePicker.id = "tile-picker";
    requiredTime.id = "required-time";
    requiredTime.innerHTML = "⏱️";
    tilePicker.append(requiredTime);
    let previewMap = document.createElement("div");
    previewMap.id = "preview-map";
    previewMap.classList.add("map");

    let previewMapParent = document.createElement("div");
    previewMapParent.id = "preview-map-parent";
    previewMapParent.append(previewMap);
    tilePicker.append(previewMap);
    let rotate = document.createElement("button");
    rotate.id = "rotate";
    rotate.innerHTML = "Forgatás";
    tilePicker.append(rotate);
    let mirror = document.createElement("button");
    mirror.id = "mirror";
    mirror.innerHTML = "Tükrözés";
    tilePicker.append(mirror);
    details.append(tilePicker);
    let stripToggle = document.createElement("button");
    stripToggle.id = "strip-toggle";
    stripToggle.innerHTML = stripEnabled ? "Üres mezők kikapcsolása" : "Üres mezők bekapcsolása";
    stripToggle.addEventListener("click", (e) => {
        if(shuffledElements.length === 0) {
            return;
        }

        e.target.innerText = stripEnabled ? "Üres mezők kikapcsolása" : "Üres mezők bekapcsolása";
        stripEnabled = !stripEnabled;
        localStorage.stripEnabled = stripEnabled;
        updateElement();
    })
    stripToggle.title = "EXPERIMENTAL: Ha ki van kapcsolva, akkor a kiválasztott elemnél le lesz vágva a teljesen üres sor és/vagy oszlop."
    tilePicker.append(stripToggle);
}

setup();

export class Season {
    points = 0;

    constructor(id, name) {
        this.id = id;
        this.name = name;

        let container = document.getElementById("seasons");
        this.content = document.createElement("div");
        this.content.id = this.id;
        this.content.classList.add("point-tile");
        this.content.innerHTML = `${this.name}<br>${this.points} pont`;

        container.append(this.content);
    }

    setPoints(points) {
        this.points = points;
        this.content.innerHTML = `${this.name}<br>${this.points} pont`;
    }
}

export const seasons = [
    new Season("spring", "Tavasz"),
    new Season("summer", "Nyár"),
    new Season("autumn", "Ősz"),
    new Season("winter", "Tél")
]

export const mountainsCoordinates = [
    [2, 2],
    [4, 9],
    [6, 4],
    [9, 10],
    [10, 6]
]

export const rawQuests = {
    "basic": [
        {
            "id": "erdo-szele",
            "title": "Az erdő széle",
            "description": "A térképed szélével szomszédos erdőmezőidért egy-egy pontot kapsz.",
            "validator": validateErdoSzele
        },
        {
            "id": "almos-volgy",
            "title": "Álmos-völgy",
            "description": "Minden olyan sorért, amelyben három erdőmező van, négy-négy pontot kapsz.",
            "validator": validateAlmosVolgy,
        },
        {
            "id": "krumpliontozes",
            "title": "Krumpliöntözés",
            "description": "A farmmezőiddel szomszédos vízmezőidért két-két pontot kapsz.",
            "validator": validateKrumpliontozes,
        },
        {
            "id": "hatarvidek",
            "title": "Határvidék",
            "description": "Minden teli sorért vagy oszlopért 6-6 pontot kapsz.",
            "validator": validateHatarvidek,
        }
    ],
    "extra": [
        {
            "id": "fasor",
            "title": "Fasor",
            "description": "A leghosszabb, függőlegesen megszakítás nélkül egybefüggő erdőmezők mindegyikéért kettő-kettő pontot kapsz. Két azonos hosszúságú esetén csak az egyikért.",
            "validator": validateFasor,
        },
        {
            "id": "gazdag-varos",
            "title": "Gazdag város",
            "description": "A legalább három különböző tereptípussal szomszédos falurégióidért három-három pontot kapsz.",
            "validator": validateGazdagVaros
        },
        {
            "id": "ontozocsatorna",
            "title": "Öntözőcsatorna",
            "description": "Minden olyan oszlopodért, amelyben a farm illetve a vízmezők száma megegyezik, négy-négy pontot kapsz. Mindkét tereptípusból legalább egy-egy mezőnek lennie kell az oszlopban ahhoz, hogy pontot kaphass érte.",
            "validator": validateOntozocsatorna,
        },
        {
            "id": "magusok-volgye",
            "title": "Mágusok völgye",
            "description": "A hegymezőiddel szomszédos vízmezőidért három-három pontot kapsz.",
            "validator": validateMagusokVolgye,
        },
        {
            "id": "ures-telek",
            "title": "Üres telek",
            "description": "A városmezőiddel szomszédos üres mezőkért 2-2 pontot kapsz.",
            "validator": validateUresTelek
        },
        {
            "id": "sorhaz",
            "title": "Sorház",
            "description": "A leghosszabb, vízszintesen megszakítás nélkül egybefüggő falumezők mindegyikéért kettő-kettő pontot kapsz.",
            "validator": validateSorhaz,
        },
        {
            "id": "paratlan-silok",
            "title": "Páratlan silók",
            "description": "Minden páratlan sorszámú teli oszlopodért 10-10 pontot kapsz.",
            "validator": validateParatlanSilok,
        },
        {
            "id": "gazdag-videk",
            "title": "Gazdag vidék",
            "description": "Minden legalább öt különböző tereptípust tartalmazó sorért négy-négy pontot kapsz.",
            "validator": validateGazdagVidek
        }
    ],
    "hidden": [
        {
            "id": "korbekeritett-hegy",
            "title": "Körbekerített hegy mező",
            "description": "Ha a hegyeket 4 oldalról körbevesszük más mezővel, körbevett hegyenként 1-1 pontot kapunk.",
            "validator": validateKorbekeritettHegy
        }
    ]
}

export const allQuests = rawQuests.basic.concat(rawQuests.extra);

class Element {
    constructor(element) {
        this.rotation = element.rotation;
        this.shape = element.shape;
        this.tileType = element.type;
        this.time = element.time;
        this.mirrored = element.mirrored;

        this.rows = this.shape.length;
        this.cols = this.shape[0].length;

        this.rowOffset = Math.floor((this.rows - 1) / 2);
        this.colOffset = Math.floor((this.cols - 1) / 2);
    }

    strippedStructure(shape) {
        let tempShape = [];
        shape.forEach(row => {
            if (!row.every(c => c === 0)) {
                tempShape.push(row);
            }
        });

        if (tempShape.every(row => row[0] === 0)) {
            tempShape.forEach(row => {
                row.shift();
            });
        }

        if (tempShape.every(row => row[row.length - 1] === 0)) {
            tempShape.forEach(row => {
                row.pop();
            });
        }

        return tempShape;
    }

    changeRotation() {
        this.rotation = (this.rotation + 1) % 4;
    }

    rotate(shape) {
        if (shape.length === 0 || shape[0].length === 0) {
            return [];
        }

        const rows = shape.length;
        const cols = shape[0].length;

        const rotatedMatrix = new Array(cols).fill(null).map(() => new Array(rows).fill(null));

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (this.rotation === 0) {
                    rotatedMatrix[i][j] = shape[i][j];
                } else if (this.rotation === 1) {
                    rotatedMatrix[j][rows - 1 - i] = shape[i][j];
                } else if (this.rotation === 2) {
                    rotatedMatrix[rows - 1 - i][cols - 1 - j] = shape[i][j];
                } else if (this.rotation === 3) {
                    rotatedMatrix[cols - 1 - j][i] = shape[i][j];
                }
            }
        }

        return rotatedMatrix;
    }

    mirror(shape) {
        if (shape.length === 0 || shape[0].length === 0) {
            return [];
        }

        const rows = shape.length;
        const cols = shape[0].length;

        const mirroredMatrix = new Array(rows).fill(null).map(() => new Array(cols).fill(null));

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols / 2; j++) {
                mirroredMatrix[i][j] = shape[i][cols - 1 - j];
                mirroredMatrix[i][cols - 1 - j] = shape[i][j];
            }
        }

        return mirroredMatrix;
    }

    getShape(strip = false) {
        let shape = this.shape;
        if (this.mirrored) {
            shape = this.mirror(shape);
        }
        shape = this.rotate(shape);
        let finalShape = strip ? this.strippedStructure(shape) : shape;

        this.rows = finalShape.length;
        this.cols = finalShape[0].length;

        this.rowOffset = Math.floor((this.rows - 1) / 2);
        this.colOffset = Math.floor((this.cols - 1) / 2);

        return finalShape;
    }

    serializeJSON() {
        return {
            rotation: this.rotation,
            shape: this.shape,
            type: this.tileType,
            time: this.time,
            mirrored: this.mirrored
        }
    }
}

export const rawElements = structures;

export const elements = rawElements.map(e => new Element(e));


