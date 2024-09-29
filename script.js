let input=document.querySelector(".search-box input")
let btn=document.querySelector(".btn button")
let images=document.querySelector(".images")
let load=document.querySelector("#load")


const accessKey="MQZil6h02LUIGiiIa7ZQ6vvOCbgqsYXmlzjxUweTaXI";
let page=1;
let keyword=""
function download(imgurl){
    // console.log(imgurl) -- for checking wheather image url is being fetched or not 
    fetch(imgurl).then(res=>res.blob()).then(file=>{
        let a=document.createElement("a")
        a.href=URL.createObjectURL(file)
        a.download=new Date().getTime()
        a.click()

    }).catch(()=>
        alert("failed download")
    )
}


async function getResponse() {
   
    keyword=input.value
    let url=`https://api.unsplash.com/search/collections?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=12`
    // &per_page=12 means 12 images will be displayed on one page 
    let response=await fetch(url);
    let data=await response.json()
    let results=data.results;
    // console.log(results); to check wheather the data is fetched or not and accesing the stuff what we need!
    if(page==1){
        images.innerHTML=""
    }
     load.style.display="block"

    results.map((result)=>{
      let li=document.createElement("li")
      li.classList.add("image")
      let html=`<img src="${result.preview_photos[0].urls.small}" alt="img" class="photo">
        <div class="details">
            <div class="user">
                <img src="Assets/camera.svg" alt="img" loading="lazy">
                <span>${result.title}</span>
            </div>
            <div class="download" onclick=download('${result.preview_photos[0].urls.small}')>
                <img src="Assets/download.svg" alt="img" loading="lazy">
            </div>
        </div>`
        li.innerHTML=html
        images.appendChild(li)

    })

}
input.addEventListener("keyup",(e)=>{
    page=1
    if(e.key=="Enter"){
        getResponse()
    }
   
})
btn.addEventListener("click",()=>{
    page=1
    getResponse()
})
load.addEventListener("click",()=>{
    page++;
    getResponse()
})

