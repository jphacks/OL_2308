import formidable from "formidable";
import { writeFile } from "fs/promises";
import { join } from "path";

export default async function POST(req, res) {
  const form = formidable({ multiples: true, uploadDir: __dirname });
  console.log(form);

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("ファイルのアップロードエラー:", err);
      res.status(500).json({ success: false });
    } else {
      // ファイルが正常にアップロードされた場合
      console.log(files);
      const uploadedFilePath = files.image.path;
      const destinationPath = join(form.uploadDir, "image.jpg");

      try {
        await writeFile(destinationPath, uploadedFilePath, {
          encoding: "binary",
        });
        res.status(200).json({ success: true });
      } catch (error) {
        console.error("アップロードエラー:", error);
        res.status(500).json({ success: false });
      }
    }
  });
}
