# StackState <%= _.startCase(projectName) %> Agent Check

## Overview

A custom [StackState Agent Check](https://docs.stackstate.com/develop/developer-guides/agent_check/agent_checks) that makes it possible to integrate [XXXX](https://www.f5.com/products/big-ip-services/local-traffic-manager) with StackState.

The integration uses the [StackState ETL framework](https://stackstate-lab.github.io/stackstate-etl/) 
to define templates to map Nutanix Rest Api entities to StackState Components, Relations, Events,
Metrics and Health Syncs

See [StackState ETL documentation](https://stackstate-lab.github.io/stackstate-etl/) for more information.


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
  - instance_url: "<%=snakeCaseAgentCheckName%>"
    instance_type: <%=snakeCaseAgentCheckName%>
    collection_interval: 300
    <%=snakeCaseAgentCheckName%>:
      url: "http://host.docker.internal:3005"
      username: "admin"
      password: "xxxxx"
    domain: "<%=snakeCaseAgentCheckName%>"
    layer: "Machines"
    etl:
      refs:
        - "module_dir://<%=basePkg%>.templates"
```

Run the agent check to verify configured correctly.

```bash
sudo -u stackstate-agent stackstate-agent check <%=snakeCaseAgentCheckName%> -l info
```

## ETL

APIs to syn data from, 

- [icontrol-rest-api-user-guide-15-1-0.pdf](https://cdn.f5.com/websites/devcentral.f5.com/downloads/icontrol-rest-api-user-guide-15-1-0.pdf)
  - Refer to page 24/25 for information on query parameters like $select, $filter, pagination
- [Common iControl REST API command examples](https://support.f5.com/csp/article/K13225405)


### DataSources


| Name                                                        | Module              | Cls                                                     | Description                  |
|-------------------------------------------------------------|---------------------|---------------------------------------------------------|------------------------------|
| [<%=snakeCaseAgentCheckName%>](./src/<%=basePkg%>/templates/010_default.yaml)   | <%=basePkg%>.client  | [<%=clientName%>](src/<%=basePkg%>/client/client.py)  | enables rest calls to F5 api |


### Template Mappings

| Name                                                                                                              | Type              | 4T        | Target Api                                                                                 | Description                                    |
|-------------------------------------------------------------------------------------------------------------------|-------------------|-----------|----------------------------------------------------------------------------------------|------------------------------------------------|
| [<%=snakeCaseAgentCheckName%>_device_template](./src/<%=basePkg%>/templates/020_devices.yaml)                                      | <%=snakeCaseAgentCheckName%>-device         | Component | [mgmt/tm/cm/device](./tests/resources/responses/device.json)                           |                                                |
| [<%=snakeCaseAgentCheckName%>_device_group_template](./src/<%=basePkg%>/templates/030_device_groups.yaml)                          | <%=snakeCaseAgentCheckName%>-device-group   | Component | [mgmt/tm/cm/device-group](./tests/resources/responses/device_group.json)               |                                                |

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

```bash 
git clone git@github.com:xxx/<%= _.snakeCase(projectName) %>.git
cd <%= _.snakeCase(projectName) %>
pdm install 
```
The `pdm install` command sets up all the projects required dependencies using [PEP 582](https://peps.python.org/pep-0582/) instead of virtual environments.

### Prepare local _.sts.env_ file

The `.sts.env` file is used to run the StackState Agent container. Remember to change the StackState url and api key for your environment.

```bash

cat <<EOF > ./.sts.env
STS_URL=https://xxx.stackstate.io/receiver/stsAgent
STS_API_KEY=xxx
EOF
```

### Preparing Agent check conf.yaml

```
cp ./src/data/conf.d/<%=snakeCaseAgentCheckName%>.d/conf.yaml.example ./src/data/conf.d/<%=snakeCaseAgentCheckName%>.d/conf.yaml
```
---

### Code styling and linting


- [Black](https://black.readthedocs.io/en/stable/) for formatting
- [isort](https://pycqa.github.io/isort/) to sort imports
- [Flakehell](https://flakehell.readthedocs.io/) for linting
- [mypy](https://mypy.readthedocs.io/en/stable/) for static type checking

```bash
pdm format
```

### Running unit tests

```bash
pdm test
```

### Build

The build will transpile the custom agent check to Python 2.7 and creates and install shell script packaged into
the `dist/<%=snakeCaseAgentCheckName%>-agent-check-0.1.0.zip` 

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
