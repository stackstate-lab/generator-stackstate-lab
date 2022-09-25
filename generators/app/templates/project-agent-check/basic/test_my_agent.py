from typing import List, Dict, Any

from <%= _.snakeCase(agentCheckName)%> import InstanceInfo, <%= _.startCase(agentCheckName)%>Check

from stackstate_checks.stubs import topology
import yaml
import logging

logging.basicConfig()
logger = logging.getLogger("stackstate_checks.base.checks.base.test")
logger.setLevel(logging.INFO)


def test_check():
    topology.reset()
    instance_dict = setup_test_instance()
    instance = InstanceInfo(instance_dict)
    instance.validate()
    check = <%= _.startCase(agentCheckName)%>Check("test", {}, {}, instances=[instance_dict])
    check._init_health_api()
    check.check(instance)
    snapshot = topology.get_snapshot("")
    components = snapshot["components"]
    relations = snapshot["relations"]
    app_id = "urn:myapp:INTERNETBANKING"
    host_id = "urn:host:/SRV001"
    assert len(components) == 2
    assert_component(components, app_id)
    assert_component(components, host_id)
    assert len(relations) == 1
    assert_relation(relations, app_id, host_id)


def setup_test_instance() -> Dict[str, Any]:
    with open("src/data/conf.d/<%= _.snakeCase(agentCheckName)%>.d/conf.yaml.example") as f:
        config = yaml.load(f)
        instance_dict = config["instances"][0]
    return instance_dict


def assert_component(components: List[dict], cid: str) -> Dict[str, Any]:
    component = next(iter(filter(lambda item: (item["id"] == cid), components)), None)
    assert component is not None
    return component


def assert_relation(relations: List[dict], sid: str, tid: str) -> Dict[str, Any]:
    relation = next(
        iter(
            filter(
                # fmt: off
                lambda item: item["source_id"] == sid and item["target_id"] == tid,
                # fmt: on
                relations,
            )
        ),
        None,
    )
    assert relation is not None
    return relation
