export const showList = (todos) =>
  `Your task list: \n\n${todos
    .map(
      (todo) =>
        todo.id +
        ' ' +
        (todo.isCompleted ? '☑️' : '⭕') +
        ' ' +
        todo.name +
        '\n\n',
    )
    .join('')}`;
