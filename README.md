# Yo Code - StackState Project Generator

We have written a Yeoman generator to help get you started with [StackState](http://stackstate.com) extension and customization.

## Install the Generator

Install Yeoman and the StackState generator:

```bash
npm install -g yo generator-stackstate-lab
```

## Install pre-requisites for generated projects

Install [PDM](https://pdm.fming.dev/latest/#installation) and [Gradle](https://gradle.org/install):

### Linux

```bash
curl -sSL https://raw.githubusercontent.com/pdm-project/pdm/main/install-pdm.py | python3 -
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
sdk install gradle
```

### macOS

```bash
brew install pdm gradle
```

## Run Yo Code

The Yeoman generator will walk you through the steps required to create your project prompting for the required information.

To launch the generator simply type:

```bash
yo stackstate-lab
```

## Command line

```
Usage:
  yo stackstate-lab:app [<destination>] [options]

Generates StackState extension and customization projects ready for development.

Options:
  -h,     --help                # Print the generator's options and usage
          --skip-cache          # Do not remember prompt answers                                                             Default: false
          --skip-install        # Do not automatically install dependencies                                                  Default: false
          --force-install       # Fail on install dependencies error                                                         Default: false
          --ask-answered        # Show prompts for already configured options                                                Default: false
  -t,     --projectType         # agent-check...
  -q,     --quick               # Quick mode, skip all optional prompts and use defaults
  -n,     --projectName         # Display name of the project
          --projectDescription  # Description of the project
          --url                 # StackState receiver api url. Example 'https://stackstate.mycompany.com/receiver/stsAgent'
          --apiKey              # StackState Api Key
  -acn,   --agentCheckName      # Name of the agent check
          --gitInit             # Initialize a git repo
          --useEtlFramework     # Use StackState ETL Agent Framework

Arguments:
  destination  # 
    The folder to create the project in, absolute or relative to the current working directory.
    Use '.' for the current folder. If not provided, defaults to a folder with the extension display name.
    Type: String  Required: false

Example usages:
  yo stackstate-lab                               # Create project in a folder with the project's name as prompted in the generator.
  yo stackstate-lab .                             # Create project in current folder
  yo stackstate-lab -acn=Hello -t=agent-check -q  # Create an Agent check project, skip prompts, use defaults.
  yo stackstate-lab -acn=Hello -t=agent-check --useEtlFramework -q  # Create an ETL Agent check project, skip prompts, use defaults.
```

## Run Generator using Docker

If you don't want to install nodejs or any node packages, use this method to containerize the generator.

Go into your project directory.

```bash
cd <project directory>
```

Build the docker image from the docker file.

```bash
docker build -t stackstate-lab-generator .
```

Create a docker container with volumes.

```bash
docker run -v $(pwd):/usr/src/app stackstate-lab-generator
```

## Local development

After making necessary changes, run `npm link` before running `yo code` to
test the local version.

You can learn more about Yeoman generator development on its
[documentation website](https://yeoman.io/authoring/index.html).


## License

[MIT](LICENSE)
