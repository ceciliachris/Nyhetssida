function updateArticle(updatedArticle) {
    const articles = getArticles();
    const index = articles.findIndex(a => a.id === updatedArticle.id);

    if (index !== -1) {
        articles[index] = updatedArticle;
        localStorage.setItem("articles", JSON.stringify(articles));
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const mainContentSection = document.querySelector("main");
    if (mainContentSection) {
        displayArticlesOnHomepage(mainContentSection);
    }

    const articleTitle = document.getElementById("articleTitle");
    const articleCategory = document.getElementById("articleCategory");
    const articleContent = document.getElementById("articleContent");

    if (articleTitle && articleCategory && articleContent) {
        loadArticleDetails();
    }

    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            const mobileMenu = document.getElementById('mobile-menu');
            mobileMenu.classList.toggle('hidden');
        });
    }

    const uploadButton = document.getElementById("uploadButton");
    const fileInput = document.getElementById("imageUpload");
    const fileNameDisplay = document.getElementById("fileNameDisplay");
    const imagePreview = document.getElementById("imagePreview");
    const previewImage = document.getElementById("previewImage");

    if (uploadButton && fileInput) {
        uploadButton.addEventListener("click", function () {
            fileInput.click();
        });

        fileInput.addEventListener("change", function () {
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];

                if (!file.type.match('image.*')) {
                    showToast("Endast bildfiler är tillåtna.");
                    fileInput.value = '';
                    fileNameDisplay.textContent = "Ingen fil vald";
                    imagePreview.classList.add("hidden");
                    return;
                }

                if (file.size > 5 * 1024 * 1024) {
                    showToast("Bilden är för stor. Max storlek är 5MB.");
                    fileInput.value = '';
                    fileNameDisplay.textContent = "Ingen fil vald";
                    imagePreview.classList.add("hidden");
                    return;
                }

                const fileName = file.name;
                fileNameDisplay.textContent = fileName;

                const reader = new FileReader();
                reader.onload = function (e) {
                    previewImage.src = e.target.result;
                    imagePreview.classList.remove("hidden");
                };
                reader.readAsDataURL(file);
            } else {
                fileNameDisplay.textContent = "Ingen fil vald";
                imagePreview.classList.add("hidden");
            }
        });
    }

    const form = document.getElementById("articleForm");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const title = document.getElementById("title").value.trim();
            const content = document.getElementById("content").value.trim();
            const category = document.getElementById("category").value.trim();
            const imageInput = document.getElementById("imageUpload");

            if (!title || !content || !category) {
                showToast("Fyll i alla obligatoriska fält.");
                return;
            }

            if (imageInput && imageInput.files.length > 0) {
                const file = imageInput.files[0];

                const reader = new FileReader();
                reader.onload = function (e) {
                    const imageData = e.target.result;

                    if (imageData.length > 1000000) {
                        const img = new Image();
                        img.onload = function () {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');

                            let width = img.width;
                            let height = img.height;
                            const maxSize = 1200;

                            if (width > height && width > maxSize) {
                                height *= maxSize / width;
                                width = maxSize;
                            } else if (height > maxSize) {
                                width *= maxSize / height;
                                height = maxSize;
                            }

                            canvas.width = width;
                            canvas.height = height;

                            ctx.drawImage(img, 0, 0, width, height);

                            const compressedImage = canvas.toDataURL('image/jpeg', 0.8);

                            saveArticleWithImage(title, content, category, compressedImage);
                        };
                        img.src = imageData;
                    } else {
                        saveArticleWithImage(title, content, category, imageData);
                    }
                };
                reader.readAsDataURL(file);
            } else {
                saveArticleWithImage(title, content, category, null);
            }
        });
    }
});