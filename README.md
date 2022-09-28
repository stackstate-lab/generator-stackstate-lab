# Yo Code - StackState Project Generator

We have written a Yeoman generator to help get you started with [StackState](http://stackstate.com) extension and customization.

## Install the Generator

Install Yeoman and the StackState generator:

```bash
npm install -g yo generator-stackstate-lab
```

## Install pre-requisites for generated projects

Install [PDM](https://pdm.fming.dev/latest/#installation):

### Linux

```bash
curl -sSL https://raw.githubusercontent.com/pdm-project/pdm/main/install-pdm.py | python3 -
```

### macOS

```bash
brew install pdm
```

## Run Yo Code

The Yeoman generator will walk you through the steps required to create your project prompting for the required information.

To launch the generator simply type:

```bash
yo stackstate-lab
```

## StackState Agent Check Project Type 

The [StackState-Lab Generator](https://github.com/stackstate-lab/generator-stackstate-lab) can
scaffold a new StackState Agent Check project using a basic check structure or a more complex structure that uses
the [StackState ETL Framework](https://github.com/stackstate-etl/).

The generated project uses [PDM](https://pdm.fming.dev/) for Python package and dependency management which 
supports the latest PEP standards. Especially [PEP 582 support](https://www.python.org/dev/peps/pep-0582), no virtualenv involved at all.
[PDM Scripts](https://pdm.fming.dev/latest/usage/scripts/) drive the development life-cycle of the project.

| Command        | Description                                                                                                                |
|----------------|----------------------------------------------------------------------------------------------------------------------------|
| pdm install    | Installs package and setups up PEP 582 environment                                                                         |
| pdm test       | Runs unit tests                                                                                                            |
| pdm format     | Code styling and linting performed by Black, FlakeHell and MyPy                                                            |
| pdm build      | Will transpile the custom agent check to Python 2.7 and create install zip                                                 |
| pdm cleanAgent | Remove the custom StackState Agent Docker image used during development                                                    |
| pdm buildAgent | Build a custom [StackState Agent Docker](https://hub.docker.com/r/stackstate/stackstate-agent-2) to use during development |
| pdm check      | Dry-run custom agent check inside the StackState Agent container                                                           |
| pdm serve      | Starts the StackState Agent in the foreground using the configuration `src/data/conf.d/` directory                         |


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
