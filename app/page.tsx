"use client";

import { useEffect, useState } from "react";

export default function Home(){

const[
walletConnected,
setWalletConnected
]=useState(false);

const[
walletAddress,
setWalletAddress
]=useState("");

const[
selectedFile,
setSelectedFile
]=useState<File|null>(
null
);

const[
preview,
setPreview
]=useState("");

const[
progress,
setProgress
]=useState(0);

const[
uploadedFiles,
setUploadedFiles
]=useState<any[]>([]);

const[
search,
setSearch
]=useState("");



useEffect(()=>{

const saved=
localStorage.getItem(
"shelby_uploads"
);

if(saved){

setUploadedFiles(
JSON.parse(saved)
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

},[
uploadedFiles
]);



const connectWallet=
async()=>{

try{

if(
(window as any)
.aptos
){

const res=

await(
window as any
)

.aptos

.connect();

setWalletConnected(
true
);

setWalletAddress(
res.address
);

}else{

alert(
"Petra wallet not installed"
);

}

}catch(err){

console.log(err);

}

};



const disconnectWallet=
()=>{

setWalletConnected(
false
);

setWalletAddress(
""
);

};



const handleFile=
(e:any)=>{

const file=
e.target.files[0];

if(!file)return;

setSelectedFile(
file
);

setPreview(

URL.createObjectURL(
file
)

);

};



const handleUpload=
()=>{

if(
!selectedFile
)return;

let val=0;

setProgress(0);

const interval=

setInterval(()=>{

val+=10;

setProgress(val);

if(val>=100){

clearInterval(
interval
);

setUploadedFiles(

prev=>[

{

name:
selectedFile.name,

size:
(
selectedFile.size
/1024
).toFixed(2),

time:
new Date()
.toLocaleTimeString()

},

...prev

]

);

}

},200);

};



const filtered=

uploadedFiles.filter(
x=>

x.name

.toLowerCase()

.includes(

search

.toLowerCase()

)

);



return(

<main className="
min-h-screen
bg-slate-950
text-white
p-6
">

<div className="
flex
justify-between
items-center
mb-10
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

walletConnected?

(

<div className="
flex
gap-3
">

<button

onClick={()=>{

navigator
.clipboard
.writeText(
walletAddress
)

}}

className="
bg-cyan-600
px-4
py-2
rounded
"

>

Copy Wallet

</button>

<button

onClick=
{
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

)

:

(

<button

onClick=
{
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

)

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

<h2>

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

walletConnected?

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

Wallet

{

walletConnected?

" Connected"

:

" Not Connected"

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

<div className="
border-2
border-dashed
border-cyan-500
h-56
rounded-3xl
flex
justify-center
items-center
mt-8
">

Drag Files

</div>

<input

type="file"

onChange=
{handleFile}

className="
mt-5
"

/>

{

preview&&(

<img

src={preview}

className="
w-32
h-32
mt-4
rounded
"

/>

)

}



<button

onClick=
{
handleUpload
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

>

</div>

</div>

</div>



<div className="
grid
md:grid-cols-2
gap-6
mt-10
">

<div className="
bg-slate-900
p-5
rounded
">

<h2>

Upload History

</h2>

<input

placeholder=
"search"

value=
{search}

onChange=
{

e=>

setSearch(
e.target.value
)

}

className="
w-full
p-3
bg-slate-800
rounded
mt-4
"

/>

{

filtered.map(
(file,i)=>(

<div

key={i}

className="
bg-slate-800
p-4
rounded
mt-3
"

>

{file.name}

</div>

)

)

}

</div>



<div className="
bg-slate-900
p-5
rounded
">

Recent Activity

</div>

</div>

</main>

);

}
