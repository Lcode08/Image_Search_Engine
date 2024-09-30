let input = document.querySelector(".search-box input");
let btn = document.querySelector(".btn button");
let images = document.querySelector(".images");
let load = document.querySelector("#load");
let Spinner = document.querySelector(".spinner");
const errorContainer = document.querySelector(".error-container");

const accessKey = "MQZil6h02LUIGiiIa7ZQ6vvOCbgqsYXmlzjxUweTaXI";
let page = 1;
let keyword = "";

// download Logic 
function download(imgurl) {
    fetch(imgurl)
        .then((res) => res.blob())
        .then((file) => {
            let a = document.createElement("a");
            a.href = URL.createObjectURL(file);
            a.download = new Date().getTime();
            a.click();
        })
        .catch(() => alert("Failed to download"));
}

async function getResponse() {
    keyword = input.value;
    let url = `https://api.unsplash.com/search/collections?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=12`;

    // Show spinner before fetching the data
    Spinner.style.display = "block";
    load.style.display = "none"; // Hide "View More" button when starting a search
    errorContainer.style.display = "none";
    

    try {
        let response = await fetch(url);
        let data = await response.json();
        let results = data.results;

        if (page == 1) {
            images.innerHTML = ""; // Clear images on a new search
        }

        // Added a minimum delay for spinner visibility 
        setTimeout(() => {
            results.map((result) => {
                let li = document.createElement("li");
                li.classList.add("image");

                let html = `
                <img src="${result.preview_photos[0].urls.small}" alt="img" class="photo">
                <div class="details">
                    <div class="user">
                        <img src="Assets/camera.svg" alt="img" loading="lazy">
                        <span>${result.title}</span>
                    </div>
                    <div class="button download" data-tooltip="Size: 20Mb" onclick="download('${result.preview_photos[0].urls.small}')">
                        <div class="button-wrapper">
                            <div class="text">Download</div>
                            <span class="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="2em" height="2em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"></path>
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>`;
                li.innerHTML = html;
                images.appendChild(li);
            });

            // Hide spinner after images are loaded
            Spinner.style.display = "none";

            // Show "View More" button only after images are loaded
            if (results.length > 0) {
                load.style.display = "inline-flex";
            }
        }, 500); // 500ms is the spinner display time
    } catch (error) {
        console.error("Error fetching images:", error);
        Spinner.style.display = "none"; // Ensure spinner is hidden even on error
        alert(" Please check your internet connection !");
        images.style.display = "none";
        errorContainer.style.display = "flex"
    }
}

input.addEventListener("keyup", (e) => {
    page = 1;
    if (e.key == "Enter") {
        getResponse();
    }
});

btn.addEventListener("click", () => {
    page = 1;
    getResponse();
});

load.addEventListener("click", () => {
    load.style.display = "inline-flex"; // Keep showing "View More" button after clicking it
    page++;
    getResponse();
});
