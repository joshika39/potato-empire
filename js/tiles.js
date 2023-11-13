import {mountainsCoordinates, seasons, TileTypes, sum, hiddenSum} from "./data.js";
import {
    currentSeason,
    getCurrentSeason, hiddenQuests,
    quests,
    removeElement,
    shuffledElements,
    updateSeason,
    updateTimer,
} from "./main.js";

class Position {
    constructor(y, x) {
        this.x = x;
        this.y = y;
    }
}

export class Tile {
    content;
    type;
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
        this.onClicked = this.onClicked.bind(this);

        this.content.addEventListener("mouseover", this.onHovered);
        this.content.addEventListener("mouseout", this.onUnhovered);
        this.content.addEventListener("click", this.onClicked);

        this.changeContent("plain");

        this.position = position;
        this.map = map;
    }

    changeContent(newType, lockTile = false) {
        if (this.type === newType || this.isLocked) {
            return;
        }

        if (!this.content.classList.contains("tile")) {
            this.content.classList.add("tile");
        }

        if (this.type !== undefined && this.content.classList.contains(this.type)) {
            this.content.classList.remove(this.type);
        }

        this.type = newType;
        this.content.classList.add(newType);
        if (this.type !== TileTypes.Plain) {
            this.isLocked = lockTile;
        }
    }

    onHovered(event) {
        if (this.map === undefined || this.map.constructor === PreviewMap) {
            return;
        }

        this.map.onTileHovered(this);
    }

    onUnhovered(event) {
        if (this.map === undefined || this.map.constructor === PreviewMap) {
            return;
        }

        this.map.onTileUnhovered(this);
    }

    putDown(type, lockTile = false) {
        this.changeContent(type, lockTile);
    }

    onClicked(event) {
        if (this.map === undefined || this.map.constructor === PreviewMap) {
            return;
        }

        this.map.onTileClicked(this);
    }

    previewOn(isCorrect = true) {
        let validity = isCorrect ? "correct" : "incorrect";
        this.content.classList.add(validity);
    }

    previewOff() {
        this.content.classList.remove("correct");
        this.content.classList.remove("incorrect");
        this.content.classList.remove("hovered");
    }
}

class Map {
    currentType = TileTypes.Plain;
    hoveredTile;
    time;
    seasonTime = 7

    constructor(id, rows, columns) {
        if (this.constructor === Map) {
            throw new Error("Abstract classes can't be instantiated.");
        }

        this.time = 28;

        this.rows = rows;
        this.columns = columns;

        this.tiles = [];
        this.content = document.getElementById(id);

        this.content.style.gridTemplateColumns = "repeat(" + this.columns + ", 1fr)";
        this.content.style.gridTemplateRows = "repeat(" + this.rows + ", 1fr)";

        for (let i = 0; i < this.rows; i++) {
            let row = []
            for (let j = 0; j < this.columns; j++) {
                const tile = new Tile(new Position(i, j), this);
                tile.changeContent("plain");
                this.content.appendChild(tile.content);
                row.push(tile);
            }
            if (row.length > 0) {
                this.tiles.push(row);
            }
        }
    }

    fixTileOffset(tile) {
        const element = shuffledElements[0];

        const numRows = element.rows;
        const numCols = element.cols;

        let offsetRow = element.rowOffset;
        let offsetCol = element.colOffset;

        if (tile.position.y - offsetRow < 0 && numRows > 2) {
            tile = this.tiles[1][tile.position.x];
        }

        if (tile.position.y + offsetRow > this.tiles.length - 1) {
            tile = this.tiles[this.tiles.length - 2][tile.position.x];
        }

        if (tile.position.x - offsetCol < 0 && numCols > 2) {
            tile = this.tiles[tile.position.y][1];
        }

        if (tile.position.x + offsetCol > this.tiles[0].length - 1) {
            tile = this.tiles[tile.position.y][this.tiles[0].length - 2];
        }

        return tile;
    }

