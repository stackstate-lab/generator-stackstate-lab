from logging import Logger
from typing import Any, Dict, List

import requests
from requests.adapters import HTTPAdapter
from requests.structures import CaseInsensitiveDict
from <%=basePkg%>.model.instance import <%=startCaseAgentCheckName%>Spec
from urllib3.util import Retry

CM_OBJECTS = ["device", "device-group"]


class <%=clientName%>(object):
    def __init__(self, spec: <%=startCaseAgentCheckName%>Spec, log: Logger):
        self.log = log
        self.spec = spec
        self.spec.url = spec.url if spec.url.endswith("/") else "%s/" % spec.url
        self._session = self._init_session(spec)

    def get(self, url, params) -> Dict[str, Any]:
        result = self._handle_failed_call(self._session.get(url, params=params)).json()
        return result

    def get_cm_object(
        self, object_type: str, expand_subcollections: bool = False, params: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        url = self.get_cm_type_url(object_type)
        return self._get_f5_object(url, expand_subcollections, params)

    def get_cm_object_stats(self, object_type: str, params: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """
        :param object_type: str Any object in the CM_OBJECTS list
        :param params: Dict[str, Any] Additional query paramaters
        :return: List[Dict[str, Any]] Returns the 'nestedstats' object with object name and partition
        """
        url = f"{self.get_cm_type_url(object_type)}/stats"
        return self._get_object_stats(params, url)

    def get_cm_type_url(self, object_type: str) -> str:
        if object_type not in CM_OBJECTS:
            raise Exception(f'Object type "{object_type}" is unknown.  Valid types are {CM_OBJECTS}')
        return f"{self.spec.url}mgmt/tm/cm/{object_type}"

    def _get_f5_object(self, url, expand_subcollections, params) -> Dict[str, Any]:
        if expand_subcollections:
            params = params if params is not None else {}
            params["expandSubcollections"] = "true"
        return self.get(url, params)

    def _get_object_stats(self, params, url) -> List[Dict[str, Any]]:
        response = self.get(url, params)
        result = []
        for key, stats in response["entries"].items():
            nested_stats = stats["nestedStats"]
            # https://localhost/mgmt/tm/cm/traffic-group/~Common~traffic-group-1:~Common~bigip1.local.net/stats
            name = key.split("/")[-2]
            if name.startswith("~"):
                parts = name[1:].split("~")
                nested_stats["partition"] = parts[0]
                name = parts[1].split(":")[0]
            nested_stats["name"] = name
            result.append(nested_stats)
        return result

    def _init_session(self, spec: <%=startCaseAgentCheckName%>Spec) -> requests.Session:
        retry = Retry(
            total=spec.max_request_retries,
            backoff_factor=spec.retry_backoff_seconds,
            status_forcelist=spec.retry_on_status,
        )
        session = requests.Session()
        session.verify = False
        session.headers = CaseInsensitiveDict(
            {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "cache-control": "no-cache",
            }
        )
        session.mount(spec.url, HTTPAdapter(max_retries=retry))
        self._setup_session_token(session, spec)
        return session

    def _setup_session_token(self, session: requests.Session, spec: <%=startCaseAgentCheckName%>Spec):
        url = f"{spec.url}mgmt/shared/authn/login"
        body = {"username": spec.username, "password": spec.password, "loginProviderName": "tmos"}
        result = self._handle_failed_call(session.post(url, json=body)).json()
        session.headers["X-F5-Auth-Token"] = result["token"]["token"]

    @staticmethod
    def _handle_failed_call(response: requests.Response) -> requests.Response:
        if not response.ok:
            msg = f"Failed to call [{response.url}]. Status code {response.status_code}. {response.text}"
            raise Exception(msg)
        return response
