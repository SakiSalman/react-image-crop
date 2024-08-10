"use client"
import getCroppedImg from "@/utils/imageCropper";
import Image from "next/image";
import { useState } from "react";
import Cropper from "react-easy-crop";

export default function Home() {
  const [imageFile, setImageFile] = useState(null)
  const [imageSrc, setImageSrc] = useState('')
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState({
    x: 0, // x/y are the coordinates of the top/left corner of the cropped area
    y: 0,
    width: 0, // width of the cropped area
    height: 0, // height of the cropped area
  });
  const cropComplete = (croppedArea:any, croppedAreaPixels:any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };


  const cropImage = async () => {
    try {
      const { file, url }:any = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      setImageSrc(url);
      setImageFile(file);
      if (file) {
        // Create a new File object from the blob
        const generatedFile = new File([file], "croped-image.png", { type: "image/png" });
        console.log("file", generatedFile);
      }
      setZoom(1)
      
    } catch (error) {
      console.log(error);
    }
  };
  const handleChangeImage = (e:any) => {
    const file = e.target.files[0]
   
    setImageFile(file)
    setImageSrc(URL.createObjectURL(file))
    
  }

  const handleZoomMinus =() => {
    if (zoom != 1) {
      setZoom(zoom - .5)
    }
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <input type="file" onChange={(e:any) => handleChangeImage(e)}/>
      <div>
        <div className="w-[350px] h-[350px] mx-auto bg-blue-950 overflow-hidden relative">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropChange={setCrop}
          onCropComplete={cropComplete}
          cropShape="round"
        />
        </div>
        <div>
          <div>
            <button onClick={handleZoomMinus} className="bg-blue-500 px-2 py-2 text-white">-</button>
            <input type="range" name="" id="" value={zoom} step={.5} min={1} onChange={(e) => setZoom(parseInt(e.target.value))}/>
            <button onClick={() => setZoom(zoom + .5)} className="bg-blue-500 px-2 py-2 text-white">+</button>
          </div>
        </div>
        <div>
          <button onClick={cropImage} className="px-10 py-3 mt-3 mx-auto bg-green-900 text-white">Crop Image</button>
        </div>

        
       {
        imageSrc && 
        <div>
          <h2>Out Put</h2>
          <Image
        alt=""
        src={imageSrc}
        height={350}
        width={350}
      />
        </div>
       }
      </div>
    </main>
  );
}
