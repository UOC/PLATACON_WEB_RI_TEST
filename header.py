import os
import json
import decimal
import time
from itertools import groupby
from functools import reduce
from functools import wraps

import boto3

CORS_HEADERS = {
    'headers': {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': True
    }
}


def with_cors(f):
    """Adds CORS headers."""
    @wraps(f)
    def decorated(*args, **kwargs):
        dict_obj = f(*args, **kwargs)
        if 'headers' in dict_obj.keys():
            dict_obj['headers'].update(CORS_HEADERS['headers'])
        else:
            dict_obj.update(CORS_HEADERS)
        return dict_obj
    return decorated

__all__ = ["error_codes", "status", "get_env", "mk_resp", "DecimalEncoder",
           "composite", "count_by_status", "with_cors", "dummy_entry",
           "move_payload", "get_path", "updatable_functions", "mk_day", "handle_errors"]
