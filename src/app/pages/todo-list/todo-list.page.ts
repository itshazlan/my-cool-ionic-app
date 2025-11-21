import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, create, trash } from 'ionicons/icons';
import { TodoService } from '../../services/todo.service';
import { UiService } from '../../services/ui.service';
import { Todo } from '../../models/todo.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.page.html',
  styleUrls: ['./todo-list.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton
  ]
})
export class TodoListPage implements OnInit {
  private todoService = inject(TodoService);
  private uiService = inject(UiService);
  private router = inject(Router);

  todos$!: Observable<Todo[]>;

  constructor() {
    addIcons({ add, create, trash });
  }

  ngOnInit() {
    this.todos$ = this.todoService.getTodos();
  }

  async toggleCompleted(todo: Todo) {
    try {
      await this.todoService.toggleCompleted(todo.id!, !todo.completed);
      await this.uiService.showSuccessToast('Status berhasil diubah');
    } catch (error) {
      await this.uiService.showErrorToast('Gagal mengubah status');
    }
  }

  goToAddTodo() {
    this.router.navigate(['/todo-form']);
  }

  goToEditTodo(id: string) {
    this.router.navigate(['/todo-form', id]);
  }

  async deleteTodo(todo: Todo) {
    const confirmed = await this.uiService.showDestructiveAlert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus "${todo.title}"?`,
      'Hapus',
      'Batal',
      async () => {
        try {
          await this.todoService.deleteTodo(todo.id!);
          await this.uiService.showSuccessToast('Todo berhasil dihapus');
        } catch (error) {
          await this.uiService.showErrorToast('Gagal menghapus todo');
        }
      }
    );
  }
}
