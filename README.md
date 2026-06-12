# ♟️ Chess Battle Arena

온라인 2D 팀전 체스 배틀 게임

## 🎮 게임 개념

- **2D 택티컬 액션**: WASD로 조종하는 실시간 전투
- **캐릭터 선택**: 각 체스 기물이 고유한 스킬 보유
- **팀전**: 2v2 또는 4v4 멀티플레이
- **스킬 시스템**: 패시브 + 기본공격 + 스킬 2개 + 궁극기

## 📁 프로젝트 구조

```
chess-battle/
├── frontend/                 # 클라이언트 (HTML/CSS/JS)
│   ├── index.html           # 메인 게임 페이지
│   ├── pages/
│   │   ├── login.html       # 로그인 페이지
│   │   └── character-select.html  # 캐릭터 선택
│   ├── css/
│   │   ├── style.css        # 메인 스타일
│   │   └── game.css         # 게임 스타일
│   ├── js/
│   │   ├── main.js          # 메인 게임 로직
│   │   ├── socket.js        # Socket.io 통신
│   │   ├── game.js          # 게임 엔진
│   │   ├── characters.js    # 캐릭터 정의
│   │   ├── skills.js        # 스킬 정의
│   │   └── ui.js            # UI 관리
│   └── assets/
│       ├── sprites/         # 캐릭터/이펙트 이미지
│       └── sounds/          # 게임음
│
├── backend/                  # 서버 (Node.js)
│   ├── server.js            # 메인 서버
│   ├── package.json
│   ├── game/
│   │   ├── gameManager.js   # 게임 상태 관리
│   │   ├── player.js        # 플레이어 클래스
│   │   └── collision.js     # 충돌 감지
│   ├── socket/
│   │   └── events.js        # Socket 이벤트 핸들러
│   └── db/
│       └── database.js      # 데이터베이스 (선택)
│
├── docs/
│   ├── GAME_MECHANICS.md    # 게임 메커니즘
│   ├── CHARACTER_GUIDE.md   # 캐릭터 가이드
│   └── SKILL_SYSTEM.md      # 스킬 시스템
│
└── .gitignore
```

## 🚀 시작하기

### 백엔드 설정
```bash
cd backend
npm install
npm start
```

### 프론트엔드
브라우저에서 `frontend/index.html` 열기

## 🎯 개발 로드맵

- [ ] 기본 게임 엔진 (Phaser.js)
- [ ] 캐릭터 6종 구현
- [ ] 스킬 시스템
- [ ] Socket.io 멀티플레이
- [ ] 게임 로직 (승리 조건)
- [ ] UI/UX 개선
- [ ] 사운드 효과
- [ ] 랭킹 시스템

## 📚 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript, Phaser.js
- **Backend**: Node.js, Express, Socket.io
- **Database**: MongoDB (선택)
- **Deployment**: Docker, Heroku/AWS

## 📝 라이선스

MIT
