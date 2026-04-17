import {Component} from '@angular/core';

import {AdminPanel} from '../../ui/components/admin-panel/admin-panel';
import {ArticleForm} from '../../ui/components/article-form/article-form';
import {BlogPostCard} from '../../ui/components/blog-post-card/blog-post-card';

@Component({
  selector: 'app-blog-page',
  imports: [BlogPostCard, AdminPanel, ArticleForm],
  templateUrl: './blog-page.html',
  styleUrl: './blog-page.scss',
})
export class BlogPage {
  selectedArticle: any = null;
  isFormVisible = false;

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
    if (this.isFormVisible) {
      setTimeout(() => {
        const element = document.getElementById('add-article-form-section');
        element?.scrollIntoView({behavior: 'smooth'});
      }, 100);
    }
  }

  onArticleSubmit(formData: any) {
    if (this.selectedArticle) {
      const index =
          this.articles.findIndex(a => a.id === this.selectedArticle.id);

      if (index !== -1) {
        this.articles[index] = {
          ...this.articles[index],
          title: formData.title,
          content: formData.content
        };
      }

    } else {
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
        id: Date.now(),
        title: formData.title,
        content: formData.content,
        image: 'images/photos/placeholder.jpg',
        alt: 'Новая статья',
        date: datetimeStr,
        displayDate: displayDateStr
      };

      this.articles.unshift(newArticle);
    }
    this.isFormVisible = false;
    this.selectedArticle = null;
  }

  onArticleDelete(articleId: number) {
    this.articles = this.articles.filter(article => article.id !== articleId);
    if (this.selectedArticle && this.selectedArticle.id === articleId) {
      this.isFormVisible = false;
      this.selectedArticle = null;
    }
  }

  onArticleEdit(article: any) {
    this.selectedArticle = article;
    this.isFormVisible = true;
    setTimeout(() => {
      document.getElementById('add-article-form-section')?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 100);
  }

  articles = [
    {
      id: 1,
      title: 'Как тренировать своего покемона и не сойти с ума',
      content: 'Блах-блах-блах',
      date: '2025-04-04',
      displayDate: '4 Апреля 2025',
      image: 'images/photos/donotthecat.jpg',
      alt: 'Do not the cat'
    },
    {
      id: 2,
      title: 'Как писать статьи и не сойти с ума',
      content: 'Блах-блах-блах 2',
      date: '2025-04-05',
      displayDate: '5 Апреля 2025',
      image: 'images/photos/poke.jpg',
      alt: 'Do not the cat'
    },
    {
      id: 3,
      title: 'Как делать гитхаб пейджес и не сойти с ума',
      content: 'Блах-блах-блах 3',
      date: '2025-04-06',
      displayDate: '6 Апреля 2025',
      image: 'images/photos/zelda.jpg',
      alt: 'Do not the cat'
    },
    {
      id: 4,
      title: 'Как делать компоненты и не сойти с ума',
      content: 'Блах-блах-блах 4',
      date: '2025-04-07',
      displayDate: '7 Апреля 2025',
      image: 'images/photos/pmd.jpg',
      alt: 'Do not the cat'
    }
  ]
}
