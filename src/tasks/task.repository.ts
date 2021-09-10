import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetFilterDto } from "./dto/get-task-filter.dto";
import { Task } from "./entities/task.entity";
import { TaskStatus } from "./task-status.enum";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    async createTask(createTaskDto: CreateTaskDto):Promise<Task>{
        const { title, description } = createTaskDto;
        const task: Task = this.create({
          title,
          description,
          status: TaskStatus.OPEN,
        });

        await this.save(task)
        return task;
    }
    async getTasks(filter: GetFilterDto): Promise<Task[]>{
        const query = this.createQueryBuilder('task'); 
        const { status, search } = filter; 
        if(status) {
            query.andWhere('task.status = :status', {status})
        }
        if(search) {
            query.andWhere(
                'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)', 
                {search: `%${search}%`}
            )
        }
        const tasks = await query.getMany(); 
        return tasks;
    }
}