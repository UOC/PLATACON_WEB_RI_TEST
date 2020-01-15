import boto3
import json

def test(event,context):
    client = boto3.client('cloudsearchdomain', endpoint_url='https://search-webri-2dz3yckt2f5cjq7hcsbois6nw4.eu-west-1.cloudsearch.amazonaws.com')
    body=client.search(
        query="(and idioma: 'ca' sector: 'eLearning')",
        queryParser='lucene'
        )

    response ={
        "statusCode": 200,
        "body": json.dumps(body)
    }

    return response

def search(event,context):
    client = boto3.client('cloudsearchdomain', endpoint_url='https://search-webri-2dz3yckt2f5cjq7hcsbois6nw4.eu-west-1.cloudsearch.amazonaws.com')
    args= event['queryStringParameters']
    simple=args.get('simple')
    if simple:
        response = client.search(
        query= simple,
        queryParser='simple')
        ret={
        "statusCode":200,
        "body": json.dumps(response)}
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