const defaultData = { 
    screws: 0,
    crystals: 0,
    superRockGem: 0,

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

    partnerAtkSpeedLevel: 0,

    bluesFragments: 0,
    bluesOwned: false,

    forteFragments: 0,
    forteOwned: false,

    xFragments: 0,
    xOwned: false,

    // 추후 추가될 버스터형 파트너용 기본값
    exeRockmanOwned: false,

    partnerAtkSpd: 2000,

    // 동료 공격력 싱크로율(%) - 록맨 버스터 공격력 기준
    partnerSync: {
        forte: 10,
        x: 10,
        exeRockman: 10
    },

    partnerSyncStart10Migrated: true,

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
    costs: { ...defaultData.costs, ...(savedData.costs || {}) },
    partnerSync: { ...defaultData.partnerSync, ...(savedData.partnerSync || {}) }
};

if (savedData.partnerFragments && !savedData.rushFragments) {
    gameData.rushFragments = savedData.partnerFragments;
}

if (savedData.gold && !savedData.screws) {
    gameData.screws = Math.floor(savedData.gold);
}

gameData.screws = Math.floor(gameData.screws || 0);
gameData.crystals = Math.floor(gameData.crystals || 0);
gameData.superRockGem = Math.floor(gameData.superRockGem || 0);
gameData.rushFragments = Math.floor(gameData.rushFragments || 0);
gameData.beatFragments = Math.floor(gameData.beatFragments || 0);
gameData.rushOwned = gameData.rushOwned || false;
gameData.beatOwned = gameData.beatOwned || false;
gameData.bluesFragments = Math.floor(gameData.bluesFragments || 0);
gameData.bluesOwned = gameData.bluesOwned || false;
gameData.forteFragments = Math.floor(gameData.forteFragments || 0);
gameData.forteOwned = gameData.forteOwned || false;
gameData.xFragments = Math.floor(gameData.xFragments || 0);
gameData.xOwned = gameData.xOwned || false;
gameData.exeRockmanOwned = gameData.exeRockmanOwned || false;
gameData.partnerAtkSpd = gameData.partnerAtkSpd || 2000;
gameData.partnerSync = { ...defaultData.partnerSync, ...(gameData.partnerSync || {}) };
Object.keys(defaultData.partnerSync).forEach(key => {
    const baseValue = defaultData.partnerSync[key];
    gameData.partnerSync[key] = Math.max(0, Math.min(100, Math.floor(gameData.partnerSync[key] ?? baseValue)));
});

// 이전 빌드에서 잘못 저장된 시작 싱크로율(포르테 75%, X/EXE 60%)을 한 번만 10%로 보정
if (!savedData.partnerSyncStart10Migrated) {
    gameData.partnerSync = { ...defaultData.partnerSync };
    gameData.partnerSyncStart10Migrated = true;
    localStorage.setItem("rockmanSave", JSON.stringify(gameData));
}

gameData.playerHp = gameData.playerMaxHp;

Object.keys(gameData.costs).forEach(key => {
    gameData.costs[key] = Math.floor(gameData.costs[key]);
});

const RUSH_REQUIRED_FRAGMENTS = 100;
const BEAT_REQUIRED_FRAGMENTS = 100;
const BLUES_REQUIRED_FRAGMENTS = 100;
const FORTE_REQUIRED_FRAGMENTS = 100;
const X_REQUIRED_FRAGMENTS = 100;
const ENEMY_START_X = 460;
const BOSS_START_X = 380; // 보스 등장 시작 위치: 숫자가 작을수록 왼쪽
const ENEMY_ATTACK_X = 120;

const PARTNER_ATTACK_DATA = {
    forte: {
        name: '포르테',
        ownedKey: 'forteOwned',
        syncKey: 'forte',
        defaultSync: 10,
        areaId: 'forte-area',
        imgId: 'forte-img',
        bulletClass: 'partner-bullet forte-bullet',
        chargeBulletClass: 'partner-bullet forte-charge-bullet',
        chargeEffectClass: 'partner-charge-effect forte-charge-effect',
        attackFrame: 'sprites/partner/forte/forte_03.png',
        idleFrame: 'sprites/partner/forte/forte_01.png',
        busterOffsetX: 20,
        busterOffsetY: 35,
        shotDuration: 260
    },
    x: {
        name: '엑스',
        ownedKey: 'xOwned',
        syncKey: 'x',
        defaultSync: 10,
        areaId: 'x-area',
        imgId: 'x-img',
        bulletClass: 'partner-bullet x-bullet',
        chargeBulletClass: 'partner-bullet x-charge-bullet',
        chargeEffectClass: 'partner-charge-effect x-charge-effect',
        attackFrame: 'sprites/partner/x/x_03.png',
        idleFrame: 'sprites/partner/x/x_01.png',
        busterOffsetX: 23,
        busterOffsetY: 32,
        shotDuration: 250
    },
    exeRockman: {
        name: '록맨.EXE',
        ownedKey: 'exeRockmanOwned',
        syncKey: 'exeRockman',
        defaultSync: 10
    }
};


