const defaultData = { 
    screws: 0,
    crystals: 0,

    stage: 1,

    atk: 10,
    atkSpd: 3000,
    critChance: 5,
    critMultiplier: 3,

    playerMaxHp: 100,
    playerHp: 100,

    rushFragments: 0,
    rushOwned: false,

    beatFragments: 0,
    beatOwned: false,
    partnerAtkSpd: 2000,

    lv: {
        atk: 1,
        spd: 1,
        hp: 1,
        crit: 1,
        critDmg: 1,
        partnerSpd: 1
    },

    costs: {
        atk: 10,
        spd: 20,
        hp: 30,
        crit: 50,
        critDmg: 150,
        partnerSpd: 200
    }
};

let savedData = JSON.parse(localStorage.getItem('rockmanSave')) || {};

let gameData = {
    ...defaultData,
    ...savedData,
    lv: { ...defaultData.lv, ...(savedData.lv || {}) },
    costs: { ...defaultData.costs, ...(savedData.costs || {}) }
};

if (savedData.partnerFragments && !savedData.rushFragments) {
    gameData.rushFragments = savedData.partnerFragments;
}

if (savedData.gold && !savedData.screws) {
    gameData.screws = Math.floor(savedData.gold);
}

gameData.screws = Math.floor(gameData.screws || 0);
gameData.crystals = Math.floor(gameData.crystals || 0);
gameData.rushFragments = Math.floor(gameData.rushFragments || 0);
gameData.beatFragments = Math.floor(gameData.beatFragments || 0);
gameData.rushOwned = gameData.rushOwned || false;
gameData.beatOwned = gameData.beatOwned || false;
gameData.partnerAtkSpd = gameData.partnerAtkSpd || 2000;
gameData.playerHp = gameData.playerMaxHp;

Object.keys(gameData.costs).forEach(key => {
    gameData.costs[key] = Math.floor(gameData.costs[key]);
});

const RUSH_REQUIRED_FRAGMENTS = 100;
const BEAT_REQUIRED_FRAGMENTS = 100;
const ENEMY_START_X = 460;
const ENEMY_ATTACK_X = 120;

let enemyMaxHp = 1000;
let enemyHp = 1000;
let enemyX = ENEMY_START_X;
let enemySpeed = 0.35;
let enemyAtk = 5;

let attackTimer = null;
let chaseTimer = null;
let enemyDead = false;
let enemyAttacking = false;
let playerDead = false;

let rockFrame = 1;
let rockDir = 1;
let metFrame = 1;

let rushWalkFrames = [2, 3, 4];
let rushWalkIndex = 0;
let rushJoinFrame = 1;
let rushJoinTimer = null;

let beatFrame = 1;
let beatDir = 1;
let beatFloat = 0;
let beatJoinTimer = null;

setupStage();

function setupStage() {
    const s = gameData.stage;

    enemyMaxHp = Math.floor((120 + s * 75 + Math.pow(s, 1.35) * 25) * 0.66);
    enemyHp = enemyMaxHp;

    enemySpeed = 0.22 + s * 0.025;
    enemyAtk = Math.floor(4 + s * 1.6);

    gameData.playerMaxHp = Math.floor(100 + (gameData.lv.hp - 1) * 20);
    gameData.playerHp = gameData.playerMaxHp;

    enemyX = ENEMY_START_X;
    enemyDead = false;
    enemyAttacking = false;
    playerDead = false;

    const rockman = document.getElementById('rockman-img');
    if (rockman) rockman.classList.remove('rockman-death-hide');

    updateEnemyPosition();
}

function animate() {
    const rImg = document.getElementById('rockman-img');
    const eImg = document.getElementById('enemy-img');

    if (!rImg || !eImg) return;

    rockFrame += rockDir;
    if (rockFrame === 3 || rockFrame === 1) rockDir *= -1;
    rImg.src = `sprites/rock/rock_0${rockFrame}.png`;

    if (!enemyDead) {
        metFrame = (metFrame % 2) + 1;
        eImg.src = `sprites/enemy/met/met_0${metFrame}.png`;
    }

    animateRush();
    animateBeat();
}

