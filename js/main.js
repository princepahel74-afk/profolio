/* ============================================================
           1. SYNTHESIZED 8-BIT / CYBER WEB AUDIO API (NO ASSETS NEEDED)
           ============================================================ */
        let audioCtx = null;
        let sfxEnabled = true;

        function initAudio() {
            if (!audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) audioCtx = new AudioContext();
            }
        }

        function playSound(type) {
            if (!sfxEnabled) return;
            try {
                initAudio();
                if (!audioCtx) return;
                if (audioCtx.state === 'suspended') audioCtx.resume();

                const now = audioCtx.currentTime;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                if (type === 'hover') {
                    // Gentle retro blip
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(480, now);
                    osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
                    gain.gain.setValueAtTime(0.04, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                    osc.start(now);
                    osc.stop(now + 0.05);
                } else if (type === 'click') {
                    // Sci-fi laser ping
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(950, now);
                    osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);
                    gain.gain.setValueAtTime(0.08, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                    osc.start(now);
                    osc.stop(now + 0.08);
                } else if (type === 'zap') {
                    // Blaster shot for minigame
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(800, now);
                    osc.frequency.exponentialRampToValueAtTime(100, now + 0.12);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                    osc.start(now);
                    osc.stop(now + 0.12);
                } else if (type === 'unlock') {
                    // Level-Up / Achievement Fanfare Arpeggio
                    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
                    notes.forEach((freq, idx) => {
                        const noteOsc = audioCtx.createOscillator();
                        const noteGain = audioCtx.createGain();
                        noteOsc.connect(noteGain);
                        noteGain.connect(audioCtx.destination);
                        
                        noteOsc.type = 'square';
                        noteOsc.frequency.setValueAtTime(freq, now + idx * 0.08);
                        noteGain.gain.setValueAtTime(0.05, now + idx * 0.08);
                        noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.2);
                        
                        noteOsc.start(now + idx * 0.08);
                        noteOsc.stop(now + idx * 0.08 + 0.2);
                    });
                }
            } catch (e) {
                // Audio fallback silence
            }
        }

        // SFX Toggle button
        const sfxBtn = document.getElementById('sfx-toggle');
        sfxBtn.addEventListener('click', () => {
            initAudio();
            sfxEnabled = !sfxEnabled;
            sfxBtn.textContent = sfxEnabled ? '🔊 SFX: ON' : '🔇 SFX: OFF';
            sfxBtn.style.borderColor = sfxEnabled ? 'var(--neon-pink)' : 'var(--text-dim)';
            sfxBtn.style.color = sfxEnabled ? 'var(--neon-pink)' : 'var(--text-dim)';
            if (sfxEnabled) playSound('click');
        });

        /* ============================================================
           2. INTERACTIVE CROSSHAIR CURSOR TRACKING
           ============================================================ */
        const cursor = document.getElementById('crosshair-cursor');
        let mouseX = -100, mouseY = -100;
        let curX = -100, curY = -100;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function updateCursor() {
            curX += (mouseX - curX) * 0.45;
            curY += (mouseY - curY) * 0.45;
            cursor.style.left = `${curX}px`;
            cursor.style.top = `${curY}px`;
            requestAnimationFrame(updateCursor);
        }
        updateCursor();

        // Lock onto clickable elements
        const clickables = document.querySelectorAll('a, button, .filter-btn, .arcade-tab, .mission-card, .skill-tree-node');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
                playSound('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
            });
            el.addEventListener('click', () => {
                playSound('click');
            });
        });

        /* ============================================================
           3. REAL-TIME TELEMETRY (DYNAMIC FPS & PING)
           ============================================================ */
        const fpsElem = document.getElementById('hud-fps');
        let frameCount = 0;
        let lastTime = performance.now();

        function measureFps() {
            frameCount++;
            const now = performance.now();
            if (now - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (now - lastTime));
                fpsElem.textContent = fps;
                frameCount = 0;
                lastTime = now;
            }
            requestAnimationFrame(measureFps);
        }
        measureFps();

        // Dynamic ping fluctuation
        const pingElem = document.getElementById('hud-ping');
        setInterval(() => {
            const simulatedPing = Math.floor(12 + Math.random() * 6);
            pingElem.textContent = `${simulatedPing} ms`;
        }, 3000);

        /* ============================================================
           4. TAB SWITCHER (MINI-GAME VS SYSTEM CONFIG)
           ============================================================ */
        const tabArcadeBtn = document.getElementById('tab-arcade-btn');
        const tabSpecBtn = document.getElementById('tab-spec-btn');
        const gameView = document.getElementById('game-view');
        const specView = document.getElementById('spec-view');

        tabArcadeBtn.addEventListener('click', () => {
            tabArcadeBtn.classList.add('active');
            tabSpecBtn.classList.remove('active');
            gameView.style.display = 'block';
            specView.style.display = 'none';
        });

        tabSpecBtn.addEventListener('click', () => {
            tabSpecBtn.classList.add('active');
            tabArcadeBtn.classList.remove('active');
            gameView.style.display = 'none';
            specView.style.display = 'block';
            triggerAchievement('Inspected Prince\'s System Architecture (+250 XP)');
        });

        /* ============================================================
           5. INTERACTIVE MINI-GAME: "NEON GLITCH BLASTER"
           ============================================================ */
        const canvas = document.getElementById('glitch-canvas');
        const ctx = canvas.getContext('2d');
        const scoreElem = document.getElementById('arcade-score');
        const comboElem = document.getElementById('arcade-combo');

        let gameScore = 0;
        let combo = 1;
        let targets = [];
        let particles = [];
        let lastTargetSpawn = 0;

        function resizeCanvas() {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class GlitchTarget {
            constructor() {
                this.x = Math.random() * (canvas.width - 60) + 30;
                this.y = Math.random() * (canvas.height - 100) + 50;
                this.size = 24 + Math.random() * 12;
                this.vx = (Math.random() - 0.5) * 1.8;
                this.vy = (Math.random() - 0.5) * 1.8;
                this.color = Math.random() > 0.5 ? '#00f0ff' : '#ff007f';
                this.alpha = 1;
                this.life = 180 + Math.random() * 100;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 20 || this.x > canvas.width - 20) this.vx *= -1;
                if (this.y < 40 || this.y > canvas.height - 30) this.vy *= -1;
                this.life--;
            }
            draw() {
                ctx.save();
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 10;
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 2;
                ctx.strokeRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
                
                // Inner diamond
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        class Particle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.vx = (Math.random() - 0.5) * 6;
                this.vy = (Math.random() - 0.5) * 6;
                this.color = color;
                this.alpha = 1;
                this.size = 3 + Math.random() * 3;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= 0.03;
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = Math.max(0, this.alpha);
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.size, this.size);
                ctx.restore();
            }
        }

        function gameLoop(time) {
            ctx.fillStyle = 'rgba(2, 5, 14, 0.25)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Spawn targets
            if (time - lastTargetSpawn > 1100 && targets.length < 6) {
                targets.push(new GlitchTarget());
                lastTargetSpawn = time;
            }

            // Update & draw targets
            for (let i = targets.length - 1; i >= 0; i--) {
                const t = targets[i];
                t.update();
                t.draw();
                if (t.life <= 0) targets.splice(i, 1);
            }

            // Update & draw particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.update();
                p.draw();
                if (p.alpha <= 0) particles.splice(i, 1);
            }

            requestAnimationFrame(gameLoop);
        }
        requestAnimationFrame(gameLoop);

        // Click to blast glitch target
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            playSound('zap');
            let hit = false;

            for (let i = targets.length - 1; i >= 0; i--) {
                const t = targets[i];
                const dist = Math.hypot(clickX - t.x, clickY - t.y);
                if (dist <= t.size + 10) {
                    hit = true;
                    // Spawn explosion particles
                    for (let p = 0; p < 16; p++) {
                        particles.push(new Particle(t.x, t.y, t.color));
                    }
                    targets.splice(i, 1);
                    gameScore += 100 * combo;
                    combo = Math.min(combo + 1, 8);
                    break;
                }
            }

            if (!hit) {
                combo = 1;
            }

            scoreElem.textContent = String(gameScore).padStart(4, '0');
            comboElem.textContent = `x${combo}`;

            if (gameScore >= 500) {
                triggerAchievement('Sharp Shooter: Scored 500+ in Neon Blaster! (+500 XP)');
            }
        });

        /* ============================================================
           6. PROJECT CATEGORY FILTERING
           ============================================================ */
        const filterBtns = document.querySelectorAll('.filter-btn');
        const missionCards = document.querySelectorAll('.mission-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');
                missionCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });

        /* ============================================================
           7. GAMIFIED ACHIEVEMENT UNLOCK TOAST SYSTEM
           ============================================================ */
        const achievementToast = document.getElementById('achievement-toast');
        const achievementText = document.getElementById('achievement-text');
        const unlockedAchievements = new Set();

        function triggerAchievement(text) {
            if (unlockedAchievements.has(text)) return;
            unlockedAchievements.add(text);

            achievementText.textContent = text;
            achievementToast.classList.add('show');
            playSound('unlock');

            setTimeout(() => {
                achievementToast.classList.remove('show');
            }, 4500);
        }

        // Trigger welcome achievement after 1.5 seconds
        setTimeout(() => {
            triggerAchievement('Player One Connected: Welcome to Prince\'s Portfolio! (+100 XP)');
        }, 1500);

        // Scroll listener for section achievements
        let scrolledAbout = false;
        let scrolledMissions = false;
        let scrolledArsenal = false;

        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY + window.innerHeight * 0.7;

            const aboutSec = document.getElementById('about');
            if (aboutSec && scrollPos >= aboutSec.offsetTop && !scrolledAbout) {
                scrolledAbout = true;
                triggerAchievement('Lore Hunter: Inspected Prince\'s Background & JEE Journey (+200 XP)');
            }

            const missionSec = document.getElementById('missions');
            if (missionSec && scrollPos >= missionSec.offsetTop && !scrolledMissions) {
                scrolledMissions = true;
                triggerAchievement('Tactical Scout: Accessed Campaign Mission Dossiers (+300 XP)');
            }

            const arsenalSec = document.getElementById('arsenal');
            if (arsenalSec && scrollPos >= arsenalSec.offsetTop && !scrolledArsenal) {
                scrolledArsenal = true;
                triggerAchievement('Armory Inspector: Reviewed Unity & C# Skill Tree (+250 XP)');
            }
        });
