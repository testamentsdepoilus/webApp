from getTestatorsData import get_meta_data
from elasticsearch import Elasticsearch
import argparse
import json

if __name__ == '__main__':
    # construct the argument parser and parse the arguments
    ap = argparse.ArgumentParser()
    ap.add_argument("-iD", "--data", required=True, help="input file")
    ap.add_argument("-iH", "--host", required=True, help="ES host name")
    ap.add_argument("-iX", "--index", required=True, help="ES index name")
    args = vars(ap.parse_args())

    try:
        es = Elasticsearch(
            hosts=args['host']
        )
    except ConnectionError:
        print(json.dumps({"status": 500, "res": "Erreur : connexion au serveur a échoué !"}))

    output = get_meta_data(args['data'])

    for doc in output:
        try:
            res = es.index(index=args['index'], doc_type='_doc', id=doc['id'], body=doc)
        except AttributeError:
            print(json.dumps({"status": 400, "res": args['data']}))
        except ConnectionError:
            print(json.dumps({"status": 500, "res": "Erreur : connexion au serveur a échoué !"}))
    print(json.dumps({"status": 200, "res": "Success !"}))