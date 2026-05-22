"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    aptos?: any;
    petra?: any;
    martian?: any;
  }
}

export default function Home() {

  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {

    const savedWallet =
      localStorage.getItem(
        "wallet"
      );

    const savedFiles =
      localStorage.getItem(
        "shelby_uploads"
      );

    if (savedWallet) {

      setWalletConnected(
        true
      );

      setWalletAddress(
        savedWallet
      );

    }

    if (savedFiles) {

      setUploadedFiles(

        JSON.parse(
          savedFiles
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

      let provider: any = null;

      if (
        typeof window !==
        "undefined"
      ) {

        const w: any =
          window;

        provider =

          w.aptos ||

          w.petra ||

          w.martian ||

          null;

      }

      if (!provider) {

        const mobile =

          /Android|iPhone|iPad|iPod/i
          .test(
            navigator.userAgent
          );

        if (mobile) {

          alert(
            "Open this website from Petra browser"
          );

          window.open(
            "https://petra.app/",
            "_blank"
          );

        }

        else {

          alert(
            "Install Petra extension"
          );

        }

        return;

      }

      const response =

        await provider.connect();

      const account =

        response ||

        await provider.account?.();

      const address =

        account?.address ||

        "";

      if (address) {

        setWalletConnected(
          true
        );

        setWalletAddress(
          address
        );

        localStorage.setItem(

          "wallet",

          address

        );

      }

    }

    catch (err) {

      console.log(
        err
      );

      alert(
        "Wallet connection failed"
      );

    }

  }

  function disconnectWallet() {

    setWalletConnected(
      false
    );

    setWalletAddress(
      ""
    );

    localStorage.removeItem(
      "wallet"
    );

  }

  function uploadFile() {

    if (
      !selectedFile
    ) {

      alert(
        "Select file first"
      );

      return;

    }

    setProgress(
      20
    );

    setTimeout(() => {

      setProgress(
        100
      );

      setUploadedFiles(
        prev => [

          ...prev,

          selectedFile.name

        ]
      );

    }, 1000);

  }

  return (

<div
style={{
background:
"linear-gradient(180deg,#01081f,#020d33)",
minHeight:
"100vh",
padding:
"20px",
color:
"white"
}}
>

<div
style={{
display:
"flex",
justifyContent:
"space-between",
alignItems:
"center"
}}
>

<div>

<h1
style={{
fontSize:
"60px",
margin:
0,
color:
"#22d3ee"
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

<button
onClick={
disconnectWallet
}
style={{
padding:
"12px",
background:
"red",
border:
"none",
borderRadius:
"8px",
color:
"white"
}}
>

Disconnect

</button>

:

<button
onClick={
connectWallet
}
style={{
padding:
"12px",
background:
"#06b6d4",
border:
"none",
borderRadius:
"8px",
color:
"white"
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
display:
"grid",
gridTemplateColumns:
"repeat(4,1fr)",
gap:
"15px"
}}
>

<div
style={{
background:
"#07142d",
padding:
"20px",
borderRadius:
"14px"
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
background:
"#07142d",
padding:
"20px",
borderRadius:
"14px"
}}
>

Storage Active

</div>

<div
style={{
background:
"#07142d",
padding:
"20px",
borderRadius:
"14px"
}}
>

{
walletConnected ?

"Network Connected"

:

"Network Offline"

}

</div>

<div
style={{
background:
"#07142d",
padding:
"20px",
borderRadius:
"14px"
}}
>

{
walletConnected ?

walletAddress
.slice(0,8)

:

"Wallet Not Connected"

}

</div>

</div>

<br/><br/>

<div
style={{
background:
"#07142d",
padding:
"30px",
borderRadius:
"20px"
}}
>

<h1
style={{
textAlign:
"center",
color:
"#22d3ee"
}}
>

Shelby File Uploader

</h1>

<p
style={{
textAlign:
"center"
}}
>

Powered by Aptos

</p>

<br/>

<input
type="file"
onChange={e=>

setSelectedFile(
e.target.files?.[0]
||
null
)

}
/>

<br/><br/>

<button
onClick={
uploadFile
}
>

Upload To Shelby

</button>

<br/><br/>

Upload:

{
progress
}

%

</div>

<br/>

<div
style={{
display:
"grid",
gridTemplateColumns:
"1fr 1fr",
gap:
"20px"
}}
>

<div>

<h3>

Upload History

</h3>

{

uploadedFiles.map(
(file,index)=>

<div
key={index}
>

{file}

</div>

)

}

</div>

<div>

<h3>

Recent Activity

</h3>

<div>

{
walletConnected ?

"Wallet Connected"

:

"Wallet Offline"

}

</div>

<div>

Storage Active

</div>

<div>

File Verified

</div>

</div>

</div>

<br/><br/>

<p
style={{
textAlign:
"center"
}}
>

Shelby Storage Protocol Built With Aptos

</p>

</div>

  );

}
