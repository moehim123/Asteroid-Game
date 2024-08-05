"use strict";

// Function to load SVG from a file and return it as an element
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

// Function to generate asteroids
function generateAsteroids(size1, ast, x, y, aList) {
    const svg = document.getElementById("canvas");

    loadSvgElement('circle.svg', svg, x, y, size1, size1, 'asteroid')
        .then(asteroid1 => {
            aList.push(asteroid1);

            Observable.interval(30) // Increased speed of asteroids
                .subscribe(() => {
                    let newY = Number(asteroid1.getAttribute('y')) + 5; // Faster movement
                    if (newY > 600) { // Reset position if it goes out of bounds
                        newY = -size1;
                        asteroid1.setAttribute('x', String(Math.random() * 600)); // Random x position
                    }
                    asteroid1.setAttribute('y', String(newY));
                });
        });
}

// Main game function
function asteroids() {
    const svg = document.getElementById("canvas");
    let rec = new Elem(svg, "rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", "black");

    var astlist = [];

    // Ship at the bottom of the canvas (slightly bigger)
    loadSvgElement('ship.svg', svg, 300, 500, 80, 40, 'ship') // Increased size
        .then(ship => {
            // Mouse movement for ship control
            const mousemove = Observable.fromEvent(svg, 'mousemove');
            mousemove.subscribe(({ clientX }) => {
                const svgRect = svg.getBoundingClientRect();
                const x = Math.min(Math.max(clientX - svgRect.left - 40, 0), 520); // Adjusted for ship width
                ship.setAttribute('x', x);
                ship.setAttribute('y', 500);
            });

            // Asteroids generation
            Observable.interval(3000) // Increased frequency
                .subscribe(() => {
                    const x = Math.random() * 600;
                    const size1 = Math.floor(Math.random() * (70 - 30)) + 30; // Increased size range
                    generateAsteroids(size1, new Elem(svg, 'g'), x, -size1, astlist);
                });

            // Bullet shooting
            let shooting = false; // Flag to indicate if shooting is active
            const mouseup = Observable.fromEvent(svg, 'mouseup');
            const mousedown = Observable.fromEvent(svg, 'mousedown');
            mousedown.subscribe(() => {
                if (!shooting) {
                    shooting = true;

                    const bullets = [];
                    const bulletSpeed = 4; // Slower bullet speed

                    // Create a bullet
                    const bullet = new Elem(svg, 'circle')
                        .attr("cx", String(Number(ship.getAttribute('x')) + 40)) // Adjusted for ship position
                        .attr("cy", String(Number(ship.getAttribute('y')) - 10)) // Offset from ship
                        .attr("r", "4")
                        .attr("fill", "purple");
                    bullets.push(bullet);

                    // Play shooting sound
                    const shootingSound = new Audio('Shooting-sound.wav');
                    shootingSound.play();

                    Observable.interval(10)
                        .takeUntil(Observable.interval(10000))
                        .subscribe(() => {
                            bullets.forEach(b => {
                                let cy = Number(b.attr('cy')) - bulletSpeed;
                                b.attr('cy', String(cy));

                                if (cy < 0) {
                                    b.elem.remove();
                                    bullets.splice(bullets.indexOf(b), 1);
                                }

                                // Check for collision with asteroids
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

                                        // Update score
                                        let score = Number(document.getElementById('score').textContent.split(': ')[1]);
                                        score += 1;
                                        document.getElementById('score').textContent = `Score: ${score}`;
                                    }
                                });
                            });
                        });

                    // Allow continuous shooting
                    mouseup.subscribe(() => {
                        shooting = false;
                    });
                }
            });
        });
}

if (typeof window != 'undefined') window.onload = () => {
    asteroids();
};
