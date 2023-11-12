// export const TileTypes = {
//     Village: Symbol("village"),
//     Forest: Symbol("forest"),
//     Farm: Symbol("farm"),
//     Mountain: Symbol("mountain"),
//     Water: Symbol("water"),
//     Plain: Symbol("plain"),
// }

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

export const mountains = [
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
            "validator": validateErdoSzele,
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
}

function validateErdoSzele(tiles) {
    let points = 0;

    for (let i = 1; i < tiles.length; i++) {
        let tile = tiles[i][0];
        if (tile.type.description === "forest") {
            points++;
        }

        tile = tiles[i][tiles[i].length - 1];
        if (tile.type.description === "forest") {
            points++;
        }
    }

    for (let i = 0; i < tiles[0].length; i++) {
        let tile = tiles[0][i];
        if (tile.type.description === "forest") {
            points++;
        }

        tile = tiles[tiles.length - 1][i];
        if (tile.type.description === "forest") {
            points++;
        }
    }

    return points;
}

function validateAlmosVolgy(tiles) {
    let points = 0;

    for (let i = 0; i < tiles.length; i++) {
        let forestCount = 0;
        for (let j = 0; j < tiles[i].length; j++) {
            if (tiles[i][j].type === "forest") {
                forestCount++;
            }
        }
        if (forestCount >= 3) {
            points += 4;
        }
    }

    return points;
}

function validateKrumpliontozes(tiles) {
    let points = 0;

    for (let i = 0; i < tiles.length; i++) {
        for (let j = 0; j < tiles[i].length; j++) {
            if (tiles[i][j].type === "farm") {
                if (i > 0 && tiles[i - 1][j].type === "water") {
                    points += 2;
                }
                if (i < tiles.length - 1 && tiles[i + 1][j].type === "water") {
                    points += 2;
                }
                if (j > 0 && tiles[i][j - 1].type === "water") {
                    points += 2;
                }
                if (j < tiles[i].length - 1 && tiles[i][j + 1].type === "water") {
                    points += 2;
                }
            }
        }
    }

    return points;
}

function validateHatarvidek(tiles) {
    let points = 0;

    for (let i = 0; i < tiles.length; i++) {
        let rowFull = true;
        let colFull = true;
        for (let j = 0; j < tiles[i].length; j++) {
            if (tiles[i][j].type === "plain") {
                rowFull = false;
            }
            if (tiles[j][i].type === "plain") {
                colFull = false;
            }
        }
        if (rowFull) {
            points += 6;
        }
        if (colFull) {
            points += 6;
        }
    }

    return points;
}

function validateFasor(tiles) {
    let points = 0;

    let forestCount = 0;
    let maxForestCount = 0;

    for (let i = 0; i < tiles.length; i++) {
        forestCount = 0;
        for (let j = 0; j < tiles[i].length; j++) {
            if (tiles[i][j].type === "forest") {
                forestCount++;
            } else {
                if (forestCount > maxForestCount) {
                    maxForestCount = forestCount;
                }
                forestCount = 0;
            }
        }
        if (forestCount > maxForestCount) {
            maxForestCount = forestCount;
        }
    }

    for (let i = 0; i < tiles[0].length; i++) {
        forestCount = 0;
        for (let j = 0; j < tiles.length; j++) {
            if (tiles[j][i].type === "forest") {
                forestCount++;
            } else {
                if (forestCount > maxForestCount) {
                    maxForestCount = forestCount;
                }
                forestCount = 0;
            }
        }
        if (forestCount > maxForestCount) {
            maxForestCount = forestCount;
        }
    }

    if (maxForestCount > 0) {
        points += 2 * maxForestCount;
    }

    return points;
}

function validateGazdagVaros(tiles) {
    let points = 0;

    let tileTypes = new Set();

    for (let i = 0; i < tiles.length; i++) {
        tileTypes.clear();
        for (let j = 0; j < tiles[i].length; j++) {
            if(tiles[i][j].type !== "plain")
            {
                tileTypes.add(tiles[i][j].type);
            }
        }
        if (tileTypes.size >= 3) {
            points += 3;
        }
    }

    return points;
}

function validateOntozocsatorna(tiles) {
    let points = 0;

    for (let i = 0; i < tiles.length; i++) {
        let farmCount = 0;
        let waterCount = 0;
        for (let j = 0; j < tiles[i].length; j++) {
            if (tiles[i][j].type === "farm") {
                farmCount++;
            }
            if (tiles[i][j].type === "water") {
                waterCount++;
            }
        }
        if (farmCount === waterCount && farmCount > 0) {
            points += 4;
        }
    }

    return points;
}

