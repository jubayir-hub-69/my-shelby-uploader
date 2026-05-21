"use client";

import {
AptosWalletAdapterProvider,
useWallet,
} from "@aptos-labs/wallet-adapter-react";

import { useState } from "react";

function WalletButton() {

const { connect, disconnect, account } = useWallet();

const [file, setFile] = useState<File | null>(null);

const [uploadProgress,setUploadProgress] = useState(0);

const [uploading,setUploading] = useState(false);

const [history,setHistory] = useState<string[]>([]);

const connectWallet = async () => {

try{

await connect("Petra");

}catch(e){

console.log(e);

}

};

const shortAddress = account?.address

? `${account.address.toString().slice(0,6)}...${account.address
.toString()
.slice(-4)}`

: "";

const handleUpload = () => {

if(!file){

alert("Select file first");

return;

}

setUploading(true);

for(let i=0;i<=100;i+=10){

setTimeout(()=>{

setUploadProgress(i);

if(i===100){

setUploading(false);

setHistory(prev=>[
...prev,
file.name
]);

}

},i*120);

}

};

return(

<div
style={{
minHeight:"100vh",
background:
"linear-gradient(135deg,#020617 0%,#071229 40%,#0f172a 100%)",
padding:"30px",
color:"white",
fontFamily:"Arial"
}}
>

<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:"40px"
}}
>

<div>

<div
style={{
fontSize:"32px",
fontWeight:"bold",
color:"#38bdf8"
}}
>
Shelby
</div>

<div
style={{
color:"#94a3b8"
}}
>
Storage Dashboard
</div>

</div>


{account ? (

<div>

<span>

{shortAddress}

</span>

<button

onClick={disconnect}

style={{

marginLeft:"12px",

padding:"10px 16px",

border:"none",

borderRadius:"12px",

cursor:"pointer"

}}

>

Disconnect

</button>

</div>

):(


<button

onClick={connectWallet}

style={{

padding:"10px 18px",

borderRadius:"12px",

border:"none",

cursor:"pointer"

}}

>

Connect Wallet

</button>

)}

</div>



<div

style={{

display:"grid",

gridTemplateColumns:
"repeat(auto-fit,minmax(220px,1fr))",

gap:"20px",

maxWidth:"950px",

margin:"0 auto 30px"

}}

>

<div
style={{
padding:"24px",
background:
"rgba(255,255,255,0.03)",
borderRadius:"20px",
border:
"1px solid rgba(255,255,255,0.08)"
}}
>

<div
style={{
color:"#94a3b8"
}}
>
Files Uploaded
</div>

<h2>

{history.length}

</h2>

</div>


<div
style={{
padding:"24px",
background:
"rgba(255,255,255,0.03)",
borderRadius:"20px",
border:
"1px solid rgba(255,255,255,0.08)"
}}
>

<div
style={{
color:"#94a3b8"
}}
>
Storage
</div>

<h2>

Active

</h2>

</div>



<div
style={{
padding:"24px",
background:
"rgba(255,255,255,0.03)",
borderRadius:"20px",
border:
"1px solid rgba(255,255,255,0.08)"
}}
>

<div
style={{
color:"#94a3b8"
}}
>
Network
</div>

<h2>

Aptos

</h2>

</div>

</div>



<div

style={{

maxWidth:"800px",

margin:"0 auto",

padding:"40px",

textAlign:"center",

borderRadius:"30px",

background:
"rgba(255,255,255,0.03)",

border:
"1px solid rgba(255,255,255,0.08)",

backdropFilter:"blur(12px)",

boxShadow:
"0 0 40px rgba(56,189,248,0.2)"

}}

>

<h1

style={{

fontSize:"54px",

background:
"linear-gradient(to right,#38bdf8,#06b6d4)",

WebkitBackgroundClip:"text",

WebkitTextFillColor:"transparent"

}}

>

Shelby File Uploader

</h1>


<p
style={{
color:"#94a3b8",
marginBottom:"30px"
}}
>

Secure file upload and ownership verification powered by Aptos

</p>



<div

style={{

border:
"2px dashed #38bdf8",

padding:"45px",

borderRadius:"20px",

marginBottom:"25px"

}}

>

<h3>

Drag & Drop Files

</h3>

<div
style={{
color:"#94a3b8"
}}
>
or browse files
</div>

</div>



<input

type="file"

onChange={(e)=>

setFile(

e.target.files

? e.target.files[0]

: null

)

}

/>


<br/>
<br/>


{file && (

<div
style={{
color:"#38bdf8"
}}
>

Selected:

{file.name}

</div>

)}


<br/>


<button

onClick={handleUpload}

style={{

padding:"15px 35px",

borderRadius:"16px",

border:"none",

cursor:"pointer",

fontWeight:"bold",

background:
"linear-gradient(to right,#38bdf8,#06b6d4)",

color:"white",

boxShadow:
"0 0 20px rgba(56,189,248,0.4)"

}}

>

Upload to Shelby

</button>



{uploading && (

<div
style={{
marginTop:"25px"
}}
>

<div
style={{
height:"10px",
background:"#1e293b",
borderRadius:"10px"
}}
>

<div
style={{
height:"100%",
width:
`${uploadProgress}%`,
background:
"linear-gradient(to right,#38bdf8,#06b6d4)",
borderRadius:"10px"
}}
/>

</div>

<p>

{uploadProgress}%

</p>

</div>

)}



<div
style={{
marginTop:"30px",
display:"grid",
gap:"15px"
}}
>

<div
style={{
padding:"18px",
borderRadius:"14px",
background:
"rgba(255,255,255,0.03)"
}}
>
File Ownership Verification
</div>

<div
style={{
padding:"18px",
borderRadius:"14px",
background:
"rgba(255,255,255,0.03)"
}}
>
Decentralized Storage Ready
</div>

<div
style={{
padding:"18px",
borderRadius:"14px",
background:
"rgba(255,255,255,0.03)"
}}
>
Aptos Wallet Integration
</div>

</div>



<div
style={{
marginTop:"35px"
}}
>

<h3>

Upload History

</h3>


{history.map((item,index)=>(

<div

key={index}

style={{

padding:"12px",

marginTop:"10px",

borderRadius:"10px",

background:
"rgba(255,255,255,0.03)"

}}

>

{item}

</div>

))}

</div>

</div>



<div
style={{
marginTop:"70px",
textAlign:"center",
color:"#94a3b8"
}}
>

Shelby Storage • Aptos Network

<br/>

Decentralized File Infrastructure

</div>

</div>

);

}



export default function Page(){

return(

<AptosWalletAdapterProvider autoConnect={false}>

<WalletButton />

</AptosWalletAdapterProvider>

);

}
