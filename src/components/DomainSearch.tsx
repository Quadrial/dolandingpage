import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import domains from "../data/domains.json";

const tabsData = [
  {
    id: "promos",
    title: "Promos",
    content: "Check out our latest promotions!",
    domains: domains.slice(0, 6),
  },
  {
    id: "domains",
    title: "Domains",
    content: "Find the perfect domain.",
    domains: domains.slice(6, 12),
  },
  {
    id: "wordpress",
    title: "WordPress",
    content: "Get managed hosting.",
    domains: domains.slice(12, 18),
  },
  {
    id: "hosting",
    title: "Hosting",
    content: "Reliable & affordable hosting.",
    domains: domains.slice(18, 24),
  },
  {
    id: "security",
    title: "Security",
    content: "Protect your site.",
    domains: domains.slice(24, 30),
  },
  {
    id: "apps",
    title: "Apps",
    content: "Enhance your site with apps.",
    domains: domains.slice(30, 36),
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const DomainSearch = ({
  onNegotiate,
}: {
  onNegotiate: (name: string, price: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState(tabsData[0].id);
  const activeTabData = tabsData.find((tab) => tab.id === activeTab);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-5 py-16 bg-white"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-gray-800 mb-4"
          >
            Buy a domain and everything else you need
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-4 mt-6"
          >
            {tabsData.map((tab) => (
              <motion.button
                key={tab.id}
                variants={itemVariants}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {tab.title}
              </motion.button>
            ))}
          </motion.div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-8 p-8 bg-gray-50 rounded-lg shadow-inner"
          >
            <p className="text-lg text-gray-700 max-w-2xl text-center mx-auto">
              {activeTabData?.content}
            </p>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {activeTabData?.domains.map((domain, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold text-lg text-gray-800">
                      {domain.name}
                    </p>
                    <p className="text-gray-600">{`${domain.price}`} ETH</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
                    onClick={() =>
                      onNegotiate(domain.name, `${domain.price} ETH`)
                    }
                  >
                    Chat to Negotiate
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default DomainSearch;