function animateRush() {
    const rushImg = document.getElementById('rush-img');
    if (!rushImg || !gameData.rushOwned) return;

    rushImg.src = `sprites/partner/rush/rush_0${rushWalkFrames[rushWalkIndex]}.png`;
    rushWalkIndex = (rushWalkIndex + 1) % rushWalkFrames.length;
}

function animateBeat() {
    const beatImg = document.getElementById('beat-img');
    if (!beatImg || !gameData.beatOwned) return;

    beatFrame += beatDir;
    if (beatFrame === 4 || beatFrame === 1) beatDir *= -1;

    beatFloat += 0.2;

    beatImg.src = `sprites/partner/beat/beat_0${beatFrame}.png`;
    beatImg.style.transform = `translateY(${Math.sin(beatFloat) * 4}px)`;
}

setInterval(animate, 200);

function startChase() {
    if (chaseTimer) clearInterval(chaseTimer);

    chaseTimer = setInterval(() => {
        if (enemyDead || playerDead) return;

        if (enemyX > ENEMY_ATTACK_X) {
            enemyX -= enemySpeed;
            updateEnemyPosition();
        } else {
            enemyHitsPlayer();
        }
    }, 30);
}

function updateEnemyPosition() {
    const enemyArea = document.getElementById('enemy-area');
    if (!enemyArea) return;

    enemyArea.style.left = enemyX + "px";
}

function enemyHitsPlayer() {
    if (playerDead) return;
    if (gameData.playerHp <= 0) return;
    if (enemyAttacking || enemyDead) return;

    enemyAttacking = true;

    gameData.playerHp -= enemyAtk;
    if (gameData.playerHp < 0) gameData.playerHp = 0;

    showPlayerDamageText(enemyAtk);
    playPlayerHitEffect();

    updateUI();
    saveData();

    if (gameData.playerHp <= 0) {
        failStage();
        return;
    }

    setTimeout(() => {
        enemyAttacking = false;
    }, 1100);
}

function playPlayerHitEffect() {
    const rockmanArea = document.getElementById('rockman-area');
    const bg = document.getElementById('scroll-bg');

    if (!rockmanArea || !bg) return;

    rockmanArea.classList.remove('knockback');
    void rockmanArea.offsetWidth;
    rockmanArea.classList.add('knockback');

    bg.classList.add('paused');

    setTimeout(() => {
        bg.classList.remove('paused');
    }, 230);
}

function playRockmanDeathEffect() {
    const screen = document.querySelector('.game-screen');
    const rockman = document.getElementById('rockman-img');
    const rockmanArea = document.getElementById('rockman-area');

    if (!screen || !rockman || !rockmanArea) return;

    rockman.classList.add('rockman-death-hide');

    const areaRect = rockmanArea.getBoundingClientRect();
    const screenRect = screen.getBoundingClientRect();

    const centerX = areaRect.left - screenRect.left + 24;
    const centerY = screenRect.bottom - areaRect.top - 24;

    const particles = [
        [0, -42],
        [30, -30],
        [42, 0],
        [30, 30],
        [0, 42],
        [-30, 30],
        [-42, 0],
        [-30, -30],
        [18, -50],
        [-18, -50]
    ];

    particles.forEach(pos => {
        const p = document.createElement('div');
        p.className = 'rockman-death-particle';
        p.style.left = centerX + "px";
        p.style.bottom = centerY + "px";
        p.style.setProperty('--x', pos[0] + 'px');
        p.style.setProperty('--y', pos[1] + 'px');

        screen.appendChild(p);

        setTimeout(() => {
            p.remove();
        }, 700);
    });
}

function failStage() {
    if (playerDead) return;

    playerDead = true;
    enemyDead = true;
    enemyAttacking = true;

    playRockmanDeathEffect();

    setTimeout(() => {
        if (gameData.stage > 1) {
            gameData.stage--;
            showStageText("STAGE DOWN");
        } else {
            showStageText("RETRY");
        }

        setupStage();

        updateUI();
        saveData();
    }, 750);
}

