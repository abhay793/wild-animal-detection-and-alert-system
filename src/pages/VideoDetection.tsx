import React, { useState, useRef } from "react";

import {
  Upload,
  Video,
  Play,
  Pause,
  Download,
  BarChart3,
  FileText,
} from "lucide-react";

interface Detection {
  frame: number;
  timestamp: string;
  animal: string;
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface AnalysisResult {
  totalFrames: number;
  detectionCount: number;
  detections: Detection[];
  processingTime: number;
  videoInfo: {
    duration: number;
    fps: number;
    resolution: {
      width: number;
      height: number;
    };
  };
}

const VideoDetection: React.FC = () => {

  const [selectedVideo, setSelectedVideo] =
    useState<File | null>(null);

  const [videoPreview, setVideoPreview] =
    useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResult | null>(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentFrame, setCurrentFrame] =
    useState(0);

  const [dragOver, setDragOver] =
    useState(false);

  const videoRef =
    useRef<HTMLVideoElement>(null);



  const handleVideoSelect = (
    file: File
  ) => {

    if (file && file.type.startsWith("video/")) {

      setSelectedVideo(file);

      const url =
        URL.createObjectURL(file);

      setVideoPreview(url);

      setAnalysisResult(null);

      setCurrentFrame(0);

    }

  };



  const handleFileInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0];

