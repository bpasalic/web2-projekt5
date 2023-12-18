import { set } from "https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm";
document.addEventListener("DOMContentLoaded", function () {
  const shoppingListForm = document.getElementById("shoppingListForm");
  const itemsList = document.getElementById("itemsList");
  const itemNameInput = document.getElementById("itemName");
  const addItemButton = document.getElementById("addItem");
  const createdList = document.getElementById("createdList");
  const displayedTitle = document.getElementById("displayedTitle");
  const displayedItems = document.getElementById("displayedItems");
  const openCameraButton = document.getElementById("openCamera");

  let shoppingListItems = [];

  addItemButton.addEventListener("click", function () {
    const itemName = itemNameInput.value.trim();
    if (itemName !== "") {
      const listItem = document.createElement("li");
      listItem.textContent = itemName;
      itemsList.appendChild(listItem);
      itemNameInput.value = "";
      shoppingListItems.push({ text: itemName });
    }
  });

  shoppingListForm.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log(shoppingListItems)
    const listTitle = document.getElementById("listTitle").value;

    // Save the entire shoppingListItems array instead of just text content
    saveShoppingList({ title: listTitle, items: shoppingListItems });

    window.location.replace("index.html");
  });

  function saveShoppingList(list) {
    console.log(list)
    set(list.title, list.items)
      .then(() => console.log('List saved!'))
      .catch(err => console.error('Failed to save list', err));
  }

  let cameraStream = null;

  openCameraButton.addEventListener("click", () => {
    openCamera();
  });

  const captureButton = document.getElementById("captureImage");
  captureButton.addEventListener("click", captureImage);

  function openCamera() {
    const constraints = { video: true };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        cameraStream = stream;
        const videoElement = document.getElementById("cameraStream");
        if (!videoElement) {
          console.error("Video element not found");
          return;
        }
        videoElement.srcObject = stream;
        videoElement.onloadedmetadata = () => {
          videoElement.play();
          captureButton.hidden = false;
        };
        videoElement.hidden = false;
      })
      .catch((error) => {
        console.error("Error accessing the camera: ", error);
        // Show the image upload input if camera access is denied
        document.getElementById("imageUpload").style.display = "block";
      });
  }

  function captureImage() {
    const videoElement = document.getElementById("cameraStream");
    if (!videoElement) {
      console.error("Video element not found for capture");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    canvas.getContext("2d").drawImage(videoElement, 0, 0);
    const capturedImage = document.getElementById("capturedImage");
    if (!capturedImage) {
      console.error("Captured image element not found");
      return;
    }
    //capturedImage.src = canvas.toDataURL("image/png");
    capturedImage.hidden = false;

    if (cameraStream) {
      const tracks = cameraStream.getTracks();
      tracks.forEach((track) => track.stop());
    }

    videoElement.hidden = true;
    captureButton.hidden = true;

    const imageData = canvas.toDataURL("image/png");
    shoppingListItems.push({ image: imageData });


    const listItem = document.createElement('li');
    const imageElement = document.createElement('img');
    imageElement.src = imageData;
    imageElement.width = 200;
    imageElement.height = 200;
    listItem.appendChild(imageElement);
    itemsList.appendChild(listItem);

  }
});
const imageUploadInput = document.getElementById("imageUpload");
imageUploadInput.addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageData = e.target.result;
      shoppingListItems.push({ image: imageData });

      const listItem = document.createElement('li');
      const imageElement = new Image();
      imageElement.src = imageData;
      imageElement.width = 200;
      imageElement.height = 200;
      listItem.appendChild(imageElement);
      itemsList.appendChild(listItem);
    };
    reader.readAsDataURL(file);
  }
});