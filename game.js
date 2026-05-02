const defaultData = { 
    screws: 0,
    crystals: 0,
    superRockGem: 0,
    stones: 0,

    minePickaxeOwned: false,
    minePickaxeTier: 0,
    minePickaxeFloorTier: 0,
    minePickaxeEnhance: 0,
    mineRockMaxHp: 80,
    mineRockHp: 80,

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

    zeroFragments: 0,
    zeroOwned: false,

    // 추후 추가될 버스터형 파트너용 기본값
    exeRockmanOwned: false,

    partnerAtkSpd: 2000,

    // 동료 공격력 싱크로율(%) - 록맨 버스터 공격력 기준
    partnerSync: {
        blues: 10,
        forte: 10,
        x: 10,
        zero: 10,
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
gameData.stones = Math.floor(gameData.stones || 0);
gameData.minePickaxeOwned = gameData.minePickaxeOwned || false;
gameData.minePickaxeTier = Math.max(0, Math.floor(gameData.minePickaxeTier || 0));
gameData.minePickaxeFloorTier = Math.max(0, Math.floor(gameData.minePickaxeFloorTier || 0));
if (gameData.minePickaxeTier < gameData.minePickaxeFloorTier) gameData.minePickaxeTier = gameData.minePickaxeFloorTier;
gameData.minePickaxeEnhance = Math.max(0, Math.floor(gameData.minePickaxeEnhance || 0));
gameData.mineRockMaxHp = Math.max(1, Math.floor(gameData.mineRockMaxHp || 80));
gameData.mineRockHp = Math.max(1, Math.floor(gameData.mineRockHp || gameData.mineRockMaxHp));
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
gameData.zeroFragments = Math.floor(gameData.zeroFragments || 0);
gameData.zeroOwned = gameData.zeroOwned || false;
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
const ZERO_REQUIRED_FRAGMENTS = 100;
const ENEMY_START_X = 460;
const BOSS_START_X = 380; // 보스 등장 시작 위치: 숫자가 작을수록 왼쪽
const ENEMY_ATTACK_X = 120;
const SNIPERJOE_START_X = 335;
// 스나이퍼 죠 위치 조정은 여기 숫자만 바꾸면 됩니다.
// 값이 커질수록 위로 올라가며, 현재는 록맨과 같은 높이 기준입니다.
const SNIPERJOE_BOTTOM = 20;
const MET_BOTTOM = 19;
const BOSS_BOTTOM = 24;
const SNIPERJOE_BUSTER_DAMAGE_RATE = 0.5;
const SNIPERJOE_DODGE_CHANCE = 0.10;

const ENEMY_TYPE_DATA = {
    met: {
        name: '멧톨',
        idleFrame: 'sprites/enemy/met/met_01.png'
    },
    sniperjoe: {
        name: '스나이퍼죠',
        idleFrame: 'sprites/enemy/sniperjoe/sniperjoe_01.png',
        attackFrames: [
            'sprites/enemy/sniperjoe/sniperjoe_02.png',
            'sprites/enemy/sniperjoe/sniperjoe_03.png'
        ],
        jumpFrame: 'sprites/enemy/sniperjoe/sniperjoe_04.png'
    }
};

const PARTNER_ATTACK_DATA = {
    blues: {
        name: '블루스',
        ownedKey: 'bluesOwned',
        syncKey: 'blues',
        defaultSync: 10,
        portrait: 'sprites/partner/blues/blues_portrait.png'
    },
    forte: {
        name: '포르테',
        ownedKey: 'forteOwned',
        syncKey: 'forte',
        defaultSync: 10,
        portrait: 'sprites/partner/forte/forte_portrait.png',
        areaId: 'forte-area',
        imgId: 'forte-img',
        bulletClass: 'partner-bullet forte-bullet',
        chargeBulletClass: 'partner-bullet forte-charge-bullet',
        chargeEffectClass: 'partner-charge-effect forte-charge-effect',
        chargeFramePrefix: 'sprites/partner/forte/forte_c_bullet_',
        chargeFrameCount: 5,
        chargeFrameInterval: 70,
        attackFrame: 'sprites/partner/forte/forte_03.png',
        idleFrame: 'sprites/partner/forte/forte_01.png',

        // 포르테 투사체 위치 조절부입니다.
        // 기준점: forte-img의 오른쪽 아래(bottom/right)를 기준으로 총구 중심을 잡습니다.
        // busterOffsetX: 작게 = 왼쪽, 크게 = 오른쪽
        // busterOffsetY: 작게 = 아래쪽, 크게 = 위쪽
        projectilePositionMode: 'muzzle-center',
        muzzleAnchorX: 'right',
        muzzleAnchorY: 'bottom',
        busterOffsetX: -15,
        busterOffsetY: 9,

        // 기본탄/차지탄은 크기가 달라도 같은 중심점에서 발사됩니다.
        bulletWidth: 54,
        bulletHeight: 36,
        chargeBulletWidth: 72,
        chargeBulletHeight: 48,
        chargeEffectWidth: 18,
        chargeEffectHeight: 18,
        chargeEffectOffsetX: 0,
        chargeEffectOffsetY: 0,

        shotDuration: 460,
        chargeShotDuration: 340
    },
    x: {
        name: '엑스',
        ownedKey: 'xOwned',
        syncKey: 'x',
        defaultSync: 10,
        portrait: 'sprites/partner/x/x_portrait.png',
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
    zero: {
        name: '제로',
        ownedKey: 'zeroOwned',
        syncKey: 'zero',
        defaultSync: 10,
        portrait: 'sprites/partner/zero/zero_portrait.png',
        areaId: 'zero-area',
        imgId: 'zero-img',
        idleFrame: 'sprites/partner/zero/zero_01.png',
        standFrame: 'sprites/partner/zero/zero_st.png',
        melee: true
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
let currentEnemyType = 'met';
let sniperJoeActionTimer = null;
let sniperJoeJumping = false;
let sniperJoeAttacking = false;

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
let bluesStandPattern = [1, 2, 3, 2];
let bluesStandIndex = 0;

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

const zeroFramePattern = [1, 2, 3, 2];
let zeroFrameIndex = 0;
let zeroJoinTimer = null;
let zeroAttackTimer = null;
let zeroAttacking = false;
const ZERO_ATTACK_INTERVAL_MULTIPLIER = 1.8;
const ZERO_ATTACK_TARGET_Y = 10;

let mineTimer = null;
let minerFrame = 1;
let mineAttackAnimating = false;
let mineEnhancing = false;

const BATTLE_TIPS = [
    'TIP. 스나이퍼 죠는 10스테이지마다 등장합니다.',
    'TIP. 스나이퍼 죠에게는 버스터 데미지가 반감됩니다.',
    'TIP. 광산은 일찍 개방할수록 좋아요.',
    'TIP. 크리스탈은 파트너 소환뿐만 아니라 여러 곳에 쓰입니다.',
    'TIP. 파트너를 소환하면 전투가 훨씬 수월해집니다.',
    'TIP. 동료들은 록맨과의 싱크로율에 따라 강해집니다.',
    'TIP. 보스전에서 다양한 아이템을 얻을 수 있습니다.',
    'TIP. 피켈맨의 야근수당은 연봉에 포함되어 있습니다.'
];
let battleTipIndex = 0;
let battleTipTimer = null;
let partnerSyncEnhancing = false;

setupStage();

function setupStage() {
    const s = gameData.stage;

    stopSniperJoeActions();

    currentEnemyType = getStageEnemyType(s);

    enemyMaxHp = Math.floor((120 + s * 75 + Math.pow(s, 1.35) * 25) * 0.66);
    enemySpeed = 0.22 + s * 0.025;
    enemyAtk = Math.floor(4 + s * 1.6);
    enemyX = ENEMY_START_X;

    if (currentEnemyType === 'sniperjoe') {
        enemyMaxHp = Math.floor(enemyMaxHp * 1.25);
        enemySpeed = 0;
        enemyAtk = Math.floor(enemyAtk * 1.15 + 4);
        enemyX = SNIPERJOE_START_X;
    }

    enemyHp = enemyMaxHp;

    gameData.playerMaxHp = Math.floor(100 + (gameData.lv.hp - 1) * 20);
    gameData.playerHp = gameData.playerMaxHp;

    enemyDead = false;
    enemyAttacking = false;
    enemyStunned = false;
    sniperJoeJumping = false;
    sniperJoeAttacking = false;
    playerDead = false;

    const rockman = document.getElementById('rockman-img');
    if (rockman) rockman.classList.remove('rockman-death-hide');

    const enemyImg = document.getElementById('enemy-img');
    if (enemyImg) {
        enemyImg.style.width = '';
        enemyImg.style.height = '';
        enemyImg.style.transform = '';
        enemyImg.style.marginTop = '18px';
        enemyImg.classList.remove('boss-enter');

        if (currentEnemyType === 'sniperjoe') {
            enemyImg.src = ENEMY_TYPE_DATA.sniperjoe.idleFrame;
            enemyImg.style.width = '44px';
            enemyImg.style.height = '44px';
            enemyImg.style.marginTop = '0px';
        } else {
            enemyImg.src = ENEMY_TYPE_DATA.met.idleFrame;
        }
    }

    const enemyArea = document.getElementById('enemy-area');
    if (enemyArea) {
        enemyArea.classList.remove('boss-enter-area', 'sniperjoe-enter-area', 'sniperjoe-area');
        if (currentEnemyType === 'sniperjoe') {
            enemyArea.classList.add('sniperjoe-area');
            enemyArea.style.setProperty('--sniperjoe-ground-bottom', `${SNIPERJOE_BOTTOM}px`);
            enemyArea.style.bottom = `${SNIPERJOE_BOTTOM}px`;
        } else {
            enemyArea.classList.remove('sniperjoe-area');
            enemyArea.style.removeProperty('--sniperjoe-ground-bottom');
            enemyArea.style.bottom = `${MET_BOTTOM}px`;
        }

        if (currentEnemyType === 'sniperjoe') {
            void enemyArea.offsetWidth;
            enemyArea.classList.add('sniperjoe-enter-area');
        }
    }

    const screen = document.querySelector('.game-screen');
    if (screen) {
        screen.classList.remove('boss-mode');
        screen.classList.toggle('sniperjoe-mode', currentEnemyType === 'sniperjoe');
    }

    const bg = document.getElementById('scroll-bg');
    if (bg) bg.classList.toggle('paused', currentEnemyType === 'sniperjoe');

    isBossBattle = false;
    currentBossType = null;

    updateEnemyPosition();
    applyStillBattleFrames();

    if (isSniperJoeBattle()) {
        setTimeout(() => {
            if (!enemyDead && !playerDead && isSniperJoeBattle()) {
                startSniperJoeActions();
            }
        }, 650);
    }
}

function getStageEnemyType(stage) {
    // 기존 멧톨과 새 스나이퍼죠를 번갈아 등장시킵니다.
    return stage % 10 === 0 ? 'sniperjoe' : 'met';
}

function isSniperJoeBattle() {
    return !isBossBattle && currentEnemyType === 'sniperjoe';
}

function applyStillBattleFrames() {
    if (!isSniperJoeBattle()) return;

    const rockman = document.getElementById('rockman-img');
    const rushImg = document.getElementById('rush-img');
    const forteImg = document.getElementById('forte-img');
    const xImg = document.getElementById('x-img');
    const zeroImg = document.getElementById('zero-img');

    if (rockman) rockman.src = 'sprites/rock/rock_st.png';
    if (rushImg && gameData.rushOwned) rushImg.src = 'sprites/partner/rush/rush_st.png';
    if (forteImg && gameData.forteOwned && !forteAttacking) forteImg.src = 'sprites/partner/forte/forte_st.png';
    if (xImg && gameData.xOwned && !xAttacking) xImg.src = 'sprites/partner/x/x_st.png';
    if (zeroImg && gameData.zeroOwned && !zeroAttacking) zeroImg.src = 'sprites/partner/zero/zero_st.png';
}

function stopSniperJoeActions() {
    if (sniperJoeActionTimer) {
        clearInterval(sniperJoeActionTimer);
        sniperJoeActionTimer = null;
    }
}

function startSniperJoeActions() {
    stopSniperJoeActions();
    if (!isSniperJoeBattle()) return;

    sniperJoeActionTimer = setInterval(() => {
        if (!isSniperJoeBattle() || enemyDead || playerDead || sniperJoeJumping || sniperJoeAttacking) return;

        if (Math.random() < 0.90) fireSniperJoeBullet();
        else playSniperJoeJump();
    }, 1650);
}

function playSniperJoeJump() {
    if (!isSniperJoeBattle() || enemyDead || playerDead || sniperJoeJumping) return;

    const enemyImg = document.getElementById('enemy-img');
    if (!enemyImg) return;

    sniperJoeJumping = true;
    enemyImg.src = ENEMY_TYPE_DATA.sniperjoe.jumpFrame;
    enemyImg.classList.remove('sniperjoe-jump');
    void enemyImg.offsetWidth;
    enemyImg.classList.add('sniperjoe-jump');

    setTimeout(() => {
        sniperJoeJumping = false;
        enemyImg.classList.remove('sniperjoe-jump');
        if (isSniperJoeBattle() && !enemyDead) enemyImg.src = ENEMY_TYPE_DATA.sniperjoe.idleFrame;
    }, 520);
}

function fireSniperJoeBullet() {
    if (!isSniperJoeBattle() || enemyDead || playerDead || sniperJoeAttacking) return;

    const screen = document.querySelector('.game-screen');
    const enemyImg = document.getElementById('enemy-img');
    const rockmanArea = document.getElementById('rockman-area');
    if (!screen || !enemyImg || !rockmanArea) return;

    sniperJoeAttacking = true;
    enemyImg.src = ENEMY_TYPE_DATA.sniperjoe.attackFrames[0];

    setTimeout(() => {
        if (!isSniperJoeBattle() || enemyDead || playerDead) {
            sniperJoeAttacking = false;
            return;
        }

        enemyImg.src = ENEMY_TYPE_DATA.sniperjoe.attackFrames[1];

        const screenRect = screen.getBoundingClientRect();
        const enemyRect = enemyImg.getBoundingClientRect();
        const rockRect = rockmanArea.getBoundingClientRect();

        const bullet = document.createElement('div');
        bullet.className = 'enemy-bullet sniperjoe-bullet';
        bullet.style.left = (enemyRect.left - screenRect.left + 2) + 'px';
        bullet.style.bottom = (screenRect.bottom - enemyRect.top - 34) + 'px';
        screen.appendChild(bullet);

        const travel = Math.min(-35, (rockRect.left - enemyRect.left) - 10);
        bullet.animate(
            [{ transform: 'translateX(0)' }, { transform: `translateX(${travel}px)` }],
            { duration: 520, easing: 'linear' }
        );

        setTimeout(() => {
            if (!enemyDead && !playerDead && isSniperJoeBattle()) {
                enemyHitsPlayerByBullet();
            }
            bullet.remove();
        }, 520);

        setTimeout(() => {
            sniperJoeAttacking = false;
            if (isSniperJoeBattle() && !enemyDead) enemyImg.src = ENEMY_TYPE_DATA.sniperjoe.idleFrame;
        }, 300);
    }, 130);
}

function enemyHitsPlayerByBullet() {
    if (playerDead || enemyDead) return;

    const damage = Math.max(1, Math.floor(enemyAtk));
    gameData.playerHp -= damage;
    if (gameData.playerHp < 0) gameData.playerHp = 0;

    showPlayerDamageText(damage);
    playPlayerHitEffect();

    updateUI();
    saveData();

    if (gameData.playerHp <= 0) {
        failStage();
    }
}


function animate() {
    const rImg = document.getElementById('rockman-img');
    const eImg = document.getElementById('enemy-img');

    if (!rImg || !eImg) return;

    if (isSniperJoeBattle()) {
        applyStillBattleFrames();
        if (!enemyDead && !sniperJoeJumping && !sniperJoeAttacking) {
            eImg.src = ENEMY_TYPE_DATA.sniperjoe.idleFrame;
        }
        animateBeat();
        animateBlues();
        animateZero();
        return;
    }

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
    animateZero();
}


function animateRush() {
    const rushImg = document.getElementById('rush-img');
    if (!rushImg || !gameData.rushOwned) return;

    if (isSniperJoeBattle()) {
        rushImg.src = 'sprites/partner/rush/rush_st.png';
        return;
    }

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

  if (isSniperJoeBattle()) {
    const frame = bluesStandPattern[bluesStandIndex];
    bluesImg.src = `sprites/partner/blues/blues_st_0${frame}.png`;
    bluesStandIndex = (bluesStandIndex + 1) % bluesStandPattern.length;
    return;
  }

  bluesFrame++;
  if (bluesFrame > 9) bluesFrame = 6;

  bluesImg.src = `sprites/partner/blues/blues_0${bluesFrame}.png`;
}

function animateForte() {
  const forteImg = document.getElementById('forte-img');
  if (!forteImg || !gameData.forteOwned) return;

  if (isSniperJoeBattle()) {
    if (!forteAttacking) forteImg.src = 'sprites/partner/forte/forte_st.png';
    return;
  }

  const frame = forteFramePattern[forteFrameIndex];
  forteImg.src = `sprites/partner/forte/forte_0${frame}.png`;

  forteFrameIndex = (forteFrameIndex + 1) % forteFramePattern.length;
}

function animateX() {
  const xImg = document.getElementById('x-img');
  if (!xImg || !gameData.xOwned) return;

  if (isSniperJoeBattle()) {
    if (!xAttacking) xImg.src = 'sprites/partner/x/x_st.png';
    return;
  }

  const frame = xFramePattern[xFrameIndex];
  xImg.src = `sprites/partner/x/x_0${frame}.png`;

  xFrameIndex = (xFrameIndex + 1) % xFramePattern.length;
}

function animateZero() {
  const zeroImg = document.getElementById('zero-img');
  if (!zeroImg || !gameData.zeroOwned || zeroAttacking) return;

  if (isSniperJoeBattle()) {
    zeroImg.src = 'sprites/partner/zero/zero_st.png';
    return;
  }

  const frame = zeroFramePattern[zeroFrameIndex];
  zeroImg.src = `sprites/partner/zero/zero_0${frame}.png`;
  zeroFrameIndex = (zeroFrameIndex + 1) % zeroFramePattern.length;
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
    const wing = document.getElementById('partner-sync-wing');
    if (!wing) return;

    wing.classList.toggle('open');
    updateUI();
}

function upgradePartnerSync(type) {
    if (partnerSyncEnhancing) return;

    const data = PARTNER_ATTACK_DATA[type];
    if (!data) return;
    if (!gameData[data.ownedKey]) return;
    if (gameData.crystals < PARTNER_SYNC_UPGRADE_COST) return;

    const syncKey = data.syncKey || type;
    const currentSync = getPartnerSyncPercent(type);
    if (currentSync >= 100) return;

    gameData.crystals -= PARTNER_SYNC_UPGRADE_COST;
    partnerSyncEnhancing = true;

    playPartnerSyncChargeEffect(type);
    updateUI();
    saveData();

    setTimeout(() => {
        const latestSync = getPartnerSyncPercent(type);
        const chance = getPartnerSyncChance(type);
        const success = Math.random() * 100 < chance;

        if (success) {
            const gain = Math.floor(
                Math.random() * (PARTNER_SYNC_UPGRADE_MAX_GAIN - PARTNER_SYNC_UPGRADE_MIN_GAIN + 1)
            ) + PARTNER_SYNC_UPGRADE_MIN_GAIN;

            gameData.partnerSync[syncKey] = Math.min(100, latestSync + gain);
        }

        partnerSyncEnhancing = false;
        updateUI();
        playPartnerSyncUpgradeEffect(type, success);
        saveData();
    }, 850);
}

function playPartnerSyncChargeEffect(type) {
    const card = document.getElementById(`${type}-sync-row`);
    if (!card) return;

    card.classList.remove('sync-charging', 'sync-upgraded', 'sync-failed');
    void card.offsetWidth;
    card.classList.add('sync-charging');

    setTimeout(() => {
        card.classList.remove('sync-charging');
    }, 850);
}

function playPartnerSyncUpgradeEffect(type, success) {
    const card = document.getElementById(`${type}-sync-row`);
    if (!card) return;

    card.classList.remove('sync-upgraded', 'sync-failed');
    void card.offsetWidth;
    card.classList.add(success ? 'sync-upgraded' : 'sync-failed');

    const percent = document.getElementById(`${type}-sync-percent`);
    if (percent) {
        percent.classList.remove('sync-rise');
        void percent.offsetWidth;
        if (success) percent.classList.add('sync-rise');
    }

    setTimeout(() => {
        card.classList.remove('sync-upgraded', 'sync-failed');
        if (percent) percent.classList.remove('sync-rise');
    }, 820);
}

function showPartnerUpgradeResult(message) {
    // 동료 공격력 강화 결과는 카드 연출로만 표시합니다.
    // 문구 출력은 사용하지 않습니다.
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

      const damage = Math.floor(getPartnerDamage('blues') * 1.8);
      const hit = applyEnemyDamage(damage, false, false);

      if (hit && !enemyDead) playEnemyHit(enemy);

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

function startZeroAttack() {
  if (zeroAttackTimer) clearInterval(zeroAttackTimer);

  zeroAttackTimer = setInterval(() => {
    if (!gameData.zeroOwned || enemyDead || playerDead || zeroAttacking) return;

    zeroMeleeAttack();
  }, Math.floor(gameData.partnerAtkSpd * ZERO_ATTACK_INTERVAL_MULTIPLIER));
}

function zeroMeleeAttack() {
    const zeroArea = document.getElementById('zero-area');
    const zeroImg = document.getElementById('zero-img');
    const enemyImg = document.getElementById('enemy-img');
    const screen = document.querySelector('.game-screen');

    if (!zeroArea || !zeroImg || !enemyImg || !screen) return;

    zeroAttacking = true;
    zeroArea.classList.remove('zero-return-jump');
    zeroArea.style.transition = 'none';
    zeroArea.style.transform = 'translate(0px, 0px)';

    const screenRect = screen.getBoundingClientRect();
    const zeroRect = zeroArea.getBoundingClientRect();
    const enemyRect = enemyImg.getBoundingClientRect();
    const targetX = Math.max(35, enemyRect.left - zeroRect.left - 34);

    let approachFrame = 1;
    const approachTimer = setInterval(() => {
        zeroImg.src = `sprites/partner/zero/zero_at_0${approachFrame}.png`;
        approachFrame++;
        if (approachFrame > 4) clearInterval(approachTimer);
    }, 90);

    setTimeout(() => {
        zeroArea.style.transition = 'transform 0.36s ease-out';
        zeroArea.style.transform = `translate(${targetX}px, ${ZERO_ATTACK_TARGET_Y}px)`;
    }, 20);

    setTimeout(() => {
        let attackFrame = 5;
        const attackTimer = setInterval(() => {
            const frameText = String(attackFrame).padStart(2, '0');
            zeroImg.src = `sprites/partner/zero/zero_at_${frameText}.png`;
            attackFrame++;

            if (attackFrame > 10) {
                clearInterval(attackTimer);
                const damage = getPartnerDamage('zero');
                // 제로의 근접 공격은 버스터 공격이 아니므로 스나이퍼 죠의 방패 반감을 받지 않습니다.
                const hit = applyEnemyDamage(damage, false, false);
                if (hit && !enemyDead) playEnemyHit(enemyImg);
            }
        }, 95);
    }, 420);

    setTimeout(() => {
        let returnFrame = 11;
        zeroArea.classList.add('zero-return-jump');
        zeroArea.style.transition = 'transform 0.48s ease-in-out';
        zeroArea.style.transform = 'translate(0px, 0px)';

        const returnTimer = setInterval(() => {
            zeroImg.src = `sprites/partner/zero/zero_at_${returnFrame}.png`;
            returnFrame++;

            if (returnFrame > 15) {
                clearInterval(returnTimer);
            }
        }, 85);
    }, 1010);

    setTimeout(() => {
        zeroArea.classList.remove('zero-return-jump');
        zeroArea.style.transition = '';
        zeroArea.style.transform = '';
        zeroImg.src = isSniperJoeBattle() ? 'sprites/partner/zero/zero_st.png' : 'sprites/partner/zero/zero_01.png';
        zeroAttacking = false;
    }, 1600);
}

function getPartnerAnchorPoint(data) {
    const screen = document.querySelector('.game-screen');
    const img = document.getElementById(data?.imgId);

    if (!data || !screen || !img) return null;

    const screenRect = screen.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    const anchorX = data.muzzleAnchorX || 'left';
    const anchorY = data.muzzleAnchorY || 'top';

    let x;
    if (anchorX === 'right') {
        x = imgRect.right - screenRect.left;
    } else if (anchorX === 'center') {
        x = imgRect.left - screenRect.left + imgRect.width / 2;
    } else {
        x = imgRect.left - screenRect.left;
    }

    let y;
    if (anchorY === 'bottom') {
        y = screenRect.bottom - imgRect.bottom;
    } else if (anchorY === 'center') {
        y = screenRect.bottom - (imgRect.top + imgRect.height / 2);
    } else {
        y = screenRect.bottom - imgRect.top;
    }

    return { x, y };
}

function getPartnerBusterPosition(type) {
    const data = PARTNER_ATTACK_DATA[type];
    const anchor = getPartnerAnchorPoint(data);

    if (!data || !anchor) return null;

    // legacy 모드는 기존 좌하단 배치 방식과 호환됩니다.
    if (data.projectilePositionMode !== 'muzzle-center') {
        return {
            x: anchor.x + (data.busterOffsetX || 0),
            y: anchor.y - (data.busterOffsetY || 0)
        };
    }

    // muzzle-center 모드는 busterOffsetX/Y가 '투사체 중심점'을 직접 조정합니다.
    // anchorY가 bottom일 때는 Y값이 클수록 위로 올라가므로 위치 조정 감각이 직관적입니다.
    return {
        x: anchor.x + (data.busterOffsetX || 0),
        y: anchor.y + (data.busterOffsetY || 0)
    };
}

function getPartnerProjectileSize(data, isChargeShot) {
    return {
        width: isChargeShot ? (data.chargeBulletWidth || data.bulletWidth || 7) : (data.bulletWidth || 7),
        height: isChargeShot ? (data.chargeBulletHeight || data.bulletHeight || 5) : (data.bulletHeight || 5)
    };
}

function placeElementByCenter(element, center, width, height) {
    element.style.left = (center.x - width / 2) + 'px';
    element.style.bottom = (center.y - height / 2) + 'px';
}

function placePartnerProjectile(element, data, pos, isChargeShot) {
    const size = getPartnerProjectileSize(data, isChargeShot);

    if (data.projectilePositionMode !== 'muzzle-center') {
        element.style.left = pos.x + 'px';
        element.style.bottom = pos.y + 'px';
        return;
    }

    // 기본탄/차지탄 크기가 달라도 같은 중심점에서 출발합니다.
    placeElementByCenter(element, pos, size.width, size.height);
}

function placePartnerChargeEffect(element, data, pos) {
    if (data.projectilePositionMode !== 'muzzle-center') {
        element.style.left = (pos.x - 8) + 'px';
        element.style.bottom = (pos.y - 8) + 'px';
        return;
    }

    const effectWidth = data.chargeEffectWidth || 18;
    const effectHeight = data.chargeEffectHeight || 18;
    const effectCenter = {
        x: pos.x + (data.chargeEffectOffsetX || 0),
        y: pos.y + (data.chargeEffectOffsetY || 0)
    };

    // 차지 이펙트도 투사체 중심점과 같은 기준으로 배치합니다.
    placeElementByCenter(element, effectCenter, effectWidth, effectHeight);
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
        placePartnerProjectile(bullet, data, pos, isChargeShot);
        screen.appendChild(bullet);

        let chargeFrameTimer = null;
        if (isChargeShot && data.chargeFramePrefix && data.chargeFrameCount) {
            let frame = 1;
            chargeFrameTimer = setInterval(() => {
                frame = frame >= data.chargeFrameCount ? 1 : frame + 1;
                bullet.style.backgroundImage = `url("${data.chargeFramePrefix}${String(frame).padStart(2, '0')}.png")`;
            }, data.chargeFrameInterval || 70);
        }

        // 이동 거리는 투사체의 실제 중심점 기준으로 계산합니다.
        const projectileSize = getPartnerProjectileSize(data, isChargeShot);
        const bulletLeft = parseFloat(bullet.style.left) || pos.x;
        const bulletCenterX = data.projectilePositionMode === 'muzzle-center'
            ? bulletLeft + projectileSize.width / 2
            : bulletLeft;

        const travel = getBulletTravel(bulletCenterX);
        const duration = isChargeShot
            ? (data.chargeShotDuration || Math.max(150, (data.shotDuration || 260) - 90))
            : (data.shotDuration || 260);

        bullet.animate(
            [{ transform: 'translateX(0)' }, { transform: `translateX(${travel}px)` }],
            { duration, easing: 'linear' }
        );

        setTimeout(() => {
            if (chargeFrameTimer) clearInterval(chargeFrameTimer);

            if (!enemyDead && !playerDead) {
                const hit = applyPartnerDamage(type, isChargeShot);
                if (hit && !enemyDead) playEnemyHit(enemy);
            }

            bullet.remove();
            finishAttack();
        }, duration);
    };

    if (isChargeShot) {
        const charge = document.createElement('div');
        charge.className = data.chargeEffectClass || 'partner-charge-effect';
        placePartnerChargeEffect(charge, data, pos);
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
    if (enemyDead || playerDead) return false;

    let damage = getPartnerDamage(type);
    if (isChargeShot) {
        damage = Math.floor(damage * gameData.critMultiplier);
    }

    return applyEnemyDamage(damage, isChargeShot, true);
}


setInterval(animate, 200);

function startChase() {
    if (chaseTimer) clearInterval(chaseTimer);

    chaseTimer = setInterval(() => {
        if (enemyDead || playerDead || enemyStunned) return;
        if (isSniperJoeBattle()) return;

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
    flashAllyCharacter('rockman-img');
    flashAllyCharacter('rush-img', gameData.rushOwned);
    flashAllyCharacter('beat-img', gameData.beatOwned);
    flashAllyCharacter('blues-img', gameData.bluesOwned);
    flashAllyCharacter('forte-img', gameData.forteOwned);
    flashAllyCharacter('x-img', gameData.xOwned);
    flashAllyCharacter('zero-img', gameData.zeroOwned);
}

function flashAllyCharacter(elementId, shouldFlash = true) {
    if (!shouldFlash) return;

    const el = document.getElementById(elementId);
    if (!el) return;

    el.classList.remove('ally-hit-flash');
    void el.offsetWidth;
    el.classList.add('ally-hit-flash');

    setTimeout(() => {
        el.classList.remove('ally-hit-flash');
    }, 520);
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

    stopSniperJoeActions();
    playRockmanDeathEffect();

    setTimeout(() => {
        if (gameData.stage > 1) {
            const beforeStage = gameData.stage;
            gameData.stage = Math.max(1, gameData.stage - 3);
            const downCount = beforeStage - gameData.stage;
            showStageText(`STAGE DOWN -${downCount}`);
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

const ROCK_BULLET_OFFSET_X = -25;
const ROCK_BULLET_OFFSET_Y = -17;
const ROCK_CHARGE_BULLET_OFFSET_Y = -23;
const ROCK_NORMAL_BULLET_DURATION = 460;
const ROCK_CHARGE_BULLET_DURATION = 340;

function getRockBulletPosition(isChargeShot = false) {
    const pos = getBusterPosition();
    return {
        x: pos.x + ROCK_BULLET_OFFSET_X,
        y: pos.y + (isChargeShot ? ROCK_CHARGE_BULLET_OFFSET_Y : ROCK_BULLET_OFFSET_Y)
    };
}

function createRockBulletElement(isChargeShot = false) {
    const bullet = document.createElement('div');
    bullet.className = isChargeShot ? 'rock-bullet rock-charge-bullet' : 'rock-bullet rock-normal-bullet';
    return bullet;
}

function startChargeBulletAnimation(bullet) {
    let frame = 1;
    return setInterval(() => {
        frame = frame >= 4 ? 1 : frame + 1;
        bullet.style.backgroundImage = `url("sprites/rock/rock_c_bullet_0${frame}.png")`;
    }, 70);
}

function fireNormalShot(screen, enemy) {
    const bullet = createRockBulletElement(false);

    const pos = getRockBulletPosition(false);
    bullet.style.left = pos.x + "px";
    bullet.style.bottom = pos.y + "px";

    screen.appendChild(bullet);

    const travel = getBulletTravel(pos.x);

    bullet.animate(
        [{ transform: 'translateX(0)' }, { transform: `translateX(${travel}px)` }],
        { duration: ROCK_NORMAL_BULLET_DURATION, easing: 'linear' }
    );

    setTimeout(() => {
        const hit = applyDamage(false);
        if (hit && !enemyDead) playEnemyHit(enemy);
        bullet.remove();
    }, ROCK_NORMAL_BULLET_DURATION);
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

        const bullet = createRockBulletElement(true);

        const pos = getRockBulletPosition(true);
        bullet.style.left = pos.x + "px";
        bullet.style.bottom = pos.y + "px";

        screen.appendChild(bullet);

        const chargeBulletTimer = startChargeBulletAnimation(bullet);
        const travel = getBulletTravel(pos.x);

        bullet.animate(
            [{ transform: 'translateX(0)' }, { transform: `translateX(${travel}px)` }],
            { duration: ROCK_CHARGE_BULLET_DURATION, easing: 'linear' }
        );

        setTimeout(() => {
            clearInterval(chargeBulletTimer);
            const hit = applyDamage(true);
            if (hit && !enemyDead) playEnemyHit(enemy);
            bullet.remove();
        }, ROCK_CHARGE_BULLET_DURATION);
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

    return applyEnemyDamage(damage, isChargeShot, true);
}

function applyEnemyDamage(rawDamage, isChargeShot = false, isBusterAttack = true) {
    if (enemyDead || playerDead) return false;

    let damage = Math.max(1, Math.floor(rawDamage));

    if (isSniperJoeBattle()) {
        if (sniperJoeJumping || Math.random() < SNIPERJOE_DODGE_CHANCE) {
            playSniperJoeJump();
            showDamageText('MISS', false);
            return false;
        }

        if (isBusterAttack) {
            damage = Math.max(1, Math.floor(damage * SNIPERJOE_BUSTER_DAMAGE_RATE));
        }
    }

    enemyHp -= damage;

    showDamageText(damage, isChargeShot);

    if (enemyHp <= 0) {
        killEnemy();
    }

    updateUI();
    saveData();
    return true;
}


function killEnemy() {
    if (enemyDead || playerDead) return;

    enemyDead = true;
    enemyHp = 0;
    stopSniperJoeActions();

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
                startZeroAttack();
startMining();
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

function buyZeroFragment(amount) {
  if (gameData.zeroOwned) return;
  if (gameData.crystals < amount) return;

  gameData.crystals -= amount;
  gameData.zeroFragments += amount;

  if (gameData.zeroFragments > ZERO_REQUIRED_FRAGMENTS) {
    gameData.zeroFragments = ZERO_REQUIRED_FRAGMENTS;
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
        beatImg.src = 'sprites/partner/blues/blues_join_01.png';
        beatImg.style.setProperty('width', '54px', 'important');
        beatImg.style.setProperty('height', '54px', 'important');
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

    if (type === 'zero') {
        text.innerText = 'ZERO JOIN!';
        rushImg.style.display = 'none';
        beatImg.src = 'sprites/partner/zero/zero_join_01.png';
        beatImg.style.setProperty('width', '54px', 'important');
        beatImg.style.setProperty('height', '54px', 'important');
        beatImg.style.display = 'block';
    }

    popup.classList.add('active');
    popup.onclick = () => {
        closeSummonPopup();
    };

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

    let bluesJoinFrame = 1;

    beatImg.src = 'sprites/partner/blues/blues_join_01.png';
    beatImg.style.setProperty('width', '54px', 'important');
    beatImg.style.setProperty('height', '54px', 'important');
    beatImg.style.transform = 'translateX(-50%)';
    beatImg.classList.remove('rush-drop');
    beatImg.classList.remove('join-drop');

    if (beatJoinTimer) clearInterval(beatJoinTimer);

    beatJoinTimer = setInterval(() => {
        bluesJoinFrame++;

        if (bluesJoinFrame <= 8) {
            beatImg.src = `sprites/partner/blues/blues_join_0${bluesJoinFrame}.png`;
        } else {
            clearInterval(beatJoinTimer);
            beatJoinTimer = null;

            beatImg.src = 'sprites/partner/blues/blues_join_08.png';
        }
    }, 120);

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

}

function summonZero() {
    if (gameData.zeroOwned) return;
    if (gameData.zeroFragments < ZERO_REQUIRED_FRAGMENTS) return;

    gameData.zeroOwned = true;

    const popupData = prepareSummonPopup('zero');
    if (!popupData) {
        updateUI();
        saveData();
        return;
    }

    const { beatImg } = popupData;
    let zeroJoinFrame = 1;

    beatImg.src = 'sprites/partner/zero/zero_join_01.png';
    beatImg.style.setProperty('width', '54px', 'important');
    beatImg.style.setProperty('height', '54px', 'important');
    beatImg.style.transform = 'translateX(-50%)';
    beatImg.classList.remove('rush-drop', 'join-drop');

    if (zeroJoinTimer) clearInterval(zeroJoinTimer);

    zeroJoinTimer = setInterval(() => {
        zeroJoinFrame++;

        if (zeroJoinFrame <= 8) {
            beatImg.src = `sprites/partner/zero/zero_join_0${zeroJoinFrame}.png`;
        } else {
            clearInterval(zeroJoinTimer);
            zeroJoinTimer = null;
            beatImg.src = 'sprites/partner/zero/zero_join_08.png';
        }
    }, 120);
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

    if (forteJoinTimer) {
        clearInterval(forteJoinTimer);
        forteJoinTimer = null;
    }

    if (xJoinTimer) {
        clearInterval(xJoinTimer);
        xJoinTimer = null;
    }

    if (zeroJoinTimer) {
        clearInterval(zeroJoinTimer);
        zeroJoinTimer = null;
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
    const currentTab = document.getElementById(tabName + '-tab');

    // 전투 탭이 아닌 다른 탭을 다시 누르면 전투 탭으로 복귀합니다.
    if (tabName !== 'battle' && currentTab && currentTab.classList.contains('active')) {
        tabName = 'battle';
    }

    ['battle', 'partner', 'armor', 'boss', 'mine'].forEach(name => {
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
    currentEnemyType = null;
    stopSniperJoeActions();

    const screen = document.querySelector('.game-screen');
    if (screen) {
      screen.classList.remove('sniperjoe-mode');
      screen.classList.add('boss-mode');
    }

    const bg = document.getElementById('scroll-bg');
    if (bg) bg.classList.remove('paused');

    const enemyImg = document.getElementById('enemy-img');
    if (enemyImg) {
      enemyImg.src = 'sprites/boss/super-rboss/super-rboss.png';
      enemyImg.style.width = '60px';
      enemyImg.style.height = '60px';
      enemyImg.style.marginTop = '-15px';
    }

    const enemyArea = document.getElementById('enemy-area');
    if (enemyArea) {
      enemyArea.classList.remove('sniperjoe-area');
      enemyArea.style.removeProperty('--sniperjoe-ground-bottom');
      enemyArea.style.bottom = `${BOSS_BOTTOM}px`;
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

const STONE_ICON_HTML = '<img src="sprites/mine/stone.png" class="result-resource-icon stone-resource-icon" alt="돌">';

const PICKAXE_NAMES = ['록괭이', '록괭이X', '록괭이.EXE', '록괭대시', '퍼스트괭이', '기가괭이', '맥스괭이', '포스괭이', '팔콘괭이', '얼티밋괭이'];

// 다음 단계 0강이 이전 단계 10강보다 반드시 강하도록 기본 데미지를 고정 테이블로 관리합니다.
// 각 단계 기본 데미지 차이는 36, 강화 10강 총 증가량은 30입니다.
const PICKAXE_BASE_DAMAGES = [8, 44, 80, 116, 152, 188, 224, 260, 296, 332];
const PICKAXE_ENHANCE_DAMAGE = 3;
const PICKAXE_MAX_TIER = PICKAXE_NAMES.length - 1;

function getPickaxeTierIndex() {
    return Math.min(gameData.minePickaxeTier, PICKAXE_NAMES.length - 1);
}

function getPickaxeName() {
    return PICKAXE_NAMES[getPickaxeTierIndex()] || '록괭이';
}

function getPickaxeSprite() {
    const spriteIndex = String(getPickaxeTierIndex() + 1).padStart(2, '0');
    return `sprites/mine/pickaxe/pickaxe_${spriteIndex}.png`;
}

function getMiningDamage() {
    if (!gameData.minePickaxeOwned) return 0;

    const tierIndex = getPickaxeTierIndex();
    const baseDamage = PICKAXE_BASE_DAMAGES[tierIndex] || PICKAXE_BASE_DAMAGES[0];
    return Math.floor(baseDamage + gameData.minePickaxeEnhance * PICKAXE_ENHANCE_DAMAGE);
}

function getMineRockMaxHp() {
    return Math.floor(80 + gameData.minePickaxeTier * 80 + gameData.minePickaxeEnhance * 18);
}

function getMineEnhanceCost() {
    return Math.floor(8 + gameData.minePickaxeTier * 20 + gameData.minePickaxeEnhance * 6);
}

function getMineEnhanceChance() {
    return Math.max(20, 95 - gameData.minePickaxeEnhance * 6 - gameData.minePickaxeTier * 4);
}

function getMineDestroyChance() {
    return gameData.minePickaxeEnhance >= 7 ? 5 : 0;
}

function getMineProtectedLevel(level = gameData.minePickaxeEnhance) {
    return Math.floor(level / 5) * 5;
}

function craftPickaxe() {
    if (gameData.minePickaxeOwned) return;
    if (gameData.screws < 100) return;

    gameData.screws -= 100;
    gameData.minePickaxeOwned = true;
    gameData.minePickaxeTier = Math.max(0, gameData.minePickaxeFloorTier || 0);
    gameData.minePickaxeEnhance = 0;
    gameData.mineRockMaxHp = getMineRockMaxHp();
    gameData.mineRockHp = gameData.mineRockMaxHp;

    showMineBigResult('제작 완료', 'success');
    showMineResult(`${getPickaxeName()} 제작 완료`);
    updateUI();
    saveData();
}

function enhancePickaxe() {
    if (mineEnhancing) return;
    if (!gameData.minePickaxeOwned) return;
    if (gameData.minePickaxeEnhance >= 10) {
        showMineBigResult('업그레이드 가능', 'success');
        showMineResult('10강 달성! 업그레이드 가능');
        return;
    }

    const cost = getMineEnhanceCost();
    if (gameData.stones < cost) {
        showMineBigResult('재료 부족', 'fail');
        showMineResult(`${STONE_ICON_HTML} 재료가 부족합니다`);
        return;
    }

    gameData.stones -= cost;
    mineEnhancing = true;
    updateUI();
    playMineEnhanceCharge();

    setTimeout(() => {
        const chance = getMineEnhanceChance();
        const success = Math.random() * 100 < chance;

        if (success) {
            gameData.minePickaxeEnhance += 1;
            showMineBigResult('강화 성공', 'success');
            showMineResult(`강화 성공! +${gameData.minePickaxeEnhance}`);
        } else {
            const destroyChance = getMineDestroyChance();
            const destroyed = destroyChance > 0 && Math.random() * 100 < destroyChance;

            if (destroyed) {
                breakPickaxe();
            } else {
                const before = gameData.minePickaxeEnhance;
                const protectLevel = getMineProtectedLevel(before);
                gameData.minePickaxeEnhance = Math.max(protectLevel, before - 1);

                showMineBigResult('강화 실패', 'fail');
                if (before === gameData.minePickaxeEnhance) {
                    showMineResult(`강화 실패 / ${protectLevel}강 보호`);
                } else {
                    showMineResult(`강화 실패... +${gameData.minePickaxeEnhance}`);
                }
            }
        }

        mineEnhancing = false;
        updateUI();
        saveData();
    }, 850);
}

function breakPickaxe() {
    if ((gameData.minePickaxeFloorTier || 0) > 0) {
        gameData.minePickaxeTier = gameData.minePickaxeFloorTier;
        gameData.minePickaxeEnhance = 0;
        gameData.minePickaxeOwned = true;
        gameData.mineRockMaxHp = getMineRockMaxHp();
        gameData.mineRockHp = gameData.mineRockMaxHp;
        showMineBigResult('파괴 방지', 'break');
        showMineResult(`${getPickaxeName()} 파괴 방지 / +0으로 복구`);
        return;
    }

    gameData.minePickaxeOwned = false;
    gameData.minePickaxeTier = 0;
    gameData.minePickaxeEnhance = 0;
    gameData.mineRockMaxHp = getMineRockMaxHp();
    gameData.mineRockHp = gameData.mineRockMaxHp;
    showMineBigResult('파괴됨', 'break');
    showMineResult('곡괭이 파괴... 다시 제작 필요');
}

function upgradePickaxeTier() {
    if (!gameData.minePickaxeOwned) return;
    if (gameData.minePickaxeEnhance < 10) return;

    if (gameData.minePickaxeTier >= PICKAXE_MAX_TIER) {
        showMineBigResult('최종 단계', 'success');
        showMineResult(`${getPickaxeName()} 최종 단계입니다`);
        updateUI();
        saveData();
        return;
    }

    gameData.minePickaxeTier += 1;
    gameData.minePickaxeFloorTier = gameData.minePickaxeTier;
    gameData.minePickaxeEnhance = 0;
    gameData.mineRockMaxHp = getMineRockMaxHp();
    gameData.mineRockHp = gameData.mineRockMaxHp;

    showMineBigResult('업그레이드', 'success');
    showMineResult(`${getPickaxeName()} 업그레이드 완료`);
    updateUI();
    saveData();
}

function mineAttack() {
    if (!gameData.minePickaxeOwned) return;
    if (mineAttackAnimating) return;

    const rock = document.getElementById('mine-rock-img');
    const miner = document.getElementById('miner-img');
    if (!rock || !miner) return;

    mineAttackAnimating = true;
    miner.src = 'sprites/mine/pickelman_01.png';

    setTimeout(() => {
        miner.src = 'sprites/mine/pickelman_02.png';

        setTimeout(() => {
            miner.src = 'sprites/mine/pickelman_03.png';

            const damage = getMiningDamage();
            gameData.mineRockHp -= damage;
            showMineDamageText(damage);

            rock.classList.remove('mine-rock-hit');
            void rock.offsetWidth;
            rock.classList.add('mine-rock-hit');

            if (gameData.mineRockHp <= 0) {
                clearMineRock();
            }

            updateUI();
            saveData();

            setTimeout(() => {
                miner.src = 'sprites/mine/pickelman_01.png';
                mineAttackAnimating = false;
            }, 250);
        }, 30);
    }, 30);
}

function clearMineRock() {
    const screwReward = Math.floor(8 + gameData.minePickaxeTier * 5 + gameData.minePickaxeEnhance * 1.5);
    const stoneReward = Math.floor(3 + gameData.minePickaxeTier * 3 + Math.max(1, Math.floor(gameData.minePickaxeEnhance / 2)));

    gameData.screws += screwReward;
    gameData.stones += stoneReward;
    gameData.mineRockMaxHp = getMineRockMaxHp();
    gameData.mineRockHp = gameData.mineRockMaxHp;

    showMineResult(`+${screwReward}🔩 / +${stoneReward}${STONE_ICON_HTML}`);
}

function showMineDamageText(damage) {
    const screen = document.querySelector('.mine-screen');
    if (!screen) return;

    const text = document.createElement('div');
    text.className = 'mine-damage-text';
    text.innerText = damage;
    text.style.left = '250px';
    text.style.bottom = '62px';
    screen.appendChild(text);

    setTimeout(() => text.remove(), 700);
}

function showMineResult(message) {
    const result = document.getElementById('mine-result-text');
    if (!result) return;

    result.innerHTML = message;
    result.classList.remove('active');
    void result.offsetWidth;
    result.classList.add('active');

    setTimeout(() => result.classList.remove('active'), 1000);
}

function playMineEnhanceCharge() {
    const stage = document.querySelector('.mine-pickaxe-stage');
    const effect = document.getElementById('mine-enhance-charge-effect');
    const img = document.getElementById('mine-pickaxe-img');
    if (!stage || !effect || !img) return;

    stage.classList.remove('enhancing');
    effect.classList.remove('active');
    img.classList.remove('enhancing');
    void stage.offsetWidth;
    stage.classList.add('enhancing');
    effect.classList.add('active');
    img.classList.add('enhancing');

    setTimeout(() => {
        stage.classList.remove('enhancing');
        effect.classList.remove('active');
        img.classList.remove('enhancing');
    }, 850);
}

function showMineBigResult(message, type = 'success') {
    const result = document.getElementById('mine-enhance-big-result');
    if (!result) return;

    result.innerHTML = message;
    result.className = `mine-enhance-big-result ${type}`;
    void result.offsetWidth;
    result.classList.add('active');

    setTimeout(() => {
        result.classList.remove('active');
    }, 1100);
}

function startMining() {
    if (mineTimer) clearInterval(mineTimer);
    mineTimer = setInterval(mineAttack, 1200);
}

function showBattleTip() {
    const tip = document.getElementById('battle-tip-message');
    if (!tip || !BATTLE_TIPS.length) return;

    tip.classList.remove('active');
    tip.innerText = BATTLE_TIPS[battleTipIndex];
    battleTipIndex = (battleTipIndex + 1) % BATTLE_TIPS.length;
    void tip.offsetWidth;
    tip.classList.add('active');
}

function startBattleTips() {
    if (battleTipTimer) clearInterval(battleTipTimer);
    showBattleTip();
    battleTipTimer = setInterval(showBattleTip, 4800);
}

function updateUI() {
    document.getElementById('stage').innerText = gameData.stage;
    document.getElementById('player-hp-text').innerText = Math.floor(gameData.playerHp);
    document.getElementById('player-max-hp-text').innerText = Math.floor(gameData.playerMaxHp);

    document.getElementById('player-hp-fill').style.width =
        Math.max(0, (gameData.playerHp / gameData.playerMaxHp) * 100) + "%";

    document.getElementById('screws').innerText = Math.floor(gameData.screws).toLocaleString();
    document.getElementById('crystals').innerText = Math.floor(gameData.crystals).toLocaleString();

    const stonesEl = document.getElementById('stones');
    if (stonesEl) stonesEl.innerText = Math.floor(gameData.stones || 0).toLocaleString();

    const mineScrewsDisplay = document.getElementById('mine-screws-display');
    if (mineScrewsDisplay) mineScrewsDisplay.innerText = Math.floor(gameData.screws || 0).toLocaleString();

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
    setButtonActive(document.getElementById('exchange-btn100'), gameData.screws >= 10000);

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

const zeroFragmentsEl = document.getElementById('zero-fragments');
if (zeroFragmentsEl) zeroFragmentsEl.innerText = gameData.zeroFragments;

setButtonActive(document.getElementById('zero-buy1'), !gameData.zeroOwned && gameData.crystals >= 1 && gameData.zeroFragments < 100);
setButtonActive(document.getElementById('zero-buy10'), !gameData.zeroOwned && gameData.crystals >= 10 && gameData.zeroFragments <= 90);
setButtonActive(document.getElementById('zero-buy100'), !gameData.zeroOwned && gameData.crystals >= 100 && gameData.zeroFragments === 0);
setButtonActive(document.getElementById('zero-summon-btn'), !gameData.zeroOwned && gameData.zeroFragments >= 100);

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

const zeroCard = document.getElementById('zero-card');
const zeroBadge = document.getElementById('zero-complete-badge');

if (zeroCard && zeroBadge) {
  if (gameData.zeroOwned) {
    zeroCard.classList.add('complete');
    zeroBadge.classList.add('active');
  } else {
    zeroCard.classList.remove('complete');
    zeroBadge.classList.remove('active');
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

const zeroArea = document.getElementById('zero-area');
const zeroImg = document.getElementById('zero-img');

if (zeroArea) {
  if (gameData.zeroOwned) zeroArea.classList.add('active');
  else zeroArea.classList.remove('active');
}

if (zeroImg) {
  zeroImg.style.display = gameData.zeroOwned ? 'block' : 'none';
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

const mineStoneEls = document.querySelectorAll('.stone-count');
mineStoneEls.forEach(el => {
    el.innerText = Math.floor(gameData.stones || 0).toLocaleString();
});

const minePickaxeName = document.getElementById('mine-pickaxe-name');
if (minePickaxeName) minePickaxeName.innerText = gameData.minePickaxeOwned ? getPickaxeName() : '미제작';

const mineEnhance = document.getElementById('mine-pickaxe-enhance');
if (mineEnhance) mineEnhance.innerText = gameData.minePickaxeOwned ? `+${gameData.minePickaxeEnhance}` : '+0';

const mineEnhanceBadge = document.getElementById('mine-pickaxe-enhance-badge');
if (mineEnhanceBadge) mineEnhanceBadge.innerText = gameData.minePickaxeOwned ? `+${gameData.minePickaxeEnhance}` : '+0';

const minePickaxeImg = document.getElementById('mine-pickaxe-img');
if (minePickaxeImg) minePickaxeImg.src = getPickaxeSprite();

const mineDamage = document.getElementById('mine-damage');
if (mineDamage) mineDamage.innerText = getMiningDamage().toLocaleString();

const mineChance = document.getElementById('mine-enhance-chance');
if (mineChance) mineChance.innerText = `${getMineEnhanceChance()}%`;

const mineDestroyChanceNote = document.getElementById('mine-destroy-chance-note');
if (mineDestroyChanceNote) {
    const destroyChance = getMineDestroyChance();
    mineDestroyChanceNote.innerText = destroyChance > 0 ? `(실패 시 파괴 확률 ${destroyChance}%)` : '';
}

const mineCost = document.getElementById('mine-enhance-cost');
if (mineCost) mineCost.innerText = getMineEnhanceCost().toLocaleString();

const mineHpText = document.getElementById('mine-rock-hp-text');
if (mineHpText) mineHpText.innerText = `${Math.max(0, Math.floor(gameData.mineRockHp)).toLocaleString()} / ${Math.floor(gameData.mineRockMaxHp).toLocaleString()}`;

const mineHpFill = document.getElementById('mine-rock-hp-fill');
if (mineHpFill) mineHpFill.style.width = Math.max(0, (gameData.mineRockHp / gameData.mineRockMaxHp) * 100) + '%';

setButtonActive(document.getElementById('craft-pickaxe-btn'), !gameData.minePickaxeOwned && gameData.screws >= 100);
setButtonActive(document.getElementById('mine-enhance-btn'), !mineEnhancing && gameData.minePickaxeOwned && gameData.minePickaxeEnhance < 10 && gameData.stones >= getMineEnhanceCost());
setButtonActive(document.getElementById('mine-tier-up-btn'), !mineEnhancing && gameData.minePickaxeOwned && gameData.minePickaxeEnhance >= 10 && gameData.minePickaxeTier < PICKAXE_MAX_TIER);

}


function hasOwnedBusterPartner() {
    return ['blues', 'forte', 'x', 'zero'].some(type => {
        const data = PARTNER_ATTACK_DATA[type];
        return data && gameData[data.ownedKey];
    });
}

function updatePartnerAttackUpgradeUI() {
    const wing = document.getElementById('partner-sync-wing');
    const btn = document.getElementById('partner-sync-wing-btn');
    const hasOwnedPartner = hasOwnedBusterPartner();

    if (wing) {
        wing.classList.toggle('has-owned-partner', hasOwnedPartner);
    }

    if (btn) {
        btn.classList.toggle('active', wing && wing.classList.contains('open'));
    }

    ['blues', 'forte', 'x', 'zero'].forEach(type => {
        const data = PARTNER_ATTACK_DATA[type];
        const row = document.getElementById(`${type}-sync-row`);
        const percent = document.getElementById(`${type}-sync-percent`);
        const gauge = document.getElementById(`${type}-sync-gauge-fill`);
        const chance = document.getElementById(`${type}-sync-chance`);
        const btn = document.getElementById(`${type}-sync-upgrade-btn`);

        if (!data) return;

        const owned = !!gameData[data.ownedKey];
        const sync = getPartnerSyncPercent(type);
        const chanceValue = getPartnerSyncChance(type);

        if (percent) percent.innerText = `${sync}%`;
        if (gauge) gauge.style.width = `${sync}%`;
        if (chance) chance.innerText = `${chanceValue}%`;

        if (row) {
            row.classList.toggle('owned', owned);
            row.classList.toggle('max-sync', sync >= 100);
            row.style.setProperty('--sync', `${sync}%`);
            const frame = row.querySelector('.sync-portrait-frame');
            if (frame) frame.style.setProperty('--sync', `${sync}%`);
        }

        setButtonActive(
            btn,
            !partnerSyncEnhancing && owned && gameData.crystals >= PARTNER_SYNC_UPGRADE_COST && sync < 100
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
    gameData.stones += 1000;

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
startZeroAttack();
startMining();
startBattleTips();
