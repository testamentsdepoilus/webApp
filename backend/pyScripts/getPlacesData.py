from bs4 import BeautifulSoup
from bs4 import NavigableString


def get_meta_data(file_tei):
	with open(file_tei, encoding='utf8') as fp:
		soup = BeautifulSoup(fp, "lxml-xml")
	output = []
	list_pers = soup.find('listPlace')
	for place in list_pers.find_all("place"):
		doc = dict()
		doc['id'] = place['xml:id'].split('-')[1]
		doc['city'] = place.settlement.string.strip()

		for location in place.find_all('location'):
			if location.region is not None:
				doc['region'] = location.region.string.strip()
			if location.country is not None:
				doc['country'] = location.country.string.strip()
			if location.geo is not None:
				geo_point = location.geo.string.split('+')
				doc['geo'] = {"lat": geo_point[0], "lon": geo_point[1]}

		if place.idno is not None and 'type' in place.idno.attrs:
			doc['geo_ref'] = place.idno.string.strip()
		output.append(doc)

	return output


if __name__ == "__main__":
	fileTei = "/home/adoula/myProjects/testaments_de_poilus/data/notices_wills/contextualEntity_place_2019-11-06_03-28-52.xml"
	output = get_meta_data(fileTei)
	print(output[0])