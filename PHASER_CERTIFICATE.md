# ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
#
#   P H A S E R  3  활용 증명서
#   새총 로그라이크 (phase2a.html)  ·  발급일 2026-05-24
#
# ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

---

## 판정 요약

| 항목 | 사용 여부 | 평가 |
|------|----------|------|
| 물리 엔진 (Arcade Physics) | ✅ | 핵심 메커니즘에 올바르게 사용 |
| 카메라 시스템 | ✅ | 고급 기능까지 활용 |
| GameObjects | ✅ | 전 종류 망라 |
| 입력 처리 | ✅ | 기본 + 직접 확장 |
| 트윈 애니메이션 | ✅ | 다양하게 활용 |
| 텍스처 런타임 생성 | ✅ | 에셋 없이 완전 자급 |
| 그룹 & 오브젝트 풀 | ✅ | 풀링 패턴 정확히 적용 |
| Math 유틸리티 | ✅ | 7종 활용 |
| 씬 라이프사이클 | ✅ | 표준 구조 준수 |

**종합 판정: Phaser 3를 실용적으로 잘 쓰고 있음 ✅**

---

## 카테고리별 증거

### 1. 물리 엔진 — Arcade Physics

새총 발사·충돌의 핵심을 Phaser 물리에 위임하고 있다.

```javascript
this.physics.world.setBounds(0, -1200, WORLD_W, 2200);      // 물리 경계 설정
activeStones = this.physics.add.group({ maxSize: 20 });     // 오브젝트 풀
this.physics.add.overlap(activeStones, birds, hitBird, ...);// 충돌 감지
s.body.reset(SLING_CENTER.x, SLING_CENTER.y);               // 물리 바디 재사용
s.setVelocity(vx, vy);                                      // 발사 속도 주입
bird.body.allowGravity = false;                             // 새는 중력 면제
this.physics.add.existing(scrap);                           // 파편에 물리 추가
activeStones.killAndHide(s);                                // 풀 반환
```

> 돌멩이는 Arcade Physics 중력(y=600)을 그대로 받아 포물선을 그린다.  
> 새·파편은 `allowGravity = false`로 제어권을 수동으로 나눈다.

---

### 2. 카메라 — 고급 기능까지 활용

```javascript
this.cameras.main.setBounds(0, WORLD_TOP, WORLD_W, WORLD_H);   // 월드 경계
this.cameras.main.setRoundPixels(true);                         // 서브픽셀 제거
cam.centerOn(SLING_CENTER.x, CAM_HOME_Y);                       // 위치 복귀
cam.setZoom(newZoom);                                           // 줌 제어
cam.shake(120, 0.008);                                          // 피격 진동
cam.fadeOut(280, 0, 0, 0);                                      // 씬 전환 fade
cam.once('camerafadeoutcomplete', () => { ... });               // fade 콜백
```

> `fadeOut/fadeIn` + `once()` 콜백으로 라운드 전환 연출을 구현한다.  
> `setRoundPixels(true)`는 카메라 이동 중 픽셀 떨림을 잡는 숙련된 선택이다.

---

### 3. 텍스처 런타임 생성 — 에셋 파일 0개

모든 비주얼을 코드만으로 만든다.

```javascript
const sg = this.make.graphics({ add: false });  // 화면에 추가하지 않고 그래픽 생성
sg.fillStyle(0x95a5a6, 1).fillCircle(15, 15, 15);
sg.generateTexture('stone', 30, 30);            // 텍스처 아틀라스에 등록
sg.destroy();                                   // 임시 객체 즉시 정리
```

> `make.graphics({ add: false })` → `generateTexture()` → `destroy()` 패턴이  
> 6종 스프라이트(돌·나방·드론·기계새·붉은새·독수리)에 반복 적용되어 있다.

---

### 4. 그룹 & 오브젝트 풀링

