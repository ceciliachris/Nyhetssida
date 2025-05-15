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