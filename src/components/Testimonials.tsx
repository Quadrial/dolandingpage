
import { motion } from "framer-motion";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Cameron Williamson",
      role: "Web3 Startup Founder",
      comment:
        "Found the perfect domain for my blockchain project. The transaction was smooth and secure with instant transfer.",
      imageUrl: "/images/cameron-williamson.png",
    },
    {
      name: "Jane Cooper",
      role: "NFT Artist",
      comment:
        "The messaging system made it easy to negotiate the price, and the SEO features helped my site get noticed faster.",
      imageUrl: "/images/jane-cooper.png",
    },
    {
      name: "Robert Fox",
      role: "DAO Contributor",
      comment:
        "The integrated orderbook and Web3 functionality made purchasing our DAO's domain seamless and trustless.",
      imageUrl: "/images/robert-fox.png",
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
      className="mt-10 py-16 relative bg-[url('/images/bg3.jpg')] bg-cover bg-center bg-no-repeat"
    >
      <div className="absolute inset-0 bg-blue-900 opacity-70"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-white mb-4"
          >
            What Our Customers Say
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-white max-w-2xl mx-auto"
          >
            Join thousands of satisfied customers who found their perfect
            domain.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.03,
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-50 p-6 rounded-xl shadow-md"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.imageUrl}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-bold text-gray-800">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600">"{testimonial.comment}"</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Testimonials;
