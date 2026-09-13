// 프로젝트별 도식 — 이미지 파일 없이 SVG로 그린다. 클래스(.ln/.bx/.tx/.flow 등)는
// global.css의 WORK 도식 스타일을 쓴다.
export const WORK_VIZ = {
    // 서비스 흐름 — 채팅 화면. 왼쪽 USER, 오른쪽 AI. 꼬리는 작게 그리면
    // 지저분해서 없애고 아바타 위치로 화자를 구분한다. AI 말풍선은 "..."에서
    // 같은 자리(위 y=126, 오른쪽 끝 x=560)로 SQL까지 자란다. 12초 루프.
    // 세로 배치: 위아래 여백 40, 메시지 간격 26으로 균등.
    'text-to-sql-agent-service': (
        <svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid meet">
            <defs>
                <clipPath id="c-q" clipPathUnits="userSpaceOnUse">
                    <rect className="type-q" x="98" y="0" width="270" height="400" />
                </clipPath>
                <clipPath id="c-sql" clipPathUnits="userSpaceOnUse">
                    <rect className="type-sql" x="182" y="0" width="380" height="400" />
                </clipPath>
            </defs>

            {/* 1. USER 질문 — y 40~86 */}
            <g className="ch ch-user">
                <circle className="av av-u" cx="52" cy="63" r="17" />
                <text className="tx-av" x="52" y="63" textAnchor="middle" dominantBaseline="central">USER</text>
                <rect className="bub bub-u" x="82" y="40" width="286" height="46" rx="6" />
                <g clipPath="url(#c-q)">
                    <text className="tx-q" x="98" y="63" dominantBaseline="central">지난달 매출 상위 10개 점포는?</text>
                </g>
            </g>

            {/* 2~3. AI — "..."에서 SQL로 자라는 하나의 말풍선. y 112~196 */}
            <g className="ch ch-ai1">
                <circle className="av av-a" cx="588" cy="129" r="17" />
                <text className="tx-av tx-av-g" x="588" y="129" textAnchor="middle" dominantBaseline="central">AI</text>
            </g>
            <g className="ch ch-think">
                <rect className="bub bub-a" x="486" y="112" width="74" height="34" rx="6" />
                <circle className="think" cx="505" cy="129" r="3" />
                <circle className="think" cx="523" cy="129" r="3" style={{ animationDelay: '.15s' }} />
                <circle className="think" cx="541" cy="129" r="3" style={{ animationDelay: '.3s' }} />
            </g>
            <g className="ch ch-sql">
                <rect className="bub bub-a" x="166" y="112" width="394" height="84" rx="6" />
                <g clipPath="url(#c-sql)">
                    <text className="tx-sql" x="182" y="138">SELECT store_id, SUM(amount) AS sales</text>
                    <text className="tx-sql" x="182" y="158">FROM orders WHERE month = &apos;2026-08&apos;</text>
                    <text className="tx-sql" x="182" y="178">GROUP BY store_id ORDER BY sales DESC LIMIT 10</text>
                </g>
            </g>

            {/* 4. AI 답변 + 차트 — y 222~360 */}
            <g className="ch ch-ans">
                <circle className="av av-a" cx="588" cy="239" r="17" />
                <text className="tx-av tx-av-g" x="588" y="239" textAnchor="middle" dominantBaseline="central">AI</text>
                <rect className="bub bub-a" x="228" y="222" width="332" height="138" rx="6" />
                <text className="tx-a" x="248" y="252" dominantBaseline="central">지난달 매출 1위는 <tspan className="tx-a-hi">강남점(₩142M)</tspan> 입니다.</text>
                <g className="bars">
                    <rect x="248" y="292" width="38" height="44" fill="rgba(201,160,99,.8)" />
                    <rect x="294" y="303" width="38" height="33" fill="rgba(232,226,214,.24)" />
                    <rect x="340" y="311" width="38" height="25" fill="rgba(232,226,214,.19)" />
                    <rect x="386" y="317" width="38" height="19" fill="rgba(232,226,214,.15)" />
                    <rect x="432" y="321" width="38" height="15" fill="rgba(232,226,214,.12)" />
                    <text className="tx" x="486" y="332">top 10</text>
                </g>
            </g>
        </svg>
    ),
    // 카드 실제 비율(16:10)에 맞춘 viewBox 640x400. 상자 3개를 좌우 여백 42px로
    // 균등 배치하고(42·236·430, 폭 168), 질문은 위에서 내려와 Selector 위의 점을
    // 정확히 가리킨다 — 라벨·화살표·점·상자 중심이 모두 x=126에 정렬된다.
    'text-to-sql-agent': (
        <svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid meet">
            <defs>
                <marker id="ar" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M0 1 L7 4 L0 7 z" fill="#C9A063" />
                </marker>
            </defs>

            <text className="tx" x="126" y="80" textAnchor="middle">question</text>
            <path className="ln-m" d="M126 90 V124" markerEnd="url(#ar)" />

            <rect className="bx" x="42" y="150" width="168" height="76" rx="2" />
            <rect className="bx" x="236" y="150" width="168" height="76" rx="2" />
            <rect className="bx" x="430" y="150" width="168" height="76" rx="2" />

            <text className="tx tx-g" x="126" y="182" textAnchor="middle">Selector</text>
            <text className="tx" x="126" y="204" textAnchor="middle">find legacy sql</text>
            <text className="tx tx-g" x="320" y="182" textAnchor="middle">Generator</text>
            <text className="tx" x="320" y="204" textAnchor="middle">cot draft</text>
            <text className="tx tx-g" x="514" y="182" textAnchor="middle">Refiner</text>
            <text className="tx" x="514" y="204" textAnchor="middle">athena dry-run</text>

            <path className="ln flow" d="M214 188 H228" markerEnd="url(#ar)" />
            <path className="ln flow" d="M408 188 H422" markerEnd="url(#ar)" style={{ animationDelay: '.5s' }} />

            <circle className="dot pulse" cx="126" cy="134" r="3.5" />
            <circle className="dot pulse" cx="320" cy="134" r="3.5" style={{ animationDelay: '.5s' }} />
            <circle className="dot pulse" cx="514" cy="134" r="3.5" style={{ animationDelay: '1s' }} />

            <path className="ln-d" d="M514 226 V284 H320 V232" markerEnd="url(#ar)" />
            <text className="tx" x="417" y="306" textAnchor="middle">self-correction loop</text>
        </svg>
    ),
    // 쇼카드 자동 검수 · 검수 화면 — 실제 쇼카드처럼 생긴 카드를 놓고 오른쪽에서
    // 항목이 차례로 대조된다. 통과는 무채색으로 조용히 지나가고, 가격 한 줄이
    // 불일치로 걸리는 순간만 골드다(오표기 손실 차단이 이 도구의 존재 이유). 10초 루프.
    'showcard-inspection-service': (
        <svg viewBox="0 17 640 400" preserveAspectRatio="xMidYMid meet">
            <text className="tx tx-g" x="40" y="84">show-card check</text>
            <text className="tx" x="40" y="108">thousands of cards every month</text>

            {/* ── 왼쪽: 쇼카드 한 장 ── */}
            <g className="sk-card">
                <rect className="sk-sheet" x="40" y="132" width="236" height="180" rx="3" />
                <rect className="sk-badge" x="62" y="154" width="62" height="26" rx="2" />
                <text className="tx tx-g" x="93" y="167" textAnchor="middle" dominantBaseline="central">1+1</text>
                <text className="tx-item" x="62" y="210">Black Bull 250ml</text>
                <text className="tx-num" x="62" y="242">₩2,400</text>
                {/* 상품 이미지 자리 — 일반적인 산 모양 플레이스홀더 대신 음료 캔을
                    그려서 어떤 상품의 쇼카드인지가 그림에서도 읽히게 한다 */}
                <g className="sk-can">
                    <rect className="sk-can-body" x="196" y="196" width="38" height="58" rx="7" />
                    <ellipse className="sk-can-top" cx="215" cy="196" rx="19" ry="5" />
                    <rect className="sk-can-band" x="196" y="216" width="38" height="15" />
                    <line className="sk-can-tab" x1="210" y1="194" x2="220" y2="194" />
                </g>
                <text className="tx" x="62" y="296">sc-1042</text>
            </g>

            {/* ── 오른쪽: 항목별 대조 결과 ── */}
            <g className="sk-row">
                <text className="tx" x="320" y="164" dominantBaseline="central">promo type</text>
                <text className="tx" x="604" y="164" textAnchor="end" dominantBaseline="central">ok</text>
            </g>
            <g className="sk-row" style={{ animationDelay: '0.35s' }}>
                <text className="tx" x="320" y="196" dominantBaseline="central">product name</text>
                <text className="tx" x="604" y="196" textAnchor="end" dominantBaseline="central">ok</text>
            </g>
            <g className="sk-row sk-flagrow" style={{ animationDelay: '0.7s' }}>
                <text className="tx sk-flag" x="320" y="228" dominantBaseline="central">price</text>
                <text className="tx sk-flag" x="604" y="228" textAnchor="end" dominantBaseline="central">mismatch</text>
                <line className="sk-flagline" x1="320" y1="242" x2="604" y2="242" />
            </g>
            <g className="sk-row" style={{ animationDelay: '1.05s' }}>
                <text className="tx" x="320" y="260" dominantBaseline="central">image</text>
                <text className="tx" x="604" y="260" textAnchor="end" dominantBaseline="central">ok</text>
            </g>
            <g className="sk-row" style={{ animationDelay: '1.4s' }}>
                <text className="tx" x="320" y="292" dominantBaseline="central">card no.</text>
                <text className="tx" x="604" y="292" textAnchor="end" dominantBaseline="central">ok</text>
            </g>

            <text className="tx-sum sk-sum" x="40" y="356">200 h a month → <tspan className="tx-hi">30 min</tspan> per team</text>
        </svg>
    ),
    // 쇼카드 자동 검수 · 판정 구조 — 한 장의 PDF가 텍스트 갈래와 이미지 갈래로
    // 갈라져 각자 대조된 뒤 다시 합쳐져 판정이 나온다. 유료 Vision API 없이
    // 직접 운영하는 게 요지(AI 추론 비용 0원). 전달 수단은 EXE에서 Streamlit
    // 웹 서비스로 옮겨갔고, 그 전환을 상자 안에 화살표로 남겼다. 10초 루프.
    'showcard-inspection': (
        <svg viewBox="0 9 640 400" preserveAspectRatio="xMidYMid meet">
            <text className="tx tx-g" x="40" y="84">two tracks</text>

            <g className="sc-stage">
                <rect className="sc-box" x="40" y="176" width="124" height="60" rx="2" />
                <text className="tx sc-ttl" x="102" y="206" textAnchor="middle" dominantBaseline="central">show-card pdf</text>
            </g>

            <g className="sc-stage" style={{ animationDelay: '0.4s' }}>
                <rect className="sc-box" x="204" y="124" width="196" height="80" rx="2" />
                <text className="tx sc-ttl" x="302" y="146" textAnchor="middle" dominantBaseline="central">text track</text>
                <text className="tx" x="302" y="170" textAnchor="middle" dominantBaseline="central">multi-step match</text>
                <text className="tx" x="302" y="188" textAnchor="middle" dominantBaseline="central">misread correction</text>
            </g>
            <g className="sc-stage" style={{ animationDelay: '0.7s' }}>
                <rect className="sc-box" x="204" y="212" width="196" height="80" rx="2" />
                <text className="tx sc-ttl" x="302" y="234" textAnchor="middle" dominantBaseline="central">image track</text>
                <text className="tx" x="302" y="258" textAnchor="middle" dominantBaseline="central">mobilenetv3-small</text>
                <text className="tx" x="302" y="276" textAnchor="middle" dominantBaseline="central">cosine + threshold</text>
            </g>

            <g className="sc-stage" style={{ animationDelay: '1.1s' }}>
                <rect className="sc-box is-out" x="440" y="152" width="164" height="116" rx="2" />
                <text className="tx tx-g" x="522" y="174" textAnchor="middle" dominantBaseline="central">decision</text>
                <text className="tx" x="522" y="202" textAnchor="middle" dominantBaseline="central">excel report</text>
                <text className="tx" x="522" y="222" textAnchor="middle" dominantBaseline="central">exe → streamlit</text>
                <text className="tx" x="522" y="242" textAnchor="middle" dominantBaseline="central">on aws ec2</text>
            </g>

            <path className="sc-flow" d="M164 206 H184 V164 H204" />
            <path className="sc-flow" d="M164 206 H184 V252 H204" style={{ animationDelay: '0.3s' }} />
            <path className="sc-flow" d="M400 164 H420 V206 H440" style={{ animationDelay: '0.7s' }} />
            <path className="sc-flow" d="M400 252 H420 V206 H440" style={{ animationDelay: '0.9s' }} />

            <text className="tx-sum sc-sum" x="40" y="336"><tspan className="tx-hi">₩0</tspan> inference cost — no paid vision api</text>
        </svg>
    ),
    // 판촉물 일괄 생성 · 생성 화면 — 엑셀 한 장이 들어가고 판촉물 썸네일이 하나씩
    // 차례로 채워진다. 썸네일은 글자를 넣기엔 작아서 배지·이미지 자리·상품명 줄·
    // 가격 줄을 막대로 처리했다. 골드 배지가 있어 판촉물로 읽힌다. 10초 루프.
    'promo-generator-service': (
        <svg viewBox="0 17 640 400" preserveAspectRatio="xMidYMid meet">
            <text className="tx tx-g" x="40" y="84">batch generate</text>
            <text className="tx" x="40" y="108">one sheet in, hundreds of posters out</text>

            {/* ── 왼쪽: 엑셀 한 장 ── */}
            <g className="pg-excel">
                <rect className="pg-sheet" x="40" y="140" width="224" height="170" rx="2" />
                <rect className="pg-head" x="40" y="140" width="224" height="28" />
                <text className="tx pg-ttl" x="58" y="154" dominantBaseline="central">code</text>
                <text className="tx pg-ttl" x="112" y="154" dominantBaseline="central">name</text>
                <text className="tx pg-ttl" x="246" y="154" textAnchor="end" dominantBaseline="central">price</text>
            </g>
            <g className="pg-sheetrow" style={{ animationDelay: '0.00s' }}>
                <text className="tx" x="58" y="190" dominantBaseline="central">a102</text>
                <text className="tx" x="112" y="190" dominantBaseline="central">black bull</text>
                <text className="tx" x="246" y="190" textAnchor="end" dominantBaseline="central">2,400</text>
            </g>
            <g className="pg-sheetrow" style={{ animationDelay: '0.12s' }}>
                <text className="tx" x="58" y="218" dominantBaseline="central">b233</text>
                <text className="tx" x="112" y="218" dominantBaseline="central">spicy tuna</text>
                <text className="tx" x="246" y="218" textAnchor="end" dominantBaseline="central">1,800</text>
            </g>
            <g className="pg-sheetrow" style={{ animationDelay: '0.24s' }}>
                <text className="tx" x="58" y="246" dominantBaseline="central">c104</text>
                <text className="tx" x="112" y="246" dominantBaseline="central">jjamppong</text>
                <text className="tx" x="246" y="246" textAnchor="end" dominantBaseline="central">3,900</text>
            </g>
            <g className="pg-sheetrow" style={{ animationDelay: '0.36s' }}>
                <text className="tx" x="58" y="274" dominantBaseline="central">d517</text>
                <text className="tx" x="112" y="274" dominantBaseline="central">hydrofit</text>
                <text className="tx" x="246" y="274" textAnchor="end" dominantBaseline="central">1,500</text>
            </g>

            <path className="pg-flow" d="M274 224 H300" />
            <path className="pg-head-mk" d="M302 218 L316 224 L302 230 Z" />

            {/* ── 오른쪽: 생성된 판촉물 ── */}
            <g className="pg-poster">
                <rect className="pg-sheet" x="316" y="150" width="60" height="76" rx="2" />
                <rect className="pg-badge" x="323" y="157" width="24" height="10" rx="1" />
                <rect className="pg-photo" x="323" y="172" width="46" height="26" rx="1" />
                <rect className="pg-line" x="323" y="204" width="34" height="3.5" rx="1.5" />
                <rect className="pg-price" x="323" y="212" width="22" height="5" rx="1.5" />
            </g>
            <g className="pg-poster" style={{ animationDelay: '0.22s' }}>
                <rect className="pg-sheet" x="392" y="150" width="60" height="76" rx="2" />
                <rect className="pg-badge" x="399" y="157" width="24" height="10" rx="1" />
                <rect className="pg-photo" x="399" y="172" width="46" height="26" rx="1" />
                <rect className="pg-line" x="399" y="204" width="34" height="3.5" rx="1.5" />
                <rect className="pg-price" x="399" y="212" width="22" height="5" rx="1.5" />
            </g>
            <g className="pg-poster" style={{ animationDelay: '0.44s' }}>
                <rect className="pg-sheet" x="468" y="150" width="60" height="76" rx="2" />
                <rect className="pg-badge" x="475" y="157" width="24" height="10" rx="1" />
                <rect className="pg-photo" x="475" y="172" width="46" height="26" rx="1" />
                <rect className="pg-line" x="475" y="204" width="34" height="3.5" rx="1.5" />
                <rect className="pg-price" x="475" y="212" width="22" height="5" rx="1.5" />
            </g>
            <g className="pg-poster" style={{ animationDelay: '0.66s' }}>
                <rect className="pg-sheet" x="544" y="150" width="60" height="76" rx="2" />
                <rect className="pg-badge" x="551" y="157" width="24" height="10" rx="1" />
                <rect className="pg-photo" x="551" y="172" width="46" height="26" rx="1" />
                <rect className="pg-line" x="551" y="204" width="34" height="3.5" rx="1.5" />
                <rect className="pg-price" x="551" y="212" width="22" height="5" rx="1.5" />
            </g>
            <g className="pg-poster" style={{ animationDelay: '0.88s' }}>
                <rect className="pg-sheet" x="316" y="244" width="60" height="76" rx="2" />
                <rect className="pg-badge" x="323" y="251" width="24" height="10" rx="1" />
                <rect className="pg-photo" x="323" y="266" width="46" height="26" rx="1" />
                <rect className="pg-line" x="323" y="298" width="34" height="3.5" rx="1.5" />
                <rect className="pg-price" x="323" y="306" width="22" height="5" rx="1.5" />
            </g>
            <g className="pg-poster" style={{ animationDelay: '1.10s' }}>
                <rect className="pg-sheet" x="392" y="244" width="60" height="76" rx="2" />
                <rect className="pg-badge" x="399" y="251" width="24" height="10" rx="1" />
                <rect className="pg-photo" x="399" y="266" width="46" height="26" rx="1" />
                <rect className="pg-line" x="399" y="298" width="34" height="3.5" rx="1.5" />
                <rect className="pg-price" x="399" y="306" width="22" height="5" rx="1.5" />
            </g>
            <g className="pg-poster" style={{ animationDelay: '1.32s' }}>
                <rect className="pg-sheet" x="468" y="244" width="60" height="76" rx="2" />
                <rect className="pg-badge" x="475" y="251" width="24" height="10" rx="1" />
                <rect className="pg-photo" x="475" y="266" width="46" height="26" rx="1" />
                <rect className="pg-line" x="475" y="298" width="34" height="3.5" rx="1.5" />
                <rect className="pg-price" x="475" y="306" width="22" height="5" rx="1.5" />
            </g>
            <g className="pg-poster" style={{ animationDelay: '1.54s' }}>
                <rect className="pg-sheet" x="544" y="244" width="60" height="76" rx="2" />
                <rect className="pg-badge" x="551" y="251" width="24" height="10" rx="1" />
                <rect className="pg-photo" x="551" y="266" width="46" height="26" rx="1" />
                <rect className="pg-line" x="551" y="298" width="34" height="3.5" rx="1.5" />
                <rect className="pg-price" x="551" y="306" width="22" height="5" rx="1.5" />
            </g>

            <text className="tx-sum pg-sum" x="40" y="352">256–1,024 h a month → <tspan className="tx-hi">minutes</tspan></text>
        </svg>
    ),
    // 판촉물 일괄 생성 · 레이아웃 엔진 — 판촉물 한 장을 크게 그려놓고 왼쪽에서
    // 지시선으로 각 부분을 짚는 주석 설계도 형태. 경력기술서의 "상품명 자동 줄바꿈,
    // 배지·가격 동적 렌더링, 교차상품 그룹 자동 인식·배치"가 지시선 넷에 대응한다.
    'promo-generator': (
        <svg viewBox="-21 27 640 400" preserveAspectRatio="xMidYMid meet">
            <text className="tx tx-g" x="40" y="84">layout engine</text>

            {/* ── 오른쪽: 판촉물 한 장 ── */}
            <g className="le-poster">
                <rect className="pg-sheet" x="360" y="126" width="200" height="210" rx="3" />
                <rect className="pg-badge" x="384" y="148" width="58" height="24" rx="2" />
                <text className="tx tx-g" x="413" y="160" textAnchor="middle" dominantBaseline="central">1+1</text>
                <text className="tx-item" x="384" y="204">Spicy Tuna</text>
                <text className="tx-item" x="384" y="222">Roll 2-pack</text>
                <text className="tx-num" x="384" y="258">₩3,900</text>
                <rect className="pg-photo" x="384" y="276" width="44" height="40" rx="2" />
                <rect className="pg-photo" x="436" y="276" width="44" height="40" rx="2" />
            </g>

            {/* ── 왼쪽: 지시선과 주석 ── */}
            <g className="le-call">
                <text className="tx" x="300" y="160" textAnchor="end" dominantBaseline="central">dynamic badge</text>
                <path className="le-lead" d="M308 160 H360" />
                <circle className="le-pin" cx="360" cy="160" r="2.5" />
            </g>
            <g className="le-call" style={{ animationDelay: '0.3s' }}>
                <text className="tx" x="300" y="212" textAnchor="end" dominantBaseline="central">auto line-break</text>
                <path className="le-lead" d="M308 212 H360" />
                <circle className="le-pin" cx="360" cy="212" r="2.5" />
            </g>
            <g className="le-call" style={{ animationDelay: '0.6s' }}>
                <text className="tx" x="300" y="253" textAnchor="end" dominantBaseline="central">price rendering</text>
                <path className="le-lead" d="M308 253 H360" />
                <circle className="le-pin" cx="360" cy="253" r="2.5" />
            </g>
            <g className="le-call" style={{ animationDelay: '0.9s' }}>
                <text className="tx" x="300" y="296" textAnchor="end" dominantBaseline="central">cross-product grouping</text>
                <path className="le-lead" d="M308 296 H360" />
                <circle className="le-pin" cx="360" cy="296" r="2.5" />
            </g>

            <text className="tx-sum le-sum" x="40" y="368">jpg per product · ppt deck · <tspan className="tx-hi">now a web app</tspan></text>
        </svg>
    ),
    // 행사·손익 분석 · 누진할인 이익 구조 — 할인 단계가 올라갈수록 매출은 계속
    // 오르는데 이익은 4단계에서 꺾인다. 그 변곡점이 이 분석의 결론이고, 위에
    // 이상 거래가 점으로 튄다. 매출·이익 둘 다 금액이라 한 축에 같이 둔다. 10초 루프.
    'promotion-analytics-service': (
        <svg viewBox="0 23 640 400" preserveAspectRatio="xMidYMid meet">
            <text className="tx tx-g" x="40" y="84">progressive discount</text>
            <text className="tx" x="40" y="108">where a deeper discount stops paying</text>

            <g className="g" strokeWidth="1">
                <line x1="80" y1="170" x2="604" y2="170" />
                <line x1="80" y1="220" x2="604" y2="220" />
                <line x1="80" y1="270" x2="604" y2="270" />
            </g>
            <line className="axis" x1="80" y1="320" x2="604" y2="320" />

            <g className="pa-series">
                <polyline className="ln-m pa-rev" points="110 292 204 264 298 234 392 210 486 192 580 178" />
                <polyline className="ln pa-pro" points="110 298 204 276 298 252 392 238 486 254 580 286" />
            </g>

            {/* 이익이 꺾이는 지점 */}
            <g className="pa-peak">
                <line className="split" x1="392" y1="150" x2="392" y2="320" />
                <circle className="dot" cx="392" cy="238" r="4.5" />
                <text className="tx tx-g" x="404" y="164" dominantBaseline="central">profit peaks here</text>
            </g>

            {/* 이상 거래 */}
            <g className="pa-out">
                <circle className="pa-outlier" cx="298" cy="196" r="4" />
                <circle className="pa-outlier" cx="486" cy="152" r="4" />
                <text className="tx" x="486" y="136" textAnchor="middle">flagged</text>
            </g>

            <g className="pa-axis">
                <text className="tx" x="110" y="340" textAnchor="middle">tier 1</text>
                <text className="tx" x="204" y="340" textAnchor="middle">tier 2</text>
                <text className="tx" x="298" y="340" textAnchor="middle">tier 3</text>
                <text className="tx" x="392" y="340" textAnchor="middle">tier 4</text>
                <text className="tx" x="486" y="340" textAnchor="middle">tier 5</text>
                <text className="tx" x="580" y="340" textAnchor="middle">tier 6</text>
            </g>

            <g className="pa-leg">
                <line className="ln-m" x1="80" y1="366" x2="104" y2="366" />
                <text className="tx" x="112" y="366" dominantBaseline="central">revenue</text>
                <line className="ln" x1="212" y1="366" x2="236" y2="366" />
                <text className="tx tx-g" x="244" y="366" dominantBaseline="central">profit</text>
                <circle className="pa-outlier" cx="330" cy="366" r="4" />
                <text className="tx" x="344" y="366" dominantBaseline="central">anomaly</text>
            </g>
        </svg>
    ),
    // 행사·손익 분석 · 분석이 결정으로 간 경로 — 아키텍처가 없는 분석 과제라
    // 구조도 대신 질문–분석–바뀐 것 세 갈래를 보드로 그린다. 맨 윗줄이 80억 제안과
    // TF 구성으로 끝나서, 나열이 아니라 인과로 읽힌다. 10초 루프.
    'promotion-analytics': (
        <svg viewBox="0 27 640 400" preserveAspectRatio="xMidYMid meet">
            <text className="tx tx-g" x="40" y="84">analysis to decision</text>

            <g className="pd-head">
                <text className="tx pd-ttl" x="48" y="124">question</text>
                <text className="tx pd-ttl" x="252" y="124">analysis</text>
                <text className="tx pd-ttl" x="426" y="124">what changed</text>
                <line className="g" x1="40" y1="136" x2="604" y2="136" strokeWidth="1" />
            </g>

            <g className="pd-row" style={{ animationDelay: '0.00s' }}>
                <text className="tx" x="48" y="160" dominantBaseline="central">why does this promo</text>
                <text className="tx" x="48" y="180" dominantBaseline="central">lose margin?</text>
                <path className="pd-arrow" d="M232 170 H246 M242 167 l4 3 l-4 3" />
                <text className="tx" x="252" y="160" dominantBaseline="central">purchase behaviour</text>
                <text className="tx" x="252" y="180" dominantBaseline="central">profit structure</text>
                <path className="pd-arrow" d="M406 170 H420 M416 167 l4 3 l-4 3" />
                <text className="tx tx-g" x="426" y="160" dominantBaseline="central">₩8b proposal</text>
                <text className="tx tx-g" x="426" y="180" dominantBaseline="central">task force formed</text>
            </g>
            <g className="pd-row" style={{ animationDelay: '0.30s' }}>
                <text className="tx" x="48" y="236" dominantBaseline="central">are these kpis</text>
                <text className="tx" x="48" y="256" dominantBaseline="central">measuring the same?</text>
                <path className="pd-arrow" d="M232 246 H246 M242 243 l4 3 l-4 3" />
                <text className="tx" x="252" y="246" dominantBaseline="central">correlation testing</text>
                <path className="pd-arrow" d="M406 246 H420 M416 243 l4 3 l-4 3" />
                <text className="tx pd-out" x="426" y="236" dominantBaseline="central">evaluation system</text>
                <text className="tx pd-out" x="426" y="256" dominantBaseline="central">simplified</text>
            </g>
            <g className="pd-row" style={{ animationDelay: '0.60s' }}>
                <text className="tx" x="48" y="322" dominantBaseline="central">who should we target?</text>
                <path className="pd-arrow" d="M232 322 H246 M242 319 l4 3 l-4 3" />
                <text className="tx" x="252" y="312" dominantBaseline="central">segments · card</text>
                <text className="tx" x="252" y="332" dominantBaseline="central">age · gender</text>
                <path className="pd-arrow" d="M406 322 H420 M416 319 l4 3 l-4 3" />
                <text className="tx pd-out" x="426" y="312" dominantBaseline="central">partner marketing</text>
                <text className="tx pd-out" x="426" y="332" dominantBaseline="central">target lists</text>
            </g>

            <text className="tx pd-note" x="40" y="376">recurring extracts automated into a pipeline</text>
        </svg>
    ),
    // 부품 발주예측 · 모델 선정 — 5년치 원천 4종이 전처리를 거쳐 통계 2종과
    // ML/DL 2종에 동시에 들어가고, 교차검증 오차가 가장 낮은 SARIMA가 선택된다.
    // 짧은 계절형 시계열이라 딥러닝보다 고전 통계 모델이 이겼다는 게 요지. 10초 루프.
    'parts-order-forecasting': (
        <svg viewBox="0 12 640 400" preserveAspectRatio="xMidYMid meet">
            <text className="tx tx-g" x="40" y="84">model selection</text>
            <text className="tx" x="40" y="110">5 years of order · stock · sales · logistics</text>

            {/* ── 원천 4종 ── */}
            <g className="pb-src">
                <rect className="pb-box" x="40" y="146" width="124" height="28" rx="2" />
                <text className="tx" x="102" y="160" textAnchor="middle" dominantBaseline="central">order history</text>
            </g>
            <g className="pb-src" style={{ animationDelay: '0.12s' }}>
                <rect className="pb-box" x="40" y="182" width="124" height="28" rx="2" />
                <text className="tx" x="102" y="196" textAnchor="middle" dominantBaseline="central">stock</text>
            </g>
            <g className="pb-src" style={{ animationDelay: '0.24s' }}>
                <rect className="pb-box" x="40" y="218" width="124" height="28" rx="2" />
                <text className="tx" x="102" y="232" textAnchor="middle" dominantBaseline="central">sales</text>
            </g>
            <g className="pb-src" style={{ animationDelay: '0.36s' }}>
                <rect className="pb-box" x="40" y="254" width="124" height="28" rx="2" />
                <text className="tx" x="102" y="268" textAnchor="middle" dominantBaseline="central">logistics</text>
            </g>

            {/* 원천 → 전처리 */}
            <path className="pb-flow" d="M164 160 H186 V268 M164 196 H186 M164 232 H186 M164 268 H186 M186 214 H200" />

            {/* ── 전처리 ── */}
            <g className="pb-pre">
                <rect className="pb-box" x="200" y="146" width="120" height="136" rx="2" />
                <text className="tx tx-g" x="260" y="172" textAnchor="middle" dominantBaseline="central">preprocessing</text>
                {/* 한 단어씩 — 두 단어로 붙이면 글자 폭이 박스(120)를 꽉 채워 테두리에 닿는다 */}
                <text className="tx" x="260" y="202" textAnchor="middle" dominantBaseline="central">outliers</text>
                <text className="tx" x="260" y="222" textAnchor="middle" dominantBaseline="central">missing</text>
                <text className="tx" x="260" y="242" textAnchor="middle" dominantBaseline="central">normalize</text>
                <text className="tx" x="260" y="262" textAnchor="middle" dominantBaseline="central">augment</text>
            </g>

            {/* 전처리 → 모델 */}
            <path className="pb-flow" d="M320 214 H340 M340 172 V264 M340 172 H356 M340 192 H356 M340 244 H356 M340 264 H356" style={{ animationDelay: '0.5s' }} />

            {/* ── 모델 경합 ── */}
            <text className="tx pb-grp pb-row" x="362" y="150">statistical</text>
            <g className="pb-row">
                <text className="tx pb-wtx" x="362" y="172" dominantBaseline="central">sarima</text>
                <rect className="pb-bar is-win" x="448" y="167.5" width="52" height="9" rx="1" />
                <path className="pb-sel" d="M512 167 L518 172 L512 177 L506 172 Z" />
                <text className="tx tx-g pb-sel" x="526" y="172" dominantBaseline="central">selected</text>
            </g>
            <g className="pb-row" style={{ animationDelay: '0.1s' }}>
                <text className="tx" x="362" y="192" dominantBaseline="central">prophet</text>
                <rect className="pb-bar" x="448" y="187.5" width="94" height="9" rx="1" style={{ animationDelay: '0.08s' }} />
            </g>

            <text className="tx pb-grp pb-row" x="362" y="222" style={{ animationDelay: '0.2s' }}>machine learning</text>
            <g className="pb-row" style={{ animationDelay: '0.3s' }}>
                <text className="tx" x="362" y="244" dominantBaseline="central">xgboost</text>
                <rect className="pb-bar" x="448" y="239.5" width="78" height="9" rx="1" style={{ animationDelay: '0.16s' }} />
            </g>
            <g className="pb-row" style={{ animationDelay: '0.4s' }}>
                <text className="tx" x="362" y="264" dominantBaseline="central">lstm</text>
                <rect className="pb-bar" x="448" y="259.5" width="120" height="9" rx="1" style={{ animationDelay: '0.24s' }} />
            </g>

            {/* 막대 없는 말줄임 행 — 넷은 대표일 뿐 뒤에 더 있다는 표시. 숫자는 본문에
                이름으로 적은 모델 수(9개)와 맞춘다. */}
            <g className="pb-row" style={{ animationDelay: '0.5s' }}>
                <circle className="dot-m" cx="365" cy="288" r="1.5" />
                <circle className="dot-m" cx="373" cy="288" r="1.5" />
                <circle className="dot-m" cx="381" cy="288" r="1.5" />
                <text className="tx" x="448" y="288" dominantBaseline="central">9 candidates in total</text>
            </g>

            <text className="tx pb-row" x="362" y="318" style={{ animationDelay: '0.6s' }}>cross-validated · lower error wins</text>
            <text className="tx pb-sel" x="40" y="344">few features · high volatility · deep models fell short</text>
        </svg>
    ),
    // 부품 수요 예측 — 완만한 추세 + 계절성 위에 잔변동과 단발 스파이크가 섞인
    // 실제 수요(회색)를, 모델(골드)이 과적합 없이 따라간다. 경계 이후는 점선 예측 +
    // 지평이 멀수록 넓어지는 신뢰구간. 차트 영역 x 72~596 / y 78~286.
    'parts-order-forecasting-service': (
        <svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid meet">
            {/* 축 눈금 — 가로 격자는 옅게, 좌측에 값 라벨 */}
            <g className="g" strokeWidth="1">
                <line x1="72" y1="82.2" x2="596" y2="82.2" />
                <line x1="72" y1="130" x2="596" y2="130" />
                <line x1="72" y1="182" x2="596" y2="182" />
                <line x1="72" y1="234" x2="596" y2="234" />
            </g>
            <line className="axis" x1="72" y1="281.8" x2="596" y2="281.8" />
            <text className="tx-ax" x="64" y="86" textAnchor="end">high</text>
            <text className="tx-ax" x="64" y="186" textAnchor="end">avg</text>
            <text className="tx-ax" x="64" y="286" textAnchor="end">low</text>

            {/* 예측 신뢰구간 */}
            <path className="band c-band" d="M461.6 180.3 L475.1 176.7 L488.5 175.5 L501.9 178.9 L515.4 177.8 L528.8 169.9 L542.3 160 L555.7 165 L569.1 155 L582.6 144.4 L582.6 187.1 L569.1 194.5 L555.7 201.4 L542.3 193.2 L528.8 200.1 L515.4 204.8 L501.9 202.8 L488.5 196.3 L475.1 194.3 L461.6 194.9 Z" />

            {/* 실적 수요 */}
            <path className="ln-m c-actual" style={{ '--len': '1000' }} d="M72 212.7 L85.4 215.8 L98.9 206.8 L112.3 199.3 L125.7 202.1 L139.2 184.9 L152.6 164.8 L166.1 171.3 L179.5 162 L192.9 122.4 L206.4 147.1 L219.8 166.8 L233.2 152.5 L246.7 145.5 L260.1 149.2 L273.5 150 L287 181.8 L300.4 132.8 L313.8 142.7 L327.3 138.6 L340.7 156.9 L354.2 162.4 L367.6 163.5 L381 153.7 L394.5 132.3 L407.9 170.3 L421.3 174.5 L434.8 174.3 L448.2 175.2 L461.6 194.2" />

            {/* 모델 적합 */}
            <path className="ln c-model" style={{ '--len': '1000' }} d="M72 216 L85.4 213 L98.9 205.5 L112.3 198.5 L125.7 195.1 L139.2 184.8 L152.6 173.6 L166.1 172 L179.5 165.2 L192.9 150.2 L206.4 153.9 L219.8 158.5 L233.2 151.7 L246.7 147.9 L260.1 148.4 L273.5 148.5 L287 158.1 L300.4 143.4 L313.8 148 L327.3 148.1 L340.7 156.4 L354.2 160.4 L367.6 163 L381 161.9 L394.5 158.2 L407.9 172.4 L421.3 176 L434.8 177.8 L448.2 179.7 L461.6 187.6" />

            {/* 예측 구간 */}
            {/* 예측선은 점선을 유지해야 하므로 대시 기반 그리기 대신 페이드로 등장한다 */}
            <path className="ln-d c-fore" d="M461.6 187.6 L475.1 185.5 L488.5 185.9 L501.9 190.8 L515.4 191.3 L528.8 185 L542.3 176.6 L555.7 183.2 L569.1 174.7 L582.6 165.7" />

            {/* 실적/예측 경계 */}
            <line className="split" x1="461.6" y1="78" x2="461.6" y2="281.8" />
            <circle className="dot c-fore" cx="461.6" cy="187.6" r="3" />

            {/* 모델이 흡수한 단발 스파이크 표시 */}
            <circle className="spike c-mark" cx="192.9" cy="122.4" r="3.5" />
            <circle className="spike c-mark" cx="287" cy="181.8" r="3.5" />
            <circle className="spike c-mark" cx="394.5" cy="132.3" r="3.5" />

            {/* 범례 */}
            <g>
                <line className="ln-m" x1="72" y1="322" x2="96" y2="322" />
                <text className="tx" x="104" y="325">actual demand</text>
                <line className="ln" x1="220" y1="322" x2="244" y2="322" />
                <text className="tx tx-g" x="252" y="325">model fit</text>
                <line className="ln-d" x1="340" y1="322" x2="364" y2="322" />
                <text className="tx" x="372" y="325">forecast</text>
                <text className="tx tx-g" x="596" y="325" textAnchor="end">mape −7%</text>
            </g>
            <text className="tx-ax" x="461.6" y="70" textAnchor="middle">today</text>
        </svg>
    ),
    // 클라우드 데이터 레이크 · 통합 결과 — 따로 떨어져 있던 원천 셋이 레이크 안으로
    // 하나씩 들어와 쌓인다. 왼쪽 상자와 오른쪽 띠의 이름이 같아서 "그대로 옮겨왔다"가
    // 읽힌다. 경력기술서의 "정형/비정형 통합 관리"가 요지. 10초 루프.
    'snowflake-pipeline-service': (
        <svg viewBox="0 12 640 400" preserveAspectRatio="xMidYMid meet">
            <text className="tx tx-g" x="40" y="84">one place to query</text>
            <text className="tx" x="40" y="108">structured and unstructured, together</text>

            {/* ── 왼쪽: 따로 놓인 원천 ── */}
            <g className="sl-src">
                <rect className="sl-box" x="40" y="150" width="150" height="52" rx="2" />
                <text className="tx" x="115" y="176" textAnchor="middle" dominantBaseline="central">on-prem db</text>
            </g>
            <g className="sl-src" style={{ animationDelay: '0.15s' }}>
                <rect className="sl-box" x="40" y="222" width="150" height="52" rx="2" />
                <text className="tx" x="115" y="248" textAnchor="middle" dominantBaseline="central">external systems</text>
            </g>
            <g className="sl-src" style={{ animationDelay: '0.3s' }}>
                <rect className="sl-box" x="40" y="294" width="150" height="52" rx="2" />
                <text className="tx" x="115" y="320" textAnchor="middle" dominantBaseline="central">unstructured files</text>
            </g>

            <path className="sl-flow" d="M190 176 H222 V248 M190 248 H222 M190 320 H222 V248 M222 248 H262" />
            <path className="sl-head" d="M264 242 L278 248 L264 254 Z" />

            {/* ── 오른쪽: 하나의 레이크 ── */}
            <rect className="sl-lake" x="300" y="150" width="304" height="196" rx="3" />
            <text className="tx tx-g sl-lakettl" x="452" y="178" textAnchor="middle" dominantBaseline="central">snowflake data lake</text>
            <g className="sl-band-in">
                <rect className="sl-inner" x="322" y="206" width="260" height="30" rx="2" />
                <text className="tx" x="452" y="221" textAnchor="middle" dominantBaseline="central">on-prem db</text>
            </g>
            <g className="sl-band-in" style={{ animationDelay: '0.5s' }}>
                <rect className="sl-inner" x="322" y="244" width="260" height="30" rx="2" />
                <text className="tx" x="452" y="259" textAnchor="middle" dominantBaseline="central">external systems</text>
            </g>
            <g className="sl-band-in" style={{ animationDelay: '1s' }}>
                <rect className="sl-inner" x="322" y="282" width="260" height="30" rx="2" />
                <text className="tx" x="452" y="297" textAnchor="middle" dominantBaseline="central">unstructured files</text>
            </g>
            <text className="tx sl-note" x="452" y="330" textAnchor="middle" dominantBaseline="central">one query surface</text>
        </svg>
    ),
    // 클라우드 데이터 레이크 · 계층 — 가로 사슬로 그리면 카드 03(3단 파이프라인)과
    // 같아 보여서 세로 계층으로 그렸다. 왼쪽 레일의 골드 표식이 위에서 아래로
    // 내려가며 층을 차례로 켠다. 10초 루프.
    'snowflake-pipeline': (
        <svg viewBox="0 11 640 400" preserveAspectRatio="xMidYMid meet">
            <text className="tx tx-g" x="40" y="84">layers</text>

            <line className="sl-rail" x1="46" y1="165" x2="46" y2="321" />
            <circle className="sl-mark" cx="46" cy="165" r="4.5" />

            <g className="sl-layer">
                <rect className="sl-band sl-b1" x="64" y="142" width="540" height="46" rx="2" />
                <text className="tx sl-name" x="86" y="165" dominantBaseline="central">source</text>
                <text className="tx" x="220" y="165" dominantBaseline="central">on-prem db · external systems</text>
            </g>
            <g className="sl-layer">
                <rect className="sl-band sl-b2" x="64" y="194" width="540" height="46" rx="2" />
                <text className="tx sl-name" x="86" y="217" dominantBaseline="central">ingest</text>
                <text className="tx" x="220" y="217" dominantBaseline="central">aws dms · glue catalog</text>
            </g>
            <g className="sl-layer">
                <rect className="sl-band sl-b3" x="64" y="246" width="540" height="46" rx="2" />
                <text className="tx sl-name" x="86" y="269" dominantBaseline="central">landing</text>
                <text className="tx" x="220" y="269" dominantBaseline="central">parquet on s3</text>
            </g>
            <g className="sl-layer">
                <rect className="sl-band sl-b4" x="64" y="298" width="540" height="46" rx="2" />
                <text className="tx sl-name" x="86" y="321" dominantBaseline="central">lake</text>
                <text className="tx" x="220" y="321" dominantBaseline="central">snowflake · structured + unstructured</text>
            </g>
        </svg>
    ),
    // 점포 추천 · 일 배치 파이프라인 — 6,000개 점포에서 하루 1억 건이 들어오고,
    // 저장 레이아웃 최적화와 PySpark 전환으로 배치 30시간이 1시간으로 줄었다.
    // 마지막에 회색 막대(전)가 골드 막대(후)로 수축하는 순간이 -90%다. 10초 루프.
    'store-recommendation': (
        <svg viewBox="0 6 640 400" preserveAspectRatio="xMidYMid meet">
            <text className="tx tx-g" x="40" y="84">daily pipeline</text>

            {/* ── 3단계: 유입 규모 → 저장 레이아웃 → 분산 처리 ── */}
            <g className="sp-stage">
                <rect className="sp-box" x="40" y="130" width="164" height="100" rx="2" />
                <text className="tx sp-ttl" x="122" y="152" textAnchor="middle" dominantBaseline="central">daily input</text>
                <text className="tx" x="122" y="180" textAnchor="middle" dominantBaseline="central">6,000 stores</text>
                <text className="tx" x="122" y="200" textAnchor="middle" dominantBaseline="central">100m+ records</text>
                <text className="tx" x="122" y="220" textAnchor="middle" dominantBaseline="central">per day</text>
            </g>
            <g className="sp-stage" style={{ animationDelay: '0.5s' }}>
                <rect className="sp-box" x="240" y="130" width="164" height="100" rx="2" />
                <text className="tx sp-ttl" x="322" y="152" textAnchor="middle" dominantBaseline="central">storage layout</text>
                <text className="tx" x="322" y="180" textAnchor="middle" dominantBaseline="central">parquet · delta</text>
                <text className="tx" x="322" y="200" textAnchor="middle" dominantBaseline="central">partitioning</text>
                <text className="tx" x="322" y="220" textAnchor="middle" dominantBaseline="central">small-file fix</text>
            </g>
            <g className="sp-stage" style={{ animationDelay: '1s' }}>
                <rect className="sp-box" x="440" y="130" width="164" height="100" rx="2" />
                <text className="tx sp-ttl" x="522" y="152" textAnchor="middle" dominantBaseline="central">compute</text>
                <text className="tx" x="522" y="180" textAnchor="middle" dominantBaseline="central">pyspark</text>
                <text className="tx" x="522" y="200" textAnchor="middle" dominantBaseline="central">distributed</text>
                <text className="tx" x="522" y="220" textAnchor="middle" dominantBaseline="central">vectorized</text>
            </g>
            <path className="sp-flow" d="M204 180 H240" />
            <path className="sp-flow" d="M404 180 H440" style={{ animationDelay: '0.5s' }} />

            {/* ── 그 결과: 회색이 전, 골드가 후 ── */}
            <line className="g sp-res" x1="40" y1="266" x2="604" y2="266" strokeWidth="1" />

            <g className="sp-res" style={{ animationDelay: '0.1s' }}>
                <text className="tx" x="40" y="296" dominantBaseline="central">batch time</text>
                <rect className="sp-before" x="150" y="292" width="260" height="8" rx="2" />
                <rect className="sp-after" x="150" y="292" width="10" height="8" rx="2" />
                <text className="tx tx-g sp-tag" x="604" y="296" textAnchor="end" dominantBaseline="central">30 h → 1 h</text>
            </g>
            <g className="sp-res" style={{ animationDelay: '0.2s' }}>
                <text className="tx" x="40" y="330" dominantBaseline="central">cloud cost</text>
                <rect className="sp-before" x="150" y="326" width="260" height="8" rx="2" style={{ animationDelay: '0.12s' }} />
                <rect className="sp-after" x="150" y="326" width="26" height="8" rx="2" style={{ animationDelay: '0.12s' }} />
                <text className="tx tx-g sp-tag" x="604" y="330" textAnchor="end" dominantBaseline="central">−90%</text>
            </g>
        </svg>
    ),
    // 왼쪽: 대상 점포와 유사 점포 그래프(선은 원 경계에서 끊어 관통하지 않는다).
    // 오른쪽: 그 유사 점포들의 판매 이력에서 뽑아낸 추천 상품과 예상 판매량.
    // 10초 루프 — 선이 뻗음 → 유사 점포 선정 → 추천 목록이 차례로 채워짐.
    'store-recommendation-service': (
        <svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid meet">
            {/* ── 왼쪽: 유사도 그래프 ── */}
            <g className="sim-edges">
                <line x1="139" y1="179.1" x2="38.8" y2="116.3" />
                <line x1="144" y1="174.5" x2="97.7" y2="85.1" />
                <line x1="151.7" y1="173.1" x2="164.9" y2="75.9" />
                <line x1="160.3" y1="178.1" x2="229.7" y2="124.9" />
                <line x1="162.8" y1="188.1" x2="250.1" y2="202.7" />
                <line x1="156.4" y1="197.3" x2="200.1" y2="275" />
                <line x1="145.3" y1="198.1" x2="112.9" y2="282.5" />
                <line x1="138" y1="190.9" x2="45.4" y2="229" />
            </g>

            {/* 유사도 상위 점포는 골드로 켜진다 */}
            <g className="sim-near">
                <circle cx="32" cy="112" r="6" />
                <circle cx="166" cy="68" r="6" />
                <circle cx="258" cy="204" r="6" />
                <circle cx="38" cy="232" r="6" />
            </g>
            <g className="sim-far">
                <circle cx="94" cy="78" r="6" />
                <circle cx="236" cy="120" r="6" />
                <circle cx="204" cy="282" r="6" />
                <circle cx="110" cy="290" r="6" />
            </g>

            <circle className="dot pulse" cx="150" cy="186" r="11" />
            <text className="tx tx-g" x="150" y="216" textAnchor="middle">target store</text>
            <text className="tx" x="150" y="336" textAnchor="middle">6,000+ stores · similarity</text>

            {/* 가운데 화살표 — 점선은 촉 앞에서 끊고, 촉은 골드로 채워 겹쳐 보이지 않게 */}
            <path className="ln-d rec-arrow" d="M300 186 H340" />
            <path className="rec-head rec-arrow" d="M342 180 L356 186 L342 192 Z" />

            {/* ── 오른쪽: 발주 추천 수량 ── */}
            <text className="tx tx-g" x="380" y="76">recommended order products</text>
            <g className="rec-row rec-1">
                <text className="tx-item" x="380" y="118">Energy Drink · Black Bull 250ml</text>
                <rect x="380" y="128" width="150" height="6" rx="3" />
                <text className="tx-num" x="600" y="122" textAnchor="end">24<tspan className="tx-unit"> ea</tspan></text>
            </g>
            <g className="rec-row rec-2">
                <text className="tx-item" x="380" y="166">Gimbap · Spicy Tuna Roll</text>
                <rect x="380" y="176" width="119" height="6" rx="3" />
                <text className="tx-num" x="600" y="170" textAnchor="end">19<tspan className="tx-unit"> ea</tspan></text>
            </g>
            <g className="rec-row rec-3">
                <text className="tx-item" x="380" y="214">Cup Noodle · Flame Jjamppong L</text>
                <rect x="380" y="224" width="81" height="6" rx="3" />
                <text className="tx-num" x="600" y="218" textAnchor="end">13<tspan className="tx-unit"> ea</tspan></text>
            </g>
            <g className="rec-row rec-4">
                <text className="tx-item" x="380" y="262">Sports Drink · HydroFit 600ml</text>
                <rect x="380" y="272" width="56" height="6" rx="3" />
                <text className="tx-num" x="600" y="266" textAnchor="end">9<tspan className="tx-unit"> ea</tspan></text>
            </g>
            <line className="axis" x1="380" y1="300" x2="600" y2="300" />
            <text className="tx" x="380" y="336">ranked by predicted demand</text>
        </svg>
    ),
    // RAG 챗봇 · 근거가 붙은 답변 — 카드 01과 같은 말풍선 스타일을 쓰되(같은 사이트의
    // 챗봇이니 통일한다) 클라이맥스가 다르다. 01은 SQL 블록이 자라나는 것이고,
    // 12는 답변 아래 근거 문서 세 장이 차례로 붙는 것이다. 10초 루프.
    'rag-chatbot-service': (
        <svg viewBox="0 13 640 400" preserveAspectRatio="xMidYMid meet">
            <text className="tx tx-g" x="40" y="84">ask the company docs</text>
            <text className="tx" x="40" y="108">every answer cites where it came from</text>

            {/* 사용자 질문 */}
            <g className="rg-user">
                <circle className="av av-u" cx="56" cy="152" r="15" />
                <text className="tx-av" x="56" y="152" textAnchor="middle" dominantBaseline="central">user</text>
                <rect className="bub bub-u" x="82" y="134" width="300" height="36" rx="8" />
                <text className="tx-q" x="98" y="152" dominantBaseline="central">작년 행사 정산 기준이 어떻게 되나요?</text>
            </g>

            {/* 답변 */}
            <g className="rg-ans">
                <circle className="av av-a" cx="584" cy="212" r="15" />
                <text className="tx-av tx-av-g" x="584" y="212" textAnchor="middle" dominantBaseline="central">ai</text>
                <rect className="bub bub-a" x="188" y="188" width="370" height="62" rx="8" />
                <text className="tx-a" x="206" y="210">행사 종료 후 <tspan className="tx-a-hi">30일 이내</tspan> 정산하며,</text>
                <text className="tx-a" x="206" y="232">매입 할인분은 매출에서 차감합니다.</text>
            </g>

            {/* 근거 문서 */}
            <text className="tx rg-srclab" x="188" y="278">sources</text>
            <g className="rg-src">
                <rect className="rg-card" x="188" y="292" width="116" height="56" rx="3" />
                <path className="rg-doc" d="M202 306 h14 l6 6 v18 h-20 z" />
                <text className="tx" x="230" y="314" dominantBaseline="central">settlement</text>
                <text className="tx rg-pg" x="230" y="330" dominantBaseline="central">p. 12</text>
            </g>
            <g className="rg-src" style={{ animationDelay: '0.3s' }}>
                <rect className="rg-card" x="315" y="292" width="116" height="56" rx="3" />
                <path className="rg-doc" d="M329 306 h14 l6 6 v18 h-20 z" />
                <text className="tx" x="357" y="314" dominantBaseline="central">promo guide</text>
                <text className="tx rg-pg" x="357" y="330" dominantBaseline="central">p. 4</text>
            </g>
            <g className="rg-src" style={{ animationDelay: '0.6s' }}>
                <rect className="rg-card" x="442" y="292" width="116" height="56" rx="3" />
                <path className="rg-doc" d="M456 306 h14 l6 6 v18 h-20 z" />
                <text className="tx" x="484" y="314" dominantBaseline="central">accounting</text>
                <text className="tx rg-pg" x="484" y="330" dominantBaseline="central">p. 31</text>
            </g>
        </svg>
    ),
    // RAG 챗봇 · 프롬프트 조립 — RAG의 실체는 검색 결과를 프롬프트에 끼워 넣는 것이라,
    // 세 층으로 쌓인 블록으로 보여준다. 아래로 피드백 로그가 되돌아가 검색 품질을
    // 고치는 호가 붙는다. 카드 04의 완결된 원과 달리 직선 + 되돌아가는 호다. 10초 루프.
    'rag-chatbot': (
        <svg viewBox="0 18 640 400" preserveAspectRatio="xMidYMid meet">
            <text className="tx tx-g" x="40" y="84">retrieval</text>
            <text className="tx" x="40" y="108">how the prompt gets assembled</text>

            {/* 사내 소스 */}
            <g className="rp-src">
                <rect className="rp-box" x="40" y="148" width="96" height="30" rx="2" />
                <text className="tx" x="88" y="163" textAnchor="middle" dominantBaseline="central">documents</text>
            </g>
            <g className="rp-src" style={{ animationDelay: '0.12s' }}>
                <rect className="rp-box" x="40" y="186" width="96" height="30" rx="2" />
                <text className="tx" x="88" y="201" textAnchor="middle" dominantBaseline="central">wiki</text>
            </g>
            <g className="rp-src" style={{ animationDelay: '0.24s' }}>
                <rect className="rp-box" x="40" y="224" width="96" height="30" rx="2" />
                <text className="tx" x="88" y="239" textAnchor="middle" dominantBaseline="central">tables</text>
            </g>
            <g className="rp-src" style={{ animationDelay: '0.36s' }}>
                <rect className="rp-box" x="40" y="262" width="96" height="30" rx="2" />
                <text className="tx" x="88" y="277" textAnchor="middle" dominantBaseline="central">logs</text>
            </g>

            <path className="rp-flow" d="M136 163 H150 V220 M136 201 H150 M136 239 H150 M136 277 H150 V220 M150 220 H160" />

            {/* 통합 인덱스 */}
            <g className="rp-idx">
                <rect className="rp-box is-idx" x="160" y="180" width="120" height="80" rx="2" />
                <text className="tx rp-ttl" x="220" y="204" textAnchor="middle" dominantBaseline="central">cognitive</text>
                <text className="tx rp-ttl" x="220" y="220" textAnchor="middle" dominantBaseline="central">search</text>
                <text className="tx" x="220" y="240" textAnchor="middle" dominantBaseline="central">unified index</text>
            </g>
            <path className="rp-flow" d="M280 220 H300" style={{ animationDelay: '0.4s' }} />

            {/* 프롬프트 블록 */}
            <text className="tx rp-ptt rp-stack" x="300" y="140">prompt</text>
            <g className="rp-stack">
                <rect className="rp-band" x="300" y="150" width="190" height="40" rx="2" />
                <text className="tx" x="395" y="170" textAnchor="middle" dominantBaseline="central">system rules</text>
            </g>
            <g className="rp-stack" style={{ animationDelay: '0.25s' }}>
                <rect className="rp-band is-hit" x="300" y="196" width="190" height="40" rx="2" />
                <text className="tx tx-g" x="395" y="216" textAnchor="middle" dominantBaseline="central">retrieved · top-k</text>
            </g>
            <g className="rp-stack" style={{ animationDelay: '0.5s' }}>
                <rect className="rp-band" x="300" y="242" width="190" height="40" rx="2" />
                <text className="tx" x="395" y="262" textAnchor="middle" dominantBaseline="central">user question</text>
            </g>

            <path className="rp-flow" d="M490 216 H510" style={{ animationDelay: '0.7s' }} />
            <g className="rp-gpt">
                <rect className="rp-box is-out" x="510" y="196" width="94" height="40" rx="2" />
                <text className="tx tx-g" x="557" y="216" textAnchor="middle" dominantBaseline="central">gpt api</text>
            </g>

            {/* 되돌아가는 피드백 호 */}
            <g className="rp-fb">
                <path className="rp-arc" d="M557 240 C 557 320, 380 344, 260 326 C 224 320, 220 296, 220 264" />
                <text className="tx" x="392" y="356" textAnchor="middle">feedback · interaction logs</text>
            </g>
        </svg>
    ),
    // 점포 분석 · 영수증 한 장에서 — 실제 영수증 모양(톱니 가장자리)을 그리고,
    // 거기서 성별·연령 추정과 함께 산 상품이 나온다. 확률 막대는 단일 계열이라
    // 범례 없이 골드로 둔다. 10초 루프.
    'retail-analytics-service': (
        <svg viewBox="0 15 640 400" preserveAspectRatio="xMidYMid meet">
            <text className="tx tx-g" x="40" y="84">from one receipt</text>
            <text className="tx" x="40" y="108">who bought it, and what goes together</text>

            <g className="rc-slip">
                <path className="rc-paper" d="M60 140 H230 V332 L221.5 340 L213.0 332 L204.5 340 L196.0 332 L187.5 340 L179.0 332 L170.5 340 L162.0 332 L153.5 340 L145.0 332 L136.5 340 L128.0 332 L119.5 340 L111.0 332 L102.5 340 L94.0 332 L85.5 340 L77.0 332 L68.5 340 L60.0 332 Z" />
                <text className="tx rc-hd" x="145" y="162" textAnchor="middle" dominantBaseline="central">store 0142</text>
                <line className="rc-rule" x1="76" y1="174" x2="214" y2="174" />
                <text className="tx rc-item" x="76" y="190" dominantBaseline="central">banana milk</text>
                <text className="tx rc-item" x="214" y="190" textAnchor="end" dominantBaseline="central">1,500</text>
                <text className="tx rc-item" x="76" y="212" dominantBaseline="central">gimbap · tuna</text>
                <text className="tx rc-item" x="214" y="212" textAnchor="end" dominantBaseline="central">3,200</text>
                <text className="tx rc-item" x="76" y="234" dominantBaseline="central">cup noodle</text>
                <text className="tx rc-item" x="214" y="234" textAnchor="end" dominantBaseline="central">1,800</text>
                <text className="tx rc-item" x="76" y="256" dominantBaseline="central">energy drink</text>
                <text className="tx rc-item" x="214" y="256" textAnchor="end" dominantBaseline="central">2,400</text>
                <line className="rc-rule" x1="76" y1="272" x2="214" y2="272" />
                <text className="tx rc-hd" x="76" y="290" dominantBaseline="central">total</text>
                <text className="tx-num rc-tot" x="214" y="290" textAnchor="end" dominantBaseline="central">8,900</text>
            </g>

            <path className="rc-flow" d="M244 236 H274" />
            <path className="rc-head" d="M276 230 L290 236 L276 242 Z" />

            <text className="tx rc-lab" x="310" y="160">predicted customer</text>
            <g className="rc-pred">
                <text className="tx" x="310" y="192" dominantBaseline="central">female</text>
                <rect className="rc-bar" x="420" y="187" width="150" height="9" rx="1" />
                <text className="tx tx-g" x="604" y="192" textAnchor="end" dominantBaseline="central">0.82</text>
            </g>
            <g className="rc-pred" style={{ animationDelay: '0.25s' }}>
                <text className="tx" x="310" y="222" dominantBaseline="central">age 30-39</text>
                <rect className="rc-bar" x="420" y="217" width="112" height="9" rx="1" />
                <text className="tx tx-g" x="604" y="222" textAnchor="end" dominantBaseline="central">0.61</text>
            </g>

            <text className="tx rc-lab2" x="310" y="278">often bought together</text>
            <g className="rc-pair">
                <text className="tx" x="310" y="308" dominantBaseline="central">banana milk + gimbap</text>
            </g>
            <g className="rc-pair" style={{ animationDelay: '0.3s' }}>
                <text className="tx" x="310" y="332" dominantBaseline="central">cup noodle + energy drink</text>
            </g>
        </svg>
    ),
    // 점포 분석 · 공유 데이터에서 네 모델로 — 영수증·카드·점포 데이터가 서로 다른
    // 조합으로 네 모델에 들어가고, 넷 다 현업 서비스로 나간다. 카드 08의 깔끔한
    // 분기와 달리 연결선이 교차하는 그물 형태라 인상이 다르다. 10초 루프.
    'retail-analytics': (
        <svg viewBox="0 15 640 400" preserveAspectRatio="xMidYMid meet">
            <text className="tx tx-g" x="40" y="84">shared data, four models</text>
            <text className="tx" x="40" y="108">all of it handed back to the field</text>

            <g className="rt-src" style={{ animationDelay: '0.00s' }}>
                <rect className="rt-box" x="40" y="150" width="110" height="44" rx="2" />
                <text className="tx" x="95" y="172" textAnchor="middle" dominantBaseline="central">receipts</text>
            </g>
            <g className="rt-src" style={{ animationDelay: '0.12s' }}>
                <rect className="rt-box" x="40" y="218" width="110" height="44" rx="2" />
                <text className="tx" x="95" y="240" textAnchor="middle" dominantBaseline="central">card data</text>
            </g>
            <g className="rt-src" style={{ animationDelay: '0.24s' }}>
                <rect className="rt-box" x="40" y="286" width="110" height="44" rx="2" />
                <text className="tx" x="95" y="308" textAnchor="middle" dominantBaseline="central">store ops</text>
            </g>

            <path className="rt-link" d="M150 172 C 200 172, 200 160, 250 160" style={{ animationDelay: '0.20s' }} />
            <path className="rt-link" d="M150 172 C 200 172, 200 216, 250 216" style={{ animationDelay: '0.26s' }} />
            <path className="rt-link" d="M150 240 C 200 240, 200 160, 250 160" style={{ animationDelay: '0.32s' }} />
            <path className="rt-link" d="M150 240 C 200 240, 200 272, 250 272" style={{ animationDelay: '0.38s' }} />
            <path className="rt-link" d="M150 308 C 200 308, 200 216, 250 216" style={{ animationDelay: '0.44s' }} />
            <path className="rt-link" d="M150 308 C 200 308, 200 328, 250 328" style={{ animationDelay: '0.50s' }} />

            <g className="rt-mod" style={{ animationDelay: '0.30s' }}>
                <rect className="rt-box is-model" x="250" y="140" width="150" height="40" rx="2" />
                <text className="tx rt-name" x="325" y="154" textAnchor="middle" dominantBaseline="central">customer</text>
                <text className="tx" x="325" y="168" textAnchor="middle" dominantBaseline="central">gender · age</text>
            </g>
            <g className="rt-mod" style={{ animationDelay: '0.42s' }}>
                <rect className="rt-box is-model" x="250" y="196" width="150" height="40" rx="2" />
                <text className="tx rt-name" x="325" y="210" textAnchor="middle" dominantBaseline="central">inventory</text>
                <text className="tx" x="325" y="224" textAnchor="middle" dominantBaseline="central">order simulation</text>
            </g>
            <g className="rt-mod" style={{ animationDelay: '0.54s' }}>
                <rect className="rt-box is-model" x="250" y="252" width="150" height="40" rx="2" />
                <text className="tx rt-name" x="325" y="266" textAnchor="middle" dominantBaseline="central">basket</text>
                <text className="tx" x="325" y="280" textAnchor="middle" dominantBaseline="central">item affinity</text>
            </g>
            <g className="rt-mod" style={{ animationDelay: '0.66s' }}>
                <rect className="rt-box is-model" x="250" y="308" width="150" height="40" rx="2" />
                <text className="tx rt-name" x="325" y="322" textAnchor="middle" dominantBaseline="central">promo</text>
                <text className="tx" x="325" y="336" textAnchor="middle" dominantBaseline="central">event sales</text>
            </g>

            <path className="rt-link" d="M400 160 C 430 160, 430 246, 460 246" style={{ animationDelay: '0.70s' }} />
            <path className="rt-link" d="M400 216 C 430 216, 430 246, 460 246" style={{ animationDelay: '0.76s' }} />
            <path className="rt-link" d="M400 272 C 430 272, 430 246, 460 246" style={{ animationDelay: '0.82s' }} />
            <path className="rt-link" d="M400 328 C 430 328, 430 246, 460 246" style={{ animationDelay: '0.88s' }} />

            <g className="rt-out">
                <rect className="rt-box is-out" x="460" y="200" width="144" height="92" rx="2" />
                <text className="tx rt-name2" x="532" y="224" textAnchor="middle" dominantBaseline="central">in service</text>
                <text className="tx" x="532" y="250" textAnchor="middle" dominantBaseline="central">used by</text>
                <text className="tx" x="532" y="268" textAnchor="middle" dominantBaseline="central">field teams</text>
            </g>
        </svg>
    ),
    // 데이터 플랫폼 최적화 · 대시보드 — 현업에 실제로 간 산출물을 그린다. 지표 타일
    // 셋과 추세 막대 하나. 계열이 하나뿐이라 범례 없이 단일 골드로 두고, 격자·축은
    // 뒤로 물려 막대만 읽히게 했다. 숫자는 대시보드 내용물이지 성과 지표가 아니다.
    'data-platform-optimization-service': (
        <svg viewBox="0 12 640 400" preserveAspectRatio="xMidYMid meet">
            <text className="tx tx-g" x="40" y="84">power bi dashboard</text>
            <text className="tx" x="40" y="108">shared across departments</text>

            <g className="bi-frame">
                <rect className="bi-shell" x="40" y="136" width="564" height="210" rx="3" />
                <rect className="bi-topbar" x="40" y="136" width="564" height="28" />
                <text className="tx bi-ttl" x="62" y="150" dominantBaseline="central">store performance</text>
                <rect className="bi-pill" x="470" y="143" width="40" height="14" rx="7" />
                <rect className="bi-pill" x="518" y="143" width="30" height="14" rx="7" />
                <rect className="bi-pill" x="556" y="143" width="26" height="14" rx="7" />
            </g>

            <g className="bi-tile" style={{ animationDelay: '0.00s' }}>
                <rect className="bi-card" x="62" y="182" width="160" height="58" rx="2" />
                <text className="tx" x="78" y="203" dominantBaseline="central">revenue</text>
                <text className="tx-num" x="78" y="228" dominantBaseline="central">4.2b</text>
            </g>
            <g className="bi-tile" style={{ animationDelay: '0.14s' }}>
                <rect className="bi-card" x="242" y="182" width="160" height="58" rx="2" />
                <text className="tx" x="258" y="203" dominantBaseline="central">basket size</text>
                <text className="tx-num" x="258" y="228" dominantBaseline="central">3.1</text>
            </g>
            <g className="bi-tile" style={{ animationDelay: '0.28s' }}>
                <rect className="bi-card" x="422" y="182" width="160" height="58" rx="2" />
                <text className="tx" x="438" y="203" dominantBaseline="central">promo lift</text>
                <text className="tx-num" x="438" y="228" dominantBaseline="central">+12%</text>
            </g>

            <g className="bi-chart">
                <line className="g" x1="62" y1="272" x2="582" y2="272" strokeWidth="1" />
                <line className="g" x1="62" y1="300" x2="582" y2="300" strokeWidth="1" />
                <line className="axis" x1="62" y1="328" x2="582" y2="328" />
                <rect className="bi-bar" x="70" y="300" width="30" height="28" rx="2" style={{ animationDelay: '0.00s' }} />
                <rect className="bi-bar" x="126" y="287" width="30" height="41" rx="2" style={{ animationDelay: '0.06s' }} />
                <rect className="bi-bar" x="182" y="294" width="30" height="34" rx="2" style={{ animationDelay: '0.12s' }} />
                <rect className="bi-bar" x="238" y="276" width="30" height="52" rx="2" style={{ animationDelay: '0.18s' }} />
                <rect className="bi-bar" x="294" y="281" width="30" height="47" rx="2" style={{ animationDelay: '0.24s' }} />
                <rect className="bi-bar" x="350" y="267" width="30" height="61" rx="2" style={{ animationDelay: '0.30s' }} />
                <rect className="bi-bar" x="406" y="273" width="30" height="55" rx="2" style={{ animationDelay: '0.36s' }} />
                <rect className="bi-bar" x="462" y="260" width="30" height="68" rx="2" style={{ animationDelay: '0.42s' }} />
                <rect className="bi-bar" x="518" y="265" width="30" height="63" rx="2" style={{ animationDelay: '0.48s' }} />
            </g>
        </svg>
    ),
    // 데이터 플랫폼 최적화 · 마트 구성 — 넓고 무거운 원천 한 덩어리가 최적화를 거쳐
    // 목적별로 좁은 마트 셋으로 갈라진다. 지금까지 쓴 형태(막대 비교·파이프라인·고리·
    // 두 갈래 합류·주석 설계도·세로 계층)와 겹치지 않는 하나→여럿 분기다. 10초 루프.
    'data-platform-optimization': (
        <svg viewBox="0 25 640 400" preserveAspectRatio="xMidYMid meet">
            <text className="tx tx-g" x="40" y="84">source to mart</text>

            {/* ── 왼쪽: 넓고 무거운 원천 ── */}
            <g className="mt-src">
                <rect className="mt-box" x="40" y="140" width="150" height="200" rx="2" />
                <text className="tx mt-name" x="62" y="152" dominantBaseline="central">source tables</text>
                <rect className="mt-tbl" x="62" y="168" width="118" height="4" rx="2" />
                <rect className="mt-tbl" x="62" y="182" width="96" height="4" rx="2" />
                <rect className="mt-tbl" x="62" y="196" width="126" height="4" rx="2" />
                <rect className="mt-tbl" x="62" y="210" width="84" height="4" rx="2" />
                <rect className="mt-tbl" x="62" y="224" width="110" height="4" rx="2" />
                <rect className="mt-tbl" x="62" y="238" width="126" height="4" rx="2" />
                <rect className="mt-tbl" x="62" y="252" width="92" height="4" rx="2" />
                <rect className="mt-tbl" x="62" y="266" width="118" height="4" rx="2" />
                <rect className="mt-tbl" x="62" y="280" width="104" height="4" rx="2" />
                <rect className="mt-tbl" x="62" y="294" width="126" height="4" rx="2" />
                <rect className="mt-tbl" x="62" y="308" width="88" height="4" rx="2" />
                <rect className="mt-tbl" x="62" y="322" width="112" height="4" rx="2" />
                <text className="tx" x="62" y="330" dominantBaseline="central">wide · heavy</text>
            </g>

            {/* ── 가운데: 최적화 ── */}
            <g className="mt-opt">
                <rect className="mt-box is-opt" x="230" y="193" width="150" height="100" rx="2" />
                <text className="tx mt-optttl" x="305" y="214" textAnchor="middle" dominantBaseline="central">optimization</text>
                <text className="tx" x="305" y="240" textAnchor="middle" dominantBaseline="central">file format</text>
                <text className="tx" x="305" y="258" textAnchor="middle" dominantBaseline="central">partitioning</text>
                <text className="tx" x="305" y="276" textAnchor="middle" dominantBaseline="central">compute tuning</text>
            </g>

            <path className="mt-flow" d="M190 240 H230" />
            <path className="mt-flow" d="M380 243 H400 V184 H420" style={{ animationDelay: '0.4s' }} />
            <path className="mt-flow" d="M380 243 H400 V246 H420" style={{ animationDelay: '0.5s' }} />
            <path className="mt-flow" d="M380 243 H400 V308 H420" style={{ animationDelay: '0.6s' }} />

            {/* ── 오른쪽: 목적별 마트 ── */}
            <g className="mt-mart" style={{ animationDelay: '0.50s' }}>
                <rect className="mt-box" x="420" y="160" width="184" height="48" rx="2" />
                <text className="tx mt-name" x="442" y="178" dominantBaseline="central">sales mart</text>
                <text className="tx" x="442" y="194" dominantBaseline="central">daily kpi</text>
            </g>
            <g className="mt-mart" style={{ animationDelay: '0.70s' }}>
                <rect className="mt-box" x="420" y="222" width="184" height="48" rx="2" />
                <text className="tx mt-name" x="442" y="240" dominantBaseline="central">stock mart</text>
                <text className="tx" x="442" y="256" dominantBaseline="central">on-hand · orders</text>
            </g>
            <g className="mt-mart" style={{ animationDelay: '0.90s' }}>
                <rect className="mt-box" x="420" y="284" width="184" height="48" rx="2" />
                <text className="tx mt-name" x="442" y="302" dominantBaseline="central">promo mart</text>
                <text className="tx" x="442" y="318" dominantBaseline="central">event results</text>
            </g>

            <text className="tx mt-note" x="40" y="368">wide source tables → narrow, purpose-built marts</text>
        </svg>
    ),
    // 암호화폐 예측 · 플랫폼에 나가는 신호 — 가격(캔들)과 거래량(막대)을 위아래 두 칸으로
    // 나눈다. 단위가 다른 둘을 한 축에 겹치면 왜곡되기 때문이다. 오른쪽 끝 다섯 개가
    // 예측 구간이고 점선 경계로 갈라둔다. 카드 02(수요 곡선)와 형태가 겹치지 않는다.
    'crypto-prediction-service': (
        <svg viewBox="0 8 640 400" preserveAspectRatio="xMidYMid meet">
            <text className="tx tx-g" x="40" y="84">price · volume</text>
            <text className="tx" x="40" y="108">what the platform receives</text>

            <text className="tx cd-ax" x="40" y="132">price</text>
            <g className="cd-panel">
                <line className="cd-wick cd-dn" x1="62" y1="186.5" x2="62" y2="229.0" />
                <rect className="cd-body cd-dn" x="57" y="200.0" width="10" height="15.9" rx="1" />
                <line className="cd-wick cd-dn" x1="84" y1="207.1" x2="84" y2="228.0" />
                <rect className="cd-body cd-dn" x="79" y="215.9" width="10" height="4.0" rx="1" />
                <line className="cd-wick cd-up" x1="106" y1="195.1" x2="106" y2="225.2" />
                <rect className="cd-body cd-up" x="101" y="204.1" width="10" height="14.1" rx="1" />
                <line className="cd-wick cd-up" x1="128" y1="177.3" x2="128" y2="215.5" />
                <rect className="cd-body cd-up" x="123" y="183.1" width="10" height="21.0" rx="1" />
                <line className="cd-wick cd-up" x1="150" y1="170.5" x2="150" y2="191.3" />
                <rect className="cd-body cd-up" x="145" y="182.1" width="10" height="4.0" rx="1" />
                <line className="cd-wick cd-dn" x1="172" y1="171.8" x2="172" y2="203.1" />
                <rect className="cd-body cd-dn" x="167" y="182.1" width="10" height="10.1" rx="1" />
                <line className="cd-wick cd-dn" x1="194" y1="183.9" x2="194" y2="221.8" />
                <rect className="cd-body cd-dn" x="189" y="192.2" width="10" height="17.8" rx="1" />
                <line className="cd-wick cd-dn" x1="216" y1="199.1" x2="216" y2="219.3" />
                <rect className="cd-body cd-dn" x="211" y="210.0" width="10" height="4.0" rx="1" />
                <line className="cd-wick cd-up" x1="238" y1="197.4" x2="238" y2="221.8" />
                <rect className="cd-body cd-up" x="233" y="208.9" width="10" height="4.0" rx="1" />
                <line className="cd-wick cd-dn" x1="260" y1="202.3" x2="260" y2="219.8" />
                <rect className="cd-body cd-dn" x="255" y="208.9" width="10" height="4.3" rx="1" />
                <line className="cd-wick cd-dn" x1="282" y1="206.5" x2="282" y2="230.7" />
                <rect className="cd-body cd-dn" x="277" y="213.2" width="10" height="11.5" rx="1" />
                <line className="cd-wick cd-up" x1="304" y1="196.8" x2="304" y2="234.8" />
                <rect className="cd-body cd-up" x="299" y="204.3" width="10" height="20.4" rx="1" />
                <line className="cd-wick cd-up" x1="326" y1="187.5" x2="326" y2="211.9" />
                <rect className="cd-body cd-up" x="321" y="195.8" width="10" height="8.4" rx="1" />
                <line className="cd-wick cd-dn" x1="348" y1="185.9" x2="348" y2="213.1" />
                <rect className="cd-body cd-dn" x="343" y="195.8" width="10" height="9.9" rx="1" />
                <line className="cd-wick cd-dn" x1="370" y1="194.4" x2="370" y2="228.3" />
                <rect className="cd-body cd-dn" x="365" y="205.7" width="10" height="10.1" rx="1" />
                <line className="cd-wick cd-dn" x1="392" y1="202.6" x2="392" y2="226.6" />
                <rect className="cd-body cd-dn" x="387" y="215.9" width="10" height="4.0" rx="1" />
                <line className="cd-wick cd-up" x1="414" y1="187.3" x2="414" y2="221.7" />
                <rect className="cd-body cd-up" x="409" y="201.1" width="10" height="15.1" rx="1" />
                <line className="cd-wick cd-up" x1="436" y1="167.8" x2="436" y2="212.3" />
                <rect className="cd-body cd-up" x="431" y="180.0" width="10" height="21.0" rx="1" />
                <line className="cd-wick cd-fore" x1="458" y1="166.5" x2="458" y2="200.9" />
                <rect className="cd-body cd-fore" x="453" y="180.0" width="10" height="11.0" rx="1" />
                <line className="cd-wick cd-fore" x1="480" y1="182.9" x2="480" y2="213.5" />
                <rect className="cd-body cd-fore" x="475" y="191.0" width="10" height="8.7" rx="1" />
                <line className="cd-wick cd-fore" x1="502" y1="180.0" x2="502" y2="208.9" />
                <rect className="cd-body cd-fore" x="497" y="185.7" width="10" height="14.1" rx="1" />
                <line className="cd-wick cd-fore" x1="524" y1="172.1" x2="524" y2="208.9" />
                <rect className="cd-body cd-fore" x="519" y="185.7" width="10" height="16.3" rx="1" />
                <line className="cd-wick cd-fore" x1="546" y1="195.1" x2="546" y2="211.8" />
                <rect className="cd-body cd-fore" x="541" y="201.6" width="10" height="4.0" rx="1" />
            </g>

            <line className="axis" x1="40" y1="246" x2="604" y2="246" />
            <text className="tx cd-ax" x="40" y="262">volume</text>
            <g className="cd-panel" style={{ animationDelay: '0.3s' }}>
                <rect className="cd-vol" x="57" y="300.8" width="10" height="17.2" rx="1" />
                <rect className="cd-vol" x="79" y="299.0" width="10" height="19.0" rx="1" />
                <rect className="cd-vol" x="101" y="286.7" width="10" height="31.3" rx="1" />
                <rect className="cd-vol" x="123" y="288.0" width="10" height="30.0" rx="1" />
                <rect className="cd-vol" x="145" y="301.8" width="10" height="16.2" rx="1" />
                <rect className="cd-vol" x="167" y="280.4" width="10" height="37.6" rx="1" />
                <rect className="cd-vol" x="189" y="290.0" width="10" height="28.0" rx="1" />
                <rect className="cd-vol" x="211" y="300.7" width="10" height="17.3" rx="1" />
                <rect className="cd-vol" x="233" y="287.0" width="10" height="31.0" rx="1" />
                <rect className="cd-vol" x="255" y="291.7" width="10" height="26.3" rx="1" />
                <rect className="cd-vol" x="277" y="300.3" width="10" height="17.7" rx="1" />
                <rect className="cd-vol" x="299" y="272.8" width="10" height="45.2" rx="1" />
                <rect className="cd-vol" x="321" y="292.4" width="10" height="25.6" rx="1" />
                <rect className="cd-vol" x="343" y="299.9" width="10" height="18.1" rx="1" />
                <rect className="cd-vol" x="365" y="295.0" width="10" height="23.0" rx="1" />
                <rect className="cd-vol" x="387" y="268.1" width="10" height="49.9" rx="1" />
                <rect className="cd-vol" x="409" y="288.2" width="10" height="29.8" rx="1" />
                <rect className="cd-vol" x="431" y="267.0" width="10" height="51.0" rx="1" />
                <rect className="cd-vol is-fore" x="453" y="266.4" width="10" height="51.6" rx="1" />
                <rect className="cd-vol is-fore" x="475" y="289.7" width="10" height="28.3" rx="1" />
                <rect className="cd-vol is-fore" x="497" y="296.5" width="10" height="21.5" rx="1" />
                <rect className="cd-vol is-fore" x="519" y="300.1" width="10" height="17.9" rx="1" />
                <rect className="cd-vol is-fore" x="541" y="273.1" width="10" height="44.9" rx="1" />
            </g>
            <line className="axis" x1="40" y1="318" x2="604" y2="318" />

            {/* 실적과 예측의 경계 */}
            <line className="split cd-split" x1="457" y1="136" x2="457" y2="318" />
            <text className="tx tx-g cd-split" x="457" y="128" textAnchor="middle">forecast</text>

            <text className="tx cd-note" x="40" y="352">fed into the exchange platform</text>
        </svg>
    ),
    // 암호화폐 예측 · 군집화 — 만 개 자산을 먼저 묶고, 묶음마다 예측 모델을 붙인다.
    // 무리를 색으로 나누지 않은 건 의도다. 이 사이트는 골드 하나만 쓰는데 계열 색을
    // 새로 들이면 톤이 깨진다. 위치와 점선 윤곽으로 구분하면 색 없이도 읽히고
    // 색각 이상에서도 동일하게 보인다. 10초 루프.
    'crypto-prediction': (
        <svg viewBox="0 27 640 400" preserveAspectRatio="xMidYMid meet">
            <text className="tx tx-g" x="40" y="84">cluster, then predict</text>
            <text className="tx" x="40" y="108">10,000+ assets, grouped by behaviour</text>

            <g className="cl-group" style={{ animationDelay: '0.00s' }}>
                <text className="tx cl-name" x="130" y="134" textAnchor="middle">group a</text>
                <circle className="cl-hull" cx="130" cy="190" r="46" />
                <circle className="cl-dot" cx="108.4" cy="169.0" r="2.6" />
                <circle className="cl-dot" cx="139.5" cy="157.4" r="2.6" />
                <circle className="cl-dot" cx="127.9" cy="156.5" r="2.6" />
                <circle className="cl-dot" cx="153.5" cy="194.3" r="2.6" />
                <circle className="cl-dot" cx="156.4" cy="180.2" r="2.6" />
                <circle className="cl-dot" cx="139.6" cy="183.1" r="2.6" />
                <circle className="cl-dot" cx="113.0" cy="193.4" r="2.6" />
                <circle className="cl-dot" cx="104.5" cy="182.8" r="2.6" />
                <circle className="cl-dot" cx="146.2" cy="191.3" r="2.6" />
                <circle className="cl-dot" cx="123.8" cy="222.9" r="2.6" />
                <circle className="cl-dot" cx="131.4" cy="176.1" r="2.6" />
                <circle className="cl-dot" cx="133.8" cy="177.5" r="2.6" />
            </g>
            <g className="cl-group" style={{ animationDelay: '0.35s' }}>
                <text className="tx cl-name" x="250" y="194" textAnchor="middle">group b</text>
                <circle className="cl-hull" cx="250" cy="246" r="42" />
                <circle className="cl-dot" cx="241.6" cy="238.4" r="2.6" />
                <circle className="cl-dot" cx="279.8" cy="246.3" r="2.6" />
                <circle className="cl-dot" cx="253.7" cy="260.3" r="2.6" />
                <circle className="cl-dot" cx="279.6" cy="242.7" r="2.6" />
                <circle className="cl-dot" cx="242.3" cy="276.3" r="2.6" />
                <circle className="cl-dot" cx="224.5" cy="239.6" r="2.6" />
                <circle className="cl-dot" cx="258.7" cy="275.7" r="2.6" />
                <circle className="cl-dot" cx="238.6" cy="216.8" r="2.6" />
                <circle className="cl-dot" cx="263.7" cy="235.2" r="2.6" />
                <circle className="cl-dot" cx="241.6" cy="256.0" r="2.6" />
            </g>
            <g className="cl-group" style={{ animationDelay: '0.70s' }}>
                <text className="tx cl-name" x="128" y="252" textAnchor="middle">group c</text>
                <circle className="cl-hull" cx="128" cy="302" r="40" />
                <circle className="cl-dot" cx="132.7" cy="308.2" r="2.6" />
                <circle className="cl-dot" cx="120.5" cy="324.4" r="2.6" />
                <circle className="cl-dot" cx="153.0" cy="302.5" r="2.6" />
                <circle className="cl-dot" cx="119.1" cy="316.4" r="2.6" />
                <circle className="cl-dot" cx="136.8" cy="282.8" r="2.6" />
                <circle className="cl-dot" cx="119.5" cy="321.3" r="2.6" />
                <circle className="cl-dot" cx="126.0" cy="295.0" r="2.6" />
                <circle className="cl-dot" cx="132.5" cy="301.3" r="2.6" />
                <circle className="cl-dot" cx="128.0" cy="274.1" r="2.6" />
            </g>

            <path className="cl-flow" d="M292 246 H366" />

            <g className="cl-out">
                <rect className="cl-box" x="386" y="176" width="150" height="100" rx="2" />
                <text className="tx cl-ttl" x="461" y="198" textAnchor="middle" dominantBaseline="central">model per cluster</text>
                <text className="tx" x="461" y="226" textAnchor="middle" dominantBaseline="central">price</text>
                <text className="tx" x="461" y="246" textAnchor="middle" dominantBaseline="central">volume</text>
            </g>
            <path className="cl-flow" d="M536 226 H560 V226" style={{ animationDelay: '0.4s' }} />
            <g className="cl-out" style={{ animationDelay: '0.3s' }}>
                <rect className="cl-box is-out" x="560" y="204" width="44" height="44" rx="2" />
                <text className="tx cl-ttl" x="582" y="226" textAnchor="middle" dominantBaseline="central">api</text>
            </g>

            <text className="tx cl-note" x="40" y="372">load → preprocess → predict, automated</text>
        </svg>
    ),
    // 스포츠 자세분석 · 자세 비교 — COCO 17 키포인트 규격으로 그린다. 코·눈·귀까지
    // 점으로 찍혀 얼굴에 작은 그물이 생기는 게 Pose Estimation 출력의 특징이고,
    // 머리를 원 하나로 두면 그 성격이 사라진다. 기준 자세(점선) 위에 학습자 뼈대를
    // 얹고 각도 호와 유사도 점수를 붙인다. 각도·점수는 도구의 출력 예시. 10초 루프.
    'sports-posture-service': (
        <svg viewBox="-20 27 640 400" preserveAspectRatio="xMidYMid meet">
            <text className="tx tx-g" x="40" y="84">pose comparison</text>
            <text className="tx" x="40" y="108">17 keypoints, learner against the reference</text>

            <g className="ps-ref">
                <ellipse className="ps-refhead" cx="246" cy="154" rx="12" ry="16" />
                <path className="ps-refbone" d="M246 158 L241 151 M246 158 L251 151 M241 151 L236 155 M251 151 L256 155 M218 192 L274 182 M218 192 L237 227 M237 227 L263 218 M274 182 L297 179 M297 179 L292 156 M218 192 L230 258 M274 182 L262 258 M230 258 L262 258 M230 258 L228 314 M228 314 L224 371.6 M262 258 L264 314 M264 314 L270 371.6 M246 170 L246 187" />
                <circle className="ps-refkp" cx="246" cy="158" r="1.9" />
                <circle className="ps-refkp" cx="241" cy="151" r="1.9" />
                <circle className="ps-refkp" cx="251" cy="151" r="1.9" />
                <circle className="ps-refkp" cx="236" cy="155" r="1.9" />
                <circle className="ps-refkp" cx="256" cy="155" r="1.9" />
                <circle className="ps-refkp" cx="218" cy="192" r="3.2" />
                <circle className="ps-refkp" cx="274" cy="182" r="3.2" />
                <circle className="ps-refkp" cx="237" cy="227" r="3.2" />
                <circle className="ps-refkp" cx="297" cy="179" r="3.2" />
                <circle className="ps-refkp" cx="263" cy="218" r="3.2" />
                <circle className="ps-refkp" cx="292" cy="156" r="3.2" />
                <circle className="ps-refkp" cx="230" cy="258" r="3.2" />
                <circle className="ps-refkp" cx="262" cy="258" r="3.2" />
                <circle className="ps-refkp" cx="228" cy="314" r="3.2" />
                <circle className="ps-refkp" cx="264" cy="314" r="3.2" />
                <circle className="ps-refkp" cx="224" cy="371.6" r="3.2" />
                <circle className="ps-refkp" cx="270" cy="371.6" r="3.2" />
            </g>

            <g className="ps-figure">
                <ellipse className="ps-head" cx="248" cy="154" rx="12" ry="16" />
                <path className="ps-bone" d="M248 158 L243 151 M248 158 L253 151 M243 151 L238 155 M253 151 L258 155 M220 186 L276 186 M220 186 L250 217 M250 217 L284 203 M276 186 L314 166 M314 166 L320 132 M220 186 L232 258 M276 186 L264 258 M232 258 L264 258 M232 258 L230 314 M230 314 L226 371.6 M264 258 L266 314 M266 314 L272 371.6 M248 170 L248 186" />
                <circle className="ps-kp" cx="248" cy="158" r="1.9" />
                <circle className="ps-kp" cx="243" cy="151" r="1.9" />
                <circle className="ps-kp" cx="253" cy="151" r="1.9" />
                <circle className="ps-kp" cx="238" cy="155" r="1.9" />
                <circle className="ps-kp" cx="258" cy="155" r="1.9" />
                <circle className="ps-kp" cx="220" cy="186" r="3.2" />
                <circle className="ps-kp" cx="276" cy="186" r="3.2" />
                <circle className="ps-kp" cx="250" cy="217" r="3.2" />
                <circle className="ps-kp" cx="314" cy="166" r="3.2" />
                <circle className="ps-kp" cx="284" cy="203" r="3.2" />
                <circle className="ps-kp" cx="320" cy="132" r="3.2" />
                <circle className="ps-kp" cx="232" cy="258" r="3.2" />
                <circle className="ps-kp" cx="264" cy="258" r="3.2" />
                <circle className="ps-kp" cx="230" cy="314" r="3.2" />
                <circle className="ps-kp" cx="266" cy="314" r="3.2" />
                <circle className="ps-kp" cx="226" cy="371.6" r="3.2" />
                <circle className="ps-kp" cx="272" cy="371.6" r="3.2" />
            </g>

            {/* 각도 호 — 오른 팔꿈치와 왼 엉덩이 */}
            <g className="ps-ang">
                <path className="ps-arc" d="M296 176 A22 22 0 0 1 315 188" />
                <text className="tx tx-g" x="332" y="196" dominantBaseline="central">142°</text>
                <path className="ps-arc" d="M212 264 A20 20 0 0 0 221 282" />
                <text className="tx tx-g" x="196" y="288" textAnchor="end" dominantBaseline="central">97°</text>
            </g>

            <g className="ps-leg">
                <line className="ps-bone" x1="404" y1="186" x2="428" y2="186" />
                <text className="tx" x="438" y="186" dominantBaseline="central">learner</text>
                <line className="ps-refbone" x1="404" y1="212" x2="428" y2="212" />
                <text className="tx" x="438" y="212" dominantBaseline="central">reference</text>
            </g>
            <g className="ps-score">
                <text className="tx" x="404" y="266" dominantBaseline="central">similarity</text>
                <text className="ps-num" x="404" y="306" dominantBaseline="central">87</text>
                <text className="tx" x="404" y="336" dominantBaseline="central">shoulder line off by 8°</text>
            </g>
        </svg>
    ),
    // 스피드 곡선이 얹힌다. 하단은 배포 방식. 10초 루프.
    'sports-posture': (
        <svg viewBox="0 20 640 400" preserveAspectRatio="xMidYMid meet">
            <text className="tx tx-g" x="40" y="84">swing timeline</text>
            <text className="tx" x="40" y="108">where the swing is and how fast</text>

            <g className="sw-strip">
                <rect className="sw-frame" x="40" y="140" width="40" height="52" rx="2" style={{ animationDelay: '0.00s' }} />
                <rect className="sw-frame" x="87" y="140" width="40" height="52" rx="2" style={{ animationDelay: '0.06s' }} />
                <rect className="sw-frame" x="134" y="140" width="40" height="52" rx="2" style={{ animationDelay: '0.12s' }} />
                <rect className="sw-frame" x="181" y="140" width="40" height="52" rx="2" style={{ animationDelay: '0.18s' }} />
                <rect className="sw-frame is-hit" x="228" y="140" width="40" height="52" rx="2" style={{ animationDelay: '0.24s' }} />
                <rect className="sw-frame is-hit" x="275" y="140" width="40" height="52" rx="2" style={{ animationDelay: '0.30s' }} />
                <rect className="sw-frame is-hit" x="322" y="140" width="40" height="52" rx="2" style={{ animationDelay: '0.36s' }} />
                <rect className="sw-frame is-hit" x="369" y="140" width="40" height="52" rx="2" style={{ animationDelay: '0.42s' }} />
                <rect className="sw-frame is-hit" x="416" y="140" width="40" height="52" rx="2" style={{ animationDelay: '0.48s' }} />
                <rect className="sw-frame is-hit" x="463" y="140" width="40" height="52" rx="2" style={{ animationDelay: '0.54s' }} />
                <rect className="sw-frame" x="510" y="140" width="40" height="52" rx="2" style={{ animationDelay: '0.60s' }} />
                <rect className="sw-frame" x="557" y="140" width="40" height="52" rx="2" style={{ animationDelay: '0.66s' }} />
            </g>
            <g className="sw-det">
                <path className="sw-brace" d="M228 202 V210 H508 V202" />
                <text className="tx tx-g" x="368" y="224" textAnchor="middle">swing detected</text>
            </g>

            <g className="sw-tempo">
                <line className="sw-seg" x1="228" y1="252" x2="404" y2="252" />
                <line className="sw-seg is-hit" x1="404" y1="252" x2="508" y2="252" />
                <circle className="dot-m" cx="228" cy="252" r="3" />
                <circle className="dot-m" cx="404" cy="252" r="3" />
                <circle className="dot" cx="508" cy="252" r="3" />
                <text className="tx" x="316" y="270" textAnchor="middle">backswing</text>
                <text className="tx tx-g" x="456" y="270" textAnchor="middle">impact</text>
            </g>

            <g className="sw-speed">
                <line className="axis" x1="228" y1="330" x2="556" y2="330" />
                <polyline className="ln sw-line" points="228 314.0 254 313.8 280 312.7 306 310.7 332 307.4 358 302.7 384 296.4 410 288.6 436 279.0 462 267.5 488 254.1 514 253.0 540 288.0" />
                <text className="tx sw-ax" x="40" y="330">speed</text>
            </g>

            <text className="tx sw-note" x="40" y="372">pose model in docker · rest api · validation web tool</text>
        </svg>
    ),
    // 부동산 뉴스 감정분석 · 라벨링 — 기사 제목이 한 줄씩 긍·부정 두 갈래로 갈라진다.
    // 사전학습 모델을 가져다 쓴 것과 별개로 학습 데이터를 직접 만든 작업이라,
    // 그 점이 드러나게 아래에 labelled by hand 를 둔다. 10초 루프.
    'realestate-sentiment-service': (
        <svg viewBox="0 18 640 400" preserveAspectRatio="xMidYMid meet">
            <text className="tx tx-g" x="40" y="84">real estate news</text>
            <text className="tx" x="40" y="108">headlines sorted by sentiment</text>

            <g className="ns-row" style={{ animationDelay: '0.00s' }}>
                <rect className="ns-item" x="40" y="152" width="300" height="32" rx="2" />
                <text className="tx-item ns-hl" x="56" y="168" dominantBaseline="central">전세 매물 늘어 가격 안정세</text>
                <path className="ns-link" d="M340 168 C 378 168, 396 158, 420 158" />
            </g>
            <g className="ns-row" style={{ animationDelay: '0.30s' }}>
                <rect className="ns-item" x="40" y="196" width="300" height="32" rx="2" />
                <text className="tx-item ns-hl" x="56" y="212" dominantBaseline="central">거래량 석 달째 감소</text>
                <path className="ns-link" d="M340 212 C 378 212, 396 310, 420 310" />
            </g>
            <g className="ns-row" style={{ animationDelay: '0.60s' }}>
                <rect className="ns-item" x="40" y="240" width="300" height="32" rx="2" />
                <text className="tx-item ns-hl" x="56" y="256" dominantBaseline="central">금리 인하 기대에 매수 문의 증가</text>
                <path className="ns-link" d="M340 256 C 378 256, 396 158, 420 158" />
            </g>
            <g className="ns-row" style={{ animationDelay: '0.90s' }}>
                <rect className="ns-item" x="40" y="284" width="300" height="32" rx="2" />
                <text className="tx-item ns-hl" x="56" y="300" dominantBaseline="central">미분양 물량 최대치 경신</text>
                <path className="ns-link" d="M340 300 C 378 300, 396 310, 420 310" />
            </g>

            <g className="ns-lane">
                <rect className="ns-bin is-pos" x="420" y="136" width="184" height="44" rx="3" />
                <text className="tx tx-g" x="512" y="158" textAnchor="middle" dominantBaseline="central">positive</text>
                <rect className="ns-bin" x="420" y="288" width="184" height="44" rx="3" />
                <text className="tx" x="512" y="310" textAnchor="middle" dominantBaseline="central">negative</text>
            </g>

            <text className="tx ns-note" x="40" y="352">labelled by hand → training data</text>
        </svg>
    ),
    // 부동산 뉴스 감정분석 · 전이학습 — 사전학습 층은 무채색(고정), 새로 학습한
    // 분류 헤드만 골드로 둬서 전이학습이 무엇인지가 색으로 읽힌다. 카드 07의 세로
    // 계층은 데이터가 흐르는 단계이고, 이건 한 모델의 내부 구조다. 10초 루프.
    'realestate-sentiment': (
        <svg viewBox="0 20 640 400" preserveAspectRatio="xMidYMid meet">
            <text className="tx tx-g" x="40" y="84">transfer learning</text>
            <text className="tx" x="40" y="108">a new head on a pretrained body</text>

            {/* 새로 학습한 분류 헤드 */}
            <g className="tl-head">
                <rect className="tl-layer is-new" x="60" y="150" width="270" height="46" rx="3" />
                <text className="tx tx-g" x="195" y="166" textAnchor="middle" dominantBaseline="central">new classifier head</text>
                <text className="tx" x="195" y="182" textAnchor="middle" dominantBaseline="central">trained on our labels</text>
                <circle className="dot tl-pulse" cx="86" cy="173" r="4" />
            </g>

            {/* 사전학습 본체 — 고정 */}
            <g className="tl-body">
                <rect className="tl-layer" x="60" y="204" width="270" height="34" rx="2" />
                <rect className="tl-layer" x="60" y="244" width="270" height="34" rx="2" />
                <rect className="tl-layer" x="60" y="284" width="270" height="34" rx="2" />
                <text className="tx tl-name" x="195" y="221" textAnchor="middle" dominantBaseline="central">kobert</text>
                <text className="tx tl-name" x="195" y="261" textAnchor="middle" dominantBaseline="central">ab-albert</text>
                <text className="tx" x="195" y="301" textAnchor="middle" dominantBaseline="central">pretrained · frozen</text>
            </g>

            <text className="tx tl-cap" x="60" y="340">only the top layer learns our task</text>

            {/* 모듈 사슬 */}
            <text className="tx tl-modttl" x="424" y="136">modules</text>
            <g className="tl-mod" style={{ animationDelay: '0.50s' }}>
                <rect className="tl-box" x="424" y="150" width="180" height="34" rx="2" />
                <text className="tx" x="514" y="167" textAnchor="middle" dominantBaseline="central">preprocess</text>
            </g>
            <g className="tl-mod" style={{ animationDelay: '0.65s' }}>
                <rect className="tl-box" x="424" y="198" width="180" height="34" rx="2" />
                <text className="tx" x="514" y="215" textAnchor="middle" dominantBaseline="central">train</text>
            </g>
            <g className="tl-mod" style={{ animationDelay: '0.80s' }}>
                <rect className="tl-box" x="424" y="246" width="180" height="34" rx="2" />
                <text className="tx" x="514" y="263" textAnchor="middle" dominantBaseline="central">predict</text>
            </g>
            <g className="tl-mod" style={{ animationDelay: '0.95s' }}>
                <rect className="tl-box" x="424" y="294" width="180" height="34" rx="2" />
                <text className="tx" x="514" y="311" textAnchor="middle" dominantBaseline="central">validate</text>
            </g>
            <path className="tl-flow" d="M514 184 V198" style={{ animationDelay: '0.60s' }} />
            <path className="tl-flow" d="M514 232 V246" style={{ animationDelay: '0.75s' }} />
            <path className="tl-flow" d="M514 280 V294" style={{ animationDelay: '0.90s' }} />
            <g className="tl-aws">
                <path className="tl-flow" d="M514 328 V344" style={{ animationDelay: '1.1s' }} />
                <text className="tx tx-g" x="514" y="358" textAnchor="middle">aws</text>
            </g>
        </svg>
    ),
    // 열차 수요예측 · 일 단위 자동화 고리 — 로드·전처리·훈련·예측·경합·저장 여섯
    // 마디를 표식이 10초에 한 바퀴 돌며 지나는 마디를 켠다. 오른쪽은 그날의 경합:
    // 매일 두 모델을 다시 훈련·경합시켜 그날의 모델을 정한다(+9%). 상자 배열이 아닌 고리로
    // 그린 이유는 "매일 반복된다"가 이 프로젝트의 핵심이기 때문이다.
    'korail-demand': (
        <svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid meet">
            <text className="tx tx-g" x="40" y="84">daily loop</text>

            {/* ── 왼쪽: 자동화 고리 ── */}
            <circle className="kl-ring" cx="180" cy="218" r="84" />
            <text className="tx kl-ttl" x="180" y="210" textAnchor="middle" dominantBaseline="central">daily</text>
            <text className="tx" x="180" y="228" textAnchor="middle" dominantBaseline="central">automated</text>

            <circle className="kl-node" cx="180" cy="134" r="4.5" />
            <circle className="kl-node" cx="252.7" cy="176" r="4.5" style={{ animationDelay: '1.667s' }} />
            <circle className="kl-node" cx="252.7" cy="260" r="4.5" style={{ animationDelay: '3.333s' }} />
            <circle className="kl-node" cx="180" cy="302" r="4.5" style={{ animationDelay: '5s' }} />
            <circle className="kl-node" cx="107.3" cy="260" r="4.5" style={{ animationDelay: '6.667s' }} />
            <circle className="kl-node" cx="107.3" cy="176" r="4.5" style={{ animationDelay: '8.333s' }} />

            <text className="tx" x="180" y="112" textAnchor="middle">load</text>
            <text className="tx" x="272" y="165">preprocess</text>
            <text className="tx" x="272" y="271">train</text>
            <text className="tx" x="180" y="324" textAnchor="middle">predict</text>
            <text className="tx" x="88" y="271" textAnchor="end">compare</text>
            <text className="tx" x="88" y="165" textAnchor="end">select</text>

            {/* 표식은 고리 중심을 축으로 도는 그룹 안에 둔다 */}
            <g className="kl-orbit">
                <circle className="kl-marker" cx="180" cy="134" r="5" />
            </g>

            {/* ── 오른쪽: 그날의 경합 ── */}
            <text className="tx kl-ttl kl-res" x="360" y="150">today · head-to-head</text>
            <g className="kl-res" style={{ animationDelay: '0.1s' }}>
                <text className="tx tx-g" x="360" y="196" dominantBaseline="central">deep model</text>
                <rect className="kl-bar is-win" x="474" y="191.5" width="120" height="9" rx="1" />
            </g>
            <g className="kl-res" style={{ animationDelay: '0.2s' }}>
                <text className="tx" x="360" y="228" dominantBaseline="central">statistical</text>
                <rect className="kl-bar" x="474" y="223.5" width="110" height="9" rx="1" style={{ animationDelay: '0.1s' }} />
            </g>
            <text className="tx-sum kl-sum" x="360" y="278"><tspan className="tx-hi">+9%</tspan> vs statistical model</text>
            <text className="tx kl-sum" x="360" y="308" style={{ animationDelay: '0.1s' }}>both run daily · winner is kept</text>
        </svg>
    ),
    // 열차 좌석 점유 히트맵(칸=열차, 행=좌석 등급, 농도=예약률)과 그 아래
    // 예측 오차 비교 — 기존 통계 모델 대비 딥러닝 모델의 오차가 짧아지는 것이
    // "+9% 정확도"의 근거로 눈에 보인다. 10초 루프.
    // 왼쪽: 열차 측면도 — 객차별 예측 점유율이 아래에서 차오르고, 가장 붐빌
    // 객차가 골드 테두리로 선택된다. 오른쪽: 그 객차의 좌석 배치도 —
    // 이미 예약된 좌석(채움)과 모델이 출발까지 팔릴 것으로 본 좌석(점선)을
    // 구분해 "예측"이라는 성격이 드러난다. 10초 루프.
    // viewBox 시작점만 옮겨 그림을 가운데에 뒀다 — 내용 좌표는 그대로다.
    // 원래 좌우 34/74, 상하 78/30 으로 왼쪽·아래로 쏠려 있었다.
    'korail-demand-service': (
        <svg viewBox="-20 24 640 400" preserveAspectRatio="xMidYMid meet">
            {/* ── 왼쪽: KTX 측면도 (뾰족한 앞머리 · 창문 띠 · 대차) ── */}
            <text className="tx tx-g" x="40" y="84">predicted occupancy by car</text>
            <text className="tx" x="40" y="106">departure in 3 days</text>

            {/* 선로 */}
            <line className="rail" x1="34" y1="204" x2="308" y2="204" />

            {/* 동력차 앞머리 — 길게 빠진 노즈 */}
            <path className="ktx-nose" d="M40 196 L40 186 C48 166 66 152 92 150 L92 196 Z" />
            <rect className="ktx-win" x="66" y="160" width="20" height="8" rx="1.5" />

            <g className="cars">
                <rect className="ktx-fill" x="92" y="153.7" width="32" height="42.3" style={{ animationDelay: '0.00s' }} />
                <rect className="ktx-win" x="96" y="159" width="24" height="9" rx="1.5" />
                <rect className="ktx-car" x="92" y="150" width="32" height="46" rx="2" />
                <text className="tx-car" x="108" y="226" textAnchor="middle">1</text>
                <rect className="ktx-fill" x="127" y="160.1" width="32" height="35.9" style={{ animationDelay: '0.10s' }} />
                <rect className="ktx-win" x="131" y="159" width="24" height="9" rx="1.5" />
                <rect className="ktx-car" x="127" y="150" width="32" height="46" rx="2" />
                <text className="tx-car" x="143" y="226" textAnchor="middle">2</text>
                <rect className="ktx-fill" x="162" y="167.5" width="32" height="28.5" style={{ animationDelay: '0.20s' }} />
                <rect className="ktx-win" x="166" y="159" width="24" height="9" rx="1.5" />
                <rect className="ktx-car" x="162" y="150" width="32" height="46" rx="2" />
                <text className="tx-car" x="178" y="226" textAnchor="middle">3</text>
                <rect className="ktx-fill" x="197" y="152.3" width="32" height="43.7" style={{ animationDelay: '0.30s' }} />
                <rect className="ktx-win" x="201" y="159" width="24" height="9" rx="1.5" />
                <rect className="ktx-car is-sel" x="197" y="150" width="32" height="46" rx="2" />
                <text className="tx-car" x="213" y="226" textAnchor="middle">4</text>
                <rect className="ktx-fill" x="232" y="175.8" width="32" height="20.2" style={{ animationDelay: '0.40s' }} />
                <rect className="ktx-win" x="236" y="159" width="24" height="9" rx="1.5" />
                <rect className="ktx-car" x="232" y="150" width="32" height="46" rx="2" />
                <text className="tx-car" x="248" y="226" textAnchor="middle">5</text>
                <rect className="ktx-fill" x="267" y="182.2" width="32" height="13.8" style={{ animationDelay: '0.50s' }} />
                <rect className="ktx-win" x="271" y="159" width="24" height="9" rx="1.5" />
                <rect className="ktx-car" x="267" y="150" width="32" height="46" rx="2" />
                <text className="tx-car" x="283" y="226" textAnchor="middle">6</text>
            </g>

            {/* 대차 */}
            <g>
                <rect className="ktx-bogie" x="52" y="196" width="14" height="6" rx="2.5" />
                <rect className="ktx-bogie" x="86" y="196" width="14" height="6" rx="2.5" />
                <rect className="ktx-bogie" x="121" y="196" width="14" height="6" rx="2.5" />
                <rect className="ktx-bogie" x="156" y="196" width="14" height="6" rx="2.5" />
                <rect className="ktx-bogie" x="191" y="196" width="14" height="6" rx="2.5" />
                <rect className="ktx-bogie" x="226" y="196" width="14" height="6" rx="2.5" />
                <rect className="ktx-bogie" x="261" y="196" width="14" height="6" rx="2.5" />
                <rect className="ktx-bogie" x="285" y="196" width="14" height="6" rx="2.5" />
            </g>

            {/* ── 왼쪽 아래: 노선 구간별 혼잡도 (굵기·농도 = 혼잡도) ── */}
            <text className="tx tx-g" x="40" y="270">demand by segment</text>
            <g className="route">
                <line className="route-seg" x1="52" y1="300" x2="134" y2="300" strokeWidth="8.2" stroke="rgba(201,160,99,0.73)" style={{ animationDelay: '0.00s' }} />
                <line className="route-seg" x1="134" y1="300" x2="216" y2="300" strokeWidth="6.3" stroke="rgba(201,160,99,0.59)" style={{ animationDelay: '0.18s' }} />
                <line className="route-seg" x1="216" y1="300" x2="298" y2="300" strokeWidth="4.4" stroke="rgba(201,160,99,0.44)" style={{ animationDelay: '0.36s' }} />
                <circle className="route-dot" cx="52" cy="300" r="4" style={{ animationDelay: '0.00s' }} />
                <text className="tx-st" x="52" y="322" textAnchor="start">Seoul</text>
                <circle className="route-dot" cx="134" cy="300" r="4" style={{ animationDelay: '0.18s' }} />
                <text className="tx-st" x="134" y="322" textAnchor="middle">Daejeon</text>
                <circle className="route-dot" cx="216" cy="300" r="4" style={{ animationDelay: '0.36s' }} />
                <text className="tx-st" x="216" y="322" textAnchor="middle">Dongdaegu</text>
                <circle className="route-dot" cx="298" cy="300" r="4" style={{ animationDelay: '0.54s' }} />
                <text className="tx-st" x="298" y="322" textAnchor="end">Busan</text>
            </g>
            <text className="tx" x="40" y="366">thicker = busier segment</text>

            {/* 선택 표시 → 오른쪽으로 */}
            <path className="ln-d rec-arrow" d="M312 172 H336" />
            <path className="rec-head rec-arrow" d="M338 166 L352 172 L338 178 Z" />

            {/* ── 오른쪽: 선택 객차 좌석 배치도 ── */}
            <text className="tx tx-g" x="380" y="84">car 4 · seat map</text>
            <rect className="car-shell" x="380" y="100" width="180" height="200" rx="10" />
            <line className="aisle" x1="470" y1="112" x2="470" y2="288" />
            <g className="seatmap">
                <rect className="seat seat-p" x="402" y="126" width="24" height="18" rx="2" style={{ animationDelay: '0.00s' }} />
                <rect className="seat seat-b" x="434" y="126" width="24" height="18" rx="2" style={{ animationDelay: '0.03s' }} />
                <rect className="seat seat-b" x="482" y="126" width="24" height="18" rx="2" style={{ animationDelay: '0.06s' }} />
                <rect className="seat seat-b" x="514" y="126" width="24" height="18" rx="2" style={{ animationDelay: '0.09s' }} />
                <rect className="seat seat-p" x="402" y="152" width="24" height="18" rx="2" style={{ animationDelay: '0.16s' }} />
                <rect className="seat seat-b" x="434" y="152" width="24" height="18" rx="2" style={{ animationDelay: '0.15s' }} />
                <rect className="seat seat-b" x="482" y="152" width="24" height="18" rx="2" style={{ animationDelay: '0.18s' }} />
                <rect className="seat seat-p" x="514" y="152" width="24" height="18" rx="2" style={{ animationDelay: '0.28s' }} />
                <rect className="seat seat-e" x="402" y="178" width="24" height="18" rx="2" />
                <rect className="seat seat-b" x="434" y="178" width="24" height="18" rx="2" style={{ animationDelay: '0.27s' }} />
                <rect className="seat seat-b" x="482" y="178" width="24" height="18" rx="2" style={{ animationDelay: '0.30s' }} />
                <rect className="seat seat-p" x="514" y="178" width="24" height="18" rx="2" style={{ animationDelay: '0.44s' }} />
                <rect className="seat seat-p" x="402" y="204" width="24" height="18" rx="2" style={{ animationDelay: '0.48s' }} />
                <rect className="seat seat-b" x="434" y="204" width="24" height="18" rx="2" style={{ animationDelay: '0.39s' }} />
                <rect className="seat seat-b" x="482" y="204" width="24" height="18" rx="2" style={{ animationDelay: '0.42s' }} />
                <rect className="seat seat-e" x="514" y="204" width="24" height="18" rx="2" />
                <rect className="seat seat-p" x="402" y="230" width="24" height="18" rx="2" style={{ animationDelay: '0.64s' }} />
                <rect className="seat seat-b" x="434" y="230" width="24" height="18" rx="2" style={{ animationDelay: '0.51s' }} />
                <rect className="seat seat-b" x="482" y="230" width="24" height="18" rx="2" style={{ animationDelay: '0.54s' }} />
                <rect className="seat seat-p" x="514" y="230" width="24" height="18" rx="2" style={{ animationDelay: '0.76s' }} />
                <rect className="seat seat-b" x="402" y="256" width="24" height="18" rx="2" style={{ animationDelay: '0.60s' }} />
                <rect className="seat seat-p" x="434" y="256" width="24" height="18" rx="2" style={{ animationDelay: '0.84s' }} />
                <rect className="seat seat-b" x="482" y="256" width="24" height="18" rx="2" style={{ animationDelay: '0.66s' }} />
                <rect className="seat seat-b" x="514" y="256" width="24" height="18" rx="2" style={{ animationDelay: '0.69s' }} />
            </g>

            {/* 범례 + 요약 */}
            <g>
                <rect className="seat seat-b lg" x="380" y="322" width="16" height="12" rx="2" />
                <text className="tx" x="404" y="332">booked</text>
                <rect className="seat seat-p lg" x="470" y="322" width="16" height="12" rx="2" />
                <text className="tx" x="494" y="332">predicted</text>
            </g>
            <text className="tx-sum" x="380" y="366">42<tspan className="tx-unit"> booked</tspan>  →  <tspan className="tx-hi">68</tspan><tspan className="tx-unit"> at departure</tspan></text>
        </svg>
    ),
    // 초기 프로젝트 4종 · 무엇을 만들었나 — 네 칸에 각 프로젝트를 나타내는 작은
    // 그림을 넣는다. 성격이 다른 넷이라 하나의 흐름으로 묶지 않고 격자로 병치한다.
    'early-projects-service': (
        <svg viewBox="0 23 640 400" preserveAspectRatio="xMidYMid meet">
            <text className="tx tx-g" x="40" y="84">four early projects</text>
            <text className="tx" x="40" y="108">web, model, and the api that served it</text>

            {/* 구직자 추천 */}
            <g className="ep-cell">
                <rect className="ep-box" x="40" y="140" width="268" height="104" rx="3" />
                <text className="tx ep-name" x="62" y="166" dominantBaseline="central">job-seeker recommender</text>
                <rect className="ep-bar" x="62" y="192" width="120" height="7" rx="3" />
                <rect className="ep-bar is-dim" x="62" y="206" width="86" height="7" rx="3" />
                <rect className="ep-bar is-dim" x="62" y="220" width="58" height="7" rx="3" />
                <text className="tx" x="286" y="228" textAnchor="end" dominantBaseline="central">2019</text>
            </g>

            {/* 마스크 인식 */}
            <g className="ep-cell" style={{ animationDelay: '0.2s' }}>
                <rect className="ep-box" x="332" y="140" width="268" height="104" rx="3" />
                <text className="tx ep-name" x="354" y="166" dominantBaseline="central">mask detection</text>
                <ellipse className="ep-face" cx="396" cy="206" rx="24" ry="28" />
                <path className="ep-mask" d="M374 206 q22 14 44 0 v14 q-22 12 -44 0 z" />
                <rect className="ep-det" x="366" y="176" width="60" height="60" rx="2" />
                <text className="tx tx-g" x="436" y="206" dominantBaseline="central">mask 0.96</text>
                <text className="tx" x="578" y="228" textAnchor="end" dominantBaseline="central">2019–20</text>
            </g>

            {/* 픽토그램 엣지 */}
            <g className="ep-cell" style={{ animationDelay: '0.4s' }}>
                <rect className="ep-box" x="40" y="264" width="268" height="104" rx="3" />
                <text className="tx ep-name" x="62" y="290" dominantBaseline="central">pictogram edge</text>
                <path className="ep-solid" d="M76 312 h44 v40 h-44 z M86 306 a12 12 0 0 1 24 0" />
                <path className="ep-flow" d="M136 330 H164" />
                <path className="ep-edge" d="M180 312 h44 v40 h-44 z M190 306 a12 12 0 0 1 24 0" />
                <text className="tx" x="286" y="352" textAnchor="end" dominantBaseline="central">2021</text>
            </g>

            {/* 관광지 추천 */}
            <g className="ep-cell" style={{ animationDelay: '0.6s' }}>
                <rect className="ep-box" x="332" y="264" width="268" height="104" rx="3" />
                <text className="tx ep-name" x="354" y="290" dominantBaseline="central">tourism recommender</text>
                <path className="ep-pin" d="M374 344 c-12 -14 -18 -22 -18 -30 a18 18 0 0 1 36 0 c0 8 -6 16 -18 30 z" />
                <circle className="ep-pindot" cx="374" cy="314" r="6" />
                <rect className="ep-bar" x="410" y="308" width="96" height="7" rx="3" />
                <rect className="ep-bar is-dim" x="410" y="322" width="68" height="7" rx="3" />
                <text className="tx" x="578" y="352" textAnchor="end" dominantBaseline="central">2019</text>
            </g>
        </svg>
    ),
    // 초기 프로젝트 4종 · 언제 무엇으로 — 2019.07~2021.08 가로 타임라인에 네 프로젝트를
    // 막대로 놓는다. 기간이 겹치고 짧다는 사실 자체가 "초기 프로젝트들"의 성격이다.
    // 막대 아래에 각자 쓴 기술을 단다. 10초 루프.
    'early-projects': (
        <svg viewBox="0 12 640 400" preserveAspectRatio="xMidYMid meet">
            <text className="tx tx-g" x="40" y="84">2019 — 2021</text>
            <text className="tx" x="40" y="108">what each one was built with</text>

            <g className="ep-axis">
                <line className="g" x1="150" y1="140" x2="150" y2="336" strokeWidth="1" />
                <text className="tx" x="150" y="352" textAnchor="middle">2019</text>
                <line className="g" x1="253" y1="140" x2="253" y2="336" strokeWidth="1" />
                <text className="tx" x="253" y="352" textAnchor="middle">2020</text>
                <line className="g" x1="460" y1="140" x2="460" y2="336" strokeWidth="1" />
                <text className="tx" x="460" y="352" textAnchor="middle">2021</text>
                <line className="axis" x1="40" y1="336" x2="604" y2="336" />
            </g>

            <g className="ep-row" style={{ animationDelay: '0.00s' }}>
                <text className="tx ep-name" x="40" y="156" dominantBaseline="central">mask detection</text>
                <rect className="ep-span" x="150" y="151" width="189" height="10" rx="5" />
                <text className="tx" x="150" y="174" dominantBaseline="central">labelling · custom training · detection api</text>
            </g>
            <g className="ep-row" style={{ animationDelay: '0.18s' }}>
                <text className="tx ep-name" x="40" y="206" dominantBaseline="central">tourism rec</text>
                <rect className="ep-span" x="167" y="201" width="22" height="10" rx="5" />
                <text className="tx" x="167" y="224" dominantBaseline="central">survey analysis · recommender api</text>
            </g>
            <g className="ep-row" style={{ animationDelay: '0.36s' }}>
                <text className="tx ep-name" x="40" y="256" dominantBaseline="central">job-seeker rec</text>
                <rect className="ep-span" x="184" y="251" width="34" height="10" rx="5" />
                <text className="tx" x="184" y="274" dominantBaseline="central">web · aws rds · recommender api</text>
            </g>
            <g className="ep-row" style={{ animationDelay: '0.54s' }}>
                <text className="tx ep-name" x="40" y="306" dominantBaseline="central">pictogram edge</text>
                <rect className="ep-span" x="528" y="301" width="52" height="10" rx="5" />
                <text className="tx" x="382" y="324" dominantBaseline="central">canny edge · dexined comparison</text>
            </g>
        </svg>
    ),
}

