import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TodoInterafce } from '../interface/todo-interface';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private http: HttpClient, private router: Router) {}

  private todos: TodoInterafce [] = [];

  getTodos() {
    return this.http.get('http://127.0.0.1:8000/api/task-list/');
  }

  createTodo(title: string, completed: boolean, editing: boolean) {
    const createtodoData = {
    title: title,
    completed: completed,
    editing: editing
    };
    // console.log(todoData);
    return this.http.post('http://127.0.0.1:8000/api/task-create/', createtodoData);
  }

  delTodo(id: number) {
    console.log('passed id ' + id);
    return this.http.delete('http://127.0.0.1:8000/api/task-delete/' + id);
  }

  updateTodo(id: number, title: string, editing: boolean) {
    const updatetodoData = {
      id: id,
      title: title,
      editing: editing
    };
    // console.log(todoData);
    return this.http.post('http://127.0.0.1:8000/api/task-update/' + id + '/', updatetodoData);
  }

  completedTodo(id: number, title: string, completed: boolean, editing: boolean) {
    const completedtodoData = {
      id: id,
      title: title,
      completed: completed,
      editing: editing
    };
    return this.http.post('http://127.0.0.1:8000/api/task-complete/' + id + '/', completedtodoData);
  }


}
