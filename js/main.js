import {elements, mountains, Seasons, TileTypes} from "./data.js";

const shuffledElements = shuffleArray(elements);

const sizeX = 11;
const sizeY = 11;

class Position {
    constructor(y, x) {
        this.x = x;
        this.y = y;
    }
}

class Tile {
    content;
    type;
    isHoverable = true;
    isInPreview = true;
    isLocked = false;

    constructor(position, map) {
        let div = document.createElement("div");
        let tileBg = document.createElement("div");
        tileBg.classList.add("tile-bg");
        div.append(tileBg)
        div.classList.add("tile")
        this.content = div

        this.onHovered = this.onHovered.bind(this);
        this.onUnhovered = this.onUnhovered.bind(this);

        this.content.addEventListener("mouseover", this.onHovered);
        this.content.addEventListener("mouseout", this.onUnhovered);
        this.changeContent(TileTypes.Plain);

        this.position = position;
        this.map = map;
    }

    changeContent(newType) {
        if (!this.content.classList.contains("tile")) {
            this.content.classList.add("tile");
        }

        if (this.type !== undefined && this.content.classList.contains(this.type.description)) {
            this.content.classList.remove(this.type.description);
        }

        this.type = newType;
        this.content.classList.add(newType.description);
    }

    onHovered(event) {
        if (this.map === undefined) {
            return;
        }

        this.map.onTileHovered(this);
    }

    onUnhovered(event) {
        if (this.map === undefined) {
            return;
        }

        this.map.onTileUnhovered(this);
    }

    previewOn(type) {
        this.content.classList.add("preview");
        this.content.classList.add(type.description);
    }

    previewOff(type) {
        this.content.classList.remove("preview");
        this.content.classList.remove(type.description);
    }
}

class Map {
    currentType = TileTypes.Plain;
    hoveredTile;

    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;

        this.tiles = [];
        this.content = document.getElementById("map");

        for (let i = 0; i < rows; i++) {
            let row = []
            for (let j = 0; j < columns; j++) {
                const tile = new Tile(new Position(i, j), this);
                this.content.appendChild(tile.content);
                row.push(tile);
            }
            if (row.length > 0) {
                this.tiles.push(row);
            }
        }

        for (let mountain of mountains) {
            this.tiles[mountain[0]][mountain[1]].changeContent(TileTypes.Mountain);
            this.tiles[mountain[0]][mountain[1]].isHoverable = false;
            this.tiles[mountain[0]][mountain[1]].isInPreview = false;
            this.tiles[mountain[0]][mountain[1]].isLocked = true;
        }
    }

    previewStructure(structure, position) {
        const shape = structure.shape;
        const numRows = shape.length;
        const numCols = shape[0].length;

        const offsetRow = Math.floor((numRows - 1) / 2);
        const offsetCol = Math.floor((numCols - 1) / 2);
        console.log("Position: ", position);
        console.log("Offsets: ", offsetRow, offsetCol);

        this.currentType = Symbol(structure.type);

        this.clearPreviews();

        for (let i = position.y - offsetRow; i < (position.y - offsetRow) + numRows; i++) {
            console.log("Row: ", i);
            for (let j = position.x - offsetCol; j < (position.x - offsetCol) + numCols; j++) {
                console.log("Col: ", j);
                const tile = this.tiles[i][j];
                tile.isInPreview = true;

                if (shape[i + offsetRow - position.y][j + offsetCol - position.x] === 1) {
                    tile.previewOn(this.currentType);
                }
            }
        }
    }

    clearPreviews() {
        for (let row of this.tiles) {
            for (let tile of row) {
                if (tile.isInPreview) {
                    tile.previewOff(this.currentType);
                }
                if(!tile.isLocked) {
                    tile.changeContent(TileTypes.Plain);
                }
            }
        }
    }

    onTileHovered(tile) {
        console.log(tile + " hovered")
        if (tile === undefined) {
            return;
        }

        if (tile.isInPreview) {
            tile.content.classList.remove(tile.type.description);
            tile.content.classList.add(this.currentType.description);
            tile.content.classList.add("preview");
        }

        this.hoveredTile = tile;
        tile.content.classList.add("hovered");
        this.previewStructure(elements[0], tile.position)
    }

    onTileUnhovered(tile) {
        if (tile === undefined) {
            return;
        }

        if (tile.isInPreview) {
            tile.content.classList.remove(this.currentType.description);
            tile.content.classList.add(tile.type.description);
            tile.content.classList.remove("preview");
        }

        this.clearPreviews();

        tile.content.classList.remove("hovered");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const map = new Map(sizeX, sizeY);
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}