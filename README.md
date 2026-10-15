# 해피너스 아기이름

사주(4주·오행 분포) + 소리오행 + 수리(획수) + 요즘 느낌을 조합해 아기 이름을 추천하는 앱.
React + Vite + TypeScript, 스토어 배포는 Capacitor 사용. 수익 모델은 **무료 + 보상형 광고**.

## 실행
```bash
npm install
npm run dev      # 개발 서버
npm test         # 엔진 테스트 (만세력/소리오행/추천)
npm run build    # dist/ 생성
```

## 구조
- `src/engine/saju.ts` 만세력(외부 라이브러리 없음): 태양 황경 기준 절기로 연·월주, 율리우스 일수로 일주, 2시간 단위 시주
- `src/engine/balance.ts` 오행 분포·부족 오행 (단순화된 방식, 전통 '용신' 아님)
- `src/engine/sound.ts` 소리오행(초성 기준) 상생/상극 흐름
- `src/engine/suri.ts` 원형이정 4격 수리 (길/흉 2단계 단순화)
- `src/engine/trend.ts` 요즘 느낌 점수, `data.ts` 성씨·한자·순우리말 이름 샘플
- `src/lib/credits.ts` 무료 3회 → 이벤트 +2회(총 5회) → 광고 시청 시 +1회(하루 상한), `config.ts`에서 조정
- `src/lib/ads.ts` 광고 추상화 (현재 mock)

## 출시 전 반드시 할 일
1. **한자 데이터 검증/확장**: `data.ts`의 획수(원획)·자원오행은 샘플이며 검증되지 않았음. 대법원 인명용 한자표와 대조 후 교체
2. **이름 유행 데이터 교체**: `trend.ts`의 POPULAR/MODERN은 공식 통계가 아닌 샘플. 공식 연도별 이름 순위로 교체
3. **81수리 길흉 세분화**: 참고 문헌과 대조
4. **광고 연동 (AdMob)**
   - `npm i @capacitor-community/admob` 후 `ads.ts`의 admob 분기 구현, `config.ts`의 `adMode`를 `'admob'`으로 변경
   - 개인정보 동의(UMP), iOS ATT 문구 설정 필요. 아동 대상 앱이 아님을 스토어 설정에서 명시
   - 광고 시청 횟수는 현재 기기 로컬 저장이라 우회 가능 (광고 수익 모델에서는 감수 가능한 수준)
5. **스토어 등록**
   ```bash
   npm i @capacitor/android @capacitor/ios
   npm run build && npx cap add android && npx cap add ios && npx cap sync
   ```
   iOS 빌드는 Mac/Xcode 필요. 개인정보처리방침 URL, 앱 아이콘/스플래시, 스토어 스크린샷 준비
6. 앱 설명에 "전통 문화 콘텐츠이며 과학적 근거 없음, 오락/참고용" 명시 (앱 내 면책 문구 포함됨)

## 알려진 한계
- 시각은 KST 기준이며 진태양시(약 -30분) 보정을 하지 않음. 23시대는 당일 일주 기준(야자시 설)
- 절기 시각은 천문 근사식으로 계산해 경계 시각 ±15분 오차 가능