    putDownStructure(position, isPreview = true, lockTile = false) {
        if (shuffledElements.length === 0) {
            return false;
        }

        let shape = shuffledElements[0].getShape();
        this.currentType = shuffledElements[0].tileType;
        let rowOffset = shuffledElements[0].rowOffset;
        let colOffset = shuffledElements[0].colOffset;
        let rows = shuffledElements[0].rows;
        let cols = shuffledElements[0].cols;

        let targets = []

        for (let i = position.y - rowOffset; i < (position.y - rowOffset) + rows; i++) {
            for (let j = position.x - colOffset; j < (position.x - colOffset) + cols; j++) {
                if (shape[i + rowOffset - position.y][j + colOffset - position.x] === 1) {
                    targets.push(this.tiles[i][j])
                }
            }
        }

        if (isPreview) {
            targets.forEach(tile => tile.previewOn(targets.every(t => t.type === "plain")))
            return false;
        }

        if (targets.every(t => t.type === "plain")) {
            targets.forEach(tile => tile.putDown(this.currentType, lockTile))
            return true;
        }

        return false;
    }

    updateActiveElement() {
        this.clearTiles();
        if (this.constructor === PreviewMap) {
            this.putDownStructure(new Position(1, 1), false);
        }
    }

    clearTiles() {
        for (let row of this.tiles) {
            for (let tile of row) {
                tile.changeContent("plain");
            }
        }
    }
}

export class PreviewMap extends Map {
    constructor(id, rows, columns) {
        super(id, rows, columns, false);
    }
}

export class InteractiveMap extends Map {
    constructor(id, rows, columns, previewMap) {
        super(id, rows, columns);
        this.previewMap = previewMap;

        for (let mountain of mountainsCoordinates) {
            this.tiles[mountain[0]][mountain[1]].changeContent(TileTypes.Mountain);
            this.tiles[mountain[0]][mountain[1]].isInPreview = false;
            this.tiles[mountain[0]][mountain[1]].isLocked = true;
        }

        this.previewMap.putDownStructure(new Position(1, 1), false);
    }

    onTileHovered(tile) {
        if(shuffledElements.length === 0){
            return;
        }

        this.hoveredTile = this.fixTileOffset(tile);

        if (this.hoveredTile === undefined) {
            return;
        }

        this.putDownStructure(this.hoveredTile.position, true, false);
    }

    onTileUnhovered(tile) {
        if (tile === undefined) {
            return;
        }

        this.clearPreviews();

        tile.content.classList.remove("hovered");
    }

    onTileClicked(tile) {
        tile = this.fixTileOffset(tile);

        if (tile === undefined || shuffledElements.length === 0) {
            return;
        }

        if (!this.putDownStructure(tile.position, false, true)) {
            return;
        }
        this.previewMap.clearTiles();
        this.clearPreviews();

        this.time -= shuffledElements[0].time;
        this.seasonTime -= shuffledElements[0].time;

        if (this.seasonTime <= 0) {
            this.seasonTime = 7 - Math.abs(this.seasonTime);
            getCurrentSeason(true);
            updateSeason();
        }

        updateTimer();
        removeElement();
        this.previewMap.putDownStructure(new Position(1, 1), false);

        quests.forEach(q => q.validateQuest(currentSeason));
        quests.filter(q => q.isActive).forEach(q => q.validatePoints(currentSeason, this.tiles));
        hiddenQuests.forEach(q => q.validatePoints(currentSeason, this.tiles));
        let sumPoints = quests.filter(q => q.isActive).map(q => q.points).reduce((a, b) => a + b, 0);
        sumPoints += hiddenQuests.map(q => q.points).reduce((a, b) => a + b, 0);
        getCurrentSeason().setPoints(sumPoints);

        sum.innerText = `Összesen: ${seasons.map(s => s.points).reduce((a, b) => a + b, 0)}`;
        hiddenSum.innerText = `Rejtett küldetések: ${hiddenQuests.map(q => q.points).reduce((a, b) => a + b, 0)}`;
    }

    clearPreviews() {
        for (let row of this.tiles) {
            for (let tile of row) {
                tile.previewOff();
            }
        }
    }
}