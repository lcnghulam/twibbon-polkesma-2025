"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import LogosHeader from "@/components/LogosHeader";

export default function Home() {
  // Canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [initialPinchDistance, setInitialPinchDistance] = useState<
    number | null
  >(null);
  const [initialScale, setInitialScale] = useState(1);
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [twibbonImg, setTwibbonImg] = useState<HTMLImageElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isTwibbonActive, setIsTwibbonActive] = useState(false);
  const canvasSize = 300;

  useEffect(() => {
    const twibbon = new Image();
    twibbon.src = "/twibbon.png";
    twibbon.onload = () => setTwibbonImg(twibbon);
    drawInitialCanvas();
  }, []);

  useEffect(() => {
    if (imageObj) drawCanvas();
  }, [imageObj, pos, scale, rotation]);

  const drawInitialCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    ctx.fillStyle = "#333";
    ctx.font = "15px Poppins";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "Twibbon akan muncul disini...",
      canvasSize / 2,
      canvasSize / 2
    );
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !twibbonImg) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    if (imageObj) {
      ctx.save();
      ctx.translate(pos.x + canvasSize / 2, pos.y + canvasSize / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.drawImage(
        imageObj,
        -imageObj.width / 2,
        -imageObj.height / 2,
        imageObj.width,
        imageObj.height
      );
      ctx.restore();
    }

    if (isTwibbonActive) {
      ctx.drawImage(twibbonImg, 0, 0, canvasSize, canvasSize);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Hanya file JPG/JPEG/PNG yang diperbolehkan.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const { width, height } = img;
        const maxDim = Math.max(width, height);
        const fitScale = canvasSize / maxDim;

        setImageObj(img);
        setIsTwibbonActive(true);
        setRotation(0);
        setPos({ x: 0, y: 0 });
        setScale(fitScale); // auto scale based on largest side
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageObj) return;
    setDragging(true);
    setOffset({
      x: e.nativeEvent.offsetX - pos.x - canvasSize / 2,
      y: e.nativeEvent.offsetY - pos.y - canvasSize / 2,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPos({
      x: e.nativeEvent.offsetX - canvasSize / 2 - offset.x,
      y: e.nativeEvent.offsetY - canvasSize / 2 - offset.y,
    });
  };

  const getDistance = (
    t1: React.Touch | Touch,
    t2: React.Touch | Touch
  ): number => {
    const touch1 = t1 as Touch;
    const touch2 = t2 as Touch;
    return Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = getDistance(e.touches[0], e.touches[1]);
      setInitialPinchDistance(dist);
      setInitialScale(scale);
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      setDragging(true);
      setOffset({
        x: touch.clientX - rect.left - pos.x - canvasSize / 2,
        y: touch.clientY - rect.top - pos.y - canvasSize / 2,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistance) {
      e.preventDefault();
      const newDist = getDistance(e.touches[0], e.touches[1]);
      const scaleFactor = newDist / initialPinchDistance;
      const newScale = Math.max(0.1, Math.min(2, initialScale * scaleFactor)); // clamp
      setScale(newScale);
    } else if (dragging && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPos({
        x: touch.clientX - rect.left - canvasSize / 2 - offset.x,
        y: touch.clientY - rect.top - canvasSize / 2 - offset.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setDragging(false);
    setInitialPinchDistance(null);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleDownload = () => {
    const originalCanvas = canvasRef.current;
    if (!originalCanvas || !twibbonImg || !imageObj) return;

    const exportCanvas = document.createElement("canvas");
    const exportSize = {
      width: twibbonImg.width,
      height: twibbonImg.height,
    };

    exportCanvas.width = exportSize.width;
    exportCanvas.height = exportSize.height;

    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    const scaleRatioX = twibbonImg.width / canvasSize;
    const scaleRatioY = twibbonImg.height / canvasSize;

    const scaledX = (pos.x + canvasSize / 2) * scaleRatioX;
    const scaledY = (pos.y + canvasSize / 2) * scaleRatioY;

    const scaledImageWidth = imageObj.width * scale * scaleRatioX;
    const scaledImageHeight = imageObj.height * scale * scaleRatioY;

    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, exportSize.width, exportSize.height);

    // Draw user image
    ctx.save();
    ctx.translate(scaledX, scaledY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(
      imageObj,
      -scaledImageWidth / 2,
      -scaledImageHeight / 2,
      scaledImageWidth,
      scaledImageHeight
    );
    ctx.restore();

    // Draw Twibbon
    ctx.drawImage(twibbonImg, 0, 0, exportSize.width, exportSize.height);

    // Download
    const link = document.createElement("a");
    link.download = "twibbon-polkesma-2025.png";
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  };

  const handleReset = () => {
    setImageObj(null);
    setScale(1);
    setRotation(0);
    setPos({ x: 0, y: 0 });
    setIsTwibbonActive(false);
    drawInitialCanvas();
  };

  const handleRotateRight = () => {
    setRotation((prev) => prev + 90);
  };

  useEffect(() => {
    if (showPreview) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    if (!showPreview) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowPreview(false);
      }
    }

    function handleEscKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowPreview(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [showPreview]);

  // IG Caption
  const [nama, setNama] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [prodi, setProdi] = useState("");
  const [caption, setCaption] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fallbackNama = nama.trim() === `` ? "{𝙣𝙖𝙢𝙖}" : `"${nama}"`;
    const fallbackJurusan = jurusan.trim() === `` ? "{𝙟𝙪𝙧𝙪𝙨𝙖𝙣}" : jurusan;
    const fallbackProdi = prodi.trim() === `` ? "{𝙥𝙧𝙤𝙙𝙞}" : prodi;

    const newCaption = `✨ 𝐂𝐀𝐏𝐓𝐈𝐎𝐍 𝐓𝐖𝐈𝐁𝐁𝐎𝐍 𝐏𝐊𝐊𝐌𝐁 𝟐𝟎𝟐𝟒 🦚

Haloo Polkesma Muda 🙌🏼

Saya ${fallbackNama} dari Jurusan ${fallbackJurusan} Prodi ${fallbackProdi} bangga menjadi bagian dari keluarga besar Politeknik Kesehatan Kemenkes Malang dan siap menyukseskan Pengenalan Kehidupan Kampus Mahasiswa Baru (PKKMB) Polkesma 2024

POLKESMA MUDA!

Satu Tuju, Satu Jiwa Wujudkan Polkesma Mendunia

"𝑷𝒆𝒏𝒅𝒊𝒅𝒊𝒌𝒂𝒏 𝒂𝒅𝒂𝒍𝒂𝒉 𝒂𝒘𝒂𝒍 𝒅𝒂𝒓𝒊 𝒑𝒆𝒓𝒖𝒃𝒂𝒉𝒂𝒏, 𝒕𝒂𝒏𝒑𝒂 𝒑𝒆𝒏𝒅𝒊𝒅𝒊𝒌𝒂𝒏 𝒕𝒊𝒅𝒂𝒌 𝒂𝒅𝒂 𝒑𝒆𝒓𝒂𝒅𝒂𝒃𝒂𝒏." - 𝗡𝗮𝗷𝘄𝗮 𝗦𝗵𝗶𝗵𝗮𝗯

@pkkmbpolkesma @pkkmbpolkesma @pkkmbpolkesma

#PKKMB2024
#PKKMBPOLKESMA2024
#MABAPOLKESMA2024
#BEMPOLKESMA
#POLKESMAMUDA2024
#CASAGLORETHA`;

    setCaption(newCaption);
  }, [nama, jurusan, prodi]);

  const handleCopy = async () => {
    if (copied) return;

    try {
      const textarea = document.createElement("textarea");
      textarea.value = caption;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);

      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);

      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        throw new Error("Fallback copy gagal");
      }
    } catch (err) {
      console.error("Gagal menyalin caption:", err);
      alert(
        "Browser kamu tidak mendukung fitur salin otomatis. Silakan salin manual."
      );
    }
  };

  return (
    <div className="container p-4 border-2 border-solid">
      <LogosHeader />
      <h1 className="text-2xl tracking-[4] font-bold mb-2">
        🎉 Twibbon PKKMB Polkesma 2025 😁
      </h1>
      <span className="greeting font-extralight">
        Halo teman-teman! 👋 Selamat datang di Website Twibbon Polkesma! Buat
        Twibbon gampang, tinggal upload foto lalu sesuaikan, dan... jadi deh...
        Yuk Gasss ✌️👇👇👇
      </span>
      <div className="twibbon-section py-4">
        <canvas
          ref={canvasRef}
          className={`${
            imageObj ? "cursor-move" : "cursor-default"
          } border mb-3 mx-auto`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        {imageObj && (
          <div className="canvas-controls flex flex-col mb-4">
            <span className="canvas-info mx-auto text-center">
              Drag/Pinch-Zoom melalui canvas untuk geser/ubah ukuran gambar atau
              menggunakan bar-slider tool dibawah ini:
            </span>
            <label className="block mb-2">
              Resize:
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.01"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full"
              />
            </label>

            <label className="block mb-2">
              Geser Horizontal (X):
              <input
                type="range"
                min={-canvasSize / 2}
                max={canvasSize / 2}
                step="1"
                value={pos.x}
                onChange={(e) => setPos({ ...pos, x: Number(e.target.value) })}
                className="w-full"
              />
            </label>

            <label className="block mb-2">
              Geser Vertikal (Y):
              <input
                type="range"
                min={-canvasSize / 2}
                max={canvasSize / 2}
                step="1"
                value={pos.y}
                onChange={(e) => setPos({ ...pos, y: Number(e.target.value) })}
                className="w-full"
              />
            </label>

            <div className="flex justify-between gap-2 mt-3">
              <button
                onClick={handleRotateRight}
                className="btn-rotate inline-flex items-center justify-center gap-2"
              >
                Rotate
                <Icon icon="fa:rotate-right" />
              </button>
              <button onClick={handleReset} className="btn-reset">
                Reset
              </button>
            </div>
          </div>
        )}

        <div className="twibbon-buttons mb-3 flex justify-center gap-3 flex-wrap">
          <input
            type="file"
            accept="image/jpeg,image/png"
            ref={fileInputRef}
            className="hidden"
            onChange={handleUpload}
          />

          <button
            className="btn-upload"
            onClick={() => fileInputRef.current?.click()}
          >
            <Icon icon="ep:upload-filled" />
            <span className="ms-1">Upload</span>
          </button>

          {imageObj && (
            <>
              <button
                onClick={() => setShowPreview(true)}
                className="btn-preview bg-blue-500 text-white px-3 py-1 rounded"
              >
                <Icon icon="mdi:eye" />
                <span className="ms-1">Preview</span>
              </button>

              <button
                onClick={handleDownload}
                className="btn-download bg-green-500 text-white px-3 py-1 rounded"
              >
                <Icon icon="tabler:download" className="h-5" />
                <span className="ms-1">Download</span>
              </button>
            </>
          )}
        </div>

        {showPreview && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div
              className="modal-preview bg-white p-4 rounded-lg relative w-[320px]"
              ref={modalRef}
            >
              <button
                onClick={() => setShowPreview(false)}
                className="absolute top-2 right-2 text-red-500"
              >
                ✖
              </button>
              <h2 className="font-semibold mb-2">Preview Twibbon</h2>
              <img
                src={canvasRef.current?.toDataURL("image/png")}
                alt="Preview"
              />
            </div>
          </div>
        )}
        <hr className="my-5" />
        <div className="twibbon-ig flex flex-col gap-2">
          <div className="title inline-flex items-center gap-2 mx-auto">
            <Icon icon="akar-icons:instagram-fill" className="w-6 h-6" />
            <h3 className="font-bold">Caption IG</h3>
          </div>
          <span className="description">
            Siap post feed ke IG? 😍 Yuk isi data dibawah untuk caption 👇
          </span>
          <div id="captionIG" className="flex flex-col pt-4">
            <div className="flex flex-col gap-1 mb-2">
              <label htmlFor="nama">Nama Lengkap</label>
              <input
                type="text"
                name="nama"
                id="nama"
                placeholder="Muhammad Stevanus Akbar"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <label htmlFor="jurusan">Jurusan</label>
              <input
                type="text"
                name="jurusan"
                id="jurusan"
                placeholder="Kebidanan"
                value={jurusan}
                onChange={(e) => setJurusan(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <label htmlFor="prodi">Prodi</label>
              <input
                type="text"
                name="prodi"
                id="prodi"
                placeholder="Asuransi Kesehatan"
                value={prodi}
                onChange={(e) => setProdi(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <label htmlFor="caption">Format Caption</label>
              <textarea
                name="caption"
                id="caption"
                rows={15}
                readOnly
                value={caption}
              />
            </div>
            <div className="caption-buttons inline-flex justify-center items-center">
              <button
                className={copied ? "btn-copied" : "btn-copy"}
                onClick={handleCopy}
                disabled={copied}
              >
                <Icon
                  icon={copied ? "mingcute:check-line" : "ic:twotone-copy-all"}
                />
                <span className="ms-1">{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="footer inline-flex items-center gap-1">
        <span className="font-extralight">Twibbon Maker by ❤️</span>
        <a
          href="https://lcnghulam.vercel.app"
          target="_blank"
          className="font-bold"
        >
          AGA Dev
        </a>
      </div>
    </div>
  );
}
