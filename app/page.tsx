"use client";

import { useEffect, useState } from "react";

export default function Home() {

const [wallet] =
useState(
"0xb59a...0ea9"
);

const [
selectedFile,
setSelectedFile
] =
useState<File|null>(
null
);

const [
preview,
setPreview
] =
useState("");

const [
progress,
setProgress
] =
useState(0);

const [
uploadedFiles,
setUploadedFiles
] =
useState<any[]>([]);

const [
search,
setSearch
] =
useState("");



useEffect(()=>{

const saved =
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



const handleFile=
(
e:any
)=>{

const file =
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

setProgress(0);

let value=0;

const interval=

setInterval(()=>{

value+=10;

setProgress(
value
);

if(
value>=100
){

clearInterval(
interval
);

const newFile={

name:
selectedFile.name,

size:
(
selectedFile.size
/1024
).toFixed(2),

time:
new Date()
.toLocaleTimeString(),

status:
"Uploaded"

};

setUploadedFiles(
prev=>[
newFile,
...prev
]
);

}

},200);

};



const filtered=

uploadedFiles.filter(

file=>

file.name

.toLowerCase()

.includes(

search

.toLowerCase()

)

);



return(

<main className="min-h-screen bg-slate-950 text-white p-8">

<div className="flex justify-between mb-10">

<div>

<h1 className="text-6xl font-bold text-cyan-400">

Shelby

</h1>

<p>

Storage Dashboard

</p>

</div>

<div className="flex gap-3">

<button

onClick={()=>{

navigator
.clipboard
.writeText(
wallet
)

}}

className="
bg-cyan-600
px-5
py-2
rounded-xl
"

>

Copy Wallet

</button>

<button

className="
bg-red-600
px-5
py-2
rounded-xl
"

>

Disconnect

</button>

</div>

</div>



<div className="
grid
md:grid-cols-4
gap-5
mb-8
">

<div className="
bg-slate-900
p-5
rounded-2xl
">

Files Uploaded

<h2 className="
text-3xl
font-bold
">

{
uploadedFiles.length
}

</h2>

</div>



<div className="
bg-slate-900
p-5
rounded-2xl
">

Storage Active

</div>



<div className="
bg-slate-900
p-5
rounded-2xl
">

Network Connected

</div>



<div className="
bg-slate-900
p-5
rounded-2xl
">

Wallet Connected

</div>

</div>



<div className="
bg-slate-900
rounded-3xl
p-10
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
mb-8
">

Powered by Aptos

</p>



<div className="
border-2
border-dashed
border-cyan-500
h-56
rounded-3xl
flex
items-center
justify-center
mb-6
">

Drag Files

</div>



<input

type="file"

onChange=
{handleFile}

/>



{

preview && (

<img

src={preview}

className="
w-40
h-40
mt-5
rounded-xl
object-cover
"

/>

)

}



<div className="
mt-5
">

<button

onClick=
{handleUpload}

className="
bg-cyan-500
px-6
py-3
rounded-xl
"

>

Upload To Shelby

</button>

</div>



<div className="
mt-5
">

<div className="
w-full
h-4
bg-slate-700
rounded
">

<div

style={{
width:
`${progress}%`
}}

className="
bg-cyan-400
h-4
rounded
"

>

</div>

</div>

<p>

Upload:

{progress}%

</p>

</div>

</div>



<div className="
grid
md:grid-cols-2
gap-8
mt-10
">

<div className="
bg-slate-900
p-6
rounded-2xl
">

<h2>

Upload History

</h2>

<input

value=
{search}

onChange=
{

e=>

setSearch(

e.target.value

)

}

placeholder=
"search"

className="
w-full
p-3
bg-slate-800
rounded
mt-4
mb-4
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
rounded-xl
mb-3
"

>

<p>

{file.name}

</p>

<p>

{file.size}
KB

</p>

<p>

{file.time}

</p>

<p className="
text-green-400
">

{file.status}

</p>

</div>

)

)

}



<button

onClick={()=>

{

setUploadedFiles(
[]
);

localStorage.removeItem(

"shelby_uploads"

);

}

}

className="
bg-red-500
px-5
py-2
rounded
"

>

Clear History

</button>

</div>



<div className="
bg-slate-900
p-6
rounded-2xl
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
p-4
rounded
">

Wallet Connected

</div>

<div className="
bg-slate-800
p-4
rounded
">

Storage Active

</div>

<div className="
bg-slate-800
p-4
rounded
">

File Verified

</div>

</div>

</div>

</div>



<footer className="
text-center
mt-10
text-slate-400
">

Shelby Storage Protocol Built With Aptos

</footer>

</main>

);

}
