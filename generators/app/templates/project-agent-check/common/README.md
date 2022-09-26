# StackState <%= _.startCase(projectName) %> Agent Check

## Overview

A custom [StackState Agent Check](https://docs.stackstate.com/develop/developer-guides/agent_check/agent_checks) that makes it possible to integrate [XXXX](https://google.com) with StackState.


## Installation

From the StackState Agent 2 linux machine, run

```bash 
curl -L https://github.com/xxx/<%= _.snakeCase(projectName) %>/releases/download/v0.1.0/<%= _.snakeCase(projectName) %> -agent-check-0.1.0.zip -o <%= _.snakeCase(projectName) %>-agent-check.zip
tar -xvf <%= _.snakeCase(projectName) %>-agent-check.zip
./install.sh
```

Setup `conf.yaml` on agent machine.

```bash 
cp /etc/stackstate-agent/conf.d/<%= _.snakeCase(agentCheckName) %>.d/conf.yaml.example /etc/stackstate-agent/conf.d/<%= _.snakeCase(agentCheckName) %>.d/conf.yaml
chown stackstate-agent:stackstate-agent /etc/stackstate-agent/conf.d/<%= _.snakeCase(agentCheckName) %>.d/conf.yaml
vi conf.yaml
```

Change the properties to match your environment.

```yaml
init_config:

instances:
  - instance_url: "<%= _.snakeCase(agentCheckName)%>"
    instance_type: "<%= _.snakeCase(agentCheckName)%>_check"
    collection_interval: 300

```

Run the agent check to verify configured correctly.

```bash
sudo -u stackstate-agent stackstate-agent check <%= _.snakeCase(agentCheckName)%> -l info
```

## Development

This project is generated using [Yeoman](https://yeoman.io/) and the [StackState Generator](https://github.com/stackstate-lab/generator-stackstate-lab)

StackState <%= _.startCase(projectName) %> Agent Check is developed in Python 3, and is transpiled to Python 2.7 for deployment to the StackState Agent v2 environment.

---
### Prerequisites:

- Python v.3.9.x See [Python installation guide](https://docs.python-guide.org/starting/installation/)
- [PDM](https://pdm.fming.dev/latest/#recommended-installation-method)
- [Docker](https://www.docker.com/get-started)
---

### Setup local code repository


The `pdm install` command sets up all the projects required dependencies using [PEP 582](https://peps.python.org/pep-0582/) instead of virtual environments.


### Prepare local _.sts.env_ file

The `.sts.env` file run the StackState Agent container. Remember to change the StackState url and api key for your environment.

```bash

cat <<EOF > ./.sts.env
STS_URL=https://xxx.stackstate.io/receiver/stsAgent
STS_API_KEY=xxx
EOF
```

### Preparing Agent check conf.yaml

```
cp ./src/data/conf.d/<%= _.snakeCase(agentCheckName)%>.d/conf.yaml.example ./src/data/conf.d/<%= _.snakeCase(agentCheckName)%>.d/conf.yaml
```
---

### Code styling and linting

```bash
pdm codeStyle
```

### Running unit tests

```bash
pdm test
```

### Build

The build will transpile the custom agent check to Python 2.7 and creates and install shell script packaged into
the `dist/<%= _.snakeCase(agentCheckName)%>-agent-check-0.1.0.zip` 

```bash
pdm build
```

### Building a StackState Agent container

You have the ability to customize the StackState Agent using the [Dockerfile](./tasks/dev-agent/Dockerfile).

For installing os packages or other tools at runtime, you could define an `install.sh` file in the `tests/resources/share/` directory that is run every time the container is started.

```bash
pdm cleanAgent
pdm buildAgent
```

### Running your custom agent check

A check can be dry-run inside the StackState Agent container by running:

```bash
pdm check
```

### Starting the StackState Agent to send data to StackState server

Starts the StackState Agent in the foreground using the configuration `src/data/conf.d/` directory.

```bash
pdm serve
```
---
