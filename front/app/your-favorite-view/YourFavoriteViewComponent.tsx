"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {

  const [imageGet, setImageGet] = useState<string[]>([]);

  useEffect(() => {
    closetCloth();
  }, []); // ページが読み込まれた時に実行

  const closetCloth = async () => {
    try {
      const response = await axios.post("http://localhost:5000/your_favorite_viewer");
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
                src={`http://localhost:5000/static/search_favorite_image/${imageFileName}?timestamp=${new Date().getTime()}}`}
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
