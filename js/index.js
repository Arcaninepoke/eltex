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
  /* Добавление новой статьи в сетку статей, кидаем ее в начало, генерим html
   * элемент */
  if (postsGrid) {
    addArticleForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const newTitle = titleInput.value.trim();
      if (!newTitle) return;
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
      const newArticleHTML = `
          <article class="grid-post">
            <img src="../images/photos/placeholder.jpg" alt="Заглушка" style="background-color: var(--bg-placeholder);">
            <h3 class="grid-post-title">${newTitle}</h3>
            <p class="post-date">Опубликовано: <time datetime="${
          datetimeStr}">${displayDateStr}</time></p>
          </article>
        `;

      postsGrid.insertAdjacentHTML('afterbegin', newArticleHTML);
      updateStatistics();
      addArticleForm.reset();
      addArticleSection.classList.add('is-hidden');
    });
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
  /* Функция для обновления статистики (закрепленный большой пост тоже считаем)
   */
  function updateStatistics() {
    const totalArticlesElement =
        document.getElementById('total-articles-count');

    if (totalArticlesElement) {
      const featuredPostsCount =
          document.querySelectorAll('.featured-post').length;
      const gridPostsCount = document.querySelectorAll('.grid-post').length;
      totalArticlesElement.textContent = featuredPostsCount + gridPostsCount;
    }
  }
  updateStatistics();
});
