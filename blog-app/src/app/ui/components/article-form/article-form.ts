import {Component, computed, effect, EventEmitter, input, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {Article} from '../../../types/article.interface';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './article-form.html',
  styleUrl: './article-form.scss',
})
export class ArticleForm {
  public editData = input<Article|null>(null);

  @Output() public articleSubmit = new EventEmitter<any>();
  @Output() public cancel = new EventEmitter<void>();

  protected form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(25)]),
    content: new FormControl('', [Validators.required])
  });

  protected formTitle =
      computed(() => this.editData() ? 'Изменить статью' : 'Создание статьи');

  protected saveButtonTitle =
      computed(() => this.editData() ? 'Сохранить' : 'Добавить');

  constructor() {
    effect(() => {
      const data = this.editData();
      if (data) {
        this.form.patchValue({title: data.title, content: data.content});
      } else {
        this.form.reset();
      }
    });
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

  protected onSubmit() {
    if (this.form.invalid) return;
    this.articleSubmit.emit({...this.form.value, id: this.editData()?.id});

    this.form.reset();
  }

  protected onCancel() {
    this.form.reset();
    this.cancel.emit();
  }
}