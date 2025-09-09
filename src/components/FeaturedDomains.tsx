import { useState } from "react";
import { motion } from "framer-motion";

const allFeaturedDomains = [
  {
    name: "web3.crypto",
    status: "Premium",
    statusColor: "bg-green-100 text-green-800",
    description: "Perfect for Web3 startups, blockchain projects, and crypto businesses.",
    price: "5.2 ETH",
  },
  {
    name: "nft.art",
    status: "New",
    statusColor: "bg-blue-100 text-blue-800",
    description: "Ideal for NFT marketplaces, digital art galleries, and creative platforms.",
    price: "3.8 ETH",
  },
  {
    name: "dao.eth",
    status: "Trending",
    statusColor: "bg-purple-100 text-purple-800",
    description: "Excellent for decentralized autonomous organizations and governance projects.",
    price: "7.5 ETH",
  },
  {
    name: "metaverse.io",
    status: "Hot",
    statusColor: "bg-red-100 text-red-800",
    description: "A great domain for a metaverse project, virtual world, or VR/AR application.",
    price: "6.1 ETH",
  },
  {
    name: "token.xyz",
    status: "New",
    statusColor: "bg-blue-100 text-blue-800",
    description: "A short and memorable domain for a token, coin, or other digital asset.",
    price: "2.5 ETH",
  },
  {
    name: "defi.org",
    status: "Premium",
    statusColor: "bg-green-100 text-green-800",
    description: "A top-tier domain for any decentralized finance (DeFi) project.",
    price: "9.0 ETH",
  },
];

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

const FeaturedDomains = () => {
  const [visibleCount, setVisibleCount] = useState(3);

  const showMoreDomains = () => {
    setVisibleCount(allFeaturedDomains.length);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="py-16 bg-gray-50"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-gray-800 mb-4"
          >
            Featured Domains
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Discover premium domains available for immediate purchase with
            secure Web3 transactions.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {allFeaturedDomains.slice(0, visibleCount).map((domain, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl p-6 domain-card shadow-md transition-transform duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-2xl font-bold text-gray-800">
                  {domain.name}
                </span>
                <span
                  className={`px-3 py-1 ${domain.statusColor} text-sm font-medium rounded-full`}
                >
                  {domain.status}
                </span>
              </div>
              <p className="text-gray-600 mb-6">{domain.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">
                  {domain.price}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
                >
                  Make Offer
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {visibleCount < allFeaturedDomains.length && (
          <motion.div
            variants={itemVariants}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={showMoreDomains}
              className="px-8 py-3 bg-white text-blue-600 font-medium rounded-md border border-blue-600 hover:bg-blue-600 hover:text-white transition"
            >
              View All Domains
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default FeaturedDomains;
