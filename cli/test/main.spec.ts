

describe('CLIApplication.ts', () => {
  it('Should load the cli application', () => {
    const cliApplication = new CLIApplication();

    run();

    expect(cliApplication.start).toHaveBeenCalled();
  });
});