function attack() {
    if (enemyDead || playerDead) return;

    const rockman = document.getElementById('rockman-img');
    const enemy = document.getElementById('enemy-img');
    const screen = document.querySelector('.game-screen');

    if (!rockman || !enemy || !screen) return;

    const isChargeShot = Math.random() * 100 < gameData.critChance;

    if (isChargeShot) fireChargeShot(screen, enemy);
    else fireNormalShot(screen, enemy);
}

function getBusterPosition() {
    const screen = document.querySelector('.game-screen');
    const rockman = document.getElementById('rockman-img');

    const screenRect = screen.getBoundingClientRect();
    const rockRect = rockman.getBoundingClientRect();

    return {
        x: rockRect.right - screenRect.left - 8,
        y: screenRect.bottom - rockRect.top - 28
    };
}

function getBulletTravel(startX) {
    const enemy = document.getElementById('enemy-img');
    const screen = document.querySelector('.game-screen');

    if (!enemy || !screen) return 120;

    const screenRect = screen.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    const enemyCenterX = enemyRect.left + enemyRect.width / 2 - screenRect.left;

    return Math.max(40, enemyCenterX - startX);
}

function fireNormalShot(screen, enemy) {
    const bullet = document.createElement('div');
    bullet.className = 'bullet';

    const pos = getBusterPosition();
    bullet.style.left = pos.x + "px";
    bullet.style.bottom = pos.y + "px";

    screen.appendChild(bullet);

    const travel = getBulletTravel(pos.x);

    bullet.animate(
        [{ transform: 'translateX(0)' }, { transform: `translateX(${travel}px)` }],
        { duration: 280, easing: 'linear' }
    );

    setTimeout(() => {
        applyDamage(false);
        if (!enemyDead) playEnemyHit(enemy);
        bullet.remove();
    }, 280);
}

function fireChargeShot(screen, enemy) {
    const charge = document.createElement('div');
    charge.className = 'charge-effect';

    const chargePos = getBusterPosition();
    charge.style.left = (chargePos.x - 8) + "px";
    charge.style.bottom = (chargePos.y - 8) + "px";

    screen.appendChild(charge);

    setTimeout(() => {
        charge.remove();

        const bullet = document.createElement('div');
        bullet.className = 'bullet charge-shot';

        const pos = getBusterPosition();
        bullet.style.left = pos.x + "px";
        bullet.style.bottom = pos.y + "px";

        screen.appendChild(bullet);

        const travel = getBulletTravel(pos.x);

        bullet.animate(
            [{ transform: 'translateX(0)' }, { transform: `translateX(${travel}px)` }],
            { duration: 170, easing: 'linear' }
        );

        setTimeout(() => {
            applyDamage(true);
            if (!enemyDead) playEnemyHit(enemy);
            bullet.remove();
        }, 170);
    }, 110);
}

function playEnemyHit(enemy) {
    enemy.classList.remove('hit-shake');
    void enemy.offsetWidth;
    enemy.classList.add('hit-shake');
}

function applyDamage(isChargeShot) {
    if (enemyDead || playerDead) return;

    let damage = gameData.atk;

    if (isChargeShot) {
        damage = Math.floor(damage * gameData.critMultiplier);
    }

    enemyHp -= damage;

    showDamageText(damage, isChargeShot);

    if (enemyHp <= 0) {
        killEnemy();
    }

    updateUI();
    saveData();
}

function killEnemy() {
    if (enemyDead || playerDead) return;

    enemyDead = true;
    enemyHp = 0;

    const reward = Math.floor(80 + gameData.stage * 20);
    gameData.screws += reward;

    playEnemyDeathEffect();
    showRewardText(reward);

    setTimeout(() => {
        gameData.stage++;
        setupStage();
        showStageText("STAGE " + gameData.stage);
        updateUI();
        saveData();
    }, 500);
}