    if (file) handleVideoSelect(file);

  };



  const handleDragOver = (
    e: React.DragEvent
  ) => {

    e.preventDefault();

    setDragOver(true);

  };



  const handleDragLeave = (
    e: React.DragEvent
  ) => {

    e.preventDefault();

    setDragOver(false);

  };



  const handleDrop = (
    e: React.DragEvent
  ) => {

    e.preventDefault();

    setDragOver(false);

    const file =
      e.dataTransfer.files[0];

    if (file) handleVideoSelect(file);

  };



  const togglePlayPause = () => {

    if (videoRef.current) {

      if (isPlaying) {

        videoRef.current.pause();

      } else {

        videoRef.current.play();

      }

      setIsPlaying(!isPlaying);

    }

  };



  const analyzeVideo = async () => {

    if (!selectedVideo) return;

    setIsAnalyzing(true);

    try {

      const formData =
        new FormData();

      formData.append(
        "video",
        selectedVideo
      );

      const response =
        await fetch(
          "http://127.0.0.1:5000/upload_video",
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      console.log(
        "VIDEO BACKEND RESPONSE:",
        data
      );

      if (
        data.success &&
        data.detections
      ) {

        const detections: Detection[] =
          data.detections.map(
            (
              item: any,
              index: number
            ) => ({

              frame:
                item.frame || index,

              timestamp:
                item.timestamp ||
                `0:${String(index).padStart(2, "0")}`,

              animal:
                item.animal,

              confidence:
                item.confidence,

              bbox: {
                x:
                  item.bbox.x1,

                y:
                  item.bbox.y1,

                width:
                  item.bbox.x2 -
                  item.bbox.x1,

                height:
                  item.bbox.y2 -
                  item.bbox.y1,
              },

            })
          );

        setAnalysisResult({

          totalFrames:
            data.total_frames || 0,

          detectionCount:
            detections.length,

          detections,

          processingTime:
            data.processing_time || 0,

          videoInfo: {

            duration:
              data.duration || 0,

            fps:
              data.fps || 30,

            resolution: {

              width:
                data.width || 1280,

              height:
                data.height || 720,

            },

          },

        });

      } else {

        alert(
          "No animals detected"
        );

        setAnalysisResult({

          totalFrames: 0,

          detectionCount: 0,

          detections: [],

          processingTime: 0,

          videoInfo: {

            duration: 0,

            fps: 0,

            resolution: {

              width: 0,

              height: 0,

            },

          },

        });

      }

    } catch (error) {

      console.error(
        "Video detection failed:",
        error
      );

      alert(
        "Video detection failed"
      );

    }

    setIsAnalyzing(false);

  };



  const downloadReport = () => {

    if (
      !analysisResult ||
      !selectedVideo
    ) return;

    const report = {

      filename:
        selectedVideo.name,

      timestamp:
        new Date().toISOString(),

      summary: {

        totalFrames:
          analysisResult.totalFrames,

        detectionCount:
          analysisResult.detectionCount,

        processingTime:
          analysisResult.processingTime,

        videoInfo:
          analysisResult.videoInfo,

      },

      detections:
        analysisResult.detections,

    };

    const blob = new Blob(
      [
        JSON.stringify(
          report,
          null,
          2
        ),
      ],
      {
        type:
          "application/json",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download =
      `video-analysis-${Date.now()}.json`;

    a.click();

    URL.revokeObjectURL(url);

  };



  const downloadCSV = () => {

    if (!analysisResult) return;

    const csvContent = [

      "Frame,Timestamp,Animal,Confidence",

      ...analysisResult.detections.map(
        (detection) =>

          `${detection.frame},${detection.timestamp},${detection.animal},${detection.confidence}`

      ),

    ].join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download =
      `detections-${Date.now()}.csv`;

    a.click();

    URL.revokeObjectURL(url);

  };



  return (

    <div className="min-h-screen bg-gray-900 py-8 px-4">

      <div className="max-w-7xl mx-auto">

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-white mb-2">
            Video Detection
          </h1>

          <p className="text-gray-400">
            Upload videos to detect wild animals
          </p>

        </div>



        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* VIDEO SECTION */}

          <div className="bg-gray-800 rounded-lg p-6">

            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">

              <Upload className="mr-2 h-5 w-5" />

              Upload Video

            </h2>



            {!videoPreview ? (

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center ${
                  dragOver
                    ? "border-green-400 bg-green-400/10"
                    : "border-gray-600"
                }`}
              >

                <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />

                <p className="text-gray-400 mb-4">
                  Drag and drop video
                </p>

                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileInput}
                  className="hidden"
                  id="video-upload"
                />

                <label
                  htmlFor="video-upload"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded cursor-pointer"
                >
                  Choose Video
                </label>

              </div>

            ) : (

              <div className="space-y-4">

                <div className="relative bg-black rounded-lg overflow-hidden">

                  <video
                    ref={videoRef}
                    src={videoPreview}
                    className="w-full h-72 object-contain"
                    onTimeUpdate={(e) => {

                      const video =
                        e.target as HTMLVideoElement;

                      if (
                        analysisResult
                      ) {

                        const currentTime =
                          video.currentTime;

                        const fps =
                          analysisResult.videoInfo.fps;

                        setCurrentFrame(
                          Math.floor(
                            currentTime * fps
                          )
                        );

                      }

                    }}
                  />



                  {analysisResult?.detections
                    .filter(
                      (detection) =>
                        Math.abs(
                          detection.frame -
                            currentFrame
                        ) < 5
                    )
                    .map(
                      (
                        detection,
                        index
                      ) => (

                        <div
                          key={index}
                          className="absolute border-4 border-red-500 pointer-events-none"
                          style={{

                            left: `${(detection.bbox.x /
                              analysisResult.videoInfo.resolution.width) *
                              100}%`,

                            top: `${(detection.bbox.y /
                              analysisResult.videoInfo.resolution.height) *
                              100}%`,

                            width: `${(detection.bbox.width /
                              analysisResult.videoInfo.resolution.width) *
                              100}%`,

                            height: `${(detection.bbox.height /
                              analysisResult.videoInfo.resolution.height) *
                              100}%`,

                          }}
                        >

                          <div className="absolute top-0 left-0 bg-red-600 text-white text-xs px-2 py-1">

                            {detection.animal}

                            {" "}

                            ({detection.confidence.toFixed(1)}%)

                          </div>

                        </div>

                      )
                    )}

                </div>



                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <button
                      onClick={togglePlayPause}
                      className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
                    >

                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}

                    </button>

                    <span className="text-gray-300 text-sm">

                      {selectedVideo?.name}

                    </span>

                  </div>



                  <button
                    onClick={analyzeVideo}
                    disabled={isAnalyzing}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >

                    {isAnalyzing
                      ? "Analyzing..."
                      : "Analyze Video"}

                  </button>

                </div>



                {analysisResult && (

                  <div className="flex gap-3">

                    <button
                      onClick={downloadReport}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2"
                    >

                      <Download className="h-4 w-4" />

                      Report

                    </button>



                    <button
                      onClick={downloadCSV}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
                    >

                      <FileText className="h-4 w-4" />

                      CSV

                    </button>

                  </div>

                )}

              </div>

            )}

          </div>



          {/* RESULTS */}

          <div className="bg-gray-800 rounded-lg p-6">

            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">

              <BarChart3 className="mr-2 h-5 w-5" />

              Results

            </h2>



            {!analysisResult && !isAnalyzing && (

              <div className="text-center py-16">

                <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />

                <p className="text-gray-400">
                  Analyze video to see results
                </p>

              </div>

            )}



            {isAnalyzing && (

              <div className="text-center py-16">

                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>

                <p className="text-gray-400">
                  Processing video...
                </p>

              </div>

            )}



            {analysisResult && (

              <div className="space-y-4">

                <div className="grid grid-cols-2 gap-4">

                  <div className="bg-gray-700 rounded-lg p-4 text-center">

                    <div className="text-blue-400 text-2xl font-bold">

                      {analysisResult.detectionCount}

                    </div>

                    <div className="text-gray-400 text-sm">

                      Detections

                    </div>

                  </div>



                  <div className="bg-gray-700 rounded-lg p-4 text-center">

                    <div className="text-green-400 text-2xl font-bold">

                      {analysisResult.processingTime.toFixed(1)}s

                    </div>

                    <div className="text-gray-400 text-sm">

                      Processing

                    </div>

                  </div>

                </div>



                <div className="space-y-3 max-h-[500px] overflow-y-auto">

                  {analysisResult.detections.length > 0 ? (

                    analysisResult.detections.map(
                      (
                        detection,
                        index
                      ) => (

                        <div
                          key={index}
                          className="bg-gray-700 rounded-lg p-4"
                        >

                          <div className="flex justify-between">

                            <div>

                              <h3 className="text-white font-bold">

                                {detection.animal}

                              </h3>

                              <p className="text-gray-400 text-sm">

                                {detection.timestamp}

                              </p>

                            </div>



                            <div className="text-green-400 font-bold">

                              {detection.confidence.toFixed(1)}%

                            </div>

                          </div>

                        </div>

                      )
                    )

                  ) : (

                    <div className="bg-green-900/20 border border-green-700 rounded-lg p-6">

                      <p className="text-green-400">

                        No animals detected

                      </p>

                    </div>

                  )}

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>

  );

};

export default VideoDetection;