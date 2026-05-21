"use client";

import {
AptosWalletAdapterProvider,
useWallet
} from "@aptos-labs/wallet-adapter-react";

import { useState } from "react";

function WalletButton(){

const {
connect,
disconnect,
account
}=useWallet();

const [file,setFile]=useState<File|null>(null);

const [preview,setPreview]=useState("");

const [
uploadProgress,
setUploadProgress
]=useState(0);

const [
uploaded,
setUploaded
]=useState(false);

const [
history,
setHistory
]=useState<string[]>([]);

const [
fileInfo,
setFileInfo
]=useState<{
name:string;
size:string;
time:string;
}|null>(null);

const connectWallet=
async()=>{

try{

await connect(
"Petra"
);

}catch(e){

console.log(e);

}

};

const shortAddress=
account?.address

?

`${account.address
.toString()
.slice(0,6)}

...

${account.address
.toString()
.slice(-4)}`

:

"";

const handleUpload=()=>{

if(!file){

alert(
"Select file first"
);

return;

}

setUploaded(false);

let i=0;

const timer=
setInterval(()=>{

i+=10;

setUploadProgress(i);

if(i>=100){

clearInterval(
timer
);

setUploaded(true);

setHistory(prev=>[
file.name,
...prev
]);

}

},200);

};

return(

<div

style={{

minHeight:"100vh",

background:
"linear-gradient(135deg,#050816,#07172a,#111827)",

color:"white",

padding:"40px"

}}

>

<div

style={{

display:"flex",

justifyContent:
"space-between",

marginBottom:"40px"

}}

>

<div>

<h1

style={{

fontSize:"42px",

color:"#38bdf8"

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

account ?

<div>

{shortAddress}

<button

onClick={
disconnect
}

style={{

marginLeft:"10px",

padding:"10px"

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

padding:
"12px 22px",

borderRadius:
"14px",

background:
"#0ea5e9",

border:"none",

color:"white"

}}

>

Connect Wallet

</button>

}

</div>

</div>

<div

style={{

display:"grid",

gridTemplateColumns:
"repeat(auto-fit,minmax(220px,1fr))",

gap:"20px",

marginBottom:"35px"

}}

>

<div style={cardStyle}>

Files Uploaded

<h2>

{history.length}

</h2>

</div>

<div style={cardStyle}>

Storage

<h2>

Active

</h2>

</div>

<div style={cardStyle}>

Network

<h2>

{

account ?

"Connected"

:

"Offline"

}

</h2>

</div>

<div style={cardStyle}>

Last Upload

<h2>

{

history.length>0

?

history[0]

:

"None"

}

</h2>

</div>

</div>

<div

style={{

maxWidth:"850px",

margin:"auto",

padding:"40px",

borderRadius:"28px",

background:
"rgba(255,255,255,.04)",

backdropFilter:
"blur(14px)",

boxShadow:
"0 0 40px rgba(56,189,248,.18)"

}}

>

<h1

style={{

fontSize:"60px",

textAlign:"center",

color:"#38bdf8"

}}

>

Shelby File Uploader

</h1>

<p

style={{

textAlign:"center",

marginBottom:"30px"

}}

>

Secure file upload and ownership verification powered by Aptos

</p>

<div

style={{

padding:"50px",

border:
"3px dashed #38bdf8",

borderRadius:"24px",

textAlign:"center"

}}

>

<h2>

Drag & Drop Files

</h2>

<p>

or browse files

</p>

</div>

<br/>

<input

type="file"

onChange={(e)=>{

const selected=

e.target.files

?

e.target.files[0]

:

null;

setFile(selected);

if(selected){

setPreview(

URL.createObjectURL(
selected
)

);

setFileInfo({

name:
selected.name,

size:
(
selected.size/
1024
).toFixed(2)
+" KB",

time:
new Date()
.toLocaleTimeString()

});

}

}}

/>

<br/><br/>

{

preview && (

<img

src={preview}

style={{

width:"240px",

borderRadius:"18px"

}}

/>

)

}

<br/><br/>

<button

onClick={
handleUpload
}

style={{

padding:
"18px 36px",

borderRadius:
"18px",

background:
"linear-gradient(to right,#38bdf8,#22d3ee)",

border:"none",

color:"white",

fontWeight:"bold"

}}

>

Upload to Shelby

</button>

{

uploadProgress>0 && (

<div

style={{

marginTop:"25px"

}}

>

Upload:

{uploadProgress}%

<div

style={{

height:"10px",

background:"#222",

borderRadius:"10px"

}}

>

<div

style={{

width:
`${uploadProgress}%`,

height:"100%",

background:
"#38bdf8"

}}

/>

</div>

</div>

)

}

{

uploaded && (

<div

style={{

marginTop:"20px",

padding:"16px",

background:
"rgba(34,197,94,.15)",

border:
"1px solid #22c55e",

borderRadius:"14px"

}}

>

Upload Complete

</div>

)

}

{

fileInfo && (

<div

style={{

marginTop:"30px",

padding:"20px",

borderRadius:"18px",

background:
"rgba(255,255,255,.04)"

}}

>

<h3>

Selected File

</h3>

<p>

Name:
{fileInfo.name}

</p>

<p>

Size:
{fileInfo.size}

</p>

<p>

Time:
{fileInfo.time}

</p>

</div>

)

}

<div

style={{

display:"grid",

gap:"16px",

marginTop:"30px"

}}

>

<div style={featureStyle}>

File Ownership Verification

</div>

<div style={featureStyle}>

Decentralized Storage Ready

</div>

<div style={featureStyle}>

Aptos Wallet Integration

</div>

<div style={featureStyle}>

Wallet:

{

account ?

"Connected"

:

"Not Connected"

}

</div>

</div>

<h2

style={{

marginTop:"30px"

}}

>

Upload History

</h2>

{

history.map(
(item,index)=>(

<div

key={index}

style={{

padding:"12px",

marginTop:"10px",

background:
"rgba(255,255,255,.04)",

borderRadius:"12px"

}}

>

{item}

</div>

)

)

}

<div

style={{

marginTop:"40px",

textAlign:"center",

opacity:.7

}}

>

Shelby Storage Protocol

Built with Aptos

</div>

</div>

</div>

);

}

const cardStyle={

padding:"25px",

borderRadius:"18px",

background:
"rgba(255,255,255,.04)"

};

const featureStyle={

padding:"20px",

borderRadius:"16px",

background:
"rgba(255,255,255,.04)",

textAlign:
"center" as const

};

export default function Page(){

return(

<AptosWalletAdapterProvider
autoConnect={false}

>

<WalletButton/>

</AptosWalletAdapterProvider>

);

}
