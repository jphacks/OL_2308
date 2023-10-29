import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { createWriteStream } from "fs";
import fetch from "node-fetch";

export const config = {
  api: {
    bodyParser: false,
  },
};

type Data = {
  msg?: string;
};

let bodyPart = ""; // ボディパートの値を格納する変数

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") return;

  const form = formidable({ multiples: true, uploadDir: __dirname });

  const images = {
    clothes: "../back/static/cloth_web.jpg", // ファッション画像の保存先パス
    person: "../back/static/origin_web.jpg", // 人物画像の保存先パス
  };

  form.onPart = (part) => {
    if (part.name === "bodyPart") {
      // ボディパートのフィールドを処理
      part.on("data", (data) => {
        const bodyPartBuffer = Buffer.from(data, "binary"); // バイナリデータからBufferを作成
        const bodyPartString = bodyPartBuffer.toString("utf-8"); // UTF-8エンコーディングで文字列に変換
        bodyPart = bodyPartString; // ボディパートの値を収集
        console.log("images.clothes:", images.clothes);
        console.log("images.person:", images.person);
        console.log("bodyPart:", bodyPart);
        sendFilesToServer(bodyPart, res);
      });
    } else if (part.originalFilename) {
      let filePath = "";
      if (part.name === "image1") {
        filePath = images.clothes;
      } else if (part.name === "image2") {
        filePath = images.person;
      }

      const stream = createWriteStream(filePath);
      part.pipe(stream);

      part.on("end", () => {
        //console.log(part.name + " is uploaded");
        stream.close();
      });
    }
  };

  form.parse(req);
}

async function sendFilesToServer(bodyPart, res) {
  console.log("Sending files to the server...");

  try {
    const data = { bodyPart }; // 画像とボディパートをオブジェクトにまとめる

    const response = await fetch("http://127.0.0.1:5000/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      console.log("ファイルが正常に送信されました。");
      res.status(200).json({ msg: "success" });
    } else {
      console.error("ファイルの送信に失敗しました。");
      res.status(500).json({ msg: "failure" }); // エラーレスポンスを送信することもできます
    }
  } catch (error) {
    console.error("エラーが発生しました:", error);
    res.status(500).json({ msg: "error" }); // エラーレスポンスを送信することもできます
  }
}