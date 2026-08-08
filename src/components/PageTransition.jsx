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

function PageTransition({ children }) {
    return (
        <motion.div variants={variants} initial="initial" animate="animate" exit="exit">
            {children}
        </motion.div>
    )
}

export default PageTransition
