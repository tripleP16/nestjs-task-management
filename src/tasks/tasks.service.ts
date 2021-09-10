import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
@Injectable()
export class TasksService {
  constructor (
      @InjectRepository(TaskRepository)
      private taskRepo: TaskRepository
    ) {}

  /*getAllTasks(): Task[] {
    return this.tasks;
  }

  createTask(data: CreateTaskDto): Task {
    const { title, description } = data;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): Task {
    const taskFound = this.tasks.find((task) => task.id == id);
    if (taskFound) {
      return taskFound;
    }
    throw new NotFoundException('Task not found');
  }

  deleteTaskById(id: string): void {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id != found.id);
  }

  updateTaskStatus(id: string, TaskStatus: UpdateTaskStatusDto): Task {
    const task = this.getTaskById(id);
    task.status = TaskStatus.status;
    return task;
  }

  getTaskWithFilters(filterDto: GetFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task) => task.status == status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.description.includes(search) || task.title.includes(search),
      );
    }
    return tasks;
  }*/

  async getTaskById(id:string): Promise<Task> {
    const found = await this.taskRepo.findOne(id); 
    if (! found) {
      throw new NotFoundException('Task not found')
    }
    return found; 
  }

  createTask(data: CreateTaskDto): Promise<Task> {
    return this.taskRepo.createTask(data);
  }

  async deleteTaskById(id: string): Promise<void> {
    const result = await this.taskRepo.delete(id);
    if(result.affected == 0) {
      throw new NotFoundException('Not found')
    }
  }
  async updateTaskStatus(id: string, TaskStatus: UpdateTaskStatusDto): Promise<Task> {
    const task = await this.getTaskById(id); 

    task.status = TaskStatus.status;

    await this.taskRepo.save(task); 

    return task;
  }

  getTasks(filterDto: GetFilterDto): Promise<Task[]> {
    return this.taskRepo.getTasks(filterDto)
  }
}