function playEnemyDeathEffect() {
    const enemy = document.getElementById('enemy-img');
    const screen = document.querySelector('.game-screen');

    enemy.classList.remove('hit-shake');
    enemy.classList.add('enemy-death');

    const particles = [
        [-20, -20], [0, -25], [20, -20],
        [-25, 0], [25, 0],
        [-15, 20], [15, 20]
    ];

    particles.forEach(pos => {
        const p = document.createElement('div');
        p.className = 'death-particle';
        p.style.left = (enemyX + 12) + "px";
        p.style.bottom = "32px";
        p.style.setProperty('--x', pos[0] + 'px');
        p.style.setProperty('--y', pos[1] + 'px');
        screen.appendChild(p);
        setTimeout(() => p.remove(), 350);
    });

    setTimeout(() => {
        enemy.classList.remove('enemy-death');
        enemy.style.opacity = "1";
        enemy.style.transform = "scale(1)";
    }, 450);
}

function showDamageText(damage, isChargeShot) {
    const screen = document.querySelector('.game-screen');

    const dmg = document.createElement('div');
    dmg.className = 'damage-text';

    if (isChargeShot) {
        dmg.classList.add('crit');
        dmg.innerText = `CHARGE ${damage}`;
    } else {
        dmg.innerText = damage;
    }

    dmg.style.left = enemyX + "px";
    dmg.style.right = "auto";
    dmg.style.bottom = "38px";

    screen.appendChild(dmg);
    setTimeout(() => dmg.remove(), 600);
}

function showPlayerDamageText(damage) {
    const screen = document.querySelector('.game-screen');
    const rockmanArea = document.getElementById('rockman-area');

    if (!screen || !rockmanArea) return;

    const screenRect = screen.getBoundingClientRect();
    const rockRect = rockmanArea.getBoundingClientRect();

    const text = document.createElement('div');
    text.className = 'damage-text';
    text.innerText = `-${damage}`;
    text.style.color = '#ff3b3b';
    text.style.textShadow = '0 0 8px #ff3b3b';
    text.style.left = (rockRect.left - screenRect.left + 10) + 'px';
    text.style.right = 'auto';
    text.style.bottom = '58px';

    screen.appendChild(text);

    setTimeout(() => {
        text.remove();
    }, 600);
}

function showRewardText(reward) {
    const screen = document.querySelector('.game-screen');

    const text = document.createElement('div');
    text.className = 'damage-text reward-text';
    text.innerText = `+${reward}🔩`;
    text.style.left = enemyX + "px";
    text.style.right = "auto";
    text.style.bottom = "38px";

    screen.appendChild(text);
    setTimeout(() => text.remove(), 600);
}

function showStageText(msg) {
    const screen = document.querySelector('.game-screen');

    const text = document.createElement('div');
    text.className = 'damage-text stage-text';
    text.innerText = msg;
    text.style.left = "170px";
    text.style.right = "auto";
    text.style.bottom = "55px";

    screen.appendChild(text);
    setTimeout(() => text.remove(), 800);
}

function calcCost(type, amount) {
    let cost = gameData.costs[type];
    let total = 0;

    for (let i = 0; i < amount; i++) {
        total += cost;
        cost = getNextCost(type, cost);
    }

    return total;
}

function getNextCost(type, cost) {
    if (type === 'atk') return Math.floor(cost * 1.5);
    if (type === 'spd') return Math.floor(cost * 2);
    if (type === 'hp') return Math.floor(cost * 1.6);
    if (type === 'crit') return Math.floor(cost * 1.8);
    if (type === 'critDmg') return Math.floor(cost * 1.7);
    if (type === 'partnerSpd') return Math.floor(cost * 1.7);
}

function buyUpgrade(type, amount) {
    for (let i = 0; i < amount; i++) {
        if (gameData.screws < gameData.costs[type]) break;

        gameData.screws -= gameData.costs[type];
        gameData.lv[type]++;

        if (type === 'atk') gameData.atk += 5;

        if (type === 'spd') {
            if (gameData.atkSpd > 300) gameData.atkSpd -= 200;
            startAutoAttack();
        }

        if (type === 'hp') {
           gameData.playerMaxHp += 20;
           gameData.playerHp += 20;
        }

        if (type === 'crit') gameData.critChance += 2;

        if (type === 'critDmg') gameData.critMultiplier += 0.25;

        if (type === 'partnerSpd') {
            if (gameData.partnerAtkSpd > 400) {
                gameData.partnerAtkSpd -= 120;
            }
        }

        gameData.costs[type] = getNextCost(type, gameData.costs[type]);
    }

    updateUI();
    saveData();
}

