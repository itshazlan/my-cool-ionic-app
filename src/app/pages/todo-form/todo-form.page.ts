import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonTextarea,
  IonButtons,
  IonBackButton
} from '@ionic/angular/standalone';
import { TodoService } from '../../services/todo.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.page.html',
  styleUrls: ['./todo-form.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonInput,
    IonTextarea,
    IonButtons,
    IonBackButton
  ]
})
export class TodoFormPage implements OnInit {
  private fb = inject(FormBuilder);
  private todoService = inject(TodoService);
  private uiService = inject(UiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  todoForm!: FormGroup;
  todoId: string | null = null;
  isEditMode = false;

  ngOnInit() {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]]
    });

    this.todoId = this.route.snapshot.paramMap.get('id');
    if (this.todoId) {
      this.isEditMode = true;
      this.loadTodo(this.todoId);
    }
  }

  async loadTodo(id: string) {
    try {
      const todo = await this.todoService.getTodo(id);
      if (todo) {
        this.todoForm.patchValue({
          title: todo.title,
          description: todo.description
        });
      } else {
        await this.uiService.showErrorToast('Todo tidak ditemukan');
        this.router.navigate(['/']);
      }
    } catch (error) {
      console.error('Error loading todo:', error);
      await this.uiService.showErrorToast('Gagal memuat data todo');
      this.router.navigate(['/']);
    }
  }

  async onSubmit() {
    if (this.todoForm.valid) {
      try {
        const todoData = this.todoForm.value;

        if (this.isEditMode && this.todoId) {
          await this.todoService.updateTodo(this.todoId, todoData);
          await this.uiService.showSuccessToast('Todo berhasil diupdate');
        } else {
          await this.todoService.createTodo(todoData);
          await this.uiService.showSuccessToast('Todo berhasil ditambahkan');
        }

        this.router.navigate(['/']);
      } catch (error) {
        console.error('Error saving todo:', error);
        await this.uiService.showErrorToast('Gagal menyimpan todo');
      }
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
