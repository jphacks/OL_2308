"use client"
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {

  const [imageGet, setImageGet] = useState<string[]>([]);

  useEffect(() => {
    closetCloth();
  }, []); // ページが読み込まれた時に実行

  const closetCloth = async () => {
    try {
      const response = await axios.post("http://localhost:5000/choose_cloth");
      const closetImages = response.data.imageList;
      setImageGet(closetImages);
    } catch (error) {
      console.error("Error fetching favorite images", error);
    }
  };
  


  return (
    <div>
      {imageGet && imageGet.length > 0 ? (
        <ul style={{ display: "flex", flexWrap: "wrap", listStyle: "none", margin: 50, padding: 40 }}>
          {imageGet.map((imageFileName, index) => (
            <li key={index}>
              <img style={{ margin: 30 }}
                src={`http://localhost:5000/static/closet/${imageFileName}`}
                alt={`${index}`}
                width={250}
              />
            </li>
          ))}
        </ul>
      ):(
        <p></p>
      )
    }
    </div>
  );
}
