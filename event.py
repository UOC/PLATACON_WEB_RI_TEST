import boto3
import os
import json
from header import with_cors

@with_cors
def search(event,context):
    client = boto3.client('cloudsearchdomain', endpoint_url=os.environ.get('CLOUDSEARCH_URL'))
    args= event['queryStringParameters']
    """GET FIELDS OF QUERY GIVEN IN EVENT"""
    idioma=args.get('idioma')
    term=args.get('s')
    centre=args.get('centre')
    sector=args.get('sector_productiu')
    """TRANSFORMING DATA TO BUILD QUERY"""
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

    existe = consulta.find('or')
    if (existe != -1):
        consulta += ")"

    consulta+=")"

    """SEARCHING IN CLOUDSEARCH"""

    response = client.search(
        query=consulta,
        queryParser='structured',
        size=100)
    ret={
        "statusCode":200,
        "body": json.dumps(response)
    }
    return ret







































