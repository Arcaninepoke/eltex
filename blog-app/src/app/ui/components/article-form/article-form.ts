import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-article-form',
  imports: [ReactiveFormsModule],
  templateUrl: './article-form.html',
  styleUrl: './article-form.scss',
})
export class ArticleForm {
  @Input() editData: any = null;

  @Output() articleSubmit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(25)]),
    content: new FormControl('', [Validators.required])
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editData'] && this.editData) {
      this.form.patchValue(
          {title: this.editData.title, content: this.editData.content});
    } else if (changes['editData'] && !this.editData) {
      this.form.reset();
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.articleSubmit.emit({...this.form.value, id: this.editData?.id});

    this.form.reset();
  }

  onCancel() {
    this.form.reset();
    this.cancel.emit();
  }
}
