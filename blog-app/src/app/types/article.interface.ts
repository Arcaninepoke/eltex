import {Category} from './category.interface';

export interface Article {
  id: string;
  title: string;
  content: string;
  date: string;
  displayDate: string;
  image: string;
  alt: string;
  rating?: number;
  categoryId?: string;
  category?: Category;
  categoryName?: string;
}