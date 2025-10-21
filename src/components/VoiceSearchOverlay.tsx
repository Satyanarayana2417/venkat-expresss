import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X } from 'lucide-react';

interface VoiceSearchOverlayProps {
  isListening: boolean;
  transcript: string;
  error: string | null;
  onClose: () => void;
}

export const VoiceSearchOverlay = ({
  isListening,
  transcript,
  error,
  onClose
}: VoiceSearchOverlayProps) => {
  return (
    <AnimatePresence>
      {isListening && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-sm flex items-center justify-center md:hidden"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-8 mx-4 max-w-sm w-full shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            {/* Microphone Icon with Pulse Animation */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {/* Pulsing Rings */}
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-full bg-primary"
                  style={{ width: '80px', height: '80px', left: '-10px', top: '-10px' }}
                />
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0, 0.3]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2
                  }}
                  className="absolute inset-0 rounded-full bg-primary"
                  style={{ width: '80px', height: '80px', left: '-10px', top: '-10px' }}
                />

                {/* Mic Icon */}
                <div className="relative z-10 w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <Mic className="h-8 w-8 text-white" />
                </div>
              </div>

              {/* Status Text */}
              <div className="mt-6 text-center">
                {error ? (
                  <>
                    <h3 className="text-lg font-semibold text-red-600 mb-2">
                      Error
                    </h3>
                    <p className="text-sm text-gray-600">
                      {error}
                    </p>
                  </>
                ) : (
                  <>
                    <motion.h3
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-lg font-semibold text-gray-900 mb-2"
                    >
                      Listening...
                    </motion.h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Speak now
                    </p>

                    {/* Live Transcript */}
                    {transcript && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <p className="text-xs text-gray-500 mb-1">You said:</p>
                        <p className="text-sm font-medium text-gray-900">
                          "{transcript}"
                        </p>
                      </motion.div>
                    )}
                  </>
                )}
              </div>

              {/* Tap to Cancel */}
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-sm font-medium text-gray-700 transition-colors"
              >
                Tap to cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
