import { AppService } from './app.service';
import {
  Action,
  Command,
  Ctx,
  Hears,
  InjectBot,
  Message,
  On,
  Update,
} from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { actionButtons } from './app.buttons';
import { Context } from './context.interface';
import { showList } from './app.utils';

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}

  async onModuleInit() {
    await this.bot.telegram.setMyCommands([
      { command: 'start', description: 'Start the bot' },
    ]);
  }

  @Command('start')
  async startcommand(ctx: Context) {
    await ctx.reply('Hi Friend');
    await ctx.reply('What do you want to do ?', actionButtons());
  }

  @Action('create')
  @Hears('create')
  async CreateTask(ctx: Context) {
    ctx.session.type = 'create';
    await ctx.reply('Enter name: ');
  }

  @Action('list')
  @Hears('list')
  async ListTask(ctx: Context) {
    const todos = await this.appService.getAll();
    await ctx.reply(showList(todos));
  }

  @Action('done')
  @Hears('done')
  async DoneTask(ctx: Context) {
    ctx.session.type = 'done';
    await ctx.deleteMessage();
    await ctx.reply('Wrive ID: ');
  }

  @Action('edit')
  @Hears('edit')
  async EditTask(ctx: Context) {
    ctx.session.type = 'edit';
    await ctx.deleteMessage();
    await ctx.replyWithHTML(
      'Write id and new name: \n\n' + 'In format - <b>id | new name</b>',
    );
  }

  @Action('delete')
  @Hears('delete')
  async DeleteTask(ctx: Context) {
    ctx.session.type = 'remove';
    await ctx.deleteMessage();
    await ctx.reply('Wrive ID: ');
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!ctx.session.type) return;

    if (ctx.session.type === 'create') {
      const todos = await this.appService.createTask(message);

      await ctx.reply(showList(todos));
    }

    if (ctx.session.type === 'done') {
      const todos = await this.appService.doneTask(Number(message));

      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('🤖 This id is not found.');
        return;
      }

      await ctx.reply(showList(todos));
    }

    if (ctx.session.type === 'edit') {
      const [taskId, taskName] = message.split(' | ');
      const todos = await this.appService.editTask(Number(taskId), taskName);

      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('🤖 This id is not found.');
        return;
      }

      await ctx.reply(showList(todos));
    }

    if (ctx.session.type === 'remove') {
      const todos = await this.appService.deleteTask(Number(message));

      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('🤖 This id is not found.');
        return;
      }

      await ctx.reply(showList(todos));
    }
  }
}
