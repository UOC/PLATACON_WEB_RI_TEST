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
    investigador=args.get('nom_investigador')
    """TRANSFORMING DATA TO BUILD QUERY"""
    if(centre!=None):
        centre=centre.split(',')
    if(sector!=None):
        sector=sector.split(',')
    if(investigador!=None):
        investigador=investigador.split(',')
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

    if investigador!=None:
        existe=consulta.find('or')
        if(existe== -1):
            consulta+="(or "
        for i in investigador:
            element=i
            consulta +="investigadors: '%s' "%element

    existe = consulta.find('or')
    if (existe != -1):
        consulta += ")"
    consulta += "( not content_type:'fitxa') (not content_type:'grup')"
    consulta+=")"

    """SEARCHING IN CLOUDSEARCH"""

    response = client.search(
        query=consulta,
        queryParser='structured',
        size=1000)
    ret={
        "statusCode":200,
        "body": json.dumps(response)
    }
    return ret







































