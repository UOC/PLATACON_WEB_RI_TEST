import boto3
import json
from header import with_cors


@with_cors
def search(event,context):
    client = boto3.client('cloudsearchdomain', endpoint_url='https://search-webri-2dz3yckt2f5cjq7hcsbois6nw4.eu-west-1.cloudsearch.amazonaws.com')
    args= event['queryStringParameters']
    simple=args.get('s')
    if simple:
        response = client.search(
        query= simple,
        queryParser='simple')
        ret={
        "statusCode":200,
        "body": json.dumps(response)
        }
        return ret


    items=list(args.items())
    if len(items)==1:
        x=items[0][0]
        y=items[0][1]
        consulta="(%s: %s)"%(x,y)
        response = client.search(
            query= consulta,
            queryParser='lucene')
        ret={
            "statusCode":200,
            "body": json.dumps(response)}
        return ret

    if len(items)>1:
        consulta="(and"
        for i in items:
            x=i[0]
            y=i[1]
            consulta=consulta+" %s: %s"%(x,y)
        consulta=consulta+")"
        response = client.search(
            query=consulta,
            queryParser='lucene'
        )
        ret={
            "statusCode":200,
            "body": json.dumps(response)
            }
        return ret