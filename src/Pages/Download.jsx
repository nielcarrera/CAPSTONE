import { motion } from "framer-motion";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import phone from "../assets/phone.jpg";
import qr from "../assets/qr.png";
import Navbar from "../components/Navbar";
import { div } from "motion/react-client";

const Download = () => {
  return (
    <motion.div
      className="min-h-screen w-full flex items-center justify-center bg-gray-800 px-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar></Navbar>
      <div className="mt-20 max-w-6xl w-full h-full bg-white rounded-xl shadow-lg p-12 flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-14">
        {/* Text Section */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold text-cyan-900 mb-12   ">
            DOWNLOAD OUR APP
          </h1>
          <p className="text-gray-500 mt-6 leading-relaxed">
            Discover the full experience of Insecurity Free using our mobile
            application.
            <p className="mt-7">
              Unlock new features like Skin Type Detection and Skin Impurity
              Detection using your mobile phones
            </p>
          </p>

          {/* Download Buttons */}
          <div className="mt-8 flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-6">
            <motion.a
              href="#"
              className="flex items-center px-8 py-3 bg-gray-900 text-white rounded-lg shadow-md text-md font-medium transition hover:bg-gray-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaApple className="w-6 h-6 mr-2" /> Download on the App Store
            </motion.a>
            <motion.a
              href="#"
              className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg shadow-md text-md font-medium transition hover:bg-green-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaGooglePlay className="w-6 h-6 mr-2" /> Get it on Google Play
            </motion.a>
          </div>
        </div>

        {/* QR Code and Phone */}
        <div className="flex-1 flex flex-col items-center">
          <motion.img
            src={qr}
            alt="QR Code"
            className="w-40 h-40 shadow-xl rounded-lg"
            whileHover={{ scale: 1.1 }}
          />
          <motion.img
            src={phone}
            alt="Phone Mockup"
            className="mt-6 w-60 sm:w-72 shadow-xl rounded-lg"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Download;
