const defaultData = { 
    screws: 0,
    crystals: 0,
    superRockGem: 0,
    stones: 0,
    materials: {
        cardChip: 0,
        superRockChip: 0
    },

    development: {
        currentLabIndex: 0,
        selectedItem: 'superRock',
        superRockProgress: 0
    },

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

    exeRockmanFragments: 0,
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
    partnerSync: { ...defaultData.partnerSync, ...(savedData.partnerSync || {}) },
    materials: { ...defaultData.materials, ...(savedData.materials || {}) },
    development: { ...defaultData.development, ...(savedData.development || {}) }
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
gameData.materials = { ...defaultData.materials, ...(gameData.materials || {}) };
gameData.materials.cardChip = Math.floor(gameData.materials.cardChip || 0);
gameData.materials.superRockChip = Math.floor(gameData.materials.superRockChip || 0);
gameData.materials = { ...defaultData.materials, ...(gameData.materials || {}) };
Object.keys(defaultData.materials).forEach(key => {
    gameData.materials[key] = Math.max(0, Math.floor(gameData.materials[key] || 0));
});
gameData.development = { ...defaultData.development, ...(gameData.development || {}) };
gameData.development.currentLabIndex = Math.max(0, Math.min(3, Math.floor(gameData.development.currentLabIndex || 0)));
gameData.development.selectedItem = gameData.development.selectedItem || 'superRock';
gameData.development.superRockProgress = Math.max(0, Math.min(30, Math.floor(gameData.development.superRockProgress || 0)));
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
gameData.exeRockmanFragments = Math.floor(gameData.exeRockmanFragments || 0);
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
const EXE_ROCKMAN_REQUIRED_FRAGMENTS = 100;
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

// 투사체 속도 보정 핵심값입니다.
// 모든 원거리 투사체가 같은 체감 속도로 이동하도록 공통 탄속(px/ms)을 사용합니다.
// 값이 클수록 빠릅니다. 0.38은 기존 원거리 탄속보다 약간 정돈된 기준입니다.
const PROJECTILE_MIN_DURATION = 90;
const PROJECTILE_SPEED_PX_PER_MS = 0.38;

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


const BOSS_BATTLE_DATA = {
    classic_cutman: {
        group: 'classic',
        name: '컷맨',
        entryCost: 30,
        hp: 5000,
        atk: 20,
        speed: 0.18,
        attackInterval: 5200,
        cutterSpeed: 0.34,
        cutterDamageMultiplier: 1.15,
        sprite: 'sprites/boss/super-rboss/cutman/cutman_at_01.png',
        attackSprite: 'sprites/boss/super-rboss/cutman/cutman_at_02.png',
        deadSprite: 'sprites/boss/super-rboss/cutman/cutman_dead.png',
        cutterSprite: 'sprites/boss/super-rboss/cutman/cutman_bullet_01.png',
        width: 60,
        height: 60,
        startX: 342,
        bottom: 13,
        marginTop: -8,
        rewards: {
            screwsMin: 180,
            screwsMax: 320,
            cardChipChance: 0.78,
            cardChipMin: 1,
            cardChipMax: 2,
            superRockChipChance: 0.05,
            superRockChipMin: 1,
            superRockChipMax: 1
        }
    }
};

function getBossData(bossKey = currentBossType) {
    return BOSS_BATTLE_DATA[bossKey] || BOSS_BATTLE_DATA.classic_cutman;
}

function rollInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
        busterOffsetX: -13,
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

        shotDuration: 920,
        chargeShotDuration: 680
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
        chargeFramePrefix: 'sprites/partner/x/x_c_bullet_',
        chargeFrameCount: 3,
        chargeFrameInterval: 70,
        attackFrame: 'sprites/partner/x/x_03.png',
        idleFrame: 'sprites/partner/x/x_01.png',

        // 엑스 투사체 위치 조절부입니다.
        // 기준점: x-img의 오른쪽 아래(bottom/right)를 기준으로 총구 중심을 잡습니다.
        // busterOffsetX: 작게 = 왼쪽, 크게 = 오른쪽
        // busterOffsetY: 작게 = 아래쪽, 크게 = 위쪽
        projectilePositionMode: 'muzzle-center',
        muzzleAnchorX: 'right',
        muzzleAnchorY: 'bottom',
        busterOffsetX: -20,
        busterOffsetY: 10,

        // 기본탄/차지탄은 크기가 달라도 같은 중심점에서 발사됩니다.
        bulletWidth: 54,
        bulletHeight: 36,
        chargeBulletWidth: 72,
        chargeBulletHeight: 48,
        chargeEffectWidth: 18,
        chargeEffectHeight: 18,
        chargeEffectOffsetX: 0,
        chargeEffectOffsetY: 0,

        shotDuration: 920,
        chargeShotDuration: 680
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
        defaultSync: 10,
        portrait: 'sprites/partner/rockexe/rockexe_portrait.png',
        areaId: 'rockexe-area',
        imgId: 'rockexe-img',
        bulletClass: 'partner-bullet rockexe-bullet',
        chargeBulletClass: 'partner-bullet rockexe-charge-bullet',
        chargeEffectClass: 'partner-charge-effect rockexe-charge-effect',
        attackFramePrefix: 'sprites/partner/rockexe/rockexe_at_',
        attackFrameCount: 3,
        bulletFramePrefix: null,
        chargeFramePrefix: null,
        attackFrame: 'sprites/partner/rockexe/rockexe_03.png',
        idleFrame: 'sprites/partner/rockexe/rockexe_01.png',

        // 록맨.EXE 투사체 위치 조절부입니다.
        // 기준점: rockexe-img의 오른쪽 아래(bottom/right)를 기준으로 총구 중심을 잡습니다.
        // busterOffsetX: 작게 = 왼쪽, 크게 = 오른쪽
        // busterOffsetY: 작게 = 아래쪽, 크게 = 위쪽
        projectilePositionMode: 'muzzle-center',
        muzzleAnchorX: 'right',
        muzzleAnchorY: 'bottom',
        busterOffsetX: -19,
        busterOffsetY: 8,

        bulletWidth: 54,
        bulletHeight: 36,
        chargeBulletWidth: 48,
        chargeBulletHeight: 48,
        chargeEffectWidth: 18,
        chargeEffectHeight: 18,
        chargeEffectOffsetX: 0,
        chargeEffectOffsetY: 0,

        arcChargeProjectile: true,
        arcHeight: 24,
        shotDuration: 920,
        chargeShotDuration: 1360
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
let cutmanBossActionTimer = null;
let cutmanBossAttacking = false;

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

const rockexeFramePattern = [1, 2, 3, 2];
let rockexeFrameIndex = 0;
let rockexeJoinTimer = null;
let rockexeAttackTimer = null;
let rockexeAttacking = false;
let rockexeAttackAnimating = false;
let rockexeAttackAnimTimer = null;

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
    '스나이퍼 죠는 10스테이지마다 등장합니다.',
    '스나이퍼 죠에게는 버스터 데미지가 반감됩니다.',
    '광산은 일찍 개방할수록 좋아요.',
    '크리스탈은 파트너 소환뿐만 아니라 여러 곳에 쓰입니다.',
    '파트너를 소환하면 전투가 훨씬 수월해집니다.',
    '동료들은 록맨과의 싱크로율에 따라 강해집니다.',
    '보스전에서 다양한 아이템을 얻을 수 있습니다.',
    '피켈맨의 야근수당은 연봉에 포함되어 있습니다.'
];
let battleTipIndex = 0;
let battleTipTimer = null;
let partnerSyncEnhancing = false;

setupStage();

