const prompts = require("./prompts");
const project = require("./agent-check-project-specifics");
const _ = require("lodash");

module.exports = {
  id: "project-agent-check",
  aliases: ["agent-check"],
  name: "Agent Check Project",

  /**
   * @param {import('yeoman-generator')} generator
   * @param {Object} projectConfig
   */
  prompting: async (generator, projectConfig) => {
    await prompts.askForProjectName(generator, projectConfig);
    await prompts.askForProjectDescription(generator, projectConfig);
    await prompts.askForAgentCheckName(generator, projectConfig);
    await prompts.askForStackStateReceiverUrl(generator, projectConfig);
    await prompts.askForStackStateApiKey(generator, projectConfig);
    await prompts.askForEtlFramework(generator, projectConfig);
    await prompts.askForGit(generator, projectConfig);
  },

  /**
   * @param {import('yeoman-generator')} generator
   * @param {Object} projectConfig
   */
  writing: (generator, projectConfig) => {
    const context = {
      ...projectConfig,
      _: _,
      snakeCaseAgentCheckName: _.snakeCase(projectConfig.agentCheckName),
      snakeCaseProjectName: _.snakeCase(projectConfig.projectName),
      startCaseAgentCheckName: _.startCase(projectConfig.agentCheckName).replaceAll(" ", ""),
      startCaseProjectName: _.startCase(projectConfig.projectName).replaceAll(" ", "")
    };
    generator.fs.copyTpl(
      generator.templatePath("common", "pyproject.toml"),
      generator.destinationPath("pyproject.toml"),
      context
    );

    generator.fs.copyTpl(generator.templatePath("common", "sts.env"), generator.destinationPath(".sts.env"), context);

    generator.fs.copy(
      generator.templatePath("common", ".gitkeep"),
      generator.destinationPath("tests", "resources", "share", ".gitkeep")
    );

    generator.fs.copy(generator.templatePath("common", "vscode"), generator.destinationPath(".vscode"));

    generator.fs.copyTpl(generator.templatePath("common", "tasks"), generator.destinationPath("tasks"), context);

    generator.fs.copy(generator.templatePath("common", "env"), generator.destinationPath(".env"));

    generator.fs.copy(
      generator.templatePath("common", "stackstate.yaml"),
      generator.destinationPath("tests", "resources", "stackstate.yaml")
    );

    if (projectConfig.gitInit) {
      generator.fs.copy(generator.templatePath("common", "gitignore"), generator.destinationPath(".gitignore"));
    }

    if (projectConfig.useEtlFramework) {
      project.writeEtlProject(generator, context);
    } else {
      project.writeBasicProject(generator, context);
    }

    projectConfig.installDependencies = true;
  },

  /**
   * @param {import('yeoman-generator')} generator
   * @param {Object} projectConfig
   */
  endMessage: (generator, _) => {
    generator.log("");
    generator.log("To futher complete installation, run: ");
    generator.log("    pdm install");
    generator.log("    pdm test");
    generator.log("    pdm buildAgent");
    generator.log("    pdm check");
    generator.log("Before running the agent, make sure to set connection details in '.sts.env'");
    generator.log("    pdm serve");
    generator.log("");
  }
};