function buyUpgradeMax(type) {
    while (gameData.screws >= gameData.costs[type]) {
        buyUpgrade(type, 1);
    }
}

function exchangeScrewsToCrystals(amount) {
    const cost = amount * 100;
    if (gameData.screws < cost) return;

    gameData.screws -= cost;
    gameData.crystals += amount;

    updateUI();
    saveData();
}

function buyRushFragment(amount) {
    if (gameData.rushOwned) return;
    if (gameData.crystals < amount) return;

    gameData.crystals -= amount;
    gameData.rushFragments += amount;

    if (gameData.rushFragments > RUSH_REQUIRED_FRAGMENTS) {
        gameData.rushFragments = RUSH_REQUIRED_FRAGMENTS;
    }

    updateUI();
    saveData();
}

function buyBeatFragment(amount) {
    if (gameData.beatOwned) return;
    if (gameData.crystals < amount) return;

    gameData.crystals -= amount;
    gameData.beatFragments += amount;

    if (gameData.beatFragments > BEAT_REQUIRED_FRAGMENTS) {
        gameData.beatFragments = BEAT_REQUIRED_FRAGMENTS;
    }

    updateUI();
    saveData();
}

function getSummonTextElement() {
    return document.getElementById('summon-text') || document.querySelector('.summon-text');
}

function prepareSummonPopup(type) {
    const popup = document.getElementById('summon-popup');
    const text = getSummonTextElement();

    const rushImg = document.getElementById('rush-join-img');
    let beatImg = document.getElementById('beat-join-img');

    if (!popup || !text || !rushImg) return null;

    if (!beatImg) {
        beatImg = document.createElement('img');
        beatImg.id = 'beat-join-img';
        beatImg.className = 'rush-join-img';
        beatImg.src = 'sprites/partner/beat/beat_01.png';
        beatImg.style.display = 'none';

        const box = document.querySelector('.summon-box');
        if (box) box.appendChild(beatImg);
    }

    if (type === 'rush') {
        text.innerText = 'RUSH JOIN!';
        rushImg.style.display = 'block';
        beatImg.style.display = 'none';
    }

    if (type === 'beat') {
        text.innerText = 'BEAT JOIN!';
        rushImg.style.display = 'none';
        beatImg.style.display = 'block';
    }

    popup.classList.add('active');

    return { popup, rushImg, beatImg };
}

function summonRush() {
    if (gameData.rushOwned) return;
    if (gameData.rushFragments < RUSH_REQUIRED_FRAGMENTS) return;

    gameData.rushOwned = true;

    const popupData = prepareSummonPopup('rush');

    if (!popupData) {
        updateUI();
        saveData();
        return;
    }

    const { popup, rushImg } = popupData;

    rushJoinFrame = 1;
    rushImg.src = `sprites/partner/rush/rush_join_01.png`;

    rushImg.classList.remove('rush-drop');
    void rushImg.offsetWidth;
    rushImg.classList.add('rush-drop');

    if (rushJoinTimer) clearInterval(rushJoinTimer);

    rushJoinTimer = setInterval(() => {
        rushJoinFrame++;

        if (rushJoinFrame <= 3) {
            rushImg.src = `sprites/partner/rush/rush_join_0${rushJoinFrame}.png`;
        } else {
            clearInterval(rushJoinTimer);
            rushJoinTimer = null;
            rushImg.classList.remove('rush-drop');
            rushImg.src = `sprites/partner/rush/rush_01.png`;
        }
    }, 180);

    popup.onclick = () => {
        closeSummonPopup();
    };

    updateUI();
    saveData();
}

