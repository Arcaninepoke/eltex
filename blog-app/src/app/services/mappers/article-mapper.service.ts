import {Injectable} from '@angular/core';

import {ArticleDto} from '../../types/article.dto';
import {Article} from '../../types/article.interface';

@Injectable({providedIn: 'root'})
export class ArticleMapperService {
  mapToDomain(dto: ArticleDto): Article {
    const dateObj = dto.createdAt ? new Date(dto.createdAt) : new Date();

    return {
      id: dto.id,
      title: dto.title,
      content: dto.content,
      rating: dto.rating,
      categoryId: dto.categoryId || dto.category?.id || undefined,
      image: dto.imgSrc ?? 'images/photos/placeholder.jpg',
      alt: dto.title,
      date: dateObj.toISOString(),
      displayDate: this.formatDate(dateObj)
    };
  }

  mapListToDomain(dtos: any[]): Article[] {
    return dtos.map(dto => this.mapToDomain(dto));
  }

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}.${month}.${date.getFullYear()}`;
  }
}