let enemyMaxHp = 1000;
let enemyHp = 1000;
let enemyX = ENEMY_START_X;
let enemySpeed = 0.35;
let enemyAtk = 5;

let attackTimer = null;
let chaseTimer = null;
let enemyDead = false;
let enemyAttacking = false;
let enemyStunned = false;
let playerDead = false;
let isBossBattle = false;
let currentBossType = null;

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

let bluesFrame = 6;
let bluesAttackTimer = null;
let bluesAttacking = false;

let forteFramePattern = [1, 2, 3, 2];
let forteFrameIndex = 0;
let forteJoinTimer = null;
let forteAttackTimer = null;
let forteAttacking = false;

const xFramePattern = [1, 2, 3, 2];
let xFrameIndex = 0;
let xJoinTimer = null;
let xAttackTimer = null;
let xAttacking = false;

setupStage();

function setupStage() {
    const s = gameData.stage;

    enemyMaxHp = Math.floor((120 + s * 75 + Math.pow(s, 1.35) * 25) * 0.33);
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

const enemyImg = document.getElementById('enemy-img');
if (enemyImg) {
    enemyImg.style.width = '';
    enemyImg.style.height = '';
    enemyImg.style.transform = '';
    enemyImg.style.marginTop = '18px';

    // 🔴 추가
    enemyImg.classList.remove('boss-enter');
}

const enemyArea = document.getElementById('enemy-area');
if (enemyArea) {
  enemyArea.classList.remove('boss-enter-area');
  enemyArea.style.bottom = '19px';
}

const screen = document.querySelector('.game-screen');
if (screen) {
    screen.classList.remove('boss-mode');
}

isBossBattle = false;
currentBossType = null;

    updateEnemyPosition();
}

