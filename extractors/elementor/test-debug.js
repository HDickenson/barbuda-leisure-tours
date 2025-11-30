const { Validator } = require('./dist/core/Validator');

const validator = new Validator();

const page = {
  id: 1,
  title: 'Test Page',
  url: 'https://example.com/test',
  slug: 'test-page',
  status: 'publish',
  lastModified: '2024-01-01T00:00:00Z',
  elementorVersion: '3.18.0',
  editMode: 'builder',
  templateType: 'page',
  sections: [
    {
      id: 'section-1',
      type: 'section',
      settings: {},
      columns: [
        {
          id: 'column-1',
          size: 100,
          settings: {},
          widgets: [
            {
              id: 'widget-1',
              type: 'heading',
              settings: {},
              content: {
                text: 'Hello World',
                tag: 'h1',
                align: 'left',
              },
            },
          ],
        },
      ],
    },
  ],
  pageSettings: {
    pageLayout: 'default',
    contentWidth: 1140,
  },
  extractedAt: '2024-01-01T00:00:00Z',
  extractorVersion: '1.0.0',
};

const result = validator.validatePage(page);
console.log(JSON.stringify(result, null, 2));
