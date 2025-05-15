function saveArticleWithImage(title, content, category, imageData) {
    const newArticle = {
        id: Date.now(),
        title,
        content,
        category,
        date: new Date().toLocaleDateString('sv-SE'),
        likes: 0,
        dislikes: 0,
        comments: [],
        image: imageData
    };

    saveArticle(newArticle);
    document.getElementById("articleForm").reset();

    const imagePreview = document.getElementById("imagePreview");
    const fileNameDisplay = document.getElementById("fileNameDisplay");
    if (imagePreview) imagePreview.classList.add("hidden");
    if (fileNameDisplay) fileNameDisplay.textContent = "Ingen fil vald";

    showToast("Artikeln har sparats!");

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1500);
}

if (!document.getElementById("toast")) {
    const toastElement = document.createElement("div");
    toastElement.id = "toast";
    toastElement.className = "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg hidden transition-opacity duration-500";
    document.body.appendChild(toastElement);
}