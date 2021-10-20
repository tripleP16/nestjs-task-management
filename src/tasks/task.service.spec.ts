import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  username: 'Pablo',
  id: 'someId',
  password: 'password',
  tasks: [],
};

describe('TaskService', () => {
  let taskService: TasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTasksRepository },
      ],
    }).compile();
    taskService = module.get(TasksService);
    taskRepository = module.get(TaskRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      taskRepository.getTasks.mockResolvedValue('someValue');
      const result = await taskService.getTasks(null, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      const mockTask = {
        title: 'Test title',
        description: 'Test desc',
        id: 'someId',
        status: TaskStatus.OPEN,
      };
      taskRepository.findOne.mockResolvedValue(mockTask);
      const result = await taskService.getTaskById('someId', mockUser);
      expect(result).toEqual(mockTask);
    });
    it('calls TasksRepository.findOne and returns an error', async () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(taskService.getTaskById('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
