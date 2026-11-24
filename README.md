# 북퀘스트 (BookQuest) — 기분 맞춤 문학 RPG 서재

지금의 기분 상태에 맞춰 책을 추천받고, 책의 줄거리 도입부와 난이도를 게임처럼 체험할 수 있는 인터랙티브 독서 웹 애플리케이션입니다.

## 주요 기능

- **기분 조율소 & AI 맞춤 추천**: 6가지 기분 프리셋, 마음의 에너지·감정 온도 슬라이더, 독서 체력(난이도), 자유 메모를 바탕으로 Gemini API가 실제 도서 3권을 RPG 퀘스트 카드로 추천합니다.
- **봉인된 퀘스트 카드 & 4대 능력치 레이더**: 추천된 카드를 3D 플립 모션으로 직접 열어보며, 몰입도·사유력·감정 파동·어휘 밀도를 SVG 레이더 차트로 확인할 수 있습니다.
- **스포일러 없는 분기형 줄거리 퀘스트**: 책의 도입부를 바탕으로 2단계 선택지를 플레이하고 운명 주사위(d20) 판정을 거쳐 책과의 공명도를 측정합니다.
- **집중 독서 타이머 & 보스전**: 1~120분 자유 설정 타이머와 빗소리 배경음(Web Audio API)을 지원하며, 독서 완료 시 책의 던전 보스 HP를 깎아 완독 아티팩트를 해금할 수 있습니다.
- **모험가 업적 & 등급 시스템**: 퀘스트 수락, 줄거리 체험, 보스 공략, 완독에 따라 경험치(XP)와 탐독가 등급(`Lv.1 견습 탐독가` ~ `Lv.5 만권의 현자`)이 성장합니다.

## 기술 스택

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (`motion/react`), Lucide Icons
- **Backend**: Express, Vite Middleware (`tsx`), `@google/genai`

---

## GitHub로 전체 프로젝트 옮기기

내려받은 `bookquest-github.zip` 압축을 풀면 전체 소스 코드, 이미지 에셋, 설정 파일이 모두 들어 있습니다.

### 방법 1: Git CLI로 올리기 (권장 — 숨김 파일 포함 전체 반영)

압축을 푼 폴더에서 터미널을 열고 아래 명령어를 순서대로 실행하세요.

```bash
git init
git add .
git commit -m "Initial commit: BookQuest"
git branch -M main
git remote add origin https://github.com/<내_깃허브_아이디>/<저장소_이름>.git
git push -u origin main
```

### 방법 2: GitHub 웹 화면에서 올리기

1. GitHub에서 새 Repository를 생성합니다.
2. 저장소 화면의 **uploading an existing file** (또는 **Add file > Upload files**)를 클릭합니다.
3. 압축을 푼 폴더 안의 모든 파일(`src`, `server.ts`, `package.json`, `index.html`, `.github`, `.gitignore`, `.env.example` 등)을 드래그 앤 드롭한 뒤 **Commit changes**를 누릅니다.

---

## 로컬 실행 방법 (Node.js 20+ / 22 권장)

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **환경 변수 설정**
   ```bash
   cp .env.example .env
   ```
   `.env` 파일의 `GEMINI_API_KEY` 항목에 발급받은 Google Gemini API 키를 입력합니다.

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
