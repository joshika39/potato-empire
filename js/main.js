import {elements, mountains} from "./data.js";

const shuffledElements = shuffleArray(elements);

const sizeX = 11;
const sizeY = 11;

const mapData = [[]];

const Seasons = {
    Summer: Symbol("summer"),
    Autumn: Symbol("autumn"),
    Winter: Symbol("winter"),
    Spring: Symbol("spring")
}

const TileTypes = {
    Village: Symbol("village"),
    Forest: Symbol("forest"),
    Field: Symbol("field"),
    River: Symbol("river"),
    Mountain: Symbol("mountain"),
    Lake: Symbol("lake"),
    Plain: Symbol("plain"),
}

class Position {
    constructor(y, x) {
        this.x = x;
        this.y = y;
    }
}

var currentType = TileTypes.Forest;

class Tile {
    content;
    type;
    isHoverable = true;
    isInPreview = true;

    constructor(position) {
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
        this.position = position;
        this.changeContent(TileTypes.Plain);
    }

    changeContent(newType) {
        console.log(this.content + " changed to " + newType.description);

        if (!this.content.classList.contains("tile")) {
            this.content.classList.add("tile");
        }

        if (this.type !== undefined && this.content.classList.contains(this.type.description)) {
            this.content.classList.remove(this.type.description);
        }

        this.type = newType;
        this.content.classList.add(newType.description);
    }

    onHovered(event){
        console.log(this.content + " hovered")
        if (!this.isHoverable || this.content === undefined) {
            return;
        }

        if(this.isInPreview){
            this.content.classList.remove(this.type.description);
            this.content.classList.add(currentType.description);
            this.content.classList.add("preview");
        }

        this.content.classList.add("hovered");
    }

    onUnhovered(event){
        console.log(this.content + " unhovered")

        if (!this.isHoverable || this.content === undefined) {
            return;
        }

        if(this.isInPreview){
            this.content.classList.remove(currentType.description);
            this.content.classList.add(this.type.description);
            this.content.classList.remove("preview");
        }

        this.content.classList.remove("hovered");
    }


}

document.addEventListener("DOMContentLoaded", function () {
    const map = document.getElementById("map");

    for (let i = 0; i < sizeY; i++) {
        let row = []
        for (let j = 0; j < sizeX; j++) {
            const tile = new Tile(new Position(i, j));
            map.appendChild(tile.content);
            row.push(tile);
        }
        mapData.push(row);
    }

    for (let mountain of mountains) {
        mapData[mountain[0]][mountain[1]].changeContent(TileTypes.Mountain);
        mapData[mountain[0]][mountain[1]].isHoverable = false;
    }

});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}