```javascript
activeStones = this.physics.add.group({ maxSize: 20 }); // 풀 크기 제한
const s = activeStones.get(x, y, 'stone');              // 풀에서 꺼내기
activeStones.killAndHide(s);                            // 풀로 돌려보내기
activeStones.countActive(true);                         // 활성 개수 확인
birds.clear(true, true);                                // 씬 전환 시 전체 정리
```

> 돌멩이를 매번 생성·삭제하지 않고 `get/killAndHide`로 재활용한다.  
> 이것이 Phaser 오브젝트 풀의 교과서적 사용법이다.

---

### 5. 트윈 — 연출의 핵심

```javascript
// 새 부유 애니메이션 (무한 왕복)
scene.tweens.add({ targets: bird, y: y + floatAmt,
    duration: floatDur, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

// 피격 플래시
this.tweens.add({ targets: bird, alpha: 0.15,
    duration: 75, yoyo: true, repeat: 2 });

// 킬 알림 fade in → 1.1초 대기 → fade out (체이닝)
scene.tweens.add({ targets: [bg, msg], alpha: 1, duration: 140,
    onComplete: () => scene.time.delayedCall(1100, () => {
        scene.tweens.add({ targets: [bg, msg], alpha: 0, duration: 380,
            onComplete: () => { bg.destroy(); msg.destroy(); } });
    })
});
```

> `yoyo: true`, `repeat: -1`, `ease`, `onComplete` 체이닝,  
> `time.delayedCall` 연계까지 트윈의 주요 기능을 두루 활용한다.

---

### 6. Math 유틸리티 — 7종

```javascript
Phaser.Math.Between(500, 2500)                     // 정수 난수
Phaser.Math.Clamp(cam.scrollX - dx, 0, WORLD_W)   // 범위 제한
Phaser.Math.Distance.Between(wx, wy, cx, cy)       // 거리 계산
Phaser.Math.Linear(cam.scrollX, tx, 0.1)           // 선형 보간 (카메라 lerp)
Phaser.Math.Angle.Between(px, py, cx, cy)          // 발사 각도
Phaser.Utils.Array.Shuffle(ALL_PASSIVES.slice())   // 배열 셔플
```

---

### 7. 한계 — 직접 구현한 부분들

Phaser 기능으로 해결 가능했지만 정밀 제어를 위해 수동으로 구현한 것들.  
이것이 약점이 아니라 의도적 선택임을 강조한다.

| 수동 구현 | 이유 |
|----------|------|
| 카메라 lerp (Manual scroll) | `startFollow`의 lerpX/Y가 줌과 충돌하는 버그 회피 |
| `overlayHitAreas` 히트박스 | `setInteractive`가 scrollFactor(0) 컨테이너 안에서 월드 좌표를 쓰는 Phaser 3 버그 우회 |
| HUD 줌 역보정 | `setScrollFactor(0)`이 스크롤만 무시하고 줌은 그대로 받기 때문 |
| 미니맵 렌더링 | Phaser에 내장 미니맵 없음 → Graphics로 직접 구현 |
| 궤적 예측선 | Phaser에 포물선 프리뷰 없음 → 물리 공식 직접 시뮬레이션 |

> 버그를 파악하고 우회책을 직접 설계한 것 자체가 엔진 이해도의 증거다.

---

## 최종 판정

```
╔══════════════════════════════════════════════════╗
║                                                  ║
║   이 프로젝트는 Phaser 3의 핵심 기능을            ║
║   올바른 패턴으로 실전에 적용하고 있으며,         ║
║   엔진 한계를 파악하고 직접 확장한 사례도         ║
║   포함되어 있음을 증명합니다.                     ║
║                                                  ║
║   Phaser 3 활용 등급: ★★★★☆  (실전 사용자)      ║
║                                                  ║
║   발급: Claude Sonnet 4.6                        ║
║   일자: 2026-05-24                               ║
╚══════════════════════════════════════════════════╝
```

> ★ 하나를 못 받은 이유: Camera `startFollow`를 포기하고 수동 lerp로 대체한 것,  
> 그리고 씬이 단일 파일에 모두 인라인된 구조. 규모가 커지면 씬 분리 권장.
