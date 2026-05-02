import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-comment-form',
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule
  ],
  templateUrl: './comment-form.html',
  styleUrl: './comment-form.scss',
})
export class CommentForm {
  @Output()
  public commentSubmit = new EventEmitter<{author: string; text: string}>();

  protected form = new FormGroup({
    author: new FormControl('', [Validators.required, Validators.minLength(2)]),
    text: new FormControl('', [Validators.required, Validators.minLength(5)])
  });

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
    this.commentSubmit.emit(this.form.value as {
      author: string;
      text: string
    });
    this.form.reset();
  }
}
