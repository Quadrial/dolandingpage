
import { motion } from "framer-motion";

const Promotions = () => {
  const promotions = [
    {
      tag: "Sale",
      discount: "Up to 98% off",
      title: "Ready, set, grow! With up to 98% off across our range.",
      product: "Private Email",
      plan: "PROFESSIONAL EMAIL",
      price: "$0.99/mo",
      originalPrice: "Instead of $1.24/mo",
      buttonText: "Save now",
      highlight: true,
    },
    {
      tag: "Sale",
      discount: "Up to 35% off",
      title: "EasyWP Supersonic Managed WordPress hosting",
      product: "EasyWP Supersonic",
      plan: "MANAGED WORDPRESS",
      price: "$11.32/mo",
      originalPrice: "Instead of $18.88/mo",
      buttonText: "Get offer",
      highlight: false,
    },
    {
      tag: "Limited time",
      discount: "40% off",
      title: "Business Starter Kit with free domain",
      product: "Business Starter Kit",
      plan: "BUSINESS TOOLS",
      price: "Free",
      originalPrice: "Just pay state fees",
      buttonText: "Get started",
      highlight: false,
    },
    {
      tag: "Sale",
      discount: "70% off",
      title: "Stellar Shared Hosting with great performance",
      product: "Stellar",
      plan: "SHARED HOSTING",
      price: "$1.48/mo",
      originalPrice: "Instead of $4.88/mo",
      buttonText: "Shop Plans",
      highlight: false,
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
      className="mt-10 py-16 relative bg-[url('/images/bg2.jpg')] bg-cover bg-center bg-no-repeat"
    >
      <div className="absolute inset-0 bg-blue-900 opacity-70"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-white mb-4"
          >
            Explore current top deals
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-white max-w-2xl mx-auto"
          >
            Check out our best deals across our product range, and get what your
            website needs.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          {promotions.map((promo, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.03,
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
              }}
              whileTap={{ scale: 0.98 }}
              className={`bg-gradient-to-br rounded-xl p-6 promo-card shadow-md transition-transform duration-300 ${
                promo.highlight
                  ? "from-blue-50 to-blue-100 border-2 border-blue-200"
                  : "from-gray-50 to-gray-100 border border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {promo.tag}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  {promo.discount}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {promo.title}
              </h3>
              <div className="mb-4">
                <h4 className="text-gray-600 text-sm">{promo.plan}</h4>
                <p className="text-xl font-bold text-gray-800">
                  {promo.product}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-2xl font-bold text-blue-600">
                  {promo.price}
                </p>
                <p className="text-gray-600 text-sm">{promo.originalPrice}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
              >
                {promo.buttonText}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Promotions;
