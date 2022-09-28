const _ = require("lodash");

/**
 * @param {import('yeoman-generator')} generator
 * @param {Object} projectConfig
 */
exports.writeBasicProject = (generator, context) => {
  generator.fs.copyTpl(generator.templatePath("basic", "README.md"), generator.destinationPath("README.md"), context);

  generator.fs.copyTpl(
    generator.templatePath("basic", "conf.yaml.example"),
    generator.destinationPath("src", "data", "conf.d", `${context.snakeCaseAgentCheckName}.d`, "conf.yaml.example"),
    context
  );

  generator.fs.copyTpl(
    generator.templatePath("basic", "conf.yaml.example"),
    generator.destinationPath("src", "data", "conf.d", `${context.snakeCaseAgentCheckName}.d`, "conf.yaml"),
    context
  );

  generator.fs.copyTpl(
    generator.templatePath("basic", "my_agent.py"),
    generator.destinationPath("src", `${context.snakeCaseAgentCheckName}.py`),
    context
  );

  generator.fs.copyTpl(generator.templatePath("basic"), generator.destinationPath("src", "basic"), context);
};

/**
 * @param {import('yeoman-generator')} generator
 * @param {Object} projectConfig
 */
exports.writeEtlProject = (generator, context) => {
  context.clientName = `${context.startCaseAgentCheckName}Client`;
  context.basePkg = `sts_${context.snakeCaseAgentCheckName}_impl`;
  generator.fs.copyTpl(generator.templatePath("etl", "README.md"), generator.destinationPath("README.md"), context);
  generator.fs.copyTpl(
    generator.templatePath("etl", "sts_f5_impl"),
    generator.destinationPath("src", `${context.basePkg}`),
    context
  );
  generator.fs.copyTpl(
    generator.templatePath("etl", "tests", "test_f5_check.py"),
    generator.destinationPath("tests", `test_${context.snakeCaseAgentCheckName}_check.py`),
    context
  );
  generator.fs.copyTpl(
    generator.templatePath("etl", "conf.yaml.example"),
    generator.destinationPath("src", "data", "conf.d", `${context.snakeCaseAgentCheckName}.d`, "conf.yaml.example"),
    context
  );

  generator.fs.copyTpl(
    generator.templatePath("etl", "conf.yaml.example"),
    generator.destinationPath("src", "data", "conf.d", `${context.snakeCaseAgentCheckName}.d`, "conf.yaml"),
    context
  );

  generator.fs.copyTpl(
    generator.templatePath("etl", "f5.py"),
    generator.destinationPath("src", `${context.snakeCaseAgentCheckName}.py`),
    context
  );

  generator.fs.copy(
    generator.templatePath("etl", "tests", "resources", "responses"),
    generator.destinationPath("tests", "resources", "responses")
  );
};