function summonBeat() {
    if (gameData.beatOwned) return;
    if (gameData.beatFragments < BEAT_REQUIRED_FRAGMENTS) return;

    gameData.beatOwned = true;

    const popupData = prepareSummonPopup('beat');
    if (!popupData) {
        updateUI();
        saveData();
        return;
    }

    const { popup, beatImg } = popupData;

    beatFrame = 1;
    beatDir = 1;
    beatFloat = 0;
    beatImg.src = `sprites/partner/beat/beat_01.png`;

    if (beatJoinTimer) clearInterval(beatJoinTimer);

    let frame = 1;
    beatJoinTimer = setInterval(() => {
        frame++;
        if (frame > 4) frame = 2;
        beatImg.src = `sprites/partner/beat/beat_0${frame}.png`;
    }, 120);

    popup.onclick = () => {
        closeSummonPopup();
    };

    updateUI();
    saveData();
}

function closeSummonPopup() {
    const popup = document.getElementById('summon-popup');
    const rushJoinImg = document.getElementById('rush-join-img');
    const beatJoinImg = document.getElementById('beat-join-img');

    if (popup) {
        popup.classList.remove('active');
        popup.onclick = null;
    }

    if (rushJoinTimer) {
        clearInterval(rushJoinTimer);
        rushJoinTimer = null;
    }

    if (beatJoinTimer) {
        clearInterval(beatJoinTimer);
        beatJoinTimer = null;
    }

if (rushJoinImg) {
    rushJoinImg.classList.remove('rush-drop');
    rushJoinImg.src = `sprites/partner/rush/rush_join_01.png`;
    rushJoinImg.style.display = 'block';
}

    if (beatJoinImg) {
        beatJoinImg.src = `sprites/partner/beat/beat_01.png`;
        beatJoinImg.style.display = 'none';
    }

    showTab('battle');
    updateUI();
}

function showTab(tabName) {
    document.getElementById('battle-tab').classList.remove('active');
    document.getElementById('partner-tab').classList.remove('active');
    document.getElementById('battle-tab-btn').classList.remove('active');
    document.getElementById('partner-tab-btn').classList.remove('active');

    document.getElementById(tabName + '-tab').classList.add('active');
    document.getElementById(tabName + '-tab-btn').classList.add('active');
}

function startAutoAttack() {
    if (attackTimer) clearInterval(attackTimer);
    attackTimer = setInterval(attack, gameData.atkSpd);
}

