# 북퀘스트 (BookQuest) — 기분 맞춤 문학 RPG 서재

지금의 기분 상태에 맞춰 책을 추천받고, 책의 줄거리 도입부와 난이도를 게임처럼 체험할 수 있는 인터랙티브 독서 웹 애플리케이션입니다.

## 주요 기능

- **기분 조율소 & 맞춤 카드 뽑기**: 6가지 기분 프리셋, 마음의 에너지·감정 온도 슬라이더, 독서 체력(난이도), 한 줄 메모 키워드에 맞춰 3장의 퀘스트 카드를 즉시 매칭합니다. 백엔드 서버가 연결된 환경에서는 Gemini API 기반 실시간 AI 추천을, GitHub Pages 같은 정적 호스팅 환경에서는 18권의 큐레이션 서재 매칭 엔진을 자동으로 사용합니다.
- **봉인된 퀘스트 카드 & 4대 능력치 레이더**: 추천된 카드를 3D 플립 모션으로 열어보며, 몰입도·사유력·감정 파동·어휘 밀도를 SVG 레이더 차트로 확인할 수 있습니다.
- **스포일러 없는 분기형 줄거리 퀘스트**: 책의 도입부를 바탕으로 2단계 선택지를 플레이하고 운명 주사위(d20) 판정을 거쳐 책과의 공명도를 측정합니다.
- **집중 독서 타이머 & 보스전**: 1~120분 자유 설정 타이머와 빗소리 배경음(Web Audio API)을 지원하며, 독서 완료 시 책의 던전 보스 HP를 깎아 완독 아티팩트를 해금할 수 있습니다.
- **모험가 업적 & 등급 시스템**: 퀘스트 수락, 줄거리 체험, 보스 공략, 완독에 따라 경험치(XP)와 탐독가 등급(`Lv.1 견습 탐독가` ~ `Lv.5 만권의 현자`)이 성장합니다.

## 기술 스택

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (`motion/react`), Lucide Icons
- **Backend**: Express, Vite Middleware (`tsx`), `@google/genai`

---

## 정적 호스팅 (GitHub Pages 등) 배포 방법

별도의 Node.js 서버 없이도 모든 기능(기분 맞춤 3장 뽑기, 3D 카드 뒤집기, 분기형 줄거리 체험, 집중 독서 타이머, 보스전, 업적 저장)이 오류 없이 동작합니다.

1. 저장소 **Settings > Pages**에서 Source를 **GitHub Actions**로 설정합니다.
2. `main` 또는 `master` 브랜치에 푸시하면 `.github/workflows/deploy-pages.yml`이 자동으로 빌드 및 배포를 수행합니다.
3. 만약 백엔드(`server.ts`)를 Render·Railway·Cloud Run 등에 별도로 배포해 Gemini AI 추천까지 연동하려면, 정적 빌드 시 `VITE_API_BASE_URL=https://your-backend-url` 환경 변수를 지정하세요.

---

## 로컬 및 풀스택 서버 실행 방법 (Node.js 20+ / 22 권장)

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **환경 변수 설정**
   ```bash
   cp .env.example .env
   ```
   `.env` 파일(또는 호스팅 플랫폼의 Environment Variables)에 `GEMINI_API_KEY`를 설정하면 실시간 AI 맞춤 퀘스트 생성이 활성화됩니다.

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   브라우저에서 `http://localhost:3000`으로 접속합니다.

4. **프로덕션 빌드 및 실행**
   ```bash
   npm run build
   NODE_ENV=production npm start
   ```

