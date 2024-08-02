document.addEventListener("DOMContentLoaded", () => {
    const startScreen = document.getElementById("start-screen");
    const gameContainer = document.getElementById("game-container");
    const character = document.getElementById("character");
    const gameOverScreen = document.getElementById("game-over-screen");
    const startButton = document.getElementById("start-button");
    const restartButton = document.getElementById("restart-button");
    const scoreElement = document.getElementById("score");
    const levelElement = document.getElementById("level");
    const finalScoreElement = document.getElementById("final-score");
    const highScoresList = document.getElementById("high-scores-list");

    let running = false;
    let direction = "right";
    let score = 0;
    let level = 1;
    let gameInterval;
    let objectInterval;
    let rewardInterval;
    let levelInterval;
    let speed = 5;

    startButton.addEventListener("click", startGame);
    restartButton.addEventListener("click", restartGame);

    function startGame() {
        startScreen.style.display = "none";
        gameContainer.style.display = "block";
        gameOverScreen.style.display = "none";
        running = true;
        score = 0;
        level = 1;
        speed = 5;
        updateScore();
        updateLevel();
        gameInterval = setInterval(updateGame, 50);
        objectInterval = setInterval(createObject, 1000);
        rewardInterval = setInterval(createReward, 5000);
        levelInterval = setInterval(nextLevel, 10000);
    }

    function restartGame() {
        location.reload();
    }

    document.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            direction = direction === "right" ? "left" : "right";
        } else if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
            speed = 10;
        }
    });

    document.addEventListener("keyup", (e) => {
        if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
            speed = 5;
        }
    });

    function updateGame() {
        if (!running) return;

        let characterLeft = character.offsetLeft;
        if (direction === "right") {
            characterLeft += speed;
            if (characterLeft + character.offsetWidth > window.innerWidth) {
                characterLeft = 0;
            }
        } else {
            characterLeft -= speed;
            if (characterLeft < 0) {
                characterLeft = window.innerWidth - character.offsetWidth;
            }
        }
        character.style.left = `${characterLeft}px`;

        document.querySelectorAll(".object, .reward").forEach(obj => {
            if (isCollision(character, obj)) {
                if (obj.classList.contains("reward")) {
                    score += 10;
                    updateScore();
                    obj.remove();
                } else {
                    gameOver();
                }
            }
        });
    }

    function createObject() {
        const object = document.createElement("div");
        object.classList.add("object");
        object.style.left = `${Math.random() * (window.innerWidth - 30)}px`;
        gameContainer.appendChild(object);

        object.addEventListener("animationend", () => {
            object.remove();
        });
    }

    function createReward() {
        const reward = document.createElement("div");
        reward.classList.add("reward");
        reward.style.left = `${Math.random() * (window.innerWidth - 30)}px`;
        gameContainer.appendChild(reward);

        reward.addEventListener("animationend", () => {
            reward.remove();
        });
    }

    function isCollision(el1, el2) {
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();

        return !(
            rect1.top > rect2.bottom ||
            rect1.bottom < rect2.top ||
            rect1.right < rect2.left ||
            rect1.left > rect2.right
        );
    }

    function gameOver() {
        running = false;
        clearInterval(gameInterval);
        clearInterval(objectInterval);
        clearInterval(rewardInterval);
        clearInterval(levelInterval);
        gameOverScreen.style.display = "flex";
        finalScoreElement.textContent = `Final Score: ${score}`;
        updateHighScores();
    }

    function updateScore() {
        scoreElement.textContent = `Score: ${score}`;
    }

    function updateLevel() {
        levelElement.textContent = `Level: ${level}`;
    }

    function nextLevel() {
        level++;
        updateLevel();
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        document.body.style.backgroundColor = randomColor;
        character.style.backgroundColor = randomColor;
        document.querySelectorAll(".object").forEach(obj => {
            obj.style.backgroundColor = randomColor;
        });
        document.querySelectorAll(".reward").forEach(reward => {
            reward.style.backgroundColor = randomColor;
        });
    }

    function updateHighScores() {
        const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
        highScores.push(score);
        highScores.sort((a, b) => b - a);
        highScores.splice(5);
        localStorage.setItem("highScores", JSON.stringify(highScores));

        highScoresList.innerHTML = highScores.map(score => `<li>${score}</li>`).join("");
    }
});
