const defaultData = { 
    screws: 0,
    crystals: 0,
    superRockGem: 0,
    stones: 0,
    soulStones: 0,
    materials: {
        cardChip: 0,
        superRockChip: 0,
        bluesBusterChip: 0,
        superForteChip: 0,
        optionChangeChip: 0,
        bossReplayCard: 0
    },

    bossProgress: {
        classic_cutman: {
            clearedLevel: 0
        }
    },

    development: {
        currentLabIndex: 0,
        selectedItem: 'superRock',
        superRockProgress: 0,
        superRockUnlocked: false
    },

    transcend: {
        count: 0,
        points: 0,
        atkLv: 0,
        hpLv: 0,
        screwLv: 0,
        partnerLv: 0,
        cardChipLv: 0,
        syncBaseLv: 0
    },

    soulUpgrades: {
        atkLv: 0,
        hpLv: 0,
        screwLv: 0,
        atkSpeedLv: 0,
        critLv: 0
    },

    ecanUpgrades: {
        atkLv: 0,
        hpLv: 0,
        partnerLv: 0,
        bossLv: 0,
        atkSpeedLv: 0,
        critLv: 0
    },

    partnerBlueprints: {
        slots: 1
    },

    partnerSpeedLv: {
        blues: 0,
        forte: 0,
        x: 0,
        zero: 0,
        exeRockman: 0
    },

    cardFlatNerfV38Migrated: false,

    minePickaxeOwned: false,
    minePickaxeTier: 0,
    minePickaxeFloorTier: 0,
    minePickaxeEnhance: 0,
    registeredPickaxes: [null, null, null],
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

    cards: {
        owned: [],
        equipped: [null, null, null],
        nextId: 1
    },

    // 동료 공격력 싱크로율(%) - 록맨 버스터 공격력 기준
    partnerSync: {
        blues: 10,
        forte: 10,
        x: 10,
        zero: 10,
        exeRockman: 10
    },

    partnerSyncStart10Migrated: true,

    // 리부트 1회차 안에서 이미 추가 보상을 받은 스나이퍼죠 스테이지 기록
    sniperJoeRewardClaimed: {},

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
    bossProgress: { ...defaultData.bossProgress, ...(savedData.bossProgress || {}) },
    development: { ...defaultData.development, ...(savedData.development || {}) },
    transcend: { ...defaultData.transcend, ...(savedData.transcend || {}) },
    soulUpgrades: { ...defaultData.soulUpgrades, ...(savedData.soulUpgrades || {}) },
    ecanUpgrades: { ...defaultData.ecanUpgrades, ...(savedData.ecanUpgrades || {}) },
    partnerBlueprints: { ...defaultData.partnerBlueprints, ...(savedData.partnerBlueprints || {}) },
    partnerSpeedLv: { ...defaultData.partnerSpeedLv, ...(savedData.partnerSpeedLv || {}) },
    sniperJoeRewardClaimed: { ...defaultData.sniperJoeRewardClaimed, ...(savedData.sniperJoeRewardClaimed || {}) },
    registeredPickaxes: Array.isArray(savedData.registeredPickaxes) ? savedData.registeredPickaxes : defaultData.registeredPickaxes.slice(),
    cards: { ...defaultData.cards, ...(savedData.cards || {}) }
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
gameData.soulStones = Math.max(0, Math.floor(gameData.soulStones || 0));
gameData.materials = { ...defaultData.materials, ...(gameData.materials || {}) };
gameData.materials.cardChip = Math.floor(gameData.materials.cardChip || 0);
gameData.materials.superRockChip = Math.floor(gameData.materials.superRockChip || 0);
gameData.materials.bluesBusterChip = Math.floor(gameData.materials.bluesBusterChip || 0);
gameData.materials.superForteChip = Math.floor(gameData.materials.superForteChip || 0);
gameData.materials.optionChangeChip = Math.floor(gameData.materials.optionChangeChip || 0);
gameData.materials.bossReplayCard = Math.floor(gameData.materials.bossReplayCard || 0);
gameData.materials = { ...defaultData.materials, ...(gameData.materials || {}) };
Object.keys(defaultData.materials).forEach(key => {
    gameData.materials[key] = Math.max(0, Math.floor(gameData.materials[key] || 0));
});
gameData.bossProgress = { ...defaultData.bossProgress, ...(gameData.bossProgress || {}) };
Object.keys(defaultData.bossProgress).forEach(key => {
    const progress = gameData.bossProgress[key] || {};
    gameData.bossProgress[key] = {
        clearedLevel: Math.max(0, Math.floor(progress.clearedLevel || 0))
    };
});
gameData.development = { ...defaultData.development, ...(gameData.development || {}) };
gameData.development.currentLabIndex = Math.max(0, Math.min(3, Math.floor(gameData.development.currentLabIndex || 0)));
gameData.development.selectedItem = gameData.development.selectedItem || 'superRock';
gameData.development.superRockProgress = Math.max(0, Math.min(30, Math.floor(gameData.development.superRockProgress || 0)));

gameData.transcend = { ...defaultData.transcend, ...(gameData.transcend || {}) };
['count', 'points', 'atkLv', 'hpLv', 'screwLv', 'partnerLv', 'cardChipLv'].forEach(key => {
    gameData.transcend[key] = Math.max(0, Math.floor(gameData.transcend[key] || 0));
});
gameData.partnerBlueprints = { ...defaultData.partnerBlueprints, ...(gameData.partnerBlueprints || {}) };
gameData.partnerBlueprints.slots = Math.max(1, Math.min(7, Math.floor(gameData.partnerBlueprints.slots || 1)));
gameData.partnerSpeedLv = { ...defaultData.partnerSpeedLv, ...(gameData.partnerSpeedLv || {}) };
Object.keys(defaultData.partnerSpeedLv).forEach(key => {
    gameData.partnerSpeedLv[key] = Math.max(0, Math.min(10, Math.floor(gameData.partnerSpeedLv[key] || 0)));
});

if (!gameData.sniperJoeRewardClaimed || typeof gameData.sniperJoeRewardClaimed !== 'object' || Array.isArray(gameData.sniperJoeRewardClaimed)) {
    gameData.sniperJoeRewardClaimed = {};
}

gameData.cards = { ...defaultData.cards, ...(gameData.cards || {}) };
if (!Array.isArray(gameData.cards.owned)) gameData.cards.owned = [];
if (!Array.isArray(gameData.cards.equipped)) gameData.cards.equipped = [null, null, null];
gameData.cards.equipped = [0, 1, 2].map(i => gameData.cards.equipped[i] || null);
gameData.cards.nextId = Math.max(1, Math.floor(gameData.cards.nextId || 1));
gameData.cards.owned = gameData.cards.owned
    .filter(card => card && card.id && card.type && card.grade)
    .map(card => ({
        id: String(card.id),
        type: card.type,
        grade: card.grade,
        value: Math.max(0, Number(card.value || 0)),
        locked: !!card.locked
    }));
gameData.minePickaxeOwned = gameData.minePickaxeOwned || false;
gameData.minePickaxeTier = Math.max(0, Math.floor(gameData.minePickaxeTier || 0));
gameData.minePickaxeFloorTier = Math.max(0, Math.floor(gameData.minePickaxeFloorTier || 0));
if (gameData.minePickaxeTier < gameData.minePickaxeFloorTier) gameData.minePickaxeTier = gameData.minePickaxeFloorTier;
gameData.minePickaxeEnhance = Math.max(0, Math.floor(gameData.minePickaxeEnhance || 0));
if (!Array.isArray(gameData.registeredPickaxes)) gameData.registeredPickaxes = [null, null, null];
gameData.registeredPickaxes = [0, 1, 2].map(index => {
    const item = gameData.registeredPickaxes[index];
    if (!item) return null;
    const tier = Math.max(0, Math.min(9, Math.floor(item.tier || 0)));
    const enhance = Math.max(0, Math.min(10, Math.floor(item.enhance || 0)));
    return { tier, enhance };
});
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
gameData.partnerBlueprints.slots = Math.min(7, Math.max(gameData.partnerBlueprints.slots || 1, ['rushOwned','beatOwned','bluesOwned','forteOwned','xOwned','zeroOwned','exeRockmanOwned'].reduce((count, key) => count + (gameData[key] ? 1 : 0), 0)));
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

// 전투 밸런스 안전 한계치입니다.
// 고스테이지에서 적이 너무 빨라지거나, 아군/동료 공속이 과하게 빨라져
// 근접 캐릭터 위치와 투사체/스프라이트 타이밍이 어긋나는 문제를 막습니다.
const PLAYER_ATTACK_SPEED_MIN_MS = 450;
const PARTNER_ATTACK_SPEED_MIN_MS = 700;
const SPEED_UPGRADE_MAX_LEVEL = 15;
const CRIT_UPGRADE_MAX_LEVEL = 20;
const CRIT_CHANCE_MAX_FROM_UPGRADE = 50;
const EXE_BOMB_STUN_DURATION_MS = 900;
const EXE_BOMB_BOSS_STUN_DURATION_MS = 350;
const EXE_BOMB_STUN_CHANCE = 0.35;
const ENEMY_MOVE_SPEED_MAX = 0.92;
const BOSS_REPLAY_CARD_ECAN_COST = 1000;
const TRANSCEND_REQUIRED_STAGE = 100;
const TRANSCEND_POINT_PER_STAGE = 50;
const TRANSCEND_MAX_LEVEL = 20;
const REBOOT_SYNC_BASE_MIN = 10;
const REBOOT_SYNC_BASE_GAIN = 5;
const REBOOT_SYNC_BASE_MAX = 100;
const PARTNER_BLUEPRINT_MAX_SLOTS = 7;
const PARTNER_SPEED_MAX_LEVEL = 10;
const PARTNER_SPEED_REDUCTION_PER_LEVEL = 0.04;

const SOUL_STONE_ICON_HTML = '<img src="sprites/item/light_stone.png" class="result-resource-icon" alt="라이트코어">';
const SOUL_UPGRADE_CONFIG = {
    atk: { key: 'atkLv', name: '공격력', baseCost: 3, growth: 1.18, linear: 1, effectPerLevel: 0.005, max: Infinity, suffix: '%' },
    hp: { key: 'hpLv', name: '체력', baseCost: 3, growth: 1.18, linear: 1, effectPerLevel: 0.008, max: Infinity, suffix: '%' },
    screw: { key: 'screwLv', name: '나사 획득', baseCost: 4, growth: 1.2, linear: 1, effectPerLevel: 0.005, max: Infinity, suffix: '%' },
    atkSpeed: { key: 'atkSpeedLv', name: '공격속도', baseCost: 5, growth: 1.22, linear: 1, effectPerLevel: 0.005, max: 40, suffix: '%' },
    crit: { key: 'critLv', name: '차지확률', baseCost: 5, growth: 1.22, linear: 1, effectPerLevel: 0.5, max: 30, suffix: '%' }
};

const ECAN_UPGRADE_CONFIG = {
    atk: { key: 'atkLv', name: '공격력', baseCost: 150, growth: 1.16, linear: 25, effectPerLevel: 0.002, max: Infinity, suffix: '%' },
    hp: { key: 'hpLv', name: '체력', baseCost: 150, growth: 1.16, linear: 25, effectPerLevel: 0.003, max: Infinity, suffix: '%' },
    partner: { key: 'partnerLv', name: '동료 공격력', baseCost: 180, growth: 1.17, linear: 30, effectPerLevel: 0.003, max: Infinity, suffix: '%' },
    boss: { key: 'bossLv', name: '보스 데미지', baseCost: 200, growth: 1.17, linear: 35, effectPerLevel: 0.004, max: Infinity, suffix: '%' },
    atkSpeed: { key: 'atkSpeedLv', name: '공격속도', baseCost: 220, growth: 1.18, linear: 35, effectPerLevel: 0.0025, max: 40, suffix: '%' },
    crit: { key: 'critLv', name: '차지확률', baseCost: 220, growth: 1.18, linear: 35, effectPerLevel: 0.25, max: 40, suffix: '%' }
};

// 록맨 스프라이트 기준점 설정부입니다.
// 중요: setupStage()가 파일 중간에서 먼저 실행되므로, 이 설정값은 반드시 setupStage()보다 위에 있어야 합니다.
// 새 방식은 PNG 캔버스 크기를 억지로 통일하지 않고, 렌더링된 이미지 기준으로 잡습니다.
// - 발바닥 기준: #rockman-area 안에서 이미지 하단 중앙을 고정
// - 총구 기준: 렌더링된 록맨 이미지의 오른쪽/상단 비율 지점
// - 피격 기준: 렌더링된 록맨 몸통 중심
const ROCKMAN_RENDER_CONFIG = {
    // v96: 록맨 여백 제거 스프라이트 기준. 발바닥 중앙은 유지하고 표시 크기만 소폭 확대합니다.
    height: 21,
    muzzleXRatio: 0.94,
    muzzleYRatio: 0.47,
    muzzleOffsetX: 0,
    muzzleOffsetY: 0,
    bodyCenterXRatio: 0.50,
    bodyCenterYRatio: 0.54,

    // 프레임별 기준점 미세 보정입니다.
    // 화면 절대 위치가 아니라, 각 PNG의 "발바닥 중앙 기준점"을 맞추기 위한 보정입니다.
    // 록맨은 오른쪽을 보고 있으므로 x가 -1이면 뒤쪽(왼쪽)으로 1px 당겨집니다.
    frameAnchorOffsets: {
        '1': { x: -1, y: 0 },
        '2': { x: 0, y: 0 },
        '3': { x: -1, y: 0 },
        st: { x: 0, y: 0 }
    },

    // 실제 모바일 기기에서는 브라우저 viewport/DPR 차이 때문에 PC 모바일 미리보기와
    // 탄환의 CSS 좌표가 다르게 보일 수 있어, 록맨 내부 기준점은 유지한 채 탄환만 보정합니다.
    realMobileBulletOffsetXRatio: -1.0
};


function getCritChanceForLevel(level) {
    const lv = Math.max(1, Math.min(CRIT_UPGRADE_MAX_LEVEL, Math.floor(level || 1)));
    if (lv >= CRIT_UPGRADE_MAX_LEVEL) return CRIT_CHANCE_MAX_FROM_UPGRADE;
    const progress = (lv - 1) / Math.max(1, CRIT_UPGRADE_MAX_LEVEL - 1);
    return Math.round((defaultData.critChance + (CRIT_CHANCE_MAX_FROM_UPGRADE - defaultData.critChance) * progress) * 10) / 10;
}

function isRealMobileDevice() {
    const ua = navigator.userAgent || '';
    const platform = navigator.platform || '';
    const hasTouch = (navigator.maxTouchPoints || 0) > 0;
    const isiPadOS = hasTouch && /MacIntel/.test(platform);
    return hasTouch && (/iPhone|iPad|iPod|Android/i.test(ua) || isiPadOS);
}

function refreshRealMobileDeviceClass() {
    const enabled = isRealMobileDevice();
    document.documentElement.classList.toggle('real-mobile-device', enabled);
    if (document.body) document.body.classList.toggle('real-mobile-device', enabled);
}

function isRealMobileModeActive() {
    const mobileMode = document.body.classList.contains('mobile-mode') || document.documentElement.classList.contains('mobile-mode');
    const realDevice = document.body.classList.contains('real-mobile-device') || document.documentElement.classList.contains('real-mobile-device');
    return mobileMode && realDevice;
}

function clampBattleBalanceValues() {
    gameData.lv = { ...defaultData.lv, ...(gameData.lv || {}) };
    gameData.lv.spd = Math.min(SPEED_UPGRADE_MAX_LEVEL, Math.max(1, Math.floor(gameData.lv.spd || 1)));
    gameData.lv.partnerSpd = Math.min(SPEED_UPGRADE_MAX_LEVEL, Math.max(1, Math.floor(gameData.lv.partnerSpd || 1)));
    gameData.lv.crit = Math.min(CRIT_UPGRADE_MAX_LEVEL, Math.max(1, Math.floor(gameData.lv.crit || 1)));
    if (gameData.lv.crit >= CRIT_UPGRADE_MAX_LEVEL) {
        gameData.critChance = CRIT_CHANCE_MAX_FROM_UPGRADE;
    } else {
        gameData.critChance = Math.min(CRIT_CHANCE_MAX_FROM_UPGRADE, Number(gameData.critChance || defaultData.critChance));
    }
    gameData.atkSpd = Math.max(PLAYER_ATTACK_SPEED_MIN_MS, Math.floor(gameData.atkSpd || defaultData.atkSpd));
    gameData.partnerAtkSpd = Math.max(PARTNER_ATTACK_SPEED_MIN_MS, Math.floor(gameData.partnerAtkSpd || defaultData.partnerAtkSpd));
}

function getEnemyMoveSpeedForStage(stage) {
    return Math.min(ENEMY_MOVE_SPEED_MAX, 0.20 + stage * 0.012);
}

function getPlayerAttackInterval() {
    const bonuses = typeof getEquippedCardBonuses === 'function'
        ? getEquippedCardBonuses()
        : { atkSpeed: 0 };
    const baseInterval = Math.max(PLAYER_ATTACK_SPEED_MIN_MS, Math.floor(gameData.atkSpd || defaultData.atkSpd));
    const speedBonus = Math.max(0, Math.min(75, Number(bonuses.atkSpeed || 0) + getSoulBonus('atkSpeed') * 100 + getEcanBonus('atkSpeed') * 100));
    return Math.max(300, Math.floor(baseInterval * (1 - speedBonus / 100)));
}

function getPartnerAttackInterval(multiplier = 1) {
    return Math.max(PARTNER_ATTACK_SPEED_MIN_MS, Math.floor((gameData.partnerAtkSpd || defaultData.partnerAtkSpd) * multiplier));
}

function getPartnerAttackIntervalForType(type, multiplier = 1) {
    const level = Math.max(0, Math.min(PARTNER_SPEED_MAX_LEVEL, Math.floor(gameData.partnerSpeedLv?.[type] || 0)));
    const reduction = Math.min(0.40, level * PARTNER_SPEED_REDUCTION_PER_LEVEL);
    return Math.max(PARTNER_ATTACK_SPEED_MIN_MS, Math.floor(getPartnerAttackInterval(multiplier) * (1 - reduction)));
}

function getTranscendBonus(type) {
    const t = gameData.transcend || defaultData.transcend;
    if (type === 'atk') return Math.max(0, Math.floor(t.atkLv || 0)) * 0.05;
    if (type === 'hp') return Math.max(0, Math.floor(t.hpLv || 0)) * 0.08;
    if (type === 'screw') return Math.max(0, Math.floor(t.screwLv || 0)) * 0.05;
    if (type === 'partner') return Math.max(0, Math.floor(t.partnerLv || 0)) * 0.05;
    if (type === 'cardChip') return Math.max(0, Math.floor(t.cardChipLv || 0)) * 0.03;
    return 0;
}

function getSoulUpgradeLevel(type) {
    const config = SOUL_UPGRADE_CONFIG[type];
    if (!config) return 0;
    return Math.max(0, Math.floor(gameData.soulUpgrades?.[config.key] || 0));
}

function getSoulBonus(type) {
    const config = SOUL_UPGRADE_CONFIG[type];
    if (!config) return 0;
    const lv = getSoulUpgradeLevel(type);
    return Math.max(0, lv * config.effectPerLevel);
}

function getSoulUpgradeCost(type) {
    const config = SOUL_UPGRADE_CONFIG[type];
    if (!config) return 0;
    const lv = getSoulUpgradeLevel(type);
    if (Number.isFinite(config.max) && lv >= config.max) return Infinity;
    return Math.max(1, Math.floor(config.baseCost * Math.pow(config.growth, lv) + lv * config.linear));
}

function getSoulUpgradeEffectText(type) {
    if (type === 'crit') return `+${getSoulBonus(type).toFixed(1)}%`;
    return `+${Math.round(getSoulBonus(type) * 1000) / 10}%`;
}

function getSoulStoneRebootReward() {
    if (gameData.stage < TRANSCEND_REQUIRED_STAGE) return 0;
    return Math.max(1, Math.floor(gameData.stage / 50));
}

function upgradeSoulStat(type) {
    const config = SOUL_UPGRADE_CONFIG[type];
    if (!config) return;
    const lv = getSoulUpgradeLevel(type);
    if (Number.isFinite(config.max) && lv >= config.max) return;
    const cost = getSoulUpgradeCost(type);
    if ((gameData.soulStones || 0) < cost) return;
    gameData.soulStones -= cost;
    gameData.soulUpgrades[config.key] = lv + 1;
    gameData.playerMaxHp = getEffectivePlayerMaxHp();
    gameData.playerHp = Math.min(gameData.playerMaxHp, Math.max(1, gameData.playerHp || gameData.playerMaxHp));
    startAutoAttack();
    updateUI();
    saveData();
}

function getEcanUpgradeLevel(type) {
    const config = ECAN_UPGRADE_CONFIG[type];
    if (!config) return 0;
    return Math.max(0, Math.floor(gameData.ecanUpgrades?.[config.key] || 0));
}

function getEcanBonus(type) {
    const config = ECAN_UPGRADE_CONFIG[type];
    if (!config) return 0;
    const lv = getEcanUpgradeLevel(type);
    return Math.max(0, lv * config.effectPerLevel);
}

function getEcanUpgradeCost(type) {
    const config = ECAN_UPGRADE_CONFIG[type];
    if (!config) return 0;
    const lv = getEcanUpgradeLevel(type);
    if (Number.isFinite(config.max) && lv >= config.max) return Infinity;
    return Math.max(1, Math.floor(config.baseCost * Math.pow(config.growth, lv) + lv * config.linear));
}

function getEcanUpgradeEffectText(type) {
    if (type === 'crit') return `+${getEcanBonus(type).toFixed(2).replace(/\.00$/, '')}%`;
    return `+${Math.round(getEcanBonus(type) * 10000) / 100}%`;
}

function upgradeEcanStat(type) {
    const config = ECAN_UPGRADE_CONFIG[type];
    if (!config) return;
    const lv = getEcanUpgradeLevel(type);
    if (Number.isFinite(config.max) && lv >= config.max) return;
    const cost = getEcanUpgradeCost(type);
    if ((gameData.crystals || 0) < cost) return;
    gameData.crystals -= cost;
    gameData.ecanUpgrades[config.key] = lv + 1;
    gameData.playerMaxHp = getEffectivePlayerMaxHp();
    gameData.playerHp = Math.min(gameData.playerMaxHp, Math.max(1, gameData.playerHp || gameData.playerMaxHp));
    startAutoAttack();
    updateUI();
    saveData();
}

function showBattleUpgradeTab(type) {
    const tabs = ['screw', 'ecan', 'soul'];
    tabs.forEach(name => {
        const tab = document.getElementById(`battle-upgrade-tab-${name}`);
        const panel = document.getElementById(`battle-upgrade-${name}-panel`);
        if (tab) tab.classList.toggle('active', name === type);
        if (panel) panel.classList.toggle('active', name === type);
    });
}

function getRebootSyncBasePercent() {
    const lv = Math.max(0, Math.floor(gameData.transcend?.syncBaseLv || 0));
    return Math.min(REBOOT_SYNC_BASE_MAX, REBOOT_SYNC_BASE_MIN + lv * REBOOT_SYNC_BASE_GAIN);
}

function resetPartnerSyncAfterReboot() {
    const baseSync = getRebootSyncBasePercent();
    gameData.partnerSync = { ...defaultData.partnerSync, ...(gameData.partnerSync || {}) };
    Object.keys(defaultData.partnerSync).forEach(key => {
        gameData.partnerSync[key] = baseSync;
    });
}

function getEffectivePlayerMaxHp() {
    const baseHp = 100 + (Math.max(1, Math.floor(gameData.lv?.hp || 1)) - 1) * 35;
    return Math.max(1, Math.floor(baseHp * (1 + getTranscendBonus('hp') + getSoulBonus('hp') + getEcanBonus('hp'))));
}

function isSpeedUpgradeType(type) {
    return type === 'spd' || type === 'partnerSpd';
}

function isUpgradeCapped(type) {
    if (isSpeedUpgradeType(type)) {
        return Math.floor(gameData.lv?.[type] || 1) >= SPEED_UPGRADE_MAX_LEVEL;
    }
    if (type === 'crit') {
        return Math.floor(gameData.lv?.crit || 1) >= CRIT_UPGRADE_MAX_LEVEL || Number(gameData.critChance || 0) >= CRIT_CHANCE_MAX_FROM_UPGRADE;
    }
    return false;
}

clampBattleBalanceValues();

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
        entryCost: 1,
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

function getBossProgress(bossKey = 'classic_cutman') {
    if (!gameData.bossProgress) gameData.bossProgress = { ...defaultData.bossProgress };
    if (!gameData.bossProgress[bossKey]) gameData.bossProgress[bossKey] = { clearedLevel: 0 };
    gameData.bossProgress[bossKey].clearedLevel = Math.max(0, Math.floor(gameData.bossProgress[bossKey].clearedLevel || 0));
    return gameData.bossProgress[bossKey];
}

function getBossClearedLevel(bossKey = 'classic_cutman') {
    return getBossProgress(bossKey).clearedLevel;
}

function getBossNextChallengeLevel(bossKey = 'classic_cutman') {
    return getBossClearedLevel(bossKey) + 1;
}

function getBossScaledData(bossKey = 'classic_cutman', level = 1) {
    const base = BOSS_BATTLE_DATA[bossKey] || BOSS_BATTLE_DATA.classic_cutman;
    const lv = Math.max(1, Math.floor(level || 1));
    const data = { ...base, rewards: { ...(base.rewards || {}) }, level: lv };

    if (bossKey === 'classic_cutman') {
        const levelOffset = lv - 1;
        const hpScale = 1 + levelOffset * 0.42;
        const atkScale = 1 + levelOffset * 0.08;
        const rewardScale = 1 + levelOffset * 0.08;

        data.hp = Math.max(base.hp, Math.floor((base.hp || 5000) * hpScale));
        data.atk = Math.max(base.atk || 20, Math.floor((base.atk || 20) * atkScale));
        data.attackInterval = Math.max(3600, Math.floor((base.attackInterval || 5200) - levelOffset * 70));
        data.cutterDamageMultiplier = Number((base.cutterDamageMultiplier || 1.15) * (1 + levelOffset * 0.025));
        data.rewards.screwsMin = Math.floor((base.rewards?.screwsMin || 180) * rewardScale);
        data.rewards.screwsMax = Math.floor((base.rewards?.screwsMax || 320) * rewardScale);
        data.rewards.cardChipChance = Math.min(0.95, (base.rewards?.cardChipChance ?? 0.78) + levelOffset * 0.006);
        data.rewards.cardChipMin = base.rewards?.cardChipMin || 1;
        data.rewards.cardChipMax = Math.min(4, (base.rewards?.cardChipMax || 2) + Math.floor(levelOffset / 10));
        data.rewards.superRockChipChance = Math.min(0.18, (base.rewards?.superRockChipChance ?? 0.05) + levelOffset * 0.004);
    }

    return data;
}

function getBossData(bossKey = currentBossType, level = null) {
    const resolvedKey = bossKey || currentBossType || 'classic_cutman';
    const resolvedLevel = level || ((isBossBattle && resolvedKey === currentBossType) ? currentBossLevel : 1);
    return getBossScaledData(resolvedKey, resolvedLevel);
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
let enemyStunTimer = null;
let playerDead = false;
let isBossBattle = false;
let bossBattleEntryPending = false;
let currentBossType = null;
let currentBossLevel = 1;
let currentBossMode = 'challenge';
let currentEnemyType = 'met';
let sniperJoeActionTimer = null;
let sniperJoeJumping = false;
let sniperJoeAttacking = false;
let cutmanBossActionTimer = null;
let cutmanBossAttacking = false;
let superRockUnlockPaused = false;

let rockFrame = 1;
let rockDir = 1;
let metFrame = 1;

let rushWalkFrames = [2, 3, 4];
// 러쉬 걷기 스프라이트는 프레임별 투명 여백/기준점 차이로 덜컹거려 보일 수 있어
// 전투 화면에서만 미세 위치 보정을 적용합니다.
const RUSH_FRAME_STABILIZE_OFFSET = {
    2: { x: 0, y: 0 },
    3: { x: -1, y: 1 },
    4: { x: -1, y: 0 },
    st: { x: 0, y: 0 }
};
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

const CARD_ANALYZE_SCREW_COST = 500;
const OPTION_CHIP_STONE_COST = 1000;
const CARD_GRADE_ORDER = ['N', 'R', 'SR', 'SSR', 'UR'];
const CARD_SYNTH_REQUIREMENTS = { N: 3, R: 4, SR: 5, SSR: 6 };
const CARD_GRADE_NAMES = { N: '일반', R: '레어', SR: '슈퍼레어', SSR: '더블슈퍼레어', UR: '울트라레어' };
const CARD_GRADE_CLASS = { N: 'grade-n', R: 'grade-r', SR: 'grade-sr', SSR: 'grade-ssr', UR: 'grade-ur' };
const CARD_OPTION_RANGES = {
    N: [1, 1],
    R: [1, 3],
    SR: [4, 6],
    SSR: [7, 10],
    UR: [11, 15]
};
const CARD_TYPE_DATA = {
    atkPercent: {
        name: '공격력 % 카드',
        icon: 'sprites/card/attack_card.png',
        optionName: '데미지',
        suffix: '%',
        valueMultiplier: 1,
        description(value) { return `데미지 +${value}%`; }
    },
    atkFlat: {
        name: '공격력 + 카드',
        icon: 'sprites/card/attack_card.png',
        optionName: '데미지',
        suffix: '',
        valueMultiplier: 2,
        description(value) { return `데미지 +${value}`; }
    },
    critChance: {
        name: '차지샷 카드',
        icon: 'sprites/card/crit_card.png',
        optionName: '차지샷 확률',
        suffix: '%',
        valueMultiplier: 1,
        description(value) { return `차지샷 확률 +${value}%`; }
    },
    atkSpeed: {
        name: '공격속도 카드',
        icon: 'sprites/card/speed_card.png',
        optionName: '공격속도',
        suffix: '%',
        valueMultiplier: 1,
        description(value) { return `공격속도 +${value}%`; }
    }
};
const CARD_GRADE_ROLL_TABLE = [
    { grade: 'N', weight: 650 },
    { grade: 'R', weight: 250 },
    { grade: 'SR', weight: 80 },
    { grade: 'SSR', weight: 18 },
    { grade: 'UR', weight: 2 }
];
let selectedCardGroupKey = null;
let selectedCardId = null;
let lastAnalyzedCards = [];

function getCardGradeName(grade) {
    return CARD_GRADE_NAMES[grade] || grade;
}

function getCardTypeData(type) {
    return CARD_TYPE_DATA[type] || CARD_TYPE_DATA.atkPercent;
}

function getCardIcon(cardOrType) {
    const type = typeof cardOrType === 'string' ? cardOrType : cardOrType?.type;
    return getCardTypeData(type).icon || 'sprites/boss/reward/cardchip.png';
}

function getCardEquipFamily(cardOrType) {
    const type = typeof cardOrType === 'string' ? cardOrType : cardOrType?.type;
    if (type === 'atkPercent') return 'attackPercent';
    if (type === 'atkFlat') return 'attackFlat';
    if (type === 'critChance') return 'crit';
    if (type === 'atkSpeed') return 'speed';
    return type || '';
}

function getEquippedCardByFamily(family, exceptCardId = null) {
    if (!family) return null;
    for (const cardId of gameData.cards.equipped) {
        if (!cardId || cardId === exceptCardId) continue;
        const card = getOwnedCardById(cardId);
        if (card && getCardEquipFamily(card) === family) return card;
    }
    return null;
}

function getCardFamilyBlockMessage(card) {
    const family = getCardEquipFamily(card);
    if (family === 'attackPercent') return '공격력 % 카드는 1장만 장착할 수 있습니다.';
    if (family === 'attackFlat') return '공격력 + 카드는 1장만 장착할 수 있습니다.';
    if (family === 'crit') return '차지샷 카드는 1장만 장착할 수 있습니다.';
    if (family === 'speed') return '공속 카드는 1장만 장착할 수 있습니다.';
    return '같은 종류 카드는 1장만 장착할 수 있습니다.';
}

function rollWeightedValueInRange(min, max) {
    min = Math.floor(min);
    max = Math.floor(max);
    if (max <= min) return min;

    // 낮은 수치일수록 잘 뜨고, 최고 수치는 낮은 확률로 뜨게 합니다.
    const entries = [];
    for (let value = min; value <= max; value++) {
        entries.push({ value, weight: (max - value + 1) * (max - value + 1) });
    }
    const total = entries.reduce((sum, item) => sum + item.weight, 0);
    let roll = Math.random() * total;
    for (const item of entries) {
        roll -= item.weight;
        if (roll <= 0) return item.value;
    }
    return min;
}

function rollCardOptionBaseValue(grade) {
    const range = CARD_OPTION_RANGES[grade] || CARD_OPTION_RANGES.N;
    return rollWeightedValueInRange(range[0], range[1]);
}

function rollCardOptionValue(type, grade) {
    const data = getCardTypeData(type);
    return Math.max(1, rollCardOptionBaseValue(grade) * (data.valueMultiplier || 1));
}

function getCardValue(type, grade) {
    return rollCardOptionValue(type, grade);
}

function getMaxCardOptionValue(type, grade) {
    const data = getCardTypeData(type);
    const range = CARD_OPTION_RANGES[grade] || CARD_OPTION_RANGES.N;
    return Math.max(1, Math.floor((range[1] || 1) * (data.valueMultiplier || 1)));
}

function migrateAtkFlatCardNerfV38() {
    if (gameData.cardFlatNerfV38Migrated) return;
    let changed = false;
    gameData.cards.owned.forEach(card => {
        if (!card || card.type !== 'atkFlat') return;
        const maxValue = getMaxCardOptionValue(card.type, card.grade);
        const currentValue = Math.max(1, Math.floor(Number(card.value || 1)));
        if (currentValue > maxValue) {
            card.value = maxValue;
            changed = true;
        }
    });
    gameData.cardFlatNerfV38Migrated = true;
    if (changed) saveData();
}

function getCardDescription(card) {
    const data = getCardTypeData(card?.type);
    return data.description(Number(card?.value || 0));
}

function getCardOptionRangeDescription(card) {
    if (!card) return '';
    const data = getCardTypeData(card.type);
    const range = CARD_OPTION_RANGES[card.grade] || CARD_OPTION_RANGES.N;
    const multiplier = data.valueMultiplier || 1;
    const min = Math.max(1, range[0] * multiplier);
    const max = Math.max(min, range[1] * multiplier);
    const suffix = data.suffix || '';
    return `${min}${suffix} ~ ${max}${suffix}`;
}

function rollCardGrade() {
    const total = CARD_GRADE_ROLL_TABLE.reduce((sum, item) => sum + item.weight, 0);
    let roll = Math.random() * total;
    for (const item of CARD_GRADE_ROLL_TABLE) {
        roll -= item.weight;
        if (roll <= 0) return item.grade;
    }
    return 'N';
}

function createRandomCard() {
    const types = Object.keys(CARD_TYPE_DATA);
    const type = types[Math.floor(Math.random() * types.length)];
    const grade = rollCardGrade();
    const id = `card_${Date.now()}_${gameData.cards.nextId++}`;
    return { id, type, grade, value: getCardValue(type, grade), locked: false };
}

function analyzeCardChips(amount = 1) {
    amount = Math.max(1, Math.floor(amount || 1));
    const screwCost = CARD_ANALYZE_SCREW_COST * amount;
    if ((gameData.materials.cardChip || 0) < amount) return;
    if ((gameData.screws || 0) < screwCost) return;

    gameData.materials.cardChip -= amount;
    gameData.screws -= screwCost;

    const gained = [];
    for (let i = 0; i < amount; i++) {
        const card = createRandomCard();
        gameData.cards.owned.push(card);
        gained.push(card);
    }

    lastAnalyzedCards = gained.slice();
    updateUI();
    saveData();
    showCardAnalyzePopup(gained);
}

function showCardAnalyzePopup(cards = []) {
    lastAnalyzedCards = Array.isArray(cards) ? cards.slice() : [];
    const popup = document.getElementById('card-analyze-popup');
    const list = document.getElementById('card-analyze-popup-list');
    if (!popup || !list) return;

    if (!lastAnalyzedCards.length) {
        list.innerHTML = '<div class="card-empty-note">획득한 카드가 없습니다.</div>';
    } else {
        list.innerHTML = lastAnalyzedCards.map(card => `
            <div class="card-analyze-popup-card ${CARD_GRADE_CLASS[card.grade] || ''}">
                <img src="${getCardIcon(card)}" alt="${getCardTypeData(card.type).name}">
                <b class="card-analyze-grade-label">${card.grade}</b>
                <strong>${getCardTypeData(card.type).name}</strong>
                <em>${getCardDescription(card)}</em>
            </div>
        `).join('');
    }

    popup.classList.add('active');
}

function closeCardAnalyzePopup() {
    const popup = document.getElementById('card-analyze-popup');
    if (popup) popup.classList.remove('active');
}

function exchangeStonesToOptionChips(amount = 1) {
    amount = Math.max(1, Math.floor(amount || 1));
    const cost = OPTION_CHIP_STONE_COST * amount;
    if ((gameData.stones || 0) < cost) return;

    gameData.stones -= cost;
    gameData.materials.optionChangeChip += amount;
    showCardResult(`옵션변경칩 +${amount}`);
    updateUI();
    saveData();
}

function getOwnedCardById(cardId) {
    return gameData.cards.owned.find(card => card.id === cardId) || null;
}

function isCardEquipped(cardId) {
    return gameData.cards.equipped.includes(cardId);
}

function equipCard(cardId) {
    const card = getOwnedCardById(cardId);
    if (!card) return false;
    if (isCardEquipped(cardId)) return true;

    const equippedSameFamily = getEquippedCardByFamily(getCardEquipFamily(card), card.id);
    if (equippedSameFamily) {
        showCardResult(getCardFamilyBlockMessage(card));
        return false;
    }

    const emptyIndex = gameData.cards.equipped.findIndex(id => !id);
    if (emptyIndex < 0) {
        showCardResult('장착 슬롯이 가득 찼습니다.');
        return false;
    }

    gameData.cards.equipped[emptyIndex] = cardId;
    startAutoAttack();
    updateUI();
    saveData();
    return true;
}

function unequipCard(slotIndex) {
    slotIndex = Math.max(0, Math.min(2, Math.floor(slotIndex || 0)));
    gameData.cards.equipped[slotIndex] = null;
    startAutoAttack();
    updateUI();
    saveData();
}


function getSameTypeSameGradeMaterialCards(mainCard) {
    if (!mainCard) return [];
    return gameData.cards.owned
        .filter(card =>
            card.id !== mainCard.id &&
            card.type === mainCard.type &&
            card.grade === mainCard.grade &&
            !card.locked &&
            !isCardEquipped(card.id)
        )
        .slice(0, Math.max(0, getCardSynthesisRequirement(mainCard) - 1));
}

function getCardSynthesisRequirement(cardOrGrade) {
    const grade = typeof cardOrGrade === 'string' ? cardOrGrade : cardOrGrade?.grade;
    return CARD_SYNTH_REQUIREMENTS[grade] || 0;
}

function getSameTypeSameGradeMaterialCount(mainCard) {
    if (!mainCard) return 0;
    return gameData.cards.owned
        .filter(card =>
            card.id !== mainCard.id &&
            card.type === mainCard.type &&
            card.grade === mainCard.grade &&
            !card.locked &&
            !isCardEquipped(card.id)
        )
        .length;
}

function playCardSynthesisEffect(card, previousGrade, nextGrade) {
    const popup = document.getElementById('card-inventory-popup');
    const box = popup ? popup.querySelector('.card-popup-box') : null;
    if (!box || !card) return;

    const effect = document.createElement('div');
    effect.className = 'card-synthesis-effect';
    effect.innerHTML = `
        <div class="card-synthesis-effect-core ${CARD_GRADE_CLASS[nextGrade] || ''}">
            <div class="card-synthesis-effect-grade-change ${CARD_GRADE_CLASS[nextGrade] || ''}">${previousGrade} → ${nextGrade}</div>
            <img src="${getCardIcon(card)}" alt="${getCardTypeData(card.type).name}">
            <div class="card-synthesis-effect-result">${getCardDescription(card)}</div>
            <div class="card-synthesis-effect-hint">클릭해서 닫기</div>
        </div>
    `;
    const closeEffect = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        effect.remove();
    };

    effect.addEventListener('click', closeEffect);
    effect.addEventListener('pointerdown', closeEffect);
    effect.addEventListener('touchstart', closeEffect, { passive: false });
    box.appendChild(effect);
}


function playCardBulkSynthesisEffect(sampleCard, previousGrade, nextGrade, resultCount) {
    const panel = document.querySelector('#card-tab .card-panel') || document.getElementById('card-tab') || document.body;
    if (!panel || !sampleCard || !resultCount) return;

    const effect = document.createElement('div');
    effect.className = 'card-synthesis-effect card-bulk-synthesis-effect';
    effect.innerHTML = `
        <div class="card-synthesis-effect-core ${CARD_GRADE_CLASS[nextGrade] || ''}">
            <div class="card-synthesis-effect-grade-change ${CARD_GRADE_CLASS[nextGrade] || ''}">${previousGrade} → ${nextGrade}</div>
            <img src="${getCardIcon(sampleCard)}" alt="${getCardTypeData(sampleCard.type).name}">
            <div class="card-synthesis-effect-result">
                ${getCardTypeData(sampleCard.type).name}
                <span class="card-bulk-synthesis-count">${nextGrade} ${resultCount}장 제작</span>
            </div>
            <div class="card-synthesis-effect-hint">클릭해서 닫기</div>
        </div>
    `;

    const closeEffect = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        effect.remove();
    };

    effect.addEventListener('click', closeEffect);
    effect.addEventListener('pointerdown', closeEffect);
    effect.addEventListener('touchstart', closeEffect, { passive: false });
    panel.appendChild(effect);
    setTimeout(() => {
        if (effect.parentNode) effect.remove();
    }, 2600);
}

