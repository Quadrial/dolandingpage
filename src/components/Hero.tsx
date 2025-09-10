// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import domains from "../data/domains.json";

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: { staggerChildren: 0.2, delayChildren: 0.3 },
//   },
// };

// const itemVariants = {
//   hidden: { y: 20, opacity: 0 },
//   visible: { y: 0, opacity: 1 },
// };

// interface Suggestion {
//   name: string;
//   price: number;
// }

// const Hero = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

//   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const value = event.target.value;
//     setSearchTerm(value);

//     if (value.length > 0) {
//       const filteredSuggestions = domains.filter((domain) =>
//         domain.name.toLowerCase().includes(value.toLowerCase())
//       );
//       setSuggestions(filteredSuggestions);
//     } else {
//       setSuggestions([]);
//     }
//   };

//   const handleSuggestionClick = (suggestion: Suggestion) => {
//     setSearchTerm(suggestion.name);
//     setSuggestions([]);
//   };

//   const handleSearch = () => {
//     // For now, just log the search term.
//     // In a real app, you'd navigate to a search results page or display results.
//     console.log("Searching for:", searchTerm);
//   };

//   return (
//     <section className="mt-30 py-16 relative bg-[url('/images/bg0.jpg')] bg-cover bg-center bg-no-repeat">
//       <div className="absolute inset-0 bg-blue-900 opacity-70"></div>
//       <div className="container mx-auto px-4 relative z-10">
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="flex flex-col md:flex-row items-center"
//         >
//           <motion.div
//             variants={itemVariants}
//             className="md:w-1/2 mb-10 md:mb-0"
//           >
//             <motion.h1
//               variants={itemVariants}
//               className="text-4xl md:text-5xl font-bold text-white mb-6"
//             >
//               Find A Perfect <span className="text-blue-400">Domain Name</span>
//             </motion.h1>
//             <motion.p
//               variants={itemVariants}
//               className="text-gray-200 text-lg mb-8"
//             >
//               With Web3 integration, instant activation, and secure
//               transactions, find the perfect domain for your project.
//             </motion.p>
//             <motion.div
//               variants={itemVariants}
//               className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4"
//             >
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
//               >
//                 Explore Domains
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-6 py-3 bg-white text-gray-800 font-medium rounded-md border border-gray-300 hover:border-blue-600 transition"
//               >
//                 Learn More
//               </motion.button>
//             </motion.div>
//           </motion.div>
//           <motion.div variants={itemVariants} className="md:w-1/2">
//             <div className="bg-white p-8 rounded-xl search-box relative">
//               <h2 className="text-2xl font-bold text-gray-800 mb-6">
//                 Search for Your Domain
//               </h2>
//               <div className="flex">
//                 <input
//                   type="text"
//                   placeholder="Enter domain name..."
//                   className="flex-grow px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   value={searchTerm}
//                   onChange={handleInputChange}
//                 />
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="px-6 bg-blue-600 text-white font-medium rounded-r-md hover:bg-blue-700 transition"
//                   onClick={handleSearch}
//                 >
//                   Search
//                 </motion.button>
//               </div>
//               {suggestions.length > 0 && (
//                 <motion.ul
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto"
//                 >
//                   {suggestions.map((suggestion, index) => (
//                     <li
//                       key={index}
//                       className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex justify-between"
//                       onClick={() => handleSuggestionClick(suggestion)}
//                     >
//                       <span>{suggestion.name}</span>
//                       <span className="font-bold text-blue-600">
//                         {`${suggestion.price}`} ETH
//                       </span>
//                     </li>
//                   ))}
//                 </motion.ul>
//               )}
//               <div className="mt-4 flex flex-wrap">
//                 <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded m-1">
//                   .crypto
//                 </span>
//                 <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded m-1">
//                   .eth
//                 </span>
//                 <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded m-1">
//                   .com
//                 </span>
//                 <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded m-1">
//                   .io
//                 </span>
//                 <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded m-1">
//                   .xyz
//                 </span>
//                 <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded m-1">
//                   .org
//                 </span>
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default Hero;

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCommentDots } from "react-icons/fa"; // ⭐ chat icon
import domains from "../data/domains.json";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

interface Suggestion {
  name: string;
  price: number;
}

const Hero = ({
  onNegotiate,
}: {
  onNegotiate: (name: string, price: string) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      const filteredSuggestions = domains.filter((domain) =>
        domain.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSearchTerm(suggestion.name);
    setSuggestions([]);
  };

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  return (
    <section className="mt-30 py-16 relative bg-[url('/images/bg0.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-blue-900 opacity-70"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row items-center"
        >
          <motion.div
            variants={itemVariants}
            className="md:w-1/2 mb-10 md:mb-0"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Find A Perfect <span className="text-blue-400">Domain Name</span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-gray-200 text-lg mb-8"
            >
              With Web3 integration, instant activation, and secure
              transactions, find the perfect domain for your project.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
              >
                Explore Domains
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white text-gray-800 font-medium rounded-md border border-gray-300 hover:border-blue-600 transition"
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="md:w-1/2">
            <div className="bg-white p-8 rounded-xl search-box relative">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Search for Your Domain
              </h2>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter domain name..."
                  className="flex-grow px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={searchTerm}
                  onChange={handleInputChange}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 bg-blue-600 text-white font-medium rounded-r-md hover:bg-blue-700 transition"
                  onClick={handleSearch}
                >
                  Search
                </motion.button>
              </div>

              {suggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto"
                >
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <span>{suggestion.name}</span>
                      <div className="flex items-center space-x-2">
                        {/* ⭐ Chat icon to negotiate */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNegotiate(
                              suggestion.name,
                              `${suggestion.price} ETH`
                            );
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="Chat to Negotiate"
                        >
                          <FaCommentDots />
                        </button>
                        <span className="font-bold text-blue-600">
                          {`${suggestion.price}`} ETH
                        </span>
                      </div>
                    </li>
                  ))}
                </motion.ul>
              )}

              <div className="mt-4 flex flex-wrap">
                {[".crypto", ".eth", ".com", ".io", ".xyz", ".org"].map(
                  (ext) => (
                    <span
                      key={ext}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded m-1"
                    >
                      {ext}
                    </span>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
