import boto3
import json
from header import with_cors

@with_cors
def test(event,context):
    client = boto3.client('cloudsearchdomain', endpoint_url='https://search-webri-2dz3yckt2f5cjq7hcsbois6nw4.eu-west-1.cloudsearch.amazonaws.com')
    body=client.search(
        query="(and field=* 'servei' idioma: 'ca')",
        queryParser='lucene'
        )
    response ={
        "statusCode": 200,
        "body": json.dumps(body)
    }

    return response

@with_cors
def search(event,context):
    client = boto3.client('cloudsearchdomain', endpoint_url='https://search-webri-2dz3yckt2f5cjq7hcsbois6nw4.eu-west-1.cloudsearch.amazonaws.com')
    args= event['queryStringParameters']
    """GET FIELDS OF QUERY GIVEN IN EVENT"""
    idioma=args.get('idioma')
    term=args.get('s')
    visualitzacio=args.get('visualitzacio')
    centre=args.get('centre')
    sector=args.get('sector_productiu')
    """TRANSFORMING DATA TO BUILD QUERY"""
    if(visualitzacio!=None):
        visualitzacio=visualitzacio.split(',')
    if(centre!=None):
        centre=centre.split(',')
    if(sector!=None):
        sector=sector.split(',')
    consulta="(and idioma:'%s' "%(idioma)

    """BUILDING QUERY"""
    if term==None:
        consulta+="(term ' ') "
    else:
        consulta+="(term '%s') "%(term)
    if sector!=None:
        consulta+="(or "
        for i in sector:
            element=i
            consulta +="sector: '%s' "%element

    print(consulta)
    if centre!=None:
        existe=consulta.find('or')
        if(existe== -1):
            consulta+="(or "
        for i in centre:
            element=i
            consulta +="centre: '%s' "%element
    if visualitzacio!=None:
        existe=consulta.find('or')
        if(existe==-1):
            consulta += "(or "
        for i in visualitzacio:
            element = i
            consulta += "content_type: '%s' " % element

    existe = consulta.find('or')
    if (existe != -1):
        consulta += ")"

    consulta+=")"

    """SEARCHING IN CLOUDSEARCH"""

    response = client.search(
        query=consulta,
        queryParser='structured')
    ret={
        "statusCode":200,
        "body": json.dumps(response)
    }
    return ret







































