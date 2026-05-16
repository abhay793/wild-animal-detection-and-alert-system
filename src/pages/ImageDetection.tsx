import React, {
  useState,
  useCallback,
  useEffect,
} from "react";

import {
  Upload,
  Image as ImageIcon,
  AlertTriangle,
  Download,
  Trash2,
} from "lucide-react";

import {
  playSiren,
  stopSiren,
} from "../utils/siren";

interface Detection {
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
  detections: Detection[];
  processingTime: number;
  imageSize: {
    width: number;
    height: number;
  };
}

const ImageDetection: React.FC = () => {

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResult | null>(null);

  const [dragOver, setDragOver] =
    useState(false);



  // CLEANUP WHEN PAGE CHANGES
  useEffect(() => {

    return () => {
      stopSiren();
    };

  }, []);



  // API CALL
  const analyzeImageAPI = async (
    imageFile: File
  ): Promise<AnalysisResult | null> => {

    try {

      const formData = new FormData();

      formData.append("image", imageFile);

      const response = await fetch(
        "http://127.0.0.1:5000/upload_image",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log("BACKEND RESPONSE:", data);

      if (
        data.success &&
        data.detections &&
        data.detections.length > 0
      ) {

        const detections =
          data.detections.map((item: any) => ({

            animal: item.animal,

            confidence: item.confidence,

            bbox: {
              x: item.bbox.x1,
              y: item.bbox.y1,
              width:
                item.bbox.x2 - item.bbox.x1,

              height:
                item.bbox.y2 - item.bbox.y1,
            },

          }));

        return {
          detections,

          processingTime: 1.2,

          imageSize: {
            width: 640,
            height: 480,
          },
        };
      }

      return {
        detections: [],
        processingTime: 1.2,
        imageSize: {
          width: 640,
          height: 480,
        },
      };

    } catch (error) {

      console.error(
        "Failed to analyze image:",
        error
      );

      return null;
    }
  };



  // IMAGE SELECT
  const handleImageSelect =
    useCallback((file: File) => {

      if (
        file &&
        file.type.startsWith("image/")
      ) {

        stopSiren();

        setSelectedImage(file);

        const reader = new FileReader();

        reader.onload = (e) =>
          setImagePreview(
            e.target?.result as string
          );

        reader.readAsDataURL(file);

        setAnalysisResult(null);
      }

    }, []);



  // FILE INPUT
  const handleFileInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0];

    if (file) handleImageSelect(file);

  };



  // DRAG OVER
  const handleDragOver = (
    e: React.DragEvent
  ) => {

    e.preventDefault();

    setDragOver(true);

  };



  // DRAG LEAVE
  const handleDragLeave = (
    e: React.DragEvent
  ) => {

    e.preventDefault();

    setDragOver(false);

  };



  // DROP IMAGE
  const handleDrop = (
    e: React.DragEvent
  ) => {

    e.preventDefault();

    setDragOver(false);

    const file =
      e.dataTransfer.files[0];

    if (file)
      handleImageSelect(file);

  };



  // ANALYZE IMAGE
  const analyzeImage = async () => {

    if (
      !selectedImage ||
      isAnalyzing
    ) return;

    try {

      setIsAnalyzing(true);

      stopSiren();

      const apiResult =
        await analyzeImageAPI(
          selectedImage
        );

      console.log(
        "API RESULT:",
        apiResult
      );

      if (!apiResult) {

        alert("Detection failed!");

        setAnalysisResult(null);

        stopSiren();

        return;
      }

      setAnalysisResult(apiResult);

      if (
        apiResult.detections.length > 0
      ) {

        await playSiren();

      } else {

        stopSiren();
      }

    } catch (error) {

      console.error(error);

      stopSiren();

    } finally {

      setIsAnalyzing(false);
    }
  };



  // CLEAR IMAGE
  const clearImage = () => {

    stopSiren();

    setSelectedImage(null);

    setImagePreview(null);

    setAnalysisResult(null);

  };



  // DOWNLOAD RESULTS
  const downloadResults = () => {

    if (!analysisResult) return;

    const results = {

      filename:
        selectedImage?.name,

      timestamp:
        new Date().toISOString(),

      detections:
        analysisResult.detections,

      processingTime:
        analysisResult.processingTime,

      imageSize:
        analysisResult.imageSize,
    };

    const blob = new Blob(
      [
        JSON.stringify(
          results,
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
      `detection-results-${Date.now()}.json`;

    a.click();

    URL.revokeObjectURL(url);

  };



  return (

    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-gray-900 to-dark-800 py-8 px-4">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-4xl font-bold text-white mb-3">
            Image Detection
          </h1>

          <p className="text-gray-400">
            Upload images to detect wild animals
          </p>

        </div>



        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT PANEL */}
          <div className="bg-dark-800/50 rounded-3xl p-8">

            <h2 className="text-2xl font-semibold text-white mb-8 flex items-center">

              <Upload className="mr-2 h-5 w-5" />

              Upload Image

            </h2>



            {!imagePreview ? (

              <div
                onDragOver={
                  handleDragOver
                }
                onDragLeave={
                  handleDragLeave
                }
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-300 ${
                  dragOver
                    ? "border-green-400 bg-green-400/10"
                    : "border-gray-600"
                }`}
              >

                <ImageIcon className="h-20 w-20 text-gray-400 mx-auto mb-6" />

                <p className="text-gray-400 mb-6 text-lg">
                  Drag & Drop Image
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleFileInput
                  }
                  className="hidden"
                  id="image-upload"
                />

                <label
                  htmlFor="image-upload"
                  className="bg-black text-white px-8 py-4 rounded-2xl cursor-pointer"
                >
                  Choose Image
                </label>

              </div>

            ) : (

              <div className="space-y-6">

                {/* IMAGE */}
                <div
  className="relative w-full h-[500px] bg-black rounded-2xl overflow-hidden flex items-center justify-center"
>

  <img
    src={imagePreview}
    alt="Selected"
    className="max-w-full max-h-full object-contain"
  />

  {analysisResult?.detections.map(
    (detection, index) => (

      <div
        key={index}
        className="absolute border-[3px] border-red-500"
        style={{

          left: `${
            (detection.bbox.x /
              analysisResult.imageSize.width) *
            100
          }%`,

          top: `${
            (detection.bbox.y /
              analysisResult.imageSize.height) *
            100
          }%`,

          width: `${
            (detection.bbox.width /
              analysisResult.imageSize.width) *
            100
          }%`,

          height: `${
            (detection.bbox.height /
              analysisResult.imageSize.height) *
            100
          }%`,
        }}
      >

        <div className="bg-red-500 text-white px-2 py-1 text-xs font-bold">

          {detection.animal}

          {" "}

          ({detection.confidence.toFixed(1)}%)

        </div>

      </div>

    )
  )}

</div>



                {/* FILE INFO */}
                <div className="flex justify-between items-center">

                  <span className="text-gray-300">

                    {
                      selectedImage?.name
                    }

                  </span>

                  <button
                    onClick={
                      clearImage
                    }
                    className="text-red-400"
                  >
                    <Trash2 />
                  </button>

                </div>



                {/* BUTTONS */}
                <div className="flex flex-wrap gap-4">

                  {/* ANALYZE */}
                  <button
                    onClick={
                      analyzeImage
                    }
                    disabled={
                      isAnalyzing
                    }
                    className="flex-1 bg-black hover:bg-gray-900 text-white px-6 py-4 rounded-2xl transition-all"
                  >

                    {isAnalyzing
                      ? "Analyzing..."
                      : "Analyze Image"}

                  </button>



                  {/* STOP */}
                  <button
                    onClick={() => {

                      console.log(
                        "STOP CLICKED"
                      );

                      stopSiren();

                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-2xl transition-all"
                  >
                    Stop Siren
                  </button>



                  {/* EXPORT */}
                  {analysisResult && (

                    <button
                      onClick={
                        downloadResults
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl flex items-center gap-2 transition-all"
                    >

                      <Download className="h-4 w-4" />

                      Export

                    </button>

                  )}

                </div>

              </div>

            )}

          </div>



          {/* RIGHT PANEL */}
          <div className="bg-dark-800/50 rounded-3xl p-8">

            <h2 className="text-2xl font-semibold text-white mb-8">
              Analysis Results
            </h2>



            {!analysisResult &&
              !isAnalyzing && (

              <div className="text-center py-16">

                <AlertTriangle className="h-20 w-20 text-gray-400 mx-auto mb-6" />

                <p className="text-gray-400">
                  Upload image to analyze
                </p>

              </div>

            )}



            {isAnalyzing && (

              <div className="text-center py-16">

                <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-green-400 mx-auto mb-6"></div>

                <p className="text-gray-400">
                  Detecting animals...
                </p>

              </div>

            )}



            {analysisResult && (

              <div className="space-y-6">

                {analysisResult
                  .detections.length >
                0 ? (

                  analysisResult.detections.map(
                    (
                      detection,
                      index
                    ) => (

                      <div
                        key={index}
                        className="bg-gray-800 rounded-2xl p-6"
                      >

                        <div className="flex justify-between mb-2">

                          <span className="text-white font-bold text-xl">

                            {
                              detection.animal
                            }

                          </span>

                          <span className="text-green-400 font-bold">

                            {detection.confidence.toFixed(
                              1
                            )}
                            %

                          </span>

                        </div>

                      </div>

                    )
                  )

                ) : (

                  <div className="bg-green-800/20 border border-green-600 rounded-2xl p-6">

                    <p className="text-green-300">
                      No wild animals detected
                    </p>

                  </div>

                )}

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default ImageDetection;