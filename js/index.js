document.addEventListener('DOMContentLoaded', () => {
  const btnAddArticle = document.getElementById('btn-add-article');
  const addArticleSection = document.getElementById('add-article-section');
  const addArticleForm = document.getElementById('add-article-form');
  const btnCancel = document.getElementById('btn-cancel');
  const btnShowStats = document.getElementById('btn-show-stats');
  const statsOverlay = document.getElementById('stats-modal-overlay');
  const btnCloseStats = document.getElementById('btn-close-stats');
  const postsGrid = document.querySelector('.posts-grid');
  const titleInput = document.getElementById('article-title');
  const logoImg = document.querySelector('.logo img');
  const emptyMsg = document.getElementById('empty-state-msg');
  const loader = document.getElementById('articles-loader');

  /* Небольшая пасхалка, покликайте по собаке в левом верхнем углу (да, я помню
   * как работать с апишками, эта моя любимая) */
  if (logoImg) {
    logoImg.addEventListener('click', async (event) => {
      event.preventDefault();
      logoImg.style.opacity = '0.5';

      try {
        const randomId = Math.floor(Math.random() * 1025) + 1;

        const response =
            await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);

        if (!response.ok) {
          throw new Error('cannot connect to pokeapi lol');
        }
        const data = await response.json();
        const spriteUrl = data.sprites.front_default;
        if (spriteUrl) {
          logoImg.src = spriteUrl;
          logoImg.alt = data.name;
        }
      } catch (error) {
        console.error('Cant catch this pokemon because:', error);
      } finally {
        logoImg.style.opacity = '1';
      }
    });
  }

  if (postsGrid) {
    /* Достаем статьи из памяти (или создаем пустой массив) */
    let articles = JSON.parse(localStorage.getItem('my_blog_articles')) || [];

    /* Функция отрисовки статей на странице */
    function renderArticles() {
      postsGrid.innerHTML = '';

      if (articles.length === 0) {
        if (emptyMsg) emptyMsg.classList.add('is-visible');
      } else {
        if (emptyMsg) emptyMsg.classList.remove('is-visible');

        articles.forEach(article => {
          const articleHTML = `
            <article class="grid-post" data-id="${article.id}">
              <button class="btn-delete-post" aria-label="Удалить статью">
                <img src="images/icons/close.svg" alt="Удалить">
              </button>
              <img src="../images/photos/placeholder.jpg" alt="Заглушка" style="background-color: var(--bg-placeholder);">
              <h3 class="grid-post-title">${article.title}</h3>
              <p class="post-date">Опубликовано: <time datetime="${
              article.datetimeStr}">${article.displayDate}</time></p>
            </article>
          `;
          postsGrid.insertAdjacentHTML('beforeend', articleHTML);
        });
      }
      updateStatistics();
    }

    /* Сохранение новой статьи с имитацией задержки и блокировкой */
    addArticleForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const newTitle = titleInput.value.trim();
      if (!newTitle) return;
      const submitBtn = addArticleForm.querySelector('button[type="submit"]');
      const allInputs = addArticleForm.querySelectorAll('input, textarea');

      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Сохранение...';

      btnCancel.disabled = true;
      submitBtn.disabled = true;
      allInputs.forEach(input => input.disabled = true);

      setTimeout(() => {
        const now = new Date();
        const year = now.getFullYear();
        const monthNum = String(now.getMonth() + 1).padStart(2, '0');
        const dayNum = String(now.getDate()).padStart(2, '0');
        const datetimeStr = `${year}-${monthNum}-${dayNum}`;
        const months = [
          'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля',
          'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];
        const displayDateStr =
            `${now.getDate()} ${months[now.getMonth()]} ${year}`;

        const newArticle = {
          id: Date.now().toString(),
          title: newTitle,
          datetimeStr: datetimeStr,
          displayDate: displayDateStr
        };

        articles.unshift(newArticle);
        localStorage.setItem('my_blog_articles', JSON.stringify(articles));

        renderArticles();

        submitBtn.textContent = originalBtnText;
        btnCancel.disabled = false;
        submitBtn.disabled = false;
        allInputs.forEach(input => input.disabled = false);
        addArticleForm.reset();
        addArticleSection.classList.add('is-hidden');
      }, 1500);
    });

    /* Удаление статьи */
    postsGrid.addEventListener('click', (event) => {
      const deleteBtn = event.target.closest('.btn-delete-post');
      if (deleteBtn) {
        const postCard = deleteBtn.closest('.grid-post');
        if (postCard) {
          const articleId = postCard.getAttribute('data-id');
          articles = articles.filter(article => article.id !== articleId);
          localStorage.setItem('my_blog_articles', JSON.stringify(articles));
          renderArticles();
        }
      }
    });

    /* Имитируем загрузку статей */
    function loadArticlesWithDelay() {
      if (loader) loader.classList.remove('is-hidden');
      postsGrid.classList.add('is-hidden');
      if (emptyMsg) emptyMsg.classList.remove('is-visible');
      setTimeout(() => {
        if (loader) loader.classList.add('is-hidden');
        postsGrid.classList.remove('is-hidden');
        renderArticles();
      }, 2500);
    }
    loadArticlesWithDelay();
  }

  /* Открываем и закрываем окошко статистики */
  if (btnShowStats && statsOverlay && btnCloseStats) {
    btnShowStats.addEventListener('click', (event) => {
      event.preventDefault();
      statsOverlay.classList.remove('is-hidden');
    });
    btnCloseStats.addEventListener('click', () => {
      statsOverlay.classList.add('is-hidden');
    });

    statsOverlay.addEventListener('click', (event) => {
      if (event.target === statsOverlay) {
        statsOverlay.classList.add('is-hidden');
      }
    });
  }

  /* Открываем и закрываем форму статьи так же при открывании скроллим до нее */
  if (btnAddArticle && addArticleSection && addArticleForm && btnCancel) {
    addArticleSection.classList.add('is-hidden'); /* 4 пункт */
    btnAddArticle.addEventListener('click', (event) => {
      event.preventDefault();
      addArticleSection.classList.toggle('is-hidden');

      if (!addArticleSection.classList.contains('is-hidden')) {
        setTimeout(() => {
          addArticleSection.scrollIntoView({behavior: 'smooth', block: 'end'});
        }, 100);
      }
    });

    btnCancel.addEventListener('click', () => {
      addArticleSection.classList.add('is-hidden');
      addArticleForm.reset();
    });
  }

  /* Функция для обновления статистики (теперь просто читает из localStorage) */
  function updateStatistics() {
    const totalArticlesElement =
        document.getElementById('total-articles-count');
    if (totalArticlesElement) {
      /* Так как featured-post мы (пока что) убрали, просто считаем длину
       * массива из памяти */
      const savedArticles =
          JSON.parse(localStorage.getItem('my_blog_articles')) || [];
      totalArticlesElement.textContent = savedArticles.length;
    }
  }
});