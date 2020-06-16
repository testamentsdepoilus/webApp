from getMilitaryUnits import get_meta_data
from elasticsearch import Elasticsearch
import argparse

if __name__ == '__main__':
    # construct the argument parser and parse the arguments
    ap = argparse.ArgumentParser()
    ap.add_argument("-iD", "--data", required=True, help="input file")
    ap.add_argument("-iH", "--host", required=True, help="ES host name")
    ap.add_argument("-iX", "--index", required=True, help="ES index name")
    args = vars(ap.parse_args())

    es = Elasticsearch(
        hosts=args['host']
    )

    output = get_meta_data(args['data'])

    for doc in output:
        res = es.index(index=args['index'], doc_type='_doc', id=doc['id'], body=doc)
        print(res['result'])
