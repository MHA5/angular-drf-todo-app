import { Component, OnInit } from '@angular/core';
import { TodoInterafce } from '../../interface/todo-interface';
import { TodoService } from '../../services/todo-service.service';

@Component({
  selector: 'app-taskslist',
  templateUrl: './taskslist.component.html',
  styleUrls: ['./taskslist.component.scss']
})


export class TaskslistComponent implements OnInit {

  constructor(public todoService: TodoService) {}

  todos: TodoInterafce[];
  todoTitle: string;
  beforeEditCache: string;

  ngOnInit() {
    this.beforeEditCache = '';
    this.todoTitle = '';
    this.todos = [];

    this.todoService.getTodos().subscribe((response: any) => {
      this.todos = response;
    });

  }

  addTodo(): void {
    if (this.todoTitle.trim().length === 0) {
      return;
    }
    this.todoService.createTodo(this.todoTitle, false, false)
      .subscribe(() => {

        // needs to be unsub so do outer one
        this.todoService.getTodos().subscribe((resp: any) => {
          this.todos = resp;
        });
      });

    this.todoTitle = '';
  }

  editTodo(todo: TodoInterafce): void {
    this.beforeEditCache = todo.title;
    todo.editing = true;
  }

  todoCompleted(todo: TodoInterafce): void {
    if (todo.title.trim().length === 0) {
      todo.title = this.beforeEditCache;
    }
    todo.editing = false;
    this.todoService.completedTodo(todo.id, todo.title, todo.completed, todo.editing)
      .subscribe(() => {
        this.todoService.getTodos().subscribe((resp: any) => {
          this.todos = resp;
          todo.editing = false;
        });
      });
  }

  cancelEdit(todo: TodoInterafce): void {
    todo.title = this.beforeEditCache;
    todo.editing = false;
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.todoService.delTodo(id).subscribe((res) => {
      console.log(res);
      this.todoService.getTodos().subscribe((resp: any) => {
        this.todos = resp;
      });
    });
  }

  updateTodo(todo: TodoInterafce): void {
    this.beforeEditCache = todo.title;
    todo.editing = false;
    this.todoService.updateTodo(todo.id, todo.title, todo.editing)
      .subscribe(() => {
        this.todoService.getTodos().subscribe((resp: any) => {
          // console.log(resp);
          this.todos = resp;
          todo.editing = false;
        });
      });
  }

  remaining(): number {
    return this.todos.filter(todo => !todo.completed).length;
  }

}
