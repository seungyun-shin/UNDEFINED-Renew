// 판 하나가 통째로 사라지는 대신, 블라인드처럼 여러 조각이 왼쪽에서
// 오른쪽으로 시차를 두고 걷히도록 슬랫으로 쪼갠다.
const SLATS = Array.from({ length: 8 })

function IntroOverlay() {
    return (
        <div className="overlay-container">
            <div className="top">
                {SLATS.map((_, i) => <div className="overlay-top" key={i}></div>)}
            </div>
            <div className="bottom">
                {SLATS.map((_, i) => <div className="overlay-bottom" key={i}></div>)}
            </div>
        </div>
    )
}

export default IntroOverlay