function synthCard(cardId) {
    const main = getOwnedCardById(cardId);
    if (!main) return;

    const gradeIndex = CARD_GRADE_ORDER.indexOf(main.grade);
    if (gradeIndex < 0 || gradeIndex >= CARD_GRADE_ORDER.length - 1) {
        showCardResult('이미 최고 등급입니다.');
        return;
    }

    if (isCardEquipped(main.id)) {
        showCardResult('장착 중인 카드는 합성할 수 없습니다.');
        return;
    }

    if (main.locked) {
        showCardResult('잠금된 카드는 합성할 수 없습니다.');
        return;
    }

    const requiredCards = getCardSynthesisRequirement(main);
    const requiredMaterials = Math.max(0, requiredCards - 1);
    const materials = getSameTypeSameGradeMaterialCards(main);

    if (materials.length < requiredMaterials) {
        showCardResult(`같은 종류/같은 등급 카드가 총 ${requiredCards}장 필요합니다.`);
        return;
    }

    const previousGrade = main.grade;
    const nextGrade = CARD_GRADE_ORDER[gradeIndex + 1];
    const removeIds = new Set(materials.map(card => card.id));

    gameData.cards.owned = gameData.cards.owned.filter(card => !removeIds.has(card.id));
    main.grade = nextGrade;
    main.value = getCardValue(main.type, main.grade);

    selectedCardGroupKey = getCardGroupKey(main);
    selectedCardId = main.id;

    updateUI();
    saveData();
    renderCardPopup();
    playCardSynthesisEffect(main, previousGrade, nextGrade);
}

function synthCardBulkFromPopup(sampleCard) {
    if (!sampleCard) return;

    const gradeIndex = CARD_GRADE_ORDER.indexOf(sampleCard.grade);
    if (gradeIndex < 0 || gradeIndex >= CARD_GRADE_ORDER.length - 1) {
        showCardResult('이미 최고 등급입니다.');
        return;
    }

    const requiredCards = getCardSynthesisRequirement(sampleCard);
    if (requiredCards <= 0) {
        showCardResult('이 등급은 합성할 수 없습니다.');
        return;
    }

    const candidates = gameData.cards.owned.filter(card =>
        card.type === sampleCard.type &&
        card.grade === sampleCard.grade &&
        !card.locked &&
        !isCardEquipped(card.id)
    );

    const resultCount = Math.floor(candidates.length / requiredCards);
    if (resultCount <= 0) {
        showCardResult(`일괄 합성에는 잠금/장착 제외 ${requiredCards}장이 필요합니다.`);
        return;
    }

    const nextGrade = CARD_GRADE_ORDER[gradeIndex + 1];
    const removeIds = new Set(candidates.slice(0, resultCount * requiredCards).map(card => card.id));
    gameData.cards.owned = gameData.cards.owned.filter(card => !removeIds.has(card.id));

    for (let i = 0; i < resultCount; i++) {
        gameData.cards.owned.push({
            id: `card_${Date.now()}_${gameData.cards.nextId++}_${i}`,
            type: sampleCard.type,
            grade: nextGrade,
            value: getCardValue(sampleCard.type, nextGrade),
            locked: false
        });
    }

    selectedCardGroupKey = null;
    selectedCardId = null;
    closeCardInventoryPopup();
    updateUI();
    saveData();
    showCardResult(`일괄 합성 완료: ${nextGrade} ${resultCount}장`);
    setTimeout(() => playCardBulkSynthesisEffect(sampleCard, sampleCard.grade, nextGrade, resultCount), 40);
}

