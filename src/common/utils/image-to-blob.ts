import axios from "axios";

export default async (imageUrl: string): Promise<Buffer> => {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");
    return buffer;
  } catch (error) {
    throw new Error(`Error fetching image: ${error.message}`);
  }
};
