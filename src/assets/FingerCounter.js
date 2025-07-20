// src/FingerCounter.js
import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs'; 
import * as handpose from '@tensorflow-models/handpose';
import { drawHand } from './utilities';

const FingerCounter = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [fingerCount, setFingerCount] = useState(0);

  useEffect(() => {
    const loadModel = async () => {
      const model = await handpose.load();
      console.log("Handpose model loaded.");

      setInterval(async () => {
        if (
          videoRef.current &&
          videoRef.current.readyState === 4
        ) {
          const video = videoRef.current;
          const predictions = await model.estimateHands(video);

          if (predictions.length > 0) {
            const landmarks = predictions[0].landmarks;

            // Count fingers up (simple version using y positions)
            const tips = [8, 12, 16, 20]; // Index to pinky
            let count = 0;
            for (let tip of tips) {
              if (landmarks[tip][1] < landmarks[tip - 2][1]) count++;
            }

            // Thumb
            if (landmarks[4][0] > landmarks[3][0]) count++;

            setFingerCount(count);

            drawHand(predictions, canvasRef.current);
          }
        }
      }, 500);
    };

    loadModel();
  }, []);

  return (
    <div className="finger-recognition-container">
      <h3>Show Your Fingers</h3>
      <p>Detected Fingers: {fingerCount}</p>
      <video
        ref={videoRef}
        style={{ display: 'none' }}
        width="300"
        height="200"
        autoPlay
        muted
        playsInline
      />
      <canvas
        ref={canvasRef}
        width="300"
        height="200"
        style={{ border: '1px solid #ccc' }}
      />
    </div>
  );
};

export default FingerCounter;
