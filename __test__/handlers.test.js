const handlers = require('../lib/handlers');

describe('Name of the group', () => {
  it('should ', () => {
    const req = {};
    const res = {
      render: jest.fn(),
    }
    handlers.home(req, res);
    expect(res.render.mock.calls.length).toBe(1);
    expect(res.render.mock.calls[0][0]).toBe('home');
  });
});