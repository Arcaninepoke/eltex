import {AsyncPipe} from '@angular/common';
import {Component, computed, effect, input, OnInit, output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {map, Observable, startWith} from 'rxjs';

import {ArticleSubmitData} from '../../../types/article-submit-data.interface';
import {Article} from '../../../types/article.interface';
import {Category} from '../../../types/category.interface';

@Component({
  selector: 'app-article-form',
  imports: [ReactiveFormsModule, MatAutocompleteModule, AsyncPipe],
  templateUrl: './article-form.html',
  styleUrl: './article-form.scss',
})
export class ArticleForm implements OnInit {
  public editData = input<Article|null>(null);
  public categories = input<Category[]>([]);

  protected selectedFile: File|null = null;
  protected filteredCategories$!: Observable<Category[]>;

  public articleSubmit = output<ArticleSubmitData>();
  public cancel = output<void>();

  protected form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(25)]),
    category: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required])
  });

  protected formTitle =
      computed(() => this.editData() ? 'Изменить статью' : 'Создание статьи');
  protected saveButtonTitle =
      computed(() => this.editData() ? 'Сохранить' : 'Добавить');

  constructor() {
    effect(() => {
      const data = this.editData();
      const allCategories = this.categories();

      if (data) {
        let categoryNameToSet = '';
        const categoryId = data.categoryId || data.category?.id;

        if (categoryId && allCategories.length > 0) {
          const matchedCategory = allCategories.find(c => c.id === categoryId);
          if (matchedCategory) {
            categoryNameToSet = matchedCategory.name;
          }
        } else if (data.category?.name) {
          categoryNameToSet = data.category.name;
        }

        this.form.patchValue({
          title: data.title,
          content: data.content,
          category: categoryNameToSet
        });
      } else {
        this.form.reset();
      }
    });
  }

  ngOnInit() {
    this.filteredCategories$ = this.form.controls.category.valueChanges.pipe(
        startWith(''), map(value => this._filter(value || '')));
  }

  private _filter(value: string): Category[] {
    const filterValue = value.toLowerCase();
    return this.categories().filter(
        category => category.name.toLowerCase().includes(filterValue));
  }

  protected hasError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control?.invalid && control?.touched);
  }

  protected getControlError(controlName: string): string|null {
    const control = this.form.get(controlName);
    const errors = control?.errors;

    if (errors) {
      const firstErrorKey = Object.keys(errors)[0];
      return this.getErrorStr(firstErrorKey, errors[firstErrorKey]);
    }
    return null;
  }

  private getErrorStr(errorCode: string, errorData: any): string {
    switch (errorCode) {
      case 'required':
        return 'Поле обязательно для заполнения';
      case 'minlength':
        const needed = errorData.requiredLength - errorData.actualLength;
        return `Нужно еще ${needed} символов`;
      default:
        return 'Ошибка валидации';
    }
  }

  protected onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.selectedFile = file;
  }

  protected onSubmit() {
    if (this.form.invalid) return;

    const formData = new FormData();
    formData.append('title', this.form.value.title!);
    formData.append('content', this.form.value.content!);

    if (this.editData()?.id) {
      formData.append('id', String(this.editData()!.id));
    }

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.articleSubmit.emit(
        {formData: formData, categoryName: this.form.value.category!.trim()});
  }

  protected onCancel() {
    this.form.reset();
    this.cancel.emit();
  }
}