// 인덱스 카드에 아키텍처 도식을 쓰는 프로젝트.
// RAG 챗봇은 서비스 도식이 카드 01(Text-to-SQL)의 채팅 화면과 거의 같아 보여서,
// 그리드에 나란히 놓이면 같은 카드가 두 장 있는 것처럼 읽힌다. 인덱스에서는
// 검색 구조를 보여주고 채팅은 상세에서만 쓴다.
const INDEX_USES_ARCH = new Set(['rag-chatbot'])

// 인덱스 카드가 쓸 도식 — 기본은 서비스("무엇을 해주나") 쪽이다.
export function indexViz(id) {
    if (INDEX_USES_ARCH.has(id)) return WORK_VIZ[id]
    return WORK_VIZ[`${id}-service`] || WORK_VIZ[id]
}

// 상세 페이지 도식 캡션 — 왼쪽(무엇을 해주나) / 오른쪽(어떻게 만들었나).
// 프로젝트마다 두 도식의 성격이 달라서 문구를 고정해두면 어긋난다.
const VIZ_CAPS = {
    'text-to-sql-agent': {
        service: 'Service flow — ask in plain language, get an answer',
        arch: 'Architecture — how it is built',
    },
    'early-projects': {
        service: 'Four early projects — recommendation, detection, edges',
        arch: 'Timeline — when each one ran and what it used',
    },
    'realestate-sentiment': {
        service: 'Labelling — headlines sorted by sentiment',
        arch: 'Transfer learning — a new head on a pretrained body',
    },
    'retail-analytics': {
        service: 'From one receipt — who bought it, and what goes together',
        arch: 'Shared data — four models, one service',
    },
    'rag-chatbot': {
        service: 'Answer with sources — every reply cites where it came from',
        arch: 'Retrieval — how the prompt gets assembled',
    },
    'promotion-analytics': {
        service: 'Profit structure — where a deeper discount stops paying',
        arch: 'Analysis to decision — what each question changed',
    },
    'sports-posture': {
        service: 'Comparison — your pose against the reference',
        arch: 'Swing timeline — where it happens and how fast',
    },
    'crypto-prediction': {
        service: 'Signal — price and volume the platform receives',
        arch: 'Clustering — group first, then predict',
    },
    'data-platform-optimization': {
        service: 'Dashboard — what the business teams actually open',
        arch: 'Source to mart — heavy tables made light and purpose-built',
    },
    'snowflake-pipeline': {
        service: 'Integration — scattered sources in one lake',
        arch: 'Layers — how the data gets there',
    },
    'promo-generator': {
        service: 'Batch output — one spreadsheet becomes hundreds of posters',
        arch: 'Layout engine — what the renderer decides for each poster',
    },
    'showcard-inspection': {
        service: 'Inspection — every field checked against the master',
        arch: 'Two tracks — text matching and image embedding',
    },
    'korail-demand': {
        service: 'Forecast — seats filling before departure',
        arch: 'Daily loop — retrained and re-scored every day',
    },
    'store-recommendation': {
        service: 'Recommendation — similar stores decide what to order',
        arch: 'Pipeline — running it daily at 100M-record scale',
    },
    'parts-order-forecasting': {
        service: 'Forecast — the demand the model expects',
        arch: 'Model selection — how the model was chosen',
    },
}

const CAP_FALLBACK = { service: 'What it does', arch: 'How it is built' }

export function vizCaps(id) {
    return { ...CAP_FALLBACK, ...(VIZ_CAPS[id] || {}) }
}
