
import {
  FaBolt,
  FaShieldAlt,
  FaComments,
  FaChartLine,
  FaGlobe,
  FaLayerGroup,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Features = () => {
  const features = [
    {
      icon: <FaBolt className="text-2xl text-blue-600" />,
      title: "Instant Activation",
      description:
        "Domains are activated immediately after purchase with no delays.",
    },
    {
      icon: <FaShieldAlt className="text-2xl text-blue-600" />,
      title: "Secure Transactions",
      description:
        "Blockchain-powered secure transactions with smart contract escrow.",
    },
    {
      icon: <FaComments className="text-2xl text-blue-600" />,
      title: "Integrated Messaging",
      description:
        "Negotiate directly with sellers using our secure messaging system.",
    },
    {
      icon: <FaChartLine className="text-2xl text-blue-600" />,
      title: "SEO Optimization",
      description:
        "All domains come with SEO-optimized landing pages for better visibility.",
    },
    {
      icon: <FaGlobe className="text-2xl text-blue-600" />,
      title: "Web3 Integration",
      description:
        "Full Web3 compatibility with support for crypto payments and blockchain domains.",
    },
    {
      icon: <FaLayerGroup className="text-2xl text-blue-600" />,
      title: "Orderbook Integration",
      description:
        "Real-time orderbook showing current offers and market prices.",
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

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="mt-10 py-16 relative bg-[url('/images/bg1.jpg')] bg-cover bg-center bg-no-repeat"
    >
      <div className="absolute inset-0 bg-blue-900 opacity-70"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-white mb-4"
          >
            Why Choose Our Domain Marketplace
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-white max-w-2xl mx-auto"
          >
            We provide the best platform for buying and selling domains with
            Web3 integration.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.03,
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-6 rounded-xl text-center shadow-md"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Features;
