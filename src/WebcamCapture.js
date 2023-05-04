import React, { useState, useRef } from "react";

function WebcamCapture() {
  const [imageSrc, setImageSrc] = useState(null);
  const videoRef = useRef();
  const canvasRef = useRef();

  const handleCaptureClick = () => {
    const context = canvasRef.current.getContext("2d");
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvasRef.current.toDataURL();
    setImageSrc(dataUrl);
    downloadImage(dataUrl);
  };

  const downloadImage = (dataUrl) => {
    const link = document.createElement("a");
    link.download = "webcam-image.png";
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleVideoStream = (stream) => {
    videoRef.current.srcObject = stream;
  };

  const handleError = (error) => {
    console.error(error);
  };

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(handleVideoStream)
    .catch(handleError);

  return (
    <div>
      <video ref={videoRef} autoPlay />
      <button onClick={handleCaptureClick}>Capture</button>
      {imageSrc && <img src={imageSrc} alt="captured" />}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

export default WebcamCapture;
