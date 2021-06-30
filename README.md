# 한강가지 말고 한강뷰 가자!

김프없는 가격으로 비교해보고자 코인게코를 땡겨서 만들어봅니다.

## 특징

- 김프없는 원화가격을 볼 수 있고
- 달러도 지원해봅니다.
- 리액트로 뭐해볼까 심심해서 만들어봤어요.

## 프로젝트 구조

- public 폴더 : 기본 index.html 등이 위치함
- src
  - /component : 로딩, 탭, 토스트 관련 공통으로 사용하는 컴포넌트 모음
  - /utils : krw <--> usd 변경시 currency 값을 리턴해주는 CurrencyTxt.js(지원하는 언어가 많아지면 컴포넌트 내에서 3항식으로 어려움) / 상승, 하락을 리턴해주는 TrendCheck.js
  - Bookmark.js : 북마크 된 코인들만 보여줌
  - Home.js : 처음 시작되는 페이지
  - Details.js : 코인 자세히 보기 페이지

### `yarn start`

- 개발모드로 로컬환경에서 돌려볼 수 있어요.

### 그 외 사용된 라이브러리 및 package

- styled-component : 어느정도 화면을 구성하기 위해서 사용함
- react-helmet : 각 컴포넌트 별 <head> 태그 내 내용 조작을 쉽게해줌
- axios : fetch 보단 axios...

### 향후 계획
- Next.js 도입
- Redux 및 Redux-saga 도입으로 비동기처리 일임 및 useState 사용 최소화
- Atomic Design
