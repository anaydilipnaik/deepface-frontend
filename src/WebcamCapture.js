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
    link.style.display = "none";

    const fileNameInput = document.createElement("input");
    fileNameInput.type = "text";
    fileNameInput.placeholder = "Enter file name";
    fileNameInput.style.marginTop = "15px";
    fileNameInput.style.marginBottom = "1rem";
    fileNameInput.style.fontSize = "1.2rem";
    fileNameInput.style.padding = "0.5rem";
    fileNameInput.style.borderRadius = "0.5rem";
    fileNameInput.style.border = "none";
    fileNameInput.style.boxShadow = "0 0 0.5rem rgba(0, 0, 0, 0.2)";
    fileNameInput.style.width = "25%";
    fileNameInput.style.boxSizing = "border-box";
    fileNameInput.style.textAlign = "center";

    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download";
    downloadButton.style.marginBottom = "1rem";
    downloadButton.style.fontSize = "1.2rem";
    downloadButton.style.padding = "0.5rem 1rem";
    downloadButton.style.borderRadius = "0.5rem";
    downloadButton.style.backgroundColor = "darkblue";
    downloadButton.style.color = "white";
    downloadButton.style.border = "none";
    downloadButton.style.cursor = "pointer";

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.style.marginLeft = "1rem";
    cancelButton.style.fontSize = "1.2rem";
    cancelButton.style.padding = "0.5rem 1rem";
    cancelButton.style.borderRadius = "0.5rem";
    cancelButton.style.backgroundColor = "grey";
    cancelButton.style.color = "white";
    cancelButton.style.border = "none";
    cancelButton.style.cursor = "pointer";

    const form = document.createElement("form");
    form.style.display = "flex";
    form.style.flexDirection = "column";
    form.style.alignItems = "center";
    form.appendChild(fileNameInput);
    form.appendChild(downloadButton);
    form.appendChild(cancelButton);

    fileNameInput.addEventListener("input", () => {
      link.download = fileNameInput.value
        ? fileNameInput.value + ".jpg"
        : "webcam-image.jpg";
    });

    downloadButton.addEventListener("click", (event) => {
      event.preventDefault();
      if (fileNameInput.value) {
        link.download = fileNameInput.value + ".jpg";
      } else {
        link.download = "webcam-image.jpg";
      }
      link.href = dataUrl.replace(
        /^data:image\/[^;]+/,
        "data:application/octet-stream"
      );
      link.click();
      document.body.removeChild(form);

      setImageSrc(null);
    });

    cancelButton.addEventListener("click", () => {
      document.body.removeChild(form);

      setImageSrc(null);
    });

    document.body.appendChild(form);
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
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Webcam Capture</h1>
      {!imageSrc ? (
        <>
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
        </>
      ) : (
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
