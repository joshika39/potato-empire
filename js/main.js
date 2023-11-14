import {elements, seasons, rawQuests, hiddenSum, Struct} from "./data.js";
import {InteractiveMap, PreviewMap} from "./tiles.js";
import {HiddenQuest, Quest} from "./quest.js";

const sizeX = 11;
const sizeY = 11;

window.mobileAndTabletCheck = function () {
    let check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

let storedElements = localStorage.elements ? JSON.parse(localStorage.elements) : [];
export let shuffledElements = localStorage.elements ? JSON.parse(localStorage.elements).map(e => new Struct(storedElements.find(el => el.id === e.id))) : shuffleArray(elements);
export let currentSeason = localStorage.currentSeason ? parseInt(localStorage.currentSeason) : 0;

export function getCurrentSeason(shift = false) {
    if (shift) {
        currentSeason = (currentSeason + 1) % 4;
        localStorage.currentSeason = currentSeason;
    }

    return seasons[currentSeason];
}

const previewMap = new PreviewMap("preview-map", 3, 3, false);
const map = new InteractiveMap("map", sizeX, sizeY, previewMap);

export const allQuests = rawQuests.basic.concat(rawQuests.extra);
export const quests = localStorage.quests ? JSON.parse(localStorage.quests).map(q => new Quest(allQuests.find(aq => aq.id === q.id), q.code, q.points)) : [];
export const hiddenQuests = localStorage.hiddenQuests ? JSON.parse(localStorage.hiddenQuests).map(q => new HiddenQuest(rawQuests.hidden.find(aq => aq.id === q.id))) : [];

if(quests.length === 0) {
    const codes = ["A", "B", "C", "D"];

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
}

if(hiddenQuests.length === 0) {
    rawQuests.hidden.forEach(q => hiddenQuests.push(new HiddenQuest(q)));
}

hiddenSum.title = "";
hiddenQuests.forEach(q => hiddenSum.title += `${q}\n`);

export function updateTimer() {
    document.getElementById("timer").innerHTML = `Hátralévő idő: ${map.seasonTime}/7 (${map.time})`;
}

export function updateSeason() {
    document.getElementById("current-season").innerHTML = `Jelenlegi évszak: ${getCurrentSeason().name}`;
}

updateSeason();
updateTimer();

document.getElementById("rotate").addEventListener("click", () => {
    if(shuffledElements.length === 0) {
        return;
    }

    shuffledElements[0].changeRotation();
    updateElement()
});

document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(event) {
    if (event.keyCode === 82 && event.shiftKey){
        localStorage.clear();
        location.reload();
        return;
    }

    if (event.keyCode === 82 && !event.ctrlKey) {
        event.preventDefault();
        shuffledElements[0].changeRotation();
        updateElement();
    }

    if (event.keyCode === 116 || event.keyCode === 84) {
        shuffledElements[0].mirrored = !shuffledElements[0].mirrored;
        updateElement()
    }
}

document.getElementById("mirror").addEventListener("click", () => {
    if(shuffledElements.length === 0) {
        return;
    }

    shuffledElements[0].mirrored = !shuffledElements[0].mirrored;
    updateElement()
});

export function updateElement(){
    map.updateActiveElement();
    previewMap.updateActiveElement()
    localStorage.elements = JSON.stringify(shuffledElements.map(e => e.serializeJSON()));
}

export function removeElement() {
    if (shuffledElements.length > 0) {
        shuffledElements = shuffledElements.slice(1);
    }

    if (shuffledElements.length === 0) {
        document.getElementById("rotate").disabled = true;
        document.getElementById("mirror").disabled = true;
        localStorage.elements = "";
        return;
    }

    localStorage.elements = JSON.stringify(shuffledElements.map(e => e.serializeJSON()));
}

document.getElementById("sum").innerText = `Összesen: ${seasons.map(s => s.points).reduce((a, b) => a + b, 0)}`;
document.getElementById("hidden-sum").innerText = `Rejtett küldetések: ${hiddenQuests.map(q => q.points).reduce((a, b) => a + b, 0)}`;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}