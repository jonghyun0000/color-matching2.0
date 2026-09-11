# 뚝딱 - 상하의 컬러매칭 앱

> 오늘 입을 옷, 색 조합까지 뚝딱

옷 사진에서 대표 색을 추출하고 어울리는 상하의 색 조합을 추천하는 웹앱. 첫 바이브코딩 프로젝트에서 시작해 색 추출 안정성과 사용 경험을 개선하고 있습니다.

[직접 체험하기](https://color-matching2-0.vercel.app) · [개선 기록과 검증](docs/UPGRADE.md)

## 빠른 시작

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev

# 3. 브라우저에서 http://localhost:5173 접속
```

## 주요 명령어

| 명령 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 (HMR) |
| `npm run build` | 프로덕션 빌드 → `dist/` |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run typecheck` | TypeScript 타입 체크만 |

## 폴더 구조

```
src/
├── App.tsx                  # 라우터
├── main.tsx                 # 엔트리
├── index.css                # Tailwind 베이스
├── types/
│   ├── color.ts             # ColorEntry, Mode, ItemType
│   └── material.ts          # Material
├── constants/
│   ├── colors.ts            # 50개 색 사전
│   ├── fashionPairs.ts      # 패션 페어 + BARUSA + 안전 앵커
│   ├── modes.ts             # 6개 모드 메타
│   ├── modeIcons.tsx        # 모드별 lucide 아이콘 매핑
│   ├── materials.ts         # 8개 재질 + 페어링 매트릭스
│   └── reasonTemplates.ts   # 추천 이유 문장 빌더
├── lib/
│   ├── color/
│   │   ├── convert.ts       # hex/rgb/hsl 변환
│   │   ├── categorize.ts    # 색 분류
│   │   ├── name.ts          # 한국어 이름 매칭
│   │   ├── extract.ts       # K-means 색 추출 (중앙 가중치 + 배경 후순위)
│   │   └── recommend.ts     # 메인 추천 알고리즘
│   ├── storage/
│   │   ├── favorites.ts     # 즐겨찾기 (localStorage)
│   │   └── history.ts       # 최근 기록 (localStorage)
│   └── share.ts             # html2canvas + Web Share API
├── components/
│   ├── Layout.tsx           # 하단 탭 레이아웃
│   ├── BottomTabs.tsx
│   └── ui/
│       ├── PageHeader.tsx
│       └── EmptyState.tsx
└── pages/
    ├── HomePage.tsx         # /
    ├── UploadPage.tsx       # /upload
    ├── ExtractPage.tsx      # /extract
    ├── ResultPage.tsx       # /result
    ├── ManualColorPage.tsx  # /manual-color
    ├── FavoritesPage.tsx    # /favorites
    ├── HistoryPage.tsx      # /history
    └── SettingsPage.tsx     # /settings
```

## 알고리즘 핵심

### 색 추천 점수 (`lib/color/recommend.ts`)

```
입력 hex → 사전 50개 중 가장 가까운 색 매칭
        ↓
49개 후보에 대해 점수 계산:
  - BARUSA 검증 페어:    +22
  - 안전 앵커:            +10
  - 무채색 매치:          +15
  - 톤온톤 (명도 20~55):   +12
  - 유사색 (Hue ±30):      +8
  - 보색 (Hue ~180, S<55): +6
  - 일반 패션 페어:        +8
  - 명도 대비 ≥30:         +8
  - 양쪽 채도 강함:        -25
  - 모드 가중치:           ±5~25
        ↓
35점 미만 필터링 + 같은 family 최대 2개 → 상위 5개
```

### K-means 색 추출 (`lib/color/extract.ts`)

- 이미지 중앙 70% 영역만 샘플링 (배경 픽셀 비중 감소)
- 클러스터 중심에 배경 가능성 점수 적용 (흰/회/검 배경 후순위)
- 결정적 최장 거리 중심 초기화 + 최대 10회 반복. 실제 생성된 중심만 순회해 단색 사진도 처리합니다.

## 기술 스택

| 영역 | 선택 |
|---|---|
| 프레임워크 | React 18 + Vite |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| 라우팅 | React Router v6 |
| 아이콘 | lucide-react (이모지 사용 안 함) |
| 폰트 | Pretendard Variable (CDN) |
| 캡처 | html2canvas |
| 저장 | localStorage |

## 디자인 원칙

- **이모지 절대 금지** — 모든 아이콘은 lucide-react 또는 커스텀 SVG
- 포인트 컬러 한 가지(`#0B1F3A` 딥 네이비)만 사용
- 카드형 UI, 둥근 모서리 (12~24px)
- 모바일 우선 (max-width 480px), 데스크탑은 중앙 정렬
- 그림자 최소화, 구분은 border로

## 배포

### Vercel (권장)
```bash
npm install -g vercel
vercel
```

### 정적 호스팅
```bash
npm run build
# dist/ 폴더를 Netlify, GitHub Pages, Cloudflare Pages 등에 업로드
```

### Play Store 출시 (Phase 2)
PWA → Bubblewrap으로 TWA(Trusted Web Activity) 생성 → Play Store 등록.

## 다음 단계 (Phase 2)

- [ ] PWA 매니페스트 + 서비스 워커
- [ ] 영역 직접 선택 크롭 UI (정확도 추가 개선)
- [ ] Supabase 백엔드 (계정 + 클라우드 동기화)
- [ ] 옷장 기능 (보유 옷 등록 + 매칭)
- [ ] AI 코디 추천 (LLM 호출)

## 라이선스

© 2026 Jonghyun. All rights reserved.

소스 코드는 공개되어 있으나 별도의 오픈소스 라이선스는 부여하지 않았습니다.
