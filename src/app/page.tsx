"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import Croppie from "croppie";
import "croppie/croppie.css";

export default function Home() {
  // Canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 300;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#333";
    ctx.font = "15px Poppins";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Twibbon akan muncul disini...", width / 2, height / 2);
  }, []);

  // IG Form
  const [nama, setNama] = useState("");
  const [prodi, setProdi] = useState("");
  const [caption, setCaption] = useState("");

  useEffect(() => {
    const fallbackNama = nama.trim() === `` ? "{𝙣𝙖𝙢𝙖}" : nama;
    const fallbackProdi = prodi.trim() === `` ? "{𝙥𝙧𝙤𝙙𝙞}" : prodi;

    const newCaption = `🚀 𝗜'𝗠 𝗥𝗘𝗔𝗗𝗬 𝗙𝗢𝗥 𝗦𝗣𝗠𝗕 𝟮𝟬𝟮𝟱 𝗣𝗢𝗟𝗞𝗘𝗦𝗠𝗔 ✨
"𝑲𝒏𝒐𝒘𝒍𝒆𝒅𝒈𝒆 𝒊𝒔 𝒑𝒐𝒘𝒆𝒓 𝒂𝒏𝒅 𝒑𝒐𝒘𝒆𝒓 𝒊𝒔 𝒂 𝒄𝒉𝒂𝒓𝒂𝒄𝒕𝒆𝒓"
Pengetahuan adalah kekuatan dan kekuatan adalah karakter

Haloo kawan! 👋🤩
Saya ${fallbackNama} dari ${fallbackProdi}
Saya siap mengikuti masa pengenalan lingkungan sekolah dan menjadi Mahasiswa Politeknik Kesehatan Malang yang mewujudkan generasi berpengetahuan, kuat, dan berkarakter.

@xxxxxx
@xxxxxx

#xxxxx
#xxxxx
#xxxxx`;

    setCaption(newCaption);
  }, [nama, prodi]);

  return (
    <div className="container p-4 border-2 border-solid">
      <h1 className="text-2xl tracking-[4] font-bold mb-2">
        🎉 Twibbon SPMB Polkesma 2025 😁
      </h1>
      <span className="greeting font-extralight">
        Halo teman-teman! 👋 Selamat datang di Website Twibbon Polkesma! Buat
        Twibbon gampang, tinggal upload foto lalu sesuaikan, dan... jadi deh...
        Yuk Gasss ✌️👇👇👇
      </span>
      <div className="twibbon-section py-4">
        <canvas
          className="border border-dashed rounded-lg w-fit object-fill mx-auto my-4"
          ref={canvasRef}
        />
        <div className="twibbon-buttons mb-2">
          <button className="btn-upload">
            <Icon icon="ep:upload-filled" />
            <span className="ms-1">Upload</span>
          </button>
          <button className="btn-preview">
            <Icon icon="mdi:eye" />
            <span className="ms-1">Preview</span>
          </button>
          <button className="btn-download">
            <Icon icon="tabler:download" className="h-5" />
            <span className="ms-1">Download</span>
          </button>
        </div>
        <hr className="my-5" />
        <div className="twibbon-ig flex flex-col gap-2">
          <div className="title inline-flex items-center gap-2 mx-auto">
            <Icon icon="akar-icons:instagram-fill" className="w-6 h-6" />
            <h3 className="font-bold">Instagram</h3>
          </div>
          <span className="description">
            Mau langsung post ke IG? 😍 Yuk isi data dibawah 👇
          </span>
          <form id="igForm" className="flex flex-col py-4">
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
              <label htmlFor="captionIG">Format Caption</label>
              <textarea
                name="caption"
                id="captionIG"
                rows={15}
                readOnly
                value={caption}
              />
            </div>
            <div className="post-buttons inline-flex justify-center items-center">
              <button className="btn-ig">
                <Icon icon="akar-icons:instagram-fill"/>
                <span className="ms-1">Post to IG</span>
              </button>
            </div>
          </form>
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
