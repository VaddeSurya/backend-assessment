import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from '../auth/dto/create-task.dto';
import { UpdateTaskDto } from '../auth/dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasksRepo: Repository<Task>,
  ) {}

  create(createTaskDto: CreateTaskDto, userId: number) {
    const task = this.tasksRepo.create({
      ...createTaskDto,
      user: { id: userId } as any,
    });
    return this.tasksRepo.save(task);
  }

  findAll(userId: number) {
    return this.tasksRepo.find({ where: { user: { id: userId } } });
  }

  async findOne(id: number, userId: number) {
    const task = await this.tasksRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: number, userId: number, dto: UpdateTaskDto) {
    const task = await this.findOne(id, userId);
    Object.assign(task, dto);
    return this.tasksRepo.save(task);
  }

  async remove(id: number, userId: number) {
    const task = await this.findOne(id, userId);
    await this.tasksRepo.remove(task);
    return { message: 'Task deleted successfully' };
  }
}
