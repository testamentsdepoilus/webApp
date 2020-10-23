from bs4 import BeautifulSoup


def get_meta_data(file_tei):
	with open(file_tei, encoding='utf8') as fp:
		soup = BeautifulSoup(fp, "lxml-xml")
	output_ = []
	list_org = soup.find('listOrg')
	for org in list_org.find_all("org"):
		doc = dict()
		doc['id'] = org['xml:id'].split('-')[1]
		unit = org.find('orgName', type="proseForm")
		doc['unit'] = unit.string.strip()

		org_name = org.find('orgName', type="fullIndexEntryForm")

		elements = org_name.find_all('orgName')
		doc['country'] = elements[0].get_text().strip()
		doc['composante'] = elements[1].get_text().strip()
		doc['corps'] = elements[2].get_text().strip()

		num = org_name.find("num")
		if num is not None:
			doc['number'] = num.get_text().strip()

		output_.append(doc)

	return output_


if __name__ == "__main__":
	fileTei = "unites.xml"
	output = get_meta_data(fileTei)
	print(output[0])
