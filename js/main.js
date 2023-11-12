import {elements, seasons, allQuests} from "./data.js";
import {InteractiveMap, PreviewMap} from "./tiles.js";
import {Quest} from "./quest.js";

const sizeX = 11;
const sizeY = 11;

export let shuffledElements = shuffleArray(elements);
export let currentSeason = 0;

export function getCurrentSeason(shift = false) {
    if (shift) {
        currentSeason = (currentSeason + 1) % 4;
    }

    return seasons[currentSeason];
}

const previewMap = new PreviewMap("preview-map", 3, 3, false);
const map = new InteractiveMap("map", sizeX, sizeY, previewMap);

const codes = ["A", "B", "C", "D"];

export const quests = [];

for (let i = 0; i < 4; i++) {
    let randomQuest = allQuests[Math.floor(Math.random() * allQuests.length)];
    if (quests.some(q => q.id === randomQuest.id)) {
        i--;
        continue;
    }
    let q = new Quest(randomQuest, codes[i]);
    q.validateQuest(currentSeason);
    quests.push(q);
}

export function updateTimer() {
    document.getElementById("timer").innerHTML = `Hátralévő idő: ${map.seasonTime} (${map.time})`;
}

export function updateSeason() {
    document.getElementById("current-season").innerHTML = `Jelenlegi évszak: ${getCurrentSeason().name}`;
}

updateSeason();
updateTimer();

document.getElementById("rotate").addEventListener("click", () => {
    shuffledElements[0].changeRotation();
    map.updateActiveElement();
    previewMap.updateActiveElement()
});

document.getElementById("mirror").addEventListener("click", () => {
    shuffledElements[0].mirrored = !shuffledElements[0].mirrored;
    map.updateActiveElement();
    previewMap.updateActiveElement()
});

export function removeElement() {
    if (shuffledElements.length > 0) {
        shuffledElements = shuffledElements.slice(1);
    }
}

document.getElementById("sum").innerText = `Összesen: ${seasons.map(s => s.points).reduce((a, b) => a + b, 0)}`;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}