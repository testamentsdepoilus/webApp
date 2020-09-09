import argparse
import os
from elasticsearch import Elasticsearch
from getMetaData import get_meta_data
from teiToHtml import transcription, edition
import json
import sys

if __name__ == '__main__':
	# construct the argument parser and parse the arguments
	ap = argparse.ArgumentParser()
	ap.add_argument("-iD", "--data", required=True, help="input data files")
	ap.add_argument("-iPF", "--persFile", required=True,
					help="input pers file")
	ap.add_argument("-iPlF", "--placeFile", required=True,
					help="input place file")
	ap.add_argument("-iH", "--host", required=True, help="ES host name")
	ap.add_argument("-iX", "--index", required=True, help="ES index name")
	ap.add_argument("-iF", "--file", required=True, help="Input config file")
	args = vars(ap.parse_args())
	list_tei = []
	if os.path.isdir(args['data']):
		for filename in os.listdir(args['data']):
			if os.path.splitext(filename)[1] == ".xml":
				list_tei.append(os.path.join(args['data'], filename.strip()))
	else:
		will_files = args['data'].split()
		for filename in will_files:
			if os.path.splitext(filename)[1] == ".xml":
				list_tei.append(filename.strip())

	try:
		es = Elasticsearch(
				hosts=args['host']
			)
	except ConnectionError:
		print(json.dumps({"status": 500, "res": "Erreur : connexion au serveur a échoué !"}))
		sys.exit()

	for tei_file in list_tei:
		try:
			tei_transcription = transcription(tei_file, args['file'])
			tei_edition = edition(tei_file, args['file'].strip())

			doc = get_meta_data(
				tei_file, args['persFile'], args['placeFile'], tei_transcription, tei_edition)

			res = es.index(index=args['index'],
						   doc_type='_doc', id=doc['will_id'], body=doc)
		except AttributeError:
			print(json.dumps({"status": 400, "type": "AttributeError", "res": tei_file}))
			sys.exit()
		except ConnectionError:
			print(json.dumps({"status": 500, "res": "ES connexion error"}))
			sys.exit()
		except:
			print(json.dumps({"status": 500, "res": "Error script"}))
			sys.exit()

	print(json.dumps({"status": 200, "res": "Success !"}))
	sys.exit()


