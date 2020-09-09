from bs4 import BeautifulSoup
from bs4 import NavigableString


def get_meta_data(file_tei):
	with open(file_tei, encoding='utf8') as fp:
		soup = BeautifulSoup(fp, "lxml-xml")
	output = []
	list_pers = soup.find('listPerson')
	for pers in list_pers.find_all("person"):
		doc = dict()
		doc['id'] = pers['xml:id'].split('-')[1]
		pers_name = pers.find("persName", type="fullProseForm")
		doc['persName.fullProseForm'] = pers_name.string
		doc['persName.fullIndexEntryForm.surname'] = []
		doc['persName.fullIndexEntryForm.forename'] = []
		pers_name = pers.find("persName", type="fullIndexEntryForm")
		doc['persName.norm'] = ""
		for surname in pers_name.find_all('surname'):
			doc['persName.fullIndexEntryForm.surname'].append(surname.string)
			doc['persName.norm'] += surname.string.replace(" ", "").split("[")[0]

		doc['persName.norm'] += "+"
		for forename in pers_name.find_all('forename'):
			if forename.string is not None:
				doc['persName.fullIndexEntryForm.forename'].append(forename.string)
				doc['persName.norm'] += forename.string + ' '

		doc['persName.norm'] = doc['persName.norm'].lower()
		birth = pers.birth
		doc['birth.date_text'] = birth.next_element.string
		doc['birth.date'] = []
		for date in birth.find_all('date'):
			if date.string is not None:
				doc['birth.date_text'] += date.string
			if date.next_sibling is not None:
				doc['birth.date_text'] += date.next_sibling
			if 'when' in date.attrs and len(date['when']) > 0:
				if "[" in date['when']:
					doc['birth.date'].append(
						{"gte": date['when'].split("[")[0].strip(), "lte": date['when'].split("[")[0].strip()})
				else:
					doc['birth.date'].append(
						{"gte": date['when'].strip(), "lte": date['when'].strip()})
			elif 'notAfter' in date.attrs and 'notBefore' in date.attrs:
				date_notBefore = date['notBefore']
				date_notAfter = date['notAfter']
				if "[" in date_notBefore:
					date_notBefore = date_notBefore.split("[")[0].strip()
				if "[" in date_notAfter:
					date_notAfter = date_notAfter.split("[")[0].strip()
				doc['birth.date'].append({"gte": date_notBefore.strip(), "lte": date_notAfter.strip()})
		birth_place = birth.placeName
		if birth_place is not None and 'ref' in birth_place.attrs:
			doc['birth.place.ref'] = birth_place['ref'].split('#')[1].split('-')[1].strip()
			doc['birth.place.name'] = birth_place.string.split('[')[0]

		death = pers.death
		doc['death.date_text'] = death.next_element.string
		doc['death.date'] = []
		for date in death.find_all('date'):
			doc['death.date_text'] += date.string
			if date.next_sibling is not None:
				doc['death.date_text'] += date.next_sibling
			if 'when' in date.attrs and len(date['when']) > 0:
				if "[" in date['when']:
					doc['death.date'].append(
						{"gte": date['when'].split("[")[0].strip(), "lte": date['when'].split("[")[0].strip()})
				else:
					doc['death.date'].append(
						{"gte": date['when'].strip(), "lte": date['when'].strip()})
			elif 'notAfter' in date.attrs and 'notBefore' in date.attrs:
				date_notBefore = date['notBefore']
				date_notAfter = date['notAfter']
				if "[" in date_notBefore:
					date_notBefore = date_notBefore.split("[")[0].strip()
				if "[" in date_notAfter:
					date_notAfter = date_notAfter.split("[")[0].strip()
				doc['death.date'].append({"gte": date_notBefore.strip(), "lte": date_notAfter.strip()})

		death_place = death.placeName
		if death_place is not None and 'ref' in death_place.attrs:
			doc['death.place.ref'] = death_place['ref'].split('#')[1].split('-')[1].strip()
			doc['death.place.name'] = death_place.string.split('[')[0]

		affiliation = pers.affiliation
		if affiliation is not None:
			if isinstance(affiliation.next_element, NavigableString):
				doc['affiliation.name'] = affiliation.next_element
			org_name = affiliation.find('orgName')
			if org_name is not None:
				doc['affiliation.orgName'] = org_name.get_text().strip()
				#doc['affiliation.orgName'] = doc['affiliation.orgName'].lower()
				#doc['affiliation.orgName'] = doc['affiliation.orgName'].replace("’", "'")
				if 'ref' in org_name.attrs:
					doc['affiliation.ref'] = org_name['ref'].split('#')[1].split('-')[1].strip()

		bibl = pers.bibl
		if bibl is not None:
			doc['bibl.author'] = bibl.author.string.strip()
			doc['bibl.title'] = bibl.title.string.strip()
			doc['bibl.type'] = bibl['type'].strip()
			doc['bibl.uri'] = bibl.ref.string.strip()

		doc['occupation'] = []
		for occupation in pers.find_all("occupation"):
			if occupation.string is not None:
				doc['occupation'].append(occupation.string)

		residence = pers.residence
		if residence is not None:
			if 'ref' in residence.attrs:
				doc['residence.ref'] = residence['ref'].split('#')[1].split('-')[1].strip()
			doc['residence.name'] = residence.string.strip()

		doc['note_history'] = []
		if pers.note is not None:
			if 'type' in pers.note.attrs and pers.note["type"] == "history":
				list_note = pers.note.find_all("p")
				if len(list_note) > 0:
					for element_p in list_note:
						doc['note_history'].append(element_p.string.strip())

		figure = pers.figure
		if figure is not None:
			doc['figure'] = figure.graphic['url'].strip()

		output.append(doc)

	return output


if __name__ == "__main__":
	fileTei = "../client/build/files/notices/persons.xml"
	output = get_meta_data(fileTei)

	for pers in output:
		# print(pers['id'] + ": " + pers["birth.date_text"])
		if pers['id'] == '410':
			print( pers["note_history"])
