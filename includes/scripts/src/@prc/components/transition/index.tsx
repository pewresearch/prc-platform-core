import { motion } from "framer-motion"

const Transition = ({ children }: { children: React.ReactNode }) => {
    return (
        <motion.div
        className="transition"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        >
        {children}
        </motion.div>
    )
}

export default Transition;