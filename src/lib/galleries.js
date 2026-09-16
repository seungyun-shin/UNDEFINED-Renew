// 갤러리를 주소로 찾을 수 있게 하는 조회 계층.
//
// 예전엔 갤러리가 어느 장소인지를 router state 로만 받았다. 그래서 주소를
// 직접 치거나 새로고침하면 state 가 비어 사진이 통째로 사라졌고, 링크 공유도
// 불가능했다. 슬러그를 주소에 담아 그 셋을 모두 해결한다.
import countryPointData from '../assets/data/countryPoint.json'
import planetGalleries from '../assets/data/planetGalleries.json'

// 'Del Paine' → 'del-paine'. 이름에 영숫자·공백·하이픈 외 문자가 없음을
// 데이터에서 확인하고 만든 규칙이다(66개 전수 점검).
export function gallerySlug(name) {
    return String(name || '').trim().toLowerCase().replace(/\s+/g, '-')
}

const BY_SLUG = new Map()
countryPointData.forEach((p) => BY_SLUG.set(gallerySlug(p.name), p))
// 행성 갤러리 두 개는 여행 포인트가 아니라 별도 데이터다 — 키를 그대로 슬러그로 쓴다.
Object.entries(planetGalleries).forEach(([key, g]) => BY_SLUG.set(key, g))

export function findGallery(slug) {
    return BY_SLUG.get(gallerySlug(slug)) || null
}

// 지구본에서 넘어올 땐 그 화면이 그때 쓰던 강조색을 state 로 함께 받는다.
// 주소로 바로 들어오면 그 색이 없으므로 여기서 만든다.
//
// JSON 의 color 필드는 쓰지 않는다 — 65개 중 39개가 #ffffff 라 대부분 흰색이
// 되고, 지구본이 실제로 쓰는 색과도 다르다. EarthScreen 과 같은 팔레트에서
// 고르되 무작위가 아니라 _id 로 정해서, 같은 장소는 몇 번을 열어도 같은 색이
// 나오게 한다(링크를 공유했을 때도 서로 같은 화면을 본다).
const HIGHLIGHT_PALETTE = ['#C9A063', '#B5654A', '#6E8F82', '#93748F']

export function accentOf(gallery) {
    const id = gallery?._id
    if (typeof id !== 'number') return HIGHLIGHT_PALETTE[0]
    return HIGHLIGHT_PALETTE[id % HIGHLIGHT_PALETTE.length]
}

// 갤러리 푸터의 이전/다음. 목적지 목록과 같은 배열 순서를 쓰되 지역 경계는
// 넘어간다(전체를 한 줄로 훑는 게 목적). 처음과 끝은 이어 붙인다 — 65곳이라
// 끝에서 막히는 것보다 다시 처음으로 도는 편이 자연스럽다.
// 행성 갤러리(project·appreciate)는 이 목록에 없어서 앞뒤가 정의되지 않는다.
// null 을 돌려주면 화면에서 푸터를 그리지 않는다.
export function neighborsOf(slug) {
    const key = gallerySlug(slug)
    const i = countryPointData.findIndex((p) => gallerySlug(p.name) === key)
    if (i < 0) return null
    const n = countryPointData.length
    return {
        prev: countryPointData[(i - 1 + n) % n],
        next: countryPointData[(i + 1) % n],
    }
}
