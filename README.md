# DOMINO 12 — 밀면, 다 이해된다

제1회 해커톤: 랜딩톤 출품작. 도미노 12개 세트를 소개하는 **한 장짜리 랜딩 페이지**이며,
페이지 하단 무대에서 **직접 작성한 2D 강체 물리 엔진**이 실시간으로 도미노를 시뮬레이션합니다.

- 공개 주소: (배포 후 기입)
- 제출 마감: 2026년 12월 4일 (KST)

## 무엇을 보여 주는가

| 요소 | 내용 |
|---|---|
| 무대 | 12개의 도미노가 바닥 위에 서 있고, 스크롤·연쇄 진행에 따라 카메라가 따라갑니다 |
| 조작 | `밀어보기`(첫 도미노에 임펄스) · `다시 세우기`(초기 상태 복원) · 도미노를 잡아 기울이기(포인터 드래그) |
| 연출 | 스크롤이 도미노를 밀고, 넘어진 도미노에 맞춰 해당 섹션이 열립니다 |
| 계측 | 넘어짐 개수 · 최대 각도 · 충돌 횟수 · 경과 시간을 실제 시뮬레이션 값으로 표시 |
| 소리 | 도미노가 부딪힐 때 합성한 클릭음(외부 음원 없음). 기본 꺼짐, 버튼으로 켭니다 |

## 물리 엔진

외부 물리 라이브러리를 쓰지 않고 직접 작성했습니다.

- **강체**: 위치·각도·선속도·각속도를 가진 회전 사각형 12개 + 정적 바닥 1개
- **충돌 검출**: SAT(분리축 정리)로 OBB 4축 검사, 꼭짓점-상자 검사로 접촉점 생성
- **접촉 마진**: 0.6 world px — 살짝 닿기만 해도 접촉을 유지해 정지 상태가 떨리지 않습니다
- **솔버**: 지난 스텝의 법선 임펄스를 재사용하는 **웜 스타트** + 누적 임펄스 방식의 순차 임펄스,
  쿨롱 마찰(μ=0.7), 반복 순서를 매 스텝 뒤집어 특정 접촉에 편향되지 않게 처리
- **위치 보정**: Baumgarte 방식(slop 0.4, 계수 0.7)
- **스텝**: 240Hz 고정 스텝, 프레임당 4 서브스텝
- **안정화**: 저속 정지(sleep) 판정, 이탈 가드(무대를 벗어나면 제자리 복구)

실측: 12개 전부 넘어지는 데 약 2.1초, 한 칸이 다음 칸을 넘기는 데 약 0.17초.

## 최신 웹 기법

- **CSS scroll-driven animations** (`animation-timeline: view()`) — 스크롤 진행에 묶인 등장 연출.
  미지원 브라우저와 `prefers-reduced-motion` 에서는 IntersectionObserver 경로로 자동 대체합니다.
- **`::details-content` + `interpolate-size: allow-keywords`** — `height: auto` 아코디언 전환
- **`text-box: trim-both`** — 제목의 광학 정렬
- **Web Audio API** — 도미노 클릭음을 코드로 합성(음원 파일 없음)
- **Pointer Events + `touch-action: none`** — 마우스·터치·펜 동일 동작
- 스크롤 가로채기(smooth scroll 라이브러리)는 쓰지 않았습니다. 무대 카메라의 관성만으로
  "무게감"을 만들고, 네이티브 스크롤의 접근성·성능 특성은 그대로 둡니다.

## 파일 구조

```
public/
  index.html                    # 페이지 전부 (HTML + CSS + 물리 엔진)
  fonts/pretendard-subset.woff2 # 사용 글자만 남긴 Pretendard 서브셋 (90KB)
tools/
  subset-font.sh                # 서브셋 재생성 스크립트
  PretendardVariable.woff2      # 원본(저장소에는 커밋하지 않음)
LICENSE-Pretendard.txt          # SIL Open Font License 1.1 전문
```

## 로컬 실행

```bash
cd public && python -m http.server 8788
# http://127.0.0.1:8788/
```

## 개발용 훅

브라우저 콘솔에서 시뮬레이션을 직접 검사할 수 있습니다.

```js
__domino.state()        // 넘어짐 개수, 각도, 카메라, NaN 여부 등
__domino.push(0)        // 첫 도미노에 임펄스
__domino.reset()        // 초기 상태 복원
__domino.pause(true)    // 자동 스텝 정지
__domino.step(5)        // 5초 분량을 즉시 계산
```

## 외부 자료와 라이선스

| 자료 | 출처 | 라이선스 |
|---|---|---|
| 서체 Pretendard | [orioncactus/pretendard](https://github.com/orioncactus/pretendard) | SIL Open Font License 1.1 (`LICENSE-Pretendard.txt`) |
| 코드·이미지·소리 | 전부 이 저장소에서 직접 작성 | © 2026, 출품자 |

외부 라이브러리·이미지·음원·영상은 사용하지 않았습니다. 페이지의 모든 그래픽은
캔버스 2D로, 소리는 Web Audio로 실시간 생성합니다.
