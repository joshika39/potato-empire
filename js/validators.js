import {mountainsCoordinates, TileTypes} from "./data.js";

export function validateErdoSzele(tiles, quest) {
    quest.points = 0;

    for (let i = 1; i < tiles.length - 1; i++) {
        let tile = tiles[i][0];
        if (tile.type === TileTypes.Forest) {
            quest.points++;
        }

        tile = tiles[i][tiles[i].length - 1];
        if (tile.type === TileTypes.Forest) {
            quest.points++;
        }
    }

    for (let i = 0; i < tiles[0].length; i++) {
        let tile = tiles[0][i];
        if (tile.type === TileTypes.Forest) {
            quest.points++;
        }

        tile = tiles[tiles.length - 1][i];
        if (tile.type === TileTypes.Forest) {
            quest.points++;
        }
    }
}

export function validateAlmosVolgy(tiles, quest) {
    quest.points = 0;

    for (let i = 0; i < tiles.length; i++) {
        let forestCount = 0;
        for (let j = 0; j < tiles[i].length; j++) {
            if (tiles[i][j].type === TileTypes.Forest) {
                forestCount++;
            }
        }
        if (forestCount === 3) {
            quest.points += 4;
        }
    }
}

export function validateKrumpliontozes(tiles, quest) {
    quest.points = 0;

    for (let i = 0; i < tiles.length; i++) {
        for (let j = 0; j < tiles[i].length; j++) {
            if (tiles[i][j].type === TileTypes.Farm) {
                if (i > 0 && tiles[i - 1][j].type === TileTypes.Water) {
                    quest.points += 2;
                }
                if (i < tiles.length - 1 && tiles[i + 1][j].type === TileTypes.Water) {
                    quest.points += 2;
                }
                if (j > 0 && tiles[i][j - 1].type === TileTypes.Water) {
                    quest.points += 2;
                }
                if (j < tiles[i].length - 1 && tiles[i][j + 1].type === TileTypes.Water) {
                    quest.points += 2;
                }
            }
        }
    }
}

export function validateHatarvidek(tiles, quest) {
    quest.points = 0;

    for (let i = 0; i < tiles.length; i++) {
        let rowFull = true;
        let colFull = true;
        for (let j = 0; j < tiles[i].length; j++) {
            if (tiles[i][j].type === TileTypes.Plain) {
                rowFull = false;
            }
            if (tiles[j][i].type === TileTypes.Plain) {
                colFull = false;
            }
        }
        if (rowFull) {
            quest.points += 6;
        }
        if (colFull) {
            quest.points += 6;
        }
    }
}

