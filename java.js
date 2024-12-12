document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const uploadButton = document.getElementById("uploadButton");
    const gallery = document.getElementById("gallery");
    const searchInput = document.getElementById("searchInput");
    const deleteAllButton = document.getElementById("deleteAllButton");
    const categoryFilters = document.getElementById("categoryFilters");
    const progressContainer = document.getElementById("progressContainer");
    const progressBar = document.getElementById("progressBar");
    const themeToggle = document.getElementById("themeToggle");

    let mediaFiles = [];

    // Toggle Theme
    themeToggle.addEventListener("click", () => {
        const root = document.documentElement;
        if (root.style.getPropertyValue("--background-color") === "#1e1e2f") {
            root.style.removeProperty("--background-color");
            root.style.removeProperty("--text-color");
            root.style.removeProperty("--header-background");
            root.style.removeProperty("--header-text-color");
            root.style.removeProperty("--button-background");
            root.style.removeProperty("--button-hover");
        } else {
            root.style.setProperty("--background-color", "#1e1e2f");
            root.style.setProperty("--text-color", "#ffffff");
            root.style.setProperty("--header-background", "#29293d");
            root.style.setProperty("--header-text-color", "#ffffff");
            root.style.setProperty("--button-background", "#4CAF50");
            root.style.setProperty("--button-hover", "#3c8d40");
        }
    });

    // Upload Files
    uploadButton.addEventListener("click", () => {
        const files = fileInput.files;
        if (!files.length) {
            alert("Please select at least one file.");
            return;
        }

        progressContainer.style.display = "block";

        Array.from(files).forEach((file, index) => {
            setTimeout(() => {
                const fileURL = URL.createObjectURL(file);
                const mediaType = file.type.startsWith("image")
                    ? "image"
                    : file.type.startsWith("video")
                    ? "video"
                    : file.type.startsWith("audio")
                    ? "audio"
                    : "unknown";

                mediaFiles.push({
                    id: Date.now() + index,
                    name: file.name,
                    type: mediaType,
                    date: new Date().toLocaleString(),
                    url: fileURL,
                });

                progressBar.style.width = `${((index + 1) / files.length) * 100}%`;

                if (index === files.length - 1) {
                    setTimeout(() => {
                        progressContainer.style.display = "none";
                        progressBar.style.width = "0%";
                        renderGallery();
                    }, 500);
                }
            }, 500 * index);
        });

        fileInput.value = "";
    });

    function renderGallery(filter = "all", searchQuery = "") {
        gallery.innerHTML = "";

        const filteredFiles = mediaFiles
            .filter(file => (filter === "all" || file.type === filter))
            .filter(file => file.name.toLowerCase().includes(searchQuery.toLowerCase()));

        filteredFiles.forEach(file => {
            const mediaElement =
                file.type === "image"
                    ? `<img src="${file.url}" alt="${file.name}">`
                    : file.type === "video"
                    ? `<video controls><source src="${file.url}" type="video/mp4">Your browser does not support video playback.</video>`
                    : file.type === "audio"
                    ? `<audio controls><source src="${file.url}" type="audio/mpeg">Your browser does not support audio playback.</audio>`
                    : `<p>Unsupported file type</p>`;

            gallery.innerHTML += `
                <div class="media-item" data-id="${file.id}">
                    ${mediaElement}
                    <p><strong>Name:</strong> ${file.name}</p>
                    <p><strong>Type:</strong> ${file.type}</p>
                    <p><strong>Date:</strong> ${file.date}</p>
                    <div class="actions">
                        <button class="delete-btn" data-id="${file.id}"><i class="fas fa-trash"></i> Delete</button>
                        <button class="rename-btn" data-id="${file.id}"><i class="fas fa-edit"></i> Rename</button>
                    </div>
                </div>`;
        });

        attachEventListeners();
    }

    function attachEventListeners() {
        const deleteButtons = document.querySelectorAll(".delete-btn");
        const renameButtons = document.querySelectorAll(".rename-btn");

        deleteButtons.forEach(button => {
            button.addEventListener("click", e => {
                const id = e.target.closest("button").dataset.id;
                mediaFiles = mediaFiles.filter(file => file.id != id);
                renderGallery();
            });
        });

        renameButtons.forEach(button => {
            button.addEventListener("click", e => {
                const id = e.target.closest("button").dataset.id;
                const file = mediaFiles.find(file => file.id == id);
                const newName = prompt("Enter new name:", file.name);
                if (newName) {
                    file.name = newName;
                    renderGallery();
                }
            });
        });
    }

    searchInput.addEventListener("input", e => {
        renderGallery("all", e.target.value);
    });

    categoryFilters.addEventListener("click", e => {
        if (e.target.tagName === "BUTTON") {
            renderGallery(e.target.dataset.category);
        }
    });

    deleteAllButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete all files?")) {
            mediaFiles = [];
            renderGallery();
        }
    });
});
