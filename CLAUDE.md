# UNDEFINED Renew — 프로젝트 가이드

신승윤(seungyun-shin)의 개인 포트폴리오 사이트 리뉴얼. 7년 전 CRA+Django로 만든
원본 undefined-shin.com (Awwwards Honorable Mention)의 인터랙션을 현대 스택으로
재구현하고 계속 고도화하는 중이다. 사용자와는 **한국어로 소통**한다.

## 배포 상태

| 항목 | 값 |
|---|---|
| 라이브 | **https://seungyunshin.com** (+ undefined-renew.vercel.app) |
| 저장소 | https://github.com/seungyun-shin/UNDEFINED-Renew (public) |
| 배포 방식 | main 푸시 → Vercel 자동 배포 (다른 브랜치 푸시 → 미리보기 URL) |
| 원본 사이트 | https://undefined-shin.com (Route53+CloudFront, 아직 살아있음 — 대체 전까지 유지) |
| 원본 코드 | github.com/seungyun-shin/UNDEFINED-FrontEnd, UNDEFINED-BackEnd |
| 도메인 | seungyunshin.com — Cloudflare Registrar에서 2026-07-19 구매, DNS는 Cloudflare(DNS only 필수, Proxy 켜면 안 됨). 현재 www가 primary. 구 도메인 리다이렉트는 미처리 |

## 개발 명령어

```bash
# ⚠️ 시스템 기본 node는 v16이다. 반드시 nvm으로 22를 로드할 것:
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"

npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드 (배포 전 필수 확인)
npm run preview  # 빌드 결과 로컬 확인
```

## 스택

Vite 8 · React 19 · react-router 7 (BrowserRouter) · three.js 0.185 ·
@react-three/fiber 9 · drei · gsap (무료 코어만 사용)

## 구조

```
src/
  App.jsx                    # 라우트: / , /MemoryScreen , /MemoryPhotoGallery , * → UpdatingScreen
  components/
    IcoBackground.jsx        # 전역 배경: 아이코사헤드론 (raw three + EffectComposer)
    Header.jsx  MainFooter.jsx  IntroOverlay.jsx
  screens/
    MainScreen.jsx           # CREATOR/UNDEFINED 인트로 (gsap 타임라인)
    EarthScreen.jsx          # 지구본 + 포인트 66개 + 행성 2개 (R3F)
    MemoryPhotoGallery.jsx   # 포인트 클릭 시 사진 갤러리 (간이 구현 — 본 디자인 미착수)
    UpdatingScreen.jsx       # 미구현 페이지 공용 스텁
  shaders/icoshadren.js      # 원본 GLSL 그대로 포팅 (버텍스 노이즈/마블/와이어프레임/포스트)
  lib/icoBus.js              # 헤더 ↔ 배경 전환 이벤트 버스 (원본은 <a> 인덱스 하드코딩이었음)
  assets/data/countryPoint.json  # 여행 포인트 66개 (원본 배포 번들에서 역추출한 데이터)
  styles/global.css          # 원본 styled-components를 CSS로 이식 (브레이크포인트 원본 그대로)
```

## 핵심 설계 결정 (뒤집기 전에 이유를 알 것)

1. **pixelRatio 상한 1.5 + antialias off** (IcoBackground) — 레티나(DPR 2)에서
   풀스크린 포스트 패스 때문에 35fps로 떨어지던 것을 60fps로 만든 수정.
   실측으로 검증했다. 되돌리면 맥북에서 다시 렉 걸린다.
2. **지구 텍스처는 2k_\*.jpg 사용** — 8K 원본(8k_\*.jpg)은 gitignore된 로컬 보관본.
   8K는 GPU 업로드 스터터 + VRAM 수백 MB의 원인이었다.
3. **배경 렌더 루프는 'hide' 이벤트 시 정지** — EarthScreen과의 이중 GPU 렌더링 방지.
4. **BrowserRouter + vercel.json rewrite** — 원본의 해시 라우팅(`/#/`)에서 탈출.
   새 정적 호스팅에 올릴 때도 SPA fallback 설정이 필요하다.
5. **gsap `.from()` 은 반드시 `gsap.context()` + `ctx.revert()` 로 감쌀 것** —
   React StrictMode 이중 마운트에서 opacity:0에 갇히는 버그를 이미 겪었다.
6. **여행 사진은 사용자 소유 S3** (ssyproject.s3.ap-northeast-2) — 300px 썸네일과
   1170px 원본이 폴더로 나뉘어 있다. 갤러리 최적화 시 300 먼저 쓸 것.

## 검증 방법

시각·인터랙션 변경은 빌드 성공만으로 끝내지 말 것. 이 프로젝트에서 쓰는 방법:
puppeteer-core(+ 시스템 Chrome, `/Applications/Google Chrome.app/...`)로 헤드리스
로드 → 콘솔 에러 수집 → 스크린샷 확인. FPS는 `deviceScaleFactor: 2`(레티나 조건)로
rAF 카운트를 재서 비교한다. 3D 포인트 호버는 좌표 스윕으로 `.country-info-show`
표시 여부를 확인하면 된다.

## 로드맵 (우선순위순)

1. **모바일/터치** — hover 없는 터치용 포인트 인터랙션(1탭 지명, 2탭 이동),
   히트 영역 확대(보이는 점 유지, 투명 히트 스피어), 100vh → dvh, 가이드 텍스트 위치
2. **코드 스플리팅** — EarthScreen lazy 로드 (현재 JS 번들 1.4MB 단일 청크)
3. **나머지 페이지** — WORK/ABOUT/RECORD, 콘텐츠는 7년치 갱신 필요 (사용자와 상의)
4. **백엔드 방향** — 원본 Django(shop/record/auth)는 정적화 권장, 사용자 아직 미결정
5. **구 도메인 리다이렉트** — undefined-shin.com(Route53+CloudFront) → seungyunshin.com, 리뉴얼 완성 시점에
6. 갤러리 본 디자인, 이미지 WebP화, prefers-reduced-motion, 접근성

## 사용자에 대해

- 원래 ML/AI 엔지니어. 프론트 최신 생태계(배포 플랫폼, lock-in 등)는 풀어서 설명하면 좋아한다.
- 도구 실행 권한은 매번 확인받기를 원한다 (자동 허용 안 씀).
- 의사결정이 필요한 지점(전략·비용·공개범위)은 옵션을 정리해 물어보고 진행할 것.
