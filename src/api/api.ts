const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

// ================= IMAGE DETECTION ================= //

export const detectImage = async (file: File) => {

  const formData = new FormData();

  // MUST match Flask:
  // request.files.get("image")
  formData.append("image", file);

  const res = await fetch(`${BASE_URL}/detect`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Detection failed");
  }

  return res.json();
};

// Optional alias
export const uploadImage = detectImage;

// ================= WEBCAM ================= //

export const getWebcamStatus = async () => {

  const res = await fetch(`${BASE_URL}/webcam_status`);

  if (!res.ok) {
    throw new Error("Webcam status failed");
  }

  return res.json();
};

export const webcamStreamUrl = `${BASE_URL}/webcam_feed`;

// ================= SYSTEM LOGS ================= //

export const getSystemLogs = async () => {

  const res = await fetch(`${BASE_URL}/logs`);

  if (!res.ok) {
    throw new Error("Logs fetch failed");
  }

  return res.json();
};

// ================= VIDEO ================= //

export const uploadVideo = async (file: File) => {

  const formData = new FormData();

  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/upload_video`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Video upload failed");
  }

  return res.json();
};