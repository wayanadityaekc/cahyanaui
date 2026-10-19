export function detailBlocks(title, { facts, included, excluded }, rest = []) {
  return [
    { type: 'heading', sub: false, html: title },
    { type: 'facts', items: facts },
    {
      type: 'boxes',
      items: [
        { title: "What's included", variant: 'yes', list: included },
        { title: 'Not included', variant: 'no', list: excluded },
      ],
    },
    ...rest,
  ];
}
