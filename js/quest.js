export class QuestBase {
    isCompleted = false;
    isActive = false;
    points = 0;

    constructor(questData) {
        this.id = questData.id;
        this.validator = questData.validator;
    }

    validatePoints(currentSeason, tiles) {
        if(this.isActive && !this.isCompleted){
            this.validator(tiles, this);
        }
    }

    validateQuest(currentSeason) {

    }

    serializeJSON() {
        return {
            id: this.id,
            isCompleted: this.isCompleted,
            isActive: this.isActive,
            points: this.points
        }
    }
}

export class HiddenQuest extends QuestBase{
    constructor(questData, points = 0) {
        super(questData);
        this.isActive = true;
        this.points = points;

        this.title = questData.title;
        this.description = questData.description;
    }

    toString() {
        return `${this.title}: ${this.description}`;
    }
}

export class Quest extends QuestBase{

    constructor(questData, code, points = 0) {
        super(questData);

        this.title = questData.title;
        this.description = questData.description;
        this.code = code;

        this.container = document.getElementById("quests");
        this.content = document.createElement("div");
        this.content.classList.add("quest");

        let questImage = document.createElement("div");
        questImage.classList.add("quest-image");
        let image = document.createElement("img");
        image.src = `./images/quests/${questData.id}.png`;
        questImage.append(image);

        let questDescription = document.createElement("div");
        questDescription.classList.add("quest-description");

        let title = document.createElement("h3");
        title.innerHTML = this.title;
        let description = document.createElement("p");
        description.innerHTML = this.description;
        this.letter = document.createElement("p");
        questDescription.append(title);
        questDescription.append(description);
        let pointHolder = document.createElement("div");
        pointHolder.classList.add("point-holder");
        this.pointsContent = document.createElement("p");
        this.pointsContent.innerHTML = `(${this.points} pont)`;
        pointHolder.append(this.pointsContent);
        pointHolder.append(this.letter)
        questDescription.append(pointHolder);

        this.content.append(questImage);
        this.content.append(questDescription);

        this.container.append(this.content);

        if(points > 0){
            this.points = points;
            this.pointsContent.innerHTML = `(${this.points} pont)`;
        }
    }

    validatePoints(currentSeason, tiles) {
        super.validatePoints(currentSeason, tiles);
        this.pointsContent.innerHTML = `(${this.points} pont)`;
    }

    validateQuest(currentSeason)  {
        switch (currentSeason) {
            case 0:
                this.isActive = this.code === "A" || this.code === "B";
                break;
            case 1:
                this.isActive = this.code === "B" || this.code === "C";
                break;
            case 2:
                this.isActive = this.code === "C" || this.code === "D";
                break;
            case 3:
                this.isActive = this.code === "D" || this.code === "A";
                break;
        }

        this.letter.innerHTML = this.isActive ? `🟢 ${this.code}` : this.code;
    }

    serializeJSON() {
        let base = super.serializeJSON();
        base.code = this.code;
        return base;
    }
}
