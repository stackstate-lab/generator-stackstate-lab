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
