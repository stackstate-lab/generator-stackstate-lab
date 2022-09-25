"use strict";

const Generator = require("yeoman-generator");
const yosay = require("yosay");

const path = require("path");

const projectAgentCheck = require("./generate-agent-check-project");

const projectGenerators = [projectAgentCheck];

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.description =
      "Generates StackState extension and customization projects ready for development.";

    this.argument("destination", {
      type: String,
      required: false,
      description: `\n    The folder to create the project in, absolute or relative to the current working directory.\n    Use '.' for the current folder. If not provided, defaults to a folder with the extension display name.\n  `
    });

    this.option("projectType", {
      type: String,
      alias: "t",
      description:
        projectGenerators
          .slice(0, 6)
          .map(e => e.aliases[0])
          .join(", ") + "..."
    });

    this.option("quick", {
      type: Boolean,
      alias: "q",
      description: "Quick mode, skip all optional prompts and use defaults"
    });

    this.option("projectName", {
      type: String,
      alias: "n",
      description: "Display name of the project"
    });

    this.option("projectDescription", {
      type: String,
      description: "Description of the project"
    });

    this.option("agentCheckName", {
      type: String,
      alias: "acn",
      description: "Name of the agent check"
    });

    this.option("gitInit", {
      type: Boolean,
      description: `Initialize a git repo`
    });

    this.projectConfig = Object.create(null);
    this.projectGenerator = undefined;

    this.abort = false;
  }

  async initializing() {
    this.log(yosay("Welcome to the StackState Project generator!"));

    const destination = this.options.destination;
    if (destination) {
      const folderPath = path.resolve(this.destinationPath(), destination);
      this.destinationRoot(folderPath);
    }
  }

  async prompting() {
    // Ask for extension type
    const projectType = this.options.projectType;
    if (projectType) {
      const projectGenerator = projectGenerators.find(
        g => g.aliases.indexOf(projectType) !== -1
      );
      if (projectGenerator) {
        this.projectConfig.type = projectGenerator.id;
      } else {
        this.log(
          "Invalid project type: " +
            projectType +
            "\nPossible types are: " +
            projectGenerators.map(g => g.aliases.join(", ")).join(", ")
        );
        this.abort = true;
      }
    } else {
      const choices = [];
      for (const g of projectGenerators) {
        const name = g.name;
        if (name) {
          choices.push({ name, value: g.id });
        }
      }

      this.projectConfig.type = (
        await this.prompt({
          type: "list",
          name: "type",
          message: "What type of project do you want to create?",
          pageSize: choices.length,
          choices
        })
      ).type;
    }

    this.projectGenerator = projectGenerators.find(
      g => g.id === this.projectConfig.type
    );
    try {
      await this.projectGenerator.prompting(this, this.projectConfig);
    } catch (_) {
      this.abort = true;
    }
  }

  // Write files
  writing() {
    if (this.abort) {
      return;
    }

    if (!this.options.destination && !this.projectGenerator.update) {
      this.destinationRoot(
        this.destinationPath(this.projectConfig.projectName)
      );
    }

    this.env.cwd = this.destinationPath();

    this.log();
    this.log(`Writing in ${this.destinationPath()}...`);

    this.sourceRoot(
      path.join(__dirname, "./templates/" + this.projectConfig.type)
    );

    return this.projectGenerator.writing(this, this.projectConfig);
  }

  // Installation
  install() {
    if (this.abort) {
      this.env.options.skipInstall = true;
      return;
    }

    if (this.projectConfig.installDependencies) {
      // This.env.options.nodePackageManager = this.projectConfig.pkgManager;
    } else {
      this.env.options.skipInstall = true;
    }
  }

  // End
  async end() {
    if (this.abort) {
      return;
    }

    if (this.projectGenerator.update) {
      this.log("");
      this.log("Your project has been updated!");
      this.log("");
      this.log(
        "To start editing with Visual Studio Code, use the following commands:"
      );
      this.log("");
      this.log("     code .");

      this.log(`     ${this.projectConfig.pkgManager} run compile-web`);
      this.log("");
      return;
    }

    // Git init
    if (this.projectConfig.gitInit) {
      this.spawnCommand("git", ["init", "--quiet", "--initial-branch=main"]);
    }

    this.log("");

    this.log(
      "Your project " + this.projectConfig.projectName + " has been created!"
    );
    if (this.projectGenerator.endMessage) {
      this.projectGenerator.endMessage(this, this.projectConfig);
    }
  }
};
