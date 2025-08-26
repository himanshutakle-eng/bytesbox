import { Alert } from "react-native";

export const uploadToCloudinary = async (
  uri: string,
  type: "image" | "video" | "audio"
): Promise<string> => {
  const data = new FormData();
  let fileType = "image/jpeg";
  let fileName = `upload_${Date.now()}.jpg`;

  if (type === "video") {
    fileType = "video/mp4";
    fileName = `upload_${Date.now()}.mp4`;
  } else if (type === "audio") {
    fileType = "audio/m4a";
    fileName = `upload_${Date.now()}.m4a`;
  }

  data.append("file", { uri, type: fileType, name: fileName } as any);
  data.append("upload_preset", "bytesbox");
  data.append("cloud_name", "dggv1wtws");

  if (type !== "image") {
    data.append("resource_type", "video");
    if (type === "video") {
      data.append("video_codec", "h264");
      data.append("quality", "auto:good");
    }
  }

  const endpoint = type === "image" ? "image" : "video";
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/dggv1wtws/${endpoint}/upload`,
    {
      method: "POST",
      body: data,
    }
  );

  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return (await res.json()).secure_url;
};

export const MAX_SIZE = {
  image: 10 * 1024 * 1024,
  video: 100 * 1024 * 1024,
  audio: 50 * 1024 * 1024,
};

export const validateMediaFile = (
  asset: any,
  type: keyof typeof MAX_SIZE
): boolean => {
  if (asset.fileSize && asset.fileSize > MAX_SIZE[type]) {
    Alert.alert(
      "File too large",
      `${type} must be smaller than ${MAX_SIZE[type] / 1024 / 1024}MB`
    );
    return false;
  }
  return true;
};
