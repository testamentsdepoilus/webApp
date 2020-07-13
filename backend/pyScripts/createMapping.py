import json
from elasticsearch import Elasticsearch
import argparse

if __name__ == '__main__':
    # construct the argument parser and parse the arguments
    ap = argparse.ArgumentParser()
    ap.add_argument("-iF", "--file", required=True, help="input mapping config file")
    ap.add_argument("-iH", "--host", required=True, help="ES host name")
    ap.add_argument("-iX", "--index", required=True, help="ES index name")
    args = vars(ap.parse_args())

    with open(args["file"]) as f:
        d = json.load(f)

    try:
        es = Elasticsearch(
                hosts=args['host']
            )
        res = es.indices.create(index=args["index"], body=d, ignore=400)

        if 'status' in res and res['status'] == 400:
            #res = es.indices.put_mapping(index=args["index"], doc_type='_doc', body=d['mappings'], include_type_name=True)
            print(json.dumps({"status": 400, "err": "l'index <"+args["index"]+"> exist dans la base ES !"}))
        elif 'acknowledged' in res:
            print(json.dumps({"status": 200, "res": "Success"}))
    except ConnectionError:
        print(json.dumps({"status": 400, "err": "Problème de connexion au serveur ES !"}))