function animate() {
    const rImg = document.getElementById('rockman-img');
    const eImg = document.getElementById('enemy-img');

    if (!rImg || !eImg) return;

    rockFrame += rockDir;
    if (rockFrame === 3 || rockFrame === 1) rockDir *= -1;
    rImg.src = `sprites/rock/rock_0${rockFrame}.png`;

    if (!enemyDead && !isBossBattle) {
        metFrame = (metFrame % 2) + 1;
        eImg.src = `sprites/enemy/met/met_0${metFrame}.png`;
    }

    animateRush();
    animateBeat();
    animateBlues();
    animateForte();
    animateX();
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

function animateBlues() {
  const bluesImg = document.getElementById('blues-img');
  if (!bluesImg || !gameData.bluesOwned || bluesAttacking) return;

  bluesFrame++;
  if (bluesFrame > 9) bluesFrame = 6;

  bluesImg.src = `sprites/partner/blues/blues_0${bluesFrame}.png`;
}

function animateForte() {
  const forteImg = document.getElementById('forte-img');
  if (!forteImg || !gameData.forteOwned) return;

  const frame = forteFramePattern[forteFrameIndex];
  forteImg.src = `sprites/partner/forte/forte_0${frame}.png`;

  forteFrameIndex = (forteFrameIndex + 1) % forteFramePattern.length;
}

function animateX() {
  const xImg = document.getElementById('x-img');
  if (!xImg || !gameData.xOwned) return;

  const frame = xFramePattern[xFrameIndex];
  xImg.src = `sprites/partner/x/x_0${frame}.png`;

  xFrameIndex = (xFrameIndex + 1) % xFramePattern.length;
}

const PARTNER_SYNC_UPGRADE_COST = 30;
const PARTNER_SYNC_UPGRADE_MIN_GAIN = 2;
const PARTNER_SYNC_UPGRADE_MAX_GAIN = 10;

function getPartnerSyncPercent(type) {
    const data = PARTNER_ATTACK_DATA[type];
    if (!data) return 0;

    const key = data.syncKey || type;
    const value = gameData.partnerSync?.[key];
    return Math.max(0, Math.min(100, Math.floor(value ?? data.defaultSync ?? 0)));
}

function getPartnerSyncChance(type) {
    const sync = getPartnerSyncPercent(type);

    // 싱크로율이 낮을 때는 높고, 올라갈수록 점차 낮아지는 확률
    return Math.max(5, Math.min(90, Math.floor(90 - (sync * 0.75))));
}

function getPartnerDamage(type) {
    const data = PARTNER_ATTACK_DATA[type];
    if (!data) return 0;

    const sync = getPartnerSyncPercent(type) / 100;
    return Math.max(1, Math.floor(gameData.atk * sync));
}

function togglePartnerAttackUpgrade() {
    const panel = document.getElementById('partner-attack-upgrade-panel');
    const header = document.getElementById('partner-attack-upgrade-header');
    if (!panel) return;

    panel.classList.toggle('active');
    if (header) header.classList.toggle('active', panel.classList.contains('active'));
    updateUI();
}

function upgradePartnerSync(type) {
    const data = PARTNER_ATTACK_DATA[type];
    if (!data) return;
    if (!gameData[data.ownedKey]) return;
    if (gameData.crystals < PARTNER_SYNC_UPGRADE_COST) return;

    const syncKey = data.syncKey || type;
    const currentSync = getPartnerSyncPercent(type);
    if (currentSync >= 100) return;

    gameData.crystals -= PARTNER_SYNC_UPGRADE_COST;

    const chance = getPartnerSyncChance(type);
    const success = Math.random() * 100 < chance;

    if (success) {
        const gain = Math.floor(
            Math.random() * (PARTNER_SYNC_UPGRADE_MAX_GAIN - PARTNER_SYNC_UPGRADE_MIN_GAIN + 1)
        ) + PARTNER_SYNC_UPGRADE_MIN_GAIN;

        gameData.partnerSync[syncKey] = Math.min(100, currentSync + gain);
        showPartnerUpgradeResult(`${data.name} 싱크로 +${Math.min(gain, 100 - currentSync)}%`);
    } else {
        showPartnerUpgradeResult('강화 실패');
    }

    updateUI();
    saveData();
}

function showPartnerUpgradeResult(message) {
    const result = document.getElementById('partner-upgrade-result');
    if (!result) return;

    result.innerText = message;
    result.classList.remove('active');
    void result.offsetWidth;
    result.classList.add('active');

    setTimeout(() => {
        result.classList.remove('active');
    }, 900);
}

function startBluesAttack() {
  if (bluesAttackTimer) clearInterval(bluesAttackTimer);

  bluesAttackTimer = setInterval(() => {
    if (!gameData.bluesOwned || enemyDead || playerDead || bluesAttacking) return;

    if (enemyX > 180) return;

    bluesShieldCharge();
  }, gameData.partnerAtkSpd);
}

function bluesShieldCharge() {
  const bluesArea = document.getElementById('blues-area');
  const bluesImg = document.getElementById('blues-img');
  const enemy = document.getElementById('enemy-img');

  if (!bluesArea || !bluesImg || !enemy) return;

  bluesAttacking = true;
  let frame = 1;

  bluesArea.classList.add('blues-charge');

  const chargeAnim = setInterval(() => {
    bluesImg.src = `sprites/partner/blues/blues_0${frame}.png`;
    frame++;

    if (frame > 5) {
      clearInterval(chargeAnim);

      const damage = Math.floor(gameData.atk * 1.8);
      enemyHp -= damage;

      showDamageText(damage, false);
      playEnemyHit(enemy);

// 🔴 넉백 확률 적용
const knockbackChance = 0.65;

if (Math.random() < knockbackChance) {

  // 넉백 성공
  enemyX += 18;
  if (enemyX > ENEMY_START_X) enemyX = ENEMY_START_X;
  updateEnemyPosition();

enemyStunned = true;
enemy.classList.add('enemy-stunned');

setTimeout(() => {
  enemyStunned = false;
  enemy.classList.remove('enemy-stunned');
}, 500);

} else {

  // ❌ 넉백 실패 표시
  showDamageText("MISS", false);

}

      // 🔴 스턴 0.5초
      enemyStunned = true;

      setTimeout(() => {
        enemyStunned = false;
      }, 500);

      if (enemyHp <= 0) {
        killEnemy();
      }

      updateUI();
      saveData();

      setTimeout(() => {
        bluesArea.classList.remove('blues-charge');
        bluesFrame = 6;
        bluesImg.src = `sprites/partner/blues/blues_06.png`;
        bluesAttacking = false;
      }, 250);
    }
  }, 90);
}

function startForteAttack() {
  if (forteAttackTimer) clearInterval(forteAttackTimer);

  forteAttackTimer = setInterval(() => {
    if (!gameData.forteOwned || enemyDead || playerDead || forteAttacking) return;

    firePartnerBuster('forte');
  }, gameData.partnerAtkSpd);
}

function startXAttack() {
  if (xAttackTimer) clearInterval(xAttackTimer);

  xAttackTimer = setInterval(() => {
    if (!gameData.xOwned || enemyDead || playerDead || xAttacking) return;

    firePartnerBuster('x');
  }, gameData.partnerAtkSpd);
}

function getPartnerBusterPosition(type) {
    const data = PARTNER_ATTACK_DATA[type];
    const screen = document.querySelector('.game-screen');
    const img = document.getElementById(data?.imgId);

    if (!data || !screen || !img) return null;

    const screenRect = screen.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    return {
        x: imgRect.left - screenRect.left + data.busterOffsetX,
        y: screenRect.bottom - imgRect.top - data.busterOffsetY
    };
}

function firePartnerBuster(type) {
    const data = PARTNER_ATTACK_DATA[type];
    const screen = document.querySelector('.game-screen');
    const enemy = document.getElementById('enemy-img');

    if (!data || !screen || !enemy) return;

    // 공격 중복만 막고, 스프라이트 프레임은 건드리지 않습니다.
    // img.src를 공격/대기 프레임으로 바꾸면 발사 타이밍마다 애니메이션이 멈칫거립니다.
    if (type === 'forte') forteAttacking = true;
    if (type === 'x') xAttacking = true;

    const isChargeShot = Math.random() * 100 < gameData.critChance;
    const pos = getPartnerBusterPosition(type);
    if (!pos) {
        if (type === 'forte') forteAttacking = false;
        if (type === 'x') xAttacking = false;
        return;
    }

    const finishAttack = () => {
        if (type === 'forte') forteAttacking = false;
        if (type === 'x') xAttacking = false;
    };

    const shoot = () => {
        const bullet = document.createElement('div');
        bullet.className = isChargeShot ? (data.chargeBulletClass || data.bulletClass) : data.bulletClass;
        bullet.style.left = pos.x + 'px';
        bullet.style.bottom = pos.y + 'px';
        screen.appendChild(bullet);

        const travel = getBulletTravel(pos.x);
        const duration = isChargeShot ? Math.max(150, data.shotDuration - 90) : data.shotDuration;

        bullet.animate(
            [{ transform: 'translateX(0)' }, { transform: `translateX(${travel}px)` }],
            { duration, easing: 'linear' }
        );

        setTimeout(() => {
            if (!enemyDead && !playerDead) {
                applyPartnerDamage(type, isChargeShot);
                if (!enemyDead) playEnemyHit(enemy);
            }

            bullet.remove();
            finishAttack();
        }, duration);
    };

    if (isChargeShot) {
        const charge = document.createElement('div');
        charge.className = data.chargeEffectClass || 'partner-charge-effect';
        charge.style.left = (pos.x - 8) + 'px';
        charge.style.bottom = (pos.y - 8) + 'px';
        screen.appendChild(charge);

        setTimeout(() => {
            charge.remove();
            shoot();
        }, 110);
    } else {
        shoot();
    }
}

function applyPartnerDamage(type, isChargeShot = false) {
    if (enemyDead || playerDead) return;

    let damage = getPartnerDamage(type);
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

setInterval(animate, 200);

function startChase() {
    if (chaseTimer) clearInterval(chaseTimer);

    chaseTimer = setInterval(() => {
        if (enemyDead || playerDead || enemyStunned) return;

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

    if (isBossBattle && currentBossType === 'super-rboss') {
        const rewardGem = 1;
        gameData.superRockGem += rewardGem;

        playEnemyDeathEffect();
        showRewardText(`+${rewardGem}🔴`);

        setTimeout(() => {
            setupStage();
            showStageText("BOSS CLEAR");
            updateUI();
            saveData();
        }, 500);

        return;
    }

    const reward = Math.floor(80 + gameData.stage * 20) * 1.3);
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
        dmg.innerText = `${damage}`;
    } else {
        dmg.innerText = damage;
    }

    dmg.style.left = enemyX + "px";
    dmg.style.right = "auto";
    dmg.style.bottom = "38px";

    screen.appendChild(dmg);
    setTimeout(() => dmg.remove(), 1200);
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

    if (typeof reward === 'string') {
        text.innerText = reward;
    } else {
        text.innerText = `+${reward}🔩`;
    }

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
                startBluesAttack();
                startForteAttack();
                startXAttack();
            }
        }
        gameData.costs[type] = getNextCost(type, gameData.costs[type]);
    }

    updateUI();
    saveData();
}

