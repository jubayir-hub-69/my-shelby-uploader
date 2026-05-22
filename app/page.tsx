"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    aptos?: any;
    petra?: any;
  }
}

export default function Home() {

  const [walletConnected,setWalletConnected]=useState(false);

  const [walletAddress,setWalletAddress]=useState("");

  const [uploadedFiles,setUploadedFiles]=useState<string[]>([]);

  const [selectedFile,setSelectedFile]=useState<File|null>(null);

  const [progress,setProgress]=useState(0);

  useEffect(()=>{

    const savedFiles=
      localStorage.getItem(
        "shelby_uploads"
      );

    const savedWallet=
      localStorage.getItem(
        "wallet"
      );

    if(savedFiles){

      setUploadedFiles(
        JSON.parse(savedFiles)
      );

    }

    if(savedWallet){

      setWalletConnected(
        true
      );

      setWalletAddress(
        savedWallet
      );

    }

  },[]);

  useEffect(()=>{

    localStorage.setItem(
      "shelby_uploads",

      JSON.stringify(
        uploadedFiles
      )

    );

  },[uploadedFiles]);

  async function connectWallet(){

    try{

      let provider=null;

      const aptos=
        typeof window!=="undefined"
        ?window.aptos
        :null;

      const petra=
        typeof window!=="undefined"
        ?window.petra
        :null;

      if(aptos){

        provider=aptos;

      }

      else if(petra){

        provider=petra;

      }

      if(!provider){

        const mobile=
          /Android|iPhone|iPad/i
          .test(
            navigator.userAgent
          );

        if(mobile){

          alert(
            "Petra Wallet install করুন"
          );

          window.open(
            "https://petra.app/",
            "_blank"
          );

        }

        else{

          alert(
            "Petra extension install করুন"
          );

        }

        return;

      }

      const response=
        await provider.connect();

      const account=
        await provider.account?.();

      const address=
        response?.address ||
        account?.address ||
        "";

      if(address){

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

    catch{

      alert(
        "Wallet connection failed"
      );

    }

  }

  function disconnectWallet(){

    setWalletConnected(
      false
    );

    setWalletAddress("");

    localStorage.removeItem(
      "wallet"
    );

  }

  function uploadFile(){

    if(!selectedFile){

      alert(
        "Select file"
      );

      return;

    }

    setProgress(20);

    setTimeout(()=>{

      setProgress(100);

      setUploadedFiles(
        prev=>[
          ...prev,
          selectedFile.name
        ]
      );

    },1000);

  }

  return(

<div
style={{
background:"#01081f",
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
color:"#19d4ff"
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
walletConnected?

<button
onClick={
disconnectWallet
}
>
Disconnect
</button>

:

<button
onClick={
connectWallet
}
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

<div>
Files Uploaded

<br/>

{
uploadedFiles.length
}

</div>

<div>
Storage Active
</div>

<div>

{
walletConnected?

"Network Connected"

:

"Network Offline"

}

</div>

<div>

{
walletConnected?

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
padding:"30px",
background:"#07142d",
borderRadius:"20px"
}}
>

<h1
style={{
textAlign:"center",
color:"#19d4ff"
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

{progress}

%

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

<div>

<h3>
Upload History
</h3>

{

uploadedFiles.map(
(file,index)=>(

<div
key={index}
>

{file}

</div>

)

)

}

</div>

<div>

<h3>
Recent Activity
</h3>

<div>

{
walletConnected?

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
textAlign:"center"
}}
>

Shelby Storage Protocol Built With Aptos

</p>

</div>

  );

}
