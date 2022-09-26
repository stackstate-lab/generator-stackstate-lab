const validator = require("./validator");
const path = require("path");
const _ = require("lodash");
const sanitize = require("sanitize-filename");

/**
 * Get the name for the project.
 *
 * @param {import('yeoman-generator')} generator
 * @param {Object} projectConfig
 */

exports.askForProjectName = async (generator, projectConfig) => {
  let projectName = generator.options.projectName;
  if (projectName) {
    projectConfig.projectName = projectName;
    return Promise.resolve();
  }

  const nameFromFolder = sanitize(path.basename(generator.destinationPath()));

  if (generator.options.quick && nameFromFolder) {
    projectConfig.projectName = nameFromFolder;
    return Promise.resolve();
  }

  const displayNameAnswer = await generator.prompt({
    type: "input",
    name: "projectName",
    message: "What's the name of your project?",
    default: nameFromFolder
  });
  projectConfig.projectName = displayNameAnswer.projectName;
};

/**
 * Get the name for the agent check.
 *
 * @param {import('yeoman-generator')} generator
 * @param {Object} projectConfig
 */

exports.askForAgentCheckName = async (generator, projectConfig) => {
  let agentCheckName = generator.options.agentCheckName;
  if (agentCheckName) {
    projectConfig.agentCheckName = agentCheckName;
    return Promise.resolve();
  }

  const nameFromProject = _.snakeCase(projectConfig.projectName);

  if (generator.options.quick && nameFromProject) {
    projectConfig.agentCheckName = nameFromProject;
    return Promise.resolve();
  }

  const displayNameAnswer = await generator.prompt({
    type: "input",
    name: "checkName",
    message: "What's the name of your custom agent check?",
    default: nameFromProject
  });
  projectConfig.agentCheckName = displayNameAnswer.checkName;
};

/**
 * Ask for extension description
 * @param {import('yeoman-generator')} generator
 * @param {Object} projectConfig
 */
exports.askForProjectDescription = (generator, projectConfig) => {
  let projectDescription = generator.options.projectDescription;
  if (projectDescription) {
    projectConfig.projectDescription = projectDescription;
    return Promise.resolve();
  }

  if (generator.options.quick) {
    projectConfig.projectDescription = "";
    return Promise.resolve();
  }

  return generator
    .prompt({
      type: "input",
      name: "description",
      message: "What's the description of your project?",
      default: ""
    })
    .then(descriptionAnswer => {
      projectConfig.projectDescription = descriptionAnswer.description;
    });
};

/**
 * @param {import('yeoman-generator')} generator
 * @param {Object} projectConfig
 */
exports.askForStackStateReceiverUrl = (generator, projectConfig) => {
  let stsUrl = generator.options.url;
  if (stsUrl) {
    projectConfig.stsUrl = stsUrl;
    return Promise.resolve();
  }

  if (generator.options.quick) {
    projectConfig.stsUrl = "https://stackstate.mycompany.com/receiver/stsAgent";
    return Promise.resolve();
  }

  return generator
    .prompt({
      type: "input",
      name: "url",
      message: "What's the url to the StackState Receiver Api?",
      default: "https://stackstate.mycompany.com/receiver/stsAgent"
    })
    .then(answer => {
      projectConfig.url = answer.url;
    });
};

exports.askForStackStateApiKey = (generator, projectConfig) => {
  let stsApiKey = generator.options.apiKey;
  if (stsApiKey) {
    projectConfig.stsApiKey = stsApiKey;
    return Promise.resolve();
  }

  if (generator.options.quick) {
    projectConfig.stsApiKey = "xxxx";
    return Promise.resolve();
  }

  return generator
    .prompt({
      type: "input",
      name: "apiKey",
      message: "What's the api key for the StackState server?",
      default: "xxxx"
    })
    .then(answer => {
      projectConfig.stsApiKey = answer.apiKey;
    });
};
/**
 * @param {import('yeoman-generator')} generator
 * @param {Object} projectConfig
 */
exports.askForGit = (generator, projectConfig) => {
  let gitInit = generator.options.gitInit;
  if (typeof gitInit === "boolean") {
    projectConfig.gitInit = Boolean(gitInit);
    return Promise.resolve();
  }

  if (generator.options.quick) {
    projectConfig.gitInit = true;
    return Promise.resolve();
  }

  return generator
    .prompt({
      type: "confirm",
      name: "gitInit",
      message: "Initialize a git repository?",
      default: true
    })
    .then(gitAnswer => {
      projectConfig.gitInit = gitAnswer.gitInit;
    });
};