function validateMagusokVolgye(tiles) {
    let points = 0;

    for (let i = 0; i < tiles.length; i++) {
        for (let j = 0; j < tiles[i].length; j++) {
            if (tiles[i][j].type === "mountain") {
                if (i > 0 && tiles[i - 1][j].type === "water") {
                    points += 3;
                }
                if (i < tiles.length - 1 && tiles[i + 1][j].type === "water") {
                    points += 3;
                }
                if (j > 0 && tiles[i][j - 1].type === "water") {
                    points += 3;
                }
                if (j < tiles[i].length - 1 && tiles[i][j + 1].type === "water") {
                    points += 3;
                }
            }
        }
    }

    return points;
}

function validateUresTelek(tiles) {
    let points = 0;

    for (let i = 0; i < tiles.length; i++) {
        for (let j = 0; j < tiles[i].length; j++) {
            if (tiles[i][j].type === "village") {
                if (i > 0 && tiles[i - 1][j].type === "plain") {
                    points += 2;
                }
                if (i < tiles.length - 1 && tiles[i + 1][j].type === "plain") {
                    points += 2;
                }
                if (j > 0 && tiles[i][j - 1].type === "plain") {
                    points += 2;
                }
                if (j < tiles[i].length - 1 && tiles[i][j + 1].type === "plain") {
                    points += 2;
                }
            }
        }
    }

    return points;
}

function validateSorhaz(tiles) {
    let points = 0;

    let villageCount = 0;
    let maxVillageCount = 0;

    for (let i = 0; i < tiles.length; i++) {
        villageCount = 0;
        for (let j = 0; j < tiles[i].length; j++) {
            if (tiles[i][j].type === "village") {
                villageCount++;
            } else {
                if (villageCount > maxVillageCount) {
                    maxVillageCount = villageCount;
                }
                villageCount = 0;
            }
        }
        if (villageCount > maxVillageCount) {
            maxVillageCount = villageCount;
        }
    }

    if (maxVillageCount > 0) {
        points += 2 * maxVillageCount;
    }

    return points;
}

function validateParatlanSilok(tiles) {
    let points = 0;

    for (let i = 0; i < tiles.length; i++) {
        if (i % 2 === 0) {
            continue;
        }

        let full = true;
        for (let j = 0; j < tiles[i].length; j++) {
            if (tiles[i][j].type === "plain") {
                full = false;
                break;
            }
        }
        if (full) {
            points += 10;
        }
    }

    return points;
}

function validateGazdagVidek(tiles) {
    let points = 0;

    let tileTypes = new Set();

    for (let i = 0; i < tiles.length; i++) {
        tileTypes.clear();
        for (let j = 0; j < tiles[i].length; j++) {
            tileTypes.add(tiles[i][j].type);
        }
        if (tileTypes.size >= 5) {
            points += 4;
        }
    }

    return points;
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

    getShape() {
        let shape = this.shape;
        if (this.mirrored) {
            shape = this.mirror(shape);
        }
        shape = this.rotate(shape);
        let strippedShape = this.strippedStructure(shape);

        this.rows = strippedShape.length;
        this.cols = strippedShape[0].length;

        this.rowOffset = Math.floor((this.rows - 1) / 2);
        this.colOffset = Math.floor((this.cols - 1) / 2);

        return strippedShape;
    }
}

export const rawElements = [
    {
        time: 2,
        type: 'water',
        shape: [[1, 1, 1],
            [0, 0, 0],
            [0, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 'village',
        shape: [[1, 1, 1],
            [0, 0, 0],
            [0, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 1,
        type: 'forest',
        shape: [[1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 'farm',
        shape: [[1, 1, 1],
            [0, 0, 1],
            [0, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 'forest',
        shape: [[1, 1, 1],
            [0, 0, 1],
            [0, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 'village',
        shape: [[1, 1, 1],
            [0, 1, 0],
            [0, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 'farm',
        shape: [[1, 1, 1],
            [0, 1, 0],
            [0, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 1,
        type: 'village',
        shape: [[1, 1, 0],
            [1, 0, 0],
            [0, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 1,
        type: 'village',
        shape: [[1, 1, 1],
            [1, 1, 0],
            [0, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 1,
        type: 'farm',
        shape: [[1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 1,
        type: 'farm',
        shape: [[0, 1, 0],
            [1, 1, 1],
            [0, 1, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 'water',
        shape: [[1, 1, 1],
            [1, 0, 0],
            [1, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 'water',
        shape: [[1, 0, 0],
            [1, 1, 1],
            [1, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 'forest',
        shape: [[1, 1, 0],
            [0, 1, 1],
            [0, 0, 1]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 'forest',
        shape: [[1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 'water',
        shape: [[1, 1, 0],
            [1, 1, 0],
            [0, 0, 0]],
        rotation: 0,
        mirrored: false
    },
]

export const elements = rawElements.map(e => new Element(e));


