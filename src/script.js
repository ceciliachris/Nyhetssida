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
  
  function showToast(message) {
    const toast = document.getElementById("toast");
    if (toast) {
      toast.textContent = message;
      toast.classList.remove("hidden");
      setTimeout(() => toast.classList.add("hidden"), 3000);
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
            <img src="${article.image}" alt="${article.title}" class="rounded-lg w-full h-48 object-cover" loading="lazy" />
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
      deleteButton.onclick = function() {
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
      
      document.getElementById("likeBtn").addEventListener("click", function() {
        article.likes++;
        updateArticle(article);
        likeCount.textContent = article.likes;
        showToast("Tack för din röst!");
      });
      
      document.getElementById("dislikeBtn").addEventListener("click", function() {
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
        commentForm.addEventListener("submit", function(e) {
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
  
  function displayComments(article, commentList) {
    commentList.innerHTML = "";
    
    if (article.comments.length === 0) {
      commentList.innerHTML = `<p class="text-gray-300 italic">Inga kommentarer ännu. Var först med att kommentera!</p>`;
      return;
    }
    
    article.comments.forEach(comment => {
      appendComment(comment, commentList);
    });
  }
  
  function appendComment(comment, container) {
    const commentEl = document.createElement("li");
    commentEl.className = "bg-white bg-opacity-10 p-3 rounded-lg";
    commentEl.innerHTML = `
      <p class="text-white">${comment.text}</p>
      <p class="text-xs text-gray-300 mt-1">${comment.date || 'Idag'}</p>
    `;
    container.appendChild(commentEl);
  }
  
  function updateArticle(updatedArticle) {
    const articles = getArticles();
    const index = articles.findIndex(a => a.id === updatedArticle.id);
    
    if (index !== -1) {
      articles[index] = updatedArticle;
      localStorage.setItem("articles", JSON.stringify(articles));
    }
  }
 
  document.addEventListener("DOMContentLoaded", function() {
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
      menuToggle.addEventListener('click', function() {
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
      uploadButton.addEventListener("click", function() {
        fileInput.click();
      });
      
      fileInput.addEventListener("change", function() {
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
          reader.onload = function(e) {
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
          reader.onload = function(e) {
            const imageData = e.target.result;
            
            if (imageData.length > 1000000) {
              const img = new Image();
              img.onload = function() {
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