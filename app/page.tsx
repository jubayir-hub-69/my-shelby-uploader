"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const [uploadedFiles, setUploadedFiles] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(
        localStorage.getItem("shelby_uploads") || "[]"
      );
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      "shelby_uploads",
      JSON.stringify(uploadedFiles)
    );
  }, [uploadedFiles]);

  async function connectWallet() {
    try {
      let provider = null;

      if (
        typeof window !== "undefined" &&
        window.aptos
      ) {
        provider = window.aptos;
      }

      else if (
        typeof window !== "undefined" &&
        window.petra
      ) {
        provider = window.petra;
      }

      if (!provider) {

        const mobile =
          /Android|iPhone|iPad|iPod/i.test(
            navigator.userAgent
          );

        if (mobile) {

          window.location.href =
            "petra://";

          setTimeout(() => {

            window.open(
              "https://petra.app/",
              "_blank"
            );

          },1500);

        }

        else {

          alert(
            "Petra wallet extension install করুন"
          );

        }

        return;
      }

      const response =
        await provider.connect();

      const account =
        await provider.account();

      const address =
        response?.address ||
        account?.address;

      if (address) {

        setWalletConnected(true);

        setWalletAddress(address);

        localStorage.setItem(
          "wallet",
          address
        );

      }

    }

    catch(err){

      console.log(err);

      alert(
        "Wallet connection failed"
      );

    }
  }

  function disconnectWallet() {

    setWalletConnected(false);

    setWalletAddress("");

    localStorage.removeItem(
      "wallet"
    );

  }

  function uploadFile(){

    if(!selectedFile) return;

    setProgress(100);

    setUploadedFiles(
      prev=>[
        selectedFile.name,
        ...prev
      ]
    );

  }

  return (

<div
style={{
background:"#020817",
minHeight:"100vh",
padding:"20px",
color:"white"
}}
>

<div
style={{
display:"flex",
justifyContent:
"space-between",
alignItems:"center"
}}
>

<div>

<h1
style={{
fontSize:"55px",
color:"#14c8ff"
}}
>
Shelby
</h1>

<p>
Storage Dashboard
</p>

</div>

<div>

{
walletConnected ?

<div
style={{
display:"flex",
gap:"10px"
}}
>

<button
style={{
background:"#14c8ff",
padding:"12px",
borderRadius:"8px"
}}
>

{
walletAddress
.slice(0,6)

+

"..."

+

walletAddress
.slice(-4)
}

</button>

<button
onClick={
disconnectWallet
}
style={{
background:"red",
padding:"12px",
borderRadius:"8px"
}}
>

Disconnect

</button>

</div>

:

<button
onClick={
connectWallet
}
style={{
background:"#14c8ff",
padding:"12px",
borderRadius:"8px"
}}
>

Connect Wallet

</button>

}

</div>

</div>

<br/>

<div
style={{
display:"grid",
gridTemplateColumns:
"repeat(4,1fr)",
gap:"15px"
}}
>

<div
style={{
background:"#0f172a",
padding:"20px",
borderRadius:"10px"
}}
>

Files Uploaded

<br/>

{
uploadedFiles.length
}

</div>

<div
style={{
background:"#0f172a",
padding:"20px",
borderRadius:"10px"
}}
>

Storage Active

</div>

<div
style={{
background:"#0f172a",
padding:"20px",
borderRadius:"10px"
}}
>

{
walletConnected
?
"Network Connected"
:
"Network Offline"
}

</div>

<div
style={{
background:"#0f172a",
padding:"20px",
borderRadius:"10px"
}}
>

{
walletConnected
?
"Wallet Connected"
:
"Wallet Not Connected"
}

</div>

</div>

<br/>

<div
style={{
background:"#081224",
padding:"40px",
borderRadius:"20px"
}}
>

<h1
style={{
textAlign:"center",
fontSize:"60px",
color:"#14c8ff"
}}
>

Shelby File Uploader

</h1>

<p
style={{
textAlign:"center"
}}
>

Powered by Aptos

</p>

<br/>

<input

type="file"

onChange={e=>

setSelectedFile(

e.target.files[0]

)

}

/>

<br/>
<br/>

<button

onClick={uploadFile}

style={{

background:"#14c8ff",

padding:"15px",

borderRadius:"10px"

}}

>

Upload To Shelby

</button>

<br/>
<br/>

Upload:

{progress}%

</div>

<br/>

<div
style={{
display:"grid",
gridTemplateColumns:
"1fr 1fr",
gap:"20px"
}}
>

<div
style={{
background:"#0f172a",
padding:"20px",
borderRadius:"10px"
}}
>

Upload History

<br/>
<br/>

{

uploadedFiles.map(
(
item,
i
)=>

<div key={i}>

{item}

</div>

)

}

</div>

<div
style={{
background:"#0f172a",
padding:"20px",
borderRadius:"10px"
}}
>

Recent Activity

<br/>

{
walletConnected
?
"Wallet Connected"
:
"Wallet Offline"
}

<br/>

Storage Active

<br/>

File Verified

</div>

</div>

<br/>

<center>

Shelby Storage Protocol Built With Aptos

</center>

</div>

  );
}
