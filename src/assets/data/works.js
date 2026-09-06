// 상단 필터용 분류 — 프로젝트당 하나씩만 준다(겹치면 필터가 헷갈린다).
export const WORK_CATS = [
    { id: 'all', label: 'All' },
    { id: 'agent', label: 'LLM · Agent' },
    { id: 'model', label: 'Modeling & Forecasting' },
    { id: 'automation', label: 'Automation' },
    { id: 'engineering', label: 'Data Engineering' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'vision', label: 'Vision & NLP' },
]

// WORK 페이지 데이터 — 경력기술서의 프로젝트를 요약하지 않고 거의 그대로
// 담는다. 회사명은 Footprint와 같은 원칙으로 뺀다. 최신순.
// results/impl 문자열 안의 **...** 는 화면에서 강조(strong)로 렌더된다.
export const WORKS = [
    {
        id: 'text-to-sql-agent',
        cat: 'agent',
        period: '2026.01 — Present',
        status: { label: 'In Progress', cap: 'Architecture & prototype' },
        tag: 'LLM · Multi-Agent System',
        title: 'Text-to-SQL Agent from Legacy Query Traceback',
        spine: 'Text-to-SQL Agent · Legacy Traceback', // 책등에만 쓰는 짧은 제목
        brief: 'Selector–Generator–Refiner agents · Function Calling · Athena dry-run self-correction',
        results: [
            '비개발 직군의 데이터 추출 병목과 분석가별 비즈니스 로직 파편화를 해결하는 사내 에이전트를 **제안부터 아키텍처 설계·프로토타입 개발까지** 진행',
        ],
        impl: [
            '검증된 레거시 SQL 자산을 지식 소스로 쓰는 역추적 설계 — Vector DB·임베딩 없이 Function Calling 기반 명시적 파일 탐색으로 환각 차단, 저비용·투명한 추론 구조',
            'Selector(탐색)–Generator(CoT 기반 SQL 생성)–Refiner(검수) 3단계 멀티 에이전트 아키텍처 (DIN-SQL 방법론 참조)',
            'AWS Athena Dry-run 기반 자가 수정 루프로 SQL 정합성 검증, FinOps 비용 통제(워크그룹 스캔 제한·타임아웃·LIMIT 주입)를 아키텍처에 내장',
            'BIRD-SQL 벤치마크와 현업 검증 정답 SQL 기반 사내 Golden Dataset 50선의 투트랙 평가 체계 설계, 시각화·해석까지 수행하는 Analyst Agent 확장 로드맵 수립',
        ],
    },
    {
        id: 'parts-order-forecasting',
        cat: 'model',
        period: '2025.03 — 2025.08',
        metrics: [
            { num: '₩9.6B', cap: 'Annual savings identified' },
            { num: '−7%', cap: 'Forecast error (MAPE / RMSE)' },
        ],
        tag: 'Manufacturing · Demand Forecasting',
        title: 'Import Parts Order Forecasting Model',
        brief: 'ARIMA / Prophet vs XGBoost / LSTM · 5-year order, stock & logistics data',
        results: [
            '기존 수식 기반 산정 방식 대비 예측 오차(MAPE, RMSE) **약 7% 개선**',
            '테스트 데이터 검증 기준, **연 약 96억 원** 규모의 재고/기회 손실 개선 효과 확인 (모델 적용 시 기대 효과 추정)',
            '운영 자동화 및 예측 시스템 내재화 로드맵 수립',
        ],
        impl: [
            '기존 발주량 산정 수식 분석 및 현업 인터뷰를 통한 발주 비즈니스 프로세스 이해, 주요 영향 요인 도출',
            '과거 5년간 발주 이력·재고·판매·물류 데이터 수집, 이상치 제거·결측치 보완·정규화 등 클렌징 수행',
            '시계열 모델(ARIMA, Prophet)과 머신러닝/딥러닝 모델(XGBoost, LSTM) 실험 및 교차검증을 통한 최적 모델 선정',
            '짧은 시계열 데이터 보강을 위한 전처리 기법 적용',
            '부품별·시즌별 예측 정확도 차이 분석을 통한 보완점 도출',
        ],
    },
    {
        id: 'store-recommendation',
        cat: 'model',
        period: '2022.10 — 2025.03',
        metrics: [
            { num: '₩105M', cap: 'Revenue in 11 months' },
            { num: '−90%', cap: 'Analysis time & cloud cost' },
        ],
        tag: 'Retail · Recommendation System',
        title: 'Store-Level Purchase Recommendation Engine',
        brief: 'Store-similarity recommendation · PySpark on 100M+ daily records · Delta Lake',
        results: [
            '서비스 운영 11개월 매출 성과 분석 결과, 재발주 상품 포함 **총 1억 500만 원 매출** 달성 (운영 점포 A/B 테스트 결과, 추천 서비스 사용 점포 월 최대 3.9% 매출 향상)',
            '분석 시간 및 컴퓨팅 자원 소모 90% 이상 절감 — 일 배치 분석 약 30시간 → 1시간 내외, 클라우드 비용 일 약 93만 원 → 10만 원 미만',
            '유통기업 AI 혁신사례로 취재되어 10개 이상 언론사 기사 배포',
            'Databricks 2023 Data+AI World Korea 키노트 사례 발표 및 우수 Data-AI Executive 상 수상',
            '팀 최초로 전국 경영주 대상 AI 모델을 서비스화하여 매출과 직결시킨 사례',
        ],
        impl: [
            '전국 6,000개 이상 점포에서 매일 약 1억 건 이상 발생하는 발주·재고·판매 데이터 분석',
            '판매·발주·재고 데이터와 도메인 조건을 반영한 점포 간 유사도 분석 알고리즘 개발',
            '유사 점포 기반 발주 상품 판매량 예측 및 고판매 예상 상품 추천',
            '모델 검증 알고리즘 및 실제 점포 테스트를 통한 추천 시스템 검증',
            '데이터 테이블·포맷 최적화 (Parquet, Delta Table, small file problem 해결, 파티셔닝)',
            '기존 Python 알고리즘을 PySpark로 전환·최적화 (분산처리, 벡터화 연산 적용)',
        ],
    },
    {
        id: 'korail-demand',
        cat: 'model',
        period: '2019.07 — 2020.06',
        metrics: [
            { num: '+9%', cap: 'Accuracy vs statistical model' },
        ],
        tag: 'Transportation · Demand Forecasting',
        title: 'Train Demand & Vacancy Forecasting',
        brief: 'Deep learning vs legacy statistical model · daily automated pipeline',
        results: [
            '열차 수요·공석 예측 모델, 기존 통계 모델 대비 **정확도 9% 향상**',
        ],
        impl: [
            '열차 수요 대규모 실데이터 분석·전처리 및 기존 통계 예측 프로세스 분석',
            '개선된 수요 예측 딥러닝 모델 개발 및 통계 모델과의 성능 경합용 비교 검증 알고리즘 개발',
            '데이터 로드–전처리–훈련–예측–경합–결과 저장까지 일 단위 자동화 파이프라인 구축',
        ],
    },
    {
        id: 'showcard-inspection',
        cat: 'automation',
        period: '2026.01 — Present',
        metrics: [
            { num: '200h → 30m', cap: 'Monthly review time', long: true },
            { num: '₩0', cap: 'Operating cost' },
        ],
        tag: 'Retail · Computer Vision Automation',
        title: 'Automated Show-Card Inspection System',
        brief: 'MobileNetV3-Small embeddings · cosine-similarity matching · single-EXE deploy',
        results: [
            '전사 MD 팀이 매월 수천 장을 수작업 대조하던 검수(월 약 200시간)를 **팀당 30분 내 자동 검수**로 대체',
            '유료 Vision API(GPT·Claude Vision) 없이 오픈소스 경량 모델(MobileNetV3-Small) 로컬 실행으로 **운영 비용 0원**의 AI 이미지 검수 체계 구현',
            '담당자별로 상이하던 검수 기준을 표준화하고, 오표기 시 발생할 수 있는 손실 리스크를 사전 차단',
        ],
        impl: [
            'PDF 텍스트·이미지 추출, 상품코드/상품명 다단계 매칭(유사도 기반 오독 교정) 및 가격·쇼카드 번호 자동 대조',
            'CNN 이미지 임베딩과 코사인 유사도를 활용한 행사타입 배너·POP·상품/교차상품 이미지 자동 판정 로직 설계 및 판정 임계값 체계 수립',
            '엑셀 검수 리포트 자동 생성, 단일 EXE 배포로 비개발 부서도 즉시 사용 가능하도록 구현',
        ],
    },
    {
        id: 'promo-generator',
        cat: 'automation',
        period: '2026.01 — Present',
        metrics: [
            { num: '640 hrs', cap: 'Saved per month' },
            { num: '₩275M', cap: 'Annual savings (est.)' },
        ],
        tag: 'Retail · Workflow Automation',
        title: 'Batch Promotional Material Generator',
        brief: 'Excel-driven JPG/PPT rendering · dynamic badge & price layout · single-EXE deploy',
        results: [
            '전국 128개 팀(약 1,200명)이 수작업으로 제작하던 행사 홍보물(월 256~1,024시간)을 **엑셀 입력만으로 일괄 생성**하도록 자동화',
            '인건비 기준 연간 약 1.1억~4.4억 원 절감 추산, 담당자별 결과물 품질 편차 제거',
        ],
        impl: [
            '엑셀 상품 리스트 입력만으로 상품별 홍보물 이미지(JPG)와 PPT 합본을 수 분 내 일괄 생성',
            '상품명 자동 줄바꿈, 배지·가격 동적 렌더링, 교차상품 그룹 자동 인식·배치 알고리즘 개발',
            'Python 설치 불필요한 단일 EXE로 배포, 행사 유형별 레이아웃 확장 및 타 팀 전용 버전 고도화',
        ],
    },
    {
        id: 'snowflake-pipeline',
        cat: 'engineering',
        period: '2025.03 — 2025.08',
        tag: 'Data Engineering · ETL',
        title: 'Cloud Data Lake Pipeline',
        brief: 'AWS DMS · Glue · S3 → Snowflake · structured + unstructured integration',
        results: [
            '온프레미스 DB와 외부 시스템 데이터를 클라우드 데이터 레이크로 **안정적으로 이관**하는 파이프라인 구축',
        ],
        impl: [
            'AWS DMS, Glue, S3를 활용해 온프레미스 DB 및 외부 시스템 데이터를 Snowflake로 안정적으로 이관',
            'Snowflake 데이터 레이크 기반으로 대규모 원천 데이터를 저장하고 정형/비정형 데이터 통합 관리',
        ],
    },
    {
        id: 'data-platform-optimization',
        cat: 'engineering',
        period: '2022.12 — 2025.03',
        tag: 'Data Engineering · BI',
        title: 'Data Platform Optimization & BI',
        brief: 'Spark table & compute optimization · Power BI data mart',
        results: [
            '대규모 데이터 처리 아키텍처를 적용해 팀의 **데이터 테이블과 클라우드 컴퓨팅 자원을 최적화**',
        ],
        impl: [
            'Spark 등 대규모 데이터 처리 아키텍처 이해·적용, 데이터 테이블 및 클라우드 컴퓨팅 자원 최적화 관리',
            'Power BI 시각화를 위한 데이터 마트 구성, 현업 지원용 분석 결과 시각화·서비스화',
        ],
    },
    {
        id: 'crypto-prediction',
        cat: 'model',
        period: '2021.09 — 2022.03',
        metrics: [
            { num: '10,000+', cap: 'Assets analyzed' },
            { num: 'Patent', cap: 'Registered 2023.06' },
        ],
        tag: 'FinTech · Time-Series Prediction',
        title: 'Cryptocurrency Price & Volume Prediction',
        brief: 'Unsupervised clustering · price/volume prediction · platform integration',
        results: [
            '약 10,000개 암호화폐를 분석·군집화하고 가격·거래량 예측 모델을 플랫폼에 연동, **관련 특허 공동 발명자 등록** (2023.06)',
        ],
        impl: [
            '약 10,000개 암호화폐 데이터 수집·분석 및 군집화(Clustering) 비지도학습 수행',
            '가격·거래량 예측 AI 모델 개발 및 암호화폐 플랫폼 연동',
            '데이터 로드–전처리–예측 자동화 파이프라인 개발',
        ],
    },
    {
        id: 'sports-posture',
        cat: 'vision',
        period: '2019.10 — 2022.03',
        metrics: [
            { num: '2 Patents', cap: 'Registered 2021.10 · 2022.04', long: true },
        ],
        tag: 'Sports · Computer Vision',
        title: 'Sports Posture & Similarity Analysis',
        brief: 'Pose estimation · keypoint angle scenarios · swing speed/tempo · similarity scoring',
        results: [
            '자세 비교·교정과 운동 분석·시설 추천 서비스로 **특허 2건 공동 발명자 등록** (2021.10 / 2022.04)',
        ],
        impl: [
            'Pose Estimation 모델 환경 구축 및 Docker 이미지화 관리',
            '키포인트 탐지·좌표 추출·각도 계산 및 시나리오 설계, 스윙 스피드·템포 추출, 스윙 장면 검출, 유사도 계산',
            '모델 검증 웹 툴 제작·배포 및 딥러닝 모델 API 개발·배포',
        ],
    },
    {
        id: 'promotion-analytics',
        cat: 'analytics',
        period: '2026.01 — Present',
        metrics: [
            { num: '₩8B', cap: 'Annual P&L improvement proposed' },
        ],
        tag: 'Retail · Data Analysis',
        title: 'Promotion & Enterprise Profit Analytics',
        brief: 'Competitor promo structure analysis · KPI de-duplication · anomaly detection',
        results: [
            '경쟁사 행사 구조 분석 및 인사이트 도출로 **연 80억 원 규모의 손익 개선 방안**을 도출·제시, 제시 방안을 토대로 TF 팀이 구성되어 개선 진행',
        ],
        impl: [
            '행사 성과 평가지표 간 중복성을 통계적으로 검증하여 평가 체계를 단순화 개선',
            '신선강화점 대고객 행사의 재구매·신규유입·동반구매 행동 분석을 통한 행사 기획 및 점포 전략 수립 지원',
            '누진할인 행사의 구매 행동 패턴·이익 구조 분석 및 이상 거래 탐지를 통한 행사 설계 개선과 손익 관리 기여',
            '멤버십 식별 체계·결제수단, 고객 세그먼트(성별·연령·카드사) 등 전사 데이터 분석 및 정기 리포트 산출',
            '제휴 마케팅 타겟 고객 데이터 추출, 행사 매출 시뮬레이션 고도화, 반복적 데이터 추출 업무의 파이프라인 자동화',
        ],
    },
    {
        id: 'rag-chatbot',
        cat: 'agent',
        period: '2023.05 — 2025.03',
        tag: 'LLM · RAG / Text-to-SQL',
        title: 'Enterprise RAG & Text-to-SQL Chatbot',
        brief: 'Azure Cognitive Search · GPT API · prompt engineering · feedback-loop tuning',
        results: [
            '2023년 사내 데이터에 최적화된 RAG·Text-to-SQL 챗봇을 **조기 구축**하며 LLM의 강점과 한계를 실무로 체득',
        ],
        impl: [
            'MS Azure와 AWS 환경의 RAG 아키텍처를 비교 분석하고, 사내 데이터에 최적화된 챗봇 아키텍처 설계·구현',
            'Azure Cognitive Search를 활용해 다양한 사내 데이터 소스를 통합하고 정보 검색 시스템 구축',
            '프롬프트 엔지니어링 및 GPT API 통합을 통한 응답 정확도·관련성 최적화',
            '사용자 피드백과 상호작용 로그 분석 기반의 응답 품질·사용자 경험 지속 개선',
        ],
    },
    {
        id: 'retail-analytics',
        cat: 'analytics',
        period: '2022.07 — 2025.03',
        tag: 'Retail · Predictive Modeling',
        title: 'Store Analytics & Predictive Modeling',
        brief: 'Receipt-based demographics prediction · basket analysis · promo sales forecasting',
        results: [
            '전국 점포 데이터를 기반으로 **고객 예측·행사 효과 분석·매출 예측 모델**을 개발하고 현업 서비스로 연결',
        ],
        impl: [
            '영수증 데이터 기반 방문 고객 성별·연령 예측 모델링',
            '전국 점포별 재고량 변화·발주 패턴 분석 및 시뮬레이션',
            '카드 데이터 결합을 통한 점포별 고객 특성 분석 및 장바구니 분석',
            '행사 효과 분석, 행사 매출 예측 모델링 및 결과 서비스화',
        ],
    },
    {
        id: 'realestate-sentiment',
        cat: 'vision',
        period: '2020.06 — 2020.12',
        tag: 'NLP · Sentiment Analysis',
        title: 'Real Estate News Sentiment Model',
        brief: 'KoBERT / AB-ALBERT transfer learning · modular train–predict pipeline',
        results: [
            '부동산 뉴스 감정분석 학습 데이터를 직접 구축하고 **사전학습 모델 전이학습**으로 분류 모델 완성, AWS 이관',
        ],
        impl: [
            '부동산 뉴스 데이터 전처리 및 감정분석 학습 데이터 구축',
            'KoBERT, AB-ALBERT 사전학습 모델 커스텀·전이학습 및 전처리–학습–예측–검증 단위 모듈화',
            'AWS 이관 및 모델 매뉴얼 작성',
        ],
    },
    {
        id: 'early-projects',
        cat: 'vision',
        period: '2019.07 — 2021.08',
        tag: 'Early Projects · Applied Deep Learning',
        title: 'Recommendation, Detection & Edge Models',
        brief: 'Job-seeker recommender · mask detection · pictogram edge model · tourism recommender',
        results: [
            '웹 개발부터 모델 배포까지 **엔드투엔드로 완수한 초기 프로젝트들** — 추천·탐지·엣지 검출',
        ],
        impl: [
            '구직자·채용공고 관리 웹페이지 및 구직자 추천 딥러닝 모델 개발 — 웹 개발, AWS RDS 구축, 추천 모델 개발·배포 (2019.09~2019.11)',
            '마스크 인식 딥러닝 모델 개발 — 이미지 라벨링, 커스텀 훈련, 탐지 모델 API 배포 (2019.07~2020.06)',
            '픽토그램 보완 딥러닝 모델 개발 — Canny Edge Detector, DexiNed 모델 적용·비교 (2021.05~2021.08)',
            '중국인 관광객 대상 관광지 추천 딥러닝 모델 개발 — 설문 데이터 분석, 추천 모델 API 배포 (2019.08~2019.09)',
        ],
    },
]

export function findWork(id) {
    return WORKS.find((w) => w.id === id)
}
