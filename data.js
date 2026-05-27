// data.js — 적 데이터 / 스테이지 데이터 (도감, 밸런스 조정 전용)

const ENEMY_DATA = {
    mothBird: {
        key: 'mothBird',
        name: '방사능 나방',
        speedMin: 20, speedMax: 55,
        material: 3, hp: 1,
        zone: 'ground',   // 고도 1
        zoneY: [495, 635],
        desc: '지상 근처를 배회하는 약한 적. 잡기 쉽지만 특수물질이 적다.'
    },
    droneBird: {
        key: 'droneBird',
        name: '정찰 드론',
        speedMin: 40, speedMax: 90,
        material: 5, hp: 1,
        zone: 'mid',      // 고도 2
        zoneY: [300, 420],
        desc: '중간 고도를 느리게 비행하는 정찰 드론.'
    },
    mechBird: {
        key: 'mechBird',
        name: '기계 변이 새',
        speedMin: 80, speedMax: 180,
        material: 10, hp: 1,
        zone: 'upper',    // 고도 3
        zoneY: [80, 260],
        desc: '빠르게 날아다니는 기계 변이체.'
    },
    redBird: {
        key: 'redBird',
        name: '방사능 돌연변이 새',
        speedMin: 120, speedMax: 270,
        material: 15, hp: 1,
        zone: 'upper',    // 고도 3
        zoneY: [80, 260],
        desc: '가장 빠른 상단 적. 특수물질이 많다.'
    },
    eagle: {
        key: 'eagle',
        name: '방사능 독수리',
        speedMin: 150, speedMax: 320,
        material: 50, hp: 2,
        zone: 'sky',      // 고도 4 — 화면 상단 가시권
        zoneY: [50, 180],
        desc: 'HP 2의 강적. 화면 상단을 빠르게 이동하며 특수물질이 많다.'
    },
    floater: {
        key: 'floater',
        name: '부유 생물체',
        speedMin: 5, speedMax: 18,
        material: 30, hp: 1,
        zone: 'far',      // 원거리 구역 — 멀리 던질 때만 도달 가능
        zoneY: [240, 420],
        desc: '먼 곳을 둥둥 떠다니는 신비한 생명체. 특수물질이 풍부하다.'
    },
    tendril: {
        key: 'tendril',
        name: '고공 오염체',
        speedMin: 14, speedMax: 30,
        material: 80, hp: 3,
        zone: 'sky5',     // 고도 5 — 화면 최상단, 팔근육 권장
        zoneY: [-60, 30],
        desc: 'HP 3의 거대 촉수형 오염체. 새총 근처 상공에 2마리 출현. 팔근육이 있으면 쉽게 맞출 수 있다.'
    },
    overlord: {
        key: 'overlord',
        name: '부유 오염 기지',
        speedMin: 0, speedMax: 0,   // 완전 고정 — 움직이지 않음
        material: 120, hp: 5,
        zone: 'apex',     // 고도 6 — 극고공, 팔근육 ×2 권장
        zoneY: [-220, -120],
        desc: 'HP 5의 거대 부유 기지. 맵 곳곳 극고공에 3마리 고정. 팔근육 ×2로 도달 가능. 특수물질이 엄청나게 많다.'
    },
};

// 기본 랜덤 새 pool (독수리·부유생물체·오염체·기지 제외 — 별도 스폰)
const BIRD_TYPES     = [ENEMY_DATA.mechBird, ENEMY_DATA.redBird, ENEMY_DATA.droneBird];
const MOTH_TYPE      = ENEMY_DATA.mothBird;
const EAGLE_TYPE     = ENEMY_DATA.eagle;
const FLOATER_TYPE   = ENEMY_DATA.floater;
const TENDRIL_TYPE   = ENEMY_DATA.tendril;
const OVERLORD_TYPE  = ENEMY_DATA.overlord;

// ─── 스테이지 데이터 (10스테이지, 전체 50마리 고정) ───
// 나방 20 + 일반새 16 + 독수리 5 + 오버로드 3 + 오염체 2 + 부유생물 4 = 50
const STAGE_DATA = Array.from({ length: 10 }, (_, i) => ({
    stage:          i + 1,
    pollution:      (i + 1) * 10,
    birdCount:      16,   // 기계새/레드버드/드론 풀
    mothCount:      20,   // 지상 나방
    eagleCount:     5,    // 독수리
    overlordCount:  3,    // 부유 오염 기지 (고정)
    // tendril 2 + floater 4 는 spawnBirdsSpread에서 고정값으로 처리
    requiredMaterial: 10,
}));