function updateUI() {
    document.getElementById('stage').innerText = gameData.stage;
    document.getElementById('player-hp-text').innerText = Math.floor(gameData.playerHp);
    document.getElementById('player-max-hp-text').innerText = Math.floor(gameData.playerMaxHp);

    document.getElementById('player-hp-fill').style.width =
        Math.max(0, (gameData.playerHp / gameData.playerMaxHp) * 100) + "%";

    document.getElementById('screws').innerText = Math.floor(gameData.screws).toLocaleString();
    document.getElementById('crystals').innerText = Math.floor(gameData.crystals).toLocaleString();

    document.getElementById('hp-bar-fill').style.width =
        Math.max(0, (enemyHp / enemyMaxHp) * 100) + "%";

    ['atk', 'spd', 'hp', 'crit', 'critDmg', 'partnerSpd'].forEach(type => {
        const lvEl = document.getElementById(type + '-lv');
        const btn1 = document.getElementById(`${type}-btn1`);
        const btn10 = document.getElementById(`${type}-btn10`);
        const btnMax = document.getElementById(`${type}-btnMax`);

        if (!lvEl || !btn1 || !btn10 || !btnMax) return;

        lvEl.innerText = gameData.lv[type];

        const cost1 = calcCost(type, 1);
        const cost10 = calcCost(type, 10);

        btn1.dataset.cost = `필요 🔩 ${cost1.toLocaleString()}`;
        btn10.dataset.cost = `필요 🔩 ${cost10.toLocaleString()}`;

        setButtonActive(btn1, gameData.screws >= cost1);
        setButtonActive(btn10, gameData.screws >= cost10);
        setButtonActive(btnMax, gameData.screws >= cost1);
    });

    setButtonActive(document.getElementById('exchange-btn1'), gameData.screws >= 100);
    setButtonActive(document.getElementById('exchange-btn10'), gameData.screws >= 1000);

    const rushFragmentsEl = document.getElementById('rush-fragments');
    if (rushFragmentsEl) rushFragmentsEl.innerText = gameData.rushFragments;

    setButtonActive(document.getElementById('rush-buy1'), !gameData.rushOwned && gameData.crystals >= 1 && gameData.rushFragments < 100);
    setButtonActive(document.getElementById('rush-buy10'), !gameData.rushOwned && gameData.crystals >= 10 && gameData.rushFragments <= 90);
    setButtonActive(document.getElementById('rush-buy100'), !gameData.rushOwned && gameData.crystals >= 100 && gameData.rushFragments === 0);
    setButtonActive(document.getElementById('rush-summon-btn'), !gameData.rushOwned && gameData.rushFragments >= 100);

    const rushCard = document.getElementById('rush-card');
    const completeBadge = document.getElementById('rush-complete-badge');

    if (rushCard && completeBadge) {
        if (gameData.rushOwned) {
            rushCard.classList.add('complete');
            completeBadge.classList.add('active');
        } else {
            rushCard.classList.remove('complete');
            completeBadge.classList.remove('active');
        }
    }

    const beatFragmentsEl = document.getElementById('beat-fragments');
    if (beatFragmentsEl) beatFragmentsEl.innerText = gameData.beatFragments;

    setButtonActive(document.getElementById('beat-buy1'), !gameData.beatOwned && gameData.crystals >= 1 && gameData.beatFragments < 100);
    setButtonActive(document.getElementById('beat-buy10'), !gameData.beatOwned && gameData.crystals >= 10 && gameData.beatFragments <= 90);
    setButtonActive(document.getElementById('beat-buy100'), !gameData.beatOwned && gameData.crystals >= 100 && gameData.beatFragments === 0);
    setButtonActive(document.getElementById('beat-summon-btn'), !gameData.beatOwned && gameData.beatFragments >= 100);

    const beatCard = document.getElementById('beat-card');
    const beatBadge = document.getElementById('beat-complete-badge');
    const beatArea = document.getElementById('beat-area');

    if (beatCard && beatBadge) {
        if (gameData.beatOwned) {
            beatCard.classList.add('complete');
            beatBadge.classList.add('active');
        } else {
            beatCard.classList.remove('complete');
            beatBadge.classList.remove('active');
        }
    }

    const partnerArea = document.getElementById('partner-area');
    if (partnerArea) {
        if (gameData.rushOwned || gameData.beatOwned) {
            partnerArea.classList.add('active');
        } else {
            partnerArea.classList.remove('active');
        }
    }

    const rushImg = document.getElementById('rush-img');

if (rushImg) {
    rushImg.style.display = gameData.rushOwned ? 'block' : 'none';
}

    if (beatArea) {
        if (gameData.beatOwned) beatArea.classList.add('active');
        else beatArea.classList.remove('active');
    }

    const rushUpgrade = document.querySelector('.rush-upgrade');
    if (rushUpgrade) {
        if (gameData.rushOwned) rushUpgrade.classList.add('active');
        else rushUpgrade.classList.remove('active');
    }

    const partnerUpgrade = document.querySelector('.partner-upgrade');
    if (partnerUpgrade) {
        if (gameData.beatOwned) partnerUpgrade.classList.add('active');
        else partnerUpgrade.classList.remove('active');
    }
}

function setButtonActive(button, isActive) {
    if (!button) return;

    if (isActive) button.classList.add('active');
    else button.classList.remove('active');
}

function saveData() {
    localStorage.setItem('rockmanSave', JSON.stringify(gameData));
}

function resetGame() {
    if (confirm("초기화 하시겠습니까?")) {
        localStorage.clear();
        location.reload();
    }
}

function devCheat() {
    gameData.screws += 100000;
    gameData.crystals += 1000;

    updateUI();
    saveData();

    alert("DEV 치트 적용됨");
}

updateUI();
startAutoAttack();
startChase();