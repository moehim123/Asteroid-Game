"use strict";

function loadSvgElement(file, svg, x, y, width, height, className) {
    return fetch(file)
        .then(response => response.text())
        .then(svgContent => {
            const div = document.createElement('div');
            div.innerHTML = svgContent;
            const svgElement = div.querySelector('svg');
            svgElement.setAttribute('x', x);
            svgElement.setAttribute('y', y);
            svgElement.setAttribute('width', width);
            svgElement.setAttribute('height', height);
            svgElement.classList.add(className);
            svg.appendChild(svgElement);
            return svgElement;
        });
}

function generateAsteroids(size, x, y, aList) {
    const svg = document.getElementById("canvas");

    loadSvgElement('circle.svg', svg, x, y, size, size, 'asteroid')
        .then(asteroid => {
            aList.push(asteroid);

            const speed = 3;

            function moveAsteroid() {
                if (!asteroid) return;

                let newY = Number(asteroid.getAttribute('y')) + speed;
                asteroid.setAttribute('y', String(newY));

                requestAnimationFrame(moveAsteroid);
            }

            moveAsteroid();
        });
}

function checkCollision(ship, asteroid) {
    const shipX = Number(ship.getAttribute('x'));
    const shipY = Number(ship.getAttribute('y'));
    const shipWidth = Number(ship.getAttribute('width'));
    const shipHeight = Number(ship.getAttribute('height'));

    const asteroidX = Number(asteroid.getAttribute('x'));
    const asteroidY = Number(asteroid.getAttribute('y'));
    const asteroidWidth = Number(asteroid.getAttribute('width'));
    const asteroidHeight = Number(asteroid.getAttribute('height'));

    return (
        shipX < asteroidX + asteroidWidth &&
        shipX + shipWidth > asteroidX &&
        shipY < asteroidY + asteroidHeight &&
        shipY + shipHeight > asteroidY
    );
}

function endGame(subscriptions, svg) {
    subscriptions.forEach(sub => {
        if (sub && typeof sub.unsubscribe === 'function') {
            sub.unsubscribe();
        }
    });

    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }

    const overlay = document.createElement('div');
    overlay.classList.add('game-over-overlay');
    overlay.style.position = "fixed";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.zIndex = 9999;
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    
    const gameOverMessage = document.createElement('div');
    gameOverMessage.classList.add('game-over-message');
    gameOverMessage.textContent = "Game Over";
    gameOverMessage.style.color = "white";
    gameOverMessage.style.fontSize = "3em";
    
    overlay.appendChild(gameOverMessage);
    document.body.appendChild(overlay);
}

function asteroids() {
    const svg = document.getElementById("canvas");
    new Elem(svg, "rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", "black");

    let astlist = [];
    let subscriptions = [];
    let gameOver = false;
    let missedCount = 0;

    const missedCounter = document.getElementById('missed-counter');
    const missedMessage = document.getElementById('missed-message');

    loadSvgElement('ship.svg', svg, 300, 500, 80, 40, 'ship')
        .then(ship => {
            const mousemove = Observable.fromEvent(svg, 'mousemove');
            const mousemoveSub = mousemove.subscribe(({ clientX }) => {
                if (!gameOver) {
                    const svgRect = svg.getBoundingClientRect();
                    const x = Math.min(Math.max(clientX - svgRect.left - 40, 0), 520);
                    ship.setAttribute('x', x);
                    ship.setAttribute('y', 500);
                }
            });

            subscriptions.push(mousemoveSub);

            let asteroidFrequency = 2000;
            function startGeneratingAsteroids() {
                const intervalSub = Observable.interval(asteroidFrequency)
                    .subscribe(() => {
                        if (!gameOver) {
                            const numAsteroids = Math.floor(Math.random() * (3 - 2 + 1)) + 2;
                            for (let i = 0; i < numAsteroids; i++) {
                                const x = Math.random() * 600;
                                const size = Math.floor(Math.random() * (70 - 30)) + 30;
                                generateAsteroids(size, x, -size, astlist);
                            }
                        }
                    });

                subscriptions.push(intervalSub);
            }

            startGeneratingAsteroids();

            const speedSub = Observable.interval(10000)
                .subscribe(() => {
                    if (!gameOver) {
                        asteroidFrequency = Math.max(500, asteroidFrequency - 500);
                    }
                });

            subscriptions.push(speedSub);

            let shooting = false;
            const mouseup = Observable.fromEvent(svg, 'mouseup');
            const mousedown = Observable.fromEvent(svg, 'mousedown');
            const mousedownSub = mousedown.subscribe(() => {
                if (!shooting && !gameOver) {
                    shooting = true;

                    const bullets = [];
                    const bulletSpeed = 4;

                    const bullet = new Elem(svg, 'circle')
                        .attr("cx", String(Number(ship.getAttribute('x')) + 40))
                        .attr("cy", String(Number(ship.getAttribute('y')) - 10))
                        .attr("r", "4")
                        .attr("fill", "purple");
                    bullets.push(bullet);

                    const shootingSound = new Audio('Shooting-sound.wav');
                    shootingSound.play();

                    function moveBullets() {
                        bullets.forEach(b => {
                            let cy = Number(b.attr('cy')) - bulletSpeed;
                            b.attr('cy', String(cy));

                            if (cy < 0) {
                                b.elem.remove();
                                bullets.splice(bullets.indexOf(b), 1);
                            } else {
                                astlist.forEach(asteroid => {
                                    const asteroidX = Number(asteroid.getAttribute('x')) + (Number(asteroid.getAttribute('width')) / 2);
                                    const asteroidY = Number(asteroid.getAttribute('y')) + (Number(asteroid.getAttribute('height')) / 2);
                                    const bulletX = Number(b.attr('cx'));
                                    const bulletY = Number(b.attr('cy'));

                                    const dx = bulletX - asteroidX;
                                    const dy = bulletY - asteroidY;
                                    const distance = Math.sqrt(dx * dx + dy * dy);

                                    if (distance <= 4 + Number(asteroid.getAttribute('width')) / 2) {
                                        astlist.splice(astlist.indexOf(asteroid), 1);
                                        asteroid.remove();
                                        b.elem.remove();

                                        let score = Number(document.getElementById('score').textContent.split(': ')[1]);
                                        score += 1;
                                        document.getElementById('score').textContent = `Score: ${score}`;
                                    }
                                });
                            }
                        });

                        if (!gameOver) {
                            requestAnimationFrame(moveBullets);
                        }
                    }

                    moveBullets();

                    const mouseupSub = mouseup.subscribe(() => {
                        shooting = false;
                    });

                    subscriptions.push(mouseupSub);
                }
            });

            subscriptions.push(mousedownSub);

            function gameLoop() {
                if (gameOver) return;

                astlist.forEach((asteroid, index) => {
                    let y = Number(asteroid.getAttribute('y'));
                    if (checkCollision(ship, asteroid)) {
                        endGame(subscriptions, svg);
                        gameOver = true;
                        return;
                    }

                    if (y > 600 + Number(asteroid.getAttribute('height'))) {
                        missedCount++;
                        missedCounter.textContent = `Missed: ${missedCount}`;
                        if (missedCount > 11) {
                            missedMessage.style.display = 'block';
                        }
                        svg.removeChild(asteroid);
                        astlist.splice(index, 1);
                    }
                });

                requestAnimationFrame(gameLoop);
            }

            gameLoop();
        });
}

if (typeof window !== 'undefined') {
    window.onload = () => {
        asteroids();
    };
}
