export interface ArticleDto {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  category?: any;
  rating: number;
  imgSrc: string;
  createdAt?: string;
}