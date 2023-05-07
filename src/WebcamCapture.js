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

  console.log("videoRef: ", videoRef);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Webcam Capture</h1>
      <div style={{ position: "relative" }}>
        <video
          ref={videoRef}
          autoPlay
          style={{ width: "100%", maxWidth: "640px", height: "auto" }}
        />

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
      <button
        onClick={handleCaptureClick}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          fontSize: "1.2rem",
          fontWeight: "bold",
          borderRadius: "0.5rem",
          backgroundColor: "darkblue",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Capture
      </button>
      {imageSrc && (
        <img
          src={imageSrc}
          alt="captured"
          style={{ marginTop: "1rem", maxWidth: "100%" }}
        />
      )}
    </div>
  );
}

export default WebcamCapture;
