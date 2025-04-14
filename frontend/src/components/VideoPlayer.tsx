// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";

// const VideoPlayer: React.FC = () => {
//   const [videoUrl, setVideoUrl] = useState<string | any>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [hasError, setHasError] = useState(false);
//   const videoRef = useRef<HTMLVideoElement | null>(null);

//   const drawWatermark = (
//     canvas: HTMLCanvasElement,
//     video: HTMLVideoElement
//   ) => {
//     const context = canvas.getContext("2d");
//     if (context) {
//       context.drawImage(video, 0, 0, canvas.width, canvas.height);
//       context.font = "30px Arial";
//       context.fillStyle = "white";
//       context.fillText("Watermark", 20, 50);
//     }
//   };

//   const handlePlayPause = () => {
//     if (videoRef.current) {
//       if (videoRef.current.paused) {
//         videoRef.current.play();
//       } else {
//         videoRef.current.pause();
//       }
//     }
//   };

//   const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (videoRef.current) {
//       videoRef.current.currentTime = Number(event.target.value);
//     }
//   };

//   useEffect(() => {
//     if (videoRef.current) {
//       const canvas = document.createElement("canvas");
//       canvas.width = videoRef.current.videoWidth;
//       canvas.height = videoRef.current.videoHeight;
//       setInterval(() => {
//         drawWatermark(canvas, videoRef.current!);
//       }, 100);
//     }
//   }, []);

//   useEffect(() => {
//     const fetchVideoStream = async () => {
//       try {
//         const response = await axios.get("/video", {
//           responseType: "blob",
//         });
//         const videoBlob = URL.createObjectURL(response.data);
//         setVideoUrl(videoBlob);
//         setIsLoading(false);
//       } catch (error) {
//         setHasError(true);
//         setIsLoading(false);
//       }
//     };

//     fetchVideoStream();
//   }, []);

//   return (
//     <div>
//       {isLoading && <p>Loading video...</p>}
//       {hasError && <p>Error loading video</p>}
//       {!isLoading && !hasError && (
//         <div>
//           <video ref={videoRef} src={videoUrl} width="100%" />
//           <div>
//             <button onClick={handlePlayPause}>Play/Pause</button>
//             <input
//               type="range"
//               min="0"
//               max={videoRef.current?.duration || 0}
//               step="0.01"
//               onChange={handleSeek}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoPlayer;

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

import "../App.css";

const VideoPlayer: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0); // Track the current time video
  const [isMuted, setIsMuted] = useState<boolean>(false); // Track the mute state
  const [isPlay, setIsPlay] = useState<boolean>(false); // Track the play state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false); 
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const drawWatermark = (
    canvas: HTMLCanvasElement,
    video: HTMLVideoElement
  ) => {
    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      context.font = "30px Arial";
      context.fillStyle = "yellow";
      context.fillText("Watermark", 20, 50);
    }
  };

  const handlePlayPause = () => {
    setIsPlay(!isPlay);
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Number(event.target.value);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted; // Toggle the muted state
      setIsMuted(videoRef.current.muted); // Update the mute state
    }
  };

  const onCanPlay = () => {
    if (videoRef.current && canvasRef.current && containerRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const container = containerRef.current;

      // Set the canvas size to match the video size
      const containerWidth = container.offsetWidth; // Get container width
      // const scaleFactor = 1;
      canvas.width = containerWidth; // Set canvas width to container width
      canvas.height = (video.videoHeight / video.videoWidth) * containerWidth; // Maintain aspect ratio

      const updateCanvas = () => {
        drawWatermark(canvas, video);
        requestAnimationFrame(updateCanvas); // Keep calling this for each frame
      };

      updateCanvas(); // Start the drawing loop
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
        }
        // else if (containerRef.current.mozRequestFullScreen) { // Firefox
        //   containerRef.current.mozRequestFullScreen();
        // } else if (containerRef.current.webkitRequestFullscreen) { // Chrome, Safari
        //   containerRef.current.webkitRequestFullscreen();
        // } else if (containerRef.current.msRequestFullscreen) { // IE/Edge
        //   containerRef.current.msRequestFullscreen();
        // }
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      // else if (document.mozCancelFullScreen) { // Firefox
      //   document.mozCancelFullScreen();
      // } else if (document.webkitExitFullscreen) { // Chrome, Safari
      //   document.webkitExitFullscreen();
      // } else if (document.msExitFullscreen) { // IE/Edge
      //   document.msExitFullscreen();
      // }
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const fetchVideoStream = async () => {
      try {
        const response = await axios.get("/video", {
          responseType: "blob",
        });

        const videoBlob = URL.createObjectURL(response.data);
        setVideoUrl(videoBlob);
        setIsLoading(false);
      } catch (error) {
        setHasError(true);
        setIsLoading(false);
      }
    };

    fetchVideoStream();
  }, []);

  // Update the seek bar as the video plays
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      {isLoading && <p>Loading video...</p>}
      {hasError && <p>Error loading video</p>}
      {!isLoading && !hasError && (
        <div>
          <video
            ref={videoRef}
            src={videoUrl}
            style={{ width: "100%" }}
            onCanPlay={onCanPlay}
            onTimeUpdate={handleTimeUpdate} // Update time while video is playing
          />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
              zIndex: 1,
              width: "100%",
              height: "auto",
            }}
          />
          <div>
            <button onClick={handlePlayPause}>
              {isPlay ? "Pause" : "Play"}
            </button>
            <input
              type="range"
              min="0"
              max={videoRef.current?.duration || 0}
              step="0.01"
              value={currentTime} // Bind to currentTime for seek bar movement
              onChange={handleSeek}
            />
            <button onClick={handleMuteToggle}>
              {isMuted ? "Unmute" : "Mute"}
            </button>
            <button onClick={toggleFullscreen}>
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </button>
          </div>
        </div>
      )}
      <footer>
        <p>© 2025 Oddbit Video Player</p>
      </footer>
    </div>
  );
};

export default VideoPlayer;
