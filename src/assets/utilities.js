// src/utilities.js
export const drawHand = (predictions, canvas) => {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  predictions.forEach(prediction => {
    const landmarks = prediction.landmarks;

    for (let i = 0; i < landmarks.length; i++) {
      const [x, y] = landmarks[i];
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 3 * Math.PI);
      ctx.fillStyle = "blue";
      ctx.fill();
    }
  });
};
