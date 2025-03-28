console.log('placeholder');
import { motion } from "framer-motion"
// types of placeholders
// 1. paragraph
// 2. image
// 3. header

type PlaceholderType = "paragraph" | "image" | "header"

const Placeholder = ({ type }: { type: PlaceholderType }) => {
    return (
        <motion.div
        className="placeholder"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        >
        {type === "paragraph" && (
            <div className="placeholder__paragraph">
                <div className="placeholder__paragraph__line" />
                <div className="placeholder__paragraph__line" />
                <div className="placeholder__paragraph__line" />
                <div className="placeholder__paragraph__line" />
                <div className="placeholder__paragraph__line" />
            </div>
        )}
        {type === "image" && (
            <div className="placeholder__image">
            <div className="placeholder__image__line" />
            </div>
        )}
        {type === "header" && (
            <div className="placeholder__header">
            <div className="placeholder__header__line" />
            <div className="placeholder__header__line" />
            </div>
        )}
        </motion.div>
    )
}

export default Placeholder;