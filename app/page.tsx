"use client";

import { useState, useEffect } from "react";

export default function Home() {

const [walletConnected,setWalletConnected]=useState(false);

const [walletAddress,setWalletAddress]=useState("");

const [selectedFile,setSelectedFile]=useState<File|null>(null);

const [uploadedFiles,setUploadedFiles]=useState<string[]>([]);

const [progress,setProgress]=useState(0);

useEffect(()=>{

const savedUploads=

JSON.parse(

localStorage.getItem(

"shelby_uploads"

)||"[]"

);

setUploadedFiles(

savedUploads

);

const savedWallet=

JSON.parse(

localStorage.getItem(

"shelby_wallet"

)||"{}"

);

if(savedWallet.connected){

setWalletConnected(true);

setWalletAddress(

savedWallet.address

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

let provider:any=null;

if(typeof window!=="undefined"){

if((window as any).aptos){

provider=

(window as any).aptos;

}

else if(

(window as any).petra

){

provider=

(window as any).petra;

}

}

if(!provider){

const mobile=

/android|iphone|ipad/

.test(

navigator.userAgent

.toLowerCase()

);

if(mobile){

window.location.href=

"https://petra.app/?url="+

encodeURIComponent(

window.location.href

);

return;

}

alert(

"Petra Wallet install করুন"

);

return;

}

const response=

await provider.connect();

let address=

response?.address;

if(

!address &&

provider.account

){

const acc=

await provider.account();

address=

acc?.address;

}

if(!address){

throw new Error();

}

setWalletConnected(

true

);

setWalletAddress(

address

);

localStorage.setItem(

"shelby_wallet",

JSON.stringify({

connected:true,

address

})

);

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

"shelby_wallet"

);

}

function uploadFile(){

if(!selectedFile)return;

setProgress(100);

setUploadedFiles([

selectedFile.name,

...uploadedFiles

]);

}

return(

<div
style={{

background:"#020617",

minHeight:"100vh",

padding:"20px",

color:"white"

}}

>

<div

style={{

display:"flex",

justifyContent:

"space-between"

}}

>

<div>

<h1

style={{

color:"#22d3ee",

fontSize:"52px"

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

gap:"10px"

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

walletAddress.slice(

0,10

)+"..."

:

"Wallet Not Connected"

}

</div>

</div>

<br/>

<div

style={{

background:"#071229",

padding:"30px",

borderRadius:"20px"

}}

>

<h1

style={{

textAlign:"center",

color:"#22d3ee"

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

onChange={(e)=>

setSelectedFile(

e.target.files?.[0]

||

null

)

}

/>

<br/><br/>

<button

onClick={uploadFile}

>

Upload To Shelby

</button>

<br/><br/>

<div>

Upload:

{progress}%

</div>

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

<br/>

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
