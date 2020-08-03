import { Component, OnInit, OnDestroy } from '@angular/core';
import { TodoInterafce } from '../../interface/todo-interface';
import { TodoService } from '../../services/todo-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-taskslist',
  templateUrl: './taskslist.component.html',
  styleUrls: ['./taskslist.component.scss']
})


export class TaskslistComponent implements OnInit, OnDestroy {

  constructor(public todoService: TodoService) {}

  todos: TodoInterafce[];
  todoTitle: string;
  beforeEditCache: string;
  private gettodosSub: Subscription;
  private createtodosSub: Subscription;
  private updatetodosSub: Subscription;
  private deletetodosSub: Subscription;
  private completedtodosSub: Subscription;

  ngOnInit() {
    this.beforeEditCache = '';
    this.todoTitle = '';
    this.todos = [];

    this.gettodosSub = this.todoService.getTodos().subscribe((response: any) => {
      this.todos = response;
    });

  }

  ngOnDestroy() {
    this.gettodosSub.unsubscribe();
    this.createtodosSub.unsubscribe();
    this.completedtodosSub.unsubscribe();
    this.deletetodosSub.unsubscribe();
    this.updatetodosSub.unsubscribe();
  }

  addTodo(): void {
    if (this.todoTitle.trim().length === 0) {
      return;
    }
    this.createtodosSub = this.todoService.createTodo(this.todoTitle, false, false)
      .subscribe(() => {
        this.gettodosSub = this.todoService.getTodos().subscribe((resp: any) => {
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
    this.completedtodosSub = this.todoService.completedTodo(todo.id, todo.title, todo.completed, todo.editing)
      .subscribe(() => {
        this.gettodosSub = this.todoService.getTodos().subscribe((resp: any) => {
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
    this.deletetodosSub = this.todoService.delTodo(id).subscribe((res) => {
      // console.log(res);
      this.gettodosSub = this.todoService.getTodos().subscribe((resp: any) => {
        this.todos = resp;
      });
    });
  }

  updateTodo(todo: TodoInterafce): void {
    this.beforeEditCache = todo.title;
    todo.editing = false;
    this.updatetodosSub = this.todoService.updateTodo(todo.id, todo.title, todo.editing)
      .subscribe(() => {
        this.gettodosSub = this.todoService.getTodos().subscribe((resp: any) => {
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
