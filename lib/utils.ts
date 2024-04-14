import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cache } from "./cache";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

async function downloadToBlob(url: string) {
  try {
    const response: any = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.statusText);
    }

    const reader = response.body.getReader();
    const contentLength = +response.headers.get("Content-Length");
    let receivedLength = 0; // 已接收的字节数
    let chunks = []; // 收到的数据块数组

    // 读取数据
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      chunks.push(value);
      receivedLength += value.length;

      console.log(
        `Received ${receivedLength} of ${contentLength} bytes (${(
          (receivedLength / contentLength) *
          100
        ).toFixed(2)}%)`
      );
    }

    // 合并所有块成一个 Blob
    const blob = new Blob(chunks);
    console.log("File downloaded and converted to Blob");
    return blob;
  } catch (error) {
    console.error("Failed to download the file:", error);
  }
}

export async function getAudioUrl(url: string) {
  const cachedData = await cache.get(url);
  console.log("cachedData", cachedData);
  if (cachedData) {
    return cachedData;
  } else {
    // 这样没 progress 了
    const audioUrl = await downloadToBlob(url);
    console.log("audioUrl", audioUrl);
    if (audioUrl) {
      await cache.set(url, audioUrl);
    }
    return audioUrl;
  }
}
