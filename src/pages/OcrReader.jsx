// eslint-disable-next-line no-unused-vars
import React from "react";
import { createWorker } from "tesseract.js";

export default function OcrReader() {
  const [image, setImage] = React.useState(null);
  const [imgURL, setImgURL] = React.useState(null);
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    if (!image) return;
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      localStorage.setItem("image", reader.result);
      setImgURL(reader.result);
    };
  }, [image]);

  (async () => {
    const img = localStorage.getItem("image");
    const worker = await createWorker("eng");
    const ret = await worker.recognize(img);
    setText(ret.data.text);
    await worker.terminate();
  })();

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <img src={imgURL} alt="" id="img" />
      <p>{text}</p>
    </>
  );
}
