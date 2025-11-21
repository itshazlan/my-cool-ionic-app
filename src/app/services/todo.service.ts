import { Injectable } from '@angular/core';
import { FastSQL } from '@capgo/capacitor-fast-sql';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo } from '../models/todo.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private db: any;
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  private initialized = false;

  constructor() {
    this.initDatabase();
  }

  private async initDatabase() {
    try {
      // Connect to database
      this.db = await FastSQL.connect({
        database: environment.database
      });

      // Create table if not exists
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          completed INTEGER DEFAULT 0,
          createdAt INTEGER DEFAULT (strftime('%s', 'now')),
          updatedAt INTEGER
        )
      `);

      this.initialized = true;
      await this.loadTodos();
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await this.initDatabase();
    }
  }

  private async loadTodos() {
    try {
      const result = await this.db.query('SELECT * FROM todos ORDER BY createdAt DESC');
      const todos: Todo[] = result.map((row: any) => ({
        id: row.id.toString(),
        title: row.title,
        description: row.description,
        completed: row.completed === 1,
        createdAt: new Date(row.createdAt * 1000),
        updatedAt: row.updatedAt ? new Date(row.updatedAt * 1000) : undefined
      }));
      this.todosSubject.next(todos);
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  }

  // Get all todos
  getTodos(): Observable<Todo[]> {
    return this.todosSubject.asObservable();
  }

  // Get single todo by id
  async getTodo(id: string): Promise<Todo | null> {
    await this.ensureInitialized();
    try {
      const result = await this.db.query('SELECT * FROM todos WHERE id = ?', [parseInt(id)]);
      if (result.length === 0) return null;
      
      const row = result[0];
      return {
        id: row.id.toString(),
        title: row.title,
        description: row.description,
        completed: row.completed === 1,
        createdAt: new Date(row.createdAt * 1000),
        updatedAt: row.updatedAt ? new Date(row.updatedAt * 1000) : undefined
      };
    } catch (error) {
      console.error('Error getting todo:', error);
      return null;
    }
  }

  // Create new todo
  async createTodo(todo: Omit<Todo, 'id'>): Promise<number> {
    await this.ensureInitialized();
    try {
      const result = await this.db.run(
        'INSERT INTO todos (title, description, completed) VALUES (?, ?, ?)',
        [todo.title, todo.description, 0]
      );
      await this.loadTodos();
      return result.insertId;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  }

  // Update todo
  async updateTodo(id: string, todo: Partial<Todo>): Promise<void> {
    await this.ensureInitialized();
    try {
      const updates: string[] = [];
      const params: any[] = [];

      if (todo.title !== undefined) {
        updates.push('title = ?');
        params.push(todo.title);
      }
      if (todo.description !== undefined) {
        updates.push('description = ?');
        params.push(todo.description);
      }
      if (todo.completed !== undefined) {
        updates.push('completed = ?');
        params.push(todo.completed ? 1 : 0);
      }
      
      updates.push('updatedAt = strftime(\'%s\', \'now\')');
      params.push(parseInt(id));

      await this.db.run(
        `UPDATE todos SET ${updates.join(', ')} WHERE id = ?`,
        params
      );
      await this.loadTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  }

  // Delete todo
  async deleteTodo(id: string): Promise<void> {
    await this.ensureInitialized();
    try {
      await this.db.run('DELETE FROM todos WHERE id = ?', [parseInt(id)]);
      await this.loadTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }

  // Toggle completed status
  async toggleCompleted(id: string, completed: boolean): Promise<void> {
    return this.updateTodo(id, { completed });
  }
}
