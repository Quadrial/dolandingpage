
import {
  FaTwitter,
  FaDiscord,
  FaTelegram,
  FaGithub,
  FaPaperPlane,
} from "react-icons/fa";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 py-12 text-gray-300"
    >
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <motion.div variants={itemVariants}>
            <h3 className="text-white text-xl font-bold mb-4">DOMAIN.</h3>
            <p className="mb-4">
              The premier marketplace for Web3 domains with secure transactions
              and instant activation.
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-gray-400 hover:text-white"
                aria-label="Twitter"
              >
                <FaTwitter />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-gray-400 hover:text-white"
                aria-label="Discord"
              >
                <FaDiscord />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-gray-400 hover:text-white"
                aria-label="Telegram"
              >
                <FaTelegram />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-gray-400 hover:text-white"
                aria-label="Github"
              >
                <FaGithub />
              </motion.a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-white text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Domain Marketplace
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Pricing Plans
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Support Center
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-white text-lg font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  API
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-white text-lg font-medium mb-4">Newsletter</h4>
            <p className="mb-4">
              Subscribe to get updates on new domain listings and features.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 bg-gray-700 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition"
              >
                <FaPaperPlane />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: 0.2 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="border-t border-gray-700 mt-8 pt-8 text-center"
        >
          <p>&copy; 2023 DOMAIN. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