function upgradePartnerAttackSpeed() {
  const cost = 50 + (gameData.partnerAtkSpeedLevel * 50);

  if (gameData.crystals < cost) return;

  gameData.crystals -= cost;
  gameData.partnerAtkSpeedLevel++;

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

function buyBluesFragment(amount) {
  if (gameData.bluesOwned) return;
  if (gameData.crystals < amount) return;

  gameData.crystals -= amount;
  gameData.bluesFragments += amount;

  if (gameData.bluesFragments > BLUES_REQUIRED_FRAGMENTS) {
    gameData.bluesFragments = BLUES_REQUIRED_FRAGMENTS;
  }

  updateUI();
  saveData();
}

function buyForteFragment(amount) {
  if (gameData.forteOwned) return;
  if (gameData.crystals < amount) return;

  gameData.crystals -= amount;
  gameData.forteFragments += amount;

  if (gameData.forteFragments > FORTE_REQUIRED_FRAGMENTS) {
    gameData.forteFragments = FORTE_REQUIRED_FRAGMENTS;
  }

  updateUI();
  saveData();
}

function buyXFragment(amount) {
  if (gameData.xOwned) return;
  if (gameData.crystals < amount) return;

  gameData.crystals -= amount;
  gameData.xFragments += amount;

  if (gameData.xFragments > X_REQUIRED_FRAGMENTS) {
    gameData.xFragments = X_REQUIRED_FRAGMENTS;
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
        beatImg.style.display = 'none';

        const box = document.querySelector('.summon-box');
        if (box) box.appendChild(beatImg);
    }

    if (type === 'rush') {
        text.innerText = 'RUSH JOIN!';
        rushImg.src = 'sprites/partner/rush/rush_02.png';
        rushImg.style.display = 'block';
        beatImg.style.display = 'none';
    }

    if (type === 'beat') {
        text.innerText = 'BEAT JOIN!';
        rushImg.style.display = 'none';
        beatImg.src = 'sprites/partner/beat/beat_01.png';
        beatImg.style.display = 'block';
    }

    if (type === 'blues') {
        text.innerText = 'BLUES JOIN!';
        rushImg.style.display = 'none';
        beatImg.src = 'sprites/partner/blues/blues_06.png';
        beatImg.style.display = 'block';
    }

    if (type === 'forte') {
        text.innerText = 'FORTE JOIN!';
        rushImg.style.display = 'none';
        beatImg.src = 'sprites/partner/forte/forte_01.png';
        beatImg.style.setProperty('width', '54px', 'important');
        beatImg.style.setProperty('height', '54px', 'important');
        beatImg.style.display = 'block';
    }

    if (type === 'x') {
        text.innerText = 'X JOIN!';
        rushImg.style.display = 'none';
        beatImg.src = 'sprites/partner/x/x_join_01.png';
        beatImg.style.setProperty('width', '54px', 'important');
        beatImg.style.setProperty('height', '54px', 'important');
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
    rushImg.src = `sprites/partner/rush/rush_01.png`;

rushImg.classList.remove('join-drop');
void rushImg.offsetWidth;
rushImg.classList.add('join-drop');

    if (rushJoinTimer) clearInterval(rushJoinTimer);

    rushJoinTimer = setInterval(() => {
        rushJoinFrame++;

        if (rushJoinFrame <= 3) {
            rushImg.src = `sprites/partner/rush/rush_join_0${rushJoinFrame}.png`;
        } else {
            clearInterval(rushJoinTimer);
            rushJoinTimer = null;
            rushImg.classList.remove('join-drop');
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

    const { beatImg } = popupData;

    beatFrame = 1;
    beatDir = 1;
    beatFloat = 0;

    beatImg.src = 'sprites/partner/beat/beat_01.png';
    beatImg.style.setProperty('width', '28px', 'important');
    beatImg.style.setProperty('height', '28px', 'important');

    beatImg.classList.remove('rush-drop');
    void beatImg.offsetWidth;
    beatImg.classList.add('rush-drop');

    if (beatJoinTimer) clearInterval(beatJoinTimer);

    beatJoinTimer = setInterval(() => {
        beatFrame += beatDir;

        if (beatFrame >= 3) beatDir = -1;
        if (beatFrame <= 1) beatDir = 1;

        beatFloat += 1;
        beatImg.src = `sprites/partner/beat/beat_0${beatFrame}.png`;
        beatImg.style.transform = `translateX(-50%) translateY(${Math.sin(beatFloat / 2) * 4}px)`;
    }, 120);

    setTimeout(() => {
        closeSummonPopup();
        updateUI();
        saveData();
    }, 1800);
}

function summonBlues() {
    if (gameData.bluesOwned) return;
    if (gameData.bluesFragments < BLUES_REQUIRED_FRAGMENTS) return;

    gameData.bluesOwned = true;

    const popupData = prepareSummonPopup('blues');
    if (!popupData) {
        updateUI();
        saveData();
        return;
    }

    const { beatImg } = popupData;

let bluesJoinFrame = 6;
let bluesJoinDir = 1;
let bluesJoinFloat = 0;

beatImg.src = 'sprites/partner/blues/blues_06.png';
    beatImg.classList.remove('rush-drop');
    void beatImg.offsetWidth;
    beatImg.classList.add('rush-drop');

    if (beatJoinTimer) clearInterval(beatJoinTimer);

    beatJoinTimer = setInterval(() => {
bluesJoinFrame += bluesJoinDir;

if (bluesJoinFrame >= 9) bluesJoinDir = -1;
if (bluesJoinFrame <= 6) bluesJoinDir = 1;

bluesJoinFloat += 1;
beatImg.src = `sprites/partner/blues/blues_0${bluesJoinFrame}.png`;
beatImg.style.transform = `translateY(${Math.sin(bluesJoinFloat / 2) * 4}px)`;
    }, 120);

    setTimeout(() => {
        closeSummonPopup();
        updateUI();
        saveData();
    }, 1800);
}

function summonForte() {
    if (gameData.forteOwned) return;
    if (gameData.forteFragments < FORTE_REQUIRED_FRAGMENTS) return;

    gameData.forteOwned = true;

    const popupData = prepareSummonPopup('forte');
    if (!popupData) {
        updateUI();
        saveData();
        return;
    }

    const { beatImg } = popupData;

    let forteJoinFrame = 1;

    beatImg.src = 'sprites/partner/forte/forte_join_01.png';
    beatImg.classList.remove('rush-drop');
    beatImg.classList.remove('join-drop');

    if (forteJoinTimer) clearInterval(forteJoinTimer);

    forteJoinTimer = setInterval(() => {
        forteJoinFrame++;

        if (forteJoinFrame <= 8) {
            beatImg.src = `sprites/partner/forte/forte_join_0${forteJoinFrame}.png`;
        } else {
            clearInterval(forteJoinTimer);
            forteJoinTimer = null;

            beatImg.src = 'sprites/partner/forte/forte_join_08.png';
        }
    }, 120);

    setTimeout(() => {
        closeSummonPopup();
        updateUI();
        saveData();
    }, 1600);
}

function summonX() {
    if (gameData.xOwned) return;
    if (gameData.xFragments < X_REQUIRED_FRAGMENTS) return;

    gameData.xOwned = true;

    const popupData = prepareSummonPopup('x');
    if (!popupData) {
        updateUI();
        saveData();
        return;
    }

    const { beatImg } = popupData;

    const xJoinPattern = [1, 2, 3, 2];
    let xJoinIndex = 0;

    beatImg.src = 'sprites/partner/x/x_join_01.png';
    beatImg.style.setProperty('width', '54px', 'important');
    beatImg.style.setProperty('height', '54px', 'important');
    beatImg.classList.remove('rush-drop', 'join-drop');

    if (xJoinTimer) clearInterval(xJoinTimer);

    xJoinTimer = setInterval(() => {
        const frame = xJoinPattern[xJoinIndex];
        beatImg.src = `sprites/partner/x/x_join_0${frame}.png`;
        xJoinIndex = (xJoinIndex + 1) % xJoinPattern.length;
    }, 160);

    setTimeout(() => {
        closeSummonPopup();
        updateUI();
        saveData();
    }, 1800);
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

    if (xJoinTimer) {
        clearInterval(xJoinTimer);
        xJoinTimer = null;
    }

if (rushJoinImg) {
    rushJoinImg.classList.remove('rush-drop');
    rushJoinImg.src = `sprites/partner/rush/rush_01.png`;
    rushJoinImg.style.display = 'block';
}

if (beatJoinImg) {
    beatJoinImg.src = `sprites/partner/beat/beat_01.png`;
    beatJoinImg.style.width = '';
    beatJoinImg.style.height = '';
    beatJoinImg.style.transform = 'translateX(-50%)';
    beatJoinImg.style.display = 'none';
}

    if (beatJoinImg) {
    beatJoinImg.classList.remove('join-drop');
    beatJoinImg.src = `sprites/partner/beat/beat_01.png`;
    beatJoinImg.style.display = 'none';
}

    showTab('battle');
    updateUI();
}

function togglePartnerUpgrade(type) {
    const panel = document.getElementById(`${type}-upgrade-panel`);
    if (!panel) return;

    panel.classList.toggle('active');
    updateUI();
}

function showTab(tabName) {
    ['battle', 'partner', 'armor', 'boss'].forEach(name => {
        const tab = document.getElementById(name + '-tab');
        const btn = document.getElementById(name + '-tab-btn');

        if (tab) tab.classList.remove('active');
        if (btn) btn.classList.remove('active');
    });

    const targetTab = document.getElementById(tabName + '-tab');
    const targetBtn = document.getElementById(tabName + '-tab-btn');

    if (targetTab) targetTab.classList.add('active');
    if (targetBtn) targetBtn.classList.add('active');
}

function showArmorTab(type) {
    const armorImg = document.getElementById('armor-img');
    const armorName = document.getElementById('armor-name');

    const armorData = {
        'super-r': { name: '슈퍼록맨', img: 'sprites/armor/super-r/super-r.png' },
        'first': { name: '퍼스트아머', img: 'sprites/armor/super-r/super-r.png' },
        'second': { name: '세컨드아머', img: 'sprites/armor/super-r/super-r.png' },
        'third': { name: '서드아머', img: 'sprites/armor/super-r/super-r.png' },
        'fourth': { name: '포스아머', img: 'sprites/armor/super-r/super-r.png' }
    };

    if (!armorData[type]) return;

    armorImg.src = armorData[type].img;
    armorName.innerText = armorData[type].name;

    document.querySelectorAll('#armor-tab .inner-tab').forEach(btn => {
        btn.classList.remove('active');
    });

    if (event && event.target) {
        event.target.classList.add('active');
    }
}

function showBossTab(type) {
    const bossImg = document.getElementById('boss-img');
    const bossName = document.getElementById('boss-name');

    const bossData = {
        'super-rboss': { name: '슈퍼록맨 보스전', img: 'sprites/boss/super-rboss/super-rboss.png' },
        'first-boss': { name: '퍼스트 보스전', img: 'sprites/boss/super-rboss/super-rboss.png' },
        'second-boss': { name: '세컨드 보스전', img: 'sprites/boss/super-rboss/super-rboss.png' },
        'third-boss': { name: '서드 보스전', img: 'sprites/boss/super-rboss/super-rboss.png' },
        'fourth-boss': { name: '포스 보스전', img: 'sprites/boss/super-rboss/super-rboss.png' }
    };

    if (!bossData[type]) return;

    bossImg.src = bossData[type].img;
    bossName.innerText = bossData[type].name;

    document.querySelectorAll('#boss-tab .inner-tab').forEach(btn => {
        btn.classList.remove('active');
    });

    if (event && event.target) {
        event.target.classList.add('active');
    }
}

let isBossWarning = false;

function showBossWarning(callback) {
  const overlay = document.getElementById("bossWarningOverlay");
  const text = document.getElementById("bossWarningText");

  if (!overlay || !text) {
    if (callback) callback();
    return;
  }

  if (isBossWarning) return;
  isBossWarning = true;

  overlay.classList.add("active");
  text.classList.remove("flash");
  void text.offsetWidth;
  text.classList.add("flash");

  setTimeout(() => {
    overlay.classList.remove("active");
    text.classList.remove("flash");
    isBossWarning = false;
    if (callback) callback();
  }, 3000);
}

function enterBossBattle() {
  showTab('battle');

  showBossWarning(() => {

    isBossBattle = true;
    currentBossType = 'super-rboss';

    const screen = document.querySelector('.game-screen');
    if (screen) {
      screen.classList.add('boss-mode');
    }

    const enemyImg = document.getElementById('enemy-img');
    if (enemyImg) {
      enemyImg.src = 'sprites/boss/super-rboss/super-rboss.png';
      enemyImg.style.width = '60px';
      enemyImg.style.height = '60px';
      enemyImg.style.marginTop = '-15px';
    }

    const enemyArea = document.getElementById('enemy-area');
    if (enemyArea) {
      enemyArea.classList.remove('boss-enter-area');
      void enemyArea.offsetWidth;
      enemyArea.classList.add('boss-enter-area');
    }

    enemyMaxHp = 5000;
    enemyHp = enemyMaxHp;
    enemyAtk = 20;
    enemySpeed = 0.18;
    enemyX = BOSS_START_X;

    enemyDead = false;
    enemyAttacking = false;
    playerDead = false;

    updateEnemyPosition();
    updateUI();

  });
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
const bluesFragmentsEl = document.getElementById('blues-fragments');
if (bluesFragmentsEl) bluesFragmentsEl.innerText = gameData.bluesFragments;

setButtonActive(document.getElementById('blues-buy1'), !gameData.bluesOwned && gameData.crystals >= 1 && gameData.bluesFragments < 100);
setButtonActive(document.getElementById('blues-buy10'), !gameData.bluesOwned && gameData.crystals >= 10 && gameData.bluesFragments <= 90);
setButtonActive(document.getElementById('blues-buy100'), !gameData.bluesOwned && gameData.crystals >= 100 && gameData.bluesFragments === 0);
setButtonActive(document.getElementById('blues-summon-btn'), !gameData.bluesOwned && gameData.bluesFragments >= 100);

const forteFragmentsEl = document.getElementById('forte-fragments');
if (forteFragmentsEl) forteFragmentsEl.innerText = gameData.forteFragments;

setButtonActive(document.getElementById('forte-buy1'), !gameData.forteOwned && gameData.crystals >= 1 && gameData.forteFragments < 100);
setButtonActive(document.getElementById('forte-buy10'), !gameData.forteOwned && gameData.crystals >= 10 && gameData.forteFragments <= 90);
setButtonActive(document.getElementById('forte-buy100'), !gameData.forteOwned && gameData.crystals >= 100 && gameData.forteFragments === 0);
setButtonActive(document.getElementById('forte-summon-btn'), !gameData.forteOwned && gameData.forteFragments >= 100);

const xFragmentsEl = document.getElementById('x-fragments');
if (xFragmentsEl) xFragmentsEl.innerText = gameData.xFragments;

setButtonActive(document.getElementById('x-buy1'), !gameData.xOwned && gameData.crystals >= 1 && gameData.xFragments < 100);
setButtonActive(document.getElementById('x-buy10'), !gameData.xOwned && gameData.crystals >= 10 && gameData.xFragments <= 90);
setButtonActive(document.getElementById('x-buy100'), !gameData.xOwned && gameData.crystals >= 100 && gameData.xFragments === 0);
setButtonActive(document.getElementById('x-summon-btn'), !gameData.xOwned && gameData.xFragments >= 100);

    const beatCard = document.getElementById('beat-card');
    const beatBadge = document.getElementById('beat-complete-badge');
    const beatArea = document.getElementById('beat-area');
const bluesCard = document.getElementById('blues-card');
const bluesBadge = document.getElementById('blues-complete-badge');

if (bluesCard && bluesBadge) {
  if (gameData.bluesOwned) {
    bluesCard.classList.add('complete');
    bluesBadge.classList.add('active');
  } else {
    bluesCard.classList.remove('complete');
    bluesBadge.classList.remove('active');
  }
}

const forteCard = document.getElementById('forte-card');
const forteBadge = document.getElementById('forte-complete-badge');

if (forteCard && forteBadge) {
  if (gameData.forteOwned) {
    forteCard.classList.add('complete');
    forteBadge.classList.add('active');
  } else {
    forteCard.classList.remove('complete');
    forteBadge.classList.remove('active');
  }
}

const xCard = document.getElementById('x-card');
const xBadge = document.getElementById('x-complete-badge');

if (xCard && xBadge) {
  if (gameData.xOwned) {
    xCard.classList.add('complete');
    xBadge.classList.add('active');
  } else {
    xCard.classList.remove('complete');
    xBadge.classList.remove('active');
  }
}

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

    const bluesArea = document.getElementById('blues-area');
const bluesImg = document.getElementById('blues-img');

if (bluesArea) {
  if (gameData.bluesOwned) bluesArea.classList.add('active');
  else bluesArea.classList.remove('active');
}

if (bluesImg) {
  bluesImg.style.display = gameData.bluesOwned ? 'block' : 'none';
}

const forteArea = document.getElementById('forte-area');
const forteImg = document.getElementById('forte-img');

if (forteArea) {
  if (gameData.forteOwned) forteArea.classList.add('active');
  else forteArea.classList.remove('active');
}

if (forteImg) {
  forteImg.style.display = gameData.forteOwned ? 'block' : 'none';
}

const xArea = document.getElementById('x-area');
const xImg = document.getElementById('x-img');

if (xArea) {
  if (gameData.xOwned) xArea.classList.add('active');
  else xArea.classList.remove('active');
}

if (xImg) {
  xImg.style.display = gameData.xOwned ? 'block' : 'none';
}

    const rushUpgrade = document.querySelector('.rush-upgrade');
    if (rushUpgrade) {
        if (gameData.rushOwned) rushUpgrade.classList.add('active');
        else rushUpgrade.classList.remove('active');
    }

const partnerUpgrade = document.querySelector('.partner-upgrade');

if (partnerUpgrade) {
  if (gameData.beatOwned) {
    partnerUpgrade.classList.add('active');
  } else {
    partnerUpgrade.classList.remove('active');
  }
}
const forteUpgradeEls = document.querySelectorAll('.forte-upgrade');
forteUpgradeEls.forEach(el => {
  if (gameData.forteOwned) el.classList.add('owned');
  else el.classList.remove('owned', 'active');
});

updatePartnerAttackUpgradeUI();

const superRockGemEls = document.querySelectorAll('.super-rock-gem-count');
superRockGemEls.forEach(el => {
    el.innerText = Math.floor(gameData.superRockGem || 0).toLocaleString();
});

}


function hasOwnedBusterPartner() {
    return Object.values(PARTNER_ATTACK_DATA).some(data => gameData[data.ownedKey]);
}

function updatePartnerAttackUpgradeUI() {
    const box = document.querySelector('.partner-attack-upgrade-box');
    const panel = document.getElementById('partner-attack-upgrade-panel');
    const header = document.getElementById('partner-attack-upgrade-header');
    const hasOwnedPartner = hasOwnedBusterPartner();

    if (box) {
        box.classList.toggle('visible', hasOwnedPartner);
    }

    if (!hasOwnedPartner) {
        if (panel) panel.classList.remove('active');
        if (header) header.classList.remove('active');
    }

    Object.keys(PARTNER_ATTACK_DATA).forEach(type => {
        const data = PARTNER_ATTACK_DATA[type];
        const row = document.getElementById(`${type}-sync-row`);
        const percent = document.getElementById(`${type}-sync-percent`);
        const gauge = document.getElementById(`${type}-sync-gauge-fill`);
        const chance = document.getElementById(`${type}-sync-chance`);
        const btn = document.getElementById(`${type}-sync-upgrade-btn`);

        const owned = !!gameData[data.ownedKey];
        const sync = getPartnerSyncPercent(type);
        const chanceValue = getPartnerSyncChance(type);

        if (percent) percent.innerText = `${sync}%`;
        if (gauge) gauge.style.width = `${sync}%`;
        if (chance) chance.innerText = `${chanceValue}%`;

        if (row) {
            row.classList.toggle('owned', owned);
        }

        setButtonActive(
            btn,
            owned && gameData.crystals >= PARTNER_SYNC_UPGRADE_COST && sync < 100
        );
    });
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
        localStorage.removeItem('rockmanSave');
        localStorage.clear();
        sessionStorage.clear();
        location.replace(location.pathname + '?reset=' + Date.now());
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
startBluesAttack();
startForteAttack();
startXAttack();
