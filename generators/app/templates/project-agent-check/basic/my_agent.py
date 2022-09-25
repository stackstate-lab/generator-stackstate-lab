from schematics import Model
from schematics.types import IntType, StringType
from six import PY3
from stackstate_checks.base import (
    AgentCheck,
    ConfigurationError,
    HealthStream,
    HealthStreamUrn,
    TopologyInstance,
)


class InstanceInfo(Model):
    instance_url: str = StringType(required=True)
    instance_type: str = StringType(default="<%= _.snakeCase(agentCheckName)%>_check")
    collection_interval: int = IntType(default=120)


class <%= _.startCase(agentCheckName)%>Check(AgentCheck):
    INSTANCE_SCHEMA = InstanceInfo

    def __init__(self, name, init_config, agentConfig, instances=None):
        super().__init__(name, init_config, agentConfig, instances)

    def get_instance_key(self, instance):
        if "instance_url" not in instance:
            raise ConfigurationError("Missing instance_url in topology instance configuration.")

        if PY3:
            instance_type = instance.instance_type
            instance_url = instance.instance_url
        else:
            instance_type = instance.instance_type.encode("utf-8")
            instance_url = instance.instance_url.encode("utf-8")
        return TopologyInstance(instance_type, instance_url)


    def check(self, instance):
        # Call 3rd-party api to receive some record data. This example information about an application
        record = {
            "business_unit": "Banking",
            "service": "InternetBanking",
            "runtime": "Tomcat",
            "server": "SRV001",
            "area": "acceptance",
            "business_owner": "Bart Banker",
        }

        app_name = record["service"]
        app_id = "urn:myapp:%s" % app_name.upper()
        app_component = {
            "name": app_name,
            "domain": record[
                "business_unit"
            ],  # See STS http://localhost:7070/#/settings/domains
            "layer": "Applications",  # See STS http://localhost:7070/#/settings/layers
            "environment": record[
                "area"
            ].capitalize(),  # See STS http://localhost:7070/#/settings/environments
            "identifiers": [
                app_id
            ],  # See https://docs.stackstate.com/configure/identifiers
            "labels": [
                "businessapp:banking"
            ],  # Assign labels that can be used to create views easier
            "owner": record[
                "business_owner"
            ],  # Extra property to see on component properties
        }

        # Register the component
        self.component(app_id, "application", app_component)

        # We can see that the application runs on a server.
        # Say for instance servers are discovered by another integration in StackState like VMWare, AWS or Azure
        # We need to create server component with the correct identifier so StackState will merge the component
        # with the one from VMWare, AWS or Azure
        # The identifier is important for merging.
        # See https://docs.stackstate.com/configure/identifiers

        host_id = "urn:host:/%s" % record["server"].upper()
        server_component = {
            "name": record["server"].upper(),
            "domain": record["business_unit"].capitalize(),
            "layer": "Machines",
            "environment": record["area"].capitalize(),
            "identifiers": [record["server"].upper(), host_id],
            "labels": ["businessapp:banking"],
            "app_server": record["runtime"],  # additional property
        }

        # Besides using a urn for a component like we used for the application component, we can also use a name for the
        # component like 'host' below
        self.component(host_id, "host", server_component)

        # Relate the 2 components based on their names.
        self.relation(
            app_id,
            host_id,
            "runs_on",
            {"any": "additional properties and labels"},
        )


    def get_health_stream(self, instance):
        return HealthStream(HealthStreamUrn(instance.instance_type, "<%= _.snakeCase(agentCheckName)%>_health"), expiry_seconds=0)