function rerollCardOption(cardId) {
    const card = getOwnedCardById(cardId);
    if (!card) return false;
    if (card.locked) {
        showCardResult('잠금된 카드는 옵션변경할 수 없습니다.');
        return false;
    }
    if ((gameData.materials.optionChangeChip || 0) < 1) {
        showCardResult('옵션변경칩이 부족합니다.');
        return false;
    }

    gameData.materials.optionChangeChip -= 1;
    card.value = getCardValue(card.type, card.grade);
    selectedCardGroupKey = getCardGroupKey(card);
    showCardResult(`옵션변경 완료 / ${getCardDescription(card)}`);
    updateUI();
    saveData();
    return true;
}

function getEquippedCardBonuses() {
    const bonuses = { atkPercent: 0, atkFlat: 0, critChance: 0, atkSpeed: 0 };
    gameData.cards.equipped.forEach(cardId => {
        const card = getOwnedCardById(cardId);
        if (!card) return;
        if (card.type === 'atkPercent') bonuses.atkPercent += Number(card.value || 0);
        if (card.type === 'atkFlat') bonuses.atkFlat += Number(card.value || 0);
        if (card.type === 'critChance') bonuses.critChance += Number(card.value || 0);
        if (card.type === 'atkSpeed') bonuses.atkSpeed += Number(card.value || 0);
    });
    return bonuses;
}

function getCardAdjustedAtk(baseAtk = gameData.atk) {
    const bonuses = getEquippedCardBonuses();
    return Math.max(1, Math.floor((Number(baseAtk || 0) + bonuses.atkFlat) * (1 + bonuses.atkPercent / 100) * (1 + getTranscendBonus('atk') + getSoulBonus('atk') + getEcanBonus('atk'))));
}

function getEffectiveCritChance() {
    const bonuses = getEquippedCardBonuses();
    return Math.max(0, Math.min(100, Number(gameData.critChance || 0) + bonuses.critChance + getSoulBonus('crit') + getEcanBonus('crit')));
}

function getEffectiveRockAttackSpeed() {
    const bonuses = getEquippedCardBonuses();
    const baseSpeed = Math.max(PLAYER_ATTACK_SPEED_MIN_MS, Number(gameData.atkSpd || 3000));
    const reduction = Math.max(0, Math.min(75, Number(bonuses.atkSpeed || 0) + getSoulBonus('atkSpeed') * 100 + getEcanBonus('atkSpeed') * 100));
    return Math.max(300, Math.floor(baseSpeed * (1 - reduction / 100)));
}

function showCardResult(message) {
    const result = document.getElementById('card-analysis-result');
    if (!result) return;
    result.innerText = message;
    result.classList.remove('active');
    void result.offsetWidth;
    result.classList.add('active');
    setTimeout(() => result.classList.remove('active'), 1800);
}

function getCardGroupKey(card) {
    if (!card) return '';
    // 인벤토리 겉 목록은 옵션 수치가 달라도 같은 종류/등급이면 하나로 묶습니다.
    return [card.type, card.grade].join('|');
}

function getCardInventoryGroups() {
    const groupMap = new Map();
    gameData.cards.owned.forEach(card => {
        const key = getCardGroupKey(card);
        if (!groupMap.has(key)) groupMap.set(key, []);
        groupMap.get(key).push(card);
    });

    const gradeOrder = new Map(CARD_GRADE_ORDER.map((grade, index) => [grade, index]));
    return Array.from(groupMap.entries()).map(([key, cards]) => ({
        key,
        cards,
        sample: cards[0]
    })).sort((a, b) => {
        const gradeDiff = (gradeOrder.get(b.sample.grade) ?? 0) - (gradeOrder.get(a.sample.grade) ?? 0);
        if (gradeDiff) return gradeDiff;
        return getCardTypeData(a.sample.type).name.localeCompare(getCardTypeData(b.sample.type).name, 'ko');
    });
}

function getSelectedCardGroupCards() {
    if (!selectedCardGroupKey) return [];
    return gameData.cards.owned.filter(card => getCardGroupKey(card) === selectedCardGroupKey);
}

function getCardOptionKindLabel(card) {
    if (!card) return '';
    if (card.type === 'atkPercent') return '데미지 %';
    if (card.type === 'atkFlat') return '데미지 고정';
    if (card.type === 'critChance') return '차지확률';
    if (card.type === 'atkSpeed') return '공속';
    return getCardTypeData(card.type).optionName || '';
}

function getEquippedSlotIndex(cardId) {
    return gameData.cards.equipped.findIndex(id => id === cardId);
}

function unequipCardById(cardId) {
    const slotIndex = getEquippedSlotIndex(cardId);
    if (slotIndex < 0) return;
    gameData.cards.equipped[slotIndex] = null;
    startAutoAttack();
    updateUI();
    saveData();
}

function selectCardInPopup(cardId) {
    const cards = getSelectedCardGroupCards();
    if (!cards.some(card => card.id === cardId)) return;
    selectedCardId = cardId;
    renderCardPopup();
}

function openCardInventoryGroup(groupKey) {
    selectedCardGroupKey = groupKey;
    const cards = getSelectedCardGroupCards();
    selectedCardId = cards[0]?.id || null;
    const popup = document.getElementById('card-inventory-popup');
    if (popup) popup.classList.add('active');
    renderCardPopup();
}

function closeCardInventoryPopup() {
    const popup = document.getElementById('card-inventory-popup');
    if (popup) popup.classList.remove('active');
}

function getPopupMainCard() {
    const cards = getSelectedCardGroupCards();
    if (!cards.length) return null;
    return cards.find(card => card.id === selectedCardId) || cards[0] || null;
}

function playCardOptionValueSlideEffect() {
    const valueEl = document.getElementById('card-selected-option-value');
    if (!valueEl) return;
    valueEl.classList.remove('option-value-slide');
    void valueEl.offsetWidth;
    valueEl.classList.add('option-value-slide');
    setTimeout(() => valueEl.classList.remove('option-value-slide'), 420);
}

function equipCardFromPopup() {
    const card = getPopupMainCard();
    if (!card) return;

    if (isCardEquipped(card.id)) {
        unequipCardById(card.id);
        showCardResult('장착 해제 완료');
        renderCardPopup();
        return;
    }

    equipCard(card.id);
    selectedCardId = card.id;
    renderCardPopup();
}

function toggleCardLock(cardId) {
    const card = getOwnedCardById(cardId);
    if (!card) return false;
    card.locked = !card.locked;
    updateUI();
    saveData();
    return true;
}

function toggleCardLockFromPopup() {
    const card = getPopupMainCard();
    if (!card) return;
    toggleCardLock(card.id);
    selectedCardId = card.id;
    renderCardPopup();
}

function synthCardFromPopup() {
    const card = getPopupMainCard();
    if (!card) return;
    synthCardBulkFromPopup(card);
}

function rerollCardOptionFromPopup() {
    const card = getPopupMainCard();
    if (!card) return;
    const changed = rerollCardOption(card.id);
    selectedCardId = card.id;
    renderCardPopup();
    if (changed) setTimeout(playCardOptionValueSlideEffect, 20);
}

function renderCardPopup() {
    const popup = document.getElementById('card-inventory-popup');
    if (!popup || !popup.classList.contains('active')) return;

    const cards = getSelectedCardGroupCards();
    const title = document.getElementById('card-popup-title');
    const summary = document.getElementById('card-popup-summary');
    const list = document.getElementById('card-popup-list');
    const equipBtn = document.getElementById('card-popup-equip-btn');
    const synthBtn = document.getElementById('card-popup-synth-btn');
    const lockBtn = document.getElementById('card-popup-lock-btn');
    const rerollBtn = document.getElementById('card-popup-reroll-btn');

    if (!cards.length) {
        if (title) title.innerText = '카드 없음';
        if (summary) summary.innerText = '';
        if (list) list.innerHTML = '<div class="card-empty-note">카드가 없습니다.</div>';
        [equipBtn, lockBtn, synthBtn, rerollBtn].forEach(btn => setButtonActive(btn, false));
        return;
    }

    if (!cards.some(card => card.id === selectedCardId)) selectedCardId = cards[0].id;

    const selected = getPopupMainCard();
    const typeData = getCardTypeData(selected.type);
    const materialCount = getSameTypeSameGradeMaterialCount(selected);
    const gradeIndex = CARD_GRADE_ORDER.indexOf(selected.grade);
    const synthRequirement = getCardSynthesisRequirement(selected);
    const selectedEquipped = isCardEquipped(selected.id);
    const bulkMaterialCount = cards.filter(card => !card.locked && !isCardEquipped(card.id)).length;
    const canSynth = !selected.locked && gradeIndex >= 0 && gradeIndex < CARD_GRADE_ORDER.length - 1 && bulkMaterialCount >= synthRequirement;
    const duplicateFamilyCard = selectedEquipped ? null : getEquippedCardByFamily(getCardEquipFamily(selected), selected.id);
    const canEquipOrUnequip = selectedEquipped || (!selected.locked && !duplicateFamilyCard && gameData.cards.equipped.some(id => !id));
    const canReroll = !selected.locked && !selectedEquipped && (gameData.materials.optionChangeChip || 0) >= 1;

    if (title) title.innerText = `${selected.grade} ${typeData.name}`;
    if (summary) {
        const synthMaterialText = gradeIndex >= 0 && gradeIndex < CARD_GRADE_ORDER.length - 1
            ? `<small class="card-synth-material-note">일괄 합성: 잠금/장착 제외 ${synthRequirement}장당 다음 등급 1장을 얻습니다.</small>`
            : `<small class="card-synth-material-note">최고 등급</small>`;
        summary.innerHTML = `
            <span class="card-selected-option"><span id="card-selected-option-value" class="card-selected-option-main">${getCardDescription(selected)}</span> <em>(${getCardOptionRangeDescription(selected)})</em></span>
            ${synthMaterialText}
        `;
    }
    if (list) {
        list.innerHTML = cards.map(card => `
            <button type="button" class="card-popup-item ${CARD_GRADE_CLASS[card.grade] || ''} ${isCardEquipped(card.id) ? 'equipped' : ''} ${card.locked ? 'locked' : ''} ${card.id === selected.id ? 'selected' : ''}" onclick="event.preventDefault(); event.stopPropagation(); selectCardInPopup('${card.id}'); return false;">
                <span class="card-lock-mark">${card.locked ? 'LOCK' : ''}</span>
                <img src="${getCardIcon(card)}" alt="${getCardTypeData(card.type).name}">
                <b>${card.grade}</b>
                <strong>${getCardDescription(card)}</strong>
                ${isCardEquipped(card.id) ? '<em>장착중</em>' : ''}
                ${card.locked ? '<em class="card-locked-label">잠금</em>' : ''}
            </button>
        `).join('');
    }

    setButtonActive(equipBtn, canEquipOrUnequip);
    if (equipBtn) {
        equipBtn.disabled = !canEquipOrUnequip;
        equipBtn.innerText = selectedEquipped ? '장착해제' : '장착';
        equipBtn.title = duplicateFamilyCard ? getCardFamilyBlockMessage(selected) : '';
    }
    setButtonActive(lockBtn, !!selected);
    if (lockBtn) {
        lockBtn.disabled = false;
        lockBtn.innerText = selected.locked ? '잠금해제' : '잠금';
        lockBtn.classList.toggle('locked-on', !!selected.locked);
    }

    setButtonActive(synthBtn, canSynth);
    if (synthBtn) {
        synthBtn.disabled = !canSynth;
        synthBtn.innerText = '일괄 합성';
        synthBtn.title = canSynth ? `잠금/장착 제외 같은 종류/같은 등급 카드 ${synthRequirement}장당 1장씩 일괄 합성합니다.` : `잠금/장착 제외 같은 종류/같은 등급 카드 ${synthRequirement}장이 필요합니다.`;
    }
    setButtonActive(rerollBtn, canReroll);
    if (rerollBtn) rerollBtn.disabled = !canReroll;
}

function renderCardUI() {
    const slots = document.getElementById('equipped-card-slots');
    if (slots) {
        slots.innerHTML = gameData.cards.equipped.map((cardId, index) => {
            const card = getOwnedCardById(cardId);
            if (!card) {
                return `<div class="equipped-card-slot empty"><div class="slot-title">SLOT ${index + 1}</div><div class="slot-empty">EMPTY</div></div>`;
            }
            return `<div class="equipped-card-slot ${CARD_GRADE_CLASS[card.grade] || ''}">
                <div class="slot-title">SLOT ${index + 1}</div>
                <div class="card-grade-label">${card.grade}</div>
                <img class="equipped-card-sprite" src="${getCardIcon(card)}" alt="${getCardTypeData(card.type).name}">
                <div class="card-name">${getCardTypeData(card.type).name}</div>
                <div class="card-option">${getCardDescription(card)}</div>
                <button type="button" class="card-mini-btn active" onclick="event.preventDefault(); event.stopPropagation(); unequipCard(${index}); return false;">해제</button>
            </div>`;
        }).join('');
    }

    const list = document.getElementById('card-inventory-list');
    if (list) {
        const groups = getCardInventoryGroups();
        if (!groups.length) {
            list.innerHTML = '<div class="card-empty-note">보유 카드가 없습니다. 카드칩 분석을 해주세요.</div>';
        } else {
            list.innerHTML = groups.map(group => {
                const card = group.sample;
                const equippedCount = group.cards.filter(item => isCardEquipped(item.id)).length;
                const lockedCount = group.cards.filter(item => item.locked).length;
                return `<button type="button" class="card-inventory-chip ${CARD_GRADE_CLASS[card.grade] || ''} ${lockedCount && lockedCount === group.cards.length ? 'all-locked' : ''}" onclick="event.preventDefault(); event.stopPropagation(); openCardInventoryGroup('${group.key}'); return false;">
                    <span class="card-chip-count">×${group.cards.length}</span>
                    <img src="${getCardIcon(card)}" alt="${getCardTypeData(card.type).name}">
                    <span class="card-grade-label">${card.grade}</span>
                    <span class="card-name">${getCardTypeData(card.type).name}</span>
                    ${equippedCount ? `<span class="card-equipped-count">장착 ${equippedCount}</span>` : ''}
                    ${lockedCount ? `<span class="card-locked-count">잠금 ${lockedCount}</span>` : ''}
                </button>`;
            }).join('');
        }
    }

    renderCardPopup();
}

const BATTLE_TIPS = [
    '스나이퍼 죠는 10스테이지마다 등장합니다.',
    '스나이퍼 죠에게는 버스터 데미지가 반감됩니다.',
    '광산은 일찍 개방할수록 좋아요.',
    'E캔은 파트너 소환뿐만 아니라 여러 곳에 쓰입니다.',
    '파트너를 소환하면 전투가 훨씬 수월해집니다.',
    '동료들은 록맨과의 싱크로율에 따라 강해집니다.',
    '보스전에서 다양한 아이템을 얻을 수 있습니다.',
    '피켈맨의 야근수당은 연봉에 포함되어 있습니다.'
];
let battleTipIndex = 0;
let battleTipTimer = null;
let partnerSyncEnhancing = false;

migrateAtkFlatCardNerfV38();
setupStage();

