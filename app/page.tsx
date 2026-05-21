"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    aptos?: any;
    petra?: any;
  }
}

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [progress, setProgress] = useState(0);

  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedWallet =
      localStorage.getItem(
        "shelby_wallet"
      );

    if (savedWallet) {
      const data =
        JSON.parse(
          savedWallet
        );

      setWalletConnected(
        data.connected || false
      );

      setWalletAddress(
        data.address || ""
      );
    }

    const uploads =
      localStorage.getItem(
        "shelby_uploads"
      );

    if (uploads) {
      setUploadedFiles(
        JSON.parse(
          uploads
        )
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "shelby_uploads",

      JSON.stringify(
        uploadedFiles
      )
    );
  }, [uploadedFiles]);

  async function connectWallet() {
    try {

      let provider = null;

      if (window.aptos) {
        provider =
          window.aptos;
      }

      else if (
        window.petra
      ) {
        provider =
          window.petra;
      }

      if (!provider) {

        alert(
          "Petra Wallet পাওয়া যায়নি"
        );

        return;
      }

      const response =
        await provider.connect();

      const address =

        response?.address ||

        (
          await provider.account?.()
        )?.address ||

        "";

      if (address) {

        setWalletConnected(
          true
        );

        setWalletAddress(
          address
        );

        localStorage.setItem(

          "shelby_wallet",

          JSON.stringify({

            connected:
              true,

            address

          })

        );

      }

    } catch (err) {

      console.log(err);

      alert(
        "Wallet connection failed"
      );

    }
  }

  async function disconnectWallet() {

    try {

      const provider =

        window.aptos ||

        window.petra;

      if (
        provider?.disconnect
      ) {

        await provider.disconnect();

      }

    } catch {}

    setWalletConnected(
      false
    );

    setWalletAddress(
      ""
    );

    localStorage.removeItem(
      "shelby_wallet"
    );

  }

  function handleFile(
    e: any
  ) {

    const file =
      e.target.files[0];

    if (!file) return;

    setSelectedFile(
      file
    );

    setPreview(
      URL.createObjectURL(
        file
      )
    );

  }

  function uploadFile() {

    if (
      !selectedFile
    ) return;

    let p = 0;

    setProgress(0);

    const interval =

      setInterval(() => {

      p += 10;

      setProgress(
        p
      );

      if (
        p >= 100
      ) {

        clearInterval(
          interval
        );

        setUploadedFiles(
          prev => [

            {

              name:
                selectedFile.name,

              size:
                (
                  selectedFile.size /
                  1024
                ).toFixed(2),

              time:
                new Date()
                .toLocaleTimeString()

            },

            ...prev

          ]
        );

      }

    }, 150);

  }

  const filtered =

    uploadedFiles.filter(
      x =>

        x.name

        .toLowerCase()

        .includes(

          search

          .toLowerCase()

        )

    );

  return (

<main className="
min-h-screen
bg-slate-950
text-white
p-5
">

<div className="
flex
justify-between
items-start
mb-8
">

<div>

<h1 className="
text-5xl
font-bold
text-cyan-400
">

Shelby

</h1>

<p>

Storage Dashboard

</p>

</div>

{

!walletConnected ?

<button

onClick={
connectWallet
}

className="
bg-cyan-500
px-5
py-3
rounded-xl
"

>

Connect Wallet

</button>

:

<div className="
flex
gap-3
">

<button className="
bg-cyan-600
px-4
py-2
rounded
">

{
walletAddress
.slice(0,6)
}

...

{
walletAddress
.slice(-4)
}

</button>

<button

onClick={
disconnectWallet
}

className="
bg-red-600
px-4
py-2
rounded
"

>

Disconnect

</button>

</div>

}

</div>

<div className="
grid
md:grid-cols-4
gap-4
mb-8
">

<div className="
bg-slate-900
p-5
rounded
">

Files Uploaded

<h2 className="
text-2xl
mt-2
">

{
uploadedFiles.length
}

</h2>

</div>

<div className="
bg-slate-900
p-5
rounded
">

Storage Active

</div>

<div className="
bg-slate-900
p-5
rounded
">

Network

{
walletConnected
?
" Connected"
:
" Offline"
}

</div>

<div className="
bg-slate-900
p-5
rounded
">

Last Upload

{
uploadedFiles[0]
?.name ||
"None"
}

</div>

</div>

<div className="
bg-slate-900
p-8
rounded-3xl
">

<h1 className="
text-center
text-5xl
text-cyan-400
">

Shelby File Uploader

</h1>

<p className="
text-center
mt-2
">

Powered by Aptos

</p>

<div className="
border-2
border-dashed
border-cyan-500
rounded-3xl
h-56
flex
items-center
justify-center
mt-8
">

Drag & Drop Files

</div>

<input
type="file"
onChange={
handleFile
}
className="
mt-5
"
/>

{

preview &&

<img

src={preview}

className="
w-32
h-32
object-cover
rounded
mt-5
"

/>

}

<button

onClick={
uploadFile
}

className="
bg-cyan-500
px-5
py-3
rounded
mt-5
"

>

Upload To Shelby

</button>

<div className="
w-full
h-4
bg-slate-700
rounded
mt-5
">

<div

style={{
width:
`${progress}%`
}}

className="
h-4
bg-cyan-400
rounded
"

/>

</div>

</div>

<div className="
grid
md:grid-cols-2
gap-6
mt-8
">

<div className="
bg-slate-900
p-5
rounded
">

<div className="
flex
justify-between
mb-4
">

<h2>

Upload History

</h2>

<button

onClick={() => {

setUploadedFiles(
[]
);

localStorage.removeItem(
"shelby_uploads"
);

}}

className="
bg-red-600
px-3
py-1
rounded
"

>

Clear

</button>

</div>

<input

value={search}

onChange={
e=>

setSearch(
e.target.value
)

}

placeholder="Search"

className="
w-full
p-3
bg-slate-800
rounded
mb-4
"

/>

{

filtered.map(
(file,i)=>

<div

key={i}

className="
bg-slate-800
p-3
rounded
mb-3
"

>

{file.name}

</div>

)

}

</div>

<div className="
bg-slate-900
p-5
rounded
">

<h2>

Recent Activity

</h2>

<div className="
space-y-3
mt-4
">

<div className="
bg-slate-800
p-3
rounded
">

Wallet Ready

</div>

<div className="
bg-slate-800
p-3
rounded
">

Storage Active

</div>

<div className="
bg-slate-800
p-3
rounded
">

Upload Verified

</div>

</div>

</div>

</div>

<footer className="
text-center
mt-10
text-gray-400
">

Shelby Storage Protocol Built With Aptos

</footer>

</main>

);

}
