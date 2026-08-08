import { motion } from 'framer-motion'

// 배경(IcoBackground)과 헤더는 라우트가 바뀌어도 그대로 유지되고, 이 안의
// 페이지 콘텐츠만 크로스페이드된다. exit가 있어야 나가는 화면이 순간
// 사라지지 않고 같이 겹쳐 보이면서 넘어간다 (React Router는 기본적으로
// exit 애니메이션을 지원하지 않아 AnimatePresence로 언마운트를 늦춘다).
const variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] } },
    exit: { opacity: 0, transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] } },
}

// AnimatePresence는 크로스페이드 동안 나가는 페이지와 들어오는 페이지를
// 동시에 마운트해둔다. position을 안 주면 그냥 일반 흐름(block)이라 두
// 페이지가 위아래로 쌓여버려서, 들어오는 페이지의 콘텐츠가 나가는 페이지
// 높이만큼 아래로 밀려났다 — 이게 "로고 눌러 홈으로 돌아오면 타이틀이
// 화면 밖 아래에 있다 올라오는" 버그의 원인이었다. absolute로 겹치게 한다.
const wrapperStyle = { position: 'absolute', top: 0, left: 0, width: '100%' }

function PageTransition({ children }) {
    return (
        <motion.div style={wrapperStyle} variants={variants} initial="initial" animate="animate" exit="exit">
            {children}
        </motion.div>
    )
}

export default PageTransition