function setupStage() {
    const s = gameData.stage;

    stopSniperJoeActions();
    stopCutmanBossActions();
    document.querySelectorAll('.cutman-boss-cutter, .cutman-cutter-erase-pop').forEach(el => el.remove());
    updateBossBattleTabLockState();

    currentEnemyType = getStageEnemyType(s);

    enemyMaxHp = Math.floor((130 + s * 78 + Math.pow(s, 1.32) * 27) * 0.78);
    enemySpeed = getEnemyMoveSpeedForStage(s);
    enemyAtk = Math.floor(4 + s * 0.78 + Math.pow(s, 1.05) * 0.18);
    enemyX = ENEMY_START_X;

    if (currentEnemyType === 'sniperjoe') {
        enemyMaxHp = Math.floor(enemyMaxHp * 1.25);
        enemySpeed = 0;
        enemyAtk = Math.floor(enemyAtk * 1.08 + 3);
        enemyX = SNIPERJOE_START_X;
    }

    enemyHp = enemyMaxHp;

    gameData.playerMaxHp = getEffectivePlayerMaxHp();
    gameData.playerHp = gameData.playerMaxHp;

    enemyDead = false;
    enemyAttacking = false;
    enemyStunned = false;
    if (enemyStunTimer) {
        clearTimeout(enemyStunTimer);
        enemyStunTimer = null;
    }
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
        enemyImg.classList.remove('boss-enter', 'enemy-stunned');
        clearEnemyStunVisualEffect();

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
    currentBossLevel = 1;
    currentBossMode = 'challenge';
    updateBossBattleTabLockState();

    updateEnemyPosition();
    applyRockmanRenderFrame();
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

    if (rockman) {
        rockman.src = getRockStandSprite();
        applyRockmanRenderFrame();
    }
    if (rushImg) rushImg.style.display = isSuperRockUnlocked() ? 'none' : '';
    if (rushImg && gameData.rushOwned && !isSuperRockUnlocked()) rushImg.src = 'sprites/partner/rush/rush_st.png';
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
        if (superRockUnlockPaused) return;
        if (!isSniperJoeBattle() || enemyDead || playerDead || enemyStunned || sniperJoeJumping || sniperJoeAttacking) return;

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
    if (!isSniperJoeBattle() || enemyDead || playerDead || enemyStunned || sniperJoeAttacking) return;

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
    if (superRockUnlockPaused) return;
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
    rImg.src = getRockWalkSprite(rockFrame);
    applyRockmanRenderFrame();

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


function applyRushFrameStabilize(frameKey = 'st') {
    const rushImg = document.getElementById('rush-img');
    if (!rushImg) return;
    const offset = RUSH_FRAME_STABILIZE_OFFSET[frameKey] || RUSH_FRAME_STABILIZE_OFFSET.st;
    rushImg.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
}

function animateRush() {
    const rushImg = document.getElementById('rush-img');
    if (!rushImg) return;
    const rushArea = document.getElementById('rush-area');
    if (isSuperRockUnlocked()) {
        if (rushArea) rushArea.classList.remove('active');
        rushImg.style.display = 'none';
        applyRushFrameStabilize('st');
        return;
    }
    rushImg.style.display = '';
    if (!gameData.rushOwned) {
        applyRushFrameStabilize('st');
        return;
    }

    if (isStillBossBattle()) {
        rushImg.src = 'sprites/partner/rush/rush_st.png';
        applyRushFrameStabilize('st');
        return;
    }

    const frame = rushWalkFrames[rushWalkIndex];
    rushImg.src = `sprites/partner/rush/rush_0${frame}.png`;
    applyRushFrameStabilize(frame);
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


const PARTNER_SYNC_UPGRADE_COST = 100;
const PARTNER_SYNC_UPGRADE_MIN_GAIN = 2;
const PARTNER_SYNC_UPGRADE_MAX_GAIN = 5;

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
    return Math.max(1, Math.floor(getCardAdjustedAtk(gameData.atk) * sync * (1 + getTranscendBonus('partner') + getEcanBonus('partner'))));
}

function togglePartnerAttackUpgrade() {
    const wing = document.getElementById('partner-sync-wing');
    if (!wing) return;

    wing.classList.toggle('open');
    updateUI();
}

function toggleResourceWing() {
    const wing = document.getElementById('resource-wing');
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


const PARTNER_OWNED_KEYS = ['rushOwned', 'beatOwned', 'bluesOwned', 'forteOwned', 'xOwned', 'zeroOwned', 'exeRockmanOwned'];
const PARTNER_BLUEPRINT_COSTS = [
    null,
    { type: 'screws', amount: 800 },
    { type: 'screws', amount: 3200 },
    { type: 'crystals', amount: 25 },
    { type: 'crystals', amount: 60 },
    { type: 'crystals', amount: 120 },
    { type: 'crystals', amount: 220 }
];

function getOwnedPartnerCount() {
    return PARTNER_OWNED_KEYS.reduce((count, key) => count + (gameData[key] ? 1 : 0), 0);
}

function getPartnerSlotLimit() {
    return Math.max(1, Math.min(PARTNER_BLUEPRINT_MAX_SLOTS, Math.floor(gameData.partnerBlueprints?.slots || 1)));
}

function canSummonMorePartners() {
    return getOwnedPartnerCount() < getPartnerSlotLimit();
}

function showPartnerSlotMessage(message) {
    const desc = document.getElementById('partner-popup-desc');
    if (desc) {
        desc.innerText = message;
        desc.classList.remove('partner-popup-warn');
        void desc.offsetWidth;
        desc.classList.add('partner-popup-warn');
    }
}

function guardPartnerBlueprintSlot() {
    if (canSummonMorePartners()) return true;
    showPartnerSlotMessage('전송장치가 부족합니다. 전송장치를 제작하면 전송가능 동료 수가 늘어납니다.');
    return false;
}

function getNextPartnerBlueprintCost() {
    const slots = getPartnerSlotLimit();
    if (slots >= PARTNER_BLUEPRINT_MAX_SLOTS) return null;
    return PARTNER_BLUEPRINT_COSTS[slots] || { type: 'crystals', amount: 250 };
}

function craftPartnerBlueprint() {
    const cost = getNextPartnerBlueprintCost();
    if (!cost) return;
    if ((gameData[cost.type] || 0) < cost.amount) return;

    gameData[cost.type] -= cost.amount;
    gameData.partnerBlueprints.slots = Math.min(PARTNER_BLUEPRINT_MAX_SLOTS, getPartnerSlotLimit() + 1);
    updateUI();
    saveData();
}

function getPartnerSpeedUpgradeCost(type) {
    const lv = Math.max(0, Math.floor(gameData.partnerSpeedLv?.[type] || 0));
    return 20 + lv * 12;
}

function upgradePartnerSpeed(type) {
    const data = PARTNER_ATTACK_DATA[type] || getPartnerInventoryData(type);
    if (!data || !gameData[data.ownedKey]) return false;
    if (!Object.prototype.hasOwnProperty.call(gameData.partnerSpeedLv, type)) return false;
    const lv = Math.max(0, Math.floor(gameData.partnerSpeedLv[type] || 0));
    if (lv >= PARTNER_SPEED_MAX_LEVEL) return false;

    const cost = getPartnerSpeedUpgradeCost(type);
    if ((gameData.crystals || 0) < cost) return false;

    gameData.crystals -= cost;
    gameData.partnerSpeedLv[type] = lv + 1;
    startBluesAttack();
    startForteAttack();
    startXAttack();
    startExeRockmanAttack();
    startZeroAttack();
    updateUI();
    saveData();
    return true;
}

function upgradePartnerSpeedFromPopup() {
    upgradePartnerSpeed(currentPartnerInventoryType);
    updatePartnerInventoryPopup();
}

function openPartnerSpeedPopup() {
    const popup = document.getElementById('partner-speed-popup');
    if (popup) popup.classList.add('active');
    renderPartnerSpeedPopup();
}

function closePartnerSpeedPopup() {
    const popup = document.getElementById('partner-speed-popup');
    if (popup) popup.classList.remove('active');
}

function renderPartnerSpeedPopup() {
    const list = document.getElementById('partner-speed-popup-list');
    if (!list) return;

    const types = ['blues', 'forte', 'x', 'zero', 'exeRockman'];
    list.innerHTML = types.map(type => {
        const data = PARTNER_ATTACK_DATA[type];
        if (!data) return '';
        const owned = !!gameData[data.ownedKey];
        const lv = Math.max(0, Math.floor(gameData.partnerSpeedLv?.[type] || 0));
        const cost = getPartnerSpeedUpgradeCost(type);
        const maxed = lv >= PARTNER_SPEED_MAX_LEVEL;
        const canUpgrade = owned && !maxed && (gameData.crystals || 0) >= cost;
        const interval = (getPartnerAttackIntervalForType(type, type === 'zero' ? ZERO_ATTACK_INTERVAL_MULTIPLIER : 1) / 1000).toFixed(2);
        return `
            <div class="partner-speed-popup-row ${owned ? 'owned' : 'locked'}">
                <img src="${data.portrait}" alt="${data.name}">
                <div class="partner-speed-popup-info">
                    <b>${data.name}</b>
                    <span>${owned ? `LV.${lv} / ${PARTNER_SPEED_MAX_LEVEL} · ${interval}초` : '미소환'}</span>
                </div>
                <button type="button" class="partner-speed-popup-btn ${canUpgrade ? 'active' : ''}" ${canUpgrade ? '' : 'disabled'} onclick="event.preventDefault(); event.stopPropagation(); upgradePartnerSpeedFromBattle('${type}'); return false;">
                    ${maxed ? 'MAX' : `강화 <img src="sprites/item/e_can.png" class="btn-item-icon" alt="E캔"> ${cost}`}
                </button>
            </div>
        `;
    }).join('');
}

function upgradePartnerSpeedFromBattle(type) {
    upgradePartnerSpeed(type);
    renderPartnerSpeedPopup();
    updateUI();
}

const PARTNER_INVENTORY_DATA = {
    rush: {
        name: '러쉬',
        portrait: 'sprites/partner/rush/rush_portrait.png',
        fragmentsKey: 'rushFragments',
        ownedKey: 'rushOwned',
        desc: '- 차지샷 데미지 강화 해금',
        buyFn: buyRushFragment,
        summonFn: summonRush
    },
    beat: {
        name: '비트',
        portrait: 'sprites/partner/beat/beat_portrait.png',
        fragmentsKey: 'beatFragments',
        ownedKey: 'beatOwned',
        desc: '- 동료별 공속 강화 기능 해금',
        buyFn: buyBeatFragment,
        summonFn: summonBeat
    },
    blues: {
        name: '블루스',
        portrait: 'sprites/partner/blues/blues_portrait.png',
        fragmentsKey: 'bluesFragments',
        ownedKey: 'bluesOwned',
        desc: '- 적 접근시 돌진 공격 + 넉백',
        buyFn: buyBluesFragment,
        summonFn: summonBlues
    },
    forte: {
        name: '포르테',
        portrait: 'sprites/partner/forte/forte_portrait.png',
        fragmentsKey: 'forteFragments',
        ownedKey: 'forteOwned',
        desc: '- 버스터 공격',
        buyFn: buyForteFragment,
        summonFn: summonForte
    },
    x: {
        name: '엑스',
        portrait: 'sprites/partner/x/x_portrait.png',
        fragmentsKey: 'xFragments',
        ownedKey: 'xOwned',
        desc: '- 버스터 공격',
        buyFn: buyXFragment,
        summonFn: summonX
    },
    zero: {
        name: '제로',
        portrait: 'sprites/partner/zero/zero_portrait.png',
        fragmentsKey: 'zeroFragments',
        ownedKey: 'zeroOwned',
        desc: '- 제트세이버 공격',
        buyFn: buyZeroFragment,
        summonFn: summonZero
    },
    exeRockman: {
        name: '록맨.EXE',
        portrait: 'sprites/partner/rockexe/rockexe_portrait.png',
        fragmentsKey: 'exeRockmanFragments',
        ownedKey: 'exeRockmanOwned',
        desc: '- 버스터 공격 / 스턴밤 공격',
        buyFn: buyExeRockmanFragment,
        summonFn: summonExeRockman
    }
};

let currentPartnerInventoryType = 'rush';

function getPartnerInventoryData(type = currentPartnerInventoryType) {
    return PARTNER_INVENTORY_DATA[type] || PARTNER_INVENTORY_DATA.rush;
}

function openPartnerInventoryPopup(type) {
    clearPartnerInlineJoinStage();
    currentPartnerInventoryType = type;
    const popup = document.getElementById('partner-inventory-popup');
    if (popup) popup.classList.add('active');
    updatePartnerInventoryPopup();
}

function closePartnerInventoryPopup() {
    clearPartnerInlineJoinStage();
    const popup = document.getElementById('partner-inventory-popup');
    if (popup) popup.classList.remove('active');
}

function buyPartnerInventoryFragments(amount) {
    const data = getPartnerInventoryData();
    if (!data?.buyFn) return;
    data.buyFn(amount);
    updatePartnerInventoryUI();
}

function summonPartnerFromInventory() {
    const data = getPartnerInventoryData();
    if (!data?.summonFn) return;
    data.summonFn();
    updatePartnerInventoryUI();
}

function getPartnerDataStatusLabel(progress, owned = false) {
    if (owned) return 'DATA COMPLETE';
    const value = Math.max(0, Math.floor(progress || 0));
    if (value >= 100) return 'DATA READY';
    return 'DATA 미제작';
}

function updatePartnerInventoryPopup() {
    const data = getPartnerInventoryData();
    if (!data) return;

    const fragments = Math.max(0, Math.floor(gameData[data.fragmentsKey] || 0));
    const owned = !!gameData[data.ownedKey];

    const icon = document.getElementById('partner-popup-icon');
    const title = document.getElementById('partner-popup-title');
    const desc = document.getElementById('partner-popup-desc');
    const fragmentsEl = document.getElementById('partner-popup-fragments');

    if (icon) icon.src = data.portrait;
    if (title) title.innerText = data.name;
    if (desc) desc.innerText = data.desc;
    if (fragmentsEl) fragmentsEl.innerText = getPartnerDataStatusLabel(fragments, owned);

    const buy1 = document.getElementById('partner-popup-buy1');
    const buy10 = document.getElementById('partner-popup-buy10');
    const buy100 = document.getElementById('partner-popup-buy100');
    const summon = document.getElementById('partner-popup-summon');
    const speedBtn = document.getElementById('partner-popup-speed-upgrade');
    const buy100CostText = document.getElementById('partner-popup-buy100-cost');
    const summonSub = document.getElementById('partner-popup-summon-sub');

    const dataReady = fragments >= 100;
    const remainingFragments = Math.max(0, 100 - fragments);
    const bulkBuyCost = remainingFragments > 0 ? remainingFragments : 100;
    const canBuy100 = !owned && !dataReady && gameData.crystals >= bulkBuyCost;
    const canSummon = !owned && dataReady && canSummonMorePartners();

    // 데이터 제작 버튼은 제작 완료 후에도 파란 제작 버튼 모양과 문구를 유지하고,
    // 클릭만 비활성화합니다. READY 상태는 소환 버튼에서만 보여줍니다.
    setButtonActive(buy100, canBuy100 || dataReady || owned);
    if (buy100) buy100.classList.remove('complete');
    setButtonActive(summon, canSummon);

    if (buy100) {
        const buyTitle = buy100.querySelector('.partner-popup-btn-title');
        if (buyTitle) buyTitle.innerText = '데이터 제작';
        buy100.title = fragments > 0 && fragments < 100 ? '기존 저장 데이터가 남아 있어 부족한 데이터만 제작합니다.' : '';
    }
    if (buy100CostText) {
        const costWrap = buy100CostText.closest('.partner-popup-btn-cost');
        const costIcon = costWrap ? costWrap.querySelector('img') : null;
        if (costIcon) costIcon.style.display = '';
        buy100CostText.innerText = bulkBuyCost.toLocaleString();
    }

    if (summon) {
        const summonBlocked = !canSummonMorePartners() && !owned;
        const summonTitle = summon.querySelector('.partner-popup-btn-title');
        if (summonTitle) summonTitle.innerText = summonBlocked ? '전송 불가' : '소환';
        if (summonSub) summonSub.innerText = summonBlocked ? '전송가능 수 부족' : 'READY';
        summon.title = summonBlocked ? '동료 전송장치를 제작해 전송가능 동료 수를 늘려야 합니다.' : ''; 
    }

    if (speedBtn) {
        const speedLv = Math.max(0, Math.floor(gameData.partnerSpeedLv?.[currentPartnerInventoryType] || 0));
        const canSpeed = owned && Object.prototype.hasOwnProperty.call(gameData.partnerSpeedLv, currentPartnerInventoryType) && speedLv < PARTNER_SPEED_MAX_LEVEL && (gameData.crystals || 0) >= getPartnerSpeedUpgradeCost(currentPartnerInventoryType);
        speedBtn.style.display = owned && Object.prototype.hasOwnProperty.call(gameData.partnerSpeedLv, currentPartnerInventoryType) ? '' : 'none';
        speedBtn.innerText = speedLv >= PARTNER_SPEED_MAX_LEVEL ? '공속 MAX' : `공속 강화 LV.${speedLv} / E캔 ${getPartnerSpeedUpgradeCost(currentPartnerInventoryType)}`;
        speedBtn.disabled = !canSpeed;
        setButtonActive(speedBtn, canSpeed);
    }

    [buy1, buy10, buy100, summon].forEach(btn => {
        if (!btn) return;
        const isSummon = btn === summon;
        if (btn === buy1 || btn === buy10) {
            btn.style.display = 'none';
            btn.disabled = true;
        } else if (btn === buy100) {
            btn.style.display = '';
            btn.disabled = owned || dataReady || !canBuy100;
        } else {
            btn.disabled = owned || (!btn.classList.contains('active') && !isSummon) || (isSummon && !canSummon);
            btn.style.display = owned ? 'none' : '';
        }
    });
}

function updatePartnerInventoryUI() {
    const ecanCount = document.getElementById('partner-e-can-count');
    if (ecanCount) ecanCount.innerText = Math.floor(gameData.crystals || 0).toLocaleString();

    const slotText = document.getElementById('partner-blueprint-slot-text');
    if (slotText) slotText.innerText = `${getOwnedPartnerCount()} / ${getPartnerSlotLimit()}`;
    const nextCost = getNextPartnerBlueprintCost();
    const blueprintBtn = document.getElementById('partner-blueprint-craft-btn');
    if (blueprintBtn) {
        if (!nextCost) {
            blueprintBtn.innerText = '전송장치 MAX';
            blueprintBtn.disabled = true;
            setButtonActive(blueprintBtn, false);
        } else {
            const iconSrc = nextCost.type === 'screws' ? 'sprites/item/screw.png' : 'sprites/item/e_can.png';
            const label = nextCost.type === 'screws' ? '나사' : 'E캔';
            blueprintBtn.innerHTML = `전송장치 제작 <img src="${iconSrc}" class="btn-item-icon" alt="${label}">${nextCost.amount.toLocaleString()}`;
            const canCraft = (gameData[nextCost.type] || 0) >= nextCost.amount;
            blueprintBtn.disabled = !canCraft;
            setButtonActive(blueprintBtn, canCraft);
        }
    }

    Object.keys(PARTNER_INVENTORY_DATA).forEach(type => {
        const data = PARTNER_INVENTORY_DATA[type];
        const tile = document.getElementById(`partner-tile-${type}`);
        if (!tile) return;

        const fragments = Math.max(0, Math.floor(gameData[data.fragmentsKey] || 0));
        const owned = !!gameData[data.ownedKey];
        const ready = !owned && fragments >= 100;
        tile.classList.toggle('complete', owned);
        tile.classList.toggle('ready', ready);

        const badge = document.getElementById(`${type}-complete-badge`);
        if (badge) badge.classList.toggle('active', owned);
    });

    const popup = document.getElementById('partner-inventory-popup');
    if (popup?.classList.contains('active')) {
        updatePartnerInventoryPopup();
    }
}

function startBluesAttack() {
  if (bluesAttackTimer) clearInterval(bluesAttackTimer);

  bluesAttackTimer = setInterval(() => {
    if (superRockUnlockPaused) return;
    if (!gameData.bluesOwned || enemyDead || playerDead || bluesAttacking) return;

    if (enemyX > 180) return;

    bluesShieldCharge();
  }, getPartnerAttackIntervalForType('blues'));
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
    if (superRockUnlockPaused) return;
    if (!gameData.forteOwned || enemyDead || playerDead || forteAttacking) return;

    firePartnerBuster('forte');
  }, getPartnerAttackIntervalForType('forte'));
}

function startXAttack() {
  if (xAttackTimer) clearInterval(xAttackTimer);

  xAttackTimer = setInterval(() => {
    if (superRockUnlockPaused) return;
    if (!gameData.xOwned || enemyDead || playerDead || xAttacking) return;

    firePartnerBuster('x');
  }, getPartnerAttackIntervalForType('x'));
}

function startExeRockmanAttack() {
  if (rockexeAttackTimer) clearInterval(rockexeAttackTimer);

  rockexeAttackTimer = setInterval(() => {
    if (superRockUnlockPaused) return;
    if (!gameData.exeRockmanOwned || enemyDead || playerDead || rockexeAttacking) return;

    firePartnerBuster('exeRockman');
  }, getPartnerAttackIntervalForType('exeRockman'));
}

