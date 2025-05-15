function getArticles() {
    return JSON.parse(localStorage.getItem("articles")) || [];
}

function saveArticle(article) {
    const articles = getArticles();
    articles.push(article);
    localStorage.setItem("articles", JSON.stringify(articles));
}

function deleteArticle(id) {
    let articles = getArticles();
    articles = articles.filter(article => article.id !== id);
    localStorage.setItem("articles", JSON.stringify(articles));

    showToast("Artikeln har raderats!");

    const mainContentSection = document.querySelector("main");
    if (mainContentSection) {
        Array.from(mainContentSection.children).forEach(child => {
            if (child.tagName === 'ARTICLE') {
                child.remove();
            }
        });
        displayArticlesOnHomepage(mainContentSection);
    } else {
        window.location.href = "index.html";
    }
}

function displayArticlesOnHomepage(container) {
    const articles = getArticles();

    if (articles.length === 0) {
        const noArticles = document.createElement("div");
        noArticles.className = "bg-white bg-opacity-20 p-6 rounded-lg shadow-md mb-6 backdrop-filter backdrop-blur-sm";
        noArticles.innerHTML = `
        <p class="text-white text-center">Inga artiklar ännu. Var först med att skriva en artikel!</p>
      `;
        container.appendChild(noArticles);
        return;
    }

    articles.sort((a, b) => b.id - a.id);

    const existingArticles = container.querySelectorAll('.article-card');
    existingArticles.forEach(article => article.remove());

    articles.forEach(article => {
        const articleEl = document.createElement("article");
        articleEl.className = "bg-white bg-opacity-20 p-6 rounded-lg shadow-md mb-6 backdrop-filter backdrop-blur-sm article-card";

        const previewContent = article.content.length > 60
            ? article.content.substring(0, 60) + "..."
            : article.content;

        let articleHTML = `
        <h2 class="text-2xl font-bold mb-2 text-white">${article.title}</h2>
        <p class="text-sm text-gray-300 mb-2">${article.category} • ${article.date || 'Idag'}</p>
      `;

        if (article.image) {
            articleHTML += `
          <div class="mb-4">
            <img src="${article.image}" alt="${article.title}" class="rounded-lg w-full h-65 object-cover" loading="lazy" />
          </div>
        `;
        }

        articleHTML += `
        <p class="text-white mb-4">${previewContent}</p>
        <div class="flex justify-between items-center">
          <div>
            <a href="article.html?id=${article.id}" class="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition">Läs mer</a>
            <button onclick="deleteArticle(${article.id})" class="ml-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition">
              <i class="fas fa-trash-alt"></i> Ta bort
            </button>
          </div>
          <div class="flex space-x-3 text-gray-300">
            <span><i class="far fa-thumbs-up"></i> ${article.likes}</span>
            <span><i class="far fa-comment"></i> ${article.comments.length}</span>
          </div>
        </div>
      `;

        articleEl.innerHTML = articleHTML;
        container.appendChild(articleEl);
    });
}

function loadArticleDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = Number(urlParams.get('id'));

    if (!articleId) {
        document.getElementById("articleTitle").textContent = "Artikel hittades inte";
        document.getElementById("articleContent").textContent = "Den begärda artikeln kunde inte hittas. Gå tillbaka till startsidan.";
        return;
    }

    const articles = getArticles();
    const article = articles.find(a => a.id === articleId);

    if (!article) {
        document.getElementById("articleTitle").textContent = "Artikel hittades inte";
        document.getElementById("articleContent").textContent = "Den begärda artikeln kunde inte hittas. Gå tillbaka till startsidan.";
        return;
    }

    document.getElementById("articleTitle").textContent = article.title;
    document.getElementById("articleCategory").textContent = `${article.category} • ${article.date || 'Idag'}`;
    document.getElementById("articleContent").textContent = article.content;

    if (article.image) {
        const existingImgContainer = document.querySelector(".article-image-container");
        if (existingImgContainer) {
            existingImgContainer.remove();
        }

        const imgContainer = document.createElement("div");
        imgContainer.className = "article-image-container mb-6";
        imgContainer.innerHTML = `<img src="${article.image}" alt="${article.title}" class="w-full rounded-lg shadow-md" />`;

        const articleContent = document.getElementById("articleContent");
        articleContent.parentNode.insertBefore(imgContainer, articleContent);
    }

    const articleHeader = document.querySelector(".max-w-3xl");
    if (articleHeader) {
        const existingDeleteButton = articleHeader.querySelector(".fancy-button.bg-red-600");
        if (existingDeleteButton) {
            existingDeleteButton.remove();
        }

        const deleteButton = document.createElement("button");
        deleteButton.className = "fancy-button bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl ml-4";
        deleteButton.innerHTML = '<i class="fas fa-trash-alt mr-1"></i> Ta bort artikel';
        deleteButton.onclick = function () {
            if (confirm("Är du säker på att du vill radera denna artikel?")) {
                deleteArticle(article.id);
            }
        };

        const backLink = articleHeader.querySelector("a");
        if (backLink) {
            backLink.parentNode.insertBefore(deleteButton, backLink.nextSibling);
        }
    }

    const likeCount = document.getElementById("likeCount");
    const dislikeCount = document.getElementById("dislikeCount");

    if (likeCount && dislikeCount) {
        likeCount.textContent = article.likes;
        dislikeCount.textContent = article.dislikes;

        document.getElementById("likeBtn").addEventListener("click", function () {
            article.likes++;
            updateArticle(article);
            likeCount.textContent = article.likes;
            showToast("Tack för din röst!");
        });

        document.getElementById("dislikeBtn").addEventListener("click", function () {
            article.dislikes++;
            updateArticle(article);
            dislikeCount.textContent = article.dislikes;
            showToast("Tack för din röst!");
        });
    }

    const commentList = document.getElementById("commentList");
    if (commentList) {
        displayComments(article, commentList);

        const commentForm = document.getElementById("commentForm");
        if (commentForm) {
            commentForm.addEventListener("submit", function (e) {
                e.preventDefault();
                const commentInput = document.getElementById("commentInput");
                const commentText = commentInput.value.trim();

                if (!commentText) return;

                const newComment = {
                    id: Date.now(),
                    text: commentText,
                    date: new Date().toLocaleDateString('sv-SE')
                };

                article.comments.push(newComment);
                updateArticle(article);
                commentInput.value = "";

                appendComment(newComment, commentList);
                showToast("Kommentar tillagd!");
            });
        }
    }
}