function setupStage() {
    const s = gameData.stage;

    stopSniperJoeActions();
    stopCutmanBossActions();
    document.querySelectorAll('.cutman-boss-cutter, .cutman-cutter-erase-pop').forEach(el => el.remove());
    updateBossBattleTabLockState();

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
        enemyArea.style.removeProperty('--boss-ground-bottom');
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
    updateBossBattleTabLockState();

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

function isCutmanBossBattle() {
    return isBossBattle && currentBossType === 'classic_cutman';
}

function isStillBossBattle() {
    return isSniperJoeBattle() || isCutmanBossBattle();
}

function isSniperJoeBattle() {
    return !isBossBattle && currentEnemyType === 'sniperjoe';
}

function applyStillBattleFrames() {
    if (!isStillBossBattle()) return;

    const rockman = document.getElementById('rockman-img');
    const rushImg = document.getElementById('rush-img');
    const forteImg = document.getElementById('forte-img');
    const xImg = document.getElementById('x-img');
    const rockexeImg = document.getElementById('rockexe-img');
    const zeroImg = document.getElementById('zero-img');

    if (rockman) rockman.src = 'sprites/rock/rock_st.png';
    if (rushImg && gameData.rushOwned) rushImg.src = 'sprites/partner/rush/rush_st.png';
    if (forteImg && gameData.forteOwned && !forteAttacking) forteImg.src = 'sprites/partner/forte/forte_st.png';
    if (xImg && gameData.xOwned && !xAttacking) xImg.src = 'sprites/partner/x/x_st.png';
    if (rockexeImg && gameData.exeRockmanOwned && !rockexeAttacking) rockexeImg.src = 'sprites/partner/rockexe/rockexe_st.png';
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
    if (!isStillBossBattle()) return;

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

        const startX = enemyRect.left - screenRect.left + 2;
        const travel = getEnemyBulletTravel(startX);
        const duration = getEnemyProjectileDuration(travel);

        bullet.animate(
            [{ transform: 'translateX(0)' }, { transform: `translateX(${travel}px)` }],
            { duration, easing: 'linear' }
        );

        setTimeout(() => {
            if (!enemyDead && !playerDead && isSniperJoeBattle()) {
                enemyHitsPlayerByBullet();
            }
            bullet.remove();
        }, duration);

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

    if (isStillBossBattle()) {
        applyStillBattleFrames();

        if (isSniperJoeBattle()) {
            if (!enemyDead && !sniperJoeJumping && !sniperJoeAttacking) {
                eImg.src = ENEMY_TYPE_DATA.sniperjoe.idleFrame;
            }
        } else if (isCutmanBossBattle()) {
            const bossData = getBossData(currentBossType);
            if (!enemyDead && !cutmanBossAttacking) {
                eImg.src = bossData.sprite || 'sprites/boss/super-rboss/cutman/cutman_at_01.png';
            }
        }

        animateBeat();
        animateBlues();
        animateForte();
        animateX();
        animateRockExe();
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
    animateRockExe();
    animateZero();
}


function animateRush() {
    const rushImg = document.getElementById('rush-img');
    if (!rushImg || !gameData.rushOwned) return;

    if (isStillBossBattle()) {
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

  if (isStillBossBattle()) {
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

  if (isStillBossBattle()) {
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

  if (isStillBossBattle()) {
    if (!xAttacking) xImg.src = 'sprites/partner/x/x_st.png';
    return;
  }

  const frame = xFramePattern[xFrameIndex];
  xImg.src = `sprites/partner/x/x_0${frame}.png`;

  xFrameIndex = (xFrameIndex + 1) % xFramePattern.length;
}

function animateRockExe() {
  const rockexeImg = document.getElementById('rockexe-img');
  if (!rockexeImg || !gameData.exeRockmanOwned || rockexeAttackAnimating) return;

  if (isStillBossBattle()) {
    if (!rockexeAttacking) rockexeImg.src = 'sprites/partner/rockexe/rockexe_st.png';
    return;
  }

  const frame = rockexeFramePattern[rockexeFrameIndex];
  rockexeImg.src = `sprites/partner/rockexe/rockexe_0${frame}.png`;

  rockexeFrameIndex = (rockexeFrameIndex + 1) % rockexeFramePattern.length;
}

function animateZero() {
  const zeroImg = document.getElementById('zero-img');
  if (!zeroImg || !gameData.zeroOwned || zeroAttacking) return;

  if (isStillBossBattle()) {
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

function startExeRockmanAttack() {
  if (rockexeAttackTimer) clearInterval(rockexeAttackTimer);

  rockexeAttackTimer = setInterval(() => {
    if (!gameData.exeRockmanOwned || enemyDead || playerDead || rockexeAttacking) return;

    firePartnerBuster('exeRockman');
  }, gameData.partnerAtkSpd);
}

function startZeroAttack() {
  if (zeroAttackTimer) clearInterval(zeroAttackTimer);

  zeroAttackTimer = setInterval(() => {
    if (!gameData.zeroOwned || enemyDead || playerDead || zeroAttacking) return;

    zeroMeleeAttack();
  }, Math.floor(gameData.partnerAtkSpd * ZERO_ATTACK_INTERVAL_MULTIPLIER));
}


function spawnZeroAfterimage() {
    const zeroImg = document.getElementById('zero-img');
    const screen = document.querySelector('.game-screen');
    if (!zeroImg || !screen || !gameData.zeroOwned) return;

    const screenRect = screen.getBoundingClientRect();
    const zeroRect = zeroImg.getBoundingClientRect();

    const ghost = document.createElement('img');
    ghost.className = 'zero-afterimage';
    ghost.src = zeroImg.src;
    ghost.style.left = (zeroRect.left - screenRect.left) + 'px';
    ghost.style.bottom = (screenRect.bottom - zeroRect.bottom) + 'px';
    ghost.style.width = zeroRect.width + 'px';
    ghost.style.height = zeroRect.height + 'px';

    screen.appendChild(ghost);
    setTimeout(() => ghost.remove(), 360);
}

function startZeroAfterimageTrail(duration = 420, interval = 58) {
    spawnZeroAfterimage();
    const trailTimer = setInterval(spawnZeroAfterimage, interval);
    setTimeout(() => clearInterval(trailTimer), duration);
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
        startZeroAfterimageTrail(380, 55);
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
        startZeroAfterimageTrail(500, 60);

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

function playPartnerChargeAttackAnimation(type) {
    if (type !== 'exeRockman') return;

    const img = document.getElementById('rockexe-img');
    if (!img) return;

    if (rockexeAttackAnimTimer) {
        clearInterval(rockexeAttackAnimTimer);
        rockexeAttackAnimTimer = null;
    }

    rockexeAttackAnimating = true;
    let frame = 1;
    img.src = 'sprites/partner/rockexe/rockexe_at_01.png';

    rockexeAttackAnimTimer = setInterval(() => {
        frame++;
        if (frame <= 3) {
            img.src = `sprites/partner/rockexe/rockexe_at_0${frame}.png`;
            return;
        }

        clearInterval(rockexeAttackAnimTimer);
        rockexeAttackAnimTimer = null;
        rockexeAttackAnimating = false;
        if (isSniperJoeBattle() && gameData.exeRockmanOwned) {
            img.src = 'sprites/partner/rockexe/rockexe_st.png';
        }
    }, 90);
}

function getArcProjectileHeight(travel, data) {
    const minHeight = Math.max(12, data.arcHeightMin || data.arcHeight || 20);
    const maxHeight = Math.max(minHeight, data.arcHeightMax || Math.max(minHeight, (data.arcHeight || 20) + 10));
    const distanceFactor = Math.max(0, Math.min(1, Math.abs(travel) / 260));
    return Math.round(minHeight + (maxHeight - minHeight) * distanceFactor);
}

function buildArcKeyframes(travel, arcHeight) {
    return [
        { transform: 'translate(0px, 0px)', offset: 0 },
        { transform: `translate(${Math.round(travel * 0.12)}px, -${Math.round(arcHeight * 0.34)}px)`, offset: 0.12 },
        { transform: `translate(${Math.round(travel * 0.28)}px, -${Math.round(arcHeight * 0.72)}px)`, offset: 0.28 },
        { transform: `translate(${Math.round(travel * 0.48)}px, -${Math.round(arcHeight)}px)`, offset: 0.48 },
        { transform: `translate(${Math.round(travel * 0.68)}px, -${Math.round(arcHeight * 0.74)}px)`, offset: 0.68 },
        { transform: `translate(${Math.round(travel * 0.84)}px, -${Math.round(arcHeight * 0.34)}px)`, offset: 0.84 },
        { transform: `translate(${Math.round(travel * 0.94)}px, -${Math.round(arcHeight * 0.08)}px)`, offset: 0.94 },
        { transform: `translate(${travel}px, 0px)`, offset: 1 }
    ];
}

function createProjectileExplosion(screen, centerX, centerY, radius = 40) {
    if (!screen) return;

    const explosion = document.createElement('div');
    explosion.className = 'projectile-explosion rockexe-explosion';
    explosion.style.left = (centerX - radius / 2) + 'px';
    explosion.style.bottom = (centerY - radius / 2) + 'px';
    explosion.style.width = radius + 'px';
    explosion.style.height = radius + 'px';
    screen.appendChild(explosion);

    const particleCount = 8;
    for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const dist = Math.round(radius * (0.38 + ((i % 3) * 0.12)));
        const particle = document.createElement('div');
        particle.className = 'projectile-explosion-particle rockexe-explosion-particle';
        particle.style.left = centerX + 'px';
        particle.style.bottom = centerY + 'px';
        const dx = Math.round(Math.cos(angle) * dist);
        const dy = Math.round(Math.sin(angle) * dist);
        particle.style.setProperty('--tx', `${dx}px`);
        // CSS translateY는 양수가 아래 방향이므로, 수학 좌표계의 위쪽(+dy)을 브라우저 좌표계에서는 음수로 변환합니다.
        // calc(var(--y) * -1) 같은 표현은 Chrome에서 애니메이션이 무시될 수 있어 JS에서 미리 계산합니다.
        particle.style.setProperty('--ty', `${-dy}px`);
        screen.appendChild(particle);
        setTimeout(() => particle.remove(), 460);
    }

    setTimeout(() => explosion.remove(), 320);
}

function getEnemyImpactPoint() {
    const screen = document.querySelector('.game-screen');
    const enemy = document.getElementById('enemy-img');
    if (!screen || !enemy) return null;

    const screenRect = screen.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    // 폭발도 적의 실제 렌더링 중앙에 맞춥니다.
    return {
        x: enemyRect.left - screenRect.left + enemyRect.width / 2,
        y: screenRect.bottom - enemyRect.bottom + enemyRect.height / 2
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
    if (type === 'exeRockman') rockexeAttacking = true;

    const isChargeShot = Math.random() * 100 < gameData.critChance;
    const pos = getPartnerBusterPosition(type);
    if (!pos) {
        if (type === 'forte') forteAttacking = false;
        if (type === 'x') xAttacking = false;
        if (type === 'exeRockman') rockexeAttacking = false;
        return;
    }

    const finishAttack = () => {
        if (type === 'forte') forteAttacking = false;
        if (type === 'x') xAttacking = false;
        if (type === 'exeRockman') {
            rockexeAttacking = false;
        }
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

        // 이동 거리는 실제 렌더링된 투사체의 앞쪽 끝 기준으로 계산합니다.
        // 모든 불렛 PNG를 50x50으로 만들거나 CSS 크기를 바꿔도 자동으로 맞습니다.
        const bulletFrontX = getElementFrontX(bullet);
        const travel = getBulletTravel(bulletFrontX);
        const duration = getPlayerProjectileDuration(bulletFrontX, travel);

        const shouldExplodeOnImpact = type === 'exeRockman' && isChargeShot && data.arcChargeProjectile;

        if (isChargeShot && data.arcChargeProjectile) {
            const arcHeight = getArcProjectileHeight(travel, data);
            bullet.animate(
                buildArcKeyframes(travel, arcHeight),
                { duration, easing: 'linear' }
            );
        } else {
            bullet.animate(
                [{ transform: 'translateX(0)' }, { transform: `translateX(${travel}px)` }],
                { duration, easing: 'linear' }
            );
        }

        setTimeout(() => {
            if (chargeFrameTimer) clearInterval(chargeFrameTimer);

            let hit = false;
            if (!enemyDead && !playerDead) {
                hit = applyPartnerDamage(type, isChargeShot);
                if (hit && !enemyDead) playEnemyHit(enemy);
            }

            if (shouldExplodeOnImpact) {
                const impactPoint = getEnemyImpactPoint();
                if (impactPoint) {
                    createProjectileExplosion(screen, impactPoint.x, impactPoint.y, data.explosionRadius || 40);
                }
            }

            bullet.remove();
            finishAttack();
        }, duration);
    };

    if (isChargeShot) {
        playPartnerChargeAttackAnimation(type);

        if (type === 'exeRockman') {
            setTimeout(() => {
                shoot();
            }, 170);
            return;
        }

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
        if (isSniperJoeBattle() || isCutmanBossBattle()) return;

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
    flashAllyCharacter('rockexe-img', gameData.exeRockmanOwned);
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

    const wasBossBattle = isBossBattle;
    const failedBossType = currentBossType;

    playerDead = true;
    enemyDead = true;
    enemyAttacking = true;

    stopSniperJoeActions();
    stopCutmanBossActions();
    updateBossBattleTabLockState();
    playRockmanDeathEffect();

    setTimeout(() => {
        if (wasBossBattle) {
            showStageText("패배");
        } else if (gameData.stage > 1) {
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

    // 적 스프라이트도 CSS 렌더링 크기가 달라질 수 있으므로,
    // 실제 화면에 보이는 적 이미지의 중앙을 탄 도착/삭제 기준으로 사용합니다.
    const impactX = enemyRect.left - screenRect.left + enemyRect.width / 2;

    return Math.max(28, impactX - startX);
}

function getEnemyBulletTravel(startX) {
    const rockman = document.getElementById('rockman-img') || document.getElementById('rockman-area');
    const screen = document.querySelector('.game-screen');

    if (!rockman || !screen) return -120;

    const screenRect = screen.getBoundingClientRect();
    const rockRect = rockman.getBoundingClientRect();

    // 스나이퍼죠 탄도 너무 앞에서 사라지지 않도록
    // 실제 화면에 보이는 록맨 스프라이트 중앙을 도착/삭제 기준으로 사용합니다.
    const impactX = rockRect.left - screenRect.left + rockRect.width / 2;

    return Math.min(-28, impactX - startX);
}

function getProjectileDurationBySpeed(travel, speed = PROJECTILE_SPEED_PX_PER_MS, minDuration = PROJECTILE_MIN_DURATION) {
    return Math.max(minDuration, Math.round(Math.abs(travel) / Math.max(0.01, speed)));
}

function getPlayerProjectileDuration(startX, travel, referenceDuration = null, minDuration = PROJECTILE_MIN_DURATION) {
    return getProjectileDurationBySpeed(travel, PROJECTILE_SPEED_PX_PER_MS, minDuration);
}

function getEnemyProjectileDuration(currentTravel, currentEnemyLeft = null, referenceEnemyLeft = null, referenceDuration = null, minDuration = PROJECTILE_MIN_DURATION) {
    return getProjectileDurationBySpeed(currentTravel, PROJECTILE_SPEED_PX_PER_MS, minDuration);
}

function getElementFrontX(element) {
    const screen = document.querySelector('.game-screen');
    if (!screen || !element) return 0;

    const screenRect = screen.getBoundingClientRect();
    const rect = element.getBoundingClientRect();

    // 아군 탄은 오른쪽으로 날아가므로 실제 렌더링된 오른쪽 끝을 앞쪽으로 봅니다.
    return rect.right - screenRect.left;
}

function getElementCenterX(element) {
    const screen = document.querySelector('.game-screen');
    if (!screen || !element) return 0;

    const screenRect = screen.getBoundingClientRect();
    const rect = element.getBoundingClientRect();

    return rect.left - screenRect.left + rect.width / 2;
}

const ROCK_BULLET_OFFSET_X = -25;
const ROCK_BULLET_OFFSET_Y = -14;
const ROCK_CHARGE_BULLET_OFFSET_Y = -20;
const ROCK_NORMAL_BULLET_DURATION = 620;
const ROCK_CHARGE_BULLET_DURATION = 460;

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

    // 실제 렌더링된 탄의 앞쪽 끝 기준으로 이동거리를 계산합니다.
    // PNG 원본 크기/CSS 표시 크기가 바뀌어도 자동으로 맞습니다.
    const bulletFrontX = getElementFrontX(bullet);
    const travel = getBulletTravel(bulletFrontX);
    const duration = getPlayerProjectileDuration(bulletFrontX, travel);

    bullet.animate(
        [{ transform: 'translateX(0)' }, { transform: `translateX(${travel}px)` }],
        { duration, easing: 'linear' }
    );

    setTimeout(() => {
        const hit = applyDamage(false);
        if (hit && !enemyDead) playEnemyHit(enemy);
        bullet.remove();
    }, duration);
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
        // 차지샷도 실제 렌더링된 탄의 앞쪽 끝 기준으로 충돌 지점을 맞춥니다.
        const bulletFrontX = getElementFrontX(bullet);
        const travel = getBulletTravel(bulletFrontX);
        const duration = getPlayerProjectileDuration(bulletFrontX, travel);

        bullet.animate(
            [{ transform: 'translateX(0)' }, { transform: `translateX(${travel}px)` }],
            { duration, easing: 'linear' }
        );

        setTimeout(() => {
            clearInterval(chargeBulletTimer);
            const hit = applyDamage(true);
            if (hit && !enemyDead) playEnemyHit(enemy);
            bullet.remove();
        }, duration);
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


function giveBossBattleReward(displayDelay = 0) {
    const bossData = getBossData(currentBossType);
    const rewards = bossData?.rewards || {};

    const screws = rollInt(rewards.screwsMin || 180, rewards.screwsMax || 320);
    gameData.screws += screws;

    const rewardData = {
        screws,
        cardChip: 0,
        superRockChip: 0
    };

    if (Math.random() < (rewards.cardChipChance ?? 0.78)) {
        const amount = rollInt(rewards.cardChipMin || 1, rewards.cardChipMax || 2);
        gameData.materials.cardChip += amount;
        rewardData.cardChip = amount;
    }

    if (Math.random() < (rewards.superRockChipChance ?? 0.05)) {
        const amount = rollInt(rewards.superRockChipMin || 1, rewards.superRockChipMax || 1);
        gameData.materials.superRockChip += amount;
        rewardData.superRockChip = amount;
    }

    if (displayDelay > 0) {
        setTimeout(() => {
            showRewardText(rewardData);
        }, displayDelay);
    } else {
        showRewardText(rewardData);
    }
}

function killEnemy() {
    if (enemyDead || playerDead) return;

    enemyDead = true;
    enemyHp = 0;
    stopSniperJoeActions();
    stopCutmanBossActions();
    updateBossBattleTabLockState();

    if (isBossBattle && BOSS_BATTLE_DATA[currentBossType]) {
        const deathDelay = currentBossType === 'classic_cutman'
            ? playCutmanBossDeathEffect()
            : (playEnemyDeathEffect(), 500);

        if (currentBossType === 'classic_cutman') {
            giveBossBattleReward(Math.max(0, (deathDelay || 500) - 260));
        } else {
            giveBossBattleReward();
        }

        setTimeout(() => {
            setupStage();
            showStageText("BOSS CLEAR");
            updateUI();
            saveData();
        }, deathDelay || 500);

        return;
    }

    if (isBossBattle && currentBossType) {
        const bossData = getBossData(currentBossType);
        const rewards = bossData.rewards || {};
        const screwReward = rollInt(rewards.screwsMin || 120, rewards.screwsMax || 220);
        let rewardParts = [`+${screwReward}🔩`];

        gameData.screws += screwReward;

        if (Math.random() < (rewards.cardChipChance || 0)) {
            const amount = rollInt(rewards.cardChipMin || 1, rewards.cardChipMax || 1);
            gameData.materials.cardChip += amount;
            rewardParts.push(`카드칩 +${amount}`);
        }

        if (Math.random() < (rewards.superRockChipChance || 0)) {
            const amount = rollInt(rewards.superRockChipMin || 1, rewards.superRockChipMax || 1);
            gameData.materials.superRockChip += amount;
            rewardParts.push(`슈퍼록맨칩 +${amount}`);
        }

        playEnemyDeathEffect();
        showRewardText(rewardParts.join(' / '));

        setTimeout(() => {
            setupStage();
            showStageText(`${bossData.name} CLEAR`);
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


function playCutmanBossDeathEffect() {
    const enemy = document.getElementById('enemy-img');
    const enemyArea = document.getElementById('enemy-area');
    const screen = document.querySelector('.game-screen');
    const bossData = getBossData(currentBossType);

    if (!enemy || !enemyArea || !screen) return 0;

    const screenRect = screen.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    const centerX = enemyRect.left - screenRect.left + enemyRect.width / 2;
    const centerY = screenRect.bottom - enemyRect.top - enemyRect.height / 2;

    enemy.classList.remove('boss-enter', 'enemy-death', 'cutman-dead-blink', 'cutman-death-fade');
    enemy.style.opacity = '1';
    enemy.style.transform = '';
    enemy.src = bossData.deadSprite || 'sprites/boss/super-rboss/cutman/cutman_dead.png';

    setTimeout(() => {
        if (!enemy.isConnected) return;
        enemy.classList.add('cutman-dead-blink');
    }, 840);

    setTimeout(() => {
        if (!enemy.isConnected) return;
        enemy.classList.remove('cutman-dead-blink');
        enemy.classList.add('cutman-death-fade');

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
            p.className = 'cutman-death-particle';
            p.style.left = centerX + "px";
            p.style.bottom = centerY + "px";
            p.style.setProperty('--x', pos[0] + 'px');
            p.style.setProperty('--y', pos[1] + 'px');
            screen.appendChild(p);

            setTimeout(() => {
                p.remove();
            }, 2200);
        });
    }, 2360);

    setTimeout(() => {
        if (!enemy.isConnected) return;
        enemy.classList.remove('cutman-dead-blink');
        enemy.classList.remove('cutman-death-fade');
        enemy.style.opacity = '0';
    }, 3720);

    return 3800;
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

    if (typeof reward === 'number') {
        text.innerText = `+${reward}🔩`;
    } else if (typeof reward === 'string') {
        text.innerText = reward;
    } else if (reward && typeof reward === 'object') {
        const parts = [];
        parts.push(`<span class="reward-inline-item reward-inline-screw">+${reward.screws || 0}🔩</span>`);

        if (reward.cardChip) {
            parts.push(
                `<span class="reward-inline-item"><img class="reward-inline-icon" src="sprites/boss/reward/cardchip.png" alt="카드칩"> 카드칩 +${reward.cardChip}</span>`
            );
        }

        if (reward.superRockChip) {
            parts.push(
                `<span class="reward-inline-item"><img class="reward-inline-icon" src="sprites/boss/reward/superrockchip.png" alt="슈퍼록맨 데이터칩"> 슈퍼록맨 데이터칩 +${reward.superRockChip}</span>`
            );
        }

        text.innerHTML = parts.join(`<span class="reward-sep"> / </span>`);
    } else {
        text.innerText = "";
    }

    const screenWidth = screen ? (screen.clientWidth || 320) : 320;
    const boxWidth = 260;
    const preferredLeft = enemyX - 78;
    const safeLeft = Math.min(Math.max(24, preferredLeft), Math.max(24, screenWidth - boxWidth - 14));

    text.style.left = safeLeft + "px";
    text.style.right = "auto";
    text.style.bottom = "42px";
    text.style.maxWidth = boxWidth + "px";
    text.style.width = boxWidth + "px";
    text.style.whiteSpace = "normal";
    text.style.lineHeight = "1.28";
    text.style.textAlign = "center";

    screen.appendChild(text);
    setTimeout(() => text.remove(), 1800);
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
                startExeRockmanAttack();
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

function buyExeRockmanFragment(amount) {
  if (gameData.exeRockmanOwned) return;
  if (gameData.crystals < amount) return;

  gameData.crystals -= amount;
  gameData.exeRockmanFragments += amount;

  if (gameData.exeRockmanFragments > EXE_ROCKMAN_REQUIRED_FRAGMENTS) {
    gameData.exeRockmanFragments = EXE_ROCKMAN_REQUIRED_FRAGMENTS;
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

    if (type === 'exeRockman') {
        text.innerText = 'ROCKMAN.EXE JOIN!';
        rushImg.style.display = 'none';
        beatImg.src = 'sprites/partner/rockexe/rockexe_join_01.png';
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

function summonExeRockman() {
    if (gameData.exeRockmanOwned) return;
    if (gameData.exeRockmanFragments < EXE_ROCKMAN_REQUIRED_FRAGMENTS) return;

    gameData.exeRockmanOwned = true;

    const popupData = prepareSummonPopup('exeRockman');
    if (!popupData) {
        updateUI();
        saveData();
        return;
    }

    const { beatImg } = popupData;
    let exeJoinFrame = 1;

    beatImg.src = 'sprites/partner/rockexe/rockexe_join_01.png';
    beatImg.style.setProperty('width', '54px', 'important');
    beatImg.style.setProperty('height', '54px', 'important');
    beatImg.style.transform = 'translateX(-50%)';
    beatImg.classList.remove('rush-drop', 'join-drop');

    if (rockexeJoinTimer) clearInterval(rockexeJoinTimer);

    rockexeJoinTimer = setInterval(() => {
        exeJoinFrame++;

        if (exeJoinFrame <= 6) {
            beatImg.src = `sprites/partner/rockexe/rockexe_join_0${exeJoinFrame}.png`;
        } else {
            clearInterval(rockexeJoinTimer);
            rockexeJoinTimer = null;
            beatImg.src = 'sprites/partner/rockexe/rockexe_join_06.png';
        }
    }, 120);

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

    if (rockexeJoinTimer) {
        clearInterval(rockexeJoinTimer);
        rockexeJoinTimer = null;
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


function updateBossBattleTabLockState() {
    const isLocked = isBossBattle && !enemyDead && !playerDead;
    const lockIds = ['mine-tab-btn', 'armor-tab-btn', 'boss-tab-btn', 'partner-tab-btn'];

    lockIds.forEach(id => {
        const btn = document.getElementById(id);
        if (!btn) return;

        btn.disabled = isLocked;
        btn.classList.toggle('boss-battle-tab-locked', isLocked);
        btn.title = isLocked ? '보스전 중에는 다른 탭으로 이동할 수 없습니다.' : '';
    });
}

function showBossBattleLockedMessage() {
    showStageText('보스전 진행 중');
}



const DEVELOPMENT_LAB_DATA = [
    {
        key: 'classic',
        name: '클래식 보스전',
        sectionName: '클래식 개발 항목',
        hint: '클래식 보스전에서 데이터칩을 수급합니다.',
        bg: 'sprites/background/development_lab_bg.png',
        sprite: 'sprites/background/lab_classic.png'
    },
    {
        key: 'x',
        name: 'X 보스전',
        sectionName: 'X 개발 항목',
        hint: '이레귤러 보스 개발 항목은 다음 단계에서 열립니다.',
        bg: 'sprites/background/development_lab_bg.png',
        sprite: 'sprites/background/lab_x.png'
    },
    {
        key: 'exe',
        name: 'EXE 보스전',
        sectionName: 'EXE 개발 항목',
        hint: '바이러스 내비 개발 항목은 다음 단계에서 열립니다.',
        bg: 'sprites/background/development_lab_bg.png',
        sprite: 'sprites/background/lab_exe.png'
    },
    {
        key: 'starforce',
        name: 'STAR FORCE',
        sectionName: '유성록맨 개발 항목',
        hint: '스타포스 개발 항목은 다음 단계에서 열립니다.',
        bg: 'sprites/background/development_lab_bg.png',
        sprite: 'sprites/background/lab_starforce.png'
    }
];

const DEVELOPMENT_SUPER_ROCK_REQUIRED_CHIPS = 30;

let superRockDevSpriteAnimTimer = null;
let superRockDevSpriteAnimToken = 0;

function getSuperRockDevelopmentFrame(frame) {
    return `sprites/armor/super-r/super_r_${String(frame).padStart(2, '0')}.png`;
}

function playSuperRockDevelopmentSpriteIntro(force = false) {
    const img = document.getElementById('super-rock-dev-sprite');
    if (!img) return;

    // 기존 interval 방식은 다른 UI 갱신과 겹칠 때 프레임이 튀어 보일 수 있어,
    // 단일 setTimeout 체인으로 1 → 7을 정확히 한 번만 재생합니다.
    superRockDevSpriteAnimToken += 1;
    const token = superRockDevSpriteAnimToken;

    if (superRockDevSpriteAnimTimer) {
        clearTimeout(superRockDevSpriteAnimTimer);
        superRockDevSpriteAnimTimer = null;
    }

    let frame = 1;
    img.src = getSuperRockDevelopmentFrame(frame);

    const step = () => {
        if (token !== superRockDevSpriteAnimToken) return;

        frame += 1;
        if (frame >= 7) {
            img.src = getSuperRockDevelopmentFrame(7);
            superRockDevSpriteAnimTimer = null;
            return;
        }

        img.src = getSuperRockDevelopmentFrame(frame);
        superRockDevSpriteAnimTimer = setTimeout(step, 280);
    };

    superRockDevSpriteAnimTimer = setTimeout(step, 280);
}

function getCurrentDevelopmentLab() {
    const index = Math.max(0, Math.min(DEVELOPMENT_LAB_DATA.length - 1, Math.floor(gameData.development?.currentLabIndex || 0)));
    return DEVELOPMENT_LAB_DATA[index] || DEVELOPMENT_LAB_DATA[0];
}

function changeDevelopmentLab(delta = 1, event = null) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    if (!gameData.development) gameData.development = { ...defaultData.development };
    const total = DEVELOPMENT_LAB_DATA.length;
    const current = Math.max(0, Math.min(total - 1, Math.floor(gameData.development.currentLabIndex || 0)));
    gameData.development.currentLabIndex = (current + delta + total) % total;
    gameData.development.selectedItem = gameData.development.currentLabIndex === 0 ? 'superRock' : '';

    updateDevelopmentLabUI();
    if (getCurrentDevelopmentLab().key === 'classic') {
        playSuperRockDevelopmentSpriteIntro(true);
    }
    saveData();
}

function openDevelopmentGroup() {
    if (!gameData.development) gameData.development = { ...defaultData.development };
    const lab = getCurrentDevelopmentLab();
    if (lab.key === 'classic' && !gameData.development.selectedItem) {
        gameData.development.selectedItem = 'superRock';
    }

    const panel = document.getElementById('development-item-panel');
    if (panel) panel.classList.add('open');

    updateDevelopmentLabUI();
    if (getCurrentDevelopmentLab().key === 'classic') {
        playSuperRockDevelopmentSpriteIntro(true);
    }
    saveData();
}

function selectDevelopmentItem(itemKey) {
    if (!gameData.development) gameData.development = { ...defaultData.development };
    gameData.development.selectedItem = itemKey;
    updateDevelopmentLabUI();
    if (itemKey === 'superRock' && getCurrentDevelopmentLab().key === 'classic') {
        playSuperRockDevelopmentSpriteIntro(true);
    }
    saveData();
}

function upgradeSuperRockDevelopment(event = null) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    if (!gameData.development) gameData.development = { ...defaultData.development };

    const progress = Math.max(0, Math.min(DEVELOPMENT_SUPER_ROCK_REQUIRED_CHIPS, Math.floor(gameData.development.superRockProgress || 0)));
    if (progress >= DEVELOPMENT_SUPER_ROCK_REQUIRED_CHIPS) return;
    if (!gameData.materials) gameData.materials = { ...defaultData.materials };
    if ((gameData.materials.superRockChip || 0) <= 0) return;

    gameData.materials.superRockChip = Math.max(0, Math.floor(gameData.materials.superRockChip || 0) - 1);
    gameData.development.superRockProgress = Math.min(DEVELOPMENT_SUPER_ROCK_REQUIRED_CHIPS, progress + 1);

    const card = document.getElementById('development-super-rock-card');
    if (card) {
        card.classList.remove('developing', 'complete-pulse');
        void card.offsetWidth;
        card.classList.add(gameData.development.superRockProgress >= DEVELOPMENT_SUPER_ROCK_REQUIRED_CHIPS ? 'complete-pulse' : 'developing');
        setTimeout(() => card.classList.remove('developing', 'complete-pulse'), 720);
    }

    updateUI();
    saveData();
}

function updateDevelopmentLabUI() {
    if (!gameData.development) gameData.development = { ...defaultData.development };
    const lab = getCurrentDevelopmentLab();
    const isClassic = lab.key === 'classic';

    const bg = document.getElementById('development-lab-bg');
    if (bg) {
        bg.style.backgroundImage = `url("${lab.bg}")`;
        bg.dataset.lab = lab.key;
    }

    const centerSprite = document.getElementById('development-center-sprite');
    if (centerSprite) {
        centerSprite.src = lab.sprite;
        centerSprite.alt = lab.name;
    }

    const nameEl = document.getElementById('development-lab-name');
    if (nameEl) nameEl.innerText = lab.name;

    const sectionName = document.getElementById('development-section-name');
    if (sectionName) sectionName.innerText = lab.sectionName;

    const sectionHint = document.getElementById('development-section-hint');
    if (sectionHint) sectionHint.innerText = lab.hint;

    const classicList = document.getElementById('development-classic-list');
    const placeholderList = document.getElementById('development-placeholder-list');
    if (classicList) classicList.classList.toggle('active', isClassic);
    if (placeholderList) placeholderList.classList.toggle('active', !isClassic);

    const placeholderTitle = document.getElementById('development-placeholder-title');
    if (placeholderTitle) placeholderTitle.innerText = `${lab.name} 준비중`;
    const placeholderDesc = document.getElementById('development-placeholder-desc');
    if (placeholderDesc) placeholderDesc.innerText = lab.hint;

    document.querySelectorAll('.development-upgrade-card').forEach(card => card.classList.remove('selected'));
    const selectedMap = {
        superRock: 'development-super-rock-card',
        bluesBuster: 'development-blues-buster-card',
        superForte: 'development-super-forte-card'
    };
    const selectedCard = document.getElementById(selectedMap[gameData.development.selectedItem] || 'development-super-rock-card');
    if (selectedCard && isClassic) selectedCard.classList.add('selected');

    const chipCount = Math.max(0, Math.floor(gameData.materials?.superRockChip || 0));
    const chipCountEl = document.getElementById('dev-superrock-chip-count');
    if (chipCountEl) chipCountEl.innerText = chipCount.toLocaleString();

    const progress = Math.max(0, Math.min(DEVELOPMENT_SUPER_ROCK_REQUIRED_CHIPS, Math.floor(gameData.development.superRockProgress || 0)));
    const progressText = document.getElementById('super-rock-dev-progress-text');
    if (progressText) progressText.innerText = `${progress} / ${DEVELOPMENT_SUPER_ROCK_REQUIRED_CHIPS}`;

    const boxes = document.querySelectorAll('#super-rock-dev-gauge .development-progress-box');
    boxes.forEach((box, index) => {
        box.classList.toggle('filled', index < progress);
    });

    const btn = document.getElementById('super-rock-dev-btn');
    if (btn) {
        const complete = progress >= DEVELOPMENT_SUPER_ROCK_REQUIRED_CHIPS;
        const canUpgrade = !complete && chipCount > 0;
        btn.disabled = !canUpgrade;
        btn.classList.toggle('active', canUpgrade);
        btn.innerText = complete ? '완료' : '개발';
        btn.title = complete ? '슈퍼록맨 개발 완료' : (canUpgrade ? '슈퍼록맨 데이터칩 1개를 투입합니다.' : '슈퍼록맨 데이터칩이 부족합니다.');
    }

    const superRockCard = document.getElementById('development-super-rock-card');
    if (superRockCard) {
        superRockCard.classList.toggle('complete', progress >= DEVELOPMENT_SUPER_ROCK_REQUIRED_CHIPS);
    }

}


function showTab(tabName) {
    if (isBossBattle && !enemyDead && !playerDead && tabName !== 'battle') {
        updateBossBattleTabLockState();
        showBossBattleLockedMessage();
        return;
    }

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

    if (tabName === 'armor') {
        setTimeout(() => {
            updateDevelopmentLabUI();
            if (getCurrentDevelopmentLab().key === 'classic') {
                playSuperRockDevelopmentSpriteIntro(true);
            }
        }, 0);
    }

    if (tabName === 'boss' && typeof normalizeCutmanBossCardUI === 'function') {
        setTimeout(normalizeCutmanBossCardUI, 0);
    }

    if (tabName === 'boss' && typeof normalizeBossTabLayoutV5 === 'function') {
        setTimeout(normalizeBossTabLayoutV5, 0);
    }

    if (tabName === 'boss' && typeof startCutmanPreviewV14 === 'function') {
        setTimeout(startCutmanPreviewV14, 0);
    }
}

function showArmorTab(type) {
    const armorImg = document.querySelector('#armor-tab .armor-main-image') || document.getElementById('armor-img');
    const armorName = document.getElementById('armor-name');

    const armorData = {
        'super-r': { name: '슈퍼록맨', img: 'sprites/armor/super-r/super-r.png' },
        'first': { name: '퍼스트아머', img: 'sprites/armor/super-r/super-r.png' },
        'second': { name: '세컨드아머', img: 'sprites/armor/super-r/super-r.png' },
        'third': { name: '서드아머', img: 'sprites/armor/super-r/super-r.png' },
        'fourth': { name: '포스아머', img: 'sprites/armor/super-r/super-r.png' }
    };

    if (!armorData[type]) return;

    if (armorImg) armorImg.src = armorData[type].img;
    if (armorName) armorName.innerText = armorData[type].name;

    document.querySelectorAll('#armor-tab .inner-tab').forEach(btn => {
        btn.classList.remove('active');
    });

    const activeBtn = document.querySelector(`#armor-tab .inner-tab[onclick*="${type}"]`);
    if (activeBtn) activeBtn.classList.add('active');
}

function toggleBossGroup(groupKey) {
    document.querySelectorAll('.boss-group-panel').forEach(panel => {
        panel.classList.remove('open');
    });
    document.querySelectorAll('.boss-category-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const panel = document.getElementById(`boss-group-${groupKey}`);
    const btn = document.getElementById(`boss-group-${groupKey}-btn`);

    if (panel) panel.classList.add('open');
    if (btn) btn.classList.add('active');
}

function showBossCardMessage(message) {
    const card =
        document.getElementById('boss-card-cutman') ||
        document.querySelector('.cutman-card') ||
        document.querySelector('.boss-select-card');

    if (!card) {
        showStageText(message);
        return;
    }

    let messageBox = card.querySelector('.boss-card-message');
    if (!messageBox) {
        messageBox = document.createElement('div');
        messageBox.className = 'boss-card-message';
        card.appendChild(messageBox);
    }

    messageBox.textContent = message;
    messageBox.classList.remove('active');
    void messageBox.offsetWidth;
    messageBox.classList.add('active');

    setTimeout(() => {
        messageBox.classList.remove('active');
    }, 900);
}

function selectBossCard(bossKey = 'classic_cutman') {
    const bossData = getBossData(bossKey);
    if (!bossData) return;

    if (gameData.crystals < bossData.entryCost) {
        showBossCardMessage('크리스탈 부족');
        return;
    }

    const card =
        document.getElementById('boss-card-cutman') ||
        document.getElementById(`${bossKey}-card`) ||
        document.querySelector(`[data-boss-key="${bossKey}"]`) ||
        document.querySelector('.boss-select-card');

    if (card) {
        card.classList.remove('selecting');
        void card.offsetWidth;
        card.classList.add('selecting');
    }

    setTimeout(() => {
        if (card) card.classList.remove('selecting');
        enterBossBattle(bossKey);
    }, 380);
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

function enterBossBattle(bossKey = 'classic_cutman') {
  const bossData = getBossData(bossKey);
  if (!bossData) return;

  if (gameData.crystals < bossData.entryCost) {
    showBossCardMessage('크리스탈 부족');
    updateUI();
    return;
  }

  gameData.crystals -= bossData.entryCost;
  saveData();
  updateUI();

  showTab('battle');

  showBossWarning(() => {

    isBossBattle = true;
    currentBossType = bossKey;
    currentEnemyType = null;
    stopSniperJoeActions();

    const screen = document.querySelector('.game-screen');
    if (screen) {
      screen.classList.remove('sniperjoe-mode');
      screen.classList.add('boss-mode');
    }

    const bg = document.getElementById('scroll-bg');
    if (bg) bg.classList.toggle('paused', bossKey === 'classic_cutman');

    const enemyImg = document.getElementById('enemy-img');
    if (enemyImg) {
      enemyImg.src = bossData.sprite || 'sprites/boss/super-rboss/cutman/cutman_at_01.png';
      enemyImg.style.width = (bossData.width || 60) + 'px';
      enemyImg.style.height = (bossData.height || 60) + 'px';
      enemyImg.style.marginTop = (bossData.marginTop ?? -15) + 'px';
      enemyImg.classList.remove('boss-enter');
      void enemyImg.offsetWidth;
      enemyImg.classList.add('boss-enter');
    }

    const enemyArea = document.getElementById('enemy-area');
    if (enemyArea) {
      enemyArea.classList.remove('sniperjoe-area');
      enemyArea.style.removeProperty('--sniperjoe-ground-bottom');
      enemyArea.style.setProperty('--boss-ground-bottom', `${bossData.bottom ?? BOSS_BOTTOM}px`);
      enemyArea.style.bottom = `${bossData.bottom ?? BOSS_BOTTOM}px`;
      enemyArea.classList.remove('boss-enter-area');
      void enemyArea.offsetWidth;
      enemyArea.classList.add('boss-enter-area');
    }

    enemyMaxHp = bossData.hp || 5000;
    enemyHp = enemyMaxHp;
    enemyAtk = bossData.atk || 20;
    enemySpeed = bossKey === 'classic_cutman' ? 0 : (bossData.speed || 0.18);
    enemyX = bossData.startX ?? BOSS_START_X;

    enemyDead = false;
    enemyAttacking = false;
    enemyStunned = false;
    playerDead = false;

    updateEnemyPosition();

    const rockmanImg = document.getElementById('rockman-img');
    if (rockmanImg) rockmanImg.src = 'sprites/rock/rock_st.png';

    applyStillBattleFrames();
    updateBossBattleTabLockState();
    updateUI();

    if (bossKey === 'classic_cutman') {
      startCutmanBossActions();
    }

  });
}


function stopCutmanBossActions() {
    if (cutmanBossActionTimer) {
        clearInterval(cutmanBossActionTimer);
        cutmanBossActionTimer = null;
    }

    cutmanBossAttacking = false;

    document.querySelectorAll('.cutman-boss-cutter').forEach(el => el.remove());

    const bossData = getBossData(currentBossType);
    const enemyImg = document.getElementById('enemy-img');
    if (enemyImg && bossData && currentBossType === 'classic_cutman' && !enemyDead && !playerDead) {
        enemyImg.src = bossData.sprite || 'sprites/boss/super-rboss/cutman/cutman_at_01.png';
    }
}

function startCutmanBossActions() {
    stopCutmanBossActions();

    if (!isBossBattle || currentBossType !== 'classic_cutman' || enemyDead || playerDead) return;

    const bossData = getBossData(currentBossType);
    const interval = bossData.attackInterval || 1850;

    cutmanBossActionTimer = setInterval(() => {
        if (!isBossBattle || currentBossType !== 'classic_cutman' || enemyDead || playerDead || cutmanBossAttacking) return;
        fireCutmanBossCutter();
    }, interval);

    setTimeout(() => {
        if (isBossBattle && currentBossType === 'classic_cutman' && !enemyDead && !playerDead) {
            fireCutmanBossCutter();
        }
    }, 1800);
}

function createCutmanCutterErasePop(screen, centerX, centerY) {
    if (!screen) return;

    const pop = document.createElement('div');
    pop.className = 'cutman-cutter-erase-pop';
    pop.style.left = centerX + 'px';
    pop.style.top = centerY + 'px';
    screen.appendChild(pop);

    setTimeout(() => pop.remove(), 260);
}

function erasePlayerProjectilesAtCutter(cutter, screen) {
    if (!cutter || !screen) return;

    const cutterRect = cutter.getBoundingClientRect();
    const cutterCenterX = cutterRect.left + cutterRect.width / 2;
    const toleranceX = Math.max(12, cutterRect.width * 0.48);

    const projectileSelector = [
        '.rock-bullet',
        '.partner-bullet',
        '.forte-bullet',
        '.forte-charge-bullet',
        '.x-bullet',
        '.x-charge-bullet',
        '.rockexe-bullet',
        '.rockexe-charge-bullet'
    ].join(',');

    document.querySelectorAll(projectileSelector).forEach(projectile => {
        if (!projectile || !projectile.isConnected) return;
        if (projectile.classList.contains('enemy-bullet') || projectile.classList.contains('cutman-boss-cutter')) return;

        const rect = projectile.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const projectileCenterX = rect.left + rect.width / 2;

        // 컷맨 커터와 같은 X축 근처에 들어온 아군 투사체는 전부 삭제합니다.
        if (Math.abs(projectileCenterX - cutterCenterX) <= toleranceX) {
            const screenRect = screen.getBoundingClientRect();
            const centerX = rect.left - screenRect.left + rect.width / 2;
            const centerY = rect.top - screenRect.top + rect.height / 2;
            createCutmanCutterErasePop(screen, centerX, centerY);
            projectile.remove();
        }
    });
}

function fireCutmanBossCutter() {
    if (!isBossBattle || currentBossType !== 'classic_cutman' || enemyDead || playerDead || cutmanBossAttacking) return;

    const screen = document.querySelector('.game-screen');
    const enemyImg = document.getElementById('enemy-img');
    const rockman = document.getElementById('rockman-img') || document.getElementById('rockman-area');
    if (!screen || !enemyImg || !rockman) return;

    const bossData = getBossData(currentBossType);
    const screenRect = screen.getBoundingClientRect();
    const enemyRect = enemyImg.getBoundingClientRect();
    const rockRect = rockman.getBoundingClientRect();

    cutmanBossAttacking = true;

    enemyImg.src = bossData.attackSprite || 'sprites/boss/super-rboss/cutman/cutman_at_02.png';

    const cutter = document.createElement('img');
    cutter.className = 'enemy-bullet cutman-boss-cutter';
    cutter.src = bossData.cutterSprite || 'sprites/boss/super-rboss/cutman/cutman_bullet_01.png';

    const startX = enemyRect.left - screenRect.left + Math.max(0, enemyRect.width * 0.08);
    const startY = enemyRect.top - screenRect.top + enemyRect.height * 0.48;

    cutter.style.left = startX + 'px';
    cutter.style.top = startY + 'px';
    screen.appendChild(cutter);

    const targetX = rockRect.left - screenRect.left + rockRect.width / 2;
    const travel = Math.min(-40, targetX - startX);
    const speed = bossData.cutterSpeed || 0.34;
    const duration = Math.max(520, Math.round(Math.abs(travel) / speed));

    const eraseTimer = setInterval(() => {
        if (!isBossBattle || currentBossType !== 'classic_cutman' || enemyDead || playerDead || !cutter.isConnected) {
            clearInterval(eraseTimer);
            return;
        }

        erasePlayerProjectilesAtCutter(cutter, screen);
    }, 24);

    cutter.animate(
        [
            { transform: 'translateX(0px) rotate(0deg)', opacity: 1 },
            { transform: `translateX(${travel}px) rotate(-920deg)`, opacity: 1 }
        ],
        { duration, easing: 'linear', fill: 'forwards' }
    );

    setTimeout(() => {
        clearInterval(eraseTimer);

        if (!enemyDead && !playerDead && isBossBattle && currentBossType === 'classic_cutman') {
            enemyHitsPlayerByBullet();
        }

        cutter.remove();

        if (!enemyDead && !playerDead && isBossBattle && currentBossType === 'classic_cutman') {
            enemyImg.src = bossData.sprite || 'sprites/boss/super-rboss/cutman/cutman_at_01.png';
        }

        cutmanBossAttacking = false;
    }, duration);
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

const exeRockmanFragmentsEl = document.getElementById('exeRockman-fragments');
if (exeRockmanFragmentsEl) exeRockmanFragmentsEl.innerText = gameData.exeRockmanFragments;

setButtonActive(document.getElementById('exeRockman-buy1'), !gameData.exeRockmanOwned && gameData.crystals >= 1 && gameData.exeRockmanFragments < 100);
setButtonActive(document.getElementById('exeRockman-buy10'), !gameData.exeRockmanOwned && gameData.crystals >= 10 && gameData.exeRockmanFragments <= 90);
setButtonActive(document.getElementById('exeRockman-buy100'), !gameData.exeRockmanOwned && gameData.crystals >= 100 && gameData.exeRockmanFragments === 0);
setButtonActive(document.getElementById('exeRockman-summon-btn'), !gameData.exeRockmanOwned && gameData.exeRockmanFragments >= 100);

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

const exeRockmanCard = document.getElementById('exeRockman-card');
const exeRockmanBadge = document.getElementById('exeRockman-complete-badge');

if (exeRockmanCard && exeRockmanBadge) {
  if (gameData.exeRockmanOwned) {
    exeRockmanCard.classList.add('complete');
    exeRockmanBadge.classList.add('active');
  } else {
    exeRockmanCard.classList.remove('complete');
    exeRockmanBadge.classList.remove('active');
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

const rockexeArea = document.getElementById('rockexe-area');
const rockexeImg = document.getElementById('rockexe-img');

if (rockexeArea) {
  if (gameData.exeRockmanOwned) rockexeArea.classList.add('active');
  else rockexeArea.classList.remove('active');
}

if (rockexeImg) {
  rockexeImg.style.display = gameData.exeRockmanOwned ? 'block' : 'none';
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
updateDevelopmentLabUI();

const superRockGemEls = document.querySelectorAll('.super-rock-gem-count');
superRockGemEls.forEach(el => {
    el.innerText = Math.floor(gameData.superRockGem || 0).toLocaleString();
});

const cardChipCount = document.getElementById('card-chip-count');
if (cardChipCount) cardChipCount.innerText = Math.floor(gameData.materials.cardChip || 0).toLocaleString();

const superrockChipCount = document.getElementById('superrock-chip-count');
if (superrockChipCount) superrockChipCount.innerText = Math.floor(gameData.materials.superRockChip || 0).toLocaleString();

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



    updateBossBattleTabLockState();
}


function hasOwnedBusterPartner() {
    return ['blues', 'forte', 'x', 'zero', 'exeRockman'].some(type => {
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

    ['blues', 'forte', 'x', 'zero', 'exeRockman'].forEach(type => {
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
    gameData.materials.cardChip += 30;
    gameData.materials.superRockChip += 30;

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
startExeRockmanAttack();
startZeroAttack();
startMining();
startBattleTips();


function normalizeCutmanBossCardUI() {
    const root = document.getElementById('boss-tab');
    if (!root) return;

    root.querySelectorAll('.boss-group-title, .classic-title, .classic-boss-section-title, .boss-section-title, .boss-category-title, .boss-list-title, .cutman-card-title-strip').forEach(el => {
        if ((el.textContent || '').includes('클래식 보스전') || el.classList.contains('classic-title') || el.classList.contains('boss-group-title')) {
            el.remove();
        }
    });

    const wrongBossPath = 'sprites/' + 'bosss' + '/reward/cardchip.png';
    root.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src') || '';
        if (src.includes(wrongBossPath)) {
            img.setAttribute('src', 'sprites/boss/reward/cardchip.png');
        }
    });

    const cutmanCard =
        document.getElementById('boss-card-cutman') ||
        document.getElementById('cutman-boss-card') ||
        root.querySelector('.cutman-card') ||
        root.querySelector('.cutman-boss-card') ||
        root.querySelector('[data-boss-key="classic_cutman"]') ||
        root.querySelector('[onclick*="classic_cutman"]');

    if (!cutmanCard) return;

    cutmanCard.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src') || '';
        if (src.includes('cutman_at_')) img.classList.add('cutman-preview-attack');
        if (src.includes('screw') || src.includes('stone') || src.includes('나사')) img.remove();
    });

    cutmanCard.querySelectorAll('.boss-card-reward-text, .boss-card-rewards').forEach(el => el.remove());

    let line = cutmanCard.querySelector('.cutman-reward-line, .boss-card-reward-line');
    if (!line) {
        line = document.createElement('div');
        line.className = 'cutman-reward-line boss-card-reward-line';
    }

    line.innerHTML = `
        <span class="reward-text-label">획득 가능 :</span>
        <span class="boss-reward-item">나사 <span class="boss-reward-emoji">🔩</span></span>
        <span class="boss-reward-item">카드칩 <img class="boss-reward-chip-icon" src="sprites/boss/reward/cardchip.png" alt="카드칩"></span>
        <span class="boss-reward-item">슈퍼록맨 데이터칩 <img class="boss-reward-chip-icon" src="sprites/boss/reward/superrockchip.png" alt="슈퍼록맨 데이터칩"></span>
    `;

    const preview = cutmanCard.querySelector('.boss-demo-stage') || cutmanCard.querySelector('.boss-card-preview');
    if (preview && preview.parentNode && line.previousElementSibling !== preview) {
        preview.insertAdjacentElement('afterend', line);
    } else if (!line.parentNode) {
        cutmanCard.appendChild(line);
    }

    if (!cutmanCard.querySelector('.boss-card-message')) {
        const msg = document.createElement('div');
        msg.id = 'cutman-card-message';
        msg.className = 'boss-card-message';
        cutmanCard.appendChild(msg);
    }
}

document.addEventListener('DOMContentLoaded', () => { setTimeout(normalizeCutmanBossCardUI, 0); setTimeout(normalizeCutmanBossCardUI, 200); });


function normalizeBossTabLayoutV5() {
    const root = document.getElementById('boss-tab');
    if (!root) return;

    root.querySelectorAll('.boss-material-status').forEach(el => el.remove());

    root.querySelectorAll('.boss-category-btn').forEach(btn => {
        btn.textContent = (btn.textContent || '').replace(/[▲▼△▽▴▾⌃⌄↕↑↓]/g, '').trim();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(normalizeBossTabLayoutV5, 0);
    setTimeout(normalizeBossTabLayoutV5, 200);
});


let cutmanPreviewTimer = null;
let cutmanPreviewTimeouts = [];









let cutmanPreviewV14Interval = null;
let cutmanPreviewV14Timers = [];

function clearCutmanPreviewV14() {
    if (cutmanPreviewV14Interval) {
        clearInterval(cutmanPreviewV14Interval);
        cutmanPreviewV14Interval = null;
    }

    cutmanPreviewV14Timers.forEach(timerId => clearTimeout(timerId));
    cutmanPreviewV14Timers = [];
}

function resetCutmanPreviewV14() {
    const img = document.getElementById('cutman-preview-img-v14');
    const cutter = document.getElementById('cutman-preview-cutter-v14');
    const rockBullet = document.getElementById('cutman-preview-rockbullet-v14');
    const pop = document.getElementById('cutman-preview-pop-v14');

    if (img) img.src = 'sprites/boss/super-rboss/cutman/cutman_at_01.png';

    if (cutter) {
        cutter.style.opacity = '0';
        cutter.style.transform = 'translateX(0px) rotate(0deg)';
    }

    if (rockBullet) {
        rockBullet.style.opacity = '0';
        rockBullet.style.transform = 'translateX(42px)';
    }

    if (pop) {
        pop.style.opacity = '0';
        pop.style.transform = 'scale(0.25)';
    }
}

function playCutmanPreviewV14Once() {
    const img = document.getElementById('cutman-preview-img-v14');
    const cutter = document.getElementById('cutman-preview-cutter-v14');
    const rockBullet = document.getElementById('cutman-preview-rockbullet-v14');
    const pop = document.getElementById('cutman-preview-pop-v14');

    if (!img || !cutter || !rockBullet || !pop) return;

    resetCutmanPreviewV14();

    const addTimer = (callback, delay) => {
        const timerId = setTimeout(callback, delay);
        cutmanPreviewV14Timers.push(timerId);
    };

    // 컷맨 커터 발사 시작: 커터가 화면에 있는 동안 at_02 유지
    addTimer(() => {
        img.src = 'sprites/boss/super-rboss/cutman/cutman_at_02.png';

        cutter.style.opacity = '1';
        cutter.style.transform = 'translateX(0px) rotate(0deg)';
        cutter.animate(
            [
                { transform: 'translateX(0px) rotate(0deg)', opacity: 1 },
                { transform: 'translateX(70px) rotate(430deg)', opacity: 1 },
                // 적 불릿을 지운 뒤에도 같은 속도로 계속 진행
                { transform: 'translateX(140px) rotate(860deg)', opacity: 1 },
                { transform: 'translateX(148px) rotate(920deg)', opacity: 0 }
            ],
            { duration: 1500, easing: 'linear', fill: 'forwards' }
        );
    }, 240);

    // 록맨탄은 충돌 지점까지 이동 후 폭발과 함께 소멸
    addTimer(() => {
        rockBullet.style.opacity = '1';
        rockBullet.style.transform = 'translateX(42px)';
        rockBullet.animate(
            [
                { transform: 'translateX(42px)', opacity: 1, offset: 0 },
                { transform: 'translateX(14px)', opacity: 1, offset: 0.48 },
                { transform: 'translateX(2px)', opacity: 1, offset: 0.68 },
                // 폭발 직전에 먼저 사라져서 시간차가 어색하지 않게 처리
                { transform: 'translateX(0px)', opacity: 0, offset: 0.78 },
                { transform: 'translateX(0px)', opacity: 0, offset: 1 }
            ],
            { duration: 430, easing: 'linear', fill: 'forwards' }
        );
    }, 560);

    // 충돌 지점 폭발
    addTimer(() => {
        pop.style.opacity = '1';
        pop.style.transform = 'scale(0.25)';
        pop.animate(
            [
                { transform: 'scale(0.25)', opacity: 0 },
                { transform: 'scale(1.45)', opacity: 1 },
                { transform: 'scale(0.35)', opacity: 0 }
            ],
            { duration: 320, easing: 'ease-out', fill: 'forwards' }
        );
    }, 900);

    // 컷맨 커터가 화면에서 사라질 때 at_01로 복귀
    addTimer(() => {
        cutter.style.opacity = '0';
        rockBullet.style.opacity = '0';
        img.src = 'sprites/boss/super-rboss/cutman/cutman_at_01.png';
    }, 1740);

    addTimer(() => {
        resetCutmanPreviewV14();
    }, 1820);
}

function startCutmanPreviewV14() {
    clearCutmanPreviewV14();
    resetCutmanPreviewV14();

    playCutmanPreviewV14Once();
    cutmanPreviewV14Interval = setInterval(playCutmanPreviewV14Once, 2200);
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(startCutmanPreviewV14, 0);
    setTimeout(startCutmanPreviewV14, 250);
});