function startZeroAttack() {
  if (zeroAttackTimer) clearInterval(zeroAttackTimer);

  zeroAttackTimer = setInterval(() => {
    if (superRockUnlockPaused) return;
    if (!gameData.zeroOwned || enemyDead || playerDead || zeroAttacking) return;

    zeroMeleeAttack();
  }, getPartnerAttackIntervalForType('zero', ZERO_ATTACK_INTERVAL_MULTIPLIER));
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

    const isChargeShot = Math.random() * 100 < getEffectiveCritChance();
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

            if (!bullet.isConnected || bullet.dataset.cutmanErased === '1') {
                bullet.remove();
                finishAttack();
                return;
            }

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

                // 에그제 스턴밤은 확률 발동으로 변경했습니다. 보스전에서는 스턴 시간이 더 짧습니다.
                if (!enemyDead && !playerDead && Math.random() < EXE_BOMB_STUN_CHANCE) {
                    applyEnemyStun(isBossBattle ? EXE_BOMB_BOSS_STUN_DURATION_MS : EXE_BOMB_STUN_DURATION_MS);
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
        if (superRockUnlockPaused) return;
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
    const failedEnemyType = currentEnemyType;

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
            const downAmount = failedEnemyType === 'sniperjoe' ? 5 : 3;
            gameData.stage = Math.max(1, gameData.stage - downAmount);
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
    if (superRockUnlockPaused) return;
    if (enemyDead || playerDead) return;

    const rockman = document.getElementById('rockman-img');
    const enemy = document.getElementById('enemy-img');
    const screen = document.querySelector('.game-screen');

    if (!rockman || !enemy || !screen) return;

    applyRockmanRenderFrame();

    const isChargeShot = Math.random() * 100 < getEffectiveCritChance();

    if (isChargeShot) fireChargeShot(screen, enemy);
    else fireNormalShot(screen, enemy);
}

function getBusterPosition() {
    const pos = getRockmanMuzzlePoint();
    return {
        x: pos.x,
        y: pos.yBottom
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

    // 적 탄환은 록맨 박스 중앙이 아니라 실제 렌더링된 몸통 중심을 목표로 합니다.
    const impactX = getRockmanBodyCenterPoint().x;

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

function getRockmanFrameAnchorOffset() {
    const rockman = document.getElementById('rockman-img');
    if (!rockman) return { x: 0, y: 0 };

    const src = rockman.getAttribute('src') || '';
    let key = 'st';
    const match = src.match(/(?:rock|super_r)(?:_walk)?_0?([123])\.png$/);
    if (match) key = match[1];

    const offsets = ROCKMAN_RENDER_CONFIG.frameAnchorOffsets || {};
    return offsets[key] || offsets.st || { x: 0, y: 0 };
}

function applyRockmanRenderFrame() {
    const rockman = document.getElementById('rockman-img');
    if (!rockman) return;

    // 록맨 렌더링은 위치/크기/프레임별 기준점만 보정하고 src/애니메이션 루프는 절대 건드리지 않습니다.
    // CSS 절대 좌표가 아니라, 각 PNG의 발바닥 중앙 기준점을 맞추는 방식입니다.
    const offset = getRockmanFrameAnchorOffset();
    rockman.style.height = `${ROCKMAN_RENDER_CONFIG.height}px`;
    rockman.style.width = 'auto';
    rockman.style.maxWidth = 'none';
    rockman.style.objectFit = 'contain';
    rockman.style.objectPosition = 'center bottom';
    rockman.style.imageRendering = 'pixelated';
    rockman.style.transform = `translateX(calc(-50% + ${offset.x}px)) translateY(${offset.y}px)`;
}

function getRockmanRenderedPoint(xRatio = 0.5, yRatio = 0.5, offsetX = 0, offsetY = 0) {
    const screen = document.querySelector('.game-screen');
    const rockman = document.getElementById('rockman-img');

    if (!screen || !rockman) return { x: 0, yBottom: 0, yTop: 0 };

    applyRockmanRenderFrame();

    const screenRect = screen.getBoundingClientRect();
    const rockRect = rockman.getBoundingClientRect();
    const x = rockRect.left - screenRect.left + rockRect.width * xRatio + offsetX;
    const yTop = rockRect.top - screenRect.top + rockRect.height * yRatio + offsetY;

    return {
        x,
        yTop,
        yBottom: screenRect.height - yTop
    };
}

function getRockmanMuzzlePoint() {
    return getRockmanRenderedPoint(
        ROCKMAN_RENDER_CONFIG.muzzleXRatio,
        ROCKMAN_RENDER_CONFIG.muzzleYRatio,
        ROCKMAN_RENDER_CONFIG.muzzleOffsetX,
        ROCKMAN_RENDER_CONFIG.muzzleOffsetY
    );
}

function getRockmanBodyCenterPoint() {
    return getRockmanRenderedPoint(
        ROCKMAN_RENDER_CONFIG.bodyCenterXRatio,
        ROCKMAN_RENDER_CONFIG.bodyCenterYRatio,
        0,
        0
    );
}

function getRockBulletPosition(isChargeShot = false) {
    const pos = getRockmanMuzzlePoint();
    // v96: 기본탄은 v95보다 소폭 키우고, 차지샷은 기본탄 대비 약 5배 크기로 분리합니다.
    const width = isChargeShot ? 30 : 6;
    const height = isChargeShot ? 20 : 4;

    let realMobileOffsetX = 0;
    if (isRealMobileModeActive()) {
        const rockman = document.getElementById('rockman-img');
        if (rockman) {
            realMobileOffsetX = rockman.getBoundingClientRect().width * (ROCKMAN_RENDER_CONFIG.realMobileBulletOffsetXRatio || 0);
        }
    }

    return {
        // 탄환의 왼쪽 시작점을 총구 끝에 거의 맞춥니다.
        // 실제 모바일에서는 차징 이펙트 기준은 유지하고 탄환 이미지만 별도 좌우 보정합니다.
        x: pos.x - 2 + realMobileOffsetX,
        y: pos.yBottom - height / 2,
        width,
        height
    };
}

function createRockBulletElement(isChargeShot = false) {
    const bullet = document.createElement('div');
    bullet.className = isChargeShot ? 'rock-bullet rock-charge-bullet' : 'rock-bullet rock-normal-bullet';
    if (isChargeShot && isSuperRockUnlocked()) {
        bullet.classList.add('super-rock-rocket-punch');
        bullet.style.backgroundImage = `url("${SUPER_ROCK_SPRITES.rocketPunch}")`;
    }
    return bullet;
}

function startChargeBulletAnimation(bullet) {
    if (isSuperRockUnlocked()) {
        bullet.style.backgroundImage = `url("${SUPER_ROCK_SPRITES.rocketPunch}")`;
        return null;
    }

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
        if (!bullet.isConnected || bullet.dataset.cutmanErased === '1') {
            bullet.remove();
            return;
        }
        const hit = applyDamage(false);
        if (hit && !enemyDead) playEnemyHit(enemy);
        bullet.remove();
    }, duration);
}

function fireChargeShot(screen, enemy) {
    const charge = document.createElement('div');
    charge.className = 'charge-effect';

    const chargePos = getBusterPosition();
    charge.style.left = (chargePos.x - 9) + "px";
    charge.style.bottom = (chargePos.y - 9) + "px";

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
            if (chargeBulletTimer) clearInterval(chargeBulletTimer);
            if (!bullet.isConnected || bullet.dataset.cutmanErased === '1') {
                bullet.remove();
                return;
            }
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

function clearEnemyStunVisualEffect() {
    document.querySelectorAll('.enemy-stun-effect').forEach(el => el.remove());
}

function createEnemyStunVisualEffect() {
    clearEnemyStunVisualEffect();

    const enemyArea = document.getElementById('enemy-area');
    if (!enemyArea) return;

    const effect = document.createElement('div');
    effect.className = 'enemy-stun-effect';
    effect.innerHTML = `
        <div class="enemy-stun-ring"></div>
        <div class="enemy-stun-stars">
            <span>★</span><span>★</span><span>★</span>
        </div>
    `;
    enemyArea.appendChild(effect);
}

function applyEnemyStun(duration = EXE_BOMB_STUN_DURATION_MS) {
    if (enemyDead || playerDead) return;
    duration = Math.max(120, Math.floor(isBossBattle ? Math.min(duration, EXE_BOMB_BOSS_STUN_DURATION_MS) : duration));

    const enemy = document.getElementById('enemy-img');
    enemyStunned = true;

    // 스나이퍼죠가 점프 중일 때도 에그제 폭탄 스턴은 반드시 들어가야 합니다.
    // 점프 회피 플래그/애니메이션을 즉시 끊고, 스턴 상태 표시를 우선 적용합니다.
    if (isSniperJoeBattle()) {
        sniperJoeJumping = false;
        sniperJoeAttacking = false;
        if (enemy) {
            enemy.classList.remove('sniperjoe-jump');
            enemy.src = ENEMY_TYPE_DATA.sniperjoe.idleFrame;
        }
    }

    if (enemy) {
        enemy.classList.remove('enemy-stunned');
        void enemy.offsetWidth;
        enemy.classList.add('enemy-stunned');
    }

    createEnemyStunVisualEffect();

    if (enemyStunTimer) {
        clearTimeout(enemyStunTimer);
        enemyStunTimer = null;
    }

    enemyStunTimer = setTimeout(() => {
        enemyStunned = false;
        enemyStunTimer = null;
        const latestEnemy = document.getElementById('enemy-img');
        if (latestEnemy) latestEnemy.classList.remove('enemy-stunned');
        clearEnemyStunVisualEffect();
    }, duration);
}

function applyDamage(isChargeShot) {
    if (enemyDead || playerDead) return;

    let damage = getRockAttackBaseDamage();

    if (isChargeShot) {
        const chargeMultiplier = isSuperRockUnlocked() ? gameData.critMultiplier * 2 : gameData.critMultiplier;
        damage = Math.floor(damage * chargeMultiplier);
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

    if (isBossBattle) {
        damage = Math.max(1, Math.floor(damage * (1 + getEcanBonus('boss'))));
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


function rollBossBattleReward(bossKey = currentBossType, level = currentBossLevel) {
    const bossData = getBossScaledData(bossKey || 'classic_cutman', level || 1);
    const rewards = bossData?.rewards || {};

    const screws = Math.floor(rollInt(rewards.screwsMin || 180, rewards.screwsMax || 320) * (1 + getTranscendBonus('screw') + getSoulBonus('screw')));
    gameData.screws += screws;

    const rewardData = {
        screws,
        cardChip: 0,
        superRockChip: 0
    };

    if (Math.random() < (rewards.cardChipChance ?? 0.78)) {
        const amount = Math.max(1, Math.floor(rollInt(rewards.cardChipMin || 1, rewards.cardChipMax || 2) * (1 + getTranscendBonus('cardChip'))));
        gameData.materials.cardChip += amount;
        rewardData.cardChip = amount;
    }

    if (Math.random() < (rewards.superRockChipChance ?? 0.05)) {
        const amount = rollInt(rewards.superRockChipMin || 1, rewards.superRockChipMax || 1);
        gameData.materials.superRockChip += amount;
        rewardData.superRockChip = amount;
    }

    return rewardData;
}

function mergeBossRewardTotals(total, reward) {
    total.screws = Math.floor(total.screws || 0) + Math.floor(reward.screws || 0);
    total.cardChip = Math.floor(total.cardChip || 0) + Math.floor(reward.cardChip || 0);
    total.superRockChip = Math.floor(total.superRockChip || 0) + Math.floor(reward.superRockChip || 0);
    return total;
}

function giveBossBattleReward(displayDelay = 0) {
    const rewardData = rollBossBattleReward(currentBossType, currentBossLevel);

    if (displayDelay > 0) {
        setTimeout(() => {
            showRewardText(rewardData);
        }, displayDelay);
    } else {
        showRewardText(rewardData);
    }
}

function getSniperJoeRewardKey(stage = gameData.stage) {
    return String(Math.max(1, Math.floor(stage || 1)));
}

function hasClaimedSniperJoeReward(stage = gameData.stage) {
    const key = getSniperJoeRewardKey(stage);
    return !!(gameData.sniperJoeRewardClaimed && gameData.sniperJoeRewardClaimed[key]);
}

function markSniperJoeRewardClaimed(stage = gameData.stage) {
    if (!gameData.sniperJoeRewardClaimed || typeof gameData.sniperJoeRewardClaimed !== 'object') {
        gameData.sniperJoeRewardClaimed = {};
    }
    gameData.sniperJoeRewardClaimed[getSniperJoeRewardKey(stage)] = true;
}

function getSniperJoeEcanReward(stage = gameData.stage) {
    const st = Math.max(10, Math.floor(stage || 10));
    const step = Math.max(0, Math.floor((st - 10) / 10));
    return 100 + step * 8;
}

function rollSniperJoeBonusReward(stage = gameData.stage) {
    const reward = {
        crystals: getSniperJoeEcanReward(stage),
        soulStones: 0,
        optionChangeChip: 0,
        bossReplayCard: 0
    };

    const step = Math.max(0, Math.floor((Math.max(10, stage) - 10) / 10));

    if (Math.random() < Math.min(0.10, 0.035 + step * 0.002)) {
        reward.soulStones = 1;
    }

    if (Math.random() < Math.min(0.08, 0.025 + step * 0.0015)) {
        reward.optionChangeChip = 1;
    }

    if (Math.random() < Math.min(0.07, 0.020 + step * 0.0015)) {
        reward.bossReplayCard = 1;
    }

    return reward;
}

function applySniperJoeBonusReward(reward) {
    if (!reward) return;
    gameData.crystals += Math.max(0, Math.floor(reward.crystals || 0));
    gameData.soulStones += Math.max(0, Math.floor(reward.soulStones || 0));
    gameData.materials.optionChangeChip += Math.max(0, Math.floor(reward.optionChangeChip || 0));
    gameData.materials.bossReplayCard += Math.max(0, Math.floor(reward.bossReplayCard || 0));
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

        const progress = getBossProgress(currentBossType);
        if (currentBossMode === 'challenge') {
            progress.clearedLevel = Math.max(progress.clearedLevel || 0, Math.floor(currentBossLevel || 1));
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
        let rewardParts = [`+${screwReward}${SCREW_ICON_HTML}`];

        gameData.screws += screwReward;

        if (Math.random() < (rewards.cardChipChance || 0)) {
            const amount = Math.max(1, Math.floor(rollInt(rewards.cardChipMin || 1, rewards.cardChipMax || 1) * (1 + getTranscendBonus('cardChip'))));
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

    const reward = Math.floor((80 + gameData.stage * 20) * (1 + getTranscendBonus('screw') + getSoulBonus('screw')));
    gameData.screws += reward;

    const rewardTextData = { screws: reward };

    if (isSniperJoeBattle()) {
        const currentStage = Math.max(1, Math.floor(gameData.stage || 1));
        if (!hasClaimedSniperJoeReward(currentStage)) {
            const bonusReward = rollSniperJoeBonusReward(currentStage);
            applySniperJoeBonusReward(bonusReward);
            Object.assign(rewardTextData, bonusReward);
            markSniperJoeRewardClaimed(currentStage);
        }
    }

    playEnemyDeathEffect();
    showRewardText(rewardTextData);

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

    const bodyCenter = getRockmanBodyCenterPoint();

    const text = document.createElement('div');
    text.className = 'damage-text';
    text.innerText = `-${damage}`;
    text.style.color = '#ff3b3b';
    text.style.textShadow = '0 0 8px #ff3b3b';
    text.style.left = (bodyCenter.x - 8) + 'px';
    text.style.right = 'auto';
    text.style.bottom = (bodyCenter.yBottom + 8) + 'px';

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
        text.innerHTML = `+${reward}${SCREW_ICON_HTML}`;
    } else if (typeof reward === 'string') {
        text.innerHTML = reward;
    } else if (reward && typeof reward === 'object') {
        const parts = [];
        parts.push(`<span class="reward-inline-item reward-inline-screw">+${reward.screws || 0}${SCREW_ICON_HTML}</span>`);

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

        if (reward.crystals) {
            parts.push(
                `<span class="reward-inline-item"><img class="reward-inline-icon" src="sprites/item/e_can.png" alt="E캔"> E캔 +${reward.crystals}</span>`
            );
        }

        if (reward.soulStones) {
            parts.push(
                `<span class="reward-inline-item"><img class="reward-inline-icon" src="sprites/item/light_stone.png" alt="라이트코어"> 라이트코어 +${reward.soulStones}</span>`
            );
        }

        if (reward.optionChangeChip) {
            parts.push(
                `<span class="reward-inline-item"><img class="reward-inline-icon" src="sprites/card/option_stone.png" alt="옵션변경칩"> 옵션변경칩 +${reward.optionChangeChip}</span>`
            );
        }

        if (reward.bossReplayCard) {
            parts.push(
                `<span class="reward-inline-item"><img class="reward-inline-icon" src="sprites/item/boss_ticket.png" alt="보스재생카드"> 보스재생카드 +${reward.bossReplayCard}</span>`
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
    if (type === 'hp') return Math.floor(cost * 1.42);
    if (type === 'crit') return Math.floor(cost * 1.8);
    if (type === 'critDmg') return Math.floor(cost * 1.7);
    if (type === 'partnerSpd') return Math.floor(cost * 1.7);
}

function buyUpgrade(type, amount) {
    for (let i = 0; i < amount; i++) {
        if (isUpgradeCapped(type)) break;
        if (gameData.screws < gameData.costs[type]) break;

        gameData.screws -= gameData.costs[type];
        gameData.lv[type]++;

        if (type === 'atk') gameData.atk += 5;

        if (type === 'spd') {
            gameData.atkSpd = Math.max(PLAYER_ATTACK_SPEED_MIN_MS, gameData.atkSpd - 200);
            startAutoAttack();
        }

        if (type === 'hp') {
           gameData.playerMaxHp = getEffectivePlayerMaxHp();
           gameData.playerHp = gameData.playerMaxHp;
        }

        if (type === 'crit') {
            gameData.critChance = getCritChanceForLevel(gameData.lv.crit);
        }

        if (type === 'critDmg') gameData.critMultiplier += 0.25;

        if (type === 'partnerSpd') {
            gameData.partnerAtkSpd = Math.max(PARTNER_ATTACK_SPEED_MIN_MS, gameData.partnerAtkSpd - 120);
            startBluesAttack();
            startForteAttack();
            startXAttack();
            startExeRockmanAttack();
            startZeroAttack();
            startMining();
        }
        gameData.costs[type] = getNextCost(type, gameData.costs[type]);
    }

    clampBattleBalanceValues();
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
    while (!isUpgradeCapped(type) && gameData.screws >= gameData.costs[type]) {
        const beforeLv = gameData.lv[type];
        const beforeScrews = gameData.screws;
        buyUpgrade(type, 1);
        if (gameData.lv[type] === beforeLv && gameData.screws === beforeScrews) break;
    }
}

function exchangeScrewsToCrystals(amount) {
    amount = Math.max(1, Math.floor(amount || 1));
    const cost = amount * 100;
    if (gameData.screws < cost) return;

    gameData.screws -= cost;
    gameData.crystals += amount;

    updateUI();
    saveData();
}

function exchangeScrewsToCrystalsMax() {
    const amount = Math.floor((gameData.screws || 0) / 100);
    if (amount <= 0) return;
    exchangeScrewsToCrystals(amount);
}

function craftBossReplayCards(amount) {
    amount = Math.max(1, Math.floor(amount || 1));
    const cost = amount * BOSS_REPLAY_CARD_ECAN_COST;
    if ((gameData.crystals || 0) < cost) return;

    gameData.crystals -= cost;
    gameData.materials.bossReplayCard = Math.max(0, Math.floor(gameData.materials.bossReplayCard || 0)) + amount;

    updateUI();
    saveData();
}

function craftBossReplayCardsMax() {
    const amount = Math.floor((gameData.crystals || 0) / BOSS_REPLAY_CARD_ECAN_COST);
    if (amount <= 0) return;
    craftBossReplayCards(amount);
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



function stopPartnerInlineJoinTimers() {
    const timers = [
        'rushJoinTimer',
        'beatJoinTimer',
        'bluesAttackTimer',
        'forteJoinTimer',
        'xJoinTimer',
        'zeroJoinTimer',
        'rockexeJoinTimer'
    ];

    // bluesAttackTimer는 실제 전투 공격 타이머이므로 여기서 끊으면 안 됩니다.
    // 아래에서 소환 연출용 타이머만 직접 정리합니다.
    if (rushJoinTimer) { clearInterval(rushJoinTimer); rushJoinTimer = null; }
    if (beatJoinTimer) { clearInterval(beatJoinTimer); beatJoinTimer = null; }
    if (forteJoinTimer) { clearInterval(forteJoinTimer); forteJoinTimer = null; }
    if (xJoinTimer) { clearInterval(xJoinTimer); xJoinTimer = null; }
    if (zeroJoinTimer) { clearInterval(zeroJoinTimer); zeroJoinTimer = null; }
    if (rockexeJoinTimer) { clearInterval(rockexeJoinTimer); rockexeJoinTimer = null; }
}

function clearPartnerInlineJoinStage() {
    stopPartnerInlineJoinTimers();
    const stage = document.getElementById('partner-inline-join-stage');
    const text = document.getElementById('partner-inline-join-text');
    const rushImg = document.getElementById('partner-inline-join-rush-img');
    const joinImg = document.getElementById('partner-inline-join-img');
    const popupBox = document.querySelector('#partner-inventory-popup .partner-popup-box');

    if (stage) stage.classList.remove('active');
    if (text) text.innerText = 'JOIN!';
    [rushImg, joinImg].forEach(img => {
        if (!img) return;
        img.classList.remove('rush-drop', 'join-drop');
        img.style.display = 'none';
        img.style.width = '';
        img.style.height = '';
        img.style.transform = 'translateX(-50%)';
    });
    if (popupBox) popupBox.classList.remove('summoned');
}

function prepareInlineSummonStage(type) {
    const popup = document.getElementById('partner-inventory-popup');
    const stage = document.getElementById('partner-inline-join-stage');
    const text = document.getElementById('partner-inline-join-text');
    const rushImg = document.getElementById('partner-inline-join-rush-img');
    const joinImg = document.getElementById('partner-inline-join-img');
    const popupBox = document.querySelector('#partner-inventory-popup .partner-popup-box');

    if (!popup || !stage || !text || !rushImg || !joinImg) return null;

    stopPartnerInlineJoinTimers();

    popup.classList.add('active');
    stage.classList.add('active');
    if (popupBox) popupBox.classList.add('summoned');

    rushImg.style.display = 'none';
    joinImg.style.display = 'none';
    rushImg.classList.remove('rush-drop', 'join-drop');
    joinImg.classList.remove('rush-drop', 'join-drop');

    const nameMap = {
        rush: 'RUSH JOIN!',
        beat: 'BEAT JOIN!',
        blues: 'BLUES JOIN!',
        forte: 'FORTE JOIN!',
        x: 'X JOIN!',
        zero: 'ZERO JOIN!',
        exeRockman: 'ROCKMAN.EXE JOIN!'
    };
    text.innerText = nameMap[type] || 'JOIN!';

    if (type === 'rush') {
        rushImg.src = 'sprites/partner/rush/rush_02.png';
        rushImg.style.display = 'block';
        return { popup, rushImg, beatImg: joinImg };
    }

    const firstFrameMap = {
        beat: 'sprites/partner/beat/beat_01.png',
        blues: 'sprites/partner/blues/blues_join_01.png',
        forte: 'sprites/partner/forte/forte_join_01.png',
        x: 'sprites/partner/x/x_join_01.png',
        zero: 'sprites/partner/zero/zero_join_01.png',
        exeRockman: 'sprites/partner/rockexe/rockexe_join_01.png'
    };
    joinImg.src = firstFrameMap[type] || 'sprites/partner/beat/beat_01.png';
    joinImg.style.setProperty('width', type === 'beat' ? '28px' : '54px', 'important');
    joinImg.style.setProperty('height', type === 'beat' ? '28px' : '54px', 'important');
    joinImg.style.display = 'block';
    return { popup, rushImg, beatImg: joinImg };
}

function getSummonTextElement() {
    return document.getElementById('summon-text') || document.querySelector('.summon-text');
}

function prepareSummonPopup(type) {
    // 기존 화면 중앙 JOIN 팝업은 동료 인벤토리 팝업에 가려지므로 사용하지 않습니다.
    // 동료 팝업 안의 빈 공간에서 바로 소환 애니메이션을 재생합니다.
    return prepareInlineSummonStage(type);
}

function summonRush() {
    if (gameData.rushOwned) return;
    if (gameData.rushFragments < RUSH_REQUIRED_FRAGMENTS) return;
    if (!guardPartnerBlueprintSlot()) return;

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
    if (!guardPartnerBlueprintSlot()) return;

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

    updateUI();
    saveData();
}

function summonBlues() {
    if (gameData.bluesOwned) return;
    if (gameData.bluesFragments < BLUES_REQUIRED_FRAGMENTS) return;
    if (!guardPartnerBlueprintSlot()) return;

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

    updateUI();
    saveData();
}

function summonForte() {
    if (gameData.forteOwned) return;
    if (gameData.forteFragments < FORTE_REQUIRED_FRAGMENTS) return;
    if (!guardPartnerBlueprintSlot()) return;

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

    updateUI();
    saveData();
}

function summonX() {
    if (gameData.xOwned) return;
    if (gameData.xFragments < X_REQUIRED_FRAGMENTS) return;
    if (!guardPartnerBlueprintSlot()) return;

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

    updateUI();
    saveData();
}

function summonZero() {
    if (gameData.zeroOwned) return;
    if (gameData.zeroFragments < ZERO_REQUIRED_FRAGMENTS) return;
    if (!guardPartnerBlueprintSlot()) return;

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

    updateUI();
    saveData();
}

function summonExeRockman() {
    if (gameData.exeRockmanOwned) return;
    if (gameData.exeRockmanFragments < EXE_ROCKMAN_REQUIRED_FRAGMENTS) return;
    if (!guardPartnerBlueprintSlot()) return;

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
    const isLocked = bossBattleEntryPending || (isBossBattle && !enemyDead && !playerDead);
    const lockIds = ['mine-tab-btn', 'armor-tab-btn', 'boss-tab-btn', 'partner-tab-btn', 'card-tab-btn'];

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

function setBossEntryWarningPause(paused) {
    superRockUnlockPaused = !!paused;

    const bg = document.getElementById('scroll-bg');
    if (bg) {
        if (paused) bg.classList.add('paused');
        else if (!isStillBossBattle()) bg.classList.remove('paused');
    }

    const screen = document.querySelector('.game-screen');
    if (screen) screen.classList.toggle('boss-warning-paused', !!paused);
}



const DEVELOPMENT_LAB_DATA = [
    {
        key: 'classic',
        name: '클래식 보스전',
        sectionName: '',
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

const SUPER_ROCK_SPRITES = {
    walk: [
        'sprites/armor/super-r/super_r_walk_01.png',
        'sprites/armor/super-r/super_r_walk_02.png',
        'sprites/armor/super-r/super_r_walk_03.png'
    ],
    stand: 'sprites/armor/super-r/super_r_st.png',
    rocketPunch: 'sprites/armor/super-r/super_r_c_bullet_01.png'
};

function isSuperRockUnlocked() {
    return !!gameData.development?.superRockUnlocked;
}

function getRockStandSprite() {
    return isSuperRockUnlocked() ? SUPER_ROCK_SPRITES.stand : 'sprites/rock/rock_st.png';
}

function getRockWalkSprite(frame) {
    if (isSuperRockUnlocked()) {
        const index = Math.max(0, Math.min(2, (Math.floor(frame || 1) - 1)));
        return SUPER_ROCK_SPRITES.walk[index] || SUPER_ROCK_SPRITES.walk[0];
    }
    return `sprites/rock/rock_0${frame}.png`;
}

function getRockChargeBulletSprite() {
    return isSuperRockUnlocked() ? SUPER_ROCK_SPRITES.rocketPunch : 'sprites/rock/rock_c_bullet_01.png';
}

function getRockAttackBaseDamage() {
    const baseAtk = getCardAdjustedAtk(gameData.atk);
    return isSuperRockUnlocked() ? Math.floor(baseAtk * 1.10) : baseAtk;
}


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
        superRockDevSpriteAnimTimer = setTimeout(step, 230);
    };

    superRockDevSpriteAnimTimer = setTimeout(step, 230);
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


function showSuperRockDevelopmentNotice(message) {
    const card = document.getElementById('development-super-rock-card');
    if (!card) {
        showStageText(message);
        return;
    }

    let notice = card.querySelector('.super-rock-dev-notice');
    if (!notice) {
        notice = document.createElement('div');
        notice.className = 'super-rock-dev-notice';
        card.appendChild(notice);
    }

    notice.textContent = message;
    notice.classList.remove('active');
    void notice.offsetWidth;
    notice.classList.add('active');

    setTimeout(() => {
        notice.classList.remove('active');
    }, 1400);
}

function upgradeSuperRockDevelopment(event = null) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    if (!gameData.development) gameData.development = { ...defaultData.development };

    const progress = Math.max(0, Math.min(DEVELOPMENT_SUPER_ROCK_REQUIRED_CHIPS, Math.floor(gameData.development.superRockProgress || 0)));

    if (progress >= DEVELOPMENT_SUPER_ROCK_REQUIRED_CHIPS) {
        if (!gameData.rushOwned) {
            showSuperRockDevelopmentNotice('러쉬가 필요합니다');
            updateUI();
            return;
        }
        if (!gameData.development.superRockUnlocked) {
            completeSuperRockDevelopmentUnlock();
        }
        return;
    }

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

function freezeBattleForSuperRockUnlock() {
    superRockUnlockPaused = true;
    const bg = document.getElementById('scroll-bg');
    const screen = document.querySelector('.game-screen');
    if (bg) bg.classList.add('paused');
    if (screen) screen.classList.add('super-rock-unlock-freeze');
    stopSniperJoeActions();
    stopCutmanBossActions();
}

function unfreezeBattleAfterSuperRockUnlock() {
    superRockUnlockPaused = false;
    const screen = document.querySelector('.game-screen');
    if (screen) screen.classList.remove('super-rock-unlock-freeze');
    const bg = document.getElementById('scroll-bg');
    if (bg && !isStillBossBattle()) bg.classList.remove('paused');
    if (isCutmanBossBattle()) startCutmanBossActions();
    if (isSniperJoeBattle()) startSniperJoeActions();
}

let superRockUnlockCloseReady = false;

function closeSuperRockUnlockOverlay(applyUnlock = true) {
    const overlay = document.getElementById('super-rock-unlock-overlay');
    const bullet = document.getElementById('super-rock-unlock-bullet');
    if (!overlay || !overlay.classList.contains('active')) return;

    if (applyUnlock && !gameData.development.superRockUnlocked) {
        gameData.development.superRockUnlocked = true;
    }

    overlay.classList.remove('active');
    superRockUnlockCloseReady = false;
    if (bullet) bullet.classList.remove('active', 'loop');

    unfreezeBattleAfterSuperRockUnlock();
    updateUI();
    saveData();

    const rockman = document.getElementById('rockman-img');
    if (rockman) rockman.src = getRockStandSprite();
}

function playSuperRockUnlockAnimation() {
    const overlay = document.getElementById('super-rock-unlock-overlay');
    const img = document.getElementById('super-rock-unlock-img');
    const bullet = document.getElementById('super-rock-unlock-bullet');
    const text = document.getElementById('super-rock-unlock-text');
    if (!overlay || !img) return;

    overlay.classList.add('active');
    overlay.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (superRockUnlockCloseReady) closeSuperRockUnlockOverlay(true);
    };

    superRockUnlockCloseReady = false;
    if (text) text.classList.remove('active');
    if (bullet) bullet.classList.remove('active', 'loop');

    let frame = 1;
    img.src = getSuperRockDevelopmentFrame(frame);

    const step = () => {
        frame += 1;
        if (frame > 7) {
            img.src = SUPER_ROCK_SPRITES.stand;

            setTimeout(() => {
                if (bullet) {
                    bullet.classList.remove('active', 'loop');
                    void bullet.offsetWidth;
                    bullet.classList.add('active', 'loop');
                }

                if (!gameData.development.superRockUnlocked) {
                    gameData.development.superRockUnlocked = true;
                    saveData();
                }

                if (text) {
                    text.classList.remove('active');
                    void text.offsetWidth;
                    text.classList.add('active');
                }

                superRockUnlockCloseReady = true;
                updateUI();
                const rockman = document.getElementById('rockman-img');
                if (rockman) rockman.src = getRockStandSprite();
            }, 260);
            return;
        }

        img.src = getSuperRockDevelopmentFrame(frame);
        setTimeout(step, 210);
    };

    setTimeout(step, 210);
}

function completeSuperRockDevelopmentUnlock() {
    showTab('battle');
    setTimeout(() => {
        freezeBattleForSuperRockUnlock();
        playSuperRockUnlockAnimation();
    }, 80);
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
    if (sectionName) sectionName.innerText = lab.sectionName || lab.hint;

    const sectionHint = document.getElementById('development-section-hint');
    if (sectionHint) sectionHint.innerText = lab.hint;

    const devSuperRockChipOwned = document.getElementById('dev-superrock-chip-owned');
    if (devSuperRockChipOwned) devSuperRockChipOwned.innerText = Math.floor(gameData.materials?.superRockChip || 0).toLocaleString();
    const devBluesBusterChipOwned = document.getElementById('dev-bluesbuster-chip-owned');
    if (devBluesBusterChipOwned) devBluesBusterChipOwned.innerText = Math.floor(gameData.materials?.bluesBusterChip || 0).toLocaleString();
    const devSuperForteChipOwned = document.getElementById('dev-superforte-chip-owned');
    if (devSuperForteChipOwned) devSuperForteChipOwned.innerText = Math.floor(gameData.materials?.superForteChip || 0).toLocaleString();

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
        const unlocked = !!gameData.development.superRockUnlocked;
        const hasRush = !!gameData.rushOwned;
        const canUpgrade = !complete && chipCount > 0;
        const canComplete = complete && !unlocked && hasRush;
        btn.disabled = !(canUpgrade || canComplete || (complete && !unlocked && !hasRush));
        btn.classList.toggle('active', canUpgrade || canComplete);
        btn.classList.remove('rush-required');
        btn.innerText = complete ? (unlocked ? '완료됨' : '완료') : '개발';
        btn.removeAttribute('data-tooltip');
        btn.title = unlocked
            ? '슈퍼록맨 개발 완료'
            : (complete
                ? (hasRush ? '슈퍼록맨 개발을 완료합니다.' : '러쉬가 필요합니다')
                : (canUpgrade ? '슈퍼록맨 데이터칩 1개를 투입합니다.' : '슈퍼록맨 데이터칩이 부족합니다.'));
    }

    const superRockCard = document.getElementById('development-super-rock-card');
    if (superRockCard) {
        superRockCard.classList.toggle('complete', progress >= DEVELOPMENT_SUPER_ROCK_REQUIRED_CHIPS);
    }

}


function showTab(tabName) {
    if ((bossBattleEntryPending || (isBossBattle && !enemyDead && !playerDead)) && tabName !== 'battle') {
        updateBossBattleTabLockState();
        showBossBattleLockedMessage();
        return;
    }

    const currentTab = document.getElementById(tabName + '-tab');

    // 전투 탭이 아닌 다른 탭을 다시 누르면 전투 탭으로 복귀합니다.
    if (tabName !== 'battle' && currentTab && currentTab.classList.contains('active')) {
        tabName = 'battle';
    }

    ['battle', 'partner', 'card', 'armor', 'boss', 'mine', 'status', 'transcend', 'sync'].forEach(name => {
        const tab = document.getElementById(name + '-tab');
        const btn = document.getElementById(name + '-tab-btn');

        if (tab) tab.classList.remove('active');
        if (btn) btn.classList.remove('active');
    });

    const targetTab = document.getElementById(tabName + '-tab');
    const targetBtn = document.getElementById(tabName + '-tab-btn');

    if (targetTab) targetTab.classList.add('active');
    if (targetBtn) targetBtn.classList.add('active');
    refreshMobileSyncTabState(tabName);

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

function updateBossLevelUI() {
    const cleared = getBossClearedLevel('classic_cutman');
    const nextLevel = cleared + 1;
    const label = document.getElementById('cutman-boss-level-label');
    if (label) label.innerText = `Lv. ${nextLevel}`;

    const clearedText = document.getElementById('cutman-cleared-level-text');
    if (clearedText) clearedText.innerText = `Lv. ${cleared}`;

    const nextText = document.getElementById('cutman-next-level-text');
    if (nextText) nextText.innerText = `Lv. ${nextLevel}`;

    const challengeBtn = document.getElementById('cutman-challenge-btn');
    setButtonActive(challengeBtn, (gameData.materials.bossReplayCard || 0) >= 1);
    if (challengeBtn) challengeBtn.disabled = (gameData.materials.bossReplayCard || 0) < 1;

    const sweep1 = document.getElementById('cutman-sweep-1-btn');
    const sweep10 = document.getElementById('cutman-sweep-10-btn');
    const canSweep = cleared > 0 && (gameData.materials.bossReplayCard || 0) >= 1;
    setButtonActive(sweep1, canSweep);
    if (sweep1) sweep1.disabled = !canSweep;
    setButtonActive(sweep10, cleared > 0 && (gameData.materials.bossReplayCard || 0) >= 10);
    if (sweep10) sweep10.disabled = !(cleared > 0 && (gameData.materials.bossReplayCard || 0) >= 10);
}

function closeBossActionPanels() {
    document.querySelectorAll('.boss-action-panel.open').forEach(panel => panel.classList.remove('open'));
}

function openBossActionPanel(bossKey = 'classic_cutman') {
    const panel = document.getElementById('cutman-boss-action-panel');
    if (!panel) {
        startBossLevelChallenge(bossKey);
        return;
    }

    const isOpen = panel.classList.contains('open');
    closeBossActionPanels();
    if (!isOpen) panel.classList.add('open');
    updateBossLevelUI();
}

function startBossLevelChallenge(bossKey = 'classic_cutman') {
    const bossData = getBossData(bossKey, getBossNextChallengeLevel(bossKey));
    if (!bossData) return;

    const entryCost = Math.max(1, Math.floor(bossData.entryCost || 1));
    if ((gameData.materials.bossReplayCard || 0) < entryCost) {
        showBossCardMessage('보스재생카드 부족');
        return;
    }

    closeBossActionPanels();
    bossBattleEntryPending = true;
    setBossEntryWarningPause(true);
    updateBossBattleTabLockState();

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
        enterBossBattle(bossKey, getBossNextChallengeLevel(bossKey), 'challenge');
    }, 380);
}

function sweepBossLevel(bossKey = 'classic_cutman', requestedCount = 1) {
    const clearedLevel = getBossClearedLevel(bossKey);
    if (clearedLevel <= 0) {
        showBossCardMessage('소탕할 레벨이 없습니다');
        return;
    }

    const entryCost = Math.max(1, Math.floor(getBossData(bossKey, clearedLevel).entryCost || 1));
    const available = Math.floor((gameData.materials.bossReplayCard || 0) / entryCost);
    const count = Math.max(0, Math.min(Math.floor(requestedCount || 1), available));
    if (count <= 0) {
        showBossCardMessage('보스재생카드 부족');
        return;
    }

    gameData.materials.bossReplayCard -= count * entryCost;
    const totalReward = { screws: 0, cardChip: 0, superRockChip: 0 };
    for (let i = 0; i < count; i++) {
        mergeBossRewardTotals(totalReward, rollBossBattleReward(bossKey, clearedLevel));
    }

    showBossCardMessage(`Lv.${clearedLevel} 소탕 x${count}`);
    showBossSweepRewardPopup(bossKey, clearedLevel, count, totalReward);
    updateUI();
    saveData();
}

function getBossDisplayName(bossKey = 'classic_cutman') {
    const data = getBossData(bossKey) || {};
    return data.name || '보스';
}

function formatBossSweepRewardRows(reward = {}) {
    const rows = [];
    const screws = Math.floor(reward.screws || 0);
    const cardChip = Math.floor(reward.cardChip || 0);
    const superRockChip = Math.floor(reward.superRockChip || 0);

    if (screws > 0) {
        rows.push({ icon: 'sprites/item/screw.png', name: '나사', amount: screws });
    }
    if (cardChip > 0) {
        rows.push({ icon: 'sprites/boss/reward/cardchip.png', name: '카드칩', amount: cardChip });
    }
    if (superRockChip > 0) {
        rows.push({ icon: 'sprites/boss/reward/superrockchip.png', name: '슈퍼록맨 데이터칩', amount: superRockChip });
    }

    return rows;
}

function showBossSweepRewardPopup(bossKey, level, count, reward) {
    let popup = document.getElementById('boss-sweep-reward-popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'boss-sweep-reward-popup';
        popup.className = 'boss-sweep-reward-popup';
        popup.innerHTML = `
            <div class="boss-sweep-reward-box" onclick="event.stopPropagation();">
                <button type="button" class="boss-sweep-reward-close" onclick="closeBossSweepRewardPopup(); return false;">×</button>
                <div id="boss-sweep-reward-title" class="boss-sweep-reward-title">소탕 결과</div>
                <div id="boss-sweep-reward-subtitle" class="boss-sweep-reward-subtitle"></div>
                <div id="boss-sweep-reward-list" class="boss-sweep-reward-list"></div>
                <button type="button" class="boss-sweep-reward-ok" onclick="closeBossSweepRewardPopup(); return false;">확인</button>
            </div>
        `;
        popup.addEventListener('click', closeBossSweepRewardPopup);
        document.body.appendChild(popup);
    }

    const title = document.getElementById('boss-sweep-reward-title');
    const subtitle = document.getElementById('boss-sweep-reward-subtitle');
    const list = document.getElementById('boss-sweep-reward-list');
    const bossName = getBossDisplayName(bossKey);
    const rows = formatBossSweepRewardRows(reward);

    if (title) title.innerText = '소탕 결과';
    if (subtitle) subtitle.innerText = `${bossName} Lv.${level} × ${count}회`;
    if (list) {
        list.innerHTML = rows.length
            ? rows.map(item => `
                <div class="boss-sweep-reward-row">
                    <img src="${item.icon}" alt="${item.name}" class="boss-sweep-reward-icon">
                    <span class="boss-sweep-reward-name">${item.name}</span>
                    <span class="boss-sweep-reward-count">× ${item.amount.toLocaleString()}</span>
                </div>
            `).join('')
            : '<div class="boss-sweep-reward-empty">획득한 보상이 없습니다.</div>';
    }

    popup.classList.add('active');
}

function closeBossSweepRewardPopup() {
    const popup = document.getElementById('boss-sweep-reward-popup');
    if (popup) popup.classList.remove('active');
}

function selectBossCard(bossKey = 'classic_cutman') {
    openBossActionPanel(bossKey);
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

function clearBattleProjectilesAndTransientEffects() {
  document.querySelectorAll(
    '.enemy-bullet, .sniperjoe-bullet, .cutman-boss-cutter, .cutman-cutter-erase-pop, ' +
    '.projectile-explosion, .projectile-explosion-particle, .death-particle, ' +
    '.rockman-death-particle, .cutman-death-particle, .damage-text'
  ).forEach(el => el.remove());
}

function resetBattleStateForBossEntry() {
  stopSniperJoeActions();
  stopCutmanBossActions();
  clearBattleProjectilesAndTransientEffects();

  enemyDead = false;
  enemyAttacking = false;
  enemyStunned = false;
  if (enemyStunTimer) {
    clearTimeout(enemyStunTimer);
    enemyStunTimer = null;
  }
  sniperJoeJumping = false;
  sniperJoeAttacking = false;
  cutmanBossAttacking = false;
  playerDead = false;

  gameData.playerMaxHp = Math.floor(100 + (gameData.lv.hp - 1) * 20);
  gameData.playerHp = gameData.playerMaxHp;

  const rockman = document.getElementById('rockman-img');
  if (rockman) {
    rockman.classList.remove('rockman-death-hide', 'ally-hit-flash');
    rockman.src = getRockStandSprite();
  }

  ['rush-img', 'beat-img', 'blues-img', 'forte-img', 'x-img', 'rockexe-img', 'zero-img'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('ally-hit-flash');
  });

  const enemyImg = document.getElementById('enemy-img');
  if (enemyImg) {
    enemyImg.classList.remove('sniperjoe-jump', 'hit-shake', 'enemy-death', 'boss-enter', 'cutman-dead-blink', 'cutman-death-fade', 'enemy-stunned');
    clearEnemyStunVisualEffect();
    enemyImg.style.opacity = '1';
    enemyImg.style.transform = '';
  }

  const enemyArea = document.getElementById('enemy-area');
  if (enemyArea) {
    enemyArea.classList.remove('sniperjoe-area', 'sniperjoe-enter-area', 'boss-enter-area');
    enemyArea.style.removeProperty('--sniperjoe-ground-bottom');
  }
}

function enterBossBattle(bossKey = 'classic_cutman', bossLevel = 1, bossMode = 'challenge') {
  const resolvedBossLevel = Math.max(1, Math.floor(bossLevel || 1));
  const bossData = getBossData(bossKey, resolvedBossLevel);
  if (!bossData) return;

  const entryCost = Math.max(1, Math.floor(bossData.entryCost || 1));
  if ((gameData.materials.bossReplayCard || 0) < entryCost) {
    bossBattleEntryPending = false;
    setBossEntryWarningPause(false);
    updateBossBattleTabLockState();
    showBossCardMessage('보스재생카드 부족');
    updateUI();
    return;
  }

  gameData.materials.bossReplayCard -= entryCost;
  resetBattleStateForBossEntry();
  saveData();
  updateUI();

  showTab('battle');

  showBossWarning(() => {

    resetBattleStateForBossEntry();
    bossBattleEntryPending = false;
    setBossEntryWarningPause(false);
    isBossBattle = true;
    currentBossType = bossKey;
    currentBossLevel = resolvedBossLevel;
    currentBossMode = bossMode || 'challenge';
    currentEnemyType = null;

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
      enemyImg.classList.remove('boss-enter', 'enemy-stunned');
        clearEnemyStunVisualEffect();
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
    enemySpeed = bossKey === 'classic_cutman' ? 0 : Math.min(ENEMY_MOVE_SPEED_MAX, (bossData.speed || 0.18));
    enemyX = bossData.startX ?? BOSS_START_X;

    enemyDead = false;
    enemyAttacking = false;
    enemyStunned = false;
    if (enemyStunTimer) {
      clearTimeout(enemyStunTimer);
      enemyStunTimer = null;
    }
    playerDead = false;

    updateEnemyPosition();

    const rockmanImg = document.getElementById('rockman-img');
    if (rockmanImg) {
      rockmanImg.src = getRockStandSprite();
      applyRockmanRenderFrame();
    }

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
        if (superRockUnlockPaused) return;
        if (!isBossBattle || currentBossType !== 'classic_cutman' || enemyDead || playerDead || enemyStunned || cutmanBossAttacking) return;
        fireCutmanBossCutter();
    }, interval);

    setTimeout(() => {
        if (isBossBattle && currentBossType === 'classic_cutman' && !enemyDead && !playerDead && !enemyStunned) {
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
            projectile.dataset.cutmanErased = '1';
            projectile.getAnimations?.().forEach(animation => animation.cancel());
            projectile.remove();
        }
    });
}

function fireCutmanBossCutter() {
    if (superRockUnlockPaused) return;
        if (!isBossBattle || currentBossType !== 'classic_cutman' || enemyDead || playerDead || enemyStunned || cutmanBossAttacking) return;

    const screen = document.querySelector('.game-screen');
    const enemyImg = document.getElementById('enemy-img');
    const rockman = document.getElementById('rockman-img') || document.getElementById('rockman-area');
    if (!screen || !enemyImg || !rockman) return;

    const bossData = getBossData(currentBossType);
    const screenRect = screen.getBoundingClientRect();
    const enemyRect = enemyImg.getBoundingClientRect();
    const rockBodyCenter = getRockmanBodyCenterPoint();

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

    const targetX = rockBodyCenter.x;
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
    attackTimer = setInterval(attack, getPlayerAttackInterval());
}

const STONE_ICON_HTML = '<img src="sprites/mine/stone.png" class="result-resource-icon stone-resource-icon" alt="돌">';
const SCREW_ICON_HTML = '<img src="sprites/item/screw.png" class="result-resource-icon item-resource-icon" alt="나사">';
const CRYSTAL_ICON_HTML = '<img src="sprites/item/e_can.png" class="result-resource-icon item-resource-icon" alt="E캔">';

const PICKAXE_NAMES = ['록괭이', '록괭이X', '록괭이.EXE', '록괭대시', '퍼스트괭이', '기가괭이', '맥스괭이', '포스괭이', '팔콘괭이', '얼티밋괭이'];

// 다음 단계 0강이 이전 단계 10강보다 반드시 강하도록 기본 데미지를 고정 테이블로 관리합니다.
// 각 단계 기본 데미지 차이는 36, 강화 10강 총 증가량은 30입니다.
const PICKAXE_BASE_DAMAGES = [8, 44, 80, 116, 152, 188, 224, 260, 296, 332];
const PICKAXE_ENHANCE_DAMAGE = 3;
const PICKAXE_MAX_TIER = PICKAXE_NAMES.length - 1;
const REGISTERED_PICKAXE_SLOT_COUNT = 3;
const REGISTERED_PICKAXE_DAMAGE_RATE = 0.10;
const MINE_REWARD_NERF_RATE = 0.75;
let pendingPickaxeRegisterSlot = null;
let rebootConfirmPauseActive = false;
let rebootConfirmPreviousBattlePause = false;

function pauseForRebootConfirm() {
    if (rebootConfirmPauseActive) return;
    rebootConfirmPauseActive = true;
    rebootConfirmPreviousBattlePause = !!superRockUnlockPaused;
    superRockUnlockPaused = true;
}

function resumeAfterRebootConfirm() {
    if (!rebootConfirmPauseActive) return;
    rebootConfirmPauseActive = false;
    superRockUnlockPaused = rebootConfirmPreviousBattlePause;
}

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

function getBasePickaxeDamage(tier = gameData.minePickaxeTier, enhance = gameData.minePickaxeEnhance) {
    const tierIndex = Math.max(0, Math.min(PICKAXE_MAX_TIER, Math.floor(tier || 0)));
    const safeEnhance = Math.max(0, Math.min(10, Math.floor(enhance || 0)));
    const baseDamage = PICKAXE_BASE_DAMAGES[tierIndex] || PICKAXE_BASE_DAMAGES[0];
    return Math.floor(baseDamage + safeEnhance * PICKAXE_ENHANCE_DAMAGE);
}

function getRegisteredPickaxeSingleBonusDamage(item) {
    if (!item) return 0;
    return Math.floor(getBasePickaxeDamage(item.tier, item.enhance) * REGISTERED_PICKAXE_DAMAGE_RATE);
}

function getRegisteredPickaxeBonusDamage() {
    if (!Array.isArray(gameData.registeredPickaxes)) gameData.registeredPickaxes = [null, null, null];
    return gameData.registeredPickaxes.reduce((sum, item) => {
        return sum + getRegisteredPickaxeSingleBonusDamage(item);
    }, 0);
}

function getMiningDamageBaseOnly() {
    if (!gameData.minePickaxeOwned) return 0;
    return getBasePickaxeDamage(gameData.minePickaxeTier, gameData.minePickaxeEnhance);
}

function getMiningDamage() {
    if (!gameData.minePickaxeOwned) return 0;
    return Math.floor(getMiningDamageBaseOnly() + getRegisteredPickaxeBonusDamage());
}

function getRegisteredPickaxeName(item) {
    if (!item) return 'EMPTY';
    const tier = Math.max(0, Math.min(PICKAXE_MAX_TIER, Math.floor(item.tier || 0)));
    return PICKAXE_NAMES[tier] || '록괭이';
}

function getRegisteredPickaxeSprite(item) {
    if (!item) return 'sprites/mine/pickaxe/pickaxe_01.png';
    const tier = Math.max(0, Math.min(PICKAXE_MAX_TIER, Math.floor(item.tier || 0)));
    return `sprites/mine/pickaxe/pickaxe_${String(tier + 1).padStart(2, '0')}.png`;
}

function registerCurrentPickaxe(slotIndex) {
    slotIndex = Math.max(0, Math.min(REGISTERED_PICKAXE_SLOT_COUNT - 1, Math.floor(slotIndex || 0)));
    if (!gameData.minePickaxeOwned) {
        showMineResult('등록할 곡괭이가 없습니다. 곡괭이를 먼저 제작해주세요.');
        return;
    }
    openPickaxeRegisterConfirm(slotIndex);
}

function openPickaxeRegisterConfirm(slotIndex) {
    pendingPickaxeRegisterSlot = Math.max(0, Math.min(REGISTERED_PICKAXE_SLOT_COUNT - 1, Math.floor(slotIndex || 0)));
    const popup = document.getElementById('pickaxe-register-popup');
    const currentImg = document.getElementById('pickaxe-register-current-img');
    const currentName = document.getElementById('pickaxe-register-current-name');
    const currentDamage = document.getElementById('pickaxe-register-current-damage');
    const oldBox = document.getElementById('pickaxe-register-old-box');
    const oldImg = document.getElementById('pickaxe-register-old-img');
    const oldName = document.getElementById('pickaxe-register-old-name');
    const oldDamage = document.getElementById('pickaxe-register-old-damage');
    const slotText = document.getElementById('pickaxe-register-slot-text');
    const item = gameData.registeredPickaxes?.[pendingPickaxeRegisterSlot] || null;

    if (currentImg) currentImg.src = getPickaxeSprite();
    if (currentName) currentName.innerText = `${getPickaxeName()} +${gameData.minePickaxeEnhance}`;
    if (currentDamage) currentDamage.innerText = `기본 데미지 ${getMiningDamageBaseOnly().toLocaleString()} / 등록 보너스 +${Math.floor(getMiningDamageBaseOnly() * REGISTERED_PICKAXE_DAMAGE_RATE).toLocaleString()}`;
    if (slotText) {
        slotText.innerText = item
            ? `등록된 ${getRegisteredPickaxeName(item)} 위에 현재 ${getPickaxeName()}를 등록하시겠습니까?`
            : `빈 슬롯에 현재 ${getPickaxeName()}를 등록하시겠습니까?`;
    }

    if (oldBox) oldBox.style.display = '';
    if (item) {
        if (oldImg) {
            oldImg.src = getRegisteredPickaxeSprite(item);
            oldImg.style.visibility = '';
        }
        if (oldName) oldName.innerText = `${getRegisteredPickaxeName(item)} +${item.enhance}`;
        if (oldDamage) oldDamage.innerText = `현재 슬롯의 곡괭이는 덮어쓰기됩니다. / 보너스 +${Math.floor(getBasePickaxeDamage(item.tier, item.enhance) * REGISTERED_PICKAXE_DAMAGE_RATE).toLocaleString()}`;
    } else {
        if (oldImg) oldImg.style.visibility = 'hidden';
        if (oldName) oldName.innerText = 'EMPTY';
        if (oldDamage) oldDamage.innerText = '빈 슬롯에 새로 등록됩니다.';
    }

    if (popup) popup.classList.add('active');
}

function closePickaxeRegisterConfirm() {
    pendingPickaxeRegisterSlot = null;
    const popup = document.getElementById('pickaxe-register-popup');
    if (popup) popup.classList.remove('active');
}

function confirmPickaxeRegister() {
    if (pendingPickaxeRegisterSlot === null) return;
    if (!gameData.minePickaxeOwned) {
        closePickaxeRegisterConfirm();
        showMineResult('등록할 곡괭이가 없습니다.');
        return;
    }

    const slotIndex = pendingPickaxeRegisterSlot;
    const registeredName = getPickaxeName();
    const registeredEnhance = Math.max(0, Math.floor(gameData.minePickaxeEnhance || 0));

    gameData.registeredPickaxes[slotIndex] = {
        tier: Math.max(0, Math.min(PICKAXE_MAX_TIER, Math.floor(gameData.minePickaxeTier || 0))),
        enhance: registeredEnhance
    };

    gameData.minePickaxeOwned = false;
    // 등록한 곡괭이는 슬롯 보너스로만 남기고, 다음 제작은 항상 1단계 록괭이부터 시작합니다.
    gameData.minePickaxeTier = 0;
    gameData.minePickaxeFloorTier = 0;
    gameData.minePickaxeEnhance = 0;
    gameData.mineRockMaxHp = getMineRockMaxHp();
    gameData.mineRockHp = gameData.mineRockMaxHp;

    closePickaxeRegisterConfirm();
    showMineBigResult('등록 완료', 'success');
    showMineResult(`${registeredName} +${registeredEnhance} 등록 완료 / 새 곡괭이를 제작할 수 있습니다.`);
    updateUI();
    saveData();
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
    // 제작은 언제나 록괭이부터 시작합니다. 등록 곡괭이 단계가 현재 곡괭이에 복사되지 않게 합니다.
    gameData.minePickaxeTier = 0;
    gameData.minePickaxeFloorTier = 0;
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
    if (rebootConfirmPauseActive) return;
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
    const screwReward = Math.max(1, Math.floor((8 + gameData.minePickaxeTier * 5 + gameData.minePickaxeEnhance * 1.5) * MINE_REWARD_NERF_RATE * (1 + getSoulBonus('screw'))));
    const stoneReward = Math.max(1, Math.floor((3 + gameData.minePickaxeTier * 3 + Math.max(1, Math.floor(gameData.minePickaxeEnhance / 2))) * MINE_REWARD_NERF_RATE));

    gameData.screws += screwReward;
    gameData.stones += stoneReward;
    gameData.mineRockMaxHp = getMineRockMaxHp();
    gameData.mineRockHp = gameData.mineRockMaxHp;

    showMineResult(`+${screwReward}${SCREW_ICON_HTML} / +${stoneReward}${STONE_ICON_HTML}`);
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


function getTranscendPointReward() {
    if (gameData.stage < TRANSCEND_REQUIRED_STAGE) return 0;
    return Math.max(1, Math.floor(gameData.stage / TRANSCEND_POINT_PER_STAGE));
}

function getTranscendUpgradeCost(type) {
    const lv = Math.max(0, Math.floor(gameData.transcend?.[`${type}Lv`] || 0));
    return 1 + Math.floor(lv / 3);
}

function upgradeTranscendStat(type) {
    const key = `${type}Lv`;
    if (!gameData.transcend || !Object.prototype.hasOwnProperty.call(gameData.transcend, key)) return;
    const lv = Math.max(0, Math.floor(gameData.transcend[key] || 0));
    if (lv >= TRANSCEND_MAX_LEVEL) return;
    const cost = getTranscendUpgradeCost(type);
    if ((gameData.transcend.points || 0) < cost) return;

    gameData.transcend.points -= cost;
    gameData.transcend[key] = lv + 1;
    gameData.playerMaxHp = getEffectivePlayerMaxHp();
    gameData.playerHp = Math.min(gameData.playerMaxHp, Math.max(1, gameData.playerHp || gameData.playerMaxHp));
    updateUI();
    saveData();
}

function openTranscendConfirm() {
    const reward = getTranscendPointReward();
    if (reward <= 0) return;

    const popup = document.getElementById('transcend-confirm-popup');
    const rewardEl = document.getElementById('transcend-confirm-reward');
    if (rewardEl) rewardEl.innerText = `획득 예정 리부트 코어 +${reward} / 라이트코어 +${getSoulStoneRebootReward()}`;
    pauseForRebootConfirm();
    if (popup) popup.classList.add('active');
}

function closeTranscendConfirm() {
    const popup = document.getElementById('transcend-confirm-popup');
    if (popup) popup.classList.remove('active');
    resumeAfterRebootConfirm();
}

function confirmTranscend() {
    const popup = document.getElementById('transcend-confirm-popup');
    if (popup) popup.classList.remove('active');
    rebootConfirmPauseActive = false;
    superRockUnlockPaused = false;
    performTranscend();
}

function performTranscend() {
    const reward = getTranscendPointReward();
    if (reward <= 0) return;

    const soulReward = getSoulStoneRebootReward();
    gameData.transcend.count += 1;
    gameData.transcend.points += reward;
    gameData.soulStones += soulReward;

    gameData.stage = 1;
    gameData.screws = 0;
    gameData.crystals = 0;
    gameData.stones = 0;
    gameData.atk = defaultData.atk;
    gameData.atkSpd = defaultData.atkSpd;
    gameData.critChance = defaultData.critChance;
    gameData.critMultiplier = defaultData.critMultiplier;
    gameData.partnerAtkSpd = defaultData.partnerAtkSpd;
    gameData.minePickaxeOwned = false;
    gameData.minePickaxeTier = 0;
    gameData.minePickaxeFloorTier = 0;
    gameData.minePickaxeEnhance = 0;
    gameData.mineRockMaxHp = 80;
    gameData.mineRockHp = 80;
    gameData.lv = { ...defaultData.lv };
    gameData.costs = { ...defaultData.costs };
    gameData.partnerSpeedLv = { ...defaultData.partnerSpeedLv };
    gameData.partnerAtkSpeedLevel = 0;
    gameData.sniperJoeRewardClaimed = {};
    resetPartnerSyncAfterReboot();
    gameData.playerMaxHp = getEffectivePlayerMaxHp();
    gameData.playerHp = gameData.playerMaxHp;

    clampBattleBalanceValues();
    setupStage();
    startAutoAttack();
    startBluesAttack();
    startForteAttack();
    startXAttack();
    startExeRockmanAttack();
    startZeroAttack();
    showTranscendOverlay(reward, soulReward);
    updateUI();
    saveData();
}

function showTranscendOverlay(points, soulReward = 0) {
    const overlay = document.getElementById('transcend-overlay');
    const title = document.getElementById('transcend-overlay-title');
    const desc = document.getElementById('transcend-overlay-desc');
    const core = document.getElementById('transcend-overlay-core');
    if (!overlay) {
        showStageText(`리부트 +${points}`);
        return;
    }
    if (title) title.innerText = `리부트 ${gameData.transcend.count}회 달성`;
    if (desc) desc.innerHTML = `리부트코어 <b>+${points}</b> 획득!<br>라이트코어 <b>+${soulReward}</b> 획득!`;
    if (core) {
        core.innerText = '';
        core.style.display = 'none';
    }
    overlay.classList.add('active');
}

function closeTranscendOverlay() {
    const overlay = document.getElementById('transcend-overlay');
    if (overlay) overlay.classList.remove('active');
}

function getStatusAttackBreakdown() {
    const bonuses = getEquippedCardBonuses();
    const base = Math.max(1, Math.floor(gameData.atk || 0));
    const withCard = Math.max(1, Math.floor((base + bonuses.atkFlat) * (1 + bonuses.atkPercent / 100)));
    const total = getCardAdjustedAtk(gameData.atk);
    return {
        base,
        card: Math.max(0, withCard - base),
        transcend: Math.max(0, total - withCard),
        total
    };
}

function getStatusHpBreakdown() {
    const base = Math.max(1, Math.floor(100 + (Math.max(1, Math.floor(gameData.lv?.hp || 1)) - 1) * 35));
    const total = getEffectivePlayerMaxHp();
    return {
        base,
        card: 0,
        transcend: Math.max(0, total - base),
        total
    };
}

function formatStatusBreakdown(parts) {
    const cardPart = parts.card > 0 ? ` <span class="status-card-bonus">(+${parts.card.toLocaleString()})</span>` : '';
    const transcendPart = parts.transcend > 0 ? ` <span class="status-transcend-bonus">(+${parts.transcend.toLocaleString()})</span>` : '';
    return `${parts.total.toLocaleString()} <small>= ${parts.base.toLocaleString()}${cardPart}${transcendPart}</small>`;
}

function updateStatusUI() {
    const bonuses = getEquippedCardBonuses();
    const rows = document.getElementById('status-stat-rows');
    if (rows) {
        const atkParts = getStatusAttackBreakdown();
        const hpParts = getStatusHpBreakdown();
        const partnerRows = ['blues','forte','x','zero','exeRockman'].map(type => {
            const data = PARTNER_ATTACK_DATA[type];
            if (!data) return '';
            const owned = gameData[data.ownedKey];
            return `<div class="status-row"><span>${data.name} 공격력</span><b>${owned ? getPartnerDamage(type).toLocaleString() : '미소환'}</b></div>`;
        }).join('');
        rows.innerHTML = `
            <div class="status-row"><span>현재 스테이지</span><b>${gameData.stage.toLocaleString()}</b></div>
            <div class="status-row"><span>리부트 횟수</span><b>${gameData.transcend.count.toLocaleString()}회</b></div>
            <div class="status-row status-formula-row"><span>공격력</span><b>${formatStatusBreakdown(atkParts)}</b></div>
            <div class="status-row"><span>공격속도</span><b>${(getPlayerAttackInterval() / 1000).toFixed(2)}초 <em>카드 포함</em></b></div>
            <div class="status-row status-formula-row"><span>체력</span><b>${formatStatusBreakdown(hpParts)}</b></div>
            <div class="status-row"><span>차지샷 확률</span><b>${getEffectiveCritChance().toFixed(1)}%</b></div>
            <div class="status-row"><span>차지샷 배율</span><b>${gameData.critMultiplier.toFixed(2)}배</b></div>
            <div class="status-row"><span>카드 공격력 보너스</span><b><span class="status-card-bonus">+${bonuses.atkFlat} / +${bonuses.atkPercent}%</span></b></div>
            <div class="status-row"><span>카드 공속 보너스</span><b><span class="status-card-bonus">+${bonuses.atkSpeed}%</span></b></div>
            <div class="status-row"><span>E캔 공격력 보너스</span><b><span class="status-ecan-bonus">+${Math.round(getEcanBonus('atk') * 10000) / 100}%</span></b></div>
            <div class="status-row"><span>E캔 체력 보너스</span><b><span class="status-ecan-bonus">+${Math.round(getEcanBonus('hp') * 10000) / 100}%</span></b></div>
            <div class="status-row"><span>E캔 동료공격 보너스</span><b><span class="status-ecan-bonus">+${Math.round(getEcanBonus('partner') * 10000) / 100}%</span></b></div>
            <div class="status-row"><span>E캔 보스데미지 보너스</span><b><span class="status-ecan-bonus">+${Math.round(getEcanBonus('boss') * 10000) / 100}%</span></b></div>
            <div class="status-row"><span>리부트 공격력 보너스</span><b><span class="status-transcend-bonus">+${Math.round(getTranscendBonus('atk') * 100)}%</span></b></div>
            <div class="status-row"><span>리부트 체력 보너스</span><b><span class="status-transcend-bonus">+${Math.round(getTranscendBonus('hp') * 100)}%</span></b></div>
            <div class="status-row"><span>리부트 나사 보너스</span><b><span class="status-transcend-bonus">+${Math.round(getTranscendBonus('screw') * 100)}%</span></b></div>
            <div class="status-row"><span>라이트코어 공격력 보너스</span><b><span class="status-soul-bonus">+${Math.round(getSoulBonus('atk') * 1000) / 10}%</span></b></div>
            <div class="status-row"><span>라이트코어 체력 보너스</span><b><span class="status-soul-bonus">+${Math.round(getSoulBonus('hp') * 1000) / 10}%</span></b></div>
            <div class="status-row"><span>라이트코어 공속 보너스</span><b><span class="status-soul-bonus">+${Math.round(getSoulBonus('atkSpeed') * 1000) / 10}%</span></b></div>
            <div class="status-row"><span>리부트 동료공격 보너스</span><b><span class="status-transcend-bonus">+${Math.round(getTranscendBonus('partner') * 100)}%</span></b></div>
            <div class="status-row"><span>리부트 시작 싱크로율</span><b><span class="status-transcend-bonus">${getRebootSyncBasePercent()} / 100</span></b></div>
            ${partnerRows}
        `;
    }

    const transcendInfo = document.getElementById('transcend-info');
    if (transcendInfo) {
        const reward = getTranscendPointReward();
        transcendInfo.innerHTML = `<div class="transcend-count-line"><b>${gameData.transcend.count.toLocaleString()}</b> 리부트</div>리부트 가능 스테이지: ${TRANSCEND_REQUIRED_STAGE}<br>획득 예정 리부트코어: <b>${reward}</b><br><span class="transcend-lightcore-line">획득 예정 라이트코어: <b>${getSoulStoneRebootReward()}</b></span><br>보유 리부트 코어: <b>${gameData.transcend.points}</b>`;
    }
    const transcendBtn = document.getElementById('transcend-btn');
    setButtonActive(transcendBtn, getTranscendPointReward() > 0);
    if (transcendBtn) transcendBtn.disabled = getTranscendPointReward() <= 0;

    ['atk','hp','screw','partner','cardChip','syncBase'].forEach(type => {
        const lvEl = document.getElementById(`transcend-${type}-lv`);
        const costEl = document.getElementById(`transcend-${type}-cost`);
        const btn = document.getElementById(`transcend-${type}-btn`);
        const lv = Math.max(0, Math.floor(gameData.transcend?.[`${type}Lv`] || 0));
        const cost = getTranscendUpgradeCost(type);
        const isSyncBase = type === 'syncBase';
        const syncBaseValue = getRebootSyncBasePercent();
        const maxReached = isSyncBase ? syncBaseValue >= REBOOT_SYNC_BASE_MAX : lv >= TRANSCEND_MAX_LEVEL;
        if (lvEl) lvEl.innerText = isSyncBase ? `${syncBaseValue} / ${REBOOT_SYNC_BASE_MAX}` : `${lv} / ${TRANSCEND_MAX_LEVEL}`;
        if (costEl) costEl.innerText = maxReached ? 'MAX' : cost;
        setButtonActive(btn, !maxReached && gameData.transcend.points >= cost);
        if (btn) btn.disabled = !(!maxReached && gameData.transcend.points >= cost);
    });

    const battleTrans = document.getElementById('battle-transcend-count');
    if (battleTrans) battleTrans.innerText = gameData.transcend.count.toLocaleString();
}

function getScrewUpgradeEffectText(type) {
    const lv = Math.max(1, Math.floor(gameData.lv?.[type] || 1));
    if (type === 'atk') return `+${((lv - 1) * 5).toLocaleString()}`;
    if (type === 'spd') return `-${(((lv - 1) * 0.2)).toFixed(2)}초`;
    if (type === 'hp') return `+${((lv - 1) * 35).toLocaleString()}`;
    if (type === 'crit') return `${getCritChanceForLevel(lv).toFixed(1)}%`;
    if (type === 'critDmg') return `x${(1.5 + (lv - 1) * 0.25).toFixed(2)}`;
    if (type === 'partnerSpd') return `-${(((lv - 1) * 0.12)).toFixed(2)}초`;
    return '';
}

function updateScrewUpgradeUI() {
    ['atk', 'spd', 'hp', 'crit', 'critDmg'].forEach(type => {
        const lvEl = document.getElementById(`screw-${type}-lv`);
        const effectEl = document.getElementById(`screw-${type}-effect`);
        const btn = document.getElementById(`screw-${type}-btn`);
        if (!lvEl || !effectEl || !btn) return;

        const lv = Math.max(1, Math.floor(gameData.lv?.[type] || 1));
        const capped = isUpgradeCapped(type);
        const maxLevelText = type === 'crit' ? CRIT_UPGRADE_MAX_LEVEL : SPEED_UPGRADE_MAX_LEVEL;
        lvEl.innerText = capped && (isSpeedUpgradeType(type) || type === 'crit')
            ? `LV.${maxLevelText} MAX`
            : ((isSpeedUpgradeType(type) || type === 'crit') ? `LV.${lv} / ${maxLevelText}` : `LV.${lv}`);
        effectEl.innerText = getScrewUpgradeEffectText(type);

        const cost = gameData.costs[type];
        if (btn) {
            btn.innerHTML = capped ? 'MAX' : `강화 <span><img src="sprites/item/screw.png" alt="나사"> ${Math.floor(cost || 0).toLocaleString()}</span>`;
            btn.disabled = capped || (gameData.screws || 0) < cost;
            setButtonActive(btn, !btn.disabled);
        }
    });
}

function buyScrewUpgrade(type) {
    buyUpgrade(type, 1);
}

function updateEcanUpgradeUI() {
    Object.keys(ECAN_UPGRADE_CONFIG).forEach(type => {
        const config = ECAN_UPGRADE_CONFIG[type];
        const lv = getEcanUpgradeLevel(type);
        const maxed = Number.isFinite(config.max) && lv >= config.max;
        const lvEl = document.getElementById(`ecan-${type}-lv`);
        const effectEl = document.getElementById(`ecan-${type}-effect`);
        const btn = document.getElementById(`ecan-${type}-btn`);
        const cost = getEcanUpgradeCost(type);
        if (lvEl) lvEl.innerText = Number.isFinite(config.max) ? `LV.${lv} / ${config.max}` : `LV.${lv}`;
        if (effectEl) effectEl.innerText = getEcanUpgradeEffectText(type);
        if (btn) {
            btn.innerHTML = maxed ? 'MAX' : `강화 <span><img src="sprites/item/e_can.png" alt="E캔"> ${cost.toLocaleString()}</span>`;
            btn.disabled = maxed || (gameData.crystals || 0) < cost;
            setButtonActive(btn, !btn.disabled);
        }
    });
}

function updateSoulUpgradeUI() {
    Object.keys(SOUL_UPGRADE_CONFIG).forEach(type => {
        const config = SOUL_UPGRADE_CONFIG[type];
        const lv = getSoulUpgradeLevel(type);
        const maxed = Number.isFinite(config.max) && lv >= config.max;
        const lvEl = document.getElementById(`soul-${type}-lv`);
        const effectEl = document.getElementById(`soul-${type}-effect`);
        const btn = document.getElementById(`soul-${type}-btn`);
        const cost = getSoulUpgradeCost(type);
        if (lvEl) lvEl.innerText = Number.isFinite(config.max) ? `LV.${lv} / ${config.max}` : `LV.${lv}`;
        if (effectEl) effectEl.innerText = getSoulUpgradeEffectText(type);
        if (btn) {
            btn.innerHTML = maxed ? 'MAX' : `강화 <span><img src="sprites/item/light_stone.png" alt="라이트코어"> ${cost.toLocaleString()}</span>`;
            btn.disabled = maxed || (gameData.soulStones || 0) < cost;
            setButtonActive(btn, !btn.disabled);
        }
    });
}

function updateUI() {
    document.getElementById('stage').innerText = gameData.stage;
    document.getElementById('player-hp-text').innerText = Math.floor(gameData.playerHp);
    document.getElementById('player-max-hp-text').innerText = Math.floor(gameData.playerMaxHp);

    document.getElementById('player-hp-fill').style.width =
        Math.max(0, (gameData.playerHp / gameData.playerMaxHp) * 100) + "%";

    document.getElementById('screws').innerText = Math.floor(gameData.screws).toLocaleString();
    document.getElementById('crystals').innerText = Math.floor(gameData.crystals).toLocaleString();
    const sideCardChipCount = document.getElementById('side-card-chip-count');
    if (sideCardChipCount) sideCardChipCount.innerText = Math.floor(gameData.materials.cardChip || 0).toLocaleString();
    const sideOptionChipCount = document.getElementById('side-option-change-chip-count');
    if (sideOptionChipCount) sideOptionChipCount.innerText = Math.floor(gameData.materials.optionChangeChip || 0).toLocaleString();

    updatePartnerInventoryUI();
    renderPartnerSpeedPopup();

    const stonesEl = document.getElementById('stones');
    if (stonesEl) stonesEl.innerText = Math.floor(gameData.stones || 0).toLocaleString();
    const soulStonesEl = document.getElementById('soul-stones');
    if (soulStonesEl) soulStonesEl.innerText = Math.floor(gameData.soulStones || 0).toLocaleString();

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

        const capped = isUpgradeCapped(type);
        const maxLevelText = type === 'crit' ? CRIT_UPGRADE_MAX_LEVEL : SPEED_UPGRADE_MAX_LEVEL;
        lvEl.innerText = capped && (isSpeedUpgradeType(type) || type === 'crit') ? `${maxLevelText} MAX` : gameData.lv[type];

        const maxedAndHidden = capped && (isSpeedUpgradeType(type) || type === 'crit');
        [btn1, btn10, btnMax].forEach(btn => {
            btn.style.display = maxedAndHidden ? 'none' : '';
            btn.disabled = maxedAndHidden;
        });

        if (maxedAndHidden) {
            setButtonActive(btn1, false);
            setButtonActive(btn10, false);
            setButtonActive(btnMax, false);
            return;
        }

        const cost1 = calcCost(type, 1);
        const cost10 = calcCost(type, 10);

        btn1.dataset.cost = capped ? '최대치 도달' : `필요 나사 ${cost1.toLocaleString()}`;
        btn10.dataset.cost = capped ? '최대치 도달' : `필요 나사 ${cost10.toLocaleString()}`;

        setButtonActive(btn1, !capped && gameData.screws >= cost1);
        setButtonActive(btn10, !capped && gameData.screws >= cost10);
        setButtonActive(btnMax, !capped && gameData.screws >= cost1);
    });

    updateScrewUpgradeUI();
    setButtonActive(document.getElementById('exchange-btn1'), gameData.screws >= 100);
    setButtonActive(document.getElementById('exchange-btn10'), gameData.screws >= 1000);
    setButtonActive(document.getElementById('exchange-btn100'), gameData.screws >= 10000);
    setButtonActive(document.getElementById('exchange-btnMax'), gameData.screws >= 100);
    updateEcanUpgradeUI();
    updateSoulUpgradeUI();

    const bossReplayCardCount = document.getElementById('boss-replay-card-count');
    if (bossReplayCardCount) bossReplayCardCount.innerText = Math.floor(gameData.materials.bossReplayCard || 0).toLocaleString();
    setButtonActive(document.getElementById('boss-ticket-craft-1-btn'), (gameData.crystals || 0) >= BOSS_REPLAY_CARD_ECAN_COST);
    setButtonActive(document.getElementById('boss-ticket-craft-10-btn'), (gameData.crystals || 0) >= BOSS_REPLAY_CARD_ECAN_COST * 10);
    setButtonActive(document.getElementById('boss-ticket-craft-max-btn'), (gameData.crystals || 0) >= BOSS_REPLAY_CARD_ECAN_COST);
    updateBossLevelUI();

    const rushFragmentsEl = document.getElementById('rush-fragments');
    if (rushFragmentsEl) rushFragmentsEl.innerText = getPartnerDataStatusLabel(gameData.rushFragments, gameData.rushOwned);

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
    if (beatFragmentsEl) beatFragmentsEl.innerText = getPartnerDataStatusLabel(gameData.beatFragments, gameData.beatOwned);

    setButtonActive(document.getElementById('beat-buy1'), !gameData.beatOwned && gameData.crystals >= 1 && gameData.beatFragments < 100);
    setButtonActive(document.getElementById('beat-buy10'), !gameData.beatOwned && gameData.crystals >= 10 && gameData.beatFragments <= 90);
    setButtonActive(document.getElementById('beat-buy100'), !gameData.beatOwned && gameData.crystals >= 100 && gameData.beatFragments === 0);
    setButtonActive(document.getElementById('beat-summon-btn'), !gameData.beatOwned && gameData.beatFragments >= 100);
const bluesFragmentsEl = document.getElementById('blues-fragments');
if (bluesFragmentsEl) bluesFragmentsEl.innerText = getPartnerDataStatusLabel(gameData.bluesFragments, gameData.bluesOwned);

setButtonActive(document.getElementById('blues-buy1'), !gameData.bluesOwned && gameData.crystals >= 1 && gameData.bluesFragments < 100);
setButtonActive(document.getElementById('blues-buy10'), !gameData.bluesOwned && gameData.crystals >= 10 && gameData.bluesFragments <= 90);
setButtonActive(document.getElementById('blues-buy100'), !gameData.bluesOwned && gameData.crystals >= 100 && gameData.bluesFragments === 0);
setButtonActive(document.getElementById('blues-summon-btn'), !gameData.bluesOwned && gameData.bluesFragments >= 100);

const forteFragmentsEl = document.getElementById('forte-fragments');
if (forteFragmentsEl) forteFragmentsEl.innerText = getPartnerDataStatusLabel(gameData.forteFragments, gameData.forteOwned);

setButtonActive(document.getElementById('forte-buy1'), !gameData.forteOwned && gameData.crystals >= 1 && gameData.forteFragments < 100);
setButtonActive(document.getElementById('forte-buy10'), !gameData.forteOwned && gameData.crystals >= 10 && gameData.forteFragments <= 90);
setButtonActive(document.getElementById('forte-buy100'), !gameData.forteOwned && gameData.crystals >= 100 && gameData.forteFragments === 0);
setButtonActive(document.getElementById('forte-summon-btn'), !gameData.forteOwned && gameData.forteFragments >= 100);

const xFragmentsEl = document.getElementById('x-fragments');
if (xFragmentsEl) xFragmentsEl.innerText = getPartnerDataStatusLabel(gameData.xFragments, gameData.xOwned);

setButtonActive(document.getElementById('x-buy1'), !gameData.xOwned && gameData.crystals >= 1 && gameData.xFragments < 100);
setButtonActive(document.getElementById('x-buy10'), !gameData.xOwned && gameData.crystals >= 10 && gameData.xFragments <= 90);
setButtonActive(document.getElementById('x-buy100'), !gameData.xOwned && gameData.crystals >= 100 && gameData.xFragments === 0);
setButtonActive(document.getElementById('x-summon-btn'), !gameData.xOwned && gameData.xFragments >= 100);

const zeroFragmentsEl = document.getElementById('zero-fragments');
if (zeroFragmentsEl) zeroFragmentsEl.innerText = getPartnerDataStatusLabel(gameData.zeroFragments, gameData.zeroOwned);

setButtonActive(document.getElementById('zero-buy1'), !gameData.zeroOwned && gameData.crystals >= 1 && gameData.zeroFragments < 100);
setButtonActive(document.getElementById('zero-buy10'), !gameData.zeroOwned && gameData.crystals >= 10 && gameData.zeroFragments <= 90);
setButtonActive(document.getElementById('zero-buy100'), !gameData.zeroOwned && gameData.crystals >= 100 && gameData.zeroFragments === 0);
setButtonActive(document.getElementById('zero-summon-btn'), !gameData.zeroOwned && gameData.zeroFragments >= 100);

const exeRockmanFragmentsEl = document.getElementById('exeRockman-fragments');
if (exeRockmanFragmentsEl) exeRockmanFragmentsEl.innerText = getPartnerDataStatusLabel(gameData.exeRockmanFragments, gameData.exeRockmanOwned);

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

if (partnerArea && isSuperRockUnlocked()) {
    partnerArea.classList.remove('active');
}
if (rushImg) {
    rushImg.style.display = (gameData.rushOwned && !isSuperRockUnlocked()) ? 'block' : 'none';
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
  // 비트 보유 효과는 전체 공속 버튼이 아니라, 동료 팝업의 개별 공속 강화로 이동했습니다.
  partnerUpgrade.classList.remove('active');
}
const forteUpgradeEls = document.querySelectorAll('.forte-upgrade');
forteUpgradeEls.forEach(el => {
  if (gameData.forteOwned) el.classList.add('owned');
  else el.classList.remove('owned', 'active');
});

updatePartnerAttackUpgradeUI();
updateSleepModeUI();
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
if (mineEnhanceBadge) {
    mineEnhanceBadge.innerText = gameData.minePickaxeOwned ? `+${gameData.minePickaxeEnhance}` : '';
    mineEnhanceBadge.style.display = gameData.minePickaxeOwned ? '' : 'none';
}

const minePickaxeImg = document.getElementById('mine-pickaxe-img');
if (minePickaxeImg) {
    if (gameData.minePickaxeOwned) {
        minePickaxeImg.src = getPickaxeSprite();
        minePickaxeImg.style.display = '';
    } else {
        minePickaxeImg.removeAttribute('src');
        minePickaxeImg.style.display = 'none';
    }
}

const mineDamage = document.getElementById('mine-damage');
const mineRegisteredBonusInline = document.getElementById('mine-registered-bonus-inline');
const mineBaseDamage = getMiningDamageBaseOnly();
const mineBonusDamage = gameData.minePickaxeOwned ? getRegisteredPickaxeBonusDamage() : 0;
if (mineDamage) mineDamage.innerText = mineBaseDamage.toLocaleString();
if (mineRegisteredBonusInline) {
    mineRegisteredBonusInline.innerText = mineBonusDamage > 0 ? `+${mineBonusDamage.toLocaleString()}` : '';
    mineRegisteredBonusInline.style.display = mineBonusDamage > 0 ? 'inline-block' : 'none';
}

[0, 1, 2].forEach(index => {
    const slot = document.getElementById(`mine-pickaxe-slot-${index}`);
    if (!slot) return;
    const item = gameData.registeredPickaxes?.[index] || null;
    slot.classList.toggle('empty', !item);
    if (!item) {
        slot.innerHTML = `<em>등록</em>`;
        return;
    }
    slot.innerHTML = `<img src="${getRegisteredPickaxeSprite(item)}" alt="등록 곡괭이"><b>+${item.enhance}</b><em>+${getRegisteredPickaxeSingleBonusDamage(item)}</em><small>${getRegisteredPickaxeName(item)}</small>`;
});

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




const cardTabCardChipCount = document.getElementById('card-tab-card-chip-count');
if (cardTabCardChipCount) cardTabCardChipCount.innerText = Math.floor(gameData.materials.cardChip || 0).toLocaleString();
const optionChangeChipCount = document.getElementById('option-change-chip-count');
if (optionChangeChipCount) optionChangeChipCount.innerText = Math.floor(gameData.materials.optionChangeChip || 0).toLocaleString();
const cardTabScrewsCount = document.getElementById('card-tab-screws-count');
if (cardTabScrewsCount) cardTabScrewsCount.innerText = Math.floor(gameData.screws || 0).toLocaleString();

setButtonActive(document.getElementById('card-analyze-1-btn'), (gameData.materials.cardChip || 0) >= 1 && (gameData.screws || 0) >= CARD_ANALYZE_SCREW_COST);
setButtonActive(document.getElementById('card-analyze-10-btn'), (gameData.materials.cardChip || 0) >= 10 && (gameData.screws || 0) >= CARD_ANALYZE_SCREW_COST * 10);
setButtonActive(document.getElementById('option-chip-exchange-1-btn'), (gameData.stones || 0) >= OPTION_CHIP_STONE_COST);
setButtonActive(document.getElementById('option-chip-exchange-10-btn'), (gameData.stones || 0) >= OPTION_CHIP_STONE_COST * 10);
renderCardUI();
updateStatusUI();

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


const sleepModeState = {
    active: false,
    snapshot: null
};

function getSleepModeSnapshot() {
    return {
        screws: Math.floor(gameData.screws || 0),
        crystals: Math.floor(gameData.crystals || 0),
        stones: Math.floor(gameData.stones || 0),
        soulStones: Math.floor(gameData.soulStones || 0),
        cardChip: Math.floor(gameData.materials?.cardChip || 0),
        optionChangeChip: Math.floor(gameData.materials?.optionChangeChip || 0),
        bossReplayCard: Math.floor(gameData.materials?.bossReplayCard || 0)
    };
}

function getSleepModeGainValue(key) {
    if (!sleepModeState.snapshot) return 0;
    const current = getSleepModeSnapshot();
    return Math.max(0, Math.floor((current[key] || 0) - (sleepModeState.snapshot[key] || 0)));
}

function updateSleepModeUI() {
    if (!sleepModeState.active) return;
    ['screws','crystals','stones','soulStones','cardChip','optionChangeChip','bossReplayCard'].forEach(key => {
        const el = document.getElementById(`sleep-gain-${key}`);
        if (el) el.innerText = `+${getSleepModeGainValue(key).toLocaleString()}`;
    });
}

function enterSleepMode() {
    const overlay = document.getElementById('sleep-mode-overlay');
    const btn = document.getElementById('sleep-mode-btn');
    sleepModeState.active = true;
    sleepModeState.snapshot = getSleepModeSnapshot();
    if (overlay) overlay.classList.add('active');
    if (btn) btn.classList.add('active');
    resetSleepSlideHandle();
    updateSleepModeUI();
}

function exitSleepMode() {
    const overlay = document.getElementById('sleep-mode-overlay');
    const btn = document.getElementById('sleep-mode-btn');
    sleepModeState.active = false;
    if (overlay) overlay.classList.remove('active');
    if (btn) btn.classList.remove('active');
    resetSleepSlideHandle();
}

function toggleSleepMode() {
    if (sleepModeState.active) return;
    enterSleepMode();
}

const sleepSlideState = {
    dragging: false,
    maxX: 0
};

function setSleepSlideProgress(x) {
    const track = document.getElementById('sleep-slide-track');
    const handle = document.getElementById('sleep-slide-handle');
    const fill = document.getElementById('sleep-slide-fill');
    if (!track || !handle) return 0;
    const maxX = Math.max(1, track.clientWidth - handle.clientWidth - 6);
    const clamped = Math.max(0, Math.min(maxX, x));
    handle.style.transform = `translateX(${clamped}px)`;
    if (fill) fill.style.width = `${clamped + handle.clientWidth / 2}px`;
    return clamped / maxX;
}

function resetSleepSlideHandle() {
    setSleepSlideProgress(0);
}

function startSleepSlideDrag(event) {
    if (!sleepModeState.active) return;
    const track = document.getElementById('sleep-slide-track');
    const handle = document.getElementById('sleep-slide-handle');
    if (!track || !handle) return;
    event.preventDefault();
    sleepSlideState.dragging = true;
    const rect = track.getBoundingClientRect();
    sleepSlideState.trackLeft = rect.left;
    sleepSlideState.maxX = Math.max(1, track.clientWidth - handle.clientWidth - 6);
    if (handle.setPointerCapture && event.pointerId !== undefined) {
        try { handle.setPointerCapture(event.pointerId); } catch (e) {}
    }
    moveSleepSlideDrag(event);
}

function moveSleepSlideDrag(event) {
    if (!sleepSlideState.dragging) return;
    event.preventDefault();
    const track = document.getElementById('sleep-slide-track');
    const handle = document.getElementById('sleep-slide-handle');
    if (!track || !handle) return;
    const rect = track.getBoundingClientRect();
    const clientX = event.touches?.[0]?.clientX ?? event.clientX;
    const x = clientX - rect.left - handle.clientWidth / 2;
    const ratio = setSleepSlideProgress(x);
    if (ratio >= 0.86) {
        sleepSlideState.dragging = false;
        exitSleepMode();
    }
}

function endSleepSlideDrag(event) {
    if (!sleepSlideState.dragging) return;
    sleepSlideState.dragging = false;
    if (event) event.preventDefault();
    setTimeout(resetSleepSlideHandle, 120);
}

function initSleepSlideControl() {
    const track = document.getElementById('sleep-slide-track');
    const handle = document.getElementById('sleep-slide-handle');
    if (!track || !handle || track.dataset.bound === '1') return;
    track.dataset.bound = '1';
    [track, handle].forEach(el => {
        el.addEventListener('pointerdown', startSleepSlideDrag);
        el.addEventListener('touchstart', startSleepSlideDrag, { passive: false });
    });
    window.addEventListener('pointermove', moveSleepSlideDrag, { passive: false });
    window.addEventListener('pointerup', endSleepSlideDrag, { passive: false });
    window.addEventListener('touchmove', moveSleepSlideDrag, { passive: false });
    window.addEventListener('touchend', endSleepSlideDrag, { passive: false });
}

function handleSleepUnlockSlider(value) {
    const numeric = Number(value || 0);
    if (numeric >= 98) exitSleepMode();
}

function toggleMobileSyncTab(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const isMobile = document.body.classList.contains('mobile-mode') || document.documentElement.classList.contains('mobile-mode');
    if (!isMobile) {
        showTab('sync');
        return false;
    }
    const isOpen = document.body.classList.contains('mobile-sync-tab-active') || document.documentElement.classList.contains('mobile-sync-tab-active');
    showTab(isOpen ? 'battle' : 'sync');
    return false;
}

function refreshMobileSyncTabState(tabName) {
    const wing = document.getElementById('partner-sync-wing');
    const isMobile = document.body.classList.contains('mobile-mode') || document.documentElement.classList.contains('mobile-mode');
    const isMobileSync = isMobile && tabName === 'sync';
    document.body.classList.toggle('mobile-sync-tab-active', isMobileSync);
    document.documentElement.classList.toggle('mobile-sync-tab-active', isMobileSync);
    if (wing) wing.classList.toggle('open', !isMobile && tabName === 'sync');
    if (tabName === 'sync') updatePartnerAttackUpgradeUI();
}

function applyMobileMode(enabled) {
    refreshRealMobileDeviceClass();
    const isEnabled = !!enabled;
    document.body.classList.toggle('mobile-mode', isEnabled);
    document.documentElement.classList.toggle('mobile-mode', isEnabled);
    const btn = document.getElementById('mobile-mode-toggle');
    if (btn) btn.innerText = isEnabled ? '[PC모드]' : '[모바일모드]';
    const activeTab = document.querySelector('.tab-content.active');
    const activeTabName = activeTab ? activeTab.id.replace('-tab', '') : 'battle';
    refreshMobileSyncTabState(isEnabled ? activeTabName : 'battle');
}

function toggleMobileMode() {
    const next = !document.body.classList.contains('mobile-mode');
    localStorage.setItem('rockmanMobileMode', next ? '1' : '0');
    applyMobileMode(next);
}

function initMobileModePreference() {
    applyMobileMode(localStorage.getItem('rockmanMobileMode') === '1');
    initSleepSlideControl();
    const sleepBtn = document.getElementById('sleep-mode-btn');
    if (sleepBtn) {
        sleepBtn.onclick = function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            toggleSleepMode();
            return false;
        };
    }
    const syncWing = document.getElementById('partner-sync-wing');
    const syncPanel = document.getElementById('partner-sync-wing-panel');
    if (syncWing) {
        syncWing.onclick = function (e) {
            const isMobile = document.body.classList.contains('mobile-mode') || document.documentElement.classList.contains('mobile-mode');
            if (!isMobile) return;
            if (syncPanel && syncPanel.contains(e.target)) return;
            showTab('battle');
        };
    }
}


function resetGame() {
    if (confirm("초기화 하시겠습니까?")) {
        localStorage.removeItem('rockmanSave');
        localStorage.clear();
        sessionStorage.clear();
        location.replace(location.pathname + '?reset=' + Date.now());
    }
}

function secretJumpToStage(targetStage = 250) {
    const target = Math.max(1, Math.floor(targetStage || 250));
    gameData.stage = target;
    gameData.playerMaxHp = getEffectivePlayerMaxHp();
    gameData.playerHp = gameData.playerMaxHp;

    setupStage();
    startAutoAttack();
    startBluesAttack();
    startForteAttack();
    startXAttack();
    startExeRockmanAttack();
    startZeroAttack();

    showStageText(`TEST STAGE ${target}`);
    updateUI();
    saveData();
}

function devCheat() {
    gameData.screws += 100000;
    gameData.crystals += 1000;
    gameData.stones += 1000;
    gameData.materials.cardChip += 30;
    gameData.materials.superRockChip += 30;
    gameData.materials.bluesBusterChip = Math.floor(gameData.materials.bluesBusterChip || 0) + 30;
    gameData.materials.superForteChip = Math.floor(gameData.materials.superForteChip || 0) + 30;
    gameData.materials.optionChangeChip += 3;

    updateUI();
    saveData();

    alert("DEV 치트 적용됨");
}

initMobileModePreference();
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
        <span class="boss-reward-item">나사 <img class="boss-reward-icon" src="sprites/item/screw.png" alt="나사"></span>
        <span class="boss-reward-item">카드칩 <img class="boss-reward-chip-icon" src="sprites/boss/reward/cardchip.png" alt="카드칩"></span>
        <span class="boss-reward-item">슈퍼록맨 데이터칩 <img class="boss-reward-chip-icon" src="sprites/boss/reward/superrockchip.png" alt="슈퍼록맨 데이터칩"></span>
    `;

    const preview = cutmanCard.querySelector('.boss-demo-stage') || cutmanCard.querySelector('.boss-card-preview');
    if (preview && preview.parentNode && line.previousElementSibling !== preview) {
        preview.insertAdjacentElement('afterend', line);
    } else if (!line.parentNode) {
        cutmanCard.appendChild(line);
    }

    const nameEl = cutmanCard.querySelector('.boss-card-name');
    if (nameEl && !nameEl.querySelector('.boss-level-label')) {
        nameEl.insertAdjacentHTML('beforeend', ' <span id="cutman-boss-level-label" class="boss-level-label">Lv. 1</span>');
    }

    const entryCost = cutmanCard.querySelector('.boss-entry-cost');
    if (entryCost) {
        entryCost.innerHTML = '<img class="boss-resource-icon boss-ticket-icon-small" src="sprites/item/boss_ticket.png" alt="보스재생카드"> 1';
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
