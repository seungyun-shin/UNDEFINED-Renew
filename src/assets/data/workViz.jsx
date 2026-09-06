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
    'showcard-inspection': (
        <svg viewBox="0 0 460 260" preserveAspectRatio="xMidYMid meet">
          <g transform="translate(60,44)">
            <rect className="bx" x="0" y="0" width="72" height="48" rx="2"/><rect className="bx" x="0" y="62" width="72" height="48" rx="2"/><rect className="bx" x="0" y="124" width="72" height="48" rx="2"/>
            <rect className="bx" x="268" y="0" width="72" height="48" rx="2"/><rect className="bx" x="268" y="62" width="72" height="48" rx="2"/><rect className="bx" x="268" y="124" width="72" height="48" rx="2"/>
            <path className="ln flow" d="M72 24 H268"/>
            <path className="ln flow" d="M72 86 H268" style={{ animationDelay: '.6s' }}/>
            <path className="ln-m flow" d="M72 148 H268" style={{ animationDelay: '1.2s' }}/>
            <text className="tx tx-g" x="170" y="18" textAnchor="middle">match</text>
            <text className="tx tx-g" x="170" y="80" textAnchor="middle">match</text>
            <text className="tx" x="170" y="142" textAnchor="middle">mismatch → flag</text>
            <text className="tx" x="36" y="192" textAnchor="middle">show-card pdf</text>
            <text className="tx" x="304" y="192" textAnchor="middle">product master</text>
          </g>
        </svg>
    ),
    'promo-generator': (
        <svg viewBox="0 0 460 260" preserveAspectRatio="xMidYMid meet">
          <rect className="bx" x="30" y="96" width="86" height="60" rx="2"/>
          <text className="tx tx-g" x="73" y="122" textAnchor="middle">excel</text>
          <text className="tx" x="73" y="138" textAnchor="middle">product list</text>
          <path className="ln flow" d="M116 126 H168"/>
          <g>
            <rect className="bx" x="176" y="52" width="64" height="44" rx="2"/><rect className="bx" x="176" y="104" width="64" height="44" rx="2"/><rect className="bx" x="176" y="156" width="64" height="44" rx="2"/>
            <rect className="bx" x="252" y="52" width="64" height="44" rx="2"/><rect className="bx" x="252" y="104" width="64" height="44" rx="2"/><rect className="bx" x="252" y="156" width="64" height="44" rx="2"/>
            <rect className="bx" x="328" y="52" width="64" height="44" rx="2"/><rect className="bx" x="328" y="104" width="64" height="44" rx="2"/><rect className="bx" x="328" y="156" width="64" height="44" rx="2"/>
          </g>
          <rect x="176" y="52" width="64" height="44" fill="rgba(201,160,99,.16)" className="pulse"/>
          <rect x="252" y="104" width="64" height="44" fill="rgba(201,160,99,.16)" className="pulse" style={{ animationDelay: '.7s' }}/>
          <rect x="328" y="156" width="64" height="44" fill="rgba(201,160,99,.16)" className="pulse" style={{ animationDelay: '1.4s' }}/>
          <text className="tx" x="284" y="222" textAnchor="middle">1,200 promo images · batch</text>
        </svg>
    ),
    'promotion-analytics': (
        <svg viewBox="0 0 460 260" preserveAspectRatio="xMidYMid meet">
          <g className="g" strokeWidth="1"><line x1="40" y1="60" x2="420" y2="60"/><line x1="40" y1="104" x2="420" y2="104"/><line x1="40" y1="148" x2="420" y2="148"/><line x1="40" y1="192" x2="420" y2="192"/></g>
          <g>
            <rect x="60" y="126" width="26" height="66" fill="rgba(232,226,214,.16)"/>
            <rect x="106" y="150" width="26" height="42" fill="rgba(232,226,214,.16)"/>
            <rect x="152" y="112" width="26" height="80" fill="rgba(232,226,214,.16)"/>
            <rect x="198" y="140" width="26" height="52" fill="rgba(232,226,214,.16)"/>
            <rect x="244" y="86" width="26" height="106" fill="rgba(201,160,99,.55)" className="pulse"/>
            <rect x="290" y="132" width="26" height="60" fill="rgba(232,226,214,.16)"/>
            <rect x="336" y="118" width="26" height="74" fill="rgba(232,226,214,.16)"/>
          </g>
          <path className="ln-d" d="M40 96 H420"/>
          <text className="tx tx-g" x="420" y="90" textAnchor="end">outlier</text>
          <text className="tx" x="40" y="218">competitor promo structure · anomaly detection</text>
        </svg>
    ),
    // 부품 수요 예측 — 완만한 추세 + 계절성 위에 잔변동과 단발 스파이크가 섞인
    // 실제 수요(회색)를, 모델(골드)이 과적합 없이 따라간다. 경계 이후는 점선 예측 +
    // 지평이 멀수록 넓어지는 신뢰구간. 차트 영역 x 72~596 / y 78~286.
    'parts-order-forecasting': (
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
    'snowflake-pipeline': (
        <svg viewBox="0 0 460 260" preserveAspectRatio="xMidYMid meet">
          <rect className="bx" x="30" y="70" width="82" height="44" rx="2"/><rect className="bx" x="30" y="140" width="82" height="44" rx="2"/>
          <rect className="bx" x="182" y="105" width="82" height="44" rx="2"/>
          <rect className="bx" x="334" y="105" width="94" height="44" rx="2"/>
          <text className="tx" x="71" y="96" textAnchor="middle">on-prem db</text>
          <text className="tx" x="71" y="166" textAnchor="middle">external</text>
          <text className="tx tx-g" x="223" y="131" textAnchor="middle">dms · glue · s3</text>
          <text className="tx tx-g" x="381" y="131" textAnchor="middle">snowflake</text>
          <path className="ln flow" d="M112 92 H148 V127 H182"/>
          <path className="ln flow" d="M112 162 H148 V127 H182" style={{ animationDelay: '.7s' }}/>
          <path className="ln flow" d="M264 127 H334" style={{ animationDelay: '1.3s' }}/>
          <text className="tx" x="230" y="212" textAnchor="middle">structured + unstructured → data lake</text>
        </svg>
    ),
    // 왼쪽: 대상 점포와 유사 점포 그래프(선은 원 경계에서 끊어 관통하지 않는다).
    // 오른쪽: 그 유사 점포들의 판매 이력에서 뽑아낸 추천 상품과 예상 판매량.
    // 10초 루프 — 선이 뻗음 → 유사 점포 선정 → 추천 목록이 차례로 채워짐.
    'store-recommendation': (
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
    'rag-chatbot': (
        <svg viewBox="0 0 460 260" preserveAspectRatio="xMidYMid meet">
          <rect className="bx" x="26" y="56" width="74" height="34" rx="2"/><rect className="bx" x="26" y="104" width="74" height="34" rx="2"/><rect className="bx" x="26" y="152" width="74" height="34" rx="2"/>
          <text className="tx" x="63" y="77" textAnchor="middle">docs</text><text className="tx" x="63" y="125" textAnchor="middle">tables</text><text className="tx" x="63" y="173" textAnchor="middle">logs</text>
          <path className="ln flow" d="M100 73 H144 V121 H176"/><path className="ln flow" d="M100 121 H176" style={{ animationDelay: '.5s' }}/><path className="ln flow" d="M100 169 H144 V121 H176" style={{ animationDelay: '1s' }}/>
          <rect className="bx" x="176" y="99" width="96" height="44" rx="2"/>
          <text className="tx tx-g" x="224" y="125" textAnchor="middle">cognitive search</text>
          <path className="ln flow" d="M272 121 H316" style={{ animationDelay: '1.4s' }}/>
          <rect className="bx" x="316" y="99" width="112" height="44" rx="2"/>
          <text className="tx tx-g" x="372" y="125" textAnchor="middle">gpt · prompt</text>
          <text className="tx" x="372" y="176" textAnchor="middle">grounded answer</text>
          <path className="ln-m" d="M372 143 V162"/>
        </svg>
    ),
    'retail-analytics': (
        <svg viewBox="0 0 460 260" preserveAspectRatio="xMidYMid meet">
          <text className="tx" x="30" y="52">receipt</text>
          <rect className="bx" x="30" y="60" width="80" height="52" rx="2"/>
          <path className="ln flow" d="M110 86 H162"/>
          <rect className="bx" x="162" y="60" width="86" height="52" rx="2"/>
          <text className="tx tx-g" x="205" y="90" textAnchor="middle">gender · age</text>
          <text className="tx" x="30" y="164">card data</text>
          <rect className="bx" x="30" y="172" width="80" height="52" rx="2"/>
          <path className="ln flow" d="M110 198 H162" style={{ animationDelay: '.6s' }}/>
          <rect className="bx" x="162" y="172" width="86" height="52" rx="2"/>
          <text className="tx tx-g" x="205" y="202" textAnchor="middle">basket mix</text>
          <path className="ln-m" d="M248 86 H300 V142 H340"/><path className="ln-m" d="M248 198 H300 V142 H340"/>
          <rect className="bx" x="340" y="118" width="90" height="48" rx="2"/>
          <text className="tx tx-g" x="385" y="146" textAnchor="middle">promo forecast</text>
        </svg>
    ),
    'data-platform-optimization': (
        <svg viewBox="0 0 460 260" preserveAspectRatio="xMidYMid meet">
          <text className="tx" x="40" y="52">before</text><text className="tx tx-g" x="40" y="150">after</text>
          <g>
            <rect x="40" y="60" width="360" height="26" fill="rgba(232,226,214,.14)"/>
            <text className="tx" x="410" y="78">30 h · ₩930k/day</text>
          </g>
          <g>
            <rect x="40" y="158" width="36" height="26" fill="rgba(201,160,99,.6)" className="pulse"/>
            <text className="tx tx-g" x="86" y="176">1 h · &lt;₩100k/day</text>
          </g>
          <path className="ln-d" d="M76 100 V150"/>
          <text className="tx" x="40" y="222">parquet · delta · partitioning · pyspark</text>
        </svg>
    ),
    'crypto-prediction': (
        <svg viewBox="0 0 460 260" preserveAspectRatio="xMidYMid meet">
          <g>
            <circle className="dot-m" cx="96" cy="82" r="3"/><circle className="dot-m" cx="118" cy="104" r="3"/><circle className="dot-m" cx="82" cy="118" r="3"/><circle className="dot-m" cx="132" cy="76" r="3"/><circle className="dot-m" cx="104" cy="140" r="3"/>
            <circle cx="108" cy="106" r="46" fill="none" stroke="rgba(201,160,99,.35)" strokeDasharray="3 4"/>
            <circle className="dot-m" cx="248" cy="72" r="3"/><circle className="dot-m" cx="272" cy="96" r="3"/><circle className="dot-m" cx="238" cy="106" r="3"/><circle className="dot-m" cx="266" cy="132" r="3"/>
            <circle cx="256" cy="100" r="42" fill="none" stroke="rgba(201,160,99,.35)" strokeDasharray="3 4"/>
            <circle className="dot-m" cx="378" cy="98" r="3"/><circle className="dot-m" cx="398" cy="120" r="3"/><circle className="dot-m" cx="362" cy="126" r="3"/>
            <circle cx="380" cy="114" r="36" fill="none" stroke="rgba(201,160,99,.35)" strokeDasharray="3 4"/>
          </g>
          <path className="ln draw" style={{ '--len': '420' }} d="M40 214 L100 200 L160 208 L220 186 L280 196 L340 172 L420 180"/>
          <text className="tx" x="40" y="240">10,000+ assets · clustering → price / volume</text>
        </svg>
    ),
    'sports-posture': (
        <svg viewBox="0 0 460 260" preserveAspectRatio="xMidYMid meet">
          <g stroke="rgba(232,226,214,.3)" strokeWidth="1.4" fill="none">
            <path d="M150 58 V104 M150 104 L118 138 M150 104 L184 132 M150 104 V162 M150 162 L124 214 M150 162 L180 212"/>
          </g>
          <g><circle className="dot-m" cx="150" cy="52" r="5"/><circle className="dot-m" cx="150" cy="104" r="4"/><circle className="dot-m" cx="118" cy="138" r="4"/><circle className="dot-m" cx="184" cy="132" r="4"/><circle className="dot-m" cx="150" cy="162" r="4"/><circle className="dot-m" cx="124" cy="214" r="4"/><circle className="dot-m" cx="180" cy="212" r="4"/></g>
          <g stroke="rgba(201,160,99,.75)" strokeWidth="1.6" fill="none">
            <path d="M310 58 V104 M310 104 L282 142 M310 104 L346 126 M310 104 V162 M310 162 L286 214 M310 162 L342 210"/>
          </g>
          <g><circle className="dot" cx="310" cy="52" r="5"/><circle className="dot" cx="310" cy="104" r="4"/><circle className="dot" cx="282" cy="142" r="4"/><circle className="dot" cx="346" cy="126" r="4"/><circle className="dot" cx="310" cy="162" r="4"/><circle className="dot" cx="286" cy="214" r="4"/><circle className="dot" cx="342" cy="210" r="4"/></g>
          <path className="ln-d" d="M200 132 H262"/>
          <text className="tx tx-g" x="231" y="124" textAnchor="middle">similarity</text>
          <text className="tx" x="150" y="240" textAnchor="middle">learner</text><text className="tx" x="310" y="240" textAnchor="middle">reference</text>
        </svg>
    ),
    'realestate-sentiment': (
        <svg viewBox="0 0 460 260" preserveAspectRatio="xMidYMid meet">
          <text className="tx" x="34" y="106">news article</text>
          <path className="ln flow" d="M110 100 H176"/>
          <rect className="bx" x="176" y="78" width="92" height="44" rx="2"/>
          <text className="tx tx-g" x="222" y="104" textAnchor="middle">kobert · albert</text>
          <path className="ln" d="M268 100 H310 V62 H360"/>
          <path className="ln-m" d="M268 100 H310 V138 H360"/>
          <text className="tx tx-g" x="368" y="66">positive</text><text className="tx" x="368" y="142">negative</text>
          <rect x="34" y="182" width="228" height="10" fill="rgba(201,160,99,.55)"/>
          <rect x="262" y="182" width="124" height="10" fill="rgba(232,226,214,.14)"/>
          <text className="tx" x="34" y="214">sentiment distribution over corpus</text>
        </svg>
    ),
    // 열차 좌석 점유 히트맵(칸=열차, 행=좌석 등급, 농도=예약률)과 그 아래
    // 예측 오차 비교 — 기존 통계 모델 대비 딥러닝 모델의 오차가 짧아지는 것이
    // "+9% 정확도"의 근거로 눈에 보인다. 10초 루프.
    // 왼쪽: 열차 측면도 — 객차별 예측 점유율이 아래에서 차오르고, 가장 붐빌
    // 객차가 골드 테두리로 선택된다. 오른쪽: 그 객차의 좌석 배치도 —
    // 이미 예약된 좌석(채움)과 모델이 출발까지 팔릴 것으로 본 좌석(점선)을
    // 구분해 "예측"이라는 성격이 드러난다. 10초 루프.
    'korail-demand': (
        <svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid meet">
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
    'early-projects': (
        <svg viewBox="0 0 460 260" preserveAspectRatio="xMidYMid meet">
          <g>
            <rect className="bx" x="34" y="60" width="176" height="52" rx="2"/><text className="tx tx-g" x="122" y="82" textAnchor="middle">job-seeker recommender</text><text className="tx" x="122" y="98" textAnchor="middle">web · rds · model api</text>
            <rect className="bx" x="250" y="60" width="176" height="52" rx="2"/><text className="tx tx-g" x="338" y="82" textAnchor="middle">mask detection</text><text className="tx" x="338" y="98" textAnchor="middle">labeling · custom train</text>
            <rect className="bx" x="34" y="136" width="176" height="52" rx="2"/><text className="tx tx-g" x="122" y="158" textAnchor="middle">pictogram edge model</text><text className="tx" x="122" y="174" textAnchor="middle">canny · dexined</text>
            <rect className="bx" x="250" y="136" width="176" height="52" rx="2"/><text className="tx tx-g" x="338" y="158" textAnchor="middle">tourism recommender</text><text className="tx" x="338" y="174" textAnchor="middle">survey · model api</text>
          </g>
          <circle className="dot pulse" cx="34" cy="52" r="2.5"/><circle className="dot pulse" cx="250" cy="52" r="2.5" style={{ animationDelay: '.5s' }}/>
          <circle className="dot pulse" cx="34" cy="128" r="2.5" style={{ animationDelay: '1s' }}/><circle className="dot pulse" cx="250" cy="128" r="2.5" style={{ animationDelay: '1.5s' }}/>
          <text className="tx" x="230" y="222" textAnchor="middle">4 early projects · end-to-end</text>
        </svg>
    ),
}
