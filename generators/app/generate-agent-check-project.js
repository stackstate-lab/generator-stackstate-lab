const prompts = require("./prompts");
const _ = require("lodash")

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
    await prompts.askForGit(generator, projectConfig);
  },

  /**
   * @param {import('yeoman-generator')} generator
   * @param {Object} projectConfig
   */
  writing: (generator, projectConfig) => {
    const context = { ...projectConfig, _: _ };
    generator.fs.copyTpl(
      generator.templatePath("common", "pyproject.toml"),
      generator.destinationPath("pyproject.toml"),
      context
    );

    generator.fs.copyTpl(
      generator.templatePath("common", "README.md"),
      generator.destinationPath("README.md"),
      context
    );

    generator.fs.copyTpl(
      generator.templatePath("basic", "conf.yaml.example"),
      generator.destinationPath(
        "src",
        "data",
        "conf.d",
        `${_.snakeCase(projectConfig.agentCheckName)}.d`,
        "conf.yaml.example"
      ),
      context
    );

    generator.fs.copyTpl(
      generator.templatePath("basic", "my_agent.py"),
      generator.destinationPath(
        "src",
        `${_.snakeCase(projectConfig.agentCheckName)}.py`
      ),
      context
    );

    generator.fs.copyTpl(
      generator.templatePath("basic", "test_my_agent.py"),
      generator.destinationPath(
        "tests",
        `test_${_.snakeCase(projectConfig.agentCheckName)}.py`
      ),
      context
    );

    generator.fs.copyTpl(
      generator.templatePath("common", ".gitkeep"),
      generator.destinationPath("tests", "resources", "share", ".gitkeep"),
      context
    );

    generator.fs.copy(
      generator.templatePath("common", "vscode"),
      generator.destinationPath(".vscode")
    );

    generator.fs.copy(
      generator.templatePath("common", "tasks"),
      generator.destinationPath("tasks")
    );

    generator.fs.copy(
      generator.templatePath("common", "env"),
      generator.destinationPath(".env")
    );

    generator.fs.copy(
      generator.templatePath("common", "sts.env"),
      generator.destinationPath(".sts.env")
    );

    generator.fs.copy(
      generator.templatePath("common", "stackstate.yaml"),
      generator.destinationPath("tests", "resources", "stackstate.yaml")
    );

    if (projectConfig.gitInit) {
      generator.fs.copy(
        generator.templatePath("common", "gitignore"),
        generator.destinationPath(".gitignore")
      );
    }

    projectConfig.installDependencies = true;
  }

  // /**
  //  * @param {import('yeoman-generator')} generator
  //  * @param {Object} projectConfig
  //  */
  // endMessage: (generator, projectConfig) => {
  //     generator.log("");
  // }
};