export function validateFasor(tiles, quest) {
    quest.points = 0;

    let forestCount = 0;
    let maxForestCount = 0;

    for (let i = 0; i < tiles.length; i++) {
        forestCount = 0;
        for (let j = 0; j < tiles[i].length; j++) {
            if (tiles[i][j].type === TileTypes.Forest) {
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
            if (tiles[j][i].type === TileTypes.Forest) {
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
        quest.points += 2 * maxForestCount;
    }
}

export function validateGazdagVaros(tiles, quest) {
    quest.points = 0;

    let tileTypes = new Set();

    for (let i = 0; i < tiles.length; i++) {
        tileTypes.clear();
        for (let j = 0; j < tiles[i].length; j++) {
            if (tiles[i][j].type !== TileTypes.Plain) {
                tileTypes.add(tiles[i][j].type);
            }
        }
        if (tileTypes.size >= 3) {
            quest.points += 3;
        }
    }
}

export function validateOntozocsatorna(tiles, quest) {
    quest.points = 0;

    for (let i = 0; i < tiles.length; i++) {
        let farmCount = 0;
        let waterCount = 0;

        for (let j = 0; j < tiles[i].length; j++) {
            if (tiles[j][i].type === TileTypes.Farm) {
                farmCount++;
            }
            if (tiles[j][i].type === TileTypes.Water) {
                waterCount++;
            }
        }

        if (farmCount === waterCount && farmCount > 0) {
            quest.points += 4;
        }
    }
}

export function validateMagusokVolgye(tiles, quest) {
    quest.points = 0;

    for (let i = 0; i < tiles.length; i++) {
        for (let j = 0; j < tiles[i].length; j++) {
            if (tiles[i][j].type === TileTypes.Mountain) {
                if (i > 0 && tiles[i - 1][j].type === TileTypes.Water) {
                    quest.points += 3;
                }
                if (i < tiles.length - 1 && tiles[i + 1][j].type === TileTypes.Water) {
                    quest.points += 3;
                }
                if (j > 0 && tiles[i][j - 1].type === TileTypes.Water) {
                    quest.points += 3;
                }
                if (j < tiles[i].length - 1 && tiles[i][j + 1].type === TileTypes.Water) {
                    quest.points += 3;
                }
            }
        }
    }
}

export function validateUresTelek(tiles, quest) {
    quest.points = 0;

    for (let i = 0; i < tiles.length; i++) {
        for (let j = 0; j < tiles[i].length; j++) {
            if (tiles[i][j].type === TileTypes.Village) {
                if (i > 0 && tiles[i - 1][j].type === TileTypes.Plain) {
                    quest.points += 2;
                }
                if (i < tiles.length - 1 && tiles[i + 1][j].type === TileTypes.Plain) {
                    quest.points += 2;
                }
                if (j > 0 && tiles[i][j - 1].type === TileTypes.Plain) {
                    quest.points += 2;
                }
                if (j < tiles[i].length - 1 && tiles[i][j + 1].type === TileTypes.Plain) {
                    quest.points += 2;
                }
            }
        }
    }
}

export function validateSorhaz(tiles, quest) {
    quest.points = 0;

    let villageCount = 0;
    let maxVillageCount = 0;

    for (let i = 0; i < tiles.length; i++) {
        villageCount = 0;
        for (let j = 0; j < tiles[i].length; j++) {
            if (tiles[i][j].type === TileTypes.Village) {
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
        quest.points += 2 * maxVillageCount;
    }
}

export function validateParatlanSilok(tiles, quest) {
    quest.points = 0;

    for (let i = 0; i < tiles.length; i++) {
        if (i % 2 === 0) {
            continue;
        }

        let full = true;
        for (let j = 0; j < tiles[i].length; j++) {
            if (tiles[i][j].type === TileTypes.Plain) {
                full = false;
                break;
            }
        }
        if (full) {
            quest.points += 10;
        }
    }
}

export function validateGazdagVidek(tiles, quest) {
    quest.points = 0;

    let tileTypes = new Set();

    for (let i = 0; i < tiles.length; i++) {
        tileTypes.clear();
        for (let j = 0; j < tiles[i].length; j++) {
            if (tiles[i][j].type !== TileTypes.Plain) {
                tileTypes.add(tiles[i][j].type);
            }
        }
        if (tileTypes.size >= 5) {
            quest.points += 4;
        }
    }
}

export function validateKorbekeritettHegy(tiles, quest) {
    quest.points = 0;

    let mountainCount = 0;

    for (let i = 0; i < mountainsCoordinates.length; i++) {
        let mountain = mountainsCoordinates[i];
        let surrounded = true;

        if (mountain[0] - 1 >= 0 && tiles[mountain[0] - 1][mountain[1]].type === TileTypes.Plain) {
            surrounded = false;
        }
        if (mountain[0] + 1 < tiles.length && tiles[mountain[0] + 1][mountain[1]].type === TileTypes.Plain) {
            surrounded = false;
        }
        if (mountain[1] - 1 >= 0 && tiles[mountain[0]][mountain[1] - 1].type === TileTypes.Plain) {
            surrounded = false;
        }
        if (mountain[1] + 1 < tiles[0].length && tiles[mountain[0]][mountain[1] + 1].type === TileTypes.Plain) {
            surrounded = false;
        }

        if (surrounded) {
            quest.points++;
        }
    }
}

export function validateEasternGate(tiles, quest) {
    quest.points = 0;
    let villages = 0;
    let farms = 0;
    for(let i = 0; i < tiles.length; i++) {
        if(tiles[i][tiles[i].length - 1].type === TileTypes.Village) {
            villages++;
        }
        if(tiles[i][tiles[i].length - 1].type === TileTypes.Farm) {
            farms++;
        }
    }

    if(villages === 1 && farms === 6) {
        quest.points += 10;
        quest.isCompleted = true;
